// AeroRescue 737 AI - Main Application Controller

import { calculateFlightCapabilities, EMERGENCY_SCENARIOS } from "./b737Engine.js";
import { generateSurroundingAirTraffic, resetTrafficSession, LANDING_SITES } from "./airTrafficSim.js";
import { evaluateLandingSites, calculateDistanceNM, calculateBearing } from "./routeOptimizer.js";
import { QRH_PROCEDURES } from "./actionChecklist.js";
import { generateMaintenanceMatrix } from "./postLandingMaint.js";
import { AirspaceMapRenderer } from "./mapRenderer.js";
import { 
  AIRPORTS_DIRECTORY, 
  POPULAR_ROUTES, 
  getAirportByIcao, 
  generatePlannedRouteWaypoints, 
  computeFlightPositionAlongRoute,
  getAirspaceInfo
} from "./flightRouteManager.js";
import { updateWeatherHudUI } from "./enRouteWeather.js";
import { updateDamageModalUI, setDamageCategoryFilter } from "./aircraftDamageMro.js";
import { 
  getAirportAtcData, 
  checkRunwayAvailability, 
  clearLatestScheduledFlight, 
  generateAtcTacticalPlans,
  resetAirportAtcData 
} from "./airportAtcManager.js";

// Global App State
const state = {
  aircraft: {
    callsign: "HL-737EM",
    model: "Boeing 737-800",
    lat: 36.88,
    lng: 126.32,
    altitudeFt: 31000,
    groundSpeedKts: 240,
    fuelKg: 4800,
    windKts: -15, // 15kt headwind
    headingDeg: 185,
    sortCriteria: "safety" // Default: Safety score strictly descending
  },
  flightPlan: {
    originIcao: "RKSS", // Gimpo
    destIcao: "RKPC",   // Jeju
    progress: 0.45,     // 45% (En-route West Coast)
    plannedCruiseAltFt: 31000,
    activePresetId: "GMP_CJU",
    waypoints: []
  },
  emergencyKey: "dual_engine_flameout",
  activeRouteTag: "alpha", // Default 1st rank
  detailsVisible: false, // Tactical tabs card opens on clicking 1, 2, or 3 순위
  audioEnabled: false,
  evaluationResult: null,
  mapRenderer: null,
  showTraffic: true,
  trafficList: []
};

// Web Audio API Emergency Chime Synthesizer
let audioCtx = null;
function playEmergencyChime() {
  if (!state.audioEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    // Boeing Style Dual-Tone Warning Chime
    const now = audioCtx.currentTime;
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc1.type = "sine";
    osc2.type = "sine";

    // 800Hz & 1000Hz alternating chime
    osc1.frequency.setValueAtTime(880, now);
    osc1.frequency.setValueAtTime(660, now + 0.2);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc1.connect(gain);
    gain.connect(audioCtx.destination);

    osc1.start(now);
    osc1.stop(now + 0.5);
  } catch (e) {
    console.warn("Audio chime failed:", e);
  }
}

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Map
  state.mapRenderer = new AirspaceMapRenderer("airspaceMap");
  state.mapRenderer.init(36.00, 127.30, 7);

  // 2. Initialize Flight Route & Origin/Destination Controls
  initFlightRouteControls();

  // 3. Bind UI Events
  bindEventListeners();

  // 4. Start UTC Clock
  startUtcClock();

  // 5. Initial Route & Aircraft Position Setup & Render
  updateFlightRouteAndAircraft(true);

  // 6. Live Airborne Radar Traffic Engine Loop (Updates every 3 seconds)
  setInterval(() => {
    // Only update if not in a modal or dragging
    updateLiveAirborneTraffic();
  }, 3000);
});

function initFlightRouteControls() {
  const originSelect = document.getElementById("originAirportSelect");
  const destSelect = document.getElementById("destAirportSelect");
  const presetsContainer = document.getElementById("popularRoutesContainer");
  const progressSlider = document.getElementById("flightProgressSlider");
  const swapBtn = document.getElementById("swapAirportsBtn");

  if (!originSelect || !destSelect) return;

  // Populate airport select dropdowns
  originSelect.innerHTML = "";
  destSelect.innerHTML = "";

  AIRPORTS_DIRECTORY.forEach(apt => {
    const optOrig = document.createElement("option");
    optOrig.value = apt.icao;
    optOrig.textContent = `${apt.iata || apt.icao} - ${apt.name}`;
    if (apt.icao === state.flightPlan.originIcao) optOrig.selected = true;
    originSelect.appendChild(optOrig);

    const optDest = document.createElement("option");
    optDest.value = apt.icao;
    optDest.textContent = `${apt.iata || apt.icao} - ${apt.name}`;
    if (apt.icao === state.flightPlan.destIcao) optDest.selected = true;
    destSelect.appendChild(optDest);
  });

  // Render Popular Route Presets
  if (presetsContainer) {
    presetsContainer.innerHTML = "";
    POPULAR_ROUTES.forEach(preset => {
      const btn = document.createElement("button");
      btn.className = `route-preset-pill ${preset.id === state.flightPlan.activePresetId ? 'active' : ''}`;
      btn.dataset.id = preset.id;
      btn.textContent = preset.label;
      btn.title = preset.description;
      btn.addEventListener("click", () => {
        applyRoutePreset(preset.id);
      });
      presetsContainer.appendChild(btn);
    });
  }

  // Origin change listener
  originSelect.addEventListener("change", (e) => {
    state.flightPlan.originIcao = e.target.value;
    state.flightPlan.activePresetId = null;
    resetTrafficSession();
    updatePresetButtonsUI();
    updateFlightRouteAndAircraft(true);
  });

  // Dest change listener
  destSelect.addEventListener("change", (e) => {
    state.flightPlan.destIcao = e.target.value;
    state.flightPlan.activePresetId = null;
    resetTrafficSession();
    updatePresetButtonsUI();
    updateFlightRouteAndAircraft(true);
  });

  // Swap button
  if (swapBtn) {
    swapBtn.addEventListener("click", () => {
      const temp = state.flightPlan.originIcao;
      state.flightPlan.originIcao = state.flightPlan.destIcao;
      state.flightPlan.destIcao = temp;
      originSelect.value = state.flightPlan.originIcao;
      destSelect.value = state.flightPlan.destIcao;
      state.flightPlan.activePresetId = null;
      resetTrafficSession();
      updatePresetButtonsUI();
      updateFlightRouteAndAircraft(true);
    });
  }

  // Progress slider
  if (progressSlider) {
    progressSlider.addEventListener("input", (e) => {
      const val = parseInt(e.target.value);
      state.flightPlan.progress = val / 100;
      updateFlightRouteAndAircraft(false, true);
    });
  }

  // Map direct click repositioning listener
  state.mapRenderer.setOnMapClickListener((latlng) => {
    const orig = getAirportByIcao(state.flightPlan.originIcao);
    const dest = getAirportByIcao(state.flightPlan.destIcao);
    state.aircraft.lat = Number(latlng.lat.toFixed(4));
    state.aircraft.lng = Number(latlng.lng.toFixed(4));
    
    // Heading towards destination
    state.aircraft.headingDeg = Math.round(calculateBearing(state.aircraft.lat, state.aircraft.lng, dest.lat, dest.lng));
    
    // Recalculate progress approximately based on distance to dest
    const totalDist = calculateDistanceNM(orig.lat, orig.lng, dest.lat, dest.lng);
    const toDest = calculateDistanceNM(state.aircraft.lat, state.aircraft.lng, dest.lat, dest.lng);
    if (totalDist > 0) {
      state.flightPlan.progress = Math.max(0, Math.min(1, 1 - (toDest / totalDist)));
      if (progressSlider) progressSlider.value = Math.round(state.flightPlan.progress * 100);
    }

    updateRouteUIElements(orig, dest);
    recomputeAndRender();
  });
}

function applyRoutePreset(presetId) {
  const preset = POPULAR_ROUTES.find(p => p.id === presetId);
  if (!preset) return;

  state.flightPlan.originIcao = preset.originIcao;
  state.flightPlan.destIcao = preset.destIcao;
  state.flightPlan.activePresetId = preset.id;
  state.flightPlan.progress = preset.typicalProgress;
  state.flightPlan.plannedCruiseAltFt = preset.plannedCruiseAltFt || 31000;
  state.aircraft.altitudeFt = preset.plannedCruiseAltFt;

  const originSelect = document.getElementById("originAirportSelect");
  const destSelect = document.getElementById("destAirportSelect");
  const progressSlider = document.getElementById("flightProgressSlider");
  const altSlider = document.getElementById("altSlider");
  const inputAlt = document.getElementById("inputAlt");

  if (originSelect) originSelect.value = preset.originIcao;
  if (destSelect) destSelect.value = preset.destIcao;
  if (progressSlider) progressSlider.value = Math.round(preset.typicalProgress * 100);
  if (altSlider) altSlider.value = preset.plannedCruiseAltFt;
  if (inputAlt) inputAlt.value = preset.plannedCruiseAltFt;

  resetTrafficSession();
  updatePresetButtonsUI();
  updateFlightRouteAndAircraft(true);
}

function updatePresetButtonsUI() {
  document.querySelectorAll(".route-preset-pill").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.id === state.flightPlan.activePresetId);
  });
}

function updateWindLabel(val) {
  const windTag = document.getElementById("windUnitTag");
  if (!windTag) return;
  if (val < 0) {
    windTag.textContent = `KT (${Math.abs(val)}KT 맞바람)`;
  } else if (val > 0) {
    windTag.textContent = `KT (${val}KT 뒷바람)`;
  } else {
    windTag.textContent = `KT (무풍 Calm)`;
  }
}

