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
    arffCategory: 3, // Coast guard patrol cutter (KCG) ~20-30 min response
    maintenanceHub: false,
    hubAirlines: [],
    weather: { wind: "320@16kt", seaState: "Wave 1.2m (Slight)", conditions: "SURVIVABLE" },
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
    arffCategory: 1, // Local rural fire brigade (15+ min)
    maintenanceHub: false,
    hubAirlines: [],
    weather: { wind: "310@10kt", vis: "10km", conditions: "ROUGH TERRAIN" },
    trafficDensity: "NONE",
    activeQueuedFlights: 0,
    hourlyDisruptionCostUSD: 0,
    isOverwaterApproach: false,
  }
];

// Generate dynamic neighboring airborne commercial traffic around the Korean West Coast corridor
export function generateSurroundingAirTraffic(emergencyPos) {
  return [
    {
      callsign: "KAL721",
      aircraft: "B777-300ER",
      lat: 37.15,
      lng: 126.35,
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
      lat: 36.95,
      lng: 126.85,
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
      lat: 36.40,
      lng: 126.70,
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
      lat: 37.38,
      lng: 126.90,
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
      lat: 36.60,
      lng: 125.90,
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
