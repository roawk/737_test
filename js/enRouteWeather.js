// Real-time En-Route Route Weather & METAR Simulation Module
// Computes atmospheric layer conditions (OAT, Jetstream, Turbulence, Icing) and airport METARs

import { getAirportByIcao } from "./flightRouteManager.js";
import { LANDING_SITES } from "./airTrafficSim.js";

/**
 * Computes standard atmospheric conditions based on flight level and wind
 */
export function calculateEnRouteAtmosphere(altitudeFt, windKts, headingDeg = 180) {
  // ISA Temperature lapse rate (-1.98°C per 1,000ft up to 36,089ft)
  const clampedAlt = Math.min(39000, Math.max(0, altitudeFt));
  const isaTemp = 15 - (clampedAlt / 1000) * 1.98;
  const oatCelsius = Math.round(isaTemp - 2.5); // Slight regional cool anomaly

  // Upper jetstream wind computation
  const windFactor = Math.min(1.8, Math.max(0.7, clampedAlt / 25000));
  const upperWindSpeed = Math.round(Math.abs(windKts) * 1.6 * windFactor) + 12;
  const upperWindDir = (headingDeg + 85) % 360;

  // Turbulence calculation (CAT - Clear Air Turbulence index)
  let turbulenceLabel = "NONE / SMOOTH";
  let turbulenceClass = "good";
  let turbulenceDesc = "기류 안정 (EDR 0.08)";

  if (upperWindSpeed >= 40 || Math.abs(windKts) >= 25) {
    turbulenceLabel = "MODERATE CAT";
    turbulenceClass = "caution";
    turbulenceDesc = "청천난류 주의 (EDR 0.24)";
  } else if (upperWindSpeed >= 25 || Math.abs(windKts) >= 15) {
    turbulenceLabel = "MILD / LIGHT";
    turbulenceClass = "mild";
    turbulenceDesc = "경미한 흔들림 (EDR 0.15)";
  }

  // Icing risk calculation (Highest risk between 0°C and -20°C in visible moisture)
  let icingLabel = "NONE";
  let icingClass = "good";
  let icingDesc = "착빙 고도 통과 / 건조";

  if (oatCelsius >= -20 && oatCelsius <= 0 && clampedAlt <= 22000) {
    icingLabel = "LIGHT / MODERATE";
    icingClass = "caution";
    icingDesc = "빙결층 통과 (Engine A/I 권고)";
  }

  return {
    oatCelsius,
    isaDeviation: (oatCelsius - isaTemp).toFixed(1),
    upperWindSpeed,
    upperWindDir,
    turbulenceLabel,
    turbulenceClass,
    turbulenceDesc,
    icingLabel,
    icingClass,
    icingDesc
  };
}

/**
 * Updates the Weather HUD Popup with active route, altitude, and diversion airport weather
 */