function syncFlightControlsUI() {
  const altSlider = document.getElementById("altSlider");
  const inputAlt = document.getElementById("inputAlt");
  const speedSlider = document.getElementById("speedSlider");
  const inputSpeed = document.getElementById("inputSpeed");
  const fuelSlider = document.getElementById("fuelSlider");
  const inputFuel = document.getElementById("inputFuel");
  const windSlider = document.getElementById("windSlider");
  const inputWind = document.getElementById("inputWind");

  if (altSlider) altSlider.value = state.aircraft.altitudeFt;
  if (inputAlt) inputAlt.value = state.aircraft.altitudeFt;
  if (speedSlider) speedSlider.value = state.aircraft.groundSpeedKts;
  if (inputSpeed) inputSpeed.value = state.aircraft.groundSpeedKts;
  if (fuelSlider) fuelSlider.value = state.aircraft.fuelKg;
  if (inputFuel) inputFuel.value = state.aircraft.fuelKg;
  if (windSlider) windSlider.value = state.aircraft.windKts;
  if (inputWind) inputWind.value = state.aircraft.windKts;
  updateWindLabel(state.aircraft.windKts);
}

function updateFlightRouteAndAircraft(shouldFitBounds = false, updateTelemetryFromProfile = false) {
  const orig = getAirportByIcao(state.flightPlan.originIcao);
  const dest = getAirportByIcao(state.flightPlan.destIcao);

  // Generate waypoints along planned route
  state.flightPlan.waypoints = generatePlannedRouteWaypoints(orig, dest, 24);

  // Compute position along route using planned cruising altitude ceiling
  const plannedCruise = state.flightPlan.plannedCruiseAltFt || 31000;
  const posData = computeFlightPositionAlongRoute(orig, dest, state.flightPlan.progress, plannedCruise);
  state.aircraft.lat = posData.lat;
  state.aircraft.lng = posData.lng;
  state.aircraft.headingDeg = posData.headingDeg;
  if (typeof posData.suggestedWindDirDeg === 'number') state.aircraft.windDirDeg = posData.suggestedWindDirDeg;
  if (typeof posData.suggestedWindSpeedKts === 'number') state.aircraft.windSpeedKts = posData.suggestedWindSpeedKts;

  if (updateTelemetryFromProfile) {
    if (typeof posData.suggestedAltFt === 'number') state.aircraft.altitudeFt = posData.suggestedAltFt;
    if (typeof posData.suggestedFuelKg === 'number') state.aircraft.fuelKg = posData.suggestedFuelKg;
    if (typeof posData.suggestedSpeedKts === 'number') state.aircraft.groundSpeedKts = posData.suggestedSpeedKts;
    if (typeof posData.suggestedWindKts === 'number') state.aircraft.windKts = posData.suggestedWindKts;
    syncFlightControlsUI();
  }

  // Update planned route line and airport markers on map
  state.mapRenderer.updatePlannedRoute(orig, dest, state.flightPlan.waypoints);
  if (shouldFitBounds) {
    state.mapRenderer.fitRouteBounds(orig, dest);
  }

  // Update Route UI Indicators
  updateRouteUIElements(orig, dest, posData);

  // Re-evaluate and re-render everything
  recomputeAndRender();
}

function updateRouteUIElements(orig, dest, posData = null) {
  if (!posData) {
    const plannedCruise = state.flightPlan.plannedCruiseAltFt || 31000;
    posData = computeFlightPositionAlongRoute(orig, dest, state.flightPlan.progress, plannedCruise);
  }

  const headerRouteVal = document.getElementById("headerRouteVal");
  if (headerRouteVal) headerRouteVal.textContent = `${orig.iata || orig.icao} ➔ ${dest.iata || dest.icao}`;

  const originCodeLabel = document.getElementById("originCodeLabel");
  if (originCodeLabel) originCodeLabel.textContent = orig.iata || orig.icao;

  const destCodeLabel = document.getElementById("destCodeLabel");
  if (destCodeLabel) destCodeLabel.textContent = dest.iata || dest.icao;

  const flightPhaseBadge = document.getElementById("flightPhaseBadge");
  if (flightPhaseBadge) flightPhaseBadge.textContent = posData.flightPhase;

  const progressPercentBadge = document.getElementById("progressPercentBadge");
  if (progressPercentBadge) {
    progressPercentBadge.textContent = `${posData.progressPercent}% (${posData.flightPhase} ${posData.distFromOriginNM} NM)`;
  }

  const totalRouteDistVal = document.getElementById("totalRouteDistVal");
  if (totalRouteDistVal) totalRouteDistVal.textContent = `${posData.totalDistanceNM} NM`;

  const routeHeadingVal = document.getElementById("routeHeadingVal");
  if (routeHeadingVal) routeHeadingVal.textContent = `${posData.headingDeg}°`;

  const remainDistVal = document.getElementById("remainDistVal");
  if (remainDistVal) remainDistVal.textContent = `${posData.distToDestNM} NM`;
}

