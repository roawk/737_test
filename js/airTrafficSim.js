// Air Traffic & Airport Infrastructure Simulation Module
// Real-world modeled data for East Asia / Korean Airspace

export const LANDING_SITES = [
  {
    id: "RKSI",
    name: "인천국제공항 (Incheon Int'l)",
    icao: "RKSI",
    type: "INTERNATIONAL_AIRPORT",
    lat: 37.4602,
    lng: 126.4407,
    runways: [
      { id: "15R/33L", lengthMeters: 3750, widthMeters: 60, ilsCat: "CAT IIIb" },
      { id: "16/34", lengthMeters: 4000, widthMeters: 60, ilsCat: "CAT IIIb" }
    ],
    maxRunwayLength: 4000,
    arffCategory: 10, // Max firefighting level
    maintenanceHub: true, // Full B737 hangar & maintenance facility
    hubAirlines: ["대한항공", "아시아나", "제주항공", "티웨이"],
    weather: { wind: "320@12kt", vis: "10km+", ceiling: "Overcast 4,000ft", conditions: "GOOD" },
    trafficDensity: "VERY_HIGH", // High schedule disruption penalty
    activeQueuedFlights: 28, // Flights waiting for takeoff/landing
    hourlyDisruptionCostUSD: 140000, // Cost if 1 runway closed for 2 hours
    isOverwaterApproach: true,
  },
  {
    id: "RKSS",
    name: "김포국제공항 (Gimpo Int'l)",
    icao: "RKSS",
    type: "INTERNATIONAL_AIRPORT",
    lat: 37.5583,
    lng: 126.7906,
    runways: [
      { id: "14R/32L", lengthMeters: 3200, widthMeters: 60, ilsCat: "CAT IIIa" },
      { id: "14L/32R", lengthMeters: 3600, widthMeters: 45, ilsCat: "CAT I" }
    ],
    maxRunwayLength: 3600,
    arffCategory: 9,
    maintenanceHub: true,
    hubAirlines: ["대한항공", "아시아나", "제주항공", "에어부산"],
    weather: { wind: "310@10kt", vis: "9km", ceiling: "BKN 3,500ft", conditions: "GOOD" },
    trafficDensity: "HIGH",
    activeQueuedFlights: 19,
    hourlyDisruptionCostUSD: 95000,
    isOverwaterApproach: false,
  },
  {
    id: "RKTU",
    name: "청주국제공항 (Cheongju Int'l)",
    icao: "RKTU",
    type: "CIVIL_MILITARY_AIRPORT",
    lat: 36.7166,
    lng: 127.4997,
    runways: [
      { id: "06R/24L", lengthMeters: 2744, widthMeters: 45, ilsCat: "CAT I" },
      { id: "06L/24R", lengthMeters: 2744, widthMeters: 45, ilsCat: "CAT I" }
    ],
    maxRunwayLength: 2744,
    arffCategory: 8,
    maintenanceHub: true, // Aero K & heavy MRO facility
    hubAirlines: ["에어로케이", "이스타"],
    weather: { wind: "290@08kt", vis: "10km+", ceiling: "SCT 6,000ft", conditions: "EXCELLENT" },
    trafficDensity: "MEDIUM",
    activeQueuedFlights: 6,
    hourlyDisruptionCostUSD: 32000,
    isOverwaterApproach: false,
  },
  {
    id: "RKTP",
    name: "서산비행장 (Seosan Air Base)",
    icao: "RKTP",
    type: "MILITARY_AIRBASE",
    lat: 36.7042,
    lng: 126.4883,
    runways: [
      { id: "02R/20L", lengthMeters: 2743, widthMeters: 45, ilsCat: "TACAN/ILS" }
    ],
    maxRunwayLength: 2743,
    arffCategory: 7, // Military crash rescue
    maintenanceHub: false, // Military only, will require ferry flight later
    hubAirlines: [],
    weather: { wind: "300@11kt", vis: "10km+", ceiling: "FEW 5,000ft", conditions: "EXCELLENT" },
    trafficDensity: "VERY_LOW", // Minimal commercial airline schedule disruption!
    activeQueuedFlights: 1, // Only military alert sortie
    hourlyDisruptionCostUSD: 8000,
    isOverwaterApproach: true,
  },
  {
    id: "RKJK",
    name: "군산공항 (Gunsan Air Base)",
    icao: "RKJK",
    type: "CIVIL_MILITARY_AIRPORT",
    lat: 35.9261,
    lng: 126.6161,
    runways: [
      { id: "18/36", lengthMeters: 2743, widthMeters: 45, ilsCat: "CAT I" }
    ],
    maxRunwayLength: 2743,
    arffCategory: 8,
    maintenanceHub: false,
    hubAirlines: [],
    weather: { wind: "270@09kt", vis: "10km+", ceiling: "SCT 4,500ft", conditions: "GOOD" },
    trafficDensity: "LOW",
    activeQueuedFlights: 3,
    hourlyDisruptionCostUSD: 15000,
    isOverwaterApproach: true,
  },
  {
    id: "RKNY",
    name: "양양국제공항 (Yangyang Int'l)",
    icao: "RKNY",
    type: "INTERNATIONAL_AIRPORT",
    lat: 38.0614,
    lng: 128.6692,
    runways: [
      { id: "15/33", lengthMeters: 2500, widthMeters: 45, ilsCat: "CAT I" }
    ],
    maxRunwayLength: 2500,
    arffCategory: 7,
    maintenanceHub: false,
    hubAirlines: [],
    weather: { wind: "020@14kt", vis: "8km", ceiling: "OVC 3,000ft", conditions: "MODERATE" },
    trafficDensity: "VERY_LOW",
    activeQueuedFlights: 1,
    hourlyDisruptionCostUSD: 6000,
    isOverwaterApproach: true,
  },
  {
    id: "RKPC",
    name: "제주국제공항 (Jeju Int'l)",
    icao: "RKPC",
    iata: "CJU",
    type: "INTERNATIONAL_AIRPORT",
    lat: 33.5113,
    lng: 126.4930,
    runways: [
      { id: "07/25", lengthMeters: 3180, widthMeters: 45, ilsCat: "CAT II" },
      { id: "13/31", lengthMeters: 1900, widthMeters: 45, ilsCat: "CAT I" }
    ],
    maxRunwayLength: 3180,
    arffCategory: 9,
    maintenanceHub: true,
    hubAirlines: ["대한항공", "아시아나", "제주항공", "진에어", "티웨이", "이스타"],
    weather: { wind: "340@14kt", vis: "10km+", ceiling: "FEW 4,000ft", conditions: "GOOD" },
    trafficDensity: "VERY_HIGH",
    activeQueuedFlights: 24,
    hourlyDisruptionCostUSD: 120000,
    isOverwaterApproach: true,
  },
  {
    id: "RKPK",
    name: "김해/부산국제공항 (Gimhae/Busan Int'l)",
    icao: "RKPK",
    iata: "PUS",
    type: "CIVIL_MILITARY_AIRPORT",
    lat: 35.1795,
    lng: 128.9382,
    runways: [
      { id: "18R/36L", lengthMeters: 3200, widthMeters: 60, ilsCat: "CAT II" },
      { id: "18L/36R", lengthMeters: 2744, widthMeters: 45, ilsCat: "CAT I" }
    ],
    maxRunwayLength: 3200,
    arffCategory: 9,
    maintenanceHub: true, // 대한항공 테크센터 (B737 대형 중정비 기지)
    hubAirlines: ["에어부산", "대한항공", "제주항공"],
    weather: { wind: "010@10kt", vis: "10km+", ceiling: "SCT 5,000ft", conditions: "EXCELLENT" },
    trafficDensity: "HIGH",
    activeQueuedFlights: 16,
    hourlyDisruptionCostUSD: 85000,
    isOverwaterApproach: false,
  },
  {
    id: "RKSO",
    name: "오산공군기지 (Osan Air Base)",
    icao: "RKSO",
    iata: "OSN",
    type: "MILITARY_AIRBASE",
    lat: 37.0903,
    lng: 127.0303,
    runways: [
      { id: "09R/27L", lengthMeters: 3200, widthMeters: 45, ilsCat: "TACAN/ILS" },
      { id: "09L/27R", lengthMeters: 2744, widthMeters: 45, ilsCat: "TACAN/ILS" }
    ],
    maxRunwayLength: 3200,
    arffCategory: 9, // US/ROKAF 최상급 비상소방
    maintenanceHub: false,
    hubAirlines: [],
    weather: { wind: "300@08kt", vis: "10km+", ceiling: "FEW 6,000ft", conditions: "EXCELLENT" },
    trafficDensity: "VERY_LOW",
    activeQueuedFlights: 2,
    hourlyDisruptionCostUSD: 10000,
    isOverwaterApproach: false,
  },
  {
    id: "RKTN",
    name: "대구국제공항 (Daegu Int'l)",
    icao: "RKTN",
    iata: "TAE",
    type: "CIVIL_MILITARY_AIRPORT",
    lat: 35.8941,
    lng: 128.6590,
    runways: [
      { id: "13R/31L", lengthMeters: 2755, widthMeters: 45, ilsCat: "CAT I" },
      { id: "13L/31R", lengthMeters: 2755, widthMeters: 45, ilsCat: "CAT I" }
    ],
    maxRunwayLength: 2755,
    arffCategory: 8,
    maintenanceHub: true,
    hubAirlines: ["티웨이"],
    weather: { wind: "280@07kt", vis: "10km+", ceiling: "SKC", conditions: "EXCELLENT" },
    trafficDensity: "MEDIUM",
    activeQueuedFlights: 5,
    hourlyDisruptionCostUSD: 28000,
    isOverwaterApproach: false,
  },
  {
    id: "RKJJ",
    name: "광주공항 (Gwangju Airport)",
    icao: "RKJJ",
    iata: "KWJ",
    type: "CIVIL_MILITARY_AIRPORT",
    lat: 35.1264,
    lng: 126.8089,
    runways: [
      { id: "04R/22L", lengthMeters: 2835, widthMeters: 45, ilsCat: "CAT I" },
      { id: "04L/22R", lengthMeters: 2835, widthMeters: 45, ilsCat: "CAT I" }
    ],
    maxRunwayLength: 2835,
    arffCategory: 8,
    maintenanceHub: false,
    hubAirlines: [],
    weather: { wind: "310@09kt", vis: "10km+", ceiling: "FEW 5,000ft", conditions: "EXCELLENT" },
    trafficDensity: "LOW",
    activeQueuedFlights: 3,
    hourlyDisruptionCostUSD: 18000,
    isOverwaterApproach: false,
  },
  {
    id: "RJFF",
    name: "후쿠오카공항 (Fukuoka Airport)",
    icao: "RJFF",
    iata: "FUK",
    type: "INTERNATIONAL_AIRPORT",
    lat: 33.5859,
    lng: 130.4507,
    runways: [
      { id: "16/34", lengthMeters: 2800, widthMeters: 60, ilsCat: "CAT IIIa" }
    ],
    maxRunwayLength: 2800,
    arffCategory: 9,
    maintenanceHub: true,
    hubAirlines: ["ANA", "JAL"],
    weather: { wind: "350@12kt", vis: "10km+", ceiling: "SCT 4,000ft", conditions: "GOOD" },
    trafficDensity: "HIGH",
    activeQueuedFlights: 15,
    hourlyDisruptionCostUSD: 78000,
    isOverwaterApproach: false,
  },
  {
    id: "RJBB",
    name: "간사이국제공항 (Kansai Int'l)",
    icao: "RJBB",
    iata: "KIX",
    type: "INTERNATIONAL_AIRPORT",
    lat: 34.4347,
    lng: 135.2441,
    runways: [
      { id: "06R/24L", lengthMeters: 3500, widthMeters: 60, ilsCat: "CAT II" },
      { id: "06L/24R", lengthMeters: 4000, widthMeters: 60, ilsCat: "CAT IIIb" }
    ],
    maxRunwayLength: 4000,
    arffCategory: 10,
    maintenanceHub: true,
    hubAirlines: ["ANA", "JAL", "Peach"],
    weather: { wind: "020@11kt", vis: "10km+", ceiling: "FEW 5,000ft", conditions: "EXCELLENT" },
    trafficDensity: "HIGH",
    activeQueuedFlights: 18,
    hourlyDisruptionCostUSD: 98000,
    isOverwaterApproach: true,
  },
  {
    id: "EMERGENCY_SEA_A",
    name: "서해 외연도 인근 안전 해상 (Yellow Sea Ditching Zone Alpha)",
    icao: "DITCH-W1",
    type: "WATER_DITCHING",
    lat: 36.2500,
    lng: 126.0500,
    runways: [
      { id: "OPEN WATER", lengthMeters: 10000, widthMeters: 5000, ilsCat: "VISUAL" }
    ],
    maxRunwayLength: 9999,
    arffCategory: 3,
    maintenanceHub: false,
    hubAirlines: [],
    weather: { wind: "320@16kt", seaState: "Wave 1.2m (Slight)", conditions: "SURVIVABLE" },
    trafficDensity: "NONE",
    activeQueuedFlights: 0,
    hourlyDisruptionCostUSD: 0,
    isOverwaterApproach: true,
  },
  {
    id: "EMERGENCY_SEA_B",
    name: "남해 여서도/제주해협 인근 안전 해상 (South Sea Ditching Zone Bravo)",
    icao: "DITCH-S1",
    type: "WATER_DITCHING",
    lat: 34.0500,
    lng: 127.1000,
    runways: [
      { id: "OPEN WATER", lengthMeters: 10000, widthMeters: 5000, ilsCat: "VISUAL" }
    ],
    maxRunwayLength: 9999,
    arffCategory: 3,
    maintenanceHub: false,
    hubAirlines: [],
    weather: { wind: "330@14kt", seaState: "Wave 1.0m (Moderate)", conditions: "SURVIVABLE" },
    trafficDensity: "NONE",
    activeQueuedFlights: 0,
    hourlyDisruptionCostUSD: 0,
    isOverwaterApproach: true,
  },
  {
    id: "EMERGENCY_FIELD_B",
    name: "당진/서산 간척지 비상 공터 (Dangjin Reclamation Flatland)",
    icao: "OFF-FIELD-1",
    type: "OPEN_TERRAIN",
    lat: 36.8800,
    lng: 126.6500,
    runways: [
      { id: "FLAT DIRT/ASPHALT", lengthMeters: 1600, widthMeters: 40, ilsCat: "VISUAL ONLY" }
    ],
    maxRunwayLength: 1600,
    arffCategory: 1,
    maintenanceHub: false,
    hubAirlines: [],
    weather: { wind: "310@10kt", vis: "10km", conditions: "ROUGH TERRAIN" },
    trafficDensity: "NONE",
    activeQueuedFlights: 0,
    hourlyDisruptionCostUSD: 0,
    isOverwaterApproach: false,
  }
];

