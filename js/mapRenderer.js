// Leaflet Map Visualizer for AeroRescue 737 AI
// Renders Aircraft Position, Glide Cone, Surrounding Traffic, Airports, and Tactical Routes

export class AirspaceMapRenderer {
  constructor(containerId) {
    this.containerId = containerId;
    this.map = null;
    this.aircraftMarker = null;
    this.glideCircle = null;
    this.trafficMarkers = [];
    this.airportMarkers = [];
    this.routePolylines = [];
    this.activeRoutePolyline = null;
    this.plannedRoutePolyline = null;
    this.originDestMarkers = [];
    this.onMapClickCallback = null;
  }

  init(centerLat = 36.85, centerLng = 126.60, zoom = 8) {
    if (this.map) return;

    this.map = L.map(this.containerId, {
      center: [centerLat, centerLng],
      zoom: zoom,
      zoomControl: true,
      attributionControl: false
    });

    // OpenStreetMap standard tile layer (clean, no API key watermark)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Map click event listener for aircraft repositioning
    this.map.on('click', (e) => {
      if (this.onMapClickCallback) {
        this.onMapClickCallback(e.latlng);
      }
    });

    // Grid Radar Overlay SVG layer
    this.renderRadarGridOverlay();
  }

  setOnMapClickListener(callback) {
    this.onMapClickCallback = callback;
  }

  renderRadarGridOverlay() {
    // Custom radar ring style
  }