function bindEventListeners() {
  // Emergency scenario select
  const scenarioSelect = document.getElementById("emergencyScenarioSelect");
  scenarioSelect.addEventListener("change", (e) => {
    state.emergencyKey = e.target.value;
    resetTrafficSession();
    const scen = EMERGENCY_SCENARIOS[state.emergencyKey];

    // Adapt flight parameters dynamically based on emergency type
    if (state.emergencyKey === "cargo_fire") {
      state.aircraft.groundSpeedKts = 320;
      state.aircraft.altitudeFt = 24000;
      state.activeRouteTag = "charlie"; // Fire prioritizes fastest touchdown!
    } else if (state.emergencyKey === "hydraulic_total_loss") {
      state.aircraft.groundSpeedKts = 220;
      state.aircraft.altitudeFt = 26000;
      state.activeRouteTag = "alpha"; // Hydraulic loss strictly prioritizes longest runway (Incheon)!
    } else if (state.emergencyKey === "rapid_depressurization") {
      state.aircraft.altitudeFt = 10000; // Leveled off at 10,000ft after emergency descent
      state.aircraft.groundSpeedKts = 280;
      state.activeRouteTag = "bravo";
    } else if (state.emergencyKey === "dual_engine_flameout") {
      state.aircraft.groundSpeedKts = 215;
      state.aircraft.altitudeFt = 30000;
      state.activeRouteTag = "bravo";
    } else if (state.emergencyKey === "single_engine_failure") {
      state.aircraft.groundSpeedKts = 290;
      state.aircraft.altitudeFt = 21000; // Drift-down single engine ceiling
      state.activeRouteTag = "bravo";
    }

    // Sync sliders & numeric inputs UI
    syncFlightControlsUI();

    playEmergencyChime();
    recomputeAndRender();
  });

  // Controls elements (Sliders & Direct Numeric Inputs)
  const altSlider = document.getElementById("altSlider");
  const inputAlt = document.getElementById("inputAlt");
  const speedSlider = document.getElementById("speedSlider");
  const inputSpeed = document.getElementById("inputSpeed");
  const fuelSlider = document.getElementById("fuelSlider");
  const inputFuel = document.getElementById("inputFuel");
  const windSlider = document.getElementById("windSlider");
  const inputWind = document.getElementById("inputWind");

  function updateWindLabel(val) {
    const windTag = document.getElementById("windUnitTag");
    if (val < 0) {
      windTag.textContent = `KT (${Math.abs(val)}KT 맞바람)`;
    } else if (val > 0) {
      windTag.textContent = `KT (${val}KT 뒷바람)`;
    } else {
      windTag.textContent = `KT (무풍 Calm)`;
    }
  }

  // 1. Altitude Two-way binding
  altSlider.addEventListener("input", (e) => {
    state.aircraft.altitudeFt = parseInt(e.target.value);
    inputAlt.value = state.aircraft.altitudeFt;
    if (state.aircraft.altitudeFt >= 15000) state.flightPlan.plannedCruiseAltFt = state.aircraft.altitudeFt;
    recomputeAndRender();
  });
  inputAlt.addEventListener("input", (e) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) return;
    val = Math.max(0, Math.min(41000, val));
    state.aircraft.altitudeFt = val;
    altSlider.value = Math.max(0, Math.min(41000, val));
    if (val >= 15000) state.flightPlan.plannedCruiseAltFt = val;
    recomputeAndRender();
  });

  // 2. Airspeed Two-way binding
  speedSlider.addEventListener("input", (e) => {
    state.aircraft.groundSpeedKts = parseInt(e.target.value);
    inputSpeed.value = state.aircraft.groundSpeedKts;
    recomputeAndRender();
  });
  inputSpeed.addEventListener("input", (e) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) return;
    val = Math.max(120, Math.min(500, val));
    state.aircraft.groundSpeedKts = val;
    speedSlider.value = Math.max(150, Math.min(420, val));
    recomputeAndRender();
  });

  // 3. Fuel Two-way binding
  fuelSlider.addEventListener("input", (e) => {
    state.aircraft.fuelKg = parseInt(e.target.value);
    inputFuel.value = state.aircraft.fuelKg;
    recomputeAndRender();
  });
  inputFuel.addEventListener("input", (e) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) return;
    val = Math.max(500, Math.min(26000, val));
    state.aircraft.fuelKg = val;
    fuelSlider.value = Math.max(800, Math.min(18000, val));
    recomputeAndRender();
  });

  // 4. Wind Two-way binding
  windSlider.addEventListener("input", (e) => {
    const val = parseInt(e.target.value);
    state.aircraft.windKts = val;
    inputWind.value = val;
    updateWindLabel(val);
    recomputeAndRender();
  });
  inputWind.addEventListener("input", (e) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) return;
    val = Math.max(-60, Math.min(60, val));
    state.aircraft.windKts = val;
    windSlider.value = Math.max(-30, Math.min(30, val));
    updateWindLabel(val);
    recomputeAndRender();
  });

  // Sound toggle button (if present)
  const soundBtn = document.getElementById("soundToggleBtn");
  if (soundBtn) {
    soundBtn.addEventListener("click", () => {
      state.audioEnabled = !state.audioEnabled;
      soundBtn.classList.toggle("muted", !state.audioEnabled);
      soundBtn.innerHTML = state.audioEnabled 
        ? '<i class="fa-solid fa-volume-high"></i>' 
        : '<i class="fa-solid fa-volume-xmark"></i>';
      if (state.audioEnabled) playEmergencyChime();
    });
  }

  // Master Warning click (if present)
  const masterWarningBtn = document.getElementById("masterWarningBtn");
  if (masterWarningBtn) {
    masterWarningBtn.addEventListener("click", () => {
      playEmergencyChime();
    });
  }

  // Tab switching helper
  window.switchTab = (tabId) => {
    const tabBtns = document.querySelectorAll(".card-tabs .tab-btn");
    tabBtns.forEach(b => {
      b.classList.toggle("active", b.dataset.tab === tabId);
    });
    document.querySelectorAll(".tab-pane").forEach(p => {
      p.classList.toggle("active", p.id === tabId);
    });
  };

  const tabBtns = document.querySelectorAll(".card-tabs .tab-btn");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      window.switchTab(btn.dataset.tab);
    });
  });

  // Ranking Criteria Mode Switcher
  const rankModeBtns = document.querySelectorAll(".rank-mode-btn");
  rankModeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      rankModeBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.aircraft.sortCriteria = btn.dataset.mode;
      playEmergencyChime();
      recomputeAndRender();
    });
  });

  // Global helper for popup selection
  window.selectEmergencyRoute = (siteId) => {
    // Check if matches any of top routes
    const recs = state.evaluationResult.topRecommendations;
    if (recs.alpha.data.site.id === siteId) {
      selectRoute("alpha");
    } else if (recs.bravo.data.site.id === siteId) {
      selectRoute("bravo");
    } else if (recs.charlie.data.site.id === siteId) {
      selectRoute("charlie");
    } else {
      // Create custom target
      const match = state.evaluationResult.allEvaluated.find(i => i.site.id === siteId);
      if (match) {
        recs.bravo.data = match;
        selectRoute("bravo");
      }
    }
  };

  // Weather HUD popup minimize / expand controls
  const toggleWxBtn = document.getElementById("toggleWeatherHudBtn");
  const expandWxBtn = document.getElementById("expandWeatherHudBtn");
  const wxPopup = document.getElementById("weatherHudPopup");
  const wxBody = document.getElementById("weatherHudBody");
  const wxHeader = document.querySelector(".weather-hud-header");
  const wxMini = document.getElementById("weatherHudMini");

  if (toggleWxBtn && wxPopup) {
    toggleWxBtn.addEventListener("click", () => {
      wxBody.style.display = "none";
      if (wxHeader) wxHeader.style.display = "none";
      if (wxMini) wxMini.style.display = "flex";
      wxPopup.classList.add("minimized");
    });
  }

  if (expandWxBtn && wxPopup) {
    expandWxBtn.addEventListener("click", () => {
      wxBody.style.display = "block";
      if (wxHeader) wxHeader.style.display = "flex";
      if (wxMini) wxMini.style.display = "none";
      wxPopup.classList.remove("minimized");
    });
  }

  // Aircraft Damage & Parts Diagnosis Modal Controls
  const openDmgBtn = document.getElementById("openDamageModalBtn");
  const closeDmgBtn = document.getElementById("closeDamageModalBtn");
  const closeDmgBtn2 = document.getElementById("closeDamageModalBtn2");
  const dmgModal = document.getElementById("aircraftDamageModal");

  function openDamageModal() {
    if (!dmgModal) return;
    updateDamageModalUI(state.emergencyKey);
    dmgModal.style.display = "flex";
  }

  function closeDamageModal() {
    if (!dmgModal) return;
    dmgModal.style.display = "none";
  }

  if (openDmgBtn) openDmgBtn.addEventListener("click", openDamageModal);
  if (closeDmgBtn) closeDmgBtn.addEventListener("click", closeDamageModal);
  if (closeDmgBtn2) closeDmgBtn2.addEventListener("click", closeDamageModal);
  if (dmgModal) {
    dmgModal.addEventListener("click", (e) => {
      if (e.target === dmgModal) closeDamageModal();
    });
  }

  // Damage & Subsystems Category Filter Tabs
  const dmgFilterBtns = document.querySelectorAll(".dmg-filter-pill");
  dmgFilterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      dmgFilterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      setDamageCategoryFilter(btn.dataset.cat);
      updateDamageModalUI(state.emergencyKey);
    });
  });

  // ===================================================
  // Real-Time Airport Schedule & ATC Modal Controller
  // ===================================================
  const openAtcBtn = document.getElementById("openAtcModalBtn");
  const closeAtcBtn = document.getElementById("closeAtcModalBtn");
  const closeAtcBtn2 = document.getElementById("closeAtcModalBtn2");
  const atcModal = document.getElementById("airportAtcModal");
  let currentAtcAirport = "RKSS"; // Default: Gimpo
  let lastClearanceResult = null;
  const atcLogs = [
    { time: "15:10:20", text: "INCHEON ACC: 모든 접근 관제 레이더 정상 가동 확인." },
    { time: "15:12:05", text: "TOWER 118.1: 기상 악화 및 비상 착륙 요청 대비 관제 대기령 수신." }
  ];

  function openAtcModal() {
    if (!atcModal) return;
    // Auto-select origin airport or recommended landing site if available
    if (state.flightPlan?.originIcao && ["RKSI", "RKSS", "RKPC", "RKPK", "RKTU", "RKTN"].includes(state.flightPlan.originIcao)) {
      currentAtcAirport = state.flightPlan.originIcao;
    }
    renderAtcModalUI(currentAtcAirport);
    atcModal.style.display = "flex";
  }

  function closeAtcModal() {
    if (!atcModal) return;
    atcModal.style.display = "none";
  }

  if (openAtcBtn) openAtcBtn.addEventListener("click", openAtcModal);
  if (closeAtcBtn) closeAtcBtn.addEventListener("click", closeAtcModal);
  if (closeAtcBtn2) closeAtcBtn2.addEventListener("click", closeAtcModal);
  if (atcModal) {
    atcModal.addEventListener("click", (e) => {
      if (e.target === atcModal) closeAtcModal();
    });
  }

  // Airport Tab Switching Pills
  const atcAirportPills = document.querySelectorAll(".atc-apt-pill");
  atcAirportPills.forEach(pill => {
    pill.addEventListener("click", () => {
      atcAirportPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      currentAtcAirport = pill.dataset.apt;
      lastClearanceResult = null; // Reset clearance on airport switch
      renderAtcModalUI(currentAtcAirport);
    });
  });

  // Emergency Runway Clearance Button Handler
  const btnClearance = document.getElementById("btnExecuteRunwayClearance");
  if (btnClearance) {
    btnClearance.addEventListener("click", () => {
      const clearance = clearLatestScheduledFlight(currentAtcAirport, state.aircraft.callsign || "HL-737EM");
      lastClearanceResult = clearance;

      // Add log
      atcLogs.unshift({
        time: new Date().toLocaleTimeString('ko-KR', { hour12: false }),
        text: clearance.message,
        urgent: true
      });

      renderAtcModalUI(currentAtcAirport);
    });
  }

  function renderAtcModalUI(airportId) {
    const data = getAirportAtcData(airportId);
    const avail = checkRunwayAvailability(airportId);

    // 1. Header Title & Pills
    const titleEl = document.getElementById("atcSelectedAirportTitle");
    if (titleEl) titleEl.textContent = `${data.name} 활주로 실시간 점유 현황`;

    const clockEl = document.getElementById("atcModalClock");
    if (clockEl) {
      clockEl.textContent = `KST ${new Date().toLocaleTimeString('ko-KR', { hour12: false })}`;
    }

    // 2. Runway Availability Pill
    const availPill = document.getElementById("atcRunwayAvailPill");
    const availText = document.getElementById("atcAvailSummaryText");
    if (availPill && availText) {
      if (avail.hasAvailable) {
        availPill.className = "runway-avail-pill good";
        availPill.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>여유 활주로 ${avail.availableCount}개 즉시 사용 가능</span>`;
      } else {
        const reservedCount = avail.reservedRunways.length;
        if (reservedCount > 0) {
          availPill.className = "runway-avail-pill good";
          availPill.innerHTML = `<i class="fa-solid fa-shield-check"></i> <span>비상 활주로 ${reservedCount}개 단독 확보 완료</span>`;
        } else {
          availPill.className = "runway-avail-pill danger";
          availPill.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <span>여유 활주로 없음 (전체 점유 중 - 퇴거 관제 필요)</span>`;
        }
      }
    }

    // 3. Runway Strips List
    const stripsList = document.getElementById("atcRunwayStripsList");
    if (stripsList) {
      // Find latest scheduled flight among occupied
      let maxMins = -1;
      let latestFlightNum = null;
      data.runways.forEach(r => {
        if (r.status === "OCCUPIED" && r.occupiedBy) {
          const [h, m] = r.occupiedBy.scheduledTime.split(":").map(Number);
          const mins = (h || 0) * 60 + (m || 0);
          if (mins > maxMins) {
            maxMins = mins;
            latestFlightNum = r.occupiedBy.flightNumber;
          }
        }
      });

      stripsList.innerHTML = data.runways.map(rwy => {
        let statusBadge = "";
        let statusClass = "";

        if (rwy.status === "OCCUPIED") {
          statusClass = "status-occupied";
          statusBadge = `<span class="rwy-status-badge occupied"><i class="fa-solid fa-plane"></i> 활주로 점유 중</span>`;
        } else if (rwy.status === "AVAILABLE") {
          statusClass = "status-available";
          statusBadge = `<span class="rwy-status-badge available"><i class="fa-solid fa-check"></i> 여유 활주로 (즉시 착륙 가능)</span>`;
        } else if (rwy.status === "EMERGENCY_RESERVED") {
          statusClass = "status-reserved";
          statusBadge = `<span class="rwy-status-badge reserved"><i class="fa-solid fa-shield-halved"></i> 비상기 단독 확보 (RESERVED)</span>`;
        }

        let occupantHtml = "";
        if (rwy.occupiedBy) {
          const isLatest = rwy.occupiedBy.flightNumber === latestFlightNum;
          occupantHtml = `
            <div class="rwy-plane-info">
              <div class="plane-main">
                <div class="plane-callsign-row">
                  <strong class="plane-fn">${rwy.occupiedBy.flightNumber}</strong>
                  <span class="plane-actype">${rwy.occupiedBy.aircraft}</span>
                  <span class="text-muted">(${rwy.occupiedBy.origin} ➔ ${rwy.occupiedBy.dest})</span>
                </div>
                <div class="plane-phase">
                  <i class="fa-solid fa-gauge-high text-amber"></i> ${rwy.occupiedBy.phaseDesc}
                </div>
              </div>
              <div class="plane-sched-time">
                <span class="sched-lbl">비행 예정 시각</span>
                <span class="sched-val ${isLatest ? 'highlight-latest' : ''}">
                  ${rwy.occupiedBy.scheduledTime} ${isLatest ? '<small style="color:#d97706; font-weight:800;">(최지연 대상)</small>' : ''}
                </span>
              </div>
            </div>
          `;
        } else if (rwy.status === "EMERGENCY_RESERVED") {
          occupantHtml = `
            <div class="rwy-plane-info" style="background:#eff6ff; border-color:#bfdbfe;">
              <div class="plane-main">
                <div class="plane-callsign-row">
                  <strong class="plane-fn text-cyan"><i class="fa-solid fa-triangle-exclamation"></i> ${state.aircraft.callsign || 'HL-737EM'} (비상기)</strong>
                  <span class="plane-actype">Boeing 737-800</span>
                </div>
                <div class="plane-phase text-cyan">
                  <i class="fa-solid fa-tower-broadcast"></i> ${rwy.evacuatedDetails ? rwy.evacuatedDetails.clearanceOrder : '비상 착륙 우선권 발효 (소방 구조대 전진 배치)'}
                </div>
              </div>
              <div class="plane-sched-time">
                <span class="sched-lbl">비상 접지 예정</span>
                <span class="sched-val" style="color:#0066cc;">IMMEDIATE</span>
              </div>
            </div>
          `;
        } else {
          occupantHtml = `
            <div class="rwy-plane-info" style="background:#f0fdf4; border-color:#bbf7d0;">
              <span style="font-size:11px; color:#16a34a; font-weight:700;"><i class="fa-solid fa-circle-check"></i> 장애물 없음 — 비상 접근 시 즉각 진입 유도 가능</span>
              <span class="text-muted" style="font-size:10px;">ILS ${rwy.ilsCat} 운용 가능</span>
            </div>
          `;
        }

        return `
          <div class="runway-strip-box ${statusClass}">
            <div class="rwy-top-row">
              <div class="rwy-id-badge">
                <i class="fa-solid fa-arrows-left-right-to-line text-cyan"></i>
                <span>RWY ${rwy.id}</span>
                <span class="rwy-dim-tag">(${rwy.lengthMeters}m × ${rwy.widthMeters}m | ${rwy.ilsCat})</span>
              </div>
              ${statusBadge}
            </div>
            ${occupantHtml}
          </div>
        `;
      }).join("");
    }

    // 4. Emergency Clearance Status Message
    const msgEl = document.getElementById("clearanceStatusMessage");
    if (msgEl) {
      if (lastClearanceResult) {
        msgEl.innerHTML = `<span style="color:#059669; font-weight:700;"><i class="fa-solid fa-circle-check"></i> ${lastClearanceResult.message}</span>`;
      } else {
        msgEl.innerHTML = `현재 ${data.name} 활주로 점유 현황 분석 완료. 비상 착륙 활주로 긴급 확보 버튼 클릭 시, <strong>비행시간(스케줄)이 가장 늦은 기체</strong>에게 자동 관제 퇴거 지시(HOLD / TAXI-OFF)를 내립니다.`;
      }
    }

    // 5. Live Schedules Table (FIDS)
    const tbody = document.getElementById("atcScheduleTbody");
    const countPill = document.getElementById("atcScheduleCountPill");
    if (tbody && data.schedules) {
      if (countPill) countPill.textContent = `총 ${data.schedules.length}편 운항 모니터링`;
      tbody.innerHTML = data.schedules.map(item => {
        let typePill = `<span class="atc-type-pill arr">도착 (ARR)</span>`;
        if (item.type === "DEP") typePill = `<span class="atc-type-pill dep">출발 (DEP)</span>`;
        if (item.type === "EMERGENCY_DIV") typePill = `<span class="atc-type-pill emg">비상회항 (EMG)</span>`;

        return `
          <tr>
            <td><strong class="text-cyan">${item.flightNumber}</strong></td>
            <td><strong>${item.airline}</strong> <small class="text-muted">(${item.aircraft})</small></td>
            <td><strong>${item.route}</strong></td>
            <td>${typePill}</td>
            <td><strong class="font-mono">${item.schedTime}</strong></td>
            <td>
              <span>${item.status}</span>
              <small class="text-muted" style="display:block;">[${item.runway}] ${item.delayMin > 0 ? `<b style="color:#dc2626;">+${item.delayMin}분 지연</b>` : '정시'}</small>
            </td>
          </tr>
        `;
      }).join("");
    }

    // 6. Live ATC Broadcast Logs
    const logContainer = document.getElementById("atcLogsStream");
    if (logContainer) {
      logContainer.innerHTML = atcLogs.map(l => `
        <div class="atc-log-entry">
          <span class="atc-log-time">[${l.time}]</span>
          <span class="${l.urgent ? 'atc-log-urgent' : ''}">${l.text}</span>
        </div>
      `).join("");
    }

    // 7. Top 3 AI Tactical ATC Recommendation Plans (Safety 1st, Cost 2nd)
    const plansGrid = document.getElementById("atcPlansGrid");
    if (plansGrid) {
      const plans = generateAtcTacticalPlans(airportId, lastClearanceResult, state.emergencyKey);
      plansGrid.innerHTML = plans.map(p => {
        let cardClass = "plan-alpha";
        if (p.id === "PLAN_BRAVO") cardClass = "plan-bravo";
        if (p.id === "PLAN_CHARLIE") cardClass = "plan-charlie";

        return `
          <div class="atc-plan-card ${cardClass}">
            <div class="plan-head">
              <span class="plan-badge ${p.badgeClass}">${p.badge}</span>
              <h5 class="plan-title">${p.name}</h5>
            </div>

            <div class="plan-scores-strip">
              <div class="plan-score-item">
                <span class="sc-lbl"><i class="fa-solid fa-shield-heart"></i> 안전도</span>
                <span class="sc-val safety">${p.safetyScore}점</span>
              </div>
              <div class="plan-score-item">
                <span class="sc-lbl"><i class="fa-solid fa-coins"></i> 비용/스케줄 절감</span>
                <span class="sc-val cost">${p.costScore}점</span>
              </div>
            </div>

            <div class="plan-directives">
              <div style="font-size:9.5px; font-weight:800; color:var(--boeing-navy); margin-bottom:2px;">
                <i class="fa-solid fa-tower-broadcast"></i> 관제탑(ATC) 하달 핵심 지침 :
              </div>
              ${p.atcDirectives.map(d => `
                <div class="directive-item">
                  <i class="fa-solid fa-chevron-right text-cyan"></i>
                  <span>${d}</span>
                </div>
              `).join("")}
            </div>

            <div class="plan-cost-impact">
              <i class="fa-solid fa-circle-info text-muted"></i> ${p.costImpactDesc}
            </div>

            <button class="btn-adopt-plan" onclick="window.adoptAtcPlan('${p.id}', '${p.name}')">
              <i class="fa-solid fa-check"></i> ${p.recommendedAction}
            </button>
          </div>
        `;
      }).join("");
    }
  }

  // Global window hook for plan adoption button
  window.adoptAtcPlan = function(planId, planName) {
    atcLogs.unshift({
      time: new Date().toLocaleTimeString('ko-KR', { hour12: false }),
      text: `[ATC 관제 플랜 채택] "${planName}" 지침이 관제 타워 및 전 공항 시스템에 즉시 발효되었습니다.`,
      urgent: true
    });
    renderAtcModalUI(currentAtcAirport);
  };

  // Enable smooth mouse drag-to-scroll on side panels, card contents, & bottom bar
  const leftPanel = document.querySelector(".left-panel");
  const rightPanel = document.querySelector(".right-panel");
  const tabsCard = document.getElementById("tacticalTabsCard");
  const tabContent = tabsCard?.querySelector(".tab-content-area");

  enableDragToScroll(leftPanel);
  enableDragToScroll(rightPanel);
  if (tabContent) {
    enableDragToScroll(tabContent);
  }
  initTacticalCardResizer();
  enableHorizontalDragToScroll(document.querySelector(".map-bottom-bar"));

  // Surrounding Traffic Quick Toggle Control (Bottom Bar)
  const toggleTrafficQuickBtn = document.getElementById("toggleTrafficQuickBtn");

  function updateTrafficToggleUI() {
    const isVisible = state.showTraffic;

    if (toggleTrafficQuickBtn) {
      toggleTrafficQuickBtn.className = `traffic-quick-toggle-pill ${isVisible ? 'active' : 'inactive'}`;
      toggleTrafficQuickBtn.innerHTML = `<i class="fa-solid fa-${isVisible ? 'toggle-on' : 'toggle-off'}"></i> 주변기 표시`;
      toggleTrafficQuickBtn.setAttribute("title", `주변기 레이더 표시 ${isVisible ? '끄기' : '켜기'}`);
    }
  }

  function handleTrafficToggle() {
    state.showTraffic = !state.showTraffic;
    updateTrafficToggleUI();
    if (state.mapRenderer) {
      state.mapRenderer.updateSurroundingTraffic(state.trafficList, state.showTraffic);
    }
  }

  if (toggleTrafficQuickBtn) toggleTrafficQuickBtn.addEventListener("click", handleTrafficToggle);

  // Close Tactical Tabs Detail Card Button
  const closeTabsBtn = document.getElementById("closeTacticalTabsBtn");
  if (closeTabsBtn) {
    closeTabsBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      state.detailsVisible = false;
      const tabsCard = document.getElementById("tacticalTabsCard");
      if (tabsCard) {
        tabsCard.style.display = "none";
        tabsCard.classList.remove("visible");
      }
      document.querySelectorAll(".route-card").forEach(c => {
        c.classList.remove("selected");
        const triggerIcon = c.querySelector(".route-details-trigger i.fa-solid:last-child");
        if (triggerIcon) triggerIcon.className = 'fa-solid fa-chevron-right';
      });
    });
  }

  // Initial flight controls sync
  syncFlightControlsUI();
}

