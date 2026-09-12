// AeroRescue 737 AI - Main Application Controller

import { calculateFlightCapabilities, EMERGENCY_SCENARIOS } from "./b737Engine.js";
import { generateSurroundingAirTraffic, LANDING_SITES } from "./airTrafficSim.js";
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
    activePresetId: "GMP_CJU",
    waypoints: []
  },
  emergencyKey: "dual_engine_flameout",
  activeRouteTag: "alpha", // Default 1st rank
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
    updatePresetButtonsUI();
    updateFlightRouteAndAircraft(true);
  });

  // Dest change listener
  destSelect.addEventListener("change", (e) => {
    state.flightPlan.destIcao = e.target.value;
    state.flightPlan.activePresetId = null;
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
      updatePresetButtonsUI();
      updateFlightRouteAndAircraft(true);
    });
  }

  // Progress slider
  if (progressSlider) {
    progressSlider.addEventListener("input", (e) => {
      const val = parseInt(e.target.value);
      state.flightPlan.progress = val / 100;
      updateFlightRouteAndAircraft(false);
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

  updatePresetButtonsUI();
  updateFlightRouteAndAircraft(true);
}

function updatePresetButtonsUI() {
  document.querySelectorAll(".route-preset-pill").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.id === state.flightPlan.activePresetId);
  });
}

function updateFlightRouteAndAircraft(shouldFitBounds = false) {
  const orig = getAirportByIcao(state.flightPlan.originIcao);
  const dest = getAirportByIcao(state.flightPlan.destIcao);

  // Generate waypoints along planned route
  state.flightPlan.waypoints = generatePlannedRouteWaypoints(orig, dest, 24);

  // Compute position along route
  const posData = computeFlightPositionAlongRoute(orig, dest, state.flightPlan.progress, state.aircraft.altitudeFt);
  state.aircraft.lat = posData.lat;
  state.aircraft.lng = posData.lng;
  state.aircraft.headingDeg = posData.headingDeg;

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
    posData = computeFlightPositionAlongRoute(orig, dest, state.flightPlan.progress, state.aircraft.altitudeFt);
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
    recomputeAndRender();
  });
  inputAlt.addEventListener("input", (e) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) return;
    val = Math.max(3000, Math.min(41000, val));
    state.aircraft.altitudeFt = val;
    altSlider.value = Math.max(5000, Math.min(39000, val));
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

  function syncFlightControlsUI() {
    altSlider.value = state.aircraft.altitudeFt;
    inputAlt.value = state.aircraft.altitudeFt;
    speedSlider.value = state.aircraft.groundSpeedKts;
    inputSpeed.value = state.aircraft.groundSpeedKts;
    fuelSlider.value = state.aircraft.fuelKg;
    inputFuel.value = state.aircraft.fuelKg;
    windSlider.value = state.aircraft.windKts;
    inputWind.value = state.aircraft.windKts;
    updateWindLabel(state.aircraft.windKts);
  }

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

  // Enable smooth mouse drag-to-scroll on side panels
  enableDragToScroll(document.querySelector(".left-panel"));
  enableDragToScroll(document.querySelector(".right-panel"));

  // Surrounding Traffic Quick Toggle Control (Bottom Bar)
  const toggleTrafficQuickBtn = document.getElementById("toggleTrafficQuickBtn");

  function updateTrafficToggleUI() {
    const isVisible = state.showTraffic;
    const textStr = isVisible ? "ON" : "OFF";

    if (toggleTrafficQuickBtn) {
      toggleTrafficQuickBtn.className = `traffic-quick-toggle-pill ${isVisible ? 'active' : 'inactive'}`;
      toggleTrafficQuickBtn.innerHTML = `<i class="fa-solid fa-${isVisible ? 'toggle-on' : 'toggle-off'}"></i> 주변기 ${textStr}`;
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

  // Initial flight controls sync
  syncFlightControlsUI();
}

function enableDragToScroll(element) {
  if (!element) return;
  let isDown = false;
  let startY;
  let scrollTop;

  element.addEventListener('mousedown', (e) => {
    const tag = e.target.tagName;
    if (['INPUT', 'SELECT', 'BUTTON', 'A', 'TEXTAREA'].includes(tag) || e.target.closest('.cockpit-slider') || e.target.closest('.num-input-group')) {
      return;
    }
    isDown = true;
    startY = e.pageY - element.offsetTop;
    scrollTop = element.scrollTop;
  });

  window.addEventListener('mouseup', () => {
    isDown = false;
  });

  element.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const y = e.pageY - element.offsetTop;
    const walk = (y - startY) * 1.5;
    element.scrollTop = scrollTop - walk;
  });
}

