// Boeing 737 Post-Landing Maintenance Prioritization Engine
// Generates MRO (Maintenance, Repair, and Overhaul) Task Cards based on emergency type & landing severity

export function generateMaintenanceMatrix(emergencyKey, landingSite, aircraftState) {
  const isWaterDitching = landingSite.type === "WATER_DITCHING";
  const isOffField = landingSite.type === "OPEN_TERRAIN";
  const isOverweight = (aircraftState.fuelKg > 5000); // likely over Max Landing Weight

  if (isWaterDitching) {
    return {
      overview: "해상 착수 (Ditching) 특수 비상 상황 - 기체 인양 및 전손(Hull Loss) 조사 절차",
      totalTasks: 4,
      estimatedDowntimeDays: "기체 폐기 또는 수개월 정밀 인양 조사",
      stages: [
        {
          stageNumber: 1,
          title: "Stage 1: 인명 구조 및 부력 유지 (즉시)",
          color: "#ff3366",
          tasks: [
            { id: "MRO-D01", priority: "P1-CRITICAL", title: "해경(KCG) 함정 및 헬기 생존자 구조 지원", dept: "ARFF / Coast Guard", duration: "1~3 hrs", ammRef: "AMM 05-51-28" },
            { id: "MRO-D02", priority: "P1-CRITICAL", title: "비행기록장치(FDR/CVR) 음향 비콘 위치 탐색", dept: "항공철도사고조사위 (ARAIB)", duration: "즉시", ammRef: "ICAO Annex 13" }
          ]
        },
        {
          stageNumber: 2,
          title: "Stage 2: 침수 방지 및 예인 (24시간 이내)",
          color: "#ff9900",
          tasks: [
            { id: "MRO-D03", priority: "P2-HIGH", title: "부유 에어백 체결 및 인근 항구 예인 바지선 투입", dept: "Marine Salvage", duration: "12~36 hrs", ammRef: "Boeing Recovery Doc" },
            { id: "MRO-D04", priority: "P2-HIGH", title: "염수 부식 방지 및 배터리 전원 영구 차단", dept: "Avionics Maintenance", duration: "4 hrs", ammRef: "AMM 24-00" }
          ]
        }
      ]
    };
  }

  // Normal runway or off-field landing
  const stage1Tasks = [
    {
      id: "MRO-S1-01",
      priority: "P1-URGENT",
      title: "핫 브레이크(Hot Brakes) 열화상 점검 및 쿨링 팬 가동",
      desc: "과중량/무유압 정지 시 휠 브레이크 600°C+ 과열 가능. 퓨즈 플러그 융해 및 타이어 파열 방지를 위해 소방대 안개 분무 냉각.",
      dept: "Line Maintenance / ARFF",
      duration: "30 min",
      ammRef: "AMM 32-41-00"
    },
    {
      id: "MRO-S1-02",
      priority: "P1-URGENT",
      title: "기체 주변 유압유(Skydrol) 및 제트 연료 누유 탐지",
      desc: "착륙 충격으로 인한 연료 탱크 리크 및 유압 라인 균열 여부 FLIR 감시.",
      dept: "Line Maintenance",
      duration: "20 min",
      ammRef: "AMM 28-10-00"
    },
    {
      id: "MRO-S1-03",
      priority: "P2-HIGH",
      title: "조종석 비상 전원(APU/Battery) 안전 차단 및 핀 체결",
      desc: "그라운드 서비스 인터록 체결 및 랜딩기어 세이프티 핀 삽입 (지상 전도 방지).",
      dept: "Avionics",
      duration: "15 min",
      ammRef: "AMM 10-11-00"
    }
  ];

  const stage2Tasks = [];
  if (isOverweight) {
    stage2Tasks.push({
      id: "MRO-S2-OW",
      priority: "P1-URGENT",
      title: "최대착륙중량 초과 착륙(Overweight Landing) 특별 점검",
      desc: "랜딩기어 메인 트러니언, 윙 리브 부착부(Wing-to-Body Attachment) 초음파 비파괴 검사(NDT).",
      dept: "Structures & NDT",
      duration: "4~6 hrs",
      ammRef: "AMM 05-51-01"
    });
  }

  if (emergencyKey === "dual_engine_flameout" || emergencyKey === "single_engine_failure") {
    stage2Tasks.push({
      id: "MRO-S2-ENG",
      priority: "P1-URGENT",
      title: "CFM56-7B 엔진 코어 보어스코프(Borescope) 내시경 정밀 검사",
      desc: "고압 터빈(HPT) 블레이드 소손, 압축기 스톨 손상, 연료 조절 장치(HMU) 오작동 분석.",
      dept: "Powerplant MRO",
      duration: "3~5 hrs",
      ammRef: "AMM 72-00-00"
    });
  } else if (emergencyKey === "hydraulic_total_loss") {
    stage2Tasks.push({
      id: "MRO-S2-HYD",
      priority: "P1-URGENT",
      title: "유압 시스템 A/B 라인 압력 테스트 및 펌프(EDP/EMDP) 분해",
      desc: "전단 리크 지점 규명, 저장소(Reservoir) 금속 이물질 입자 분석, 셔틀 밸브 점검.",
      dept: "Hydraulic Systems",
      duration: "4~8 hrs",
      ammRef: "AMM 29-10-00"
    });
  } else if (emergencyKey === "cargo_fire") {
    stage2Tasks.push({
      id: "MRO-S2-FIRE",
      priority: "P1-URGENT",
      title: "화물칸 방화 라이너 관통 여부 및 구조 열변형 검사",
      desc: "하부 화물칸 클래스 C 격벽 열변형 측정 및 연기 감지 광학 센서 루프 점검.",
      dept: "Structures & Avionics",
      duration: "4~6 hrs",
      ammRef: "AMM 26-12-00"
    });
  } else if (emergencyKey === "rapid_depressurization") {
    stage2Tasks.push({
      id: "MRO-S2-PRESS",
      priority: "P1-URGENT",
      title: "아웃플로우 밸브(Outflow Valve) 및 도어 씰(Door Seal) 기밀 검사",
      desc: "동체 여압 격벽(Aft Pressure Bulkhead) 리벳 피로 균열 초음파 탐상.",
      dept: "Environmental Control",
      duration: "3~5 hrs",
      ammRef: "AMM 21-31-00"
    });
  }

  stage2Tasks.push({
    id: "MRO-S2-LG",
    priority: "P2-HIGH",
    title: "메인/노즈 랜딩기어 토크 링크 및 타이어 어셈블리 전면 교체",
    desc: "비상 제동 시 ABS 및 카본 디스크 마모 한계 도달 확인 후 타이어/휠 교체.",
    dept: "Chassis Team",
    duration: "2~3 hrs",
    ammRef: "AMM 32-45-00"
  });

  const stage3Tasks = [
    {
      id: "MRO-S3-01",
      priority: "P2-HIGH",
      title: "QAR / FDR (비행데이터기록기) 데이터 덤프 및 비정상 파라미터 분석",
      desc: "비상 상황 직전 엔진 진동, 유압 압력 강하, 객실 고도 기록 정밀 데이터 복원.",
      dept: "Flight Data Analysis",
      duration: "2 hrs",
      ammRef: "AMM 31-31-00"
    },
    {
      id: "MRO-S3-02",
      priority: "P2-HIGH",
      title: "보잉 기술 지원(Boeing AOG Response Team) 긴급 수리 승인",
      desc: "공인 수리 지침(SRM) 한계 초과 시 보잉 엔지니어링 즉시 지원 요청(Major Repair Approval).",
      dept: "Quality Engineering",
      duration: "12~24 hrs",
      ammRef: "Boeing SRM 51"
    },
    {
      id: "MRO-S3-03",
      priority: "P3-NORMAL",
      title: "지상 시운전(Ground Run-up) 및 감항성 회복(CRS) 최종 승인",
      desc: "양쪽 엔진 풀 파워 테스트 및 시스템 인터록 테스트 후 항공기 인도 서명.",
      dept: "Chief Inspector",
      duration: "4 hrs",
      ammRef: "FAR 43 / EASA Part-145"
    }
  ];

  return {
    overview: `${emergencyKey.toUpperCase()} 비상 착륙 후 표준 MRO 정밀 복구 매트릭스`,
    totalTasks: stage1Tasks.length + stage2Tasks.length + stage3Tasks.length,
    estimatedDowntimeDays: landingSite.maintenanceHub ? "2~4 일 (정비 허브 즉시 부품 공급)" : "7~10 일 (군/지방 비행장 페리 비행 및 부품 공수 필요)",
    hubAdvantageNote: landingSite.maintenanceHub ? "착륙지가 B737 전용 격납고 및 예비 부품 풀을 보유하여 정비 시간과 승객 운송 비용이 대폭 절감됩니다." : "해당 착륙지에는 B737 정비 창고가 없어 모바일 정비팀 출장 및 페리 비행(Ferry Flight) 비용이 추가 발생합니다.",
    stages: [
      {
        stageNumber: 1,
        title: "Stage 1: 활주로 접지 직후 초동 안전 확보 (0~30분)",
        color: "#ff3366",
        tasks: stage1Tasks
      },
      {
        stageNumber: 2,
        title: "Stage 2: 기체 구조, 계통 및 엔진 정밀 비파괴 검사 (1~6시간)",
        color: "#ff9900",
        tasks: stage2Tasks
      },
      {
        stageNumber: 3,
        title: "Stage 3: 주요 부품 교체, 시운전 및 감항성 재인증 (24~72시간)",
        color: "#00d4ff",
        tasks: stage3Tasks
      }
    ]
  };
}