function initTacticalCardResizer() {
  const resizer = document.getElementById("tacticalCardResizer");
  const tabsCard = document.getElementById("tacticalTabsCard");
  const tabContent = tabsCard?.querySelector(".tab-content-area");
  if (!resizer || !tabsCard || !tabContent) return;

  let isResizing = false;
  let startY = 0;
  let startCardHeight = 0;
  let startContentHeight = 0;

  resizer.addEventListener("mousedown", (e) => {
    isResizing = true;
    startY = e.pageY;
    startCardHeight = tabsCard.getBoundingClientRect().height;
    startContentHeight = tabContent.getBoundingClientRect().height;
    resizer.classList.add("is-resizing");
    document.body.style.userSelect = "none";
    document.body.style.cursor = "ns-resize";
    e.preventDefault();
    e.stopPropagation();
  });

  window.addEventListener("mousemove", (e) => {
    if (!isResizing) return;
    const dy = e.pageY - startY;
    // Popup is anchored at bottom: 54px with resizer at top, so dragging UP (dy < 0) increases height
    const newCardHeight = Math.min(680, Math.max(220, startCardHeight - dy));
    const newContentHeight = Math.max(120, startContentHeight - dy);
    
    tabsCard.style.maxHeight = `${newCardHeight}px`;
    tabsCard.style.height = `${newCardHeight}px`;
    tabContent.style.maxHeight = `${newContentHeight}px`;
    tabContent.style.height = `${newContentHeight}px`;
    e.preventDefault();
  });

  window.addEventListener("mouseup", () => {
    if (isResizing) {
      isResizing = false;
      resizer.classList.remove("is-resizing");
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    }
  });

  // Touch support for resizing
  resizer.addEventListener("touchstart", (e) => {
    if (e.touches.length !== 1) return;
    isResizing = true;
    startY = e.touches[0].pageY;
    startCardHeight = tabsCard.getBoundingClientRect().height;
    startContentHeight = tabContent.getBoundingClientRect().height;
    resizer.classList.add("is-resizing");
    e.stopPropagation();
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    if (!isResizing || e.touches.length !== 1) return;
    const dy = e.touches[0].pageY - startY;
    const newCardHeight = Math.min(680, Math.max(220, startCardHeight - dy));
    const newContentHeight = Math.max(120, startContentHeight - dy);
    
    tabsCard.style.maxHeight = `${newCardHeight}px`;
    tabsCard.style.height = `${newCardHeight}px`;
    tabContent.style.maxHeight = `${newContentHeight}px`;
    tabContent.style.height = `${newContentHeight}px`;
  }, { passive: true });

  window.addEventListener("touchend", () => {
    if (isResizing) {
      isResizing = false;
      resizer.classList.remove("is-resizing");
    }
  });

  // Double click toggles between compact (420px) and expanded (600px)
  resizer.addEventListener("dblclick", () => {
    const curH = tabsCard.getBoundingClientRect().height;
    const targetH = curH > 480 ? 420 : 600;
    const targetContentH = targetH - 75;

    tabsCard.style.maxHeight = `${targetH}px`;
    tabsCard.style.height = `${targetH}px`;
    tabContent.style.maxHeight = `${targetContentH}px`;
    tabContent.style.height = `${targetContentH}px`;
  });
}

