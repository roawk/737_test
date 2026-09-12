// Boeing 737 Real-Time Subsystem Damage Assessment & Parts MRO Engine
// Diagnoses component damage severity percentages and lists mandatory replacement parts

export const B737_DAMAGE_PROFILES = {
  dual_engine_flameout: {
    overallDamagePercent: 82,
    statusText: "심각 (CRITICAL DAMAGE)",
    statusColor: "#ff0055",
    summary: "양쪽 CFM56-7B 엔진 코어 소화 및 터빈 스톨. 고압 터빈 블레이드 열변형 및 록킹(Seizure) 발생. 유압 EDP 펌프 회전 정지.",
    subsystems: [
      {
        id: "eng1",
        name: "1번 좌측 엔진 (CFM56-7B Engine #1)",
        icon: "fa-solid fa-fan",
        damagePercent: 94,
        status: "FAILED",
        details: "연소실 화염 상실(Flameout), 고압 터빈(HPT) 팁 마모, 연료 펌프 압력 상실"
      },
      {
        id: "eng2",
        name: "2번 우측 엔진 (CFM56-7B Engine #2)",
        icon: "fa-solid fa-fan",
        damagePercent: 91,
        status: "FAILED",
        details: "압축기 서지(Surge), 코어 회전 정지(N2 0%), 시동 밸브 차단 상태"
      },
      {
        id: "hyd",
        name: "엔진 구동 유압 계통 (Engine EDP Hydraulics)",
        icon: "fa-solid fa-oil-can",
        damagePercent: 70,
        status: "CRITICAL",
        details: "양 엔진 EDP 회전 동력 상실로 주 유압 A/B 압력 0 PSI 도달 (전동 펌프 EMDP만 비상 가동)"
      },
      {
        id: "apu",
        name: "보조동력장치 (APU Auxiliary Power)",
        icon: "fa-solid fa-bolt",
        damagePercent: 38,
        status: "CAUTION",
        details: "비상 공중 기동으로 고고도 스타터 부하 120% 가동 중"
      },
      {
        id: "airframe",
        name: "동체 및 날개 구조 (Fuselage & Wings)",
        icon: "fa-solid fa-plane",
        damagePercent: 12,
        status: "NORMAL",
        details: "무동력 활공 비행 중 공기역학적 구조 건전성 유지"
      },
      {
        id: "landing_gear",
        name: "착륙 장치 및 제동계 (Landing Gear & Brakes)",
        icon: "fa-solid fa-circle-notch",
        damagePercent: 45,
        status: "CAUTION",
        details: "수동 중력 하강(Manual Gravity Extension) 필수, 브레이크 어큐뮬레이터 잔여 압력 2회분"
      }
    ],
    replacementParts: [
      {
        partNumber: "P/N 340-001-205-0",
        name: "CFM56-7B 고압 터빈(HPT) 로터 블레이드 셋",
        category: "Powerplant (엔진)",
        qty: "2 Sets",
        urgency: "MANDATORY",
        action: "신품 전량 교체 (Replace)",
        estCostUSD: 280000,
        leadTimeHours: 24,
        ammChapter: "ATA 72-51"
      },
      {
        partNumber: "P/N 301-785-301-0",
        name: "엔진 연료 조절 제어기 (HMU / FADEC ECU)",
        category: "Powerplant (연료제어)",
        qty: "2 EA",
        urgency: "MANDATORY",
        action: "오버홀 및 벤치 교정 (Overhaul)",
        estCostUSD: 68000,
        leadTimeHours: 16,
        ammChapter: "ATA 73-21"
      },
      {
        partNumber: "P/N 757538-2",
        name: "엔진 공압 스타터 모터 (Pneumatic Starter)",
        category: "Pneumatics (공압)",
        qty: "1 EA",
        urgency: "URGENT",
        action: "신품 교체 (Replace)",
        estCostUSD: 19500,
        leadTimeHours: 6,
        ammChapter: "ATA 80-11"
      },
      {
        partNumber: "P/N 260-1412-00",
        name: "메인 기어 카본 휠 브레이크 팩 (Brake Rotor Assembly)",
        category: "Landing Gear (제동계)",
        qty: "4 Sets",
        urgency: "MANDATORY",
        action: "착륙 후 열화 전량 교체",
        estCostUSD: 48000,
        leadTimeHours: 8,
        ammChapter: "ATA 32-41"
      }
    ]
  },

  single_engine_failure: {
    overallDamagePercent: 54,
    statusText: "경고 (MAJOR FAILURE)",
    statusColor: "#ff9100",
    summary: "1번 좌측 엔진 내부 기계적 고장 및 화재 발생. 소화 보틀 1차 방출 완료. 2번 엔진으로 비대칭 단발 비행(Drift-down) 진행 중.",
    subsystems: [
      {
        id: "eng1",
        name: "1번 좌측 엔진 (CFM56-7B Engine #1)",
        icon: "fa-solid fa-fire",
        damagePercent: 98,
        status: "FAILED",
        details: "엔진 코어 화재 소손, 주 베어링(No.3 Bearing) 소착, 연료 차단 밸브 잠김"
      },
      {
        id: "eng2",
        name: "2번 우측 엔진 (CFM56-7B Engine #2)",
        icon: "fa-solid fa-fan",
        damagePercent: 12,
        status: "NORMAL",
        details: "단발 추력 유지 중 (N1 92%, EGT 840°C 정상 범위 내 한계 운용)"
      },
      {
        id: "hyd",
        name: "A 유압 계통 (Hydraulic System A)",
        icon: "fa-solid fa-oil-can",
        damagePercent: 40,
        status: "CAUTION",
        details: "1번 엔진 EDP 정지로 EMDP 전기 펌프로 압력 유지 (2,800 PSI)"
      },
      {
        id: "fire_sys",
        name: "엔진 화재 진압 계통 (Fire Protection)",
        icon: "fa-solid fa-fire-extinguisher",
        damagePercent: 85,
        status: "CRITICAL",
        details: "1번 엔진 소화 보틀 1차 방출 완료 (잔여 소화제 0%), 2차 보틀 대기"
      },
      {
        id: "airframe",
        name: "러더 및 비대칭 트림 (Flight Control Trim)",
        icon: "fa-solid fa-up-right-and-down-left-from-center",
        damagePercent: 22,
        status: "CAUTION",
        details: "단발 요잉(Yaw) 상쇄를 위한 러더 트림 5.5유닛 우측 편향 유지 중"
      },
      {
        id: "landing_gear",
        name: "착륙 장치 (Landing Gear System)",
        icon: "fa-solid fa-circle-notch",
        damagePercent: 15,
        status: "NORMAL",
        details: "정상 유압 다운락 가능"
      }
    ],
    replacementParts: [
      {
        partNumber: "P/N CFM56-7B26E",
        name: "CFM56-7B26/3 터보팬 엔진 코어 통교체 (Engine QEC)",
        category: "Powerplant (엔진)",
        qty: "1 EA",
        urgency: "MANDATORY",
        action: "엔진 탈착 및 교체 (Engine Drop & Swap)",
        estCostUSD: 3400000,
        leadTimeHours: 36,
        ammChapter: "ATA 71-00"
      },
      {
        partNumber: "P/N 898052-1",
        name: "엔진 나셀 할론 1301 소화용기 (Halon Fire Bottle)",
        category: "Fire Protection (소화)",
        qty: "2 EA",
        urgency: "MANDATORY",
        action: "신품 충전 용기 교체 (Replace)",
        estCostUSD: 14000,
        leadTimeHours: 4,
        ammChapter: "ATA 26-21"
      },
      {
        partNumber: "P/N 338-072-005-0",
        name: "엔진 카울링 나셀 써멀 블랭킷 (Nacelle Heat Shield)",
        category: "Structures (카울링)",
        qty: "1 Set",
        urgency: "MANDATORY",
        action: "화재 열변형 부품 교체",
        estCostUSD: 42000,
        leadTimeHours: 12,
        ammChapter: "ATA 78-31"
      }
    ]
  },

  rapid_depressurization: {
    overallDamagePercent: 68,
    statusText: "심각 (PRESSURE HULL BREACH)",
    statusColor: "#ff0055",
    summary: "객실 급감압 발생. 승객용 화학 산소 발생기 전량 마스크 드롭 작동(14분 잔여). 후방 아웃플로우 밸브 제어 파손 및 압력 격벽 씰링 손상.",
    subsystems: [
      {
        id: "cabin_press",
        name: "여압 아웃플로우 밸브 (Outflow Valve Assembly)",
        icon: "fa-solid fa-wind",
        damagePercent: 96,
        status: "FAILED",
        details: "밸브 모터 액추에이터 고착으로 열림 상태 고정, 차압 0.2 PSI 급락"
      },
      {
        id: "bulkhead",
        name: "후방 압력 격벽 (Aft Pressure Bulkhead)",
        icon: "fa-solid fa-shield-halved",
        damagePercent: 82,
        status: "CRITICAL",
        details: "격벽 고무 씰링 파열 및 국소 리벳 전단 응력 집중 (정밀 NDT 초음파 검사 요망)"
      },
      {
        id: "oxygen_sys",
        name: "승객 비상 산소 시스템 (Passenger Oxygen System)",
        icon: "fa-solid fa-head-side-mask",
        damagePercent: 100,
        status: "FAILED",
        details: "189석 산소 마스크 전량 강하 및 화학 제너레이터 1회성 연소 소진"
      },
      {
        id: "crew_oxygen",
        name: "조종사 산소 실린더 (Crew Oxygen 1800 PSI)",
        icon: "fa-solid fa-mask-ventilator",
        damagePercent: 42,
        status: "CAUTION",
        details: "조종사용 100% Demand 산소 마스크 사용 중 (잔여 1,150 PSI)"
      },
      {
        id: "airframe",
        name: "주 날개 및 엔진 (Engines & Controls)",
        icon: "fa-solid fa-plane",
        damagePercent: 10,
        status: "NORMAL",
        details: "기체 조종면 및 양 엔진 정상 추력 작동"
      }
    ],
    replacementParts: [
      {
        partNumber: "P/N 40-7004-3",
        name: "캐빈 메인 여압 아웃플로우 밸브 (Main Outflow Valve)",
        category: "Air Conditioning / Press (공조여압)",
        qty: "1 EA",
        urgency: "MANDATORY",
        action: "밸브 구동 모터 어셈블리 교체",
        estCostUSD: 36000,
        leadTimeHours: 8,
        ammChapter: "ATA 21-31"
      },
      {
        partNumber: "P/N 801307-00",
        name: "승객 좌석용 화학 산소 발생기 (Chemical Oxygen Generators)",
        category: "Emergency Oxygen (산소)",
        qty: "64 EA",
        urgency: "MANDATORY",
        action: "전 좌석 PSU 1회성 제너레이터 신품 교체",
        estCostUSD: 52000,
        leadTimeHours: 14,
        ammChapter: "ATA 35-22"
      },
      {
        partNumber: "P/N 65-52805-12",
        name: "후방 압력 격벽 주변 씰 스트립 (Aft Bulkhead Pressure Seal)",
        category: "Structures (기체구조)",
        qty: "1 Set",
        urgency: "MANDATORY",
        action: "기체 기밀 실란트 재도포 및 씰 교체",
        estCostUSD: 24000,
        leadTimeHours: 18,
        ammChapter: "ATA 53-81"
      }
    ]
  },

  hydraulic_total_loss: {
    overallDamagePercent: 88,
    statusText: "극도 심각 (TOTAL HYDRAULIC LOSS)",
    statusColor: "#d50000",
    summary: "A/B 주 유압 시스템 고압 라인 파열로 오일(Skydrol) 전량 누유. 비행 조종면(Manual Reversion) 수동 와이어 제어 중. 플랩/노즈스티어링/노멀 브레이크 전손.",
    subsystems: [
      {
        id: "hyd_a",
        name: "유압 시스템 A (Hydraulic System A)",
        icon: "fa-solid fa-droplet-slash",
        damagePercent: 100,
        status: "FAILED",
        details: "메인 리턴 라인 크랙으로 압력 0 PSI, 스카이드롤 오일 레벨 0%"
      },
      {
        id: "hyd_b",
        name: "유압 시스템 B (Hydraulic System B)",
        icon: "fa-solid fa-droplet-slash",
        damagePercent: 96,
        status: "FAILED",
        details: "플랩 모터 라인 파열, 전기 모터 펌프(EMDP) 과열 셧다운"
      },
      {
        id: "flight_controls",
        name: "주 조종면 수동 전환 (Manual Reversion Mode)",
        icon: "fa-solid fa-gamepad",
        damagePercent: 78,
        status: "CRITICAL",
        details: "에일러론/엘리베이터 케이블 탭 직접 기계식 조작 (조작 하중 극심)"
      },
      {
        id: "flaps_slats",
        name: "고양력 장치 (Flaps & Slats Actuators)",
        icon: "fa-solid fa-arrows-split-up-and-left",
        damagePercent: 85,
        status: "FAILED",
        details: "플랩 0° 고착 (Flaps UP 착륙 강제 -> 착륙속도 165KT 초고속 접근)"
      },
      {
        id: "landing_gear",
        name: "노즈휠 조향 및 일반 제동 (Nose Steering & Normal Brake)",
        icon: "fa-solid fa-ban",
        damagePercent: 90,
        status: "FAILED",
        details: "지상 방향 조향 불가, 비상 어큐뮬레이터 브레이크로만 정지 가능"
      }
    ],
    replacementParts: [
      {
        partNumber: "P/N 20-3183-1",
        name: "엔진 구동 고압 유압 펌프 (Engine Driven Pump EDP)",
        category: "Hydraulics (유압펌프)",
        qty: "2 EA",
        urgency: "MANDATORY",
        action: "오일 고갈 드라이런 파손 전량 교체",
        estCostUSD: 74000,
        leadTimeHours: 12,
        ammChapter: "ATA 29-11"
      },
      {
        partNumber: "P/N 65-49230-10",
        name: "주 날개 유압 고압 티타늄 배관 튜브 (Rigid Pressure Line)",
        category: "Hydraulics (배관라인)",
        qty: "3 Sections",
        urgency: "MANDATORY",
        action: "파열 배관 신품 재배관 및 플러싱",
        estCostUSD: 31000,
        leadTimeHours: 20,
        ammChapter: "ATA 29-21"
      },
      {
        partNumber: "P/N 300-019-1",
        name: "브레이크 비상 압력 어큐뮬레이터 (Brake Accumulator)",
        category: "Hydraulics (어큐뮬레이터)",
        qty: "1 EA",
        urgency: "URGENT",
        action: "질소 재충전 및 내부 다이어프램 점검",
        estCostUSD: 18000,
        leadTimeHours: 6,
        ammChapter: "ATA 32-43"
      },
      {
        partNumber: "P/N SKYDROL-LD4",
        name: "BMS 3-11 Type IV 유압 작동유 (Skydrol Hydraulic Fluid)",
        category: "Consumables (소모자재)",
        qty: "80 Gallons",
        urgency: "MANDATORY",
        action: "계통 전체 오일 재충진 및 에어 브리딩",
        estCostUSD: 6500,
        leadTimeHours: 8,
        ammChapter: "ATA 12-12"
      }
    ]
  },

  cargo_fire: {
    overallDamagePercent: 74,
    statusText: "심각 (CARGO COMPARTMENT FIRE)",
    statusColor: "#ff0055",
    summary: "후방 C-Class 화물칸 리튬배터리 열폭주 추정 화재. 소화 가스(Halon 1301) 1차 고속 방출 및 2차 완만 방출 진행 중. 구조 차열벽 열화.",
    subsystems: [
      {
        id: "cargo_bay",
        name: "후방 화물칸 C-Class 라이너 (Aft Cargo Liner)",
        icon: "fa-solid fa-boxes-stacked",
        damagePercent: 92,
        status: "CRITICAL",
        details: "화재 구역 라이너 패널 국소 탄화 및 단열 글래스울 소손"
      },
      {
        id: "fire_bottles",
        name: "화물칸 소화 시스템 (Cargo Fire Suppression)",
        icon: "fa-solid fa-fire-extinguisher",
        damagePercent: 100,
        status: "FAILED",
        details: "1/2차 소화 보틀 완전 방출 완료 (소화 압력 0 PSI 도달)"
      },
      {
        id: "smoke_detect",
        name: "광학식 연기 감지기 (Optical Smoke Detectors)",
        icon: "fa-solid fa-smog",
        damagePercent: 80,
        status: "FAILED",
        details: "센서 챔버 그을음 및 검댕 오염으로 센싱 기능 영구 불능"
      },
      {
        id: "cabin_floor",
        name: "객실 바닥 구조재 (Cabin Floor Crossbeams)",
        icon: "fa-solid fa-layer-group",
        damagePercent: 35,
        status: "CAUTION",
        details: "화물칸 상단 바닥 빔 고온 노출 (NDT 강도 비파괴 검사 필수)"
      },
      {
        id: "electrical",
        name: "하부 기체 배선 하네스 (Lower Fuselage Wire Harness)",
        icon: "fa-solid fa-network-wired",
        damagePercent: 55,
        status: "CAUTION",
        details: "인접 항법/센서 케이블 피복 열화 융해 위험"
      }
    ],
    replacementParts: [
      {
        partNumber: "P/N 65-42890-4",
        name: "C-Class 화물칸 방화 복합재 라이너 패널 (Cargo Liner Panels)",
        category: "Structures (화물칸)",
        qty: "6 Panels",
        urgency: "MANDATORY",
        action: "화재 탄화 패널 전량 교체",
        estCostUSD: 45000,
        leadTimeHours: 16,
        ammChapter: "ATA 25-52"
      },
      {
        partNumber: "P/N 473597-2",
        name: "화물 소화용 대용량 할론 보틀 (Cargo Fire Extinguisher 50lb)",
        category: "Fire Protection (소화)",
        qty: "2 EA",
        urgency: "MANDATORY",
        action: "신품 충전 완제품 교체",
        estCostUSD: 28000,
        leadTimeHours: 6,
        ammChapter: "ATA 26-23"
      },
      {
        partNumber: "P/N 473599-1",
        name: "화물칸 연기 감지기 센서 (Smoke Detector Optical Head)",
        category: "Avionics (센서)",
        qty: "4 EA",
        urgency: "MANDATORY",
        action: "신품 교체 및 전자기 테스트",
        estCostUSD: 16500,
        leadTimeHours: 4,
        ammChapter: "ATA 26-14"
      }
    ]
  }
};

