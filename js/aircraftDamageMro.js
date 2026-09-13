// Boeing 737 Detailed Subsystem Damage Assessment & Component MRO Engine
// Detailed breakdown: Left & Right Wings, Left & Right Ailerons, Left & Right Elevators, Left & Right Flaps/Slats, Left & Right Spoilers, Rudder, Engines, Hydraulics

export const B737_DAMAGE_PROFILES = {
  dual_engine_flameout: {
    overallDamagePercent: 82,
    statusText: "심각 (CRITICAL DAMAGE)",
    statusColor: "#ff0055",
    summary: "양쪽 CFM56-7B 엔진 코어 소화(Flameout). 주 유압 EDP 상실로 에일러론·엘리베이터 조종 반응 둔화. 무동력 활공으로 날개 및 공력 조종면 구조 보존 집중.",
    subsystems: [
      {
        id: "eng1",
        category: "powerplant",
        name: "1번 좌측 엔진 (CFM56-7B #1 Left)",
        icon: "fa-solid fa-fan",
        damagePercent: 96,
        status: "FAILED",
        details: "연소실 화염 상실(Flameout), 고압 터빈(HPT) 팁 마모 및 열변형, N2 0% 셧다운."
      },
      {
        id: "eng2",
        category: "powerplant",
        name: "2번 우측 엔진 (CFM56-7B #2 Right)",
        icon: "fa-solid fa-fan",
        damagePercent: 92,
        status: "FAILED",
        details: "압축기 스톨, 터빈 블레이드 록킹(Seizure), 윈드밀 회전 불능."
      },
      {
        id: "hydraulics",
        category: "powerplant",
        name: "A/B/Standby 유압 계통 (Hydraulic Systems)",
        icon: "fa-solid fa-oil-can",
        damagePercent: 72,
        status: "CRITICAL",
        details: "엔진 EDP 회전 중단으로 주 유압 0 PSI. 전동 EMDP 및 스탠바이 펌프로 최소 압력 유지."
      },
      {
        id: "left_flaps_slats",
        category: "wing_controls",
        name: "좌측 플랩 & 전연 슬랫 (LH Flaps & LE Slats)",
        icon: "fa-solid fa-angle-down",
        damagePercent: 62,
        status: "CRITICAL",
        details: "주 유압 B 부재로 좌측 일반 플랩 전개 불가. 비상 전기 플랩(Alternate Flaps) 15° 전개 대기."
      },
      {
        id: "right_flaps_slats",
        category: "wing_controls",
        name: "우측 플랩 & 전연 슬랫 (RH Flaps & LE Slats)",
        icon: "fa-solid fa-angle-down",
        damagePercent: 62,
        status: "CRITICAL",
        details: "우측 플랩 비대칭 전개(Asymmetry) 방지를 위해 전기 모터 동기화 모니터링 필수."
      },
      {
        id: "left_spoilers",
        category: "wing_controls",
        name: "좌측 비행 스포일러 (LH Spoilers - Panels 1~6)",
        icon: "fa-solid fa-chart-area",
        damagePercent: 58,
        status: "CAUTION",
        details: "유압 A/B 감압으로 좌측 6개 스포일러 중 3개 패널만 제한적 전개 가능 (롤 보조 약화)."
      },
      {
        id: "right_spoilers",
        category: "wing_controls",
        name: "우측 비행 스포일러 (RH Spoilers - Panels 7~12)",
        icon: "fa-solid fa-chart-area",
        damagePercent: 58,
        status: "CAUTION",
        details: "우측 6개 패널 중 3개 패널만 제한적 전개 가능 (접지 시 감속 거리 연장 주의)."
      },
      {
        id: "left_elevator",
        category: "wing_controls",
        name: "좌측 승강타 (LH Elevator & Feel Unit)",
        icon: "fa-solid fa-arrows-up-down",
        damagePercent: 52,
        status: "CAUTION",
        details: "피치(Pitch) 제어 좌측 엘리베이터 필 앤 센터링 유닛 압력 저하. 활공 적정 피치 수동 유지."
      },
      {
        id: "right_elevator",
        category: "wing_controls",
        name: "우측 승강타 (RH Elevator & Feel Unit)",
        icon: "fa-solid fa-arrows-up-down",
        damagePercent: 52,
        status: "CAUTION",
        details: "우측 승강타 동기화 토크 튜브 건전. 과도한 급조작 금지."
      },
      {
        id: "left_aileron",
        category: "wing_controls",
        name: "좌측 에일러론 (Left Aileron & LH PCU)",
        icon: "fa-solid fa-arrows-split-up-and-left",
        damagePercent: 48,
        status: "CAUTION",
        details: "주 유압 EDP 상실로 좌측 파워 컨트롤 유닛(PCU) 압력 1,200 PSI 저하. 롤(Roll) 조타력 무거움."
      },
      {
        id: "right_aileron",
        category: "wing_controls",
        name: "우측 에일러론 (Right Aileron & RH PCU)",
        icon: "fa-solid fa-arrows-split-up-and-left",
        damagePercent: 48,
        status: "CAUTION",
        details: "우측 보조익 PCU 저압 상태. 기계식 케이블 연결 유지로 조종 안정성 확보."
      },
      {
        id: "landing_gear",
        category: "airframe",
        name: "착륙 장치 및 제동계 (Landing Gear & Brakes)",
        icon: "fa-solid fa-circle-notch",
        damagePercent: 45,
        status: "CAUTION",
        details: "수동 중력 하강(Manual Gear Extension) 필수. 카본 브레이크 어큐뮬레이터 잔여 2회 정지."
      },
      {
        id: "rudder",
        category: "wing_controls",
        name: "수직 꼬리날개 방향타 (Rudder & Standby PCU)",
        icon: "fa-solid fa-arrows-left-right",
        damagePercent: 35,
        status: "CAUTION",
        details: "스탠바이 유압 펌프 가동으로 방향타 조타 유효. 요 댐퍼(Yaw Damper) 비정상 표시."
      },
      {
        id: "stabilizer_trim",
        category: "wing_controls",
        name: "수평안정판 피치 트림 (Horizontal Stabilizer Trim)",
        icon: "fa-solid fa-sliders",
        damagePercent: 28,
        status: "NORMAL",
        details: "전동 트림 모터 정상. 조종간 수동 트림 휠(Manual Trim Wheel) 즉시 조작 가능."
      },
      {
        id: "left_wing",
        category: "wing_controls",
        name: "좌측 주익 및 스파 (Left Main Wing & Spar)",
        icon: "fa-solid fa-plane",
        damagePercent: 12,
        status: "NORMAL",
        details: "주익 전/후방 스파(Spar) 및 No.1 연료탱크 구조 건전성 양호. 공력 하중 1.2G 이내 유지."
      },
      {
        id: "right_wing",
        category: "wing_controls",
        name: "우측 주익 및 윙렛 (Right Main Wing & Winglet)",
        icon: "fa-solid fa-plane",
        damagePercent: 12,
        status: "NORMAL",
        details: "No.2 연료탱크 및 블렌디드 윙렛 구조 안정. 균형 양력 분배 정상."
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
        partNumber: "P/N 65-44605-14",
        name: "에일러론 파워 컨트롤 유닛 (Aileron PCU Dual Tandem)",
        category: "Flight Controls (에일러론)",
        qty: "2 EA",
        urgency: "MANDATORY",
        action: "좌/우 PCU 오버홀 벤치 테스트 및 씰 교체",
        estCostUSD: 42000,
        leadTimeHours: 12,
        ammChapter: "ATA 27-11"
      },
      {
        partNumber: "P/N 65-44810-8",
        name: "엘리베이터 필 앤 센터링 유닛 (Elevator Feel Unit)",
        category: "Flight Controls (엘리베이터)",
        qty: "1 EA",
        urgency: "URGENT",
        action: "정밀 압력 센서 및 스프링 교정",
        estCostUSD: 28500,
        leadTimeHours: 8,
        ammChapter: "ATA 27-31"
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
      },
      {
        partNumber: "P/N 301-785-301-0",
        name: "엔진 연료 조절 제어기 (HMU / FADEC ECU)",
        category: "Powerplant (연료제어)",
        qty: "2 EA",
        urgency: "MANDATORY",
        action: "공장 리퍼브 및 펌웨어 분석",
        estCostUSD: 68000,
        leadTimeHours: 16,
        ammChapter: "ATA 73-21"
      }
    ]
  },

  single_engine_failure: {
    overallDamagePercent: 54,
    statusText: "경고 (MAJOR FAILURE)",
    statusColor: "#ff9100",
    summary: "1번 좌측 엔진 화재 소손 및 베어링 소착. 좌우 비대칭 추력으로 인한 러더 트림 5.5유닛 편향 및 좌측 날개 카울링 열손상.",
    subsystems: [
      {
        id: "eng1",
        category: "powerplant",
        name: "1번 좌측 엔진 (CFM56-7B #1 - FIRE)",
        icon: "fa-solid fa-fire",
        damagePercent: 98,
        status: "FAILED",
        details: "엔진 코어 화재 전소, No.3 베어링 소착, 연료 컷오프 스위치 잠김, 소화제 방출 완료."
      },
      {
        id: "rudder",
        category: "wing_controls",
        name: "수직 꼬리날개 러더 (Rudder & Trim Tab)",
        icon: "fa-solid fa-arrows-left-right",
        damagePercent: 68,
        status: "CRITICAL",
        details: "비대칭 요(Yaw) 상쇄를 위해 우측 5.5도 트림 고착 지속. 메인 러더 PCU 연속 고부하 상태."
      },
      {
        id: "left_wing",
        category: "wing_controls",
        name: "좌측 주익 및 파일런 (LH Main Wing & Pylon)",
        icon: "fa-solid fa-plane",
        damagePercent: 42,
        status: "CAUTION",
        details: "1번 엔진 파일론(Pylon) 마운트 및 인근 주익 전연 써멀 블랭킷 고온 노출 (열화 검사 요망)."
      },
      {
        id: "hydraulics",
        category: "powerplant",
        name: "유압 시스템 A/B (Hydraulic System A/B)",
        icon: "fa-solid fa-oil-can",
        damagePercent: 35,
        status: "CAUTION",
        details: "1번 엔진 EDP 중단으로 A 시스템 전동 EMDP 단독 구동 중 (2,800 PSI 유지)."
      },
      {
        id: "left_spoilers",
        category: "wing_controls",
        name: "좌측 비행 스포일러 (LH Spoilers)",
        icon: "fa-solid fa-chart-area",
        damagePercent: 30,
        status: "CAUTION",
        details: "좌측 엔진 화재 후류 및 와류로 패널 진동 주의."
      },
      {
        id: "left_aileron",
        category: "wing_controls",
        name: "좌측 에일러론 (Left Aileron & Trim)",
        icon: "fa-solid fa-arrows-split-up-and-left",
        damagePercent: 28,
        status: "CAUTION",
        details: "좌측 날개 파일론 항력 증가 보상을 위한 에일러론 1.5도 반대 트림 유지 중."
      },
      {
        id: "left_flaps_slats",
        category: "wing_controls",
        name: "좌측 플랩 및 슬랫 (LH Flaps & Slats)",
        icon: "fa-solid fa-angle-down",
        damagePercent: 24,
        status: "NORMAL",
        details: "좌측 엔진 나셀 화재 차폐 상태 양호, 단발 접근 플랩 15° 전개 준비."
      },
      {
        id: "right_flaps_slats",
        category: "wing_controls",
        name: "우측 플랩 및 슬랫 (RH Flaps & Slats)",
        icon: "fa-solid fa-angle-down",
        damagePercent: 20,
        status: "NORMAL",
        details: "우측 트레일링 에지 플랩 정상 전개 가능."
      },
      {
        id: "right_spoilers",
        category: "wing_controls",
        name: "우측 비행 스포일러 (RH Spoilers)",
        icon: "fa-solid fa-chart-area",
        damagePercent: 18,
        status: "NORMAL",
        details: "지상 접지 시 스피드브레이크 자동 전개(Auto-Speedbrake) 정상 대기."
      },
      {
        id: "right_aileron",
        category: "wing_controls",
        name: "우측 에일러론 (Right Aileron & PCU)",
        icon: "fa-solid fa-arrows-split-up-and-left",
        damagePercent: 16,
        status: "NORMAL",
        details: "우측 롤 제어면 유압 B 공급 정상."
      },
      {
        id: "eng2",
        category: "powerplant",
        name: "2번 우측 엔진 (CFM56-7B #2 Right)",
        icon: "fa-solid fa-fan",
        damagePercent: 15,
        status: "NORMAL",
        details: "단발 지속 비행 중 (N1 93%, EGT 845°C 한계 마진 15°C 여유)."
      },
      {
        id: "left_elevator",
        category: "wing_controls",
        name: "좌측 승강타 (LH Elevator)",
        icon: "fa-solid fa-arrows-up-down",
        damagePercent: 15,
        status: "NORMAL",
        details: "단발 강하(Drift-down) 고도 유지 정상 피치 제어."
      },
      {
        id: "right_elevator",
        category: "wing_controls",
        name: "우측 승강타 (RH Elevator)",
        icon: "fa-solid fa-arrows-up-down",
        damagePercent: 15,
        status: "NORMAL",
        details: "승강타 토크 튜브 정상 작동."
      },
      {
        id: "stabilizer_trim",
        category: "wing_controls",
        name: "수평안정판 트림 (Horizontal Stabilizer Trim)",
        icon: "fa-solid fa-sliders",
        damagePercent: 14,
        status: "NORMAL",
        details: "단발 순항 안정 피치 트림 4.2 유닛 유지."
      },
      {
        id: "right_wing",
        category: "wing_controls",
        name: "우측 주익 및 윙렛 (Right Main Wing & Winglet)",
        icon: "fa-solid fa-plane",
        damagePercent: 8,
        status: "NORMAL",
        details: "2번 엔진 단발 추력 100% 전달 중. 구조적 응력 정상 범위 내."
      }
    ],
    replacementParts: [
      {
        partNumber: "P/N CFM56-7B26E",
        name: "CFM56-7B26/3 터보팬 엔진 코어 통교체 (Engine QEC Assembly)",
        category: "Powerplant (엔진)",
        qty: "1 EA",
        urgency: "MANDATORY",
        action: "엔진 탈착 및 신품/오버홀 엔진 스왑",
        estCostUSD: 3400000,
        leadTimeHours: 36,
        ammChapter: "ATA 71-00"
      },
      {
        partNumber: "P/N 65-44750-12",
        name: "메인 러더 파워 컨트롤 유닛 (Main Rudder PCU)",
        category: "Flight Controls (러더)",
        qty: "1 EA",
        urgency: "MANDATORY",
        action: "비대칭 고부하 운용 후 정밀 분해 검사 및 오버홀",
        estCostUSD: 38000,
        leadTimeHours: 14,
        ammChapter: "ATA 27-21"
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
        name: "1번 엔진 파일론 써멀 히트 쉴드 (Nacelle Heat Shield)",
        category: "Structures (카울링)",
        qty: "1 Set",
        urgency: "MANDATORY",
        action: "화재 열변형 카울링 패널 신품 교체",
        estCostUSD: 42000,
        leadTimeHours: 12,
        ammChapter: "ATA 78-31"
      }
    ]
  },

  hydraulic_total_loss: {
    overallDamagePercent: 88,
    statusText: "극도 심각 (TOTAL HYDRAULIC LOSS)",
    statusColor: "#d50000",
    summary: "A/B 주 유압 라인 파열로 오일(Skydrol) 전량 누유. 에일러론·엘리베이터가 수동 케이블(Manual Reversion)로 전환되어 조타 하중 극심. 플랩 0° 및 러더 스탠바이 의존.",
    subsystems: [
      {
        id: "hydraulics",
        category: "powerplant",
        name: "A/B 주 유압 펌프 및 리저버 (Hydraulic System A/B)",
        icon: "fa-solid fa-oil-can",
        damagePercent: 100,
        status: "FAILED",
        details: "고압 EDP 2기 소손 파손, 오일 리저버 레벨 0%, 유압 배관 전손."
      },
      {
        id: "left_flaps_slats",
        category: "wing_controls",
        name: "좌측 플랩 & 슬랫 (LH Flaps & Slats)",
        icon: "fa-solid fa-angle-down",
        damagePercent: 100,
        status: "FAILED",
        details: "유압 모터 구동 불능으로 0° 전개 고착 (Flaps UP 접근 강제 -> 접지 속도 165KT 초고속)."
      },
      {
        id: "right_flaps_slats",
        category: "wing_controls",
        name: "우측 플랩 & 슬랫 (RH Flaps & Slats)",
        icon: "fa-solid fa-angle-down",
        damagePercent: 100,
        status: "FAILED",
        details: "우측 플랩 0° 고착, 고속 접지 시 타이어 버스트 주의."
      },
      {
        id: "left_spoilers",
        category: "wing_controls",
        name: "좌측 스포일러 (LH Flight Spoilers - Pan. 1~6)",
        icon: "fa-solid fa-chart-area",
        damagePercent: 95,
        status: "FAILED",
        details: "유압 압력 전손으로 6개 패널 일체 전개 불가 (좌측 공력 감속 수단 상실)."
      },
      {
        id: "right_spoilers",
        category: "wing_controls",
        name: "우측 스포일러 (RH Flight Spoilers - Pan. 7~12)",
        icon: "fa-solid fa-chart-area",
        damagePercent: 95,
        status: "FAILED",
        details: "유압 상실로 우측 6개 패널 일체 전개 불가."
      },
      {
        id: "landing_gear",
        category: "airframe",
        name: "노즈휠 조향 및 일반 제동 (Nose Steering & Normal Brake)",
        icon: "fa-solid fa-ban",
        damagePercent: 92,
        status: "FAILED",
        details: "지상 노즈 조향 불가 (러더 패달 스티어링 불능), 비상 브레이크 어큐뮬레이터만 가능."
      },
      {
        id: "left_aileron",
        category: "wing_controls",
        name: "좌측 에일러론 (Left Aileron - Manual Reversion)",
        icon: "fa-solid fa-arrows-split-up-and-left",
        damagePercent: 86,
        status: "FAILED",
        details: "유압 파워 어시스트 상실. 좌측 완력 조작 케이블 직접 견인 (조타력 5배 이상 무거움)."
      },
      {
        id: "right_aileron",
        category: "wing_controls",
        name: "우측 에일러론 (Right Aileron - Manual Reversion)",
        icon: "fa-solid fa-arrows-split-up-and-left",
        damagePercent: 85,
        status: "FAILED",
        details: "우측 PCU 유압 차단. 수동 밸런스 탭(Balance Tab)에만 의존하여 롤 반응 둔감."
      },
      {
        id: "left_elevator",
        category: "wing_controls",
        name: "좌측 승강타 (Left Elevator - Manual Reversion)",
        icon: "fa-solid fa-arrows-up-down",
        damagePercent: 82,
        status: "FAILED",
        details: "유압 PCU 작동 중단. 승강타 기계식 케이블 수동 당김으로 피치 제어 조타 한계."
      },
      {
        id: "right_elevator",
        category: "wing_controls",
        name: "우측 승강타 (Right Elevator - Manual Reversion)",
        icon: "fa-solid fa-arrows-up-down",
        damagePercent: 82,
        status: "FAILED",
        details: "우측 승강타 조종간 반력 극심. 양손 조작 필수."
      },
      {
        id: "left_wing",
        category: "wing_controls",
        name: "좌측 날개 고압 배관 구조 (Left Wing Tube & Spar)",
        icon: "fa-solid fa-plane",
        damagePercent: 48,
        status: "CRITICAL",
        details: "좌측 주익 휠웰 통과 메인 A 유압 고압 배관 파열 (스카이드롤 분사 오염)."
      },
      {
        id: "stabilizer_trim",
        category: "wing_controls",
        name: "수평안정판 트림 휠 (Manual Trim Jackscrew)",
        icon: "fa-solid fa-sliders",
        damagePercent: 45,
        status: "CAUTION",
        details: "메인 전동 트림 상실. 조종석 중앙 수동 트림 휠 손잡이로 기계식 케이블 수동 회전 중."
      },
      {
        id: "right_wing",
        category: "wing_controls",
        name: "우측 날개 구조 (Right Wing Structural Tube)",
        icon: "fa-solid fa-plane",
        damagePercent: 40,
        status: "CAUTION",
        details: "우측 플랩 구동 샤프트 토크 튜브 오일 고갈 드라이 회전."
      },
      {
        id: "rudder",
        category: "wing_controls",
        name: "수직 꼬리날개 러더 (Standby Rudder PCU)",
        icon: "fa-solid fa-arrows-left-right",
        damagePercent: 40,
        status: "CAUTION",
        details: "스탠바이 유압 계통으로만 동작 중 (스탠바이 펌프 과열 주의, 편향각 제한)."
      }
    ],
    replacementParts: [
      {
        partNumber: "P/N 20-3183-1",
        name: "엔진 구동 고압 유압 펌프 (Engine Driven Pump EDP)",
        category: "Hydraulics (유압펌프)",
        qty: "2 EA",
        urgency: "MANDATORY",
        action: "오일 고갈 드라이런 파손 신품 전량 교체",
        estCostUSD: 74000,
        leadTimeHours: 12,
        ammChapter: "ATA 29-11"
      },
      {
        partNumber: "P/N 65-44605-14",
        name: "에일러론 수동 밸런스 탭 케이블 어셈블리 (Aileron Balance Cable)",
        category: "Flight Controls (에일러론)",
        qty: "1 Set",
        urgency: "MANDATORY",
        action: "수동 조작 과부하 인장 와이어 전량 교체",
        estCostUSD: 18500,
        leadTimeHours: 16,
        ammChapter: "ATA 27-11"
      },
      {
        partNumber: "P/N 65-49230-10",
        name: "주 날개 유압 고압 티타늄 배관 튜브 (Rigid Pressure Line)",
        category: "Hydraulics (배관라인)",
        qty: "3 Sections",
        urgency: "MANDATORY",
        action: "파열 배관 신품 재배관 및 계통 플러싱",
        estCostUSD: 31000,
        leadTimeHours: 20,
        ammChapter: "ATA 29-21"
      },
      {
        partNumber: "P/N 260-1412-00",
        name: "메인 휠 고성능 카본 브레이크 디스크 (High-Energy Carbon Brake)",
        category: "Landing Gear (제동계)",
        qty: "4 Sets",
        urgency: "MANDATORY",
        action: "노플랩 초고속 접지 열변형 전량 교체",
        estCostUSD: 56000,
        leadTimeHours: 8,
        ammChapter: "ATA 32-41"
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

  rapid_depressurization: {
    overallDamagePercent: 68,
    statusText: "심각 (PRESSURE HULL BREACH)",
    statusColor: "#ff0055",
    summary: "후방 압력 격벽 씰링 파열 및 메인 아웃플로우 밸브 고착으로 인한 객실 급감압. 189석 승객 산소 마스크 전량 강하 및 화학 발생기 소진.",
    subsystems: [
      {
        id: "oxygen_sys",
        category: "airframe",
        name: "승객 비상 산소 시스템 (Passenger Oxygen System)",
        icon: "fa-solid fa-head-side-mask",
        damagePercent: 100,
        status: "FAILED",
        details: "189석 산소 마스크 전량 드롭 및 화학 캔들 1회성 연소 소진 (재사용 불가)."
      },
      {
        id: "cabin_press",
        category: "airframe",
        name: "여압 아웃플로우 밸브 (Outflow Valve Assembly)",
        icon: "fa-solid fa-wind",
        damagePercent: 96,
        status: "FAILED",
        details: "구동 모터 기어비 고착으로 최대 개방 상태 고정. 객실 압력 고도 FL310 급상승."
      },
      {
        id: "bulkhead",
        category: "airframe",
        name: "후방 압력 격벽 (Aft Pressure Bulkhead)",
        icon: "fa-solid fa-shield-halved",
        damagePercent: 88,
        status: "CRITICAL",
        details: "격벽 돔 구조 리벳 전단 응력 및 기밀 실란트 파열. NDT 초음파 피로 검사 필수."
      },
      {
        id: "left_elevator",
        category: "wing_controls",
        name: "좌측 승강타 (Left Elevator & Tab)",
        icon: "fa-solid fa-arrows-up-down",
        damagePercent: 18,
        status: "NORMAL",
        details: "급강하(Emergency Descent) FL100 하강 시 정상 기동 응답 유지."
      },
      {
        id: "right_elevator",
        category: "wing_controls",
        name: "우측 승강타 (Right Elevator & Tab)",
        icon: "fa-solid fa-arrows-up-down",
        damagePercent: 18,
        status: "NORMAL",
        details: "정상 피치 기동 응답 유지."
      },
      {
        id: "left_flaps_slats",
        category: "wing_controls",
        name: "좌측 플랩 & 슬랫 (Left Flaps & Slats)",
        icon: "fa-solid fa-angle-down",
        damagePercent: 15,
        status: "NORMAL",
        details: "정상 플랩 착륙 구성 전개 가능."
      },
      {
        id: "right_flaps_slats",
        category: "wing_controls",
        name: "우측 플랩 & 슬랫 (Right Flaps & Slats)",
        icon: "fa-solid fa-angle-down",
        damagePercent: 15,
        status: "NORMAL",
        details: "정상 플랩 착륙 구성 전개 가능."
      },
      {
        id: "rudder",
        category: "wing_controls",
        name: "수직 꼬리날개 러더 (Rudder Assembly)",
        icon: "fa-solid fa-arrows-left-right",
        damagePercent: 14,
        status: "NORMAL",
        details: "정상 방향 제어 유지."
      },
      {
        id: "left_aileron",
        category: "wing_controls",
        name: "좌측 에일러론 (Left Aileron)",
        icon: "fa-solid fa-arrows-split-up-and-left",
        damagePercent: 12,
        status: "NORMAL",
        details: "좌측 롤 제어 및 급강하 조타 안정."
      },
      {
        id: "right_aileron",
        category: "wing_controls",
        name: "우측 에일러론 (Right Aileron)",
        icon: "fa-solid fa-arrows-split-up-and-left",
        damagePercent: 12,
        status: "NORMAL",
        details: "우측 롤 제어 및 급강하 조타 안정."
      },
      {
        id: "left_spoilers",
        category: "wing_controls",
        name: "좌측 비행 스포일러 (Left Flight Spoilers)",
        icon: "fa-solid fa-chart-area",
        damagePercent: 12,
        status: "NORMAL",
        details: "급강하 스피드브레이크 정상 전개로 감속 기여."
      },
      {
        id: "right_spoilers",
        category: "wing_controls",
        name: "우측 비행 스포일러 (Right Flight Spoilers)",
        icon: "fa-solid fa-chart-area",
        damagePercent: 12,
        status: "NORMAL",
        details: "급강하 스피드브레이크 정상 전개."
      },
      {
        id: "left_wing",
        category: "wing_controls",
        name: "좌측 주익 (Left Main Wing)",
        icon: "fa-solid fa-plane",
        damagePercent: 10,
        status: "NORMAL",
        details: "급강하 320KT 고속 비행 공력 한계 준수."
      },
      {
        id: "right_wing",
        category: "wing_controls",
        name: "우측 주익 (Right Main Wing)",
        icon: "fa-solid fa-plane",
        damagePercent: 10,
        status: "NORMAL",
        details: "구조적 건전성 양호."
      }
    ],
    replacementParts: [
      {
        partNumber: "P/N 40-7004-3",
        name: "캐빈 메인 여압 아웃플로우 밸브 (Main Outflow Valve)",
        category: "Air Conditioning (공조여압)",
        qty: "1 EA",
        urgency: "MANDATORY",
        action: "밸브 구동 모터 및 힌지 플랩 신품 교체",
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
        action: "전 좌석 PSU 1회성 제너레이터 신품 전량 교체",
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
        action: "기체 기밀 실란트 재도포 및 고무 씰 교체",
        estCostUSD: 24000,
        leadTimeHours: 18,
        ammChapter: "ATA 53-81"
      }
    ]
  },

  cargo_fire: {
    overallDamagePercent: 74,
    statusText: "심각 (CARGO COMPARTMENT FIRE)",
    statusColor: "#ff0055",
    summary: "후방 화물칸 리튬배터리 열폭주 화재. C-Class 복합재 라이너 탄화 및 하부 객실 바닥 빔 고온 열화. 15분 골든타임 이내 긴급 접지 필수.",
    subsystems: [
      {
        id: "fire_bottles",
        category: "airframe",
        name: "화물칸 소화 시스템 (Cargo Fire Suppression)",
        icon: "fa-solid fa-fire-extinguisher",
        damagePercent: 100,
        status: "FAILED",
        details: "1차 고속 방출 및 2차 지연 방출 할론 1301 보틀 완전 소진."
      },
      {
        id: "cargo_bay",
        category: "airframe",
        name: "후방 화물칸 C-Class 라이너 (Aft Cargo Compartment)",
        icon: "fa-solid fa-boxes-stacked",
        damagePercent: 94,
        status: "CRITICAL",
        details: "화물칸 복합재 방화벽 국소 관통 열화, 단열재 소손 및 그을음 확산."
      },
      {
        id: "left_elevator",
        category: "wing_controls",
        name: "좌측 엘리베이터 케이블 (LH Elevator Control Cable)",
        icon: "fa-solid fa-arrows-up-down",
        damagePercent: 65,
        status: "CRITICAL",
        details: "화물칸 상단을 통과하는 좌측 승강타 기계식 조종 케이블 고온 노출 (인장력 저하 위험)."
      },
      {
        id: "right_elevator",
        category: "wing_controls",
        name: "우측 엘리베이터 케이블 (RH Elevator Control Cable)",
        icon: "fa-solid fa-arrows-up-down",
        damagePercent: 62,
        status: "CRITICAL",
        details: "우측 승강타 기계 케이블 하네스 고온 노출 (착륙 후 NDT 비파괴 검사 필수)."
      },
      {
        id: "rudder",
        category: "wing_controls",
        name: "수직 꼬리날개 러더 배선 (Rudder Control Harness)",
        icon: "fa-solid fa-arrows-left-right",
        damagePercent: 48,
        status: "CAUTION",
        details: "수직 꼬리날개로 연결되는 하부 배선 피복 열화 위험."
      },
      {
        id: "left_flaps_slats",
        category: "wing_controls",
        name: "좌측 플랩 & 슬랫 (Left Flaps & Slats)",
        icon: "fa-solid fa-angle-down",
        damagePercent: 20,
        status: "NORMAL",
        details: "화재 비상 착륙 전량 전개 가능."
      },
      {
        id: "right_flaps_slats",
        category: "wing_controls",
        name: "우측 플랩 & 슬랫 (Right Flaps & Slats)",
        icon: "fa-solid fa-angle-down",
        damagePercent: 20,
        status: "NORMAL",
        details: "화재 비상 착륙 전량 전개 가능."
      },
      {
        id: "left_spoilers",
        category: "wing_controls",
        name: "좌측 스포일러 (Left Flight Spoilers)",
        icon: "fa-solid fa-chart-area",
        damagePercent: 15,
        status: "NORMAL",
        details: "접지 시 감속 스포일러 전개 대기."
      },
      {
        id: "right_spoilers",
        category: "wing_controls",
        name: "우측 스포일러 (Right Flight Spoilers)",
        icon: "fa-solid fa-chart-area",
        damagePercent: 15,
        status: "NORMAL",
        details: "접지 시 감속 스포일러 전개 대기."
      },
      {
        id: "left_aileron",
        category: "wing_controls",
        name: "좌측 에일러론 (Left Aileron)",
        icon: "fa-solid fa-arrows-split-up-and-left",
        damagePercent: 15,
        status: "NORMAL",
        details: "주익 상단 배선 분리로 롤 제어면 정상 가동."
      },
      {
        id: "right_aileron",
        category: "wing_controls",
        name: "우측 에일러론 (Right Aileron)",
        icon: "fa-solid fa-arrows-split-up-and-left",
        damagePercent: 15,
        status: "NORMAL",
        details: "우측 롤 제어면 정상 가동."
      },
      {
        id: "left_wing",
        category: "wing_controls",
        name: "좌측 주익 (Left Main Wing)",
        icon: "fa-solid fa-plane",
        damagePercent: 12,
        status: "NORMAL",
        details: "주익 연료탱크 써멀 밸브 차단 완료."
      },
      {
        id: "right_wing",
        category: "wing_controls",
        name: "우측 주익 (Right Main Wing)",
        icon: "fa-solid fa-plane",
        damagePercent: 12,
        status: "NORMAL",
        details: "구조적 이상 없음."
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
        partNumber: "P/N 65-44812-3",
        name: "후방 동체 통과 조종면 케이블 셋 (Flight Control Cable Harness)",
        category: "Flight Controls (조종케이블)",
        qty: "1 Set",
        urgency: "MANDATORY",
        action: "고온 열화 케이블 전량 인출 및 교체",
        estCostUSD: 22000,
        leadTimeHours: 18,
        ammChapter: "ATA 27-00"
      },
      {
        partNumber: "P/N 473599-1",
        name: "화물칸 광학식 연기 감지기 센서 (Smoke Detector Optical Head)",
        category: "Avionics (화재감지)",
        qty: "4 EA",
        urgency: "MANDATORY",
        action: "오염 센서 탈착 및 신품 교체",
        estCostUSD: 9500,
        leadTimeHours: 6,
        ammChapter: "ATA 26-11"
      }
    ]
  }
};

export function getAircraftDamageReport(emergencyKey) {
  return B737_DAMAGE_PROFILES[emergencyKey] || B737_DAMAGE_PROFILES.dual_engine_flameout;
}

let activeDamageFilter = "all";

/**
 * Updates the Damage & Parts Modal UI with detailed categorized components
 * Sorted by severity descending (손상 심각도순 정렬)
 */
export function updateDamageModalUI(emergencyKey) {
  const profile = getAircraftDamageReport(emergencyKey);
  if (!profile) return;

  // 1. Update Top Header Quick Button & Badge
  const headerDmgBadge = document.getElementById("headerDamageBadge");
  if (headerDmgBadge) {
    headerDmgBadge.textContent = `${profile.overallDamagePercent}% 손상`;
    headerDmgBadge.style.color = profile.statusColor;
    headerDmgBadge.style.borderColor = profile.statusColor;
  }
  const openDmgBtn = document.getElementById("openDamageModalBtn");
  if (openDmgBtn) {
    openDmgBtn.style.color = profile.statusColor;
    openDmgBtn.style.borderColor = profile.statusColor + "70";
    openDmgBtn.style.backgroundColor = profile.statusColor + "15";
  }

  // 2. Modal Overall Gauge
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

  // Filter Subsystems if tab selected
  const filteredSubsystems = profile.subsystems.filter(sub => {
    if (activeDamageFilter === "all") return true;
    if (activeDamageFilter === "wing_controls") return sub.category === "wing_controls";
    if (activeDamageFilter === "powerplant") return sub.category === "powerplant";
    if (activeDamageFilter === "airframe") return sub.category === "airframe";
    return true;
  });

  // Sort by damage severity descending (심각한 순서대로 내림차순 정렬)
  filteredSubsystems.sort((a, b) => {
    if (b.damagePercent !== a.damagePercent) {
      return b.damagePercent - a.damagePercent;
    }
    const order = { FAILED: 4, CRITICAL: 3, CAUTION: 2, NORMAL: 1 };
    return (order[b.status] || 0) - (order[a.status] || 0);
  });

  // Render Subsystems List
  const subsystemsList = document.getElementById("dmgSubsystemsList");
  if (subsystemsList) {
    subsystemsList.innerHTML = filteredSubsystems.map(sub => {
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
          <td class="col-pn">
            <strong class="part-pn">${part.partNumber}</strong>
            <small class="text-muted" style="display:block;">${part.ammChapter}</small>
          </td>
          <td class="col-name">
            <strong>${part.name}</strong>
            <small class="text-muted" style="display:block;">분류: ${part.category} | 수량: ${part.qty}</small>
          </td>
          <td class="col-urgency">
            <span class="urgency-pill ${part.urgency.toLowerCase()}">${part.urgency}</span>
          </td>
          <td class="col-action"><span class="action-tag">${part.action}</span></td>
          <td class="col-cost text-amber">$${part.estCostUSD.toLocaleString()}</td>
          <td class="col-time">${part.leadTimeHours} hrs</td>
        </tr>
      `;
    }).join("");

    const costEl = document.getElementById("dmgTotalCostVal");
    if (costEl) costEl.textContent = `$${totalEstCost.toLocaleString()}`;

    const timeEl = document.getElementById("dmgTotalTimeVal");
    if (timeEl) timeEl.textContent = `약 ${maxDowntime} 시간 (정비창 대기)`;
  }
}

export function setDamageCategoryFilter(category) {
  activeDamageFilter = category;
}