function enableDragToScroll(element, scrollTarget = element) {
  if (!element || !scrollTarget) return;
  let isDown = false;
  let startY = 0;
  let scrollTop = 0;

  // Prevent default native image/text drag inside the scrollable container
  element.addEventListener('dragstart', (e) => {
    if (e.offsetX <= element.clientWidth) {
      e.preventDefault();
    }
  });

  element.addEventListener('mousedown', (e) => {
    // 1. If clicking on native scrollbar (thumb or track), do NOT intercept!
    // In browsers, clicking the vertical scrollbar has offsetX > clientWidth
    if (e.offsetX > element.clientWidth) {
      return; // Let native scrollbar drag work smoothly without interference!
    }

    const tag = e.target.tagName;
    if (['INPUT', 'SELECT', 'BUTTON', 'A', 'TEXTAREA'].includes(tag) || 
        e.target.closest('button') || 
        e.target.closest('select') || 
        e.target.closest('.cockpit-slider') || 
        e.target.closest('.num-input-group') || 
        e.target.closest('.tab-btn') ||
        e.target.closest('.tactical-card-resizer')) {
      return;
    }

    // Stop bubbling so inner scrollable areas don't conflict with outer side-panel
    e.stopPropagation();

    isDown = true;
    startY = e.pageY;
    scrollTop = scrollTarget.scrollTop;
  });

  window.addEventListener('mouseup', () => {
    if (isDown) {
      isDown = false;
      element.classList.remove('is-dragging');
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    const dy = e.pageY - startY;
    if (Math.abs(dy) > 2) {
      e.preventDefault();
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';
      element.classList.add('is-dragging');
      scrollTarget.scrollTop = scrollTop - dy;
    }
  });

  // Touch Support
  element.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    const tag = e.target.tagName;
    if (['INPUT', 'SELECT', 'BUTTON', 'A', 'TEXTAREA'].includes(tag) || 
        e.target.closest('button') ||
        e.target.closest('.tactical-card-resizer')) return;
    isDown = true;
    startY = e.touches[0].pageY;
    scrollTop = scrollTarget.scrollTop;
    e.stopPropagation();
  }, { passive: true });

  element.addEventListener('touchmove', (e) => {
    if (!isDown || e.touches.length !== 1) return;
    const dy = e.touches[0].pageY - startY;
    scrollTarget.scrollTop = scrollTop - dy;
    e.stopPropagation();
  }, { passive: true });

  element.addEventListener('touchend', () => {
    isDown = false;
  });
}

function enableHorizontalDragToScroll(element) {
  if (!element) return;
  let isDown = false;
  let startX;
  let scrollLeft;

  element.addEventListener('mousedown', (e) => {
    const tag = e.target.tagName;
    if (['INPUT', 'SELECT', 'BUTTON', 'A', 'TEXTAREA'].includes(tag) || e.target.closest('button')) {
      return;
    }
    isDown = true;
    element.classList.add('dragging');
    startX = e.pageX - element.offsetLeft;
    scrollLeft = element.scrollLeft;
  });

  window.addEventListener('mouseup', () => {
    if (isDown) {
      isDown = false;
      element.classList.remove('dragging');
    }
  });

  element.addEventListener('mouseleave', () => {
    if (isDown) {
      isDown = false;
      element.classList.remove('dragging');
    }
  });

  element.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - element.offsetLeft;
    const walk = (x - startX) * 1.6;
    element.scrollLeft = scrollLeft - walk;
  });

  // Touch support
  element.addEventListener('touchstart', (e) => {
    if (e.target.closest('button')) return;
    startX = e.touches[0].pageX - element.offsetLeft;
    scrollLeft = element.scrollLeft;
  }, { passive: true });

  element.addEventListener('touchmove', (e) => {
    if (!startX) return;
    const x = e.touches[0].pageX - element.offsetLeft;
    const walk = (x - startX) * 1.6;
    element.scrollLeft = scrollLeft - walk;
  }, { passive: true });

  // Mouse wheel horizontal scroll
  element.addEventListener('wheel', (e) => {
    if (e.deltaY !== 0 && !e.shiftKey) {
      e.preventDefault();
      element.scrollLeft += e.deltaY;
    }
  }, { passive: false });
}

