// Boeing 737 QRH (Quick Reference Handbook) Emergency Checklists & Pilot Actions

export const QRH_PROCEDURES = {
  dual_engine_flameout: {
    title: "ALL ENGINES FLAMEOUT / LOSS OF ALL THRUST",
    memoryItems: [
      { step: 1, action: "ENGINE START switches (both) ... FLT", note: "지속 점화 공급" },
      { step: 2, action: "ENGINE START LEVERS (both) ... CUTOFF then IDLE", note: "재점화 연료 공급 재시도" },
      { step: 3, action: "AIRSPEED ... 215 - 220 KIAS (BEST GLIDE)", note: "최적 활공 속도 유지 (16:1 활공비 확보)" },
      { step: 4, action: "APU SWITCH ... START", note: "전기 및 백업 유압을 위한 보조동력장치 즉시 기동" }
    ],
    atcCommunication: [
      { step: 1, phrase: "MAYDAY, MAYDAY, MAYDAY, [Callsign], DUAL ENGINE FLAMEOUT", code: "Squawk 7700" },
      { step: 2, phrase: "REQUEST IMMEDIATE VECTORS TO RECOMMENDED SITE", code: "Glide Cone" },
      { step: 3, phrase: "REQUEST ARFF CRASH TRUCKS STANDBY RUNWAY END", code: "Foam blanket ready" }
    ],
    landingPrep: [
      { step: 1, item: "Manual Gear Extension", desc: "중력 낙하(Gravity Fall)로 메인/노즈 기어 하강 잠금" },
      { step: 2, item: "Flaps 15 (Standby System)", desc: "배터리/대체 전기로 플랩 15도 전개, 고속 접근 대비" },
      { step: 3, item: "Brace for Impact Call", desc: "접지 1분 전 승객에게 충격 방지 자세(Brace) 방송" }
    ]
  },
  single_engine_failure: {
    title: "ENGINE 1 FAILURE / DAMAGE / SEPARATION",
    memoryItems: [
      { step: 1, action: "AUTOTHROTTLE ... DISENGAGE", note: "추력 급변동 방지" },
      { step: 2, action: "THRUST LEVER (Damaged Engine) ... CONFIRM & CLOSE", note: "손상된 1번 레버 감속" },
      { step: 3, action: "ENGINE START LEVER 1 ... CUTOFF", note: "연료 차단 밸브 폐쇄" },
      { step: 4, action: "ENGINE FIRE WARNING SWITCH 1 ... PULL & ROTATE", note: "소화액 병 1 방출 (30초 대기)" }
    ],
    atcCommunication: [
      { step: 1, phrase: "PAN-PAN, PAN-PAN, [Callsign], ENGINE FAILURE NUMBER 1, DESCENDING TO FL210", code: "Squawk 7700" },
      { step: 2, phrase: "REQUEST LEVEL OFF AT DRIFT-DOWN ALTITUDE", code: "Single Engine Cruise" }
    ],
    landingPrep: [
      { step: 1, item: "Flaps 15 Single Engine Approach", desc: "복행(Go-around) 추력 마진 확보를 위해 Flap 15 착륙" },
      { step: 2, item: "Rudder Trim Centered on Final", desc: "비대칭 추력 방향타 트림 미세 정렬" },
      { step: 3, item: "Reverse Thrust (Operative Engine Only)", desc: "2번 엔진만 역추력 전개 주의" }
    ]
  },
  rapid_depressurization: {
    title: "CABIN ALTITUDE WARNING / RAPID DEPRESSURIZATION",
    memoryItems: [
      { step: 1, action: "DON OXYGEN MASKS & SET 100%", note: "승무원 산소마스크 즉시 착용 (유효의식시간 15~30초 방지)" },
      { step: 2, action: "ESTABLISH CREW COMMUNICATIONS", note: "인터폰 마이크 스위치 MASK 모드" },
      { step: 3, action: "PASSENGER OXYGEN SWITCH ... ON", note: "객실 산소 마스크 강제 전개 (14분 산소 생성)" },
      { step: 4, action: "EMERGENCY DESCENT ... INITIATE", note: "추력 IDLE, 스피드브레이크 UP, 목표 FL100 (10,000ft)" }
    ],
    atcCommunication: [
      { step: 1, phrase: "MAYDAY, MAYDAY, [Callsign], RAPID DEPRESSURIZATION, EMERGENCY DESCENT TO 10,000FT", code: "Squawk 7700" },
      { step: 2, phrase: "REQUEST CLEAR OF AIR TRAFFIC BELOW", code: "Emergency Block Altitude" }
    ],
    landingPrep: [
      { step: 1, item: "Level off at 10,000ft or MEA", desc: "안전 고도 진입 후 기내 부상 승객 파악" },
      { step: 2, item: "Select Closest Suitable Airport", desc: "저고도 연료 소모 급증 대비 신속 접근" }
    ]
  },
  hydraulic_total_loss: {
    title: "LOSS OF HYDRAULIC SYSTEM A AND SYSTEM B",
    memoryItems: [
      { step: 1, action: "PRIMARY FLIGHT CONTROLS ... MANUAL REVERSION", note: "유압 상실로 기계식 케이블 연결 수동 조종" },
      { step: 2, action: "AIRSPEED ... MAINTAIN BELOW 230 KIAS", note: "조종간 과중 부하 방지" },
      { step: 3, action: "FLIGHT SPOILERS & GROUND SPOILERS ... INOPERATIVE", note: "스포일러 감속 불능 상태 인지" }
    ],
    atcCommunication: [
      { step: 1, phrase: "PAN-PAN, [Callsign], TOTAL HYDRAULIC LOSS SYS A & B, MANUAL REVERSION", code: "Squawk 7700" },
      { step: 2, phrase: "REQUEST LONGEST RUNWAY AVAILABLE (MIN 3,000M) & NOSEWHEEL STEERING INOP", code: "Tug required" }
    ],
    landingPrep: [
      { step: 1, item: "Manual Gear Drop", desc: "매뉴얼 기어 릴리즈 핸들 당겨 중력 낙하" },
      { step: 2, item: "Alternate Flaps to 15", desc: "전동 모터로 슬랫/플랩 15도 전개 (소요시간 약 2분)" },
      { step: 3, item: "Vref + 25 Knots Approach Speed", desc: "플랩 부족으로 고속 접근, 브레이크 어큐뮬레이터 잔압 활용" }
    ]
  },
  cargo_fire: {
    title: "CARGO COMPARTMENT FIRE / SMOKE",
    memoryItems: [
      { step: 1, action: "CARGO FIRE ARM SWITCH ... PUSH / ARMED", note: "해당 화물칸 방화 밸브 작동" },
      { step: 2, action: "CARGO FIRE DISCHARGE SWITCH ... PUSH", note: "하론 소화기 1병 즉시 분사, 2병째 지속 분사" },
      { step: 3, action: "MAX SPEED FOR DESCENT ... Vmo/Mmo", note: "골든타임 15분 이내 착륙을 위한 고속 급강하" }
    ],
    atcCommunication: [
      { step: 1, phrase: "MAYDAY, MAYDAY, MAYDAY, [Callsign], CARGO HOLD FIRE, LANDING WITHIN 15 MINUTES", code: "Squawk 7700" },
      { step: 2, phrase: "REQUEST PRIORITY 1 CLEARANCE TO THRESHOLD", code: "Expedite" },
      { step: 3, phrase: "FULL ARFF CRASH TRUCKS TO MEET AIRCRAFT ON ROLLOUT", code: "Evacuation alert" }
    ],
    landingPrep: [
      { step: 1, item: "Immediate Full Stop on Runway", desc: "유도로 이탈하지 않고 활주로 상에서 즉시 엔진 정지" },
      { step: 2, item: "Emergency Passenger Evacuation", desc: "바람 방향(풍상측) 고려하여 비상 슬라이드 즉시 탈출 명령" }
    ]
  }
};