export function updateWeatherHudUI(state) {
  const popup = document.getElementById("weatherHudPopup");
  if (!popup) return;

  const { originIcao, destIcao } = state.flightPlan;
  const orig = getAirportByIcao(originIcao);
  const dest = getAirportByIcao(destIcao);

  // 1. Atmosphere at current aircraft position
  const atmo = calculateEnRouteAtmosphere(state.aircraft.altitudeFt, state.aircraft.windKts, state.aircraft.headingDeg);

  const oatEl = document.getElementById("wxOatVal");
  if (oatEl) oatEl.textContent = `${atmo.oatCelsius > 0 ? '+' : ''}${atmo.oatCelsius}°C`;

  const isaEl = document.getElementById("wxIsaVal");
  if (isaEl) isaEl.textContent = `ISA ${atmo.isaDeviation > 0 ? '+' : ''}${atmo.isaDeviation}°C`;

  const windEl = document.getElementById("wxWindVal");
  if (windEl) windEl.textContent = `${atmo.upperWindDir}° / ${atmo.upperWindSpeed} KT`;

  const windTypeEl = document.getElementById("wxWindTypeVal");
  if (windTypeEl) {
    const windText = state.aircraft.windKts < 0 ? `정풍 (Headwind ${Math.abs(state.aircraft.windKts)}KT)` : `배풍 (Tailwind ${state.aircraft.windKts}KT)`;
    windTypeEl.textContent = windText;
  }

  const turbEl = document.getElementById("wxTurbVal");
  if (turbEl) {
    turbEl.textContent = atmo.turbulenceLabel;
    turbEl.className = `wx-val ${atmo.turbulenceClass}`;
  }

  const icingEl = document.getElementById("wxIcingVal");
  if (icingEl) {
    icingEl.textContent = atmo.icingLabel;
    icingEl.className = `wx-val ${atmo.icingClass}`;
  }

  // 2. Departure Airport Weather
  const depSite = LANDING_SITES.find(s => s.icao === orig.icao) || { weather: { wind: "310@10kt", vis: "10km+", ceiling: "FEW 4,000ft", conditions: "GOOD" } };
  const depCodeEl = document.getElementById("wxDepCode");
  if (depCodeEl) depCodeEl.textContent = `${orig.name} (${orig.iata || orig.icao})`;

  const depMetarEl = document.getElementById("wxDepMetar");
  if (depMetarEl) {
    depMetarEl.textContent = `바람: ${depSite.weather.wind} • 시정: ${depSite.weather.vis || '10km+'} • 운저: ${depSite.weather.ceiling || 'SCT 4,500ft'} • 상태: ${depSite.weather.conditions}`;
  }

  // 3. En-route Sector Weather
  const enrSectorEl = document.getElementById("wxEnrSector");
  if (enrSectorEl) {
    const lat = state.aircraft.lat;
    let sectorName = "서해/중부 내륙 항로 섹터";
    if (lat < 35.0) sectorName = "남해안/제주해협 항로 섹터 (Y71/B576)";
    else if (lat > 37.0) sectorName = "수도권/경기만 항로 섹터 (TMA)";
    else sectorName = "충청/호남 내륙 통과 항로 섹터";
    enrSectorEl.textContent = sectorName;
  }

  const enrMetarEl = document.getElementById("wxEnrMetar");
  if (enrMetarEl) {
    const cloudText = state.aircraft.altitudeFt >= 28000 ? "상층 권운 (Cirrus) 양호 • 윈드시어 없음" : "중층 적운층 통과 • 시정 8km";
    enrMetarEl.textContent = `${cloudText} • ${atmo.turbulenceDesc}`;
  }

  // 4. Destination Airport Weather
  const destSite = LANDING_SITES.find(s => s.icao === dest.icao) || { weather: { wind: "340@12kt", vis: "10km+", ceiling: "FEW 4,000ft", conditions: "GOOD" } };
  const arrCodeEl = document.getElementById("wxArrCode");
  if (arrCodeEl) arrCodeEl.textContent = `${dest.name} (${dest.iata || dest.icao})`;

  const arrMetarEl = document.getElementById("wxArrMetar");
  if (arrMetarEl) {
    arrMetarEl.textContent = `바람: ${destSite.weather.wind} • 시정: ${destSite.weather.vis || '10km+'} • 운저: ${destSite.weather.ceiling || 'SCT 5,000ft'} • 상태: ${destSite.weather.conditions}`;
  }

  // 5. Alternate 1st Rank Landing Site Weather
  const topRec = state.evaluationResult?.topRecommendations?.alpha?.data?.site;
  if (topRec) {
    const altCodeEl = document.getElementById("wxAltCode");
    if (altCodeEl) altCodeEl.textContent = `${topRec.name} (${topRec.icao})`;

    const altMetarEl = document.getElementById("wxAltMetar");
    if (altMetarEl) {
      altMetarEl.textContent = `바람: ${topRec.weather.wind} • 시정: ${topRec.weather.vis || topRec.weather.seaState || '10km+'} • ARFF Cat ${topRec.arffCategory}`;
    }
  }

  // 6. Mini Pill summary text
  const miniEl = document.getElementById("weatherHudMini");
  if (miniEl) {
    const summarySpan = miniEl.querySelector("span");
    if (summarySpan) {
      summarySpan.innerHTML = `항로 기상: <strong>OAT ${atmo.oatCelsius}°C | ${atmo.upperWindDir}° ${atmo.upperWindSpeed}KT | ${atmo.turbulenceLabel}</strong>`;
    }
  }
}