function selectRoute(tag) {
  const tabsCard = document.getElementById("tacticalTabsCard");
  const isToggleClose = state.detailsVisible && state.activeRouteTag === tag;

  if (isToggleClose) {
    state.detailsVisible = false;
    if (tabsCard) {
      tabsCard.style.display = "none";
      tabsCard.classList.remove("visible");
    }
    document.querySelectorAll(".route-card").forEach(c => {
      c.classList.remove("selected");
      const triggerIcon = c.querySelector(".route-details-trigger i.fa-solid:last-child");
      if (triggerIcon) triggerIcon.className = 'fa-solid fa-chevron-right';
    });
    return;
  }

  state.activeRouteTag = tag;
  state.detailsVisible = true;
  playEmergencyChime();

  // Show floating popup on the map (located to the left of the weather HUD)
  if (tabsCard) {
    tabsCard.style.display = "flex";
    tabsCard.classList.add("visible");
  }

  // Highlight card and chevron
  document.querySelectorAll(".route-card").forEach(c => {
    const isThis = c.dataset.tag === tag;
    c.classList.toggle("selected", isThis);
    const triggerIcon = c.querySelector(".route-details-trigger i.fa-solid:last-child");
    if (triggerIcon) {
      triggerIcon.className = `fa-solid ${isThis ? 'fa-chevron-down' : 'fa-chevron-right'}`;
    }
  });

  // Redraw map route polylines
  state.mapRenderer.drawRoutes(state.aircraft, state.evaluationResult.topRecommendations, state.activeRouteTag);

  // Update post-landing maintenance and schedule analysis
  const currentRec = state.evaluationResult.topRecommendations[tag]?.data;
  if (currentRec) {
    document.getElementById("recommendedSiteName").textContent = `${currentRec.site.name} (${currentRec.site.icao})`;
    renderMaintenanceMatrix(currentRec.site);
    renderAirspaceAnalysis(currentRec);

    // Re-render AI selection rationale for the selected airport
    renderAIRationale(state.evaluationResult.topRecommendations[tag], state.emergencyKey, state.evaluationResult.capabilities);
  }
}

// Master Recompute & Render Cycle
function recomputeAndRender() {
  const currentScenario = EMERGENCY_SCENARIOS[state.emergencyKey];

  // 1. Run Route Optimizer
  state.trafficList = generateSurroundingAirTraffic(state.aircraft, state.aircraft.altitudeFt);
  state.evaluationResult = evaluateLandingSites(state.aircraft, state.emergencyKey, state.trafficList);
  const cap = state.evaluationResult.capabilities;
  const recs = state.evaluationResult.topRecommendations;

  // 2. Scenario card info
  document.getElementById("scenarioTag").textContent = currentScenario.severity;
  document.getElementById("scenarioDesc").textContent = currentScenario.description;

  // 3. Update Left Telemetry Panel (Extended Metrics)
  document.getElementById("maxGlideRangeVal").textContent = cap.maxGlideRangeNM;
  const rangeKm = Math.round(cap.maxGlideRangeNM * 1.852);
  document.getElementById("maxGlideKm").textContent = `NM (약 ${rangeKm} km)`;
  const rangePercent = cap.maxGlideRangeNM <= 0 ? 0 : Math.min(100, Math.max(5, (cap.maxGlideRangeNM / 120) * 100));
  document.getElementById("glideRangeBar").style.width = `${rangePercent}%`;

  document.getElementById("remainingEnduranceVal").textContent = cap.remainingTimeMinutes;
  const endurancePercent = cap.remainingTimeMinutes <= 0 ? 0 : Math.min(100, Math.max(5, (cap.remainingTimeMinutes / 60) * 100));
  document.getElementById("enduranceBar").style.width = `${endurancePercent}%`;

  document.getElementById("descentRateVal").textContent = `${cap.descentRate.toLocaleString()}`;
  document.getElementById("optSpeedVal").textContent = `${cap.optimalAirspeed}`;

  // New detailed aeronautical metrics
  document.getElementById("effectiveGlideVal").textContent = cap.effectiveGlideRatio > 0 
    ? `${cap.effectiveGlideRatio.toFixed(1)} : 1` 
    : "추력 순항";
  document.getElementById("glideDistancePer1000ftVal").textContent = cap.glideDistancePer1000ft > 0 
    ? `(${cap.glideDistancePer1000ft} NM/1kft)` 
    : "(정상 파워 비행)";
  document.getElementById("reqRunwayVal").textContent = `${cap.requiredRunwayMeters.toLocaleString()}`;
  document.getElementById("grossWeightVal").textContent = `${cap.grossWeightKg.toLocaleString()}`;
  
  const owBadge = document.getElementById("overweightBadge");
  if (cap.isOverweightLanding) {
    owBadge.className = "weight-badge overweight";
    owBadge.textContent = "⚠️ 과체중 착륙 (Overweight Landing - 점검 필수)";
  } else {
    owBadge.className = "weight-badge";
    owBadge.textContent = "정상 착륙 중량 (Normal MLW 이하)";
  }

  // 4. Update Center Radar Map
  state.mapRenderer.updateAircraft(state.aircraft, currentScenario);
  state.mapRenderer.updateGlideCone(state.aircraft.lat, state.aircraft.lng, cap.maxGlideRangeNM, cap.isDualFlameout);
  state.mapRenderer.updateSurroundingTraffic(state.trafficList, state.showTraffic);
  state.mapRenderer.updateLandingSites(state.evaluationResult.allEvaluated);
  state.mapRenderer.drawRoutes(state.aircraft, recs, state.activeRouteTag);

  // Update Bottom Status Counters (3-tier breakdown: Danger, Caution, Safe)
  const reachableList = state.evaluationResult.allEvaluated.filter(r => r.isReachable);
  document.getElementById("reachableCount").textContent = `${state.evaluationResult.allEvaluated.length}개소`;
  document.getElementById("viableCount").textContent = `${reachableList.length}개소`;
  document.getElementById("trafficCount").textContent = `${state.trafficList.length}대`;
  
  const dangerTrafficCount = state.trafficList.filter(t => t.riskTier === 'danger' || t.isConflictRisk).length;
  const cautionTrafficCount = state.trafficList.filter(t => t.riskTier === 'caution').length;
  const safeTrafficCount = state.trafficList.filter(t => t.riskTier === 'safe' || (!t.isConflictRisk && t.riskTier !== 'caution')).length;

  const dangerEl = document.getElementById("conflictDangerCount");
  if (dangerEl) dangerEl.textContent = `${dangerTrafficCount}대`;
  const cautionEl = document.getElementById("conflictCautionCount");
  if (cautionEl) cautionEl.textContent = `${cautionTrafficCount}대`;
  const safeEl = document.getElementById("conflictSafeCount");
  if (safeEl) safeEl.textContent = `${safeTrafficCount}대`;
  const legacyConflictEl = document.getElementById("conflictCount");
  if (legacyConflictEl) legacyConflictEl.textContent = `${dangerTrafficCount}대`;

  // 5. Render Right Top Recommendation Cards (1st, 2nd, 3rd)
  renderRecommendationCards(recs);

  // 6. Render Bottom Tabs (AI Rationale, QRH, Maintenance, Schedule)
  renderAIRationale(recs, state.emergencyKey, cap);
  renderQRHChecklist();
  
  const selectedSiteData = recs[state.activeRouteTag]?.data || recs.alpha.data;
  document.getElementById("recommendedSiteName").textContent = `${selectedSiteData.site.name} (${selectedSiteData.site.icao})`;
  renderMaintenanceMatrix(selectedSiteData.site);
  renderAirspaceAnalysis(selectedSiteData);

  const tabsCard = document.getElementById("tacticalTabsCard");
  if (tabsCard) {
    tabsCard.style.display = state.detailsVisible ? "flex" : "none";
  }

  // 7. Update Real-Time En-Route Weather & METAR HUD
  updateWeatherHudUI(state);

  // 8. Update Real-Time Aircraft Damage & Parts Manifest
  updateDamageModalUI(state.emergencyKey);

  // 9. Update Real-Time Airspace Country Date & Time
  if (updateAirspaceClockRef) updateAirspaceClockRef();
}

