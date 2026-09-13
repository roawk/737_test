// Flight Route Management & Aircraft Dynamic Position Engine
// Supports Origin/Destination Selection, Progress Interpolation, and Route Planning

import { calculateDistanceNM, calculateBearing } from "./routeOptimizer.js";

export const AIRPORTS_DIRECTORY = [
  { icao: "RKSS", iata: "GMP", name: "김포국제공항 (Gimpo)", city: "서울/김포", lat: 37.5583, lng: 126.7906 },
  { icao: "RKSI", iata: "ICN", name: "인천국제공항 (Incheon)", city: "인천", lat: 37.4602, lng: 126.4407 },
  { icao: "RKPC", iata: "CJU", name: "제주국제공항 (Jeju)", city: "제주", lat: 33.5113, lng: 126.4930 },
  { icao: "RKPK", iata: "PUS", name: "김해/부산국제공항 (Gimhae)", city: "부산/김해", lat: 35.1795, lng: 128.9382 },
  { icao: "RKTU", iata: "CJJ", name: "청주국제공항 (Cheongju)", city: "청주", lat: 36.7166, lng: 127.4997 },
  { icao: "RKTN", iata: "TAE", name: "대구국제공항 (Daegu)", city: "대구", lat: 35.8941, lng: 128.6590 },
  { icao: "RKJJ", iata: "KWJ", name: "광주공항 (Gwangju)", city: "광주", lat: 35.1264, lng: 126.8089 },
  { icao: "RKSO", iata: "OSN", name: "오산공군기지 (Osan AB)", city: "오산/평택", lat: 37.0903, lng: 127.0303 },
  { icao: "RKNY", iata: "YNY", name: "양양국제공항 (Yangyang)", city: "양양/강원", lat: 38.0614, lng: 128.6692 },
  { icao: "RJFF", iata: "FUK", name: "후쿠오카공항 (Fukuoka)", city: "후쿠오카(일본)", lat: 33.5859, lng: 130.4507 },
  { icao: "RJBB", iata: "KIX", name: "간사이국제공항 (Kansai)", city: "오사카(일본)", lat: 34.4347, lng: 135.2441 }
];

export const POPULAR_ROUTES = [
  {
    id: "GMP_CJU",
    label: "김포(GMP) ➔ 제주(CJU)",
    originIcao: "RKSS",
    destIcao: "RKPC",
    flightNumber: "KE1235",
    plannedCruiseAltFt: 28000,
    typicalProgress: 0.45, // West Coast en-route
    description: "국내 최다 운항 황금 노선 (서해·남해안 통과)"
  },
  {
    id: "ICN_KIX",
    label: "인천(ICN) ➔ 오사카/간사이(KIX)",
    originIcao: "RKSI",
    destIcao: "RJBB",
    flightNumber: "OZ114",
    plannedCruiseAltFt: 33000,
    typicalProgress: 0.35,
    description: "한일 핵심 국제선 (동해/대한해협 횡단)"
  },
  {
    id: "GMP_PUS",
    label: "김포(GMP) ➔ 김해/부산(PUS)",
    originIcao: "RKSS",
    destIcao: "RKPK",
    flightNumber: "BX8811",
    plannedCruiseAltFt: 24000,
    typicalProgress: 0.50,
    description: "내륙 관통 경부축 노선 (중부 산악·영남 회항)"
  },
  {
    id: "ICN_FUK",
    label: "인천(ICN) ➔ 후쿠오카(FUK)",
    originIcao: "RKSI",
    destIcao: "RJFF",
    flightNumber: "7C1402",
    plannedCruiseAltFt: 29000,
    typicalProgress: 0.50,
    description: "남해안·쓰시마 경유 단거리 국제선"
  },
  {
    id: "CJU_GMP",
    label: "제주(CJU) ➔ 김포(GMP)",
    originIcao: "RKPC",
    destIcao: "RKSS",
    flightNumber: "LJ318",
    plannedCruiseAltFt: 27000,
    typicalProgress: 0.50,
    description: "제주 출발 북상 수도권 귀환 노선"
  }
];

export function getAirportByIcao(icao) {
  return AIRPORTS_DIRECTORY.find(a => a.icao === icao) || AIRPORTS_DIRECTORY[0];
}

/**
 * Computes waypoints along the planned route between origin and dest
 */