// Real-Time Dynamic Commercial Air Traffic Simulation Engine
// Modeled with 18 realistic commercial flights actively cruising Korean / East Asian Airspace
// Each aircraft moves along its actual flight vector in real-time, dynamically updating coordinates,
// altitudes (FL), headings, and conflict risk tiers relative to the emergency aircraft.

import { calculateDistanceNM } from "./routeOptimizer.js";

// Comprehensive catalog of commercial flights in Korean airspace
// Comprehensive catalog of commercial flights in Korean / East Asian airspace
// Rich variety across Domestic FSC, LCC, and International carriers
export const AIRBORNE_FLEET_CATALOG = [
  // 1. Domestic FSC (대형 항공사)
  { callsign: "KAL721", airline: "대한항공", aircraft: "B777-300ER", origin: "ICN", dest: "SIN (싱가포르)", baseSpeedKts: 460, passengers: 290 },
  { callsign: "KAL1235", airline: "대한항공", aircraft: "A220-300", origin: "RSU", dest: "GMP (김포)", baseSpeedKts: 320, passengers: 128 },
  { callsign: "KAL085", airline: "대한항공", aircraft: "B747-8F", origin: "ICN", dest: "ANC (앵커리지)", baseSpeedKts: 480, passengers: 4 },
  { callsign: "AAR102", airline: "아시아나", aircraft: "A321neo", origin: "CJU", dest: "GMP (김포)", baseSpeedKts: 380, passengers: 180 },
  { callsign: "OZ114", airline: "아시아나", aircraft: "A330-300", origin: "ICN", dest: "KIX (오사카)", baseSpeedKts: 450, passengers: 290 },
  { callsign: "AAR731", airline: "아시아나", aircraft: "A350-900", origin: "ICN", dest: "HAN (하노이)", baseSpeedKts: 470, passengers: 311 },

  // 2. Domestic LCC (저비용 항공사)
  { callsign: "JJA127", airline: "제주항공", aircraft: "B737-800", origin: "GMP", dest: "CJU (제주)", baseSpeedKts: 340, passengers: 189 },
  { callsign: "JJA305", airline: "제주항공", aircraft: "B737-MAX8", origin: "ICN", dest: "FUK (후쿠오카)", baseSpeedKts: 350, passengers: 186 },
  { callsign: "JNA415", airline: "진에어", aircraft: "B737-800", origin: "PUS", dest: "ICN (인천)", baseSpeedKts: 340, passengers: 189 },
  { callsign: "JNA102", airline: "진에어", aircraft: "B777-200ER", origin: "ICN", dest: "CJU (제주)", baseSpeedKts: 410, passengers: 393 },
  { callsign: "TWB204", airline: "티웨이", aircraft: "B737-MAX8", origin: "GMP", dest: "CJU (제주)", baseSpeedKts: 330, passengers: 186 },
  { callsign: "TWB701", airline: "티웨이", aircraft: "A330-300", origin: "ICN", dest: "SYD (시드니)", baseSpeedKts: 460, passengers: 347 },
  { callsign: "ABL8812", airline: "에어부산", aircraft: "A321-200", origin: "GMP", dest: "PUS (부산)", baseSpeedKts: 360, passengers: 195 },
  { callsign: "ABL8123", airline: "에어부산", aircraft: "A321neo", origin: "CJU", dest: "GMP (김포)", baseSpeedKts: 370, passengers: 220 },
  { callsign: "EOK211", airline: "에어로케이", aircraft: "A320-200", origin: "CJJ", dest: "NRT (도쿄)", baseSpeedKts: 350, passengers: 180 },
  { callsign: "ESR511", airline: "이스타", aircraft: "B737-800", origin: "CJU", dest: "CJJ (청주)", baseSpeedKts: 340, passengers: 189 },
  { callsign: "ASV705", airline: "에어서울", aircraft: "A321-200", origin: "ICN", dest: "TAK (다카마쓰)", baseSpeedKts: 360, passengers: 195 },
  { callsign: "APZ101", airline: "에어프레미아", aircraft: "B787-9", origin: "ICN", dest: "LAX (로스앤젤레스)", baseSpeedKts: 470, passengers: 309 },

  // 3. International Carriers (외항사)
  { callsign: "CPA469", airline: "캐세이퍼시픽", aircraft: "A350-900", origin: "ICN", dest: "HKG (홍콩)", baseSpeedKts: 480, passengers: 310 },
  { callsign: "DAL198", airline: "델타항공", aircraft: "A350-900", origin: "SEA", dest: "ICN (인천)", baseSpeedKts: 440, passengers: 306 },
  { callsign: "SIA601", airline: "싱가포르항공", aircraft: "B787-10", origin: "ICN", dest: "SIN (싱가포르)", baseSpeedKts: 470, passengers: 337 },
  { callsign: "JAL954", airline: "일본항공", aircraft: "B787-8", origin: "NRT", dest: "PUS (부산)", baseSpeedKts: 420, passengers: 186 },
  { callsign: "ANA865", airline: "전일본공수", aircraft: "B787-9", origin: "HND", dest: "GMP (김포)", baseSpeedKts: 450, passengers: 246 },
  { callsign: "DLH718", airline: "루프트한자", aircraft: "A350-900", origin: "MUC", dest: "ICN (인천)", baseSpeedKts: 460, passengers: 293 },
  { callsign: "UAE342", airline: "에미레이트", aircraft: "A380-800", origin: "DXB", dest: "ICN (인천)", baseSpeedKts: 490, passengers: 516 },
  { callsign: "HVN415", airline: "베트남항공", aircraft: "A321neo", origin: "SGN", dest: "ICN (인천)", baseSpeedKts: 390, passengers: 184 },
  { callsign: "CAL160", airline: "중화항공", aircraft: "A330-300", origin: "TPE", dest: "ICN (인천)", baseSpeedKts: 430, passengers: 307 },
  { callsign: "EVA891", airline: "에바항공", aircraft: "B787-9", origin: "TPE", dest: "ICN (인천)", baseSpeedKts: 450, passengers: 304 },
  { callsign: "UAL893", airline: "유나이티드", aircraft: "B777-200ER", origin: "SFO", dest: "ICN (인천)", baseSpeedKts: 470, passengers: 276 },
  { callsign: "QFA87", airline: "콴타스", aircraft: "A330-300", origin: "SYD", dest: "ICN (인천)", baseSpeedKts: 460, passengers: 297 }
];