function renderRecommendationCards(recs) {
  const container = document.getElementById("routesContainer");
  container.innerHTML = "";

  const routeList = [
    { tag: "alpha", rank: "1순위", colorLabel: "초록색", colorCode: "#00e676", cssClass: "rank1", ...recs.alpha },
    { tag: "bravo", rank: "2순위", colorLabel: "파란색", colorCode: "#00d4ff", cssClass: "rank2", ...recs.bravo },
    { tag: "charlie", rank: "3순위", colorLabel: "주황색", colorCode: "#ff9100", cssClass: "rank3", ...recs.charlie }
  ];

  routeList.forEach(item => {
    const isSelected = state.detailsVisible && (item.tag === state.activeRouteTag);
    const rData = item.data;
    const site = rData.site;

    const card = document.createElement("div");
    card.className = `route-card ${item.cssClass} ${isSelected ? 'selected' : ''}`;
    card.dataset.tag = item.tag;

    card.innerHTML = `
      <div class="route-header">
        <div class="route-tag-group">
          <span class="route-letter-badge">${item.rank}</span>
          <span class="route-title" title="${site.name}">${site.name}</span>
        </div>
        <div class="score-badge">
          <div class="score-val-wrap">
            <span class="score-val" style="color: ${item.colorCode};">${rData.compositeScore}</span>
            <span class="score-unit" style="color: ${item.colorCode};">점</span>
          </div>
          <span class="score-lbl">${rData.compositeScore < 0 ? '도달불능 감점' : '종합 최적도'}</span>
        </div>
      </div>
      <p class="route-strategy-desc">${item.strategy}</p>
      <div class="route-metrics-row">
        <div class="metric-cell">
          <span class="metric-lbl">비행거리</span>
          <div class="metric-val-wrap">
            <strong class="metric-num">${rData.distanceNM}</strong>
            <span class="metric-unit">NM</span>
          </div>
          <span class="metric-sub">방위 ${rData.bearingDeg}°</span>
        </div>
        <div class="metric-cell">
          <span class="metric-lbl">예상 비행시간</span>
          <div class="metric-val-wrap">
            <strong class="metric-num" style="color: ${item.colorCode};">${rData.estimatedMinutes}</strong>
            <span class="metric-unit" style="color: ${item.colorCode};">분</span>
          </div>
          <span class="metric-sub">무동력 ETE</span>
        </div>
        <div class="metric-cell">
          <span class="metric-lbl">안전 점수</span>
          <div class="metric-val-wrap">
            <strong class="metric-num ${rData.safetyScore < 0 ? 'text-red' : 'text-green'}">${rData.safetyScore}</strong>
            <span class="metric-unit">/100</span>
          </div>
          <span class="metric-sub">1순위 (75%)</span>
        </div>
        <div class="metric-cell">
          <span class="metric-lbl">운영 점수</span>
          <div class="metric-val-wrap">
            <strong class="metric-num text-amber">${rData.efficiencyScore}</strong>
            <span class="metric-unit">/100</span>
          </div>
          <span class="metric-sub">2순위 (25%)</span>
        </div>
      </div>
      <div class="route-impact-summary">
        <div class="impact-item">
          <i class="fa-solid fa-plane-arrival text-cyan"></i>
          <span class="impact-txt">공항 대기편:</span>
          <strong>${site.activeQueuedFlights}대</strong>
        </div>
        <div class="impact-divider"></div>
        <div class="impact-item">
          <i class="fa-solid fa-coins text-amber"></i>
          <span class="impact-txt">스케줄 지연손실:</span>
          <strong>$${(rData.estimatedDisruptionCostUSD).toLocaleString()}</strong>
        </div>
      </div>
      <div class="route-details-trigger">
        <span><i class="fa-solid fa-circle-info text-cyan"></i> 클릭하여 AI 선택 이유 & 비상수칙 보기</span>
        <i class="fa-solid ${isSelected ? 'fa-chevron-down' : 'fa-chevron-right'}"></i>
      </div>
    `;

    card.addEventListener("click", () => {
      selectRoute(item.tag);
    });

    container.appendChild(card);
  });
}

function renderAIRationale(activeRec, emergencyKey, capabilities) {
  const container = document.getElementById("rationaleCardsList");
  if (!container) return;
  container.innerHTML = "";

  // If recommendations map (alpha, bravo, charlie) is passed, extract the current active route
  let rec = activeRec;
  if (rec && rec.alpha) {
    rec = rec[state.activeRouteTag] || rec.alpha;
  }
  if (!rec || !rec.data) return;

  const rData = rec.data;
  const site = rData.site;
  const cap = capabilities || state.evaluationResult?.capabilities || { requiredRunwayMeters: 2190 };
  const runwayMarginMeters = site.maxRunwayLength - cap.requiredRunwayMeters;
  const marginClass = runwayMarginMeters >= 500 ? "text-green" : runwayMarginMeters >= 0 ? "text-cyan" : "text-red";

  const card = document.createElement("div");
  card.className = "ai-rationale-view";

  let reachabilityBullet = !rData.isReachable
    ? `<div class="ai-reason-item warning">
         <i class="fa-solid fa-triangle-exclamation text-red"></i>
         <div>
           <strong class="text-red">활공 도달 주의 (거리 부족)</strong>
           <span>비상 활공 반경 대비 <strong>${Math.abs(rData.glideMarginNM)} NM</strong> 부족 (안전 결손 감점 ${rData.safetyScore}점 적용)</span>
         </div>
       </div>`
    : `<div class="ai-reason-item">
         <i class="fa-solid fa-compass text-green"></i>
         <div>
           <strong>도달 고도 마진</strong>
           <span>비상 활공 안전 반경 내 도달 여유 확보 (도달 여유: <strong>+${rData.glideMarginNM.toFixed(1)} NM</strong>)</span>
         </div>
       </div>`;

  card.innerHTML = `
    <div class="ai-verdict-header">
      <div class="ai-verdict-title-box">
        <span class="ai-verdict-badge"><i class="fa-solid fa-robot"></i> AI RECOMMENDATION</span>
        <h4>${site.name} (${site.icao}) 선정 이유</h4>
      </div>
      <div class="ai-verdict-score">
        <span class="ai-score-val">${rData.compositeScore}점</span>
        <small class="ai-score-denom">/ 100</small>
      </div>
    </div>

    <div class="ai-strategy-summary">
      <i class="fa-solid fa-quote-left"></i>
      <p>${rec.strategy || '최적의 안전 마진과 운영 연속성을 종합 평가하여 비상 착륙지로 선정되었습니다.'}</p>
    </div>

    <div class="ai-reasons-grid">
      <!-- 1. Safety Criteria (75%) -->
      <div class="ai-reason-card safety">
        <div class="ai-reason-card-head">
          <div class="head-tag">
            <i class="fa-solid fa-shield-halved text-green"></i>
            <strong>안전성 평가 근거 (가중치 75%)</strong>
          </div>
          <span class="score-tag ${rData.safetyScore < 0 ? 'text-red' : 'text-green'}">${rData.safetyScore} / 100점</span>
        </div>
        <div class="ai-reason-items">
          <div class="ai-reason-item">
            <i class="fa-solid fa-road text-cyan"></i>
            <div>
              <strong>활주로 길이 및 안전 마진</strong>
              <span>길이 <strong>${site.maxRunwayLength.toLocaleString()}m</strong> 보유 (요구 길이 ${cap.requiredRunwayMeters.toLocaleString()}m 대비 <strong class="${marginClass}">${runwayMarginMeters >= 0 ? '+' : ''}${runwayMarginMeters}m</strong> 안전 여유 확보)</span>
            </div>
          </div>
          <div class="ai-reason-item">
            <i class="fa-solid fa-truck-medical text-amber"></i>
            <div>
              <strong>소방 구조대 (ARFF)</strong>
              <span><strong>ARFF Cat ${site.arffCategory}</strong> 등급 배치 (비상 화재 진압 및 비상 탈출 골든타임 완비)</span>
            </div>
          </div>
          <div class="ai-reason-item">
            <i class="fa-solid fa-satellite-dish text-cyan"></i>
            <div>
              <strong>착륙 계기 접근 및 기상</strong>
              <span><strong>${site.runways[0]?.ilsCat || 'VISUAL'}</strong> 정밀 계기접근 지원, 공항 기상: <strong>${site.weather.conditions}</strong></span>
            </div>
          </div>
          ${reachabilityBullet}
        </div>
      </div>

      <!-- 2. Schedule & Cost Criteria (25%) -->
      <div class="ai-reason-card efficiency">
        <div class="ai-reason-card-head">
          <div class="head-tag">
            <i class="fa-solid fa-clock-rotate-left text-amber"></i>
            <strong>스케줄 및 비용 절감 근거 (가중치 25%)</strong>
          </div>
          <span class="score-tag text-amber">${rData.efficiencyScore} / 100점</span>
        </div>
        <div class="ai-reason-items">
          <div class="ai-reason-item">
            <i class="fa-solid fa-plane-arrival text-cyan"></i>
            <div>
              <strong>공항 지상 혼잡도</strong>
              <span>공항 대기편 <strong>${site.activeQueuedFlights}대</strong> (인천 28대 대비 공항 지상 마비 및 연쇄 회항 위험 최소화)</span>
            </div>
          </div>
          <div class="ai-reason-item">
            <i class="fa-solid fa-route text-amber"></i>
            <div>
              <strong>공역 통과기 간섭 & 지연 손실</strong>
              <span>주변 비행 통과기 간섭 <strong>${rData.trafficConflicts}대</strong>, 예상 네트워크 지연 손실: <strong>$${(rData.estimatedDisruptionCostUSD).toLocaleString()}</strong></span>
            </div>
          </div>
          <div class="ai-reason-item">
            <i class="fa-solid fa-wrench text-blue"></i>
            <div>
              <strong>정비(MRO) 및 후속 조치</strong>
              <span>${site.maintenanceHub ? '항공사 전용 정비 격납고(MRO Hub) 보유 ➔ 신속한 엔진/부품 교체 및 승객 대체편 수송 비용 대폭 절감' : '군/지방 비행장 ➔ 부품 출장 수송 및 페리 비행(Ferry Flight) 필요'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  container.appendChild(card);
}

function renderQRHChecklist() {
  const qrh = QRH_PROCEDURES[state.emergencyKey] || QRH_PROCEDURES.dual_engine_flameout;
  document.getElementById("qrhTitle").textContent = qrh.title;

  // Memory Items
  const memContainer = document.getElementById("qrhMemoryItems");
  memContainer.innerHTML = "";
  qrh.memoryItems.forEach(item => {
    const el = document.createElement("div");
    el.className = "checklist-item";
    el.innerHTML = `
      <div class="chk-box"><i class="fa-solid fa-check"></i></div>
      <div class="chk-content">
        <div class="chk-action">${item.step}. ${item.action}</div>
        <div class="chk-note">${item.note}</div>
      </div>
    `;
    el.addEventListener("click", () => {
      el.classList.toggle("checked");
    });
    memContainer.appendChild(el);
  });

  // ATC Communication
  const atcContainer = document.getElementById("qrhAtcItems");
  atcContainer.innerHTML = "";
  qrh.atcCommunication.forEach(item => {
    const el = document.createElement("div");
    el.className = "atc-item";
    el.innerHTML = `
      <div class="atc-phrase">"${item.phrase.replace('[Callsign]', state.aircraft.callsign)}"</div>
      <div class="atc-code">규정 지침: ${item.code}</div>
    `;
    atcContainer.appendChild(el);
  });

  // Landing Prep
  const prepContainer = document.getElementById("qrhLandingItems");
  prepContainer.innerHTML = "";
  qrh.landingPrep.forEach(item => {
    const el = document.createElement("div");
    el.className = "prep-item";
    el.innerHTML = `
      <strong>${item.item}</strong>
      <span>${item.desc}</span>
    `;
    prepContainer.appendChild(el);
  });
}

function renderMaintenanceMatrix(landingSite) {
  const container = document.getElementById("maintStagesList");
  if (!container) return;

  const matrix = generateMaintenanceMatrix(state.emergencyKey, landingSite, state.aircraft);

  const titleEl = document.getElementById("maintOverviewTitle");
  if (titleEl) titleEl.textContent = matrix.overview;
  const downtimeEl = document.getElementById("maintDowntime");
  if (downtimeEl) downtimeEl.textContent = `예상 AOG 다운타임: ${matrix.estimatedDowntimeDays}`;
  const noteEl = document.getElementById("maintHubNote");
  if (noteEl) noteEl.textContent = matrix.hubAdvantageNote;

  container.innerHTML = "";

  matrix.stages.forEach(stg => {
    const stageBlock = document.createElement("div");
    stageBlock.className = "maint-stage-block";

    stageBlock.innerHTML = `
      <div class="stage-title-bar" style="color: ${stg.color};">
        <i class="fa-solid fa-circle-notch"></i>
        <span>${stg.title}</span>
      </div>
    `;

    stg.tasks.forEach(task => {
      const pClass = task.priority.startsWith("P1") ? "p1" : task.priority.startsWith("P2") ? "p2" : "p3";
      const taskEl = document.createElement("div");
      taskEl.className = "maint-task-card";
      taskEl.innerHTML = `
        <div class="task-top">
          <span class="task-id">${task.id} (${task.ammRef})</span>
          <span class="task-p-badge ${pClass}">${task.priority}</span>
        </div>
        <div class="task-title">${task.title}</div>
        ${task.desc ? `<div class="task-desc">${task.desc}</div>` : ''}
        <div class="task-footer">
          <span>담당: ${task.dept}</span>
          <span>예상소요: ${task.duration}</span>
        </div>
      `;
      stageBlock.appendChild(taskEl);
    });

    container.appendChild(stageBlock);
  });
}

function renderAirspaceAnalysis(evaluatedItem) {
  const site = evaluatedItem.site;

  document.getElementById("impactQueuedFlights").textContent = `${site.activeQueuedFlights}대 대기`;
  document.getElementById("impactReroutedFlights").textContent = `${evaluatedItem.trafficConflicts}대 우회`;

  // Compare to Incheon (worst disruption)
  const maxDelay = 28 * 25; // Incheon delay min
  const currentDelay = evaluatedItem.estimatedScheduleDelayMinTotal;
  const savedMin = Math.max(0, maxDelay - currentDelay);
  document.getElementById("impactSavedTime").textContent = `${savedMin}분 절감`;

  document.getElementById("impactCostUSD").textContent = `$${evaluatedItem.estimatedDisruptionCostUSD.toLocaleString()}`;

  // Populate Airborne Traffic Table with exact 5-column layout
  const tbody = document.getElementById("airborneTrafficTbody");
  tbody.innerHTML = "";

  state.trafficList.forEach(trf => {
    const tier = trf.riskTier || (trf.isConflictRisk ? 'danger' : 'safe');
    let tierBadge = '<span class="trf-pill safe" title="정상 통과 (안전 간격 확보)">안전</span>';

    if (tier === 'danger' || trf.isConflictRisk) {
      tierBadge = `<span class="trf-pill danger" title="+${trf.estimatedDelayMinIfRerouted}분 긴급 우회 (+${trf.fuelBurnPenaltyKg}kg)">위험 (+${trf.estimatedDelayMinIfRerouted}m)</span>`;
    } else if (tier === 'caution') {
      tierBadge = `<span class="trf-pill caution" title="인접 고도 주의 모니터링 (+${trf.estimatedDelayMinIfRerouted}분 우회 가능)">주의 (모니터)</span>`;
    }

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><strong style="color:var(--boeing-navy);">${trf.callsign}</strong></td>
      <td>${trf.aircraft}</td>
      <td>${trf.origin}➔${trf.dest}</td>
      <td>FL${Math.round(trf.altFt / 100)}</td>
      <td>${tierBadge}</td>
    `;
    tbody.appendChild(row);
  });
}

