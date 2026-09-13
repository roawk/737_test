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
export const AIRBORNE_FLEET_CATALOG = [
  {
    callsign: "KAL721",
    airline: "대한항공",
    aircraft: "B777-300ER",
    origin: "ICN",
    dest: "SIN (싱가포르)",
    baseLat: 37.04,
    baseLng: 126.18,
    heading: 155,
    speedKts: 460,
    cruiseAltFt: 30000,
    passengers: 290,
    vSpeedFpm: -100
  },
  {
    callsign: "AAR102",
    airline: "아시아나",
    aircraft: "A321neo",
    origin: "CJU",
    dest: "GMP (김포)",
    baseLat: 36.42,
    baseLng: 126.55,
    heading: 345,
    speedKts: 380,
    cruiseAltFt: 26000,
    passengers: 180,
    vSpeedFpm: 0
  },
  {
    callsign: "TWB204",
    airline: "티웨이",
    aircraft: "B737-MAX8",
    origin: "GMP",
    dest: "CJU (제주)",
    baseLat: 36.72,
    baseLng: 126.48,
    heading: 195,
    speedKts: 330,
    cruiseAltFt: 25000,
    passengers: 186,
    vSpeedFpm: -300
  },
  {
    callsign: "JNA415",
    airline: "진에어",
    aircraft: "B737-800",
    origin: "PUS",
    dest: "ICN (인천)",
    baseLat: 36.35,
    baseLng: 127.10,
    heading: 330,
    speedKts: 340,
    cruiseAltFt: 18000,
    passengers: 189,
    vSpeedFpm: 200
  },
  {
    callsign: "CPA469",
    airline: "캐세이퍼시픽",
    aircraft: "A350-900",
    origin: "ICN",
    dest: "HKG (홍콩)",
    baseLat: 37.35,
    baseLng: 125.90,
    heading: 205,
    speedKts: 480,
    cruiseAltFt: 38000,
    passengers: 310,
    vSpeedFpm: 0
  },
  {
    callsign: "BX8812",
    airline: "에어부산",
    aircraft: "A321-200",
    origin: "GMP",
    dest: "PUS (부산)",
    baseLat: 36.65,
    baseLng: 127.45,
    heading: 140,
    speedKts: 360,
    cruiseAltFt: 24000,
    passengers: 195,
    vSpeedFpm: 0
  },
  {
    callsign: "KAL1235",
    airline: "대한항공",
    aircraft: "A220-300",
    origin: "RSU (여수)",
    dest: "GMP (김포)",
    baseLat: 35.80,
    baseLng: 126.90,
    heading: 355,
    speedKts: 320,
    cruiseAltFt: 19000,
    passengers: 128,
    vSpeedFpm: 150
  },
  {
    callsign: "OZ114",
    airline: "아시아나",
    aircraft: "A330-300",
    origin: "ICN",
    dest: "KIX (오사카)",
    baseLat: 36.95,
    baseLng: 127.80,
    heading: 115,
    speedKts: 470,
    cruiseAltFt: 33000,
    passengers: 290,
    vSpeedFpm: 0
  },
  {
    callsign: "ZE511",
    airline: "이스타",
    aircraft: "B737-800",
    origin: "CJU",
    dest: "CJJ (청주)",
    baseLat: 35.60,
    baseLng: 127.15,
    heading: 15,
    speedKts: 340,
    cruiseAltFt: 22000,
    passengers: 189,
    vSpeedFpm: -150
  },
  {
    callsign: "DL198",
    airline: "델타항공",
    aircraft: "A350-900",
    origin: "SEA",
    dest: "ICN (인천)",
    baseLat: 37.60,
    baseLng: 127.30,
    heading: 265,
    speedKts: 410,
    cruiseAltFt: 28000,
    passengers: 306,
    vSpeedFpm: -500
  },
  {
    callsign: "JAL954",
    airline: "일본항공",
    aircraft: "B787-8",
    origin: "NRT",
    dest: "PUS (부산)",
    baseLat: 35.15,
    baseLng: 129.50,
    heading: 250,
    speedKts: 420,
    cruiseAltFt: 27000,
    passengers: 186,
    vSpeedFpm: -400
  },
  {
    callsign: "ANA865",
    airline: "전일본공수",
    aircraft: "B787-9",
    origin: "HND",
    dest: "GMP (김포)",
    baseLat: 37.10,
    baseLng: 128.20,
    heading: 285,
    speedKts: 450,
    cruiseAltFt: 34000,
    passengers: 246,
    vSpeedFpm: -200
  }
];

// Runtime dynamic simulation state initialized once per session
let simStartTime = Date.now();

/**
 * Generates neighboring airborne traffic dynamically based on time and current aircraft state.
 * Positions and altitudes move continuously along their headings.
 * Evaluates real-time conflict risk (Danger / Caution / Safe) relative to emergency position.
 */