export function generatePlannedRouteWaypoints(originAirport, destAirport, steps = 24) {
  const waypoints = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lat = originAirport.lat + (destAirport.lat - originAirport.lat) * t;
    const lng = originAirport.lng + (destAirport.lng - originAirport.lng) * t;
    waypoints.push([lat, lng]);
  }
  return waypoints;
}

/**
 * Interpolates flight status (position, heading, altitude) based on progress (0.0 to 1.0)
 */
export function computeFlightPositionAlongRoute(originAirport, destAirport, progressRatio, cruiseAltFt = 31000) {
  const t = Math.max(0.0, Math.min(1.0, progressRatio));

  // Destination and position coordinates
  const lat = originAirport.lat + (destAirport.lat - originAirport.lat) * t;
  const lng = originAirport.lng + (destAirport.lng - originAirport.lng) * t;

  // Heading towards destination (preserve route bearing when aircraft reaches destination)
  const headingDeg = t >= 0.999
    ? Math.round(calculateBearing(originAirport.lat, originAirport.lng, destAirport.lat, destAirport.lng))
    : Math.round(calculateBearing(lat, lng, destAirport.lat, destAirport.lng));

  // Distance metrics
  const totalDistanceNM = Math.round(calculateDistanceNM(originAirport.lat, originAirport.lng, destAirport.lat, destAirport.lng));
  const distFromOriginNM = Math.round(totalDistanceNM * t);
  const distToDestNM = Math.round(totalDistanceNM * (1 - t));

  // Cruising altitude protection: Must always be a realistic flight level (>= 15,000 FT, default 31,000 FT)
  // Cruising altitude represents the flight plan ceiling, NEVER the instantaneous ground altitude.
  const effectiveCruiseAlt = (typeof cruiseAltFt === 'number' && cruiseAltFt >= 15000) ? cruiseAltFt : 31000;

  // Dynamic Flight Phase & Altitude Profile:
  // 1. At 0%: Starts on ground (0 FT, Takeoff/Taxi)
  // 2. 0% -> 25%: Climbs smoothly from 0 FT up to cruise altitude (e.g. 31,000 FT)
  // 3. 25% -> 75%: Cruising at level altitude (effectiveCruiseAlt)
  // 4. 75% -> 100%: Descends smoothly from cruise altitude down to 0 FT
  // 5. At 100%: Touches down at destination runway (0 FT, Touchdown)
  let flightPhase = "CRUISE (순항)";
  let suggestedAltFt = effectiveCruiseAlt;

  if (t <= 0.001) {
    flightPhase = "TAKEOFF (이륙 대기/지상 0 FT)";
    suggestedAltFt = 0;
  } else if (t < 0.25) {
    flightPhase = "CLIMB (상승)";
    suggestedAltFt = Math.round(effectiveCruiseAlt * (t / 0.25));
  } else if (t >= 0.25 && t <= 0.75) {
    flightPhase = "CRUISE (순항)";
    suggestedAltFt = effectiveCruiseAlt;
  } else if (t > 0.75 && t < 0.999) {
    flightPhase = "DESCENT (강하)";
    suggestedAltFt = Math.max(0, Math.round(effectiveCruiseAlt * ((1 - t) / 0.25)));
  } else {
    flightPhase = "TOUCHDOWN (착륙 접지/지상 0 FT)";
    suggestedAltFt = 0;
  }

  // Speed simulation along flight progress
  let suggestedSpeedKts = 280;
  if (t <= 0.001) {
    suggestedSpeedKts = 150;
  } else if (t < 0.25) {
    suggestedSpeedKts = Math.round(150 + (280 - 150) * (t / 0.25));
  } else if (t >= 0.25 && t <= 0.75) {
    suggestedSpeedKts = 280;
  } else if (t > 0.75 && t < 0.999) {
    suggestedSpeedKts = Math.round(280 - (280 - 150) * ((t - 0.75) / 0.25));
  } else {
    suggestedSpeedKts = 150;
  }

  // Realistic fuel burn along route: departure with approx 6,800kg, burning down with distance
  const baseFuel = Math.round(Math.min(14000, 3200 + totalDistanceNM * 14.0));
  const burnedKg = Math.round((baseFuel - 2200) * t);
  const suggestedFuelKg = Math.max(1200, baseFuel - burnedKg);

  // Dynamic realistic wind simulation along route (shifts smoothly as aircraft moves across peninsula)
  // Wind direction shifts from North/NW (320°) towards West (270°) and Southern sea (245°)
  const windDirDeg = Math.round((320 - (t * 70) + (Math.sin(t * Math.PI) * 15) + 360) % 360);
  // Altitude-dependent wind velocity (surface ~8-10 KT, upper flight level 32-40 KT)
  const altFactor = Math.min(1.0, Math.max(0.0, suggestedAltFt / 33000));
  const windSpeedKts = Math.round(10 + 26 * Math.pow(altFactor, 0.75));

  // Calculate headwind/tailwind component along aircraft heading
  // relAngle = angle difference between wind origin direction and aircraft heading
  const relAngleRad = ((windDirDeg - headingDeg) * Math.PI) / 180;
  // Negative = Headwind (맞바람), Positive = Tailwind (뒷바람)
  let suggestedWindKts = Math.round(-Math.cos(relAngleRad) * windSpeedKts);
  suggestedWindKts = Math.max(-35, Math.min(35, suggestedWindKts));

  return {
    lat: Number(lat.toFixed(4)),
    lng: Number(lng.toFixed(4)),
    headingDeg,
    flightPhase,
    suggestedAltFt,
    suggestedSpeedKts,
    suggestedFuelKg,
    suggestedWindKts,
    suggestedWindDirDeg: windDirDeg,
    suggestedWindSpeedKts: windSpeedKts,
    totalDistanceNM,
    distFromOriginNM,
    distToDestNM,
    progressPercent: Math.round(t * 100)
  };
}

