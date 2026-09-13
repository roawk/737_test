// Real-time En-Route Route Weather & METAR Simulation Module
// Dynamically computes atmospheric conditions (OAT, ISA deviation, Jetstream, Turbulence, Icing)
// and airport METARs based on aircraft GPS coordinates, route sector, altitude, and heading.

import { getAirportByIcao } from "./flightRouteManager.js";
import { LANDING_SITES } from "./airTrafficSim.js";

/**
 * Computes standard atmospheric conditions based on flight level, geographical coordinates, and wind
 */
export function calculateEnRouteAtmosphere(
  altitudeFt, 
  windKts, 
  headingDeg = 180, 
  customWindDir = null, 
  customWindSpeed = null,
  lat = 36.5,
  lng = 127.5,
  progress = 0.5
) {
  const clampedAlt = Math.min(41000, Math.max(0, altitudeFt));

  // Regional latitude temperature bias:
  // Southern maritime (lat 33.5) is ~4°C warmer than Northern (lat 38.0)
  const latBias = (36.0 - lat) * 0.9;
  // Maritime warming over sea / Japan
  const seaBias = (lng > 129.0) ? 1.2 : 0.0;
  // Progress micro-fluctuation along route
  const localWave = Math.sin(progress * Math.PI * 2) * 1.0;

  // ISA Standard Temperature lapse rate (-1.98°C per 1,000ft up to 36,089ft)
  const isaTemp = 15.0 - (clampedAlt / 1000.0) * 1.98;
  const isaAnomaly = Number((-2.0 + latBias + seaBias + localWave).toFixed(1));
  const oatCelsius = Math.round(isaTemp + isaAnomaly);
  const isaDeviation = Number((oatCelsius - isaTemp).toFixed(1));

  // Upper / Flight Level Wind
  const upperWindSpeed = typeof customWindSpeed === 'number' ? customWindSpeed : 35;
  const upperWindDir = typeof customWindDir === 'number' ? customWindDir : ((headingDeg + 85) % 360);

  // Turbulence calculation with realistic EDR (Eddy Dissipation Rate)
  let turbulenceLabel = "NONE / SMOOTH";
  let turbulenceClass = "good";
  let turbulenceDesc = "기류 안정 (EDR 0.06)";
  let edrVal = 0.06;

  // Geographic turbulence triggers:
  // Mountain wave over inland Sobaek/Taebaek ranges (lat 35.4~37.0, lng 127.2~128.8)
  const isMountainSector = (lat >= 35.4 && lat <= 37.0 && lng >= 127.2 && lng <= 128.8);
  // Jetstream boundary shear over East Sea/Japan corridor (lng > 129.0 and alt >= 26000)
  const isJetstreamShear = (lng > 129.0 && clampedAlt >= 26000);
  // Boundary layer convective chop during climb/descent (4,000ft ~ 14,000ft)
  const isBoundaryChop = (clampedAlt >= 4000 && clampedAlt <= 14000);

  if (isJetstreamShear && upperWindSpeed >= 40) {
    edrVal = Number((0.24 + Math.sin(progress * 7) * 0.04).toFixed(2));
    turbulenceLabel = "MODERATE CAT";
    turbulenceClass = "caution";
    turbulenceDesc = `제트기류 청천난류 (EDR ${edrVal})`;
  } else if (isMountainSector && clampedAlt >= 18000) {
    edrVal = Number((0.20 + Math.cos(progress * 5) * 0.03).toFixed(2));
    turbulenceLabel = "MILD / LIGHT";
    turbulenceClass = "mild";
    turbulenceDesc = `산악 파동 요란 (EDR ${edrVal})`;
  } else if (isBoundaryChop) {
    edrVal = Number((0.15 + Math.sin(progress * 4) * 0.03).toFixed(2));
    turbulenceLabel = "LIGHT CHOP";
    turbulenceClass = "mild";
    turbulenceDesc = `대기 경계층 요란 (EDR ${edrVal})`;
  } else if (upperWindSpeed >= 40 || Math.abs(windKts) >= 25) {
    edrVal = 0.22;
    turbulenceLabel = "MODERATE CAT";
    turbulenceClass = "caution";
    turbulenceDesc = `상층 기류 요란 (EDR ${edrVal})`;
  } else {
    edrVal = Number((0.06 + (clampedAlt / 35000.0) * 0.03).toFixed(2));
    turbulenceLabel = "SMOOTH / STABLE";
    turbulenceClass = "good";
    turbulenceDesc = `기류 양호 (EDR ${edrVal})`;
  }

  // Icing risk calculation based on temperature, altitude, and moisture
  let icingLabel = "NONE";
  let icingClass = "good";
  let icingDesc = "결빙 위험 없음 (안티아이스 대기)";

  if (clampedAlt > 24000) {
    icingLabel = "NONE / DRY";
    icingClass = "good";
    icingDesc = "극저온 건조 대기 (결빙 구역 이탈)";
  } else if (clampedAlt <= 3000) {
    icingLabel = "NONE / LOW ALT";
    icingClass = "good";
    icingDesc = "영상 기온 지표면 (결빙 위험 무관)";
  } else if (oatCelsius >= -20 && oatCelsius <= 0) {
    if (lat < 35.0 || lng > 129.0) {
      // Over moist sea
      icingLabel = "MODERATE ICING";
      icingClass = "danger";
      icingDesc = "해상 다습 빙결층 (Engine & Wing A/I 필수)";
    } else {
      icingLabel = "LIGHT ICING";
      icingClass = "caution";
      icingDesc = "구름층 통과 빙결 (Engine A/I ON 권고)";
    }
  } else if (oatCelsius > 0 && oatCelsius <= 5) {
    icingLabel = "TRACE ICING";
    icingClass = "mild";
    icingDesc = "빙결 전이층 통과 (기온 모니터링)";
  }

  return {
    oatCelsius,
    isaDeviation: `${isaDeviation > 0 ? '+' : ''}${isaDeviation}`,
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
 * Resolves detailed en-route sector name, condition pill, and weather description
 */
export function getEnRouteSectorDetails(lat, lng, altitudeFt, orig, dest, progress) {
  let sectorName = "서해/중부 내륙 항로 섹터";
  let condLabel = "순항 양호";
  let condClass = "good";
  let metarDesc = "상층 권운 양호 • 윈드시어 없음";

  if (lng > 132.0) {
    sectorName = "세토내해/간사이 관제권 (Kansai TMA)";
    condLabel = altitudeFt < 10000 ? "KIX 접근" : "고밀도 순항";
    condClass = "caution";
    metarDesc = "오사카만 해상 기류 • 태평양 편서풍 순항 • 권층운 양호";
  } else if (lng > 129.5 && lat < 34.5) {
    sectorName = "일본 규슈/후쿠오카 관제권 (FUK TMA)";
    condLabel = altitudeFt < 10000 ? "FUK 진입" : "해상 순항";
    condClass = "caution";
    metarDesc = "하카타만 해풍 변환층 • 하강 기류 모니터링 • 시정 10km+";
  } else if (lng > 128.8) {
    sectorName = "대한해협/쓰시마 국제 회랑 (A593/GONAV)";
    condLabel = "FIR 이양점";
    condClass = "good";
    metarDesc = "한일 관제 이양(SAPRA) • 강한 제트기류 코어(265°) 통과";
  } else if (lat > 37.0) {
    sectorName = "수도권/경기만 항로 섹터 (Seoul TMA)";
    condLabel = altitudeFt < 10000 ? "터미널 관제" : "VFR / 양호";
    condClass = "good";
    metarDesc = "비행고도별 관제 간격 유지 • 경기만 북서풍 기류 • 시정 9~10km";
  } else if (lat < 34.0) {
    sectorName = "제주 광역 접근권역 (Jeju TMA)";
    condLabel = altitudeFt < 10000 ? "CJU 접근" : "해상 기류";
    condClass = "good";
    metarDesc = "한라산 배후 와류(Mountain Eddy) 주의 • 남서풍 유입 • 시정 양호";
  } else if (lat < 35.2) {
    sectorName = "남해안/제주해협 해상 회랑 (Y71/B576)";
    condLabel = "해상 순항";
    condClass = "good";
    metarDesc = "해상 전선대 통과 • 운저 4,500ft 적운(Cumulus) • 기압계 안정";
  } else if (lng > 128.0) {
    sectorName = "영남/낙동강 분지 항로 섹터 (Sector 3)";
    condLabel = "내륙 순항";
    condClass = "good";
    metarDesc = "영남 내륙 항로 수렴 • 분지 지형 기류 • 권적운 산재";
  } else {
    sectorName = "충청/호남 내륙 관통 섹터 (B576/Z51)";
    condLabel = altitudeFt >= 20000 ? "산악파 주의" : "구름층 통과";
    condClass = "mild";
    metarDesc = "소백산맥 통과 산악 파동(Mountain Wave) • EDR 변동 • 중층 고적운";
  }

  // Adjust condition pill for departure/arrival phase
  if (altitudeFt <= 1000) {
    condLabel = progress > 0.5 ? "착륙 접지" : "이륙/상승";
    condClass = "good";
  }

  return { sectorName, condLabel, condClass, metarDesc };
}

/**
 * Updates the Weather HUD Popup with active route, altitude, and diversion airport weather
 */
export function updateWeatherHudUI(state) {
  const popup = document.getElementById("weatherHudPopup");
  if (!popup) return;

  const { originIcao, destIcao, progress } = state.flightPlan;
  const orig = getAirportByIcao(originIcao);
  const dest = getAirportByIcao(destIcao);

  // 1. Atmosphere at current aircraft position
  const atmo = calculateEnRouteAtmosphere(
    state.aircraft.altitudeFt, 
    state.aircraft.windKts, 
    state.aircraft.headingDeg,
    state.aircraft.windDirDeg,
    state.aircraft.windSpeedKts,
    state.aircraft.lat,
    state.aircraft.lng,
    typeof progress === 'number' ? progress : 0.5
  );

  const oatEl = document.getElementById("wxOatVal");
  if (oatEl) oatEl.textContent = `${atmo.oatCelsius > 0 ? '+' : ''}${atmo.oatCelsius}°C`;

  const isaEl = document.getElementById("wxIsaVal");
  if (isaEl) isaEl.textContent = `ISA ${atmo.isaDeviation}°C`;

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
    const turbSmall = turbEl.parentElement ? turbEl.parentElement.querySelector("small") : null;
    if (turbSmall) turbSmall.textContent = atmo.turbulenceDesc;
  }

  const icingEl = document.getElementById("wxIcingVal");
  if (icingEl) {
    icingEl.textContent = atmo.icingLabel;
    icingEl.className = `wx-val ${atmo.icingClass}`;
    const icingSmall = icingEl.parentElement ? icingEl.parentElement.querySelector("small") : null;
    if (icingSmall) icingSmall.textContent = atmo.icingDesc;
  }

  // 2. Departure Airport Weather
  const depSite = LANDING_SITES.find(s => s.icao === orig.icao) || { weather: { wind: "310@10kt", vis: "10km+", ceiling: "FEW 4,000ft", conditions: "GOOD" } };
  const depCodeEl = document.getElementById("wxDepCode");
  if (depCodeEl) depCodeEl.textContent = `${orig.name} (${orig.iata || orig.icao})`;

  const depCondEl = document.getElementById("wxDepCond");
  if (depCondEl) {
    depCondEl.textContent = depSite.weather.conditions === 'EXCELLENT' ? 'VFR / 최적' : 'VFR / 양호';
    depCondEl.className = `wx-condition-pill good`;
  }

  const depMetarEl = document.getElementById("wxDepMetar");
  if (depMetarEl) {
    depMetarEl.textContent = `바람: ${depSite.weather.wind} • 시정: ${depSite.weather.vis || '10km+'} • 운저: ${depSite.weather.ceiling || 'SCT 4,500ft'} • 상태: ${depSite.weather.conditions}`;
  }

  // 3. En-route Sector Weather
  const sectorDetails = getEnRouteSectorDetails(
    state.aircraft.lat,
    state.aircraft.lng,
    state.aircraft.altitudeFt,
    orig,
    dest,
    typeof progress === 'number' ? progress : 0.5
  );

  const enrSectorEl = document.getElementById("wxEnrSector");
  if (enrSectorEl) enrSectorEl.textContent = sectorDetails.sectorName;

  const enrCondEl = document.getElementById("wxEnrCond");
  if (enrCondEl) {
    enrCondEl.textContent = sectorDetails.condLabel;
    enrCondEl.className = `wx-condition-pill ${sectorDetails.condClass}`;
  }

  const enrMetarEl = document.getElementById("wxEnrMetar");
  if (enrMetarEl) enrMetarEl.textContent = sectorDetails.metarDesc;

  // 4. Destination Airport Weather
  const destSite = LANDING_SITES.find(s => s.icao === dest.icao) || { weather: { wind: "340@12kt", vis: "10km+", ceiling: "FEW 4,000ft", conditions: "GOOD" } };
  const arrCodeEl = document.getElementById("wxArrCode");
  if (arrCodeEl) arrCodeEl.textContent = `${dest.name} (${dest.iata || dest.icao})`;

  const arrCondEl = document.getElementById("wxArrCond");
  if (arrCondEl) {
    arrCondEl.textContent = destSite.weather.conditions === 'EXCELLENT' ? 'ILS 착륙 최적' : 'ILS 접근 가능';
    arrCondEl.className = `wx-condition-pill good`;
  }

  const arrMetarEl = document.getElementById("wxArrMetar");
  if (arrMetarEl) {
    arrMetarEl.textContent = `바람: ${destSite.weather.wind} • 시정: ${destSite.weather.vis || '10km+'} • 운저: ${destSite.weather.ceiling || 'SCT 5,000ft'} • 상태: ${destSite.weather.conditions}`;
  }

  // 5. Alternate 1st Rank Landing Site Weather
  const topRec = state.evaluationResult?.topRecommendations?.alpha?.data?.site;
  if (topRec) {
    const altCodeEl = document.getElementById("wxAltCode");
    if (altCodeEl) altCodeEl.textContent = `${topRec.name} (${topRec.icao})`;

    const altCondEl = document.getElementById("wxAltCond");
    if (altCondEl) {
      altCondEl.textContent = '비상 접지 1순위';
      altCondEl.className = `wx-condition-pill good`;
    }

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