// Runtime dynamic simulation session state
let trafficSession = {
  lastCenterLat: null,
  lastCenterLng: null,
  lastAltFt: null,
  lastUpdateTimestamp: Date.now(),
  activePlanes: []
};

/**
 * Resets traffic session to force generation of a fresh non-overlapping batch
 */
export function resetTrafficSession() {
  trafficSession.activePlanes = [];
  trafficSession.lastCenterLat = null;
  trafficSession.lastCenterLng = null;
}

/**
 * Generates neighboring airborne traffic dynamically.
 * Strict user constraints:
 * - Danger (Red): Exactly 1 aircraft
 * - Caution (Yellow): 1 or 2 aircraft (randomized)
 * - Safe (Green): 1 to 3 aircraft (randomized)
 * - Anti-overlap: Radial sector partitioning ensures minimum pairwise distance >= 15 NM.
 * - Anti-repetition: Distinct airlines for every selected flight in the active batch.
 */
export function generateSurroundingAirTraffic(emergencyPos = { lat: 36.88, lng: 126.32 }, currentAltFt = 31000) {
  const eLat = typeof emergencyPos.lat === 'number' ? emergencyPos.lat : (emergencyPos.aircraft?.lat || 36.88);
  const eLng = typeof emergencyPos.lng === 'number' ? emergencyPos.lng : (emergencyPos.aircraft?.lng || 126.32);
  const alt = typeof currentAltFt === 'number' ? currentAltFt : (emergencyPos.altitudeFt || 31000);

  const now = Date.now();
  const needsInit = trafficSession.activePlanes.length === 0;
  const distFromLast = trafficSession.lastCenterLat !== null
    ? calculateDistanceNM(trafficSession.lastCenterLat, trafficSession.lastCenterLng, eLat, eLng)
    : 999;

  // Check if any aircraft has drifted too far away (> 55 NM)
  const hasDriftedTooFar = trafficSession.activePlanes.some(p => {
    return calculateDistanceNM(eLat, eLng, p.lat, p.lng) > 55;
  });

  // Regenerate if initial, or if emergency aircraft moved noticeably (> 7 NM), or out-of-bounds drift
  if (needsInit || distFromLast > 7 || hasDriftedTooFar) {
    trafficSession.lastCenterLat = eLat;
    trafficSession.lastCenterLng = eLng;
    trafficSession.lastAltFt = alt;
    trafficSession.lastUpdateTimestamp = now;

    // 1. Determine Tier Counts strictly according to user prompt:
    const dangerCount = 1; // 빨간색: 무조건 1개
    const cautionCount = Math.random() < 0.5 ? 1 : 2; // 노란색: 1개 또는 2개
    const safeCount = 1 + Math.floor(Math.random() * 3); // 초록색: 1~3개 (1, 2, 3)
    const totalCount = dangerCount + cautionCount + safeCount; // 3 ~ 6대

    // 2. Select diverse aircraft ensuring UNIQUE airlines (no duplicate airlines)
    const shuffledCatalog = [...AIRBORNE_FLEET_CATALOG].sort(() => Math.random() - 0.5);
    const selectedCrafts = [];
    const usedAirlines = new Set();

    for (const craft of shuffledCatalog) {
      if (!usedAirlines.has(craft.airline)) {
        usedAirlines.add(craft.airline);
        selectedCrafts.push(craft);
        if (selectedCrafts.length === totalCount) break;
      }
    }

    // 3. Radial Sector Partitioning (Spatial Anti-Overlap)
    // Distribute planes around a 360-degree circle so they NEVER overlap visually
    const baseAngle = Math.random() * 360;
    const sectorAngle = 360 / totalCount;
    const newPlanes = [];

    for (let i = 0; i < totalCount; i++) {
      const craft = selectedCrafts[i] || shuffledCatalog[i % shuffledCatalog.length];
      let tier = "safe";
      let color = "#00e676";
      let isConflict = false;
      let distNM = 35;
      let planeAlt = alt;
      let heading = 180;
      let riskText = "";
      let estDelayMin = 6;
      let fuelPenaltyKg = 380;

      // Angular sector for this slot (with slight random jitter within sector)
      const bearing = (baseAngle + i * sectorAngle + (Math.random() * 16 - 8) + 360) % 360;

      if (i === 0) {
        // Red / Danger (Exactly 1)
        tier = "danger";
        color = "#ff1744";
        isConflict = true;
        distNM = 9 + Math.random() * 4.5; // 9 ~ 13.5 NM
        const altSign = Math.random() < 0.5 ? 1 : -1;
        const altDiff = 700 + Math.floor(Math.random() * 700); // 700 ~ 1,400 ft diff
        planeAlt = Math.max(3000, alt + (altSign * altDiff));
        // Heading converging / intersecting emergency flight path
        heading = Math.round((bearing + 180 + (Math.random() * 30 - 15) + 360) % 360);
        riskText = `비상기 강하선 인접 통과 중 (${distNM.toFixed(1)} NM / 고도차 ${altDiff}ft - 긴급 분리 요망)`;
        estDelayMin = 18;
        fuelPenaltyKg = 1450;
      } else if (i <= cautionCount) {
        // Yellow / Caution (1 or 2)
        tier = "caution";
        color = "#ffaa00";
        isConflict = false;
        distNM = 20 + Math.random() * 6.5; // 20 ~ 26.5 NM
        const altSign = Math.random() < 0.5 ? 1 : -1;
        const altDiff = 2600 + Math.floor(Math.random() * 1200); // 2,600 ~ 3,800 ft diff
        planeAlt = Math.max(4000, alt + (altSign * altDiff));
        heading = Math.round((bearing + 120 + (Math.random() * 40 - 20) + 360) % 360);
        riskText = `인접 항로 섹터 근접 (${distNM.toFixed(1)} NM / 주의 관제 모니터링)`;
        estDelayMin = 12;
        fuelPenaltyKg = 640;
      } else {
        // Green / Safe (1 ~ 3)
        tier = "safe";
        color = "#00e676";
        isConflict = false;
        distNM = 33 + Math.random() * 13; // 33 ~ 46 NM
        const safeFLs = [19000, 24000, 27000, 33000, 35000, 39000];
        planeAlt = safeFLs[Math.floor(Math.random() * safeFLs.length)];
        heading = Math.round((Math.random() * 360));
        riskText = `충분한 수평/수직 안전 간격 확보 (${distNM.toFixed(1)} NM / 안전 통과)`;
        estDelayMin = 6;
        fuelPenaltyKg = 360;
      }

      // Convert polar (bearing, distance) to cartesian geographic coordinates
      const dLat = (distNM * Math.cos((bearing * Math.PI) / 180)) / 60;
      const dLng = (distNM * Math.sin((bearing * Math.PI) / 180)) / (60 * Math.cos((eLat * Math.PI) / 180));
      const curLat = Number((eLat + dLat).toFixed(4));
      const curLng = Number((eLng + dLng).toFixed(4));

      newPlanes.push({
        callsign: craft.callsign,
        airline: craft.airline,
        aircraft: craft.aircraft,
        origin: craft.origin,
        dest: craft.dest,
        lat: curLat,
        lng: curLng,
        altFt: planeAlt,
        baseAltFt: planeAlt,
        altPhase: Math.random() * Math.PI * 2,
        heading,
        speedKts: craft.baseSpeedKts,
        passengers: craft.passengers,
        distToEmergencyNM: Number(distNM.toFixed(1)),
        altDiffFt: Math.abs(planeAlt - alt),
        riskTier: tier,
        color,
        isConflictRisk: isConflict,
        riskText,
        estimatedDelayMinIfRerouted: estDelayMin,
        fuelBurnPenaltyKg: fuelPenaltyKg
      });
    }

    trafficSession.activePlanes = newPlanes;
  } else {
    // Kinematic real-time step for active planes (every 3 seconds)
    const dtSec = Math.max(0.1, Math.min(10, (now - trafficSession.lastUpdateTimestamp) / 1000));
    trafficSession.lastUpdateTimestamp = now;

    trafficSession.activePlanes.forEach(craft => {
      const speedNMperSec = craft.speedKts / 3600;
      const stepDistNM = speedNMperSec * dtSec;
      const hRad = (craft.heading * Math.PI) / 180;
      const dLat = (stepDistNM * Math.cos(hRad)) / 60;
      const dLng = (stepDistNM * Math.sin(hRad)) / (60 * Math.cos((craft.lat * Math.PI) / 180));

      craft.lat = Number((craft.lat + dLat).toFixed(4));
      craft.lng = Number((craft.lng + dLng).toFixed(4));

      // Gentle realistic micro-altitude float (+-60ft)
      craft.altFt = Math.round(craft.baseAltFt + Math.sin(now / 3500 + craft.altPhase) * 60);

      // Distance and altitude difference relative to emergency craft
      craft.distToEmergencyNM = Number(calculateDistanceNM(eLat, eLng, craft.lat, craft.lng).toFixed(1));
      craft.altDiffFt = Math.abs(craft.altFt - alt);
    });
  }

  // Sort: Danger first, then Caution, then Safe, then closest distance
  const tierRank = { danger: 0, caution: 1, safe: 2 };
  const sorted = [...trafficSession.activePlanes].sort((a, b) => {
    if (tierRank[a.riskTier] !== tierRank[b.riskTier]) {
      return tierRank[a.riskTier] - tierRank[b.riskTier];
    }
    return a.distToEmergencyNM - b.distToEmergencyNM;
  });

  return sorted;
}


