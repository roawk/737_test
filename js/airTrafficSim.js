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

// Generate dynamic neighboring airborne commercial traffic relative to current aircraft position
export function generateSurroundingAirTraffic(emergencyPos = { lat: 36.88, lng: 126.32 }) {
  const eLat = emergencyPos.lat || 36.88;
  const eLng = emergencyPos.lng || 126.32;

  return [
    {
      callsign: "KAL721",
      aircraft: "B777-300ER",
      lat: Number((eLat + 0.28).toFixed(4)),
      lng: Number((eLng - 0.22).toFixed(4)),
      altFt: 28000,
      heading: 140,
      speedKts: 440,
      origin: "ICN",
      dest: "SIN",
      passengers: 290,
      isConflictRisk: true,
      estimatedDelayMinIfRerouted: 18,
      fuelBurnPenaltyKg: 1400
    },
    {
      callsign: "AAR102",
      aircraft: "A321neo",
      lat: Number((eLat + 0.12).toFixed(4)),
      lng: Number((eLng + 0.35).toFixed(4)),
      altFt: 18000,
      heading: 325,
      speedKts: 360,
      origin: "CJU",
      dest: "GMP",
      passengers: 180,
      isConflictRisk: true,
      estimatedDelayMinIfRerouted: 14,
      fuelBurnPenaltyKg: 650
    },
    {
      callsign: "JNA415",
      aircraft: "B737-800",
      lat: Number((eLat - 0.38).toFixed(4)),
      lng: Number((eLng + 0.25).toFixed(4)),
      altFt: 12000,
      heading: 340,
      speedKts: 310,
      origin: "PUS",
      dest: "ICN",
      passengers: 189,
      isConflictRisk: false,
      estimatedDelayMinIfRerouted: 8,
      fuelBurnPenaltyKg: 380
    },
    {
      callsign: "TWB204",
      aircraft: "B737-MAX8",
      lat: Number((eLat + 0.42).toFixed(4)),
      lng: Number((eLng + 0.45).toFixed(4)),
      altFt: 9000,
      heading: 210,
      speedKts: 260,
      origin: "GMP",
      dest: "CJU",
      passengers: 186,
      isConflictRisk: false,
      estimatedDelayMinIfRerouted: 12,
      fuelBurnPenaltyKg: 490
    },
    {
      callsign: "CPA469",
      aircraft: "A350-900",
      lat: Number((eLat - 0.22).toFixed(4)),
      lng: Number((eLng - 0.42).toFixed(4)),
      altFt: 34000,
      heading: 200,
      speedKts: 460,
      origin: "ICN",
      dest: "HKG",
      passengers: 310,
      isConflictRisk: false,
      estimatedDelayMinIfRerouted: 6,
      fuelBurnPenaltyKg: 520
    }
  ];
}