/**
 * Returns damage assessment profile for the current aircraft state and scenario
 */
export function getAircraftDamageReport(emergencyKey) {
  return B737_DAMAGE_PROFILES[emergencyKey] || B737_DAMAGE_PROFILES.dual_engine_flameout;
}

/**
 * Updates the Damage & Parts Modal UI
 */
export function updateDamageModalUI(emergencyKey) {
  const profile = getAircraftDamageReport(emergencyKey);
  const modal = document.getElementById("aircraftDamageModal");
  if (!modal) return;

  // Header Badge in Cockpit
  const headerBadge = document.getElementById("headerDamageBadge");
  if (headerBadge) {
    headerBadge.textContent = `${profile.overallDamagePercent}% 손상 (${profile.statusText.split(' ')[0]})`;
    headerBadge.style.backgroundColor = profile.statusColor + "22";
    headerBadge.style.color = profile.statusColor;
    headerBadge.style.borderColor = profile.statusColor;
  }

  // Modal Overall Gauge
  const overallVal = document.getElementById("dmgOverallVal");
  if (overallVal) overallVal.textContent = `${profile.overallDamagePercent}%`;

  const overallBar = document.getElementById("dmgOverallBar");
  if (overallBar) {
    overallBar.style.width = `${profile.overallDamagePercent}%`;
    overallBar.style.backgroundColor = profile.statusColor;
  }

  const overallDesc = document.getElementById("dmgOverallDesc");
  if (overallDesc) overallDesc.textContent = profile.summary;

  const statusPill = document.getElementById("dmgStatusPill");
  if (statusPill) {
    statusPill.textContent = profile.statusText;
    statusPill.style.color = profile.statusColor;
    statusPill.style.borderColor = profile.statusColor;
    statusPill.style.backgroundColor = profile.statusColor + "18";
  }

  // Render Subsystems List
  const subsystemsList = document.getElementById("dmgSubsystemsList");
  if (subsystemsList) {
    subsystemsList.innerHTML = profile.subsystems.map(sub => {
      let badgeClass = "badge-failed";
      let badgeText = "FAILED (전손)";
      if (sub.status === "CRITICAL") { badgeClass = "badge-crit"; badgeText = "CRITICAL (위험)"; }
      else if (sub.status === "CAUTION") { badgeClass = "badge-caut"; badgeText = "CAUTION (주의)"; }
      else if (sub.status === "NORMAL") { badgeClass = "badge-norm"; badgeText = "NORMAL (정상)"; }

      let barColor = "#ff0055";
      if (sub.damagePercent < 30) barColor = "#00c853";
      else if (sub.damagePercent < 70) barColor = "#ff9100";

      return `
        <div class="subsystem-damage-item">
          <div class="subsystem-header">
            <div class="sub-title">
              <i class="${sub.icon}"></i>
              <strong>${sub.name}</strong>
            </div>
            <span class="damage-tag ${badgeClass}">${sub.damagePercent}% - ${badgeText}</span>
          </div>
          <div class="damage-bar-track">
            <div class="damage-bar-fill" style="width: ${sub.damagePercent}%; background-color: ${barColor};"></div>
          </div>
          <div class="subsystem-desc">${sub.details}</div>
        </div>
      `;
    }).join("");
  }

  // Render Replacement Parts Table
  const partsTbody = document.getElementById("dmgPartsTbody");
  if (partsTbody) {
    let totalEstCost = 0;
    let maxDowntime = 0;

    partsTbody.innerHTML = profile.replacementParts.map(part => {
      totalEstCost += part.estCostUSD;
      if (part.leadTimeHours > maxDowntime) maxDowntime = part.leadTimeHours;

      return `
        <tr>
          <td>
            <strong class="part-pn">${part.partNumber}</strong>
            <small class="text-muted" style="display:block;">${part.ammChapter}</small>
          </td>
          <td>
            <strong>${part.name}</strong>
            <small class="text-muted" style="display:block;">분류: ${part.category} | 수량: ${part.qty}</small>
          </td>
          <td>
            <span class="urgency-pill ${part.urgency.toLowerCase()}">${part.urgency}</span>
          </td>
          <td><span class="action-tag">${part.action}</span></td>
          <td><strong class="text-amber">$${part.estCostUSD.toLocaleString()}</strong></td>
          <td><strong>${part.leadTimeHours} hrs</strong></td>
        </tr>
      `;
    }).join("");

    const costEl = document.getElementById("dmgTotalCostVal");
    if (costEl) costEl.textContent = `$${totalEstCost.toLocaleString()}`;

    const timeEl = document.getElementById("dmgTotalTimeVal");
    if (timeEl) timeEl.textContent = `약 ${maxDowntime} 시간 (정비창 대기)`;
  }
}
