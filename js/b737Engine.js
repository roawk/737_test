// Boeing 737-800 Performance & Emergency Aerodynamics Engine
export const B737_SPECS = {
  model: "Boeing 737-800 Next Gen",
  maxTakeoffWeight: 79010, // kg (MTOW)
  maxLandingWeight: 66360, // kg (MLW)
  operatingEmptyWeight: 41413, // kg
  wingspan: 35.8, // m
  normalCruiseSpeed: 450, // KTAS (True Airspeed Knots)
  bestGlideSpeed: 215, // KIAS (Dual engine flameout optimal glide speed)
  singleEngineCruiseSpeed: 300, // KTAS
  serviceCeiling: 41000, // ft
  singleEngineCeiling: 21000, // ft (approx drift-down ceiling at mid-weight)
  baseGlideRatio: 16.5, // 16.5:1 (1000ft loss = ~2.71 NM forward distance in still air)
  minRunwayRequiredNormal: 1800, // meters
  minRunwayRequiredOverweight: 2300, // meters
  minRunwayRequiredNoFlaps: 2700, // meters (Hydraulic failure / alternate flap limit)
  oxygenEnduranceMin: 14, // minutes for passenger emergency oxygen generator
};

export const EMERGENCY_SCENARIOS = {
  dual_engine_flameout: {
    id: "dual_engine_flameout",
    name: "Dual Engine Flameout (양쪽 엔진 정지)",
    severity: "CRITICAL",
    color: "#ff3366",
    code: "MAYDAY MAYDAY",
    transponder: "7700",
    glideRatio: 16.0,
    speedKnots: 215,
    descentRateFpm: -1350,
    requiresUnpoweredApproach: true,
    runwayMultiplier: 1.25,
    waterDitchingViable: true,
    description: "전체 엔진 추력 상실. 완전 무동력 활공 비행 상태. 보조동력장치(APU) 기동 및 재시동 절차 수행 중. 도달 가능한 글라이드 콘 내부 착륙지 필수.",
    safetyWeightReduction: 0.0,
  },
  single_engine_failure: {
    id: "single_engine_failure",
    name: "Engine 1 Failure / Fire (엔진 1기 고장/화재)",
    severity: "MAJOR",
    color: "#ff9900",
    code: "PAN-PAN / MAYDAY",
    transponder: "7700",
    glideRatio: 0, // Engine sustained, no unpowered glide limit
    speedKnots: 290,
    descentRateFpm: -500, // Drift-down until single engine ceiling
    driftDownCeiling: 21000,
    requiresUnpoweredApproach: false,
    runwayMultiplier: 1.1,
    waterDitchingViable: false,
    description: "1번 엔진 화재 진압 및 셧다운 완료. 잔여 2번 엔진으로 정상 비행 유지 가능(Drift-down 고도 유지). 120분 이내 적정 공항 착륙 권고.",
    safetyWeightReduction: 0.15,
  },
  rapid_depressurization: {
    id: "rapid_depressurization",
    name: "Rapid Depressurization (객실 급감압)",
    severity: "CRITICAL",
    color: "#ff3366",
    code: "MAYDAY MAYDAY",
    transponder: "7700",
    glideRatio: 0,
    speedKnots: 310,
    descentRateFpm: -4800, // Emergency dive to FL100
    levelOffAltitude: 10000,
    requiresUnpoweredApproach: false,
    runwayMultiplier: 1.0,
    waterDitchingViable: false,
    description: "동체 기압 상실. 승객 산소 마스크 투하. 산소 한계 시간(약 14분) 이내 10,000ft 안전 고도로 급강하 수행 후 최단 시간 안전 공항 착륙 필요.",
    safetyWeightReduction: 0.1,
  },
  hydraulic_total_loss: {
    id: "hydraulic_total_loss",
    name: "Total Hydraulic Loss Sys A & B (유압 A/B계통 전손)",
    severity: "CRITICAL",
    color: "#ff2244",
    code: "PAN-PAN / MAYDAY",
    transponder: "7700",
    glideRatio: 0,
    speedKnots: 220,
    descentRateFpm: -1200,
    requiresUnpoweredApproach: false,
    runwayMultiplier: 1.5, // Requires significantly longer runway (no spoilers, no normal brakes)
    waterDitchingViable: false,
    description: "A/B 유압 완전 상실로 Manual Reversion(수동 기계 연결) 비행. 플랩 전개 제한 및 높은 착륙 속도(+25kt), 노즈 기어 조향 불능. 초장거리 활주로(2,700m+) 및 소방대 필수.",
    safetyWeightReduction: 0.25,
  },
  cargo_fire: {
    id: "cargo_fire",
    name: "Aft Cargo Hold Fire (후방 화물칸 화재)",
    severity: "EMERGENCY",
    color: "#ff1122",
    code: "MAYDAY MAYDAY",
    transponder: "7700",
    glideRatio: 0,
    speedKnots: 320,
    descentRateFpm: -3000,
    timeLimitMinutes: 15, // Golden 15 minutes rule
    requiresUnpoweredApproach: false,
    runwayMultiplier: 1.05,
    waterDitchingViable: true,
    description: "화물칸 화재 경보 및 소화제 방출. 화재 확산 방지를 위해 최우선적으로 15분 이내 무조건 최단 거리 활주로 또는 착수 지역에 접지해야 함.",
    safetyWeightReduction: 0.05,
  }
};