function updateLiveAirborneTraffic() {
  if (!state.aircraft || !state.mapRenderer) return;

  // Re-generate moving surrounding traffic relative to current aircraft coordinates
  state.trafficList = generateSurroundingAirTraffic(state.aircraft, state.aircraft.altitudeFt);

  // Update map radar markers
  state.mapRenderer.updateSurroundingTraffic(state.trafficList, state.showTraffic);

  // Update bottom radar bar counters
  const dangerTrafficCount = state.trafficList.filter(t => t.riskTier === 'danger' || t.isConflictRisk).length;
  const cautionTrafficCount = state.trafficList.filter(t => t.riskTier === 'caution').length;
  const safeTrafficCount = state.trafficList.filter(t => t.riskTier === 'safe' || (!t.isConflictRisk && t.riskTier !== 'caution')).length;

  const countEl = document.getElementById("trafficCount");
  if (countEl) countEl.textContent = `${state.trafficList.length}대`;

  const dangerEl = document.getElementById("conflictDangerCount");
  if (dangerEl) dangerEl.textContent = `${dangerTrafficCount}대`;
  const cautionEl = document.getElementById("conflictCautionCount");
  if (cautionEl) cautionEl.textContent = `${cautionTrafficCount}대`;
  const safeEl = document.getElementById("conflictSafeCount");
  if (safeEl) safeEl.textContent = `${safeTrafficCount}대`;

  // If the tactical tabs popup is open and traffic tab is active, refresh the airborne traffic table in real time
  const tabsCard = document.getElementById("tacticalTabsCard");
  const trafficTab = document.getElementById("trafficTab");
  if (tabsCard && tabsCard.classList.contains("visible") && trafficTab && trafficTab.classList.contains("active")) {
    const selectedRec = state.evaluationResult?.topRecommendations?.[state.activeRouteTag]?.data || state.evaluationResult?.topRecommendations?.alpha?.data;
    if (selectedRec) {
      renderAirspaceAnalysis(selectedRec);
    }
  }
}

let updateAirspaceClockRef = null;

function startUtcClock() {
  const clockFlag = document.getElementById("clockFlag");
  const clockCountry = document.getElementById("clockCountry");
  const clockZoneBadge = document.getElementById("clockZoneBadge");
  const clockDate = document.getElementById("clockDate");
  const clockTime = document.getElementById("clockTime");
  const clockEl = document.getElementById("utcClock");

  function updateClock() {
    const lat = state.aircraft?.lat ?? 36.5;
    const lng = state.aircraft?.lng ?? 126.7;
    const airspace = getAirspaceInfo(lat, lng);

    const now = new Date();
    
    try {
      // Localized date formatter for the aircraft's current airspace country
      const dtfDate = new Intl.DateTimeFormat('ko-KR', {
        timeZone: airspace.timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'short'
      });
      // Localized time formatter for the aircraft's current airspace country
      const dtfTime = new Intl.DateTimeFormat('ko-KR', {
        timeZone: airspace.timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });

      if (clockFlag) clockFlag.textContent = airspace.flag;
      if (clockCountry) clockCountry.textContent = `${airspace.country} 공역`;
      if (clockZoneBadge) clockZoneBadge.textContent = airspace.code;
      if (clockDate) clockDate.textContent = dtfDate.format(now);
      if (clockTime) clockTime.textContent = dtfTime.format(now);

      const radarAirspaceEl = document.getElementById("mapRadarAirspaceText");
      if (radarAirspaceEl) {
        radarAirspaceEl.textContent = `관제 레이더: ${airspace.country} 공역 (${airspace.fir.split(' ')[0]} FIR)`;
      }

      if (clockEl) {
        clockEl.title = `기체 위치 (${lat.toFixed(2)}°, ${lng.toFixed(2)}°) • ${airspace.country} (${airspace.fir}) 현지 일시`;
      }
    } catch (e) {
      if (clockDate) clockDate.textContent = now.toLocaleDateString('ko-KR');
      if (clockTime) clockTime.textContent = now.toTimeString().split(' ')[0];
    }
  }

  updateAirspaceClockRef = updateClock;
  updateClock();
  setInterval(updateClock, 1000);
}
