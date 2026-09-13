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

  // 1. Gross Weight calculation
  const grossWeightKg = Math.round(B737_SPECS.operatingEmptyWeight + fuelKg);
  const isOverweightLanding = grossWeightKg > B737_SPECS.maxLandingWeight;
  const weightRatio = Math.sqrt(grossWeightKg / 50000); // Aerodynamic scaling factor relative to 50t mid-weight

  // 2. Dynamic Optimal Airspeed (scales with weight and wind penetration)
  let optimalAirspeed = emergency.speedKnots;
  if (isDualFlameout) {
    // Best glide speed V_md increases with weight: approx 200 KIAS at empty to 230 KIAS at heavy weight
    const baseBestGlide = 215 * weightRatio;
    // Headwind penetration adjustment (+1/3 of headwind, -1/4 of tailwind)
    const windSpeedAdj = windKts < 0 ? Math.round(-windKts * 0.35) : Math.round(-windKts * 0.2);
    optimalAirspeed = Math.max(185, Math.min(245, Math.round(baseBestGlide + windSpeedAdj)));
  } else if (emergencyKey === "single_engine_failure") {
    optimalAirspeed = Math.round(270 * weightRatio);
  } else if (emergencyKey === "hydraulic_total_loss") {
    // Flapless approach speed
    optimalAirspeed = Math.round(205 * weightRatio);
  } else if (emergencyKey === "rapid_depressurization") {
    optimalAirspeed = Math.round(305 + (groundSpeedKts - 305) * 0.1);
  } else if (emergencyKey === "cargo_fire") {
    optimalAirspeed = Math.round(315 + (groundSpeedKts - 315) * 0.1);
  }

  // 3. Dynamic Vertical Descent Rate (scales with speed deviation, weight, and aerodynamics)
  let descentRate = emergency.descentRateFpm;
  if (isDualFlameout) {
    // Nominal sink rate at best glide is approx -1,350 FPM
    const nominalSink = -1350 * weightRatio;
    // Speed deviation penalty: flying faster or slower than optimal increases drag and sink rate
    const speedDelta = groundSpeedKts - optimalAirspeed;
    const dragSinkPenalty = speedDelta > 0 
      ? -(speedDelta * 4.2) // Parasitic drag penalty at high speeds
      : -(Math.abs(speedDelta) * 3.0); // Induced drag penalty at low speeds
    descentRate = Math.round((nominalSink + dragSinkPenalty) / 10) * 10;
    descentRate = Math.min(-950, Math.max(-3200, descentRate));
  } else if (emergencyKey === "single_engine_failure") {
    // Drift down sink rate
    const driftSink = altitudeFt > emergency.driftDownCeiling ? -550 * weightRatio : -180;
    descentRate = Math.round(driftSink / 10) * 10;
  } else if (emergencyKey === "rapid_depressurization") {
    // High speed emergency dive
    const diveFactor = Math.max(0.8, Math.min(1.3, groundSpeedKts / 300));
    descentRate = Math.round((-4600 * diveFactor) / 50) * 50;
  } else if (emergencyKey === "cargo_fire") {
    const fastDiveFactor = Math.max(0.85, Math.min(1.25, groundSpeedKts / 310));
    descentRate = Math.round((-2900 * fastDiveFactor) / 50) * 50;
  } else if (emergencyKey === "hydraulic_total_loss") {
    descentRate = Math.round((-1150 * weightRatio) / 10) * 10;
  }

  // 4. Dynamic Effective Glide Ratio (L/D with 50% safety factor, speed penalty, and wind vector)
  let effectiveGlideRatio = 0;
  let glideDistancePer1000ft = 0;
  let maxGlideRangeNM = 0;
  let remainingTimeMinutes = 0;
  let limitingFactor = "";

  if (isDualFlameout) {
    // Still air aerodynamic glide ratio: nominal 8.0:1 (50% safety margin of 16:1)
    const speedPolarFactor = Math.max(0.65, 1.0 - 0.45 * Math.pow((groundSpeedKts - optimalAirspeed) / optimalAirspeed, 2));
    const stillAirGlide = 8.0 * speedPolarFactor * (1.0 / weightRatio);

    // Ground vector effect from wind: headwind reduces ground distance, tailwind extends it
    const effectiveGroundSpeed = Math.max(100, groundSpeedKts + windKts);
    const windVectorRatio = effectiveGroundSpeed / Math.max(120, groundSpeedKts);
    
    effectiveGlideRatio = Math.round(stillAirGlide * windVectorRatio * 10) / 10;
    effectiveGlideRatio = Math.max(4.0, Math.min(13.5, effectiveGlideRatio));

    // Range in NM = (Altitude in feet / 6076.12) * effective glide ratio
    if (altitudeFt <= 0) {
      maxGlideRangeNM = 0;
      remainingTimeMinutes = 0;
    } else {
      maxGlideRangeNM = Math.max(1, Math.round((altitudeFt / 6076.12) * effectiveGlideRatio));
      remainingTimeMinutes = Math.max(1, Math.round(altitudeFt / Math.abs(descentRate)));
    }
    glideDistancePer1000ft = Math.round(((1000 / 6076.12) * effectiveGlideRatio) * 100) / 100;
    limitingFactor = `전체 엔진 추력 상실에 따른 무동력 공기역학 활공비 한계 (안전 계수 50% 축소 반경)`;
  } else if (emergencyKey === "single_engine_failure") {
    const fuelConsumptionPerHour = 1750;
    const fuelHours = fuelKg / fuelConsumptionPerHour;
    remainingTimeMinutes = Math.min(260, Math.round(fuelHours * 60));
    const effectiveCruiseSpeed = Math.max(160, groundSpeedKts + windKts);
    maxGlideRangeNM = Math.round(fuelHours * effectiveCruiseSpeed * 0.88);
    effectiveGlideRatio = 0;
    limitingFactor = "단발 엔진 지속 순항 및 잔여 연료 소모율(1,750 kg/h) 한계";
  } else if (emergencyKey === "cargo_fire") {
    remainingTimeMinutes = 15;
    const effectiveSpeed = Math.max(180, groundSpeedKts + windKts);
    maxGlideRangeNM = Math.round((15 / 60) * effectiveSpeed);
    effectiveGlideRatio = 0;
    limitingFactor = "화물칸 방화벽 열관통 방지 및 유독가스 확산 전 15분 골든타임 한계";
  } else if (emergencyKey === "rapid_depressurization") {
    const fuelHours = fuelKg / 2500;
    remainingTimeMinutes = Math.min(130, Math.round(fuelHours * 60));
    const effectiveSpeed = Math.max(170, groundSpeedKts + windKts);
    maxGlideRangeNM = Math.round(fuelHours * effectiveSpeed * 0.82);
    effectiveGlideRatio = 0;
    limitingFactor = "승객 화학 산소 발생기(Chemical O2) 유효 공급시간(약 14분) 한계";
  } else if (emergencyKey === "hydraulic_total_loss") {
    const fuelHours = fuelKg / 2350;
    remainingTimeMinutes = Math.min(95, Math.round(fuelHours * 60));
    const effectiveSpeed = Math.max(150, groundSpeedKts + windKts);
    maxGlideRangeNM = Math.round(fuelHours * effectiveSpeed * 0.72);
    effectiveGlideRatio = 0;
    limitingFactor = "매뉴얼 리버전 수동 비행 조종 부하 및 브레이크 어큐뮬레이터 잔압 한계";
  }

  // 5. Dynamic Required Landing Runway Length (FAR/JAR 25 landing field length physics)
  // Base normal runway: 1,800m
  // Weight factor: +1.2% per 1,000kg over 45,000kg
  const weightFactor = 1.0 + ((grossWeightKg - 45000) / 45000) * 0.32;
  // Overweight landing penalty
  const overweightPenalty = isOverweightLanding ? 1.15 : 1.0;
  // Touchdown speed factor: higher ground speed extends landing rollout
  const speedFactor = 1.0 + Math.max(-0.1, (groundSpeedKts - 210) / 250 * 0.22);
  // Wind factor: Headwind provides aerodynamic braking (-10m/kt); Tailwind extends rollout (+25m/kt)
  const windRunwayAdj = windKts < 0 ? (windKts * 9.5) : (windKts * 24.0);

  let requiredRunwayMeters = Math.round(
    (B737_SPECS.minRunwayRequiredNormal * (emergency.runwayMultiplier || 1.0) * weightFactor * overweightPenalty * speedFactor) + windRunwayAdj
  );
  // Round to nearest 10m
  requiredRunwayMeters = Math.max(1550, Math.min(3900, Math.round(requiredRunwayMeters / 10) * 10));

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