/**
 * Calculates aerodynamic endurance and range for Boeing 737 based on current state and emergency type.
 */
export function calculateFlightCapabilities(altitudeFt, groundSpeedKts, fuelKg, windKts, emergencyKey) {
  const emergency = EMERGENCY_SCENARIOS[emergencyKey] || EMERGENCY_SCENARIOS.dual_engine_flameout;
  const isDualFlameout = emergencyKey === "dual_engine_flameout";

  let maxGlideRangeNM = 0;
  let remainingTimeMinutes = 0;
  let optimalAirspeed = emergency.speedKnots;
  let descentRate = emergency.descentRateFpm;
  let limitingFactor = "";
  let effectiveGlideRatio = emergency.glideRatio || 0;

  if (isDualFlameout) {
    // True glide calculation (50% reduction applied for safety factor / user specification)
    // Glide ratio = 16.0 : 1 scaled by 0.5 (effective 8.0 : 1). In nautical miles: altitude in ft / 6076.12 * 16.0 * 0.5
    // With wind adjustment (headwind reduces glide, tailwind extends)
    const stillAirRangeNM = ((altitudeFt / 6076.12) * emergency.glideRatio) * 0.5;
    const glideTimeHours = Math.abs(altitudeFt / (emergency.descentRateFpm * 60));
    const windEffectNM = (windKts * glideTimeHours) * 0.5; // ground vector effect scaled by 50%
    maxGlideRangeNM = Math.max(5, stillAirRangeNM + (windEffectNM * 0.5));
    remainingTimeMinutes = Math.round((altitudeFt / Math.abs(emergency.descentRateFpm)));
    effectiveGlideRatio = Math.round((maxGlideRangeNM / (altitudeFt / 6076.12)) * 10) / 10;
    limitingFactor = "전체 엔진 추력 상실에 따른 무동력 공기역학 활공비 한계 (안전 계수 50% 축소 반경)";
  } else if (emergencyKey === "single_engine_failure") {
    // Engine 1 out: can sustain level flight at singleEngineCeiling
    const fuelConsumptionPerHour = 1800; // kg/hr on single engine CFM56-7B
    const fuelHours = fuelKg / fuelConsumptionPerHour;
    remainingTimeMinutes = Math.min(240, Math.round(fuelHours * 60));
    maxGlideRangeNM = Math.round(fuelHours * emergency.speedKnots * 0.85);
    effectiveGlideRatio = 0; // Powered cruise
    limitingFactor = "단발 엔진 지속 순항 및 잔여 연료 소모율(1,800 kg/h) 한계";
  } else if (emergencyKey === "cargo_fire") {
    remainingTimeMinutes = 15;
    maxGlideRangeNM = Math.round((15 / 60) * emergency.speedKnots);
    effectiveGlideRatio = 0;
    limitingFactor = "화물칸 방화벽 열관통 방지 및 유독가스 확산 전 15분 골든타임 한계";
  } else if (emergencyKey === "rapid_depressurization") {
    const fuelHours = fuelKg / 2600;
    remainingTimeMinutes = Math.min(120, Math.round(fuelHours * 60));
    maxGlideRangeNM = Math.round(fuelHours * 280);
    effectiveGlideRatio = 0;
    limitingFactor = "승객 화학 산소 발생기(Chemical O2) 유효 공급시간(약 14분) 한계";
  } else if (emergencyKey === "hydraulic_total_loss") {
    const fuelHours = fuelKg / 2400;
    remainingTimeMinutes = Math.min(90, Math.round(fuelHours * 60));
    maxGlideRangeNM = Math.round(fuelHours * emergency.speedKnots * 0.7);
    effectiveGlideRatio = 0;
    limitingFactor = "매뉴얼 리버전 수동 비행 조종 부하 및 브레이크 어큐뮬레이터 잔압 한계";
  }

  // Weight & Runway physics
  const grossWeightKg = Math.round(B737_SPECS.operatingEmptyWeight + fuelKg);
  const isOverweightLanding = grossWeightKg > B737_SPECS.maxLandingWeight;
  const weightPenaltyRatio = isOverweightLanding ? 1.15 : 1.0;
  const requiredRunwayMeters = Math.round(B737_SPECS.minRunwayRequiredNormal * (emergency.runwayMultiplier || 1.0) * weightPenaltyRatio);
  const glideDistancePer1000ft = isDualFlameout ? Math.round(((1000 / 6076.12) * effectiveGlideRatio) * 100) / 100 : 0;

  return {
    altitudeFt,
    groundSpeedKts,
    remainingTimeMinutes,
    maxGlideRangeNM: Math.round(maxGlideRangeNM),
    optimalAirspeed,
    descentRate,
    isDualFlameout,
    grossWeightKg,
    maxLandingWeightKg: B737_SPECS.maxLandingWeight,
    isOverweightLanding,
    requiredRunwayMeters,
    effectiveGlideRatio,
    glideDistancePer1000ft,
    limitingFactor,
    emergency
  };
}
