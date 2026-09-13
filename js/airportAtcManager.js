// Airport Real-Time ATC Schedule & Runway Management Simulation Engine
// Modeled for Major Korean & Regional Airports: RKSI (Incheon), RKSS (Gimpo), RKPC (Jeju), RKPK (Gimhae), RKTU (Cheongju), RKTN (Daegu)

export const AIRPORT_ATC_DATA = {
  RKSI: {
    id: "RKSI",
    iata: "ICN",
    name: "인천국제공항 (Incheon Int'l)",
    trafficDensity: "VERY_HIGH",
    hourlyDisruptionCostUSD: 140000,
    runways: [
      {
        id: "15R/33L",
        lengthMeters: 3750,
        widthMeters: 60,
        ilsCat: "CAT IIIb",
        status: "OCCUPIED", // OCCUPIED, AVAILABLE, VACATING, EMERGENCY_RESERVED
        occupiedBy: {
          flightNumber: "KE085",
          callsign: "KAL085",
          airline: "대한항공",
          aircraft: "B777-300ER",
          origin: "ICN",
          dest: "JFK (뉴욕)",
          scheduledTime: "15:45", // departure time
          flightPhase: "TAKEOFF_ROLL",
          phaseDesc: "이륙 활주 라인업 대기",
          pax: 290
        }
      },
      {
        id: "15L/33R",
        lengthMeters: 3750,
        widthMeters: 60,
        ilsCat: "CAT IIIb",
        status: "OCCUPIED",
        occupiedBy: {
          flightNumber: "OZ202",
          callsign: "AAR202",
          airline: "아시아나",
          aircraft: "A350-900",
          origin: "LAX (로스앤젤레스)",
          dest: "ICN",
          scheduledTime: "15:20", // arrival time
          flightPhase: "TOUCHDOWN_ROLL",
          phaseDesc: "착륙 접지 후 고속 탈출 유도로 진입 중",
          pax: 311
        }
      },
      {
        id: "16R/34L",
        lengthMeters: 4000,
        widthMeters: 60,
        ilsCat: "CAT IIIb",
        status: "OCCUPIED",
        occupiedBy: {
          flightNumber: "TW501",
          callsign: "TWB501",
          airline: "티웨이항공",
          aircraft: "A330-300",
          origin: "ICN",
          dest: "CDG (파리)",
          scheduledTime: "16:20", // The latest departure!
          flightPhase: "LINEUP_WAIT",
          phaseDesc: "활주로 진입 대기 (비행시간 16:20으로 가장 늦음)",
          pax: 347
        }
      },
      {
        id: "16L/34R",
        lengthMeters: 3750,
        widthMeters: 60,
        ilsCat: "CAT IIIb",
        status: "AVAILABLE",
        occupiedBy: null
      }
    ],
    schedules: [
      { flightNumber: "OZ202", airline: "아시아나", aircraft: "A350-900", route: "LAX ➔ ICN", type: "ARR", schedTime: "15:20", status: "활주로 착륙 중", runway: "15L/33R", delayMin: 0 },
      { flightNumber: "KE085", airline: "대한항공", aircraft: "B777-300ER", route: "ICN ➔ JFK", type: "DEP", schedTime: "15:45", status: "이륙 활주 대기", runway: "15R/33L", delayMin: 5 },
      { flightNumber: "DL198", airline: "델타항공", aircraft: "A350-900", route: "SEA ➔ ICN", type: "ARR", schedTime: "15:50", status: "접근 선회 중", runway: "16L/34R (배정)", delayMin: 0 },
      { flightNumber: "7C1102", airline: "제주항공", aircraft: "B737-800", route: "ICN ➔ NRT", type: "DEP", schedTime: "16:05", status: "게이트 푸시백", runway: "15R/33L (예정)", delayMin: 0 },
      { flightNumber: "TW501", airline: "티웨이", aircraft: "A330-300", route: "ICN ➔ CDG", type: "DEP", schedTime: "16:20", status: "활주로 라인업", runway: "16R/34L", delayMin: 15 },
      { flightNumber: "KE1235", airline: "대한항공(비상기)", aircraft: "B737-800", route: "GMP ➔ CJU", type: "EMERGENCY_DIV", schedTime: "15:32", status: "MAYDAY 선언 비상착륙 요청", runway: "미지정", delayMin: 0 }
    ]
  },

  RKSS: {
    id: "RKSS",
    iata: "GMP",
    name: "김포국제공항 (Gimpo Int'l)",
    trafficDensity: "HIGH",
    hourlyDisruptionCostUSD: 95000,
    runways: [
      {
        id: "14R/32L",
        lengthMeters: 3200,
        widthMeters: 60,
        ilsCat: "CAT IIIa",
        status: "OCCUPIED",
        occupiedBy: {
          flightNumber: "OZ8941",
          callsign: "AAR8941",
          airline: "아시아나",
          aircraft: "A321-neo",
          origin: "GMP",
          dest: "CJU (제주)",
          scheduledTime: "15:25",
          flightPhase: "TAKEOFF_ROLL",
          phaseDesc: "이륙 가속 중",
          pax: 180
        }
      },
      {
        id: "14L/32R",
        lengthMeters: 3600,
        widthMeters: 45,
        ilsCat: "CAT I",
        status: "OCCUPIED",
        occupiedBy: {
          flightNumber: "BX8815",
          callsign: "ABL8815",
          airline: "에어부산",
          aircraft: "A321-200",
          origin: "GMP",
          dest: "PUS (부산)",
          scheduledTime: "16:10", // Latest!
          flightPhase: "HOLDING_SHORT",
          phaseDesc: "활주로 정지선 정렬 대기 (비행시간 16:10 최지연)",
          pax: 195
        }
      }
    ],
    schedules: [
      { flightNumber: "OZ8941", airline: "아시아나", aircraft: "A321-neo", route: "GMP ➔ CJU", type: "DEP", schedTime: "15:25", status: "이륙 중", runway: "14R/32L", delayMin: 0 },
      { flightNumber: "KE1220", airline: "대한항공", aircraft: "B737-900", route: "CJU ➔ GMP", type: "ARR", schedTime: "15:35", status: "최종 진입 (Final)", runway: "14L/32R (예정)", delayMin: 2 },
      { flightNumber: "BX8815", airline: "에어부산", aircraft: "A321-200", route: "GMP ➔ PUS", type: "DEP", schedTime: "16:10", status: "활주로 정지선 대기", runway: "14L/32R", delayMin: 10 }
    ]
  },

  RKPC: {
    id: "RKPC",
    iata: "CJU",
    name: "제주국제공항 (Jeju Int'l)",
    trafficDensity: "VERY_HIGH",
    hourlyDisruptionCostUSD: 120000,
    runways: [
      {
        id: "07/25",
        lengthMeters: 3180,
        widthMeters: 45,
        ilsCat: "CAT II",
        status: "OCCUPIED",
        occupiedBy: {
          flightNumber: "LJ321",
          callsign: "JNA321",
          airline: "진에어",
          aircraft: "B777-200ER",
          origin: "CJU",
          dest: "GMP (김포)",
          scheduledTime: "15:30",
          flightPhase: "TAKEOFF_ROLL",
          phaseDesc: "주활주로 이륙 허가 대기",
          pax: 393
        }
      },
      {
        id: "13/31",
        lengthMeters: 1900,
        widthMeters: 45,
        ilsCat: "CAT I",
        status: "OCCUPIED",
        occupiedBy: {
          flightNumber: "ZE208",
          callsign: "ESR208",
          airline: "이스타항공",
          aircraft: "B737-800",
          origin: "CJU",
          dest: "CJJ (청주)",
          scheduledTime: "16:15", // Latest!
          flightPhase: "LINEUP_WAIT",
          phaseDesc: "보조 활주로 정렬 대기 (비행시간 16:15)",
          pax: 189
        }
      }
    ],
    schedules: [
      { flightNumber: "LJ321", airline: "진에어", aircraft: "B777-200ER", route: "CJU ➔ GMP", type: "DEP", schedTime: "15:30", status: "이륙 준비", runway: "07/25", delayMin: 4 },
      { flightNumber: "TW706", airline: "티웨이", aircraft: "B737-800", route: "GMP ➔ CJU", type: "ARR", schedTime: "15:40", status: "착륙 접근 중", runway: "07/25", delayMin: 0 },
      { flightNumber: "ZE208", airline: "이스타", aircraft: "B737-800", route: "CJU ➔ CJJ", type: "DEP", schedTime: "16:15", status: "보조 활주로 대기", runway: "13/31", delayMin: 5 }
    ]
  },

  RKPK: {
    id: "RKPK",
    iata: "PUS",
    name: "김해/부산국제공항 (Gimhae Int'l)",
    trafficDensity: "HIGH",
    hourlyDisruptionCostUSD: 85000,
    runways: [
      {
        id: "18R/36L",
        lengthMeters: 3200,
        widthMeters: 60,
        ilsCat: "CAT II",
        status: "OCCUPIED",
        occupiedBy: {
          flightNumber: "BX711",
          callsign: "ABL711",
          airline: "에어부산",
          aircraft: "A321-neo",
          origin: "PUS",
          dest: "NRT (도쿄)",
          scheduledTime: "15:50",
          flightPhase: "LINEUP_WAIT",
          phaseDesc: "활주로 이륙 허가 수신 중",
          pax: 215
        }
      },
      {
        id: "18L/36R",
        lengthMeters: 2744,
        widthMeters: 45,
        ilsCat: "CAT I",
        status: "OCCUPIED",
        occupiedBy: {
          flightNumber: "KE1406",
          callsign: "KAL1406",
          airline: "대한항공",
          aircraft: "B737-900",
          origin: "PUS",
          dest: "GMP (김포)",
          scheduledTime: "16:30", // Latest!
          flightPhase: "HOLDING_SHORT",
          phaseDesc: "군/민 공용 활주로 유도로 정지 (비행시간 16:30 최지연)",
          pax: 174
        }
      }
    ],
    schedules: [
      { flightNumber: "BX711", airline: "에어부산", aircraft: "A321-neo", route: "PUS ➔ NRT", type: "DEP", schedTime: "15:50", status: "이륙 대기", runway: "18R/36L", delayMin: 0 },
      { flightNumber: "KE1406", airline: "대한항공", aircraft: "B737-900", route: "PUS ➔ GMP", type: "DEP", schedTime: "16:30", status: "활주로 정지선 대기", runway: "18L/36R", delayMin: 12 },
      { flightNumber: "JL958", airline: "일본항공", aircraft: "B737-800", route: "NRT ➔ PUS", type: "ARR", schedTime: "15:45", status: "착륙 접근 중", runway: "18R/36L", delayMin: 0 }
    ]
  },

  RKTU: {
    id: "RKTU",
    iata: "CJJ",
    name: "청주국제공항 (Cheongju Int'l)",
    trafficDensity: "MEDIUM",
    hourlyDisruptionCostUSD: 32000,
    runways: [
      {
        id: "06R/24L",
        lengthMeters: 2744,
        widthMeters: 45,
        ilsCat: "CAT I",
        status: "AVAILABLE",
        occupiedBy: null
      },
      {
        id: "06L/24R",
        lengthMeters: 2744,
        widthMeters: 45,
        ilsCat: "CAT I",
        status: "OCCUPIED",
        occupiedBy: {
          flightNumber: "RF312",
          callsign: "EOK312",
          airline: "에어로케이",
          aircraft: "A320-200",
          origin: "CJJ",
          dest: "KIX (간사이)",
          scheduledTime: "15:40",
          flightPhase: "LINEUP_WAIT",
          phaseDesc: "활주로 이륙 정렬 대기",
          pax: 180
        }
      }
    ],
    schedules: [
      { flightNumber: "RF312", airline: "에어로케이", aircraft: "A320-200", route: "CJJ ➔ KIX", type: "DEP", schedTime: "15:40", status: "활주로 대기", runway: "06L/24R", delayMin: 0 },
      { flightNumber: "ZE702", airline: "이스타", aircraft: "B737-800", route: "CJU ➔ CJJ", type: "ARR", schedTime: "15:55", status: "하강 선회", runway: "06R/24L", delayMin: 0 }
    ]
  },

  RKTN: {
    id: "RKTN",
    iata: "TAE",
    name: "대구국제공항 (Daegu Int'l)",
    trafficDensity: "MEDIUM",
    hourlyDisruptionCostUSD: 28000,
    runways: [
      {
        id: "13R/31L",
        lengthMeters: 2755,
        widthMeters: 45,
        ilsCat: "CAT I",
        status: "OCCUPIED",
        occupiedBy: {
          flightNumber: "TW802",
          callsign: "TWB802",
          airline: "티웨이항공",
          aircraft: "B737-800",
          origin: "TAE",
          dest: "FUK (후쿠오카)",
          scheduledTime: "16:00",
          flightPhase: "LINEUP_WAIT",
          phaseDesc: "활주로 점유 정지 대기",
          pax: 186
        }
      },
      {
        id: "13L/31R",
        lengthMeters: 2755,
        widthMeters: 45,
        ilsCat: "CAT I",
        status: "AVAILABLE",
        occupiedBy: null
      }
    ],
    schedules: [
      { flightNumber: "TW802", airline: "티웨이", aircraft: "B737-800", route: "TAE ➔ FUK", type: "DEP", schedTime: "16:00", status: "활주로 대기", runway: "13R/31L", delayMin: 5 }
    ]
  }
};

