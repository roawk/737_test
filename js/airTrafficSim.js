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

// Distance helper in Nautical Miles (NM)
function calcDistanceNM(lat1, lon1, lat2, lon2) {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return 3440.065 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Scenario-specific commercial flight corridors in Korean airspace (Incheon FIR)
const SCENARIO_TRAFFIC_POOLS = {
  dual_engine_flameout: [
    {
      callsign: "KAL721",
      aircraft: "B777-300ER",
      baseOffsetLat: 0.16,
      baseOffsetLng: -0.14,
      baseAltFt: 29500,
      heading: 145,
      speedKts: 440,
      origin: "ICN",
      dest: "SIN",
      passengers: 290,
      flightVector: [0.08, -0.06]
    },
    {
      callsign: "AAR102",
      aircraft: "A321neo",
      baseOffsetLat: 0.30,
      baseOffsetLng: 0.26,
      baseAltFt: 26000,
      heading: 325,
      speedKts: 360,
      origin: "CJU",
      dest: "GMP",
      passengers: 180,
      flightVector: [-0.07, 0.05]
    },
    {
      callsign: "TWB204",
      aircraft: "B737-MAX8",
      baseOffsetLat: -0.24,
      baseOffsetLng: 0.22,
      baseAltFt: 24800,
      heading: 210,
      speedKts: 290,
      origin: "GMP",
      dest: "CJU",
      passengers: 186,
      flightVector: [0.06, 0.04]
    },
    {
      callsign: "JNA415",
      aircraft: "B737-800",
      baseOffsetLat: -0.45,
      baseOffsetLng: 0.35,
      baseAltFt: 12000,
      heading: 340,
      speedKts: 310,
      origin: "PUS",
      dest: "ICN",
      passengers: 189,
      flightVector: [-0.05, 0.03]
    },
    {
      callsign: "CPA469",
      aircraft: "A350-900",
      baseOffsetLat: 0.50,
      baseOffsetLng: -0.42,
      baseAltFt: 38000,
      heading: 200,
      speedKts: 465,
      origin: "ICN",
      dest: "HKG",
      passengers: 310,
      flightVector: [0.07, -0.04]
    }
  ],
  single_engine_failure: [
    {
      callsign: "KAL1225",
      aircraft: "A220-300",
      baseOffsetLat: -0.12,
      baseOffsetLng: -0.19,
      baseAltFt: 23000,
      heading: 175,
      speedKts: 380,
      origin: "GMP",
      dest: "CJU",
      passengers: 130,
      flightVector: [0.07, -0.05]
    },
    {
      callsign: "AAR8912",
      aircraft: "A330-300",
      baseOffsetLat: 0.22,
      baseOffsetLng: 0.18,
      baseAltFt: 29000,
      heading: 130,
      speedKts: 430,
      origin: "ICN",
      dest: "FUK",
      passengers: 285,
      flightVector: [-0.06, 0.08]
    },
    {
      callsign: "JJA501",
      aircraft: "B737-800",
      baseOffsetLat: -0.34,
      baseOffsetLng: 0.14,
      baseAltFt: 21000,
      heading: 155,
      speedKts: 340,
      origin: "GMP",
      dest: "PUS",
      passengers: 189,
      flightVector: [0.05, 0.04]
    },
    {
      callsign: "ESR302",
      aircraft: "B737-800",
      baseOffsetLat: 0.36,
      baseOffsetLng: -0.26,
      baseAltFt: 18000,
      heading: 335,
      speedKts: 310,
      origin: "CJU",
      dest: "GMP",
      passengers: 175,
      flightVector: [-0.08, 0.03]
    },
    {
      callsign: "ABL801",
      aircraft: "A321-200",
      baseOffsetLat: 0.44,
      baseOffsetLng: 0.36,
      baseAltFt: 34000,
      heading: 205,
      speedKts: 450,
      origin: "ICN",
      dest: "TPE",
      passengers: 195,
      flightVector: [0.04, -0.07]
    }
  ],
  rapid_depressurization: [
    {
      callsign: "KAL018",
      aircraft: "B747-8I",
      baseOffsetLat: 0.14,
      baseOffsetLng: 0.18,
      baseAltFt: 17000,
      heading: 085,
      speedKts: 390,
      origin: "ICN",
      dest: "LAX",
      passengers: 368,
      flightVector: [0.06, 0.07]
    },
    {
      callsign: "AAR201",
      aircraft: "A350-900",
      baseOffsetLat: -0.17,
      baseOffsetLng: -0.15,
      baseAltFt: 11500,
      heading: 310,
      speedKts: 280,
      origin: "SFO",
      dest: "ICN",
      passengers: 300,
      flightVector: [-0.05, -0.05]
    },
    {
      callsign: "TWB705",
      aircraft: "A330-200",
      baseOffsetLat: 0.28,
      baseOffsetLng: -0.30,
      baseAltFt: 25000,
      heading: 215,
      speedKts: 420,
      origin: "ICN",
      dest: "BKK",
      passengers: 270,
      flightVector: [0.08, -0.06]
    },
    {
      callsign: "JNA602",
      aircraft: "B777-200ER",
      baseOffsetLat: -0.36,
      baseOffsetLng: 0.24,
      baseAltFt: 15500,
      heading: 345,
      speedKts: 320,
      origin: "CJU",
      dest: "ICN",
      passengers: 355,
      flightVector: [-0.07, 0.04]
    },
    {
      callsign: "ASV311",
      aircraft: "A320neo",
      baseOffsetLat: 0.40,
      baseOffsetLng: 0.26,
      baseAltFt: 32000,
      heading: 160,
      speedKts: 440,
      origin: "GMP",
      dest: "RSU",
      passengers: 180,
      flightVector: [0.05, 0.06]
    }
  ],
  hydraulic_all_fail: [
    {
      callsign: "KAL903",
      aircraft: "B787-9",
      baseOffsetLat: 0.17,
      baseOffsetLng: -0.22,
      baseAltFt: 28000,
      heading: 295,
      speedKts: 460,
      origin: "ICN",
      dest: "CDG",
      passengers: 269,
      flightVector: [-0.05, -0.08]
    },
    {
      callsign: "AAR521",
      aircraft: "B777-200ER",
      baseOffsetLat: -0.13,
      baseOffsetLng: 0.16,
      baseAltFt: 30500,
      heading: 320,
      speedKts: 450,
      origin: "ICN",
      dest: "LHR",
      passengers: 295,
      flightVector: [-0.08, 0.06]
    },
    {
      callsign: "JJA332",
      aircraft: "B737-800",
      baseOffsetLat: 0.31,
      baseOffsetLng: 0.23,
      baseAltFt: 16500,
      heading: 190,
      speedKts: 310,
      origin: "CJU",
      dest: "CJJ",
      passengers: 189,
      flightVector: [0.06, 0.03]
    },
    {
      callsign: "TWB101",
      aircraft: "B737-800",
      baseOffsetLat: -0.40,
      baseOffsetLng: -0.26,
      baseAltFt: 22000,
      heading: 170,
      speedKts: 350,
      origin: "GMP",
      dest: "CJU",
      passengers: 185,
      flightVector: [0.07, -0.04]
    },
    {
      callsign: "CSN314",
      aircraft: "A321neo",
      baseOffsetLat: 0.46,
      baseOffsetLng: -0.36,
      baseAltFt: 34000,
      heading: 240,
      speedKts: 440,
      origin: "ICN",
      dest: "CAN",
      passengers: 190,
      flightVector: [0.04, -0.08]
    }
  ],
  rudder_hardover: [
    {
      callsign: "KAL551",
      aircraft: "A330-300",
      baseOffsetLat: 0.13,
      baseOffsetLng: 0.14,
      baseAltFt: 31500,
      heading: 210,
      speedKts: 445,
      origin: "ICN",
      dest: "DAD",
      passengers: 275,
      flightVector: [0.07, 0.05]
    },
    {
      callsign: "AAR114",
      aircraft: "A321neo",
      baseOffsetLat: -0.18,
      baseOffsetLng: -0.17,
      baseAltFt: 27500,
      heading: 115,
      speedKts: 410,
      origin: "GMP",
      dest: "KIX",
      passengers: 182,
      flightVector: [-0.04, 0.07]
    },
    {
      callsign: "JNA205",
      aircraft: "B737-MAX8",
      baseOffsetLat: 0.27,
      baseOffsetLng: 0.30,
      baseAltFt: 29000,
      heading: 095,
      speedKts: 420,
      origin: "ICN",
      dest: "NRT",
      passengers: 189,
      flightVector: [-0.02, 0.09]
    },
    {
      callsign: "AFR267",
      aircraft: "B777-300ER",
      baseOffsetLat: -0.34,
      baseOffsetLng: 0.21,
      baseAltFt: 35000,
      heading: 310,
      speedKts: 480,
      origin: "ICN",
      dest: "CDG",
      passengers: 312,
      flightVector: [-0.08, 0.06]
    },
    {
      callsign: "THY090",
      aircraft: "A350-900",
      baseOffsetLat: 0.43,
      baseOffsetLng: -0.32,
      baseAltFt: 14500,
      heading: 120,
      speedKts: 290,
      origin: "IST",
      dest: "ICN",
      passengers: 320,
      flightVector: [0.05, 0.07]
    }
  ]
};

// Generate dynamic neighboring airborne commercial traffic relative to current aircraft position and conditions
// Classified dynamically into 3 tiers: DANGER (Red), CAUTION (Yellow), SAFE (Green)
export function generateSurroundingAirTraffic(aircraftState = { lat: 36.88, lng: 126.32, altitudeFt: 31000 }, emergencyKey = "dual_engine_flameout") {
  const eLat = aircraftState.lat || 36.88;
  const eLng = aircraftState.lng || 126.32;
  const currentAlt = aircraftState.altitudeFt || 31000;
  const speed = aircraftState.groundSpeedKts || 240;
  const wind = aircraftState.windKts !== undefined ? aircraftState.windKts : -15;
  const key = emergencyKey || "dual_engine_flameout";

  const pool = SCENARIO_TRAFFIC_POOLS[key] || SCENARIO_TRAFFIC_POOLS.dual_engine_flameout;

  // Real-time condition influence factors
  // 1. Altitude drift: aircraft positions progress along airway vectors as flight level changes
  const altFactor = (currentAlt - 31000) / 10000; // range approx -2.6 to +0.8
  // 2. Airspeed factor: expands / contracts relative spatial convergence
  const speedFactor = (speed - 240) / 100; // range approx -0.9 to +1.8
  // 3. Wind drift factor: downwind drift component
  const windFactor = (wind - (-15)) / 20; // range approx -0.75 to +2.25

  return pool.map(item => {
    // Dynamic coordinate calculation
    const latShift = item.flightVector[0] * altFactor * 0.9;
    const lngShift = item.flightVector[1] * altFactor * 0.9;
    const speedLat = item.baseOffsetLat * 0.12 * speedFactor;
    const speedLng = item.baseOffsetLng * 0.12 * speedFactor;
    const windLat = windFactor * 0.025;
    const windLng = windFactor * -0.02;

    const trfLat = Number((eLat + item.baseOffsetLat + latShift + speedLat + windLat).toFixed(4));
    const trfLng = Number((eLng + item.baseOffsetLng + lngShift + speedLng + windLng).toFixed(4));

    // Dynamic altitude based on sector profile
    const trfAlt = Math.max(3000, Math.round(item.baseAltFt + (item.flightVector[0] > 0 ? altFactor * 1200 : -altFactor * 800)));

    // Real-time distance and vertical separation
    const distNM = calcDistanceNM(eLat, eLng, trfLat, trfLng);
    const altDiff = Math.abs(currentAlt - trfAlt);

    // Dynamic 3-Tier conflict & risk assessment
    let riskTier = "safe";
    let color = "#00e676";
    let isConflictRisk = false;
    let riskText = "충분한 수평/수직 분리 간격 확보 (안전)";
    let estDelayMin = 6;
    let fuelPenalty = 380;

    if (distNM < 20 && altDiff < 2600) {
      // 1. DANGER (Red): Direct conflict with emergency corridor
      riskTier = "danger";
      color = "#ff1744";
      isConflictRisk = true;
      riskText = `비상 강하 항로 직접 간섭 (거리 ${distNM.toFixed(1)}NM, 고도차 ${altDiff.toLocaleString()}FT - 충돌 위험 / 긴급 우회 요망)`;
      estDelayMin = Math.round(16 + (20 - distNM) * 0.4);
      fuelPenalty = Math.round(1200 + (20 - distNM) * 20);
    } else if (distNM < 35 && altDiff < 5500) {
      // 2. CAUTION (Yellow): Adjacent flight level or convergence zone
      riskTier = "caution";
      color = "#ffaa00";
      isConflictRisk = false;
      riskText = `인접 항로/고도대 통과 중 (거리 ${distNM.toFixed(1)}NM, 고도차 ${altDiff.toLocaleString()}FT - 잠재적 간섭 위험)`;
      estDelayMin = Math.round(10 + (35 - distNM) * 0.3);
      fuelPenalty = Math.round(550 + (35 - distNM) * 15);
    }

    return {
      callsign: item.callsign,
      aircraft: item.aircraft,
      lat: trfLat,
      lng: trfLng,
      altFt: trfAlt,
      heading: item.heading,
      speedKts: item.speedKts,
      origin: item.origin,
      dest: item.dest,
      passengers: item.passengers,
      riskTier,
      color,
      isConflictRisk,
      riskText,
      estimatedDelayMinIfRerouted: estDelayMin,
      fuelBurnPenaltyKg: fuelPenalty
    };
  });
}