function selectRoute(tag) {
  state.activeRouteTag = tag;
  playEmergencyChime();

  // Highlight card
  document.querySelectorAll(".route-card").forEach(c => {
    c.classList.toggle("selected", c.dataset.tag === tag);
  });

  // Redraw map route polylines
  state.mapRenderer.drawRoutes(state.aircraft, state.evaluationResult.topRecommendations, state.activeRouteTag);

  // Update post-landing maintenance and schedule analysis
  const currentRec = state.evaluationResult.topRecommendations[tag]?.data;
  if (currentRec) {
    document.getElementById("recommendedSiteName").textContent = `${currentRec.site.name} (${currentRec.site.icao})`;
    renderMaintenanceMatrix(currentRec.site);
    renderAirspaceAnalysis(currentRec);
  }
}

// Master Recompute & Render Cycle
function recomputeAndRender() {
  const currentScenario = EMERGENCY_SCENARIOS[state.emergencyKey];

  // 1. Run Route Optimizer
  state.trafficList = generateSurroundingAirTraffic(state.aircraft);
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
  const rangePercent = Math.min(100, Math.max(10, (cap.maxGlideRangeNM / 120) * 100));
  document.getElementById("glideRangeBar").style.width = `${rangePercent}%`;

  document.getElementById("remainingEnduranceVal").textContent = cap.remainingTimeMinutes;
  const endurancePercent = Math.min(100, Math.max(10, (cap.remainingTimeMinutes / 60) * 100));
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
    const isSelected = item.tag === state.activeRouteTag;
    const rData = item.data;
    const site = rData.site;

    const card = document.createElement("div");
    card.className = `route-card ${item.cssClass} ${isSelected ? 'selected' : ''}`;
    card.dataset.tag = item.tag;

    card.innerHTML = `
      <div class="route-header">
        <div class="route-tag-group">
          <span class="route-letter-badge">${item.rank} (${item.colorLabel})</span>
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
    `;

    card.addEventListener("click", () => {
      selectRoute(item.tag);
    });

    container.appendChild(card);
  });
}