// Deep clone to preserve state during active session
let runtimeAirportData = JSON.parse(JSON.stringify(AIRPORT_ATC_DATA));

/**
 * Resets or gets active airport ATC runtime data
 */
export function getAirportAtcData(airportId) {
  if (!runtimeAirportData[airportId]) {
    return runtimeAirportData["RKSS"];
  }
  return runtimeAirportData[airportId];
}

/**
 * Check if there is an immediately available (unoccupied) runway for emergency landing
 */
export function checkRunwayAvailability(airportId) {
  const airport = getAirportAtcData(airportId);
  const availableRunways = airport.runways.filter(r => r.status === "AVAILABLE");
  const occupiedRunways = airport.runways.filter(r => r.status === "OCCUPIED" || r.status === "VACATING");
  const reservedRunways = airport.runways.filter(r => r.status === "EMERGENCY_RESERVED");

  return {
    hasAvailable: availableRunways.length > 0,
    availableCount: availableRunways.length,
    totalCount: airport.runways.length,
    availableRunways,
    occupiedRunways,
    reservedRunways
  };
}

/**
 * Parses time string "HH:MM" into minutes for comparison
 */
function parseTimeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

/**
 * Core User Requirement:
 * "없다면 활주로에 있는 항공기 중에 비행시간이 가장 늦은 항공기가 자리를 비키게 관제 해."
 * Finds the occupied aircraft with the latest scheduled flight/departure time,
 * orders it to vacate the runway (TAXI TO HOLDING BAY / GO-AROUND),
 * and assigns that runway as EMERGENCY_RESERVED for the inbound Boeing 737.
 */
