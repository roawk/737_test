# ✈️ BOEING SAFTER 737 AI
> **보잉 737 비상 결함 대응 & 안전 1순위 최적 비상착륙 항로 추천 AI 플랫폼**

---

## 📌 프로젝트 소개
**BOEING SAFTER 737 AI**는 보잉 737-800 항공기가 비행 중 엔진 정지, 객실 급감압, 유압 손실, 화물칸 화재 등 중대 결함 상황에 직면했을 때:
1. **안전성(Safety Weight 75%)**을 최우선으로 확보하고,
2. **공항 스케줄 지연 및 항공사 손실 비용(Schedule & Cost 25%)**을 최소화하는

다기준 최적 비상착륙 후보지 1·2·3순위를 실시간으로 계산하고 직관적인 레이더 HUD와 전용 의사결정 근거를 제공하는 항공 관제/운항 지원 AI 웹 플랫폼입니다.

---

## 🚀 주요 기능
- **B737 공기역학 & 비행 잔여 한계 연산**: 
  - 고도, 풍속, 잔여 연료, 총중량을 반영한 실효 활공비 및 무동력 비행 반경 실시간 산출
  - 과체중 착륙(Overweight Landing) 판정 및 요구 활주로 산출
- **비상 시나리오 5종 지원**:
  - `Dual Engine Flameout` (양쪽 엔진 정지, 50% 축소 안전 반경 글라이드 콘)
  - `Engine 1 Failure / Fire` (엔진 1기 고장/화재, Drift-down 유지)
  - `Rapid Depressurization` (객실 급감압, 14분 산소 골든타임)
  - `Total Hydraulic Loss` (유압 전손, 초장거리 활주로 필터링)
  - `Cargo Hold Fire` (화물칸 화재, 15분 초단기 긴급 접지)
- **1·2·3순위 고유 3색 추천 항로 시각화**:
  - 1순위(초록색 실선), 2순위(파란색 대시선), 3순위(주황색 점선) 상호 배타적 분기
- **AI 순위 판단 근거 전용 탭 (Decision Rationale)**:
  - 활주로 여유, ARFF 소방 등급, 지상 대기편 지연, 경제적 손실액 정량 매트릭스 제공
- **대화형 슬라이더 & 숫자 직접 입력 연동**:
  - 마우스 드래그 및 정밀 타이핑으로 기체 변수 실시간 튜닝

---

## 🛠️ 기술 스택
- **Frontend**: HTML5, Vanilla CSS3 (Custom Glassmorphism Design System), Modern Vanilla JavaScript (ES6+ Modules)
- **Mapping**: Leaflet.js, OpenStreetMap
- **Deployment**: Vercel

---

## 💻 로컬 실행 방법
별도의 빌드 과정 없이 정적 웹 서버로 바로 실행 가능합니다:
```bash
# Python 내장 서버 실행 예시
python -m http.server 8080
```
브라우저에서 `http://localhost:8080/index.html`로 접속합니다.