function renderAIRationale(recs, emergencyKey, capabilities) {
  const container = document.getElementById("rationaleCardsList");
  if (!container) return;
  container.innerHTML = "";

  const ranks = [
    { rankLabel: "1순위 추천", colorCode: "#00e676", cssClass: "rank1", rec: recs.alpha },
    { rankLabel: "2순위 대안", colorCode: "#00d4ff", cssClass: "rank2", rec: recs.bravo },
    { rankLabel: "3순위 비상", colorCode: "#ff9100", cssClass: "rank3", rec: recs.charlie }
  ];

  ranks.forEach(item => {
    const rData = item.rec.data;
    const site = rData.site;
    const runwayMarginMeters = site.maxRunwayLength - capabilities.requiredRunwayMeters;
    const marginClass = runwayMarginMeters >= 500 ? "text-green" : runwayMarginMeters >= 0 ? "text-cyan" : "text-red";

    const card = document.createElement("div");
    card.className = `rationale-item-card ${item.cssClass}`;

    // Generate logical reasons
    let reachabilityBullet = !rData.isReachable
      ? `<div class="reason-bullet" style="background: rgba(213,0,0,0.06); border-left: 3px solid #d50000; padding: 4px 8px; border-radius: 4px; margin-bottom: 4px;">
           <i class="fa-solid fa-triangle-exclamation text-red"></i>
           <span><strong class="text-red">[도달 마진 부족]</strong> 비상 활공 반경 대비 <strong>${Math.abs(rData.glideMarginNM)} NM</strong> 거리 부족 (안전 결손 감점 ${rData.safetyScore}점 적용)</span>
         </div>`
      : '';

    let safetyBullet1 = `활주로 길이 <strong>${site.maxRunwayLength.toLocaleString()}m</strong> 보유 (요구 길이 ${capabilities.requiredRunwayMeters.toLocaleString()}m 대비 <span class="${marginClass}">${runwayMarginMeters >= 0 ? '+' : ''}${runwayMarginMeters}m</span> 여유 확보)`;
    let safetyBullet2 = `소방 구조대 <strong>ARFF Cat ${site.arffCategory}</strong> 등급 배속 (비상 화재 진압 및 비상 탈출 골든타임 완비)`;
    let safetyBullet3 = `계기 접근: <strong>${site.runways[0]?.ilsCat || 'VISUAL'}</strong> 지원, 기상 조건: <strong>${site.weather.conditions}</strong>`;
    
    let efficiencyBullet1 = `공항 대기편: <strong>${site.activeQueuedFlights}대</strong> (인천 28대 대비 공항 지상 마비 위험 최소화)`;
    let efficiencyBullet2 = `주변 비행 통과기 간섭: <strong>${rData.trafficConflicts}대</strong>, 예상 네트워크 지연 손실: <strong>$${(rData.estimatedDisruptionCostUSD).toLocaleString()}</strong>`;
    let efficiencyBullet3 = site.maintenanceHub 
      ? `항공사 전용 정비 격납고(MRO Hub) 보유 ➔ 엔진/부품 교체 및 승객 대체편 수송 비용 수억 원 절감`
      : `군/지방 비행장 ➔ 부품 출장 수송 및 페리 비행(Ferry Flight) 필요`;

    card.innerHTML = `
      <div class="r-card-top">
        <div class="r-card-rank-tag" style="color: ${item.colorCode};">
          <i class="fa-solid fa-trophy"></i>
          <span>${item.rankLabel}: ${site.name} (${site.icao})</span>
        </div>
        <div class="r-card-score-pill">
          <span style="color:${item.colorCode}; font-size:14px;">${rData.compositeScore}점</span>
          <small style="color:var(--text-muted); font-size:9.5px;">/ 100</small>
        </div>
      </div>

      <div class="r-key-reasons">
        ${reachabilityBullet}
        <div class="reason-bullet">
          <i class="fa-solid fa-shield-check text-green"></i>
          <span><strong>[안전성 근거 (75%)]</strong> ${safetyBullet1} / ${safetyBullet2} / ${safetyBullet3}</span>
        </div>
        <div class="reason-bullet">
          <i class="fa-solid fa-coins text-amber"></i>
          <span><strong>[스케줄/비용 근거 (25%)]</strong> ${efficiencyBullet1} / ${efficiencyBullet2} / ${efficiencyBullet3}</span>
        </div>
      </div>

      <div class="r-score-breakdown-bar">
        <div class="bar-chunk">
          <span>안전성 평가 점수 (가중치 75%)</span>
          <strong class="${rData.safetyScore < 0 ? 'text-red' : 'text-green'}">${rData.safetyScore} / 100 점</strong>
        </div>
        <div class="bar-chunk">
          <span>스케줄/비용 절감 점수 (가중치 25%)</span>
          <strong class="text-amber">${rData.efficiencyScore} / 100 점</strong>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  // Comparative Matrix Table
  const tableContainer = document.getElementById("rationaleMatrixTable");
  if (tableContainer) {
    tableContainer.innerHTML = `
      <table class="cockpit-table">
        <thead>
          <tr>
            <th>순위</th>
            <th>공항/착륙지</th>
            <th>비행거리/ETE</th>
            <th>활주로 길이</th>
            <th>소방 등급</th>
            <th>대기편/손실비용</th>
            <th>정비 허브</th>
            <th>종합 점수</th>
          </tr>
        </thead>
        <tbody>
          ${ranks.map(r => {
            const d = r.rec.data;
            return `
              <tr>
                <td><strong style="color:${r.colorCode}">${r.rankLabel.split(' ')[0]}</strong></td>
                <td><strong>${d.site.name}</strong> (${d.site.icao})</td>
                <td>${d.distanceNM}NM / ${d.estimatedMinutes}분</td>
                <td>${d.site.maxRunwayLength}m</td>
                <td>ARFF Cat ${d.site.arffCategory}</td>
                <td>${d.site.activeQueuedFlights}대 / $${(d.estimatedDisruptionCostUSD).toLocaleString()}</td>
                <td>${d.site.maintenanceHub ? '<span class="text-green">보유 (Hub)</span>' : '<span class="text-muted">미보유</span>'}</td>
                <td><strong style="color:${r.colorCode}; font-size:12px;">${d.compositeScore}점</strong></td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
  }
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
  const matrix = generateMaintenanceMatrix(state.emergencyKey, landingSite, state.aircraft);

  document.getElementById("maintOverviewTitle").textContent = matrix.overview;
  document.getElementById("maintDowntime").textContent = `예상 AOG 다운타임: ${matrix.estimatedDowntimeDays}`;
  document.getElementById("maintHubNote").textContent = matrix.hubAdvantageNote;

  const container = document.getElementById("maintStagesList");
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

  document.getElementById("impactQueuedFlights").textContent = `${site.activeQueuedFlights} 편 대기`;
  document.getElementById("impactReroutedFlights").textContent = `${evaluatedItem.trafficConflicts} 대 우회`;

  // Compare to Incheon (worst disruption)
  const maxDelay = 28 * 25; // Incheon delay min
  const currentDelay = evaluatedItem.estimatedScheduleDelayMinTotal;
  const savedMin = Math.max(0, maxDelay - currentDelay);
  document.getElementById("impactSavedTime").textContent = `약 ${savedMin} 분 지연 절감`;

  document.getElementById("impactCostUSD").textContent = `$${evaluatedItem.estimatedDisruptionCostUSD.toLocaleString()} USD`;

  // Populate Airborne Traffic Table with 3-tier colors
  const tbody = document.getElementById("airborneTrafficTbody");
  tbody.innerHTML = "";

  state.trafficList.forEach(trf => {
    const tier = trf.riskTier || (trf.isConflictRisk ? 'danger' : 'safe');
    let tierColor = "#00e676";
    let tierBadge = '<span style="background:#00e67622; color:#00a854; border:1px solid #00e676; padding:1px 5px; border-radius:3px; font-weight:700;">안전</span>';
    let statusDesc = "정상 통과 (안전 간격 확보)";

    if (tier === 'danger' || trf.isConflictRisk) {
      tierColor = "#ff1744";
      tierBadge = '<span style="background:#ff174422; color:#d50000; border:1px solid #ff1744; padding:1px 5px; border-radius:3px; font-weight:700;">위험 (간섭)</span>';
      statusDesc = `+${trf.estimatedDelayMinIfRerouted}분 긴급 우회 (+${trf.fuelBurnPenaltyKg}kg)`;
    } else if (tier === 'caution') {
      tierColor = "#ffaa00";
      tierBadge = '<span style="background:#ffaa0022; color:#b26a00; border:1px solid #ffaa00; padding:1px 5px; border-radius:3px; font-weight:700;">주의 (잠재)</span>';
      statusDesc = `인접 고도 주의 모니터링 (+${trf.estimatedDelayMinIfRerouted}분 우회 가능)`;
    }

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><strong>${trf.callsign}</strong></td>
      <td>${trf.aircraft}</td>
      <td>${trf.origin}➔${trf.dest}</td>
      <td>FL${Math.round(trf.altFt / 100)}</td>
      <td>${tierBadge}</td>
      <td style="color: ${tierColor}; font-weight:600;">
        ${statusDesc}
      </td>
    `;
    tbody.appendChild(row);
  });
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
