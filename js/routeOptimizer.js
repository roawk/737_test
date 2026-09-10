// Dual-Priority AI Route Optimization Engine
// Priority 1: SAFETY (Weight 75%)
// Priority 2: SCHEDULE & COST IMPACT (Weight 25%)

import { calculateFlightCapabilities, B737_SPECS } from "./b737Engine.js";
import { LANDING_SITES } from "./airTrafficSim.js";

// Haversine distance in Nautical Miles (NM)
export function calculateDistanceNM(lat1, lon1, lat2, lon2) {
  const R = 3440.065; // Earth radius in NM
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Initial bearing from point 1 to point 2 in degrees
export function calculateBearing(lat1, lon1, lat2, lon2) {
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const y = Math.sin(dLon) * Math.cos((lat2 * Math.PI) / 180);
  const x =
    Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
    Math.sin((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.cos(dLon);
  let brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

/**
 * Evaluates all potential landing sites and computes dual-priority score
 * Dynamic recalculation based on emergency type and current aircraft state
 */
export function evaluateLandingSites(currentAircraftState, emergencyKey, surroundingTraffic = []) {
  const { lat, lng, altitudeFt, groundSpeedKts, fuelKg, windKts } = currentAircraftState;
  const cap = calculateFlightCapabilities(altitudeFt, groundSpeedKts, fuelKg, windKts, emergencyKey);
  const emergency = cap.emergency;

  const results = LANDING_SITES.map((site) => {
    const distanceNM = calculateDistanceNM(lat, lng, site.lat, site.lng);
    const bearingDeg = Math.round(calculateBearing(lat, lng, site.lat, site.lng));
    
    // Effective ground speed towards target considering wind
    const effectiveSpeed = Math.max(140, cap.optimalAirspeed + (windKts * 0.5));
    const estimatedMinutes = Math.max(1, Math.round((distanceNM / effectiveSpeed) * 60));

    // 1. REACHABILITY / AERODYNAMIC MARGIN
    let isReachable = true;
    let glideMarginNM = cap.maxGlideRangeNM - distanceNM;

    // Strict glide limit for unpowered flight
    if (cap.isDualFlameout) {
      if (distanceNM > cap.maxGlideRangeNM) {
        isReachable = false;
      }
    } else if (emergencyKey === "cargo_fire") {
      // Golden 15-minute rule: cannot reach sites farther than 18 minutes of flight
      if (estimatedMinutes > 18) {
        isReachable = false;
      }
    } else if (emergencyKey === "rapid_depressurization") {
      // Oxygen limitation: 25 minutes absolute cutoff
      if (estimatedMinutes > 25) {
        isReachable = false;
      }
    }

    // 2. SCENARIO-SPECIFIC SAFETY SCORE (0 - 100)
    let safetyScore = 80;

    // Infrastructure Baseline
    if (site.type === "INTERNATIONAL_AIRPORT") {
      safetyScore += 15;
    } else if (site.type === "CIVIL_MILITARY_AIRPORT") {
      safetyScore += 10;
    } else if (site.type === "MILITARY_AIRBASE") {
      safetyScore += 8;
    } else if (site.type === "WATER_DITCHING") {
      safetyScore -= 40; // Water ditching is last resort
    } else if (site.type === "OPEN_TERRAIN") {
      safetyScore -= 50; // Off-field landing severe rollover risk
    }

    // Runway Length Evaluation (Crucial for B737)
    if (site.maxRunwayLength >= 3700) {
      safetyScore += 12; // Incheon 3,750m+ has huge overrun margin
    } else if (site.maxRunwayLength >= 3200) {
      safetyScore += 8;
    } else if (site.maxRunwayLength < 2500 && site.type !== "WATER_DITCHING") {
      safetyScore -= 20;
    }

    // Emergency Firefighting (ARFF)
    if (site.arffCategory >= 9) safetyScore += 10;
    else if (site.arffCategory >= 7) safetyScore += 5;
    else if (site.arffCategory < 7) safetyScore -= (7 - site.arffCategory) * 8;

    // --- SCENARIO-SPECIFIC CRITICAL MODIFIERS ---
    
    // Case 1: TOTAL HYDRAULIC LOSS (Manual Reversion)
    // No flaps, no speedbrakes, limited accumulator braking -> needs 3,200m+ runway!
    if (emergencyKey === "hydraulic_total_loss") {
      if (site.maxRunwayLength >= 3500) {
        safetyScore += 25; // Incheon / Gimpo only!
      } else if (site.maxRunwayLength < 3000) {
        safetyScore -= 45; // Extreme overrun crash risk at Cheongju / Seosan
      }
    }

    // Case 2: CARGO HOLD FIRE (15-Minute Golden Time)
    // Every minute counts! Distance and time are the #1 survival factors!
    if (emergencyKey === "cargo_fire") {
      if (estimatedMinutes <= 5) {
        safetyScore += 35; // Immediate touchdown
      } else if (estimatedMinutes <= 10) {
        safetyScore += 15;
      } else if (estimatedMinutes > 12) {
        safetyScore -= (estimatedMinutes - 12) * 8; // Steep penalty for every extra minute
      }
    }

    // Case 3: DUAL ENGINE FLAMEOUT (Glide Conservation)
    if (emergencyKey === "dual_engine_flameout") {
      if (glideMarginNM > 25) {
        safetyScore += 15; // Plenty of altitude to set up standard traffic pattern
      } else if (glideMarginNM < 8 && glideMarginNM >= 0) {
        safetyScore -= 18; // Close to edge of glide envelope
      }
      // Overwater approach is safer if flameout occurs
      if (site.isOverwaterApproach) safetyScore += 5;
    }

    // Case 4: ENGINE 1 FAILURE / FIRE (Single Engine Sustained Cruise)
    // Aircraft has full single engine power, can cruise safely for hours.
    // Diverting to a major Hub (Incheon/Gimpo) with airline maintenance is safe and optimal.
    if (emergencyKey === "single_engine_failure") {
      if (site.maintenanceHub) {
        safetyScore += 10;
      }
    }

    // Case 5: RAPID DEPRESSURIZATION
    if (emergencyKey === "rapid_depressurization") {
      if (estimatedMinutes <= 12) {
        safetyScore += 15; // Within oxygen bottle endurance
      } else {
        safetyScore -= (estimatedMinutes - 12) * 5;
      }
    }

    safetyScore = Math.max(5, Math.min(100, Math.round(safetyScore)));
    if (!isReachable) safetyScore = 0;

    // 3. EFFICIENCY & SCHEDULE IMPACT SCORE (0 - 100)
    // Priority 2: Minimizing commercial network delay and airline financial cost
    let efficiencyScore = 85;

    // Air traffic congestion & queued flight penalties
    // Landing an emergency at Incheon halts 28 flights. At Seosan, only 1 military sortie.
    const flightDelayPenalty = (site.activeQueuedFlights || 0) * 2.2;
    efficiencyScore -= flightDelayPenalty;

    // Airport hourly disruption cost penalty
    const costRatio = (site.hourlyDisruptionCostUSD || 0) / 140000;
    efficiencyScore -= Math.round(costRatio * 28);

    // Maintenance base advantage
    // If landing at an airline hub (Incheon, Gimpo, Cheongju), engine/parts swap is immediate.
    // At Seosan AB, aircraft is AOG (Aircraft On Ground), requiring ferry permits and mobile crews.
    if (site.maintenanceHub) {
      efficiencyScore += 20;
    } else if (site.type === "MILITARY_AIRBASE") {
      efficiencyScore -= 10; // Extra logistical hassle for civilian passengers
    }

    // Surrounding airborne traffic conflict avoidance
    let trafficConflicts = 0;
    let totalPaxDelayed = 0;
    surroundingTraffic.forEach((trf) => {
      const distToSite = calculateDistanceNM(trf.lat, trf.lng, site.lat, site.lng);
      if (distToSite < 25) {
        trafficConflicts++;
        totalPaxDelayed += trf.passengers;
      }
    });
    efficiencyScore -= trafficConflicts * 7;

    // For single engine, efficiency score carries more positive weight for hubs
    if (emergencyKey === "single_engine_failure" && site.maintenanceHub) {
      efficiencyScore += 15;
    }

    efficiencyScore = Math.max(10, Math.min(100, Math.round(efficiencyScore)));

    // 4. DUAL PRIORITY COMPOSITE SCORE
    // Safety is Priority 1 (75%), Schedule & Cost is Priority 2 (25%)
    let compositeScore = 0;
    if (isReachable) {
      compositeScore = Math.round(safetyScore * 0.75 + efficiencyScore * 0.25);
    }

    return {
      site,
      distanceNM: Math.round(distanceNM * 10) / 10,
      bearingDeg,
      estimatedMinutes,
      isReachable,
      glideMarginNM: Math.round(glideMarginNM * 10) / 10,
      safetyScore,
      efficiencyScore,
      compositeScore,
      trafficConflicts,
      totalPaxDelayed,
      estimatedScheduleDelayMinTotal: (site.activeQueuedFlights * 25) + (trafficConflicts * 15),
      estimatedDisruptionCostUSD: site.hourlyDisruptionCostUSD * 1.5 + (trafficConflicts * 4500)
    };
  });

  // Separate reachable vs unreachable
  const reachableList = results.filter(r => r.isReachable);
  const unreachableList = results.filter(r => !r.isReachable).sort((a, b) => a.distanceNM - b.distanceNM);

  // Fallback if very low altitude makes all normal airports unreachable
  let candidatePool = reachableList.length > 0 ? reachableList : results;

  // -------------------------------------------------------------
  // TACTICAL RECOMMENDATION SELECTION (100% DISTINCT 3 SITES)
  // -------------------------------------------------------------

  // -------------------------------------------------------------
  // TACTICAL RECOMMENDATION SELECTION (100% STRICT RANKING)
  // -------------------------------------------------------------
  const sortCriteria = currentAircraftState.sortCriteria || "safety";

  // Sort candidate pool strictly based on selected criteria
  let rankedCandidates = [...candidatePool].sort((a, b) => {
    if (sortCriteria === "safety") {
      // 1st Priority: Safety Score (Strictly descending, no inversion!)
      if (b.safetyScore !== a.safetyScore) return b.safetyScore - a.safetyScore;
      // 2nd Priority (Tie-break): Efficiency & Schedule Score
      if (b.efficiencyScore !== a.efficiencyScore) return b.efficiencyScore - a.efficiencyScore;
      return a.distanceNM - b.distanceNM;
    } else if (sortCriteria === "balanced") {
      // Balanced Composite Score (Safety 75% + Schedule 25%)
      if (b.compositeScore !== a.compositeScore) return b.compositeScore - a.compositeScore;
      if (b.safetyScore !== a.safetyScore) return b.safetyScore - a.safetyScore;
      return a.distanceNM - b.distanceNM;
    } else if (sortCriteria === "fastest") {
      // Fastest Touchdown ETE
      if (a.estimatedMinutes !== b.estimatedMinutes) return a.estimatedMinutes - b.estimatedMinutes;
      return b.safetyScore - a.safetyScore;
    }
    return b.safetyScore - a.safetyScore;
  });

  // Pick top 3 completely distinct sites
  const optionAlpha = rankedCandidates[0] || results[0];
  const optionBravo = rankedCandidates[1] || results[1];
  const optionCharlie = rankedCandidates[2] || results[2];

  // Strategy dynamic descriptions
  const alphaDesc = `1순위 추천: ${optionAlpha.site.name} (활주로 ${optionAlpha.site.maxRunwayLength}m, ARFF Cat ${optionAlpha.site.arffCategory}). 안전 점수 ${optionAlpha.safetyScore}점 최우선 보장.`;
  const bravoDesc = `2순위 추천: ${optionBravo.site.name}. 안전 점수 ${optionBravo.safetyScore}점 유지 및 공항 대기편(${optionBravo.site.activeQueuedFlights}대) 스케줄 지연 최소화.`;
  const charlieDesc = `3순위 추천: ${optionCharlie.site.name}. 안전 점수 ${optionCharlie.safetyScore}점, 비행거리 ${optionCharlie.distanceNM}NM (예상 ${optionCharlie.estimatedMinutes}분) 차순위 항로.`;

  return {
    capabilities: cap,
    sortCriteria,
    allEvaluated: [...rankedCandidates, ...unreachableList],
    topRecommendations: {
      alpha: {
        tag: "alpha",
        rankNumber: 1,
        title: "1순위 최적 항로 (Top Recommendation)",
        strategy: alphaDesc,
        badge: "1순위 (초록)",
        badgeColor: "#00e676",
        data: optionAlpha,
      },
      bravo: {
        tag: "bravo",
        rankNumber: 2,
        title: "2순위 대안 항로 (Secondary Alternate)",
        strategy: bravoDesc,
        badge: "2순위 (파랑)",
        badgeColor: "#00d4ff",
        data: optionBravo,
      },
      charlie: {
        tag: "charlie",
        rankNumber: 3,
        title: "3순위 비상 항로 (Tertiary Standby)",
        strategy: charlieDesc,
        badge: "3순위 (주황)",
        badgeColor: "#ff9100",
        data: optionCharlie,
      }
    }
  };
}
