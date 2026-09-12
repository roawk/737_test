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

  const lat = originAirport.lat + (destAirport.lat - originAirport.lat) * t;
  const lng = originAirport.lng + (destAirport.lng - originAirport.lng) * t;

  // Heading towards destination
  const headingDeg = Math.round(calculateBearing(lat, lng, destAirport.lat, destAirport.lng));

  // Distance metrics
  const totalDistanceNM = Math.round(calculateDistanceNM(originAirport.lat, originAirport.lng, destAirport.lat, destAirport.lng));
  const distFromOriginNM = Math.round(totalDistanceNM * t);
  const distToDestNM = Math.round(totalDistanceNM * (1 - t));

  // Flight Phase & Altitude profile simulation
  let flightPhase = "CRUISE";
  let suggestedAltFt = cruiseAltFt;

  if (t < 0.20) {
    flightPhase = "CLIMB (상승)";
    suggestedAltFt = Math.round(5000 + (cruiseAltFt - 5000) * (t / 0.20));
  } else if (t > 0.80) {
    flightPhase = "DESCENT (강하)";
    suggestedAltFt = Math.round(cruiseAltFt - (cruiseAltFt - 4000) * ((t - 0.80) / 0.20));
  } else {
    flightPhase = "CRUISE (순항)";
    suggestedAltFt = cruiseAltFt;
  }

  // Round altitude to nearest 500ft
  suggestedAltFt = Math.round(suggestedAltFt / 500) * 500;

  return {
    lat: Number(lat.toFixed(4)),
    lng: Number(lng.toFixed(4)),
    headingDeg,
    flightPhase,
    suggestedAltFt,
    totalDistanceNM,
    distFromOriginNM,
    distToDestNM,
    progressPercent: Math.round(t * 100)
  };
}