export function clearLatestScheduledFlight(airportId, emergencyCallsign = "HL-737EM") {
  const airport = getAirportAtcData(airportId);
  const occupiedRunways = airport.runways.filter(r => r.status === "OCCUPIED" && r.occupiedBy);

  if (occupiedRunways.length === 0) {
    // If no runway is occupied, pick the longest available runway
    const bestRwy = airport.runways.sort((a, b) => b.lengthMeters - a.lengthMeters)[0];
    bestRwy.status = "EMERGENCY_RESERVED";
    return {
      success: true,
      clearedFlight: null,
      reservedRunway: bestRwy,
      message: `여유 활주로(${bestRwy.id}, 길이 ${bestRwy.lengthMeters}m)가 즉시 비상 활주로로 단독 격리 배정되었습니다.`
    };
  }

  // Find the runway occupied by the aircraft with the latest scheduled time
  let latestRwy = occupiedRunways[0];
  let maxMinutes = parseTimeToMinutes(latestRwy.occupiedBy.scheduledTime);

  for (let i = 1; i < occupiedRunways.length; i++) {
    const rwy = occupiedRunways[i];
    const mins = parseTimeToMinutes(rwy.occupiedBy.scheduledTime);
    if (mins > maxMinutes) {
      maxMinutes = mins;
      latestRwy = rwy;
    }
  }

  const evacuatedFlight = latestRwy.occupiedBy;

  // Execute ATC clearance command: vacate runway
  latestRwy.status = "EMERGENCY_RESERVED";
  latestRwy.evacuatedDetails = {
    originalFlight: evacuatedFlight,
    clearanceOrder: `[ATC 긴급 지시] ${evacuatedFlight.callsign} (${evacuatedFlight.airline}), 활주로 ${latestRwy.id} 즉시 개방하라. 비상착륙기 우선권 발효로 유도로(Taxiway E) 홀딩 베이로 긴급 대기 이동.`,
    evacuationTime: new Date().toLocaleTimeString('ko-KR', { hour12: false })
  };

  // Update schedule status table
  const schedItem = airport.schedules.find(s => s.flightNumber === evacuatedFlight.flightNumber);
  if (schedItem) {
    schedItem.status = "관제 퇴거 지시 (유도로 대기 이동 중)";
    schedItem.delayMin += 25;
  }

  return {
    success: true,
    clearedFlight: evacuatedFlight,
    reservedRunway: latestRwy,
    message: `[관제 퇴거 완료] 비행 스케줄이 가장 늦은(${evacuatedFlight.scheduledTime}) ${evacuatedFlight.callsign}(${evacuatedFlight.flightNumber}, ${evacuatedFlight.dest}행) 기체에 활주로 즉시 개방 지시를 하달하여 활주로 ${latestRwy.id}를 ${emergencyCallsign} 비상 착륙 전용으로 확보했습니다.`
  };
}