  updateAircraft(aircraftState, emergency) {
    if (!this.map) return;
    const { lat, lng, headingDeg, altitudeFt, groundSpeedKts } = aircraftState;

    const iconHtml = `
      <div class="radar-plane-icon emergency-pulse" style="transform: rotate(${headingDeg}deg);">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="#00ffff">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
        </svg>
      </div>
      <div class="radar-label emergency-label">
        <span class="callsign">HL-737EM</span>
        <span class="alt-spd">FL${Math.round(altitudeFt / 100)} / ${groundSpeedKts}KT</span>
        <span class="squawk" style="color: #ff3366;">SQ7700</span>
      </div>
    `;

    const customIcon = L.divIcon({
      html: iconHtml,
      className: 'custom-radar-plane',
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    if (this.aircraftMarker) {
      this.aircraftMarker.setLatLng([lat, lng]);
      this.aircraftMarker.setIcon(customIcon);
    } else {
      this.aircraftMarker = L.marker([lat, lng], { icon: customIcon, zIndexOffset: 1000 }).addTo(this.map);
    }
  }

  updateGlideCone(lat, lng, maxGlideRangeNM, isDualFlameout) {
    if (!this.map) return;

    if (this.glideCircle) {
      this.map.removeLayer(this.glideCircle);
      this.glideCircle = null;
    }

    if (maxGlideRangeNM <= 0) return;

    // Convert NM to meters (1 NM = 1852 meters)
    const radiusMeters = maxGlideRangeNM * 1852;

    const fillColor = isDualFlameout ? "#ff3366" : "#00e676";
    const strokeColor = isDualFlameout ? "#ff0055" : "#00ff88";

    this.glideCircle = L.circle([lat, lng], {
      radius: radiusMeters,
      color: strokeColor,
      weight: 2,
      dashArray: isDualFlameout ? "6, 6" : null,
      fillColor: fillColor,
      fillOpacity: 0.12,
    }).addTo(this.map);

    this.glideCircle.bindTooltip(
      `<strong>B737 무동력 비행 반경 한계선</strong><br/>반경: ${maxGlideRangeNM} NM (${Math.round(radiusMeters / 1000)} km)<br/>상태: ${isDualFlameout ? '무동력 활공 (Engine Out)' : '지속 비행 가능 영역'}`,
      { sticky: true, className: 'radar-tooltip' }
    );
  }

  updateSurroundingTraffic(trafficList, showTraffic = true) {
    if (!this.map) return;

    // Clear previous markers
    this.trafficMarkers.forEach(m => this.map.removeLayer(m));
    this.trafficMarkers = [];

    // If surrounding traffic is turned OFF, stop rendering
    if (!showTraffic || !trafficList || trafficList.length === 0) {
      return;
    }

    trafficList.forEach(trf => {
      // 3-Tier Color & Risk Classification
      // 1. 빨간색: 지금 항공기에 간섭이 되거나 위험적 (danger)
      // 2. 노란색: 아직은 아니지만 위험이 될 가능성이 있음 (caution)
      // 3. 초록색: 안전함 (safe)
      let color = "#00e676"; // safe default
      let tierKey = trf.riskTier || (trf.isConflictRisk ? "danger" : "safe");
      let tierBadgeClass = "safe";
      let tierText = "안전";

      if (tierKey === "danger" || trf.isConflictRisk) {
        color = "#ff1744"; // Red
        tierBadgeClass = "danger";
        tierText = "위험 (간섭)";
      } else if (tierKey === "caution") {
        color = "#ffaa00"; // Yellow
        tierBadgeClass = "caution";
        tierText = "주의 (잠재)";
      } else {
        color = "#00e676"; // Green
        tierBadgeClass = "safe";
        tierText = "안전";
      }

      // Aircraft SVG Icon with thick white outline (stroke-width: 3.5px, paint-order: stroke fill)
      // and crisp shadow for maximum contrast on any map background
      const iconHtml = `
        <div class="surrounding-plane-icon" style="transform: rotate(${trf.heading}deg);">
          <svg viewBox="0 0 24 24" width="28" height="28" style="overflow: visible;">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
              fill="${color}"
              stroke="#ffffff"
              stroke-width="3.5"
              stroke-linejoin="round"
              stroke-linecap="round"
              paint-order="stroke fill"
            />
          </svg>
        </div>
        <div class="traffic-mini-label ${tierBadgeClass}">
          <span class="trf-callsign">${trf.callsign}</span>
          <span class="trf-tier-tag ${tierBadgeClass}">${tierText}</span>
          <span class="trf-fl">FL${Math.round(trf.altFt / 100)}</span>
        </div>
      `;

      const icon = L.divIcon({
        html: iconHtml,
        className: 'custom-traffic-plane',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const marker = L.marker([trf.lat, trf.lng], { icon }).addTo(this.map);
      
      const popupBadgeColor = color;
      marker.bindPopup(`
        <div class="radar-popup">
          <div class="popup-header" style="border-bottom: 2px solid ${popupBadgeColor}; display:flex; justify-content:space-between; align-items:center;">
            <h4>✈ ${trf.callsign} (${trf.aircraft})</h4>
            <span class="badge" style="background:${popupBadgeColor}22; color:${popupBadgeColor}; border:1px solid ${popupBadgeColor}; font-weight:700;">
              ${tierText}
            </span>
          </div>
          <div class="popup-body" style="margin-top:8px;">
            <p><strong>구간:</strong> ${trf.origin} ➔ ${trf.dest}</p>
            <p><strong>고도 / 속도:</strong> ${trf.altFt.toLocaleString()} ft / ${trf.speedKts} kts (방위 ${trf.heading}°)</p>
            <p><strong>탑승객:</strong> ${trf.passengers}명</p>
            <p><strong>상태 및 영향도:</strong> ${trf.riskText || (tierKey === 'danger' ? '비상기 강하 항로 직접 간섭 (우회 필요)' : tierKey === 'caution' ? '인접 고도대 주의 요망' : '충분한 안전 간격 확보')}</p>
            ${trf.estimatedDelayMinIfRerouted ? `<p><strong>예상 우회 지연:</strong> 약 +${trf.estimatedDelayMinIfRerouted}분 (+${trf.fuelBurnPenaltyKg}kg)</p>` : ''}
          </div>
        </div>
      `);

      this.trafficMarkers.push(marker);
    });
  }

  updateLandingSites(evaluatedList, onSiteSelect) {
    if (!this.map) return;

    this.airportMarkers.forEach(m => this.map.removeLayer(m));
    this.airportMarkers = [];

    evaluatedList.forEach(item => {
      const site = item.site;
      let badgeColor = "#00e676";
      let iconSymbol = "🏢";

      if (site.type === "INTERNATIONAL_AIRPORT") {
        iconSymbol = "✈";
        badgeColor = "#00d4ff";
      } else if (site.type === "MILITARY_AIRBASE") {
        iconSymbol = "🛡";
        badgeColor = "#b388ff";
      } else if (site.type === "WATER_DITCHING") {
        iconSymbol = "🌊";
        badgeColor = "#29b6f6";
      } else if (site.type === "OPEN_TERRAIN") {
        iconSymbol = "⛰";
        badgeColor = "#ffb74d";
      }

      if (!item.isReachable) {
        badgeColor = "#757575";
      }

      const iconHtml = `
        <div class="site-marker-pin ${item.isReachable ? 'reachable' : 'unreachable'}" style="border-color: ${badgeColor};">
          <span class="site-icon">${iconSymbol}</span>
          <span class="site-code">${site.icao}</span>
        </div>
      `;

      const icon = L.divIcon({
        html: iconHtml,
        className: 'custom-site-marker',
        iconSize: [42, 42],
        iconAnchor: [21, 21]
      });

      const marker = L.marker([site.lat, site.lng], { icon }).addTo(this.map);

      marker.bindPopup(`
        <div class="radar-popup">
          <div class="popup-header" style="border-bottom: 2px solid ${badgeColor}">
            <h4>${site.name} (${site.icao})</h4>
            <span class="badge" style="background:${badgeColor}22; color:${badgeColor}; border:1px solid ${badgeColor};">
              ${item.isReachable ? '착륙 도달 가능' : '무동력 비행 한계 초과'}
            </span>
          </div>
          <div class="popup-body">
            <p><strong>거리 / 방위:</strong> ${item.distanceNM} NM / ${item.bearingDeg}°</p>
            <p><strong>예상 비행시간:</strong> 약 ${item.estimatedMinutes}분</p>
            <p><strong>활주로 길이:</strong> ${site.maxRunwayLength.toLocaleString()}m (${site.runways[0]?.ilsCat || 'N/A'})</p>
            <p><strong>소방 등급:</strong> ARFF Cat ${site.arffCategory}</p>
            <p><strong>기상 조건:</strong> ${site.weather.wind}, ${site.weather.vis || site.weather.seaState}</p>
            <p><strong>공항 대기편 수:</strong> ${site.activeQueuedFlights}대 대기 (스케줄 영향도)</p>
            <p><strong>종합 평가점수:</strong> <span style="font-weight:bold; color:#00ffcc;">${item.compositeScore}점</span> (안전: ${item.safetyScore} / 운영: ${item.efficiencyScore})</p>
          </div>
          <button class="popup-select-btn" onclick="window.selectEmergencyRoute('${site.id}')">이 착륙지로 루트 연결</button>
        </div>
      `);

      this.airportMarkers.push(marker);
    });
  }

  drawRoutes(currentPos, recommendations, activeTag = "alpha") {
    if (!this.map) return;

    // Clear previous polylines
    this.routePolylines.forEach(p => this.map.removeLayer(p));
    this.routePolylines = [];

    const routes = [
      { key: "alpha", rank: "1순위", data: recommendations.alpha, color: "#00e676", name: "1순위 (최고안전)", dash: null },
      { key: "bravo", rank: "2순위", data: recommendations.bravo, color: "#00d4ff", name: "2순위 (최적균형)", dash: "6, 4" },
      { key: "charlie", rank: "3순위", data: recommendations.charlie, color: "#ff9100", name: "3순위 (최단긴급)", dash: "3, 5" }
    ];

    routes.forEach(r => {
      if (!r.data?.data?.site) return;
      const targetSite = r.data.data.site;
      const isActive = r.key === activeTag;

      // Realistic curved flight path waypoints
      const midLat = (currentPos.lat + targetSite.lat) / 2 + (r.key === "alpha" ? 0.04 : r.key === "charlie" ? -0.04 : 0);
      const midLng = (currentPos.lng + targetSite.lng) / 2 + (r.key === "alpha" ? -0.06 : r.key === "charlie" ? 0.06 : 0);

      const latlngs = [
        [currentPos.lat, currentPos.lng],
        [midLat, midLng],
        [targetSite.lat, targetSite.lng]
      ];

      const polyline = L.polyline(latlngs, {
        color: r.color,
        weight: isActive ? 6 : 3.5,
        opacity: isActive ? 1.0 : 0.78,
        dashArray: r.dash,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(this.map);

      // Tooltip indicating Rank & Airport Name
      polyline.bindTooltip(
        `<strong>${r.rank} 추천 항로 (${r.color === '#00e676' ? '초록' : r.color === '#00d4ff' ? '파랑' : '주황'}):</strong> ${targetSite.name} (${r.data.data.distanceNM}NM, ETE ${r.data.data.estimatedMinutes}분)`,
        { sticky: true, className: 'radar-tooltip' }
      );

      polyline.on('click', () => {
        if (window.selectEmergencyRouteByTag) {
          window.selectEmergencyRouteByTag(r.key);
        }
      });

      this.routePolylines.push(polyline);
    });
  }

  updatePlannedRoute(originAirport, destAirport, waypoints = []) {
    if (!this.map) return;

    // Remove previous planned route
    if (this.plannedRoutePolyline) {
      this.map.removeLayer(this.plannedRoutePolyline);
      this.plannedRoutePolyline = null;
    }

    // Remove previous origin/dest markers
    this.originDestMarkers.forEach(m => this.map.removeLayer(m));
    this.originDestMarkers = [];

    if (!originAirport || !destAirport) return;

    const latlngs = waypoints.length > 0 
      ? waypoints 
      : [[originAirport.lat, originAirport.lng], [destAirport.lat, destAirport.lng]];

    // FMS magenta dashed polyline
    this.plannedRoutePolyline = L.polyline(latlngs, {
      color: "#e040fb",
      weight: 3,
      opacity: 0.85,
      dashArray: "8, 6",
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(this.map);

    this.plannedRoutePolyline.bindTooltip(
      `<strong>계획 항로 (FMS PLANNED ROUTE):</strong><br/>출발: ${originAirport.name} (${originAirport.iata}) ➔ 도착: ${destAirport.name} (${destAirport.iata})`,
      { sticky: true, className: 'radar-tooltip' }
    );

    // Marker for Origin
    const originIcon = L.divIcon({
      html: `
        <div class="fms-airport-pin origin-pin">
          <span class="pin-tag">DEP</span>
          <span class="pin-code">${originAirport.iata || originAirport.icao}</span>
        </div>
      `,
      className: 'custom-fms-pin',
      iconSize: [44, 24],
      iconAnchor: [22, 12]
    });
    const originMarker = L.marker([originAirport.lat, originAirport.lng], { icon: originIcon }).addTo(this.map);
    originMarker.bindTooltip(`출발 공항 (DEP): ${originAirport.name}`, { className: 'radar-tooltip' });
    this.originDestMarkers.push(originMarker);

    // Marker for Destination
    const destIcon = L.divIcon({
      html: `
        <div class="fms-airport-pin dest-pin">
          <span class="pin-tag">ARR</span>
          <span class="pin-code">${destAirport.iata || destAirport.icao}</span>
        </div>
      `,
      className: 'custom-fms-pin',
      iconSize: [44, 24],
      iconAnchor: [22, 12]
    });
    const destMarker = L.marker([destAirport.lat, destAirport.lng], { icon: destIcon }).addTo(this.map);
    destMarker.bindTooltip(`도착 공항 (ARR): ${destAirport.name}`, { className: 'radar-tooltip' });
    this.originDestMarkers.push(destMarker);
  }

  fitRouteBounds(originAirport, destAirport) {
    if (!this.map || !originAirport || !destAirport) return;
    const bounds = L.latLngBounds([
      [originAirport.lat, originAirport.lng],
      [destAirport.lat, destAirport.lng]
    ]);
    this.map.fitBounds(bounds, { padding: [60, 60], maxZoom: 9 });
  }
}