/**
 * Determines the airspace, country, flag, and timezone based on aircraft coordinates
 */
export function getAirspaceInfo(lat, lng) {
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return {
      country: "대한민국",
      fir: "Incheon FIR (RKRR)",
      flag: "🇰🇷",
      timeZone: "Asia/Seoul",
      code: "KST",
      utcOffset: "+09:00"
    };
  }

  // 1. North Korea (Pyongyang FIR)
  if (lat > 37.95 && lng >= 124.5 && lng <= 130.5) {
    return {
      country: "북한",
      fir: "Pyongyang FIR (ZKKP)",
      flag: "🇰🇵",
      timeZone: "Asia/Pyongyang",
      code: "KST",
      utcOffset: "+09:00"
    };
  }

  // 2. Japan Airspace (Fukuoka FIR)
  const isJapan = (lng >= 130.5 && lat <= 41.0) ||
                  (lng >= 129.5 && lat <= 35.0) ||
                  (lng >= 128.5 && lat <= 32.5);
  if (isJapan) {
    return {
      country: "일본",
      fir: "Fukuoka FIR (RJJJ)",
      flag: "🇯🇵",
      timeZone: "Asia/Tokyo",
      code: "JST",
      utcOffset: "+09:00"
    };
  }

  // 3. Taiwan Airspace (Taipei FIR)
  if (lat <= 26.0 && lng < 124.0 && lng >= 118.0) {
    return {
      country: "대만",
      fir: "Taipei FIR (RCAA)",
      flag: "🇹🇼",
      timeZone: "Asia/Taipei",
      code: "CST",
      utcOffset: "+08:00"
    };
  }

  // 4. China Airspace (Shanghai / Beijing FIR)
  if (lng < 124.0 && lat >= 24.0) {
    return {
      country: "중국",
      fir: lat > 38 ? "Beijing FIR (ZBPE)" : "Shanghai FIR (ZSHA)",
      flag: "🇨🇳",
      timeZone: "Asia/Shanghai",
      code: "CST",
      utcOffset: "+08:00"
    };
  }

  // 5. Russia Far East (Vladivostok FIR)
  if (lat >= 42.0 || (lat >= 41.0 && lng >= 131.0)) {
    return {
      country: "러시아",
      fir: "Vladivostok FIR (UHWW)",
      flag: "🇷🇺",
      timeZone: "Asia/Vladivostok",
      code: "VLAT",
      utcOffset: "+10:00"
    };
  }

  // Default: South Korea (Incheon FIR)
  return {
    country: "대한민국",
    fir: "Incheon FIR (RKRR)",
    flag: "🇰🇷",
    timeZone: "Asia/Seoul",
    code: "KST",
    utcOffset: "+09:00"
  };
}