export function generateSurroundingAirTraffic(emergencyPos = { lat: 36.88, lng: 126.32 }, currentAltFt = 31000) {
  const eLat = typeof emergencyPos.lat === 'number' ? emergencyPos.lat : 36.88;
  const eLng = typeof emergencyPos.lng === 'number' ? emergencyPos.lng : 126.32;
  const alt = typeof currentAltFt === 'number' ? currentAltFt : 31000;

  // Elapsed simulation time in seconds
  const elapsedSec = (Date.now() - simStartTime) / 1000;

  // Update real-time position of all aircraft in the catalog
  const evaluatedTraffic = AIRBORNE_FLEET_CATALOG.map((craft, idx) => {
    // Ground speed in NM/second (e.g. 400 kts = 0.111 NM/s)
    const speedNMperSec = (craft.speedKts / 3600);
    // Distance traveled along heading with periodic looping so planes stay in active airspace (loop every 20-30 min)
    const distanceTraveledNM = (speedNMperSec * elapsedSec) % 70;

    // Heading in radians
    const headingRad = (craft.heading * Math.PI) / 180;
    const dLat = (distanceTraveledNM * Math.cos(headingRad)) / 60;
    const dLng = (distanceTraveledNM * Math.sin(headingRad)) / (60 * Math.cos((craft.baseLat * Math.PI) / 180));

    const curLat = Number((craft.baseLat + dLat).toFixed(4));
    const curLng = Number((craft.baseLng + dLng).toFixed(4));

    // Dynamic altitude fluctuation with micro turbulence (+-300ft)
    const altDrift = Math.sin((elapsedSec + idx * 25) / 15) * 280;
    const curAltFt = Math.max(4000, Math.round(craft.cruiseAltFt + altDrift));

    // Distance to our emergency aircraft in Nautical Miles
    const distToEmergencyNM = calculateDistanceNM(eLat, eLng, curLat, curLng);
    const altDiffFt = Math.abs(curAltFt - alt);

    // Dynamic Conflict Risk Evaluation
    let riskTier = "safe";
    let color = "#00e676";
    let isConflictRisk = false;
    let riskText = "충분한 수평/수직 안전 간격 확보 (안전 통과)";
    let estDelayMin = 6;
    let fuelPenaltyKg = 380;

    if (distToEmergencyNM < 16 && altDiffFt < 2500) {
      // Direct collision / trajectory conflict risk!
      riskTier = "danger";
      color = "#ff1744";
      isConflictRisk = true;
      riskText = `비상기 강하선 인접 통과 중 (${distToEmergencyNM.toFixed(1)} NM / 고도차 ${altDiffFt}ft - 긴급 분리 요망)`;
      estDelayMin = 18;
      fuelPenaltyKg = 1400;
    } else if (distToEmergencyNM < 28 && altDiffFt < 4500) {
      // Potential conflict zone - monitoring required
      riskTier = "caution";
      color = "#ffaa00";
      isConflictRisk = false;
      riskText = `인접 항로 섹터 근접 (${distToEmergencyNM.toFixed(1)} NM / 주의 관제 모니터링)`;
      estDelayMin = 12;
      fuelPenaltyKg = 620;
    } else if (distToEmergencyNM < 45) {
      riskTier = "safe";
      color = "#00e676";
      isConflictRisk = false;
      riskText = `안전 분리 간격 유지 중 (${distToEmergencyNM.toFixed(1)} NM)`;
      estDelayMin = 8;
      fuelPenaltyKg = 450;
    }

    return {
      callsign: craft.callsign,
      airline: craft.airline,
      aircraft: craft.aircraft,
      origin: craft.origin,
      dest: craft.dest,
      lat: curLat,
      lng: curLng,
      altFt: curAltFt,
      heading: craft.heading,
      speedKts: craft.speedKts,
      passengers: craft.passengers,
      distToEmergencyNM: Number(distToEmergencyNM.toFixed(1)),
      altDiffFt,
      riskTier,
      color,
      isConflictRisk,
      riskText,
      estimatedDelayMinIfRerouted: estDelayMin,
      fuelBurnPenaltyKg: fuelPenaltyKg
    };
  });

  // Sort by proximity to emergency aircraft so the most critical aircraft appear at the top
  evaluatedTraffic.sort((a, b) => {
    // Danger first, then caution, then closest distance
    const rank = { danger: 0, caution: 1, safe: 2 };
    if (rank[a.riskTier] !== rank[b.riskTier]) {
      return rank[a.riskTier] - rank[b.riskTier];
    }
    return a.distToEmergencyNM - b.distToEmergencyNM;
  });

  // Always return the top 5~6 closest and most relevant flights to display in the UI
  return evaluatedTraffic.slice(0, 6);
}