/**
 * Core User Requirement:
 * "그리고 안전이 1순위, 비용이 적은게 2순위로 관제 플랜 3가지 추천해"
 * Generates 3 tactical ATC emergency handling plans:
 * 1. Plan Alpha: Maximum Safety Priority (Complete Isolation & ARFF Full Pre-deployment)
 * 2. Plan Bravo: Cost & Disruption Balanced Priority (Selective Reroute & Quick Vacate)
 * 3. Plan Charlie: High-Speed Rapid Clearance & Network Preservation
 */
export function generateAtcTacticalPlans(airportId, clearedResult, emergencyType = "dual_engine_flameout") {
  const airport = getAirportAtcData(airportId);
  const targetRwy = clearedResult?.reservedRunway || airport.runways[0];
  const evacuated = clearedResult?.clearedFlight;

  const planAlpha = {
    id: "PLAN_ALPHA",
    name: "플랜 Alpha : 안전 최우선 즉시 전면 격리 관제 (Safety 1st - Absolute Priority)",
    badge: "안전 1순위 최우선 권고",
    badgeClass: "badge-safety",
    safetyScore: 98,
    costScore: 78,
    prioritySummary: "비상기 무결점 생존성 확보를 위해 착륙 활주로 전면 봉쇄 및 지상 소방 특수구조대(ARFF) 활주로 양끝단 사전 전진 배치",
    atcDirectives: [
      `활주로 ${targetRwy.id}에 대한 일체의 이착륙 즉각 금지(ALL TRAFFIC HOLD) 발효`,
      evacuated ? `최지연 기체 ${evacuated.callsign}을 유도로 격리 패드(Hold Bay)로 3분 내 완전 대피 완료 지시` : `진입 유도로 차단기 가동`,
      `공항 소방대(ARFF Cat 9/10) 소방차 6대 및 구급차 4대 활주로 ${targetRwy.id} 평행 유도로 200m 간격 사전 대기`,
      `접근 경로 상 모든 VFR 및 민항기 15NM 이상 즉각 회항 및 고도 분리(1,000ft 이상) 지시`
    ],
    costImpactDesc: `예상 지연 1~2편 발생 ($${Math.round(airport.hourlyDisruptionCostUSD * 0.45).toLocaleString()}), 비상기 활주로 안전 착륙 마진 100% 극대화`,
    recommendedAction: "조종사 및 관제탑 합의 즉시 채택"
  };

  const planBravo = {
    id: "PLAN_BRAVO",
    name: "플랜 Bravo : 비용·스케줄 지연 최소화 균형 관제 (Cost/Schedule Optimization)",
    badge: "비용 최소화 2순위",
    badgeClass: "badge-cost",
    safetyScore: 92,
    costScore: 94,
    prioritySummary: "안전 기준선(90점 이상)을 준수하면서, 허브 공항의 대형 국제선 지연을 방지하기 위해 주변 기체를 인접 보조 활주로로 신속 분산 배정",
    atcDirectives: [
      `비상기 착륙 활주로를 최단 접근이 가능한 ${targetRwy.id}로 단독 격리`,
      evacuated ? `${evacuated.callsign}은 이륙 활주 전 단계이므로 인접 보조 활주로로 즉시 재배정하여 스케줄 지연 10분 이내로 방어` : `보조 활주로로 정시 운항 지속`,
      `인근 공역의 도착 예정기는 홀딩 대신 고속 진입 순서를 앞당겨 공항 체류 연료 소모 최소화`,
      `지상 조업 차량 및 견인차를 비상 착륙 접지 2분 후 즉각 투입하여 활주로 점유 시간 15분 이내 단축`
    ],
    costImpactDesc: `손실 비용 최소화 ($${Math.round(airport.hourlyDisruptionCostUSD * 0.22).toLocaleString()}), 항공사 스케줄 타격 70% 감소`,
    recommendedAction: "주변 교통량이 많고 허브 공항 연쇄 결항 우려 시 적합"
  };

  const planCharlie = {
    id: "PLAN_CHARLIE",
    name: "플랜 Charlie : 고속 탈출 유도로(Rapid Exit) 신속 정상화 관제 (Rapid Clearance)",
    badge: "신속 정상화 연계",
    badgeClass: "badge-hybrid",
    safetyScore: 89,
    costScore: 91,
    prioritySummary: "비상 접지 후 제동 가능한 구간에서 고속 탈출 유도로(RET)를 통해 정비 계류장(MRO Apron)으로 즉시 기체를 유도하여 활주로 조기 재개방",
    atcDirectives: [
      `비상기 착륙 시 역추진 및 제동 거리 계산 후 고속 탈출 유도로(Taxiway TWY-R) 우선 개방`,
      `활주로 중앙선 정지 위험 대비 대형 항공기 견인 토우카(Super-Tug) 2대 대기`,
      `후속 착륙 편에게 활주로 3NM 후방 안전 분리 간격 유지 하에 조건부 착륙 대기 발령`,
      `기체 완전 정지 확인 즉시 10분 내 타 활주로 정상 운항 전환`
    ],
    costImpactDesc: `손실 비용 극소화 ($${Math.round(airport.hourlyDisruptionCostUSD * 0.15).toLocaleString()}), 정상 공항 운영 최단시간 복귀`,
    recommendedAction: "경미한 기체 이상(조향/제동 기능 정상 유지) 시 강력 권고"
  };

  return [planAlpha, planBravo, planCharlie];
}

/**
 * Resets airport runway simulation state
 */
export function resetAirportAtcData() {
  runtimeAirportData = JSON.parse(JSON.stringify(AIRPORT_ATC_DATA));
}
