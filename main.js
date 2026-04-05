// ============================================================
// WHEN THINGS GO TO SEAT — main.js
// Step 1: Clock only. Future modules slotted in below.
// ============================================================

// DATA MODEL — Step 3 (see data.js)
// VISUAL SYSTEM — Steps 5, 6, 7
// INTERACTIVITY — Steps 8, 9, 10

// ------------------------------------------------------------
// RESERVATION LIST
// Renders STATE.reservations filtered by the active tab.
// Active tab is read from the DOM (.tab-item.active).
// ------------------------------------------------------------

const ICON_PAUSE = `<svg style="display:inline-block;vertical-align:-2px;margin-right:5px" width="8" height="10" viewBox="0 0 8 10" fill="currentColor"><rect x="0" y="0" width="2.5" height="10" rx="0.8"/><rect x="5.5" y="0" width="2.5" height="10" rx="0.8"/></svg>`;
const ICON_PLAY  = `<svg style="display:inline-block;vertical-align:-2px;margin-right:5px" width="8" height="10" viewBox="0 0 8 10" fill="currentColor"><polygon points="0,0 8,5 0,10"/></svg>`;

const TAG_LABEL = {
  'birthday':        'BDay',
  'anniversary':     'Anniv',
  'vip':             'VIP',
  'allergy':         'Allergy',
  'special request': 'Spec',
  'note':            'Note',
};

const TAG_CLASS = {
  'birthday':        'birthday',
  'anniversary':     'anniversary',
  'vip':             'vip',
  'allergy':         'allergy',
  'special request': 'special-request',
  'note':            'note',
};
let demoMode = 'auto'; // auto-seating always on; pause/play controls time advancement
let simulationIntervalId = null;
let simulationRunning = true;
let simSpeed = 1; // 1x = 750ms, 2x = 375ms, 4x = 188ms
function getSimInterval() { return Math.round(750 / simSpeed); }
const _tableListCollapsed = {}; // persists collapse state across re-renders
const _sectionCollapsed   = { A: true, B: true, C: true, D: true, E: true }; // collapsed by default

function renderReservationList() {
  const upcoming = (STATE.reservations || [])
    .filter(r => r.status === 'upcoming')
    .sort((a, b) => a.time.localeCompare(b.time));

  const arrived = (STATE.reservations || [])
    .filter(r => r.status === 'arrived')
    .sort((a, b) => a.time.localeCompare(b.time));

  const countUp = document.getElementById('count-upcoming-badge');
  const countAr = document.getElementById('count-arrived-badge');
  if (countUp) countUp.textContent = upcoming.length;
  if (countAr) countAr.textContent = arrived.length;

  const listUp = document.getElementById('list-upcoming');
  const listAr = document.getElementById('list-arrived');
  if (listUp) listUp.innerHTML = '';
  if (listAr) listAr.innerHTML = '';

  const tagColors = {
    'allergy':          '#ff4d4d',
    'birthday':         '#ffb347',
    'anniversary':      '#b084ff',
    'vip':              '#3dc7ff',
    'special request':  '#ffcc66',
    'note':             '#8a8a8a'
  };

  function buildItem(res) {
    const item = document.createElement('div');
    item.className = 'res-item';
    item.dataset.resId = res.id;

    const bookSrc = res.bookingType === 'confirmed'
      ? './Images/icon-book-confirmed.svg'
      : './Images/icon-book-pending.svg';

    const tagsHtml = res.tags.length > 0
      ? `<div class="res-tag-deck" style="width:${12 + Math.max(0, res.tags.length - 1) * 7}px">
          ${res.tags.map((tag, i) => `
            <div class="res-tag-card" style="
              background:${tagColors[tag] || '#333'};
              left:${i * 7}px;
              z-index:${res.tags.length - i};
            "></div>`).join('')}
        </div>`
      : '';

    let badgeClass = 'res-table-badge--none';
    let badgeText  = '—';
    if (res.assignedTable) {
      badgeClass = 'res-table-badge--assigned';
      badgeText  = res.assignedTable.replace('_', '');
    } else if (res.suggestedTable) {
      badgeClass = 'res-table-badge--suggested';
      badgeText  = res.suggestedTable.replace('_', '');
    }

    item.innerHTML = `
      <div class="res-left">
        <div class="res-icon-badge">
          <img class="res-book-icon" src="${bookSrc}" alt=""/>
        </div>
      </div>
      <div class="res-centre">
        <div class="res-time-name">
          <span class="res-time">${res.time}</span>
          <span class="res-name">${res.guestName}</span>
        </div>
      </div>
      <div class="res-right">
        <div class="res-right-meta">
          <span class="res-covers">${res.covers}</span>
          ${tagsHtml}
        </div>
        <div class="res-table-badge ${badgeClass}">
          <span>${badgeText}</span>
        </div>
      </div>`;

    item.addEventListener('click', () => openGuestProfile(res));
    return item;
  }

  upcoming.forEach(res => listUp && listUp.appendChild(buildItem(res)));
  arrived.forEach(res => listAr && listAr.appendChild(buildItem(res)));
}

// ------------------------------------------------------------
// WORKLOAD GLOWS (red)
// Hardcoded bounding boxes in viewBox space (-20 -20 2620 2600).
// drop-shadow needs rendered pixels, so each active rect gets a
// near-invisible red fill — the filter spreads it into a halo.
// ------------------------------------------------------------

function renderWorkloadGlows() {
  const sections = ['A', 'B', 'C', 'D', 'E'];

  sections.forEach(id => {
    const glowGroup = document.getElementById(`Red_glow_Section_${id}`);
    if (!glowGroup) return;

    const section = STATE.sections[id];
    const isRed = section?.isRed || false;
    const workload = section?.workload || 0;
    const shapes = glowGroup.querySelectorAll('rect, path');

    if (isRed) {
      shapes.forEach(shape => {
        shape.setAttribute('fill', 'rgb(255, 20, 0)');
        shape.setAttribute('stroke', 'rgb(255, 20, 0)');
        shape.setAttribute('stroke-width', '35');
        shape.setAttribute('opacity', '0.75');
      });
    } else {
      shapes.forEach(shape => {
        shape.setAttribute('fill', 'none');
        shape.setAttribute('opacity', '0');
        shape.removeAttribute('stroke');
      });
    }
  });
}

// ------------------------------------------------------------
// HOURGLASS TURNOVER INDICATORS
// ------------------------------------------------------------
// TABLE NUMBER LABELS
// Renders a static white number under each table on the floorplan.
// Runs once on init — labels never need to be re-rendered.
// ------------------------------------------------------------

function renderTableNumberLabels() {
  Object.keys(STATE.tables).forEach(id => {
    const group = document.getElementById(id);
    if (!group) return;

    const shape = group.querySelector('rect, circle, path');
    if (!shape) return;

    const bbox = group.getBBox();
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');

    label.setAttribute('x', bbox.x + bbox.width / 2);
    label.setAttribute('y', bbox.y + bbox.height + 36);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('fill', '#ffffff');
    label.setAttribute('font-size', '28');
    label.setAttribute('font-weight', '600');
    label.setAttribute('opacity', '0.55');
    label.setAttribute('pointer-events', 'none');
    label.textContent = id.replace('_', '');

    group.appendChild(label);
  });
}

// Injects a ⏳ text element into each qualifying table group,
// positioned at the top-right of the main shape via getBBox().
// ------------------------------------------------------------

function renderHourglassIndicators() {
  // Clear all existing hourglasses first so tables that drop below
  // the threshold on re-render don't keep a stale icon
  document.querySelectorAll('.hourglass').forEach(el => el.remove());

  Object.values(STATE.tables).forEach(t => {
    if (t.minutesRemaining === null || t.minutesRemaining > 20) return;

    const group = document.getElementById(t.id);
    if (!group) return;

    const shape = group.querySelector('circle, rect');
    if (!shape) return;

    const bbox = shape.getBBox();

    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    icon.setAttribute('x', bbox.x + bbox.width / 2);
    icon.setAttribute('y', bbox.y + bbox.height / 2);
    icon.setAttribute('text-anchor', 'middle');
    icon.setAttribute('dominant-baseline', 'central');
    icon.setAttribute('font-size', '40');
    icon.setAttribute('class', t.minutesRemaining <= 5 ? 'hourglass hourglass--urgent' : 'hourglass');
    icon.textContent = '⏳';

    group.appendChild(icon);
  });
}

// ------------------------------------------------------------
// OCCUPANCY GLOWS
// Applies .table--occupied or .table--arriving to the main
// shape (circle or rect) inside each SVG table group.
// ------------------------------------------------------------

function renderOccupancyGlows() {
  Object.values(STATE.tables).forEach(t => {
    const group = document.getElementById(t.id);
    if (!group) return;
    const shape = group.querySelector('circle, rect');
    if (!shape) return;
    shape.classList.remove('table--occupied', 'table--arriving');
    if (t.status === 'occupied') shape.classList.add('table--occupied');
  });
}

// ------------------------------------------------------------
// SHARED HELPERS
// ------------------------------------------------------------

function barColour(w) {
  if (w > 80) return '#b84a28';
  if (w > 60) return '#c87941';
  if (w > 30) return '#7a6040';
  return '#2a2a2a';
}

function sectionStatus(w) {
  if (w >= 70) return ['Overload',  'high'];
  if (w >= 50) return ['Busy',      'busy'];
  if (w >= 25) return ['Stable',    'stable'];
  return             ['Available',  'available'];
}

function getAttentionTables(sectionId) {
  const tables = STATE.sections[sectionId].tables.map(tid => STATE.tables[tid]);
  const currentTime = STATE.service.currentTime;
  const attention = [];

  tables.forEach(t => {
    if (t.status !== 'occupied') return;

    const seatedMins = minutesSince(t.seatedAt, currentTime);
    let urgency = null, stage = null, timeInStage = seatedMins || 0;

    if (!t.foodOrderedAt && seatedMins >= 5) {
      urgency = seatedMins >= 12 ? 'high' : 'medium';
      stage = t.drinksOrderedAt ? 'Ordering food' : 'Waiting to order';
    } else if (t.billPrintedAt) {
      const billMins = minutesSince(t.billPrintedAt, currentTime);
      if (billMins >= 2) {
        urgency = billMins >= 5 ? 'high' : 'medium';
        stage = 'Payment';
        timeInStage = billMins;
      }
    } else if (t.covers >= 6 && !t.foodOrderedAt && seatedMins >= 8) {
      urgency = 'high';
      stage = 'Large table ordering';
    }

    if (urgency) {
      attention.push({ id: t.id, covers: t.covers, stage, timeInStage, urgency });
    }
  });

  return attention.sort((a, b) => b.timeInStage - a.timeInStage).slice(0, 5);
}

function getNextRelief(sectionId) {
  // "Next relief" = when will workload next DROP?
  // Workload = activeCount*33 + largeTable*30 + billCount*20
  // activeCount drops when foodOrderedAt is set (~10-14 min after seating)
  // billCount drops when payment clears (~5-8 min after bill printed)
  // minutesRemaining (time until table leaves) is irrelevant — that's 120 min out.
  const tables = STATE.sections[sectionId].tables.map(tid => STATE.tables[tid]);
  const currentTime = STATE.service.currentTime;
  const prospects = [];

  tables.forEach(t => {
    if (t.status !== 'occupied') return;
    const seatedMins = minutesSince(t.seatedAt, currentTime) ?? 0;
    const tNum = 'T' + t.id.replace('_', '');

    // Active table (no food yet) — relief when food order placed
    if (t.foodOrderedAt === null) {
      const drinksIn     = t.drinksOrderedAt !== null;
      const recentlySeat = seatedMins <= 15;
      if (drinksIn || recentlySeat) {
        const minsAway = drinksIn
          ? Math.max(1, 13 - seatedMins)  // drinks done, food expected at ~13 min
          : Math.max(1, 14 - seatedMins); // drinks pending, add ~1 min estimate
        prospects.push({ minsAway, reason: tNum + ' orders food', tableId: t.id });
      }
    }

    // Bill table — relief when payment clears
    if (t.billPrintedAt !== null) {
      const onBill   = minutesSince(t.billPrintedAt, currentTime) ?? 0;
      const minsAway = Math.max(1, 8 - onBill);
      prospects.push({ minsAway, reason: tNum + ' pays bill', tableId: t.id });
    }
  });

  if (prospects.length === 0) return null;

  prospects.sort((a, b) => a.minsAway - b.minsAway);
  const best = prospects[0];
  return {
    time:     addMinutes(currentTime, best.minsAway),
    event:    best.reason,
    tableId:  best.tableId,
    minsAway: best.minsAway
  };
}

// ------------------------------------------------------------
// SECTION PANEL HELPERS
// ------------------------------------------------------------

function getTableStage(table) {
  if (table.status === 'empty')    return 'Empty';
  if (table.status === 'arriving') return 'Arriving';
  if (table.billPrintedAt !== null)  return 'Bill';
  if (table.foodOrderedAt !== null)  return 'Eating';
  if (table.drinksOrderedAt !== null) return 'Drinks';
  return 'Just Seated';
}

function getStageIcon(stage) {
  return { 'Empty': '○', 'Arriving': '⏳', 'Bill': '💰',
           'Eating': '🍽', 'Drinks': '🥤', 'Just Seated': '🪑' }[stage] || '●';
}

function getTimeInStage(table, currentTime) {
  if (table.status === 'empty' || table.status === 'arriving') return '—';
  if (table.billPrintedAt)   return minutesSince(table.billPrintedAt,   currentTime) ?? 0;
  if (table.foodOrderedAt)   return minutesSince(table.foodOrderedAt,   currentTime) ?? 0;
  if (table.drinksOrderedAt) return minutesSince(table.drinksOrderedAt, currentTime) ?? 0;
  if (table.seatedAt)        return minutesSince(table.seatedAt,        currentTime) ?? 0;
  return 0;
}

function buildTableList(sectionId, tables) {
  const isCollapsed = _tableListCollapsed[sectionId] || false;
  const currentTime = STATE.service.currentTime;

  const rows = tables.map(t => {
    const stage = getTableStage(t);
    const icon  = getStageIcon(stage);
    const dur   = getTimeInStage(t, currentTime);
    const durStr = dur === '—' ? '—' : `${dur}m`;
    return `
      <div class="sc-table-row">
        <span class="sc-table-label">T${t.id.replace('_', '')}</span>
        <span class="sc-table-stage">${icon} ${stage}</span>
        <span class="sc-table-time">${durStr}</span>
        <span class="sc-table-covers">${t.covers > 0 ? t.covers + ' cvr' : ''}</span>
      </div>`;
  }).join('');

  return `
    <div class="sc-table-list">
      <div class="sc-table-list-header" data-section="${sectionId}">
        <span>📋 Tables (${tables.length})</span>
        <span class="sc-table-list-chevron" style="transform:${isCollapsed ? 'rotate(-90deg)' : ''}">▾</span>
      </div>
      <div class="sc-table-list-body${isCollapsed ? ' collapsed' : ''}" id="table-list-${sectionId}">
        ${rows || '<div class="sc-table-empty">No tables</div>'}
      </div>
    </div>`;
}

// ------------------------------------------------------------
// SECTION PANEL
// ------------------------------------------------------------

function renderSectionPanel() {
  const col = document.getElementById('col-right');
  if (!col) return;

  const cards = ['A', 'B', 'C', 'D', 'E'].map(id => {
    const section    = STATE.sections[id];
    const tables     = section.tables.map(tid => STATE.tables[tid]);
    const w          = section.workload;
    const isCollapsed = _sectionCollapsed[id] || false;
    const [statusText, statusMod] = sectionStatus(w);

    const activeCount  = section.activeCount       || 0;
    const billCount    = section.billCount          || 0;
    const largeActive  = section.largeTableActive   || false;

    // Stage-coloured capacity bar — one segment per table
    const segs = tables.map(t => {
      if (t.status !== 'occupied')              return '<div class="sc-seg sc-seg--empty"></div>';
      if (!t.foodOrderedAt)                     return '<div class="sc-seg sc-seg--active"></div>';
      if (t.billPrintedAt)                      return '<div class="sc-seg sc-seg--bill"></div>';
      return                                           '<div class="sc-seg sc-seg--passive"></div>';
    }).join('');

    const nextRelief    = getNextRelief(id);
    const isRed         = section.isRed || false;
    const attentionRows = getAttentionTables(id);

    const attentionHtml = attentionRows.length > 0 ? `
      <div class="sc-attention">
        <div class="sc-attention-header">Tables Requiring Attention</div>
        ${attentionRows.map(a => `
          <div class="sc-attention-row sc-attention-row--${a.urgency}">
            <span class="sc-att-label">T${a.id.replace('_', '')}</span>
            <span class="sc-att-action">${a.stage}</span>
            <span class="sc-att-time">${a.timeInStage}min</span>
          </div>`).join('')}
      </div>` : '';

    return `
      <div class="section-card${isRed ? ' section-card--overloaded' : ''}" data-section="${id}">
        <div class="section-card-header" data-section="${id}">
          <span class="sc-label">Section <strong>${id}</strong></span>
          <span class="sc-status sc-status--${statusMod}">${statusText}</span>
          <span class="sc-pct">${w}%</span>
          <span class="sc-section-chevron">${isCollapsed ? '▸' : '▾'}</span>
        </div>
        ${isRed ? `<div class="sc-overload-overlay${isCollapsed ? '' : ' sc-overload-overlay--hidden'}">
          <div class="sc-overload-msg">⚠️ Section ${id} — Overload</div>
          <div class="sc-overload-relief">${nextRelief ? 'Next relief ~' + nextRelief.minsAway + 'min' : 'No relief soon — reassign'}</div>
        </div>` : ''}
        <div class="sc-capacity-bar">${segs}</div>
        <div class="sc-stats">
          <div class="sc-stat">
            <span class="sc-stat-label">Active</span>
            <span class="sc-stat-value">${activeCount}</span>
          </div>
          <div class="sc-stat">
            <span class="sc-stat-label">Bills</span>
            <span class="sc-stat-value">${billCount}</span>
          </div>
          <div class="sc-stat">
            <span class="sc-stat-label">Large table</span>
            <span class="sc-stat-value">${largeActive ? '✓' : '—'}</span>
          </div>
        </div>
        <div class="section-collapsible-content${isCollapsed ? ' collapsed' : ''}">
          <canvas id="fc-canvas-${id}" class="fc-canvas" width="240" height="44"></canvas>
          ${isRed && nextRelief
            ? `<div class="sc-relief sc-relief--urgent">
                 <span class="sc-relief-label">⚠️ Relief in</span>
                 <span class="sc-relief-time">${nextRelief.minsAway}min</span>
                 <span class="sc-relief-event">(${nextRelief.event})</span>
               </div>`
            : `<div class="sc-relief">
                 <span class="sc-relief-label">Next relief</span>
                 <span class="sc-relief-time">${nextRelief ? '~' + nextRelief.minsAway + 'min' : '—'}</span>
                 <span class="sc-relief-event">${nextRelief ? '(' + nextRelief.event + ')' : ''}</span>
               </div>`
          }
          ${buildTableList(id, tables)}
          ${attentionHtml}
          <div class="sc-expand-handle">···</div>
        </div>
      </div>`;
  }).join('');

  col.innerHTML = `
    <div id="section-panel-header">
      <span>⊞ Current Service State</span>
      <span id="section-panel-time">${STATE.service.currentTime}</span>
    </div>
    ${cards}`;
}

// ------------------------------------------------------------
// FORECAST WIDGET
// Draws area charts on the canvas elements injected by
// renderSectionPanel() for high-load sections.
// ------------------------------------------------------------

function drawForecastChart(canvas, sectionId) {
  const tables = STATE.sections[sectionId].tables.map(id => STATE.tables[id]);
  const data   = [
    STATE.sections[sectionId].workload,
    projectWorkload(tables, 5),
    projectWorkload(tables, 10),
    projectWorkload(tables, 15),
    projectWorkload(tables, 20),
  ];

  const ctx = canvas.getContext('2d');
  const W   = canvas.width;
  const H   = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const xOf = i => (i / (data.length - 1)) * W;
  const yOf = v => H - (v / 100) * H;

  // Cyan filled area
  ctx.beginPath();
  ctx.moveTo(xOf(0), yOf(data[0]));
  for (let i = 1; i < data.length; i++) ctx.lineTo(xOf(i), yOf(data[i]));
  ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
  ctx.fillStyle = 'rgba(0,188,212,0.18)';
  ctx.fill();

  // Cyan line
  ctx.beginPath();
  ctx.moveTo(xOf(0), yOf(data[0]));
  for (let i = 1; i < data.length; i++) ctx.lineTo(xOf(i), yOf(data[i]));
  ctx.strokeStyle = '#00838f';
  ctx.lineWidth   = 1.5;
  ctx.stroke();

  // Red pressure area above threshold
  const threshold = 60;
  const yThresh   = yOf(threshold);
  ctx.beginPath();
  let open = false;
  for (let i = 0; i < data.length; i++) {
    if (data[i] > threshold) {
      if (!open) {
        if (i > 0) {
          const t  = (threshold - data[i - 1]) / (data[i] - data[i - 1]);
          const xi = xOf(i - 1) + t * (xOf(i) - xOf(i - 1));
          ctx.moveTo(xi, yThresh);
        } else {
          ctx.moveTo(xOf(i), yThresh);
        }
        open = true;
      }
      ctx.lineTo(xOf(i), yOf(data[i]));
    } else if (open) {
      if (i > 0) {
        const t  = (threshold - data[i - 1]) / (data[i] - data[i - 1]);
        const xi = xOf(i - 1) + t * (xOf(i) - xOf(i - 1));
        ctx.lineTo(xi, yThresh);
      }
      open = false;
    }
  }
  if (open) ctx.lineTo(W, yThresh);
  ctx.closePath();
  ctx.fillStyle = 'rgba(180,30,20,0.4)';
  ctx.fill();

  // Dashed vertical at peak
  const peakIdx = data.indexOf(Math.max(...data));
  if (data[peakIdx] > 40) {
    ctx.save();
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(xOf(peakIdx), 0);
    ctx.lineTo(xOf(peakIdx), H);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth   = 1;
    ctx.stroke();
    ctx.restore();
  }

  // X-axis labels
  ['Now', '+5', '+10', '+15', '+20'].forEach((lbl, i) => {
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.font      = '8px system-ui, sans-serif';
    ctx.textAlign = i === 0 ? 'left' : i === 4 ? 'right' : 'center';
    ctx.fillText(lbl, xOf(i), H - 2);
  });
}

function renderForecastWidget() {
  ['A', 'B', 'C', 'D', 'E'].forEach(id => {
    const canvas = document.getElementById(`fc-canvas-${id}`);
    if (!canvas) return;
    drawForecastChart(canvas, id);
  });
}

// ------------------------------------------------------------
// TABLE INTERACTION — Part A
// Click a table group → highlight + tooltip. Click elsewhere → dismiss.
// ------------------------------------------------------------

let tooltipEl = null;

function initTableInteraction() {
  tooltipEl    = document.createElement('div');
  tooltipEl.id = 'table-tooltip';
  tooltipEl.style.display = 'none';
  document.body.appendChild(tooltipEl);

  const svgEl = document.getElementById('floorplan');

  // Delegate clicks inside the SVG
  svgEl.addEventListener('click', e => {
    // Walk up from clicked element to find a table group
    let el = e.target;
    while (el && el !== svgEl) {
      if (el.tagName === 'g' && el.id && STATE.tables[el.id]) {
        handleTableClick(el.id);
        return;
      }
      el = el.parentElement;
    }
  });

  // Hover tooltip with live data
  svgEl.addEventListener('mousemove', e => {
    const tableId = getTableIdFromEventTarget(e.target, svgEl);
    if (!tableId) {
      hideTooltip();
      return;
    }
    showHoverTooltip(tableId, e.clientX, e.clientY);
  });

  svgEl.addEventListener('mouseleave', () => hideTooltip());
}

function getTableIdFromEventTarget(target, svgEl) {
  let el = target;
  while (el && el !== svgEl) {
    if (el.tagName === 'g' && el.id && STATE.tables[el.id]) return el.id;
    el = el.parentElement;
  }
  return null;
}

function handleTableClick(tableId) {
  const table = STATE.tables[tableId];
  if (!table) return;

  if (table.status === 'occupied') {
    const res = STATE.reservations.find(r =>
      r.assignedTable === tableId && r.status === 'arrived'
    );
    if (res) { openGuestProfile(res); return; }
    // Fallback stub for tables occupied without a matching reservation record
    const stub = {
      id: null, guestName: table.guestName || 'Seated Guest',
      time: table.seatedAt || '—', covers: table.covers || 0,
      status: 'arrived', bookingType: 'confirmed',
      assignedTable: tableId, suggestedTable: null,
      tags: [], allergies: [], notes: '', phone: '—', email: '—'
    };
    openGuestProfile(stub);
    return;
  }

  // Empty or arriving — show table options (reservations + walk-in)
  openTableOptionsModal(tableId);
}

function openTableOptionsModal(tableId) {
  const table = STATE.tables[tableId];
  if (!table) return;

  const tableNum = tableId.replace('_', '');
  document.getElementById('table-options-title').textContent =
    `Table ${tableNum}  ·  Section ${table.section}  ·  ${table.capacity} pax`;

  const list = document.getElementById('table-options-list');
  list.innerHTML = '';

  // All upcoming reservations assigned to this table, soonest first
  const upcoming = STATE.reservations
    .filter(r => r.assignedTable === tableId && r.status === 'upcoming')
    .sort((a, b) => a.time.localeCompare(b.time));

  upcoming.forEach(res => {
    const btn = document.createElement('button');
    btn.className = 'table-option-btn';
    btn.innerHTML = `
      <span class="table-option-name">${res.guestName}</span>
      <span class="table-option-meta">${res.time} &nbsp;·&nbsp; ${res.covers} pax</span>`;
    btn.addEventListener('click', () => {
      closeTableOptionsModal();
      openGuestProfile(res);
    });
    list.appendChild(btn);
  });

  // Walk-in option — always present
  const walkInBtn = document.createElement('button');
  walkInBtn.className = 'table-option-btn table-option-btn--walkin';
  walkInBtn.innerHTML = `
    <span class="table-option-name">+ Walk-in</span>
    <span class="table-option-meta">Find best table for new guest</span>`;
  walkInBtn.addEventListener('click', () => {
    closeTableOptionsModal();
    openWalkInModal(tableId); // pass the clicked table as preference
  });
  list.appendChild(walkInBtn);

  document.getElementById('table-options-modal').classList.remove('modal-hidden');
}

function closeTableOptionsModal() {
  document.getElementById('table-options-modal').classList.add('modal-hidden');
}

function showHoverTooltip(tableId, x, y) {
  const t      = STATE.tables[tableId];
  const label  = 'T' + tableId.replace('_', '');
  const status = t.status.charAt(0).toUpperCase() + t.status.slice(1);
  const guest = t.guestName || '—';
  const mins = t.minutesRemaining === null ? '—' : `${t.minutesRemaining} min`;

  tooltipEl.innerHTML = `
    <div class="tt-top">
      <span class="tt-id">${label}</span>
      <span class="tt-status">${status}</span>
    </div>
    <div class="tt-covers">Guest: ${guest}</div>
    <div class="tt-due">Remaining: ${mins}</div>`;

  tooltipEl.style.display = 'block';
  positionTooltip(x, y);
}

function positionTooltip(x, y) {
  const pad    = 12;
  const width  = tooltipEl.offsetWidth;
  const height = tooltipEl.offsetHeight;
  let left = x + pad;
  let top  = y + pad;
  if (left + width  > window.innerWidth  - pad) left = x - width  - pad;
  if (top  + height > window.innerHeight - pad) top  = y - height - pad;
  tooltipEl.style.left = left + 'px';
  tooltipEl.style.top  = top  + 'px';
}

function hideTooltip() {
  if (tooltipEl) tooltipEl.style.display = 'none';
}

// ------------------------------------------------------------
// TIME SIMULATION — Part B
// Advances STATE.service.currentTime by 1 minute every 60 s,
// recalculates minutesRemaining and workloads, re-renders all.
// ------------------------------------------------------------

function timeToMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function advanceTime() {
  if (!simulationRunning) return;
  // Advance sim time by 1 minute
  const total = (timeToMinutes(STATE.service.currentTime) + 1) % (24 * 60);
  STATE.service.currentTime = String(Math.floor(total / 60)).padStart(2, '0') + ':' + String(total % 60).padStart(2, '0');
  const currentMins = timeToMinutes(STATE.service.currentTime);

  // Update minutesRemaining for occupied tables
  Object.values(STATE.tables).forEach(t => {
    if (t.status === 'occupied' && t.turnoverDue) {
      t.minutesRemaining = timeToMinutes(t.turnoverDue) - currentMins;

      // Natural table clearance: once overdue by 15+ mins, 30% chance per tick to clear
      if (t.minutesRemaining <= -15) {
        if (Math.random() < 0.30) {
          // Table clears naturally
          t.status = 'empty';
          t.covers = 0;
          t.seatedAt = null;
          t.guestName = null;
          t.turnoverDue = null;
          t.minutesRemaining = null;
          t.courseStatus = null;
          t.drinksOrderedAt = null;
          t.foodOrderedAt   = null;
          t.billPrintedAt   = null;

          // Mark the corresponding reservation as completed
          const res = STATE.reservations.find(r =>
            r.assignedTable === t.id && r.status === 'arrived'
          );
          if (res) {
            res.status = 'completed';
            res.assignedTable = null;
          }
        }
      }
    }
  });

  // Auto-seat upcoming reservations whose time has passed
  if (demoMode === 'auto') {
    STATE.reservations
      .filter(r => r.status === 'upcoming')
      .forEach(res => {
        const resMins = timeToMinutes(res.time);
        const diff = currentMins - resMins;
        // If booking time has passed by 5-20 mins, 25% chance per tick to auto-seat
        if (diff >= 5 && diff <= 20 && Math.random() < 0.25) {
          const targetId = res.assignedTable || res.suggestedTable;
          if (targetId) {
            const table = STATE.tables[targetId];
            if (table && table.status === 'empty') {
              table.status = 'occupied';
              table.covers = res.covers;
              table.seatedAt = STATE.service.currentTime;
              table.guestName = res.guestName;
              table.turnoverDue = addMinutes(STATE.service.currentTime, 120);
              table.minutesRemaining = 120;
              table.courseStatus = 'ordering';
              res.status = 'arrived';
              res.assignedTable = targetId;
              res.suggestedTable = null;
            }
          }
        }
      });
  }

  // Progress course status and auto-set stage timestamps for occupied tables
  Object.values(STATE.tables).forEach(t => {
    if (t.status !== 'occupied') return;

    const seatedMins = minutesSince(t.seatedAt, STATE.service.currentTime);

    // Auto-set drinks ordered 3–8 min after seating (30% chance per tick)
    if (!t.drinksOrderedAt && seatedMins >= 3 && seatedMins <= 8 && Math.random() < 0.3) {
      t.drinksOrderedAt = STATE.service.currentTime;
    }

    // Auto-set food ordered 10+ min after seating if drinks taken (25% chance per tick)
    if (!t.foodOrderedAt && t.drinksOrderedAt && seatedMins >= 10 && Math.random() < 0.25) {
      t.foodOrderedAt = STATE.service.currentTime;
    }

    if (!t.minutesRemaining) return;
    const elapsed = 120 - t.minutesRemaining;
    if (elapsed < 15) t.courseStatus = 'ordering';
    else if (elapsed < 40) t.courseStatus = 'starters';
    else if (elapsed < 75) t.courseStatus = 'mains';
    else if (elapsed < 100) t.courseStatus = 'dessert';
    else t.courseStatus = 'payment';
  });

  // Recalculate workloads
  Object.keys(STATE.sections).forEach(id => calculateSectionWorkload(id));

  // Regenerate suggestions for unassigned reservations
  if (window.suggestTable) {
    STATE.reservations.forEach(res => {
      if (!res.assignedTable) {
        res.suggestedTable = suggestTable(res);
      }
    });
  }

  hideTooltip();
  renderAll();
}

function runManualTicks(ticks = 5) {
  for (let i = 0; i < ticks; i += 1) {
    advanceTime();
  }
}

// ------------------------------------------------------------
// CLOCK
// Updates the #clock element every second with HH:MM format.
// ------------------------------------------------------------

function startClock() {
  const clockEl = document.getElementById('clock');

  function tick() {
    const now  = new Date();
    const hh   = String(now.getHours()).padStart(2, '0');
    const mm   = String(now.getMinutes()).padStart(2, '0');
    clockEl.textContent = `${hh}:${mm}`;
  }

  tick(); // Run immediately so there's no blank flash on load
  setInterval(tick, 1000);
}

// ------------------------------------------------------------
// RENDER ALL — convenience wrapper
// ------------------------------------------------------------

function renderAll() {
  renderSectionPanel();
  renderForecastWidget();
  renderReservationList();
  renderOccupancyGlows();
  renderWorkloadGlows();
  renderHourglassIndicators();
  renderTableTimeLabels();
}



// ------------------------------------------------------------
// TABLE TIME LABELS
// Injects seated-time (occupied) or next-reservation time (empty)
// as SVG text nodes directly on the floorplan.
// ------------------------------------------------------------

function renderTableTimeLabels() {
  const svg = document.getElementById('floorplan');
  if (!svg) return;
  svg.querySelectorAll('.table-time-label').forEach(el => el.remove());

  const positions = {
    '_1':  { cx: 2267, cy: 434,  r: 58  },
    '_2':  { cx: 2401, cy: 701,  r: 52  },
    '_3':  { cx: 2231, cy: 763,  r: 52  },
    '_4':  { cx: 2277, cy: 1058, r: 95  },
    '_5':  { cx: 2035, cy: 1063, r: 52  },
    '_6':  { cx: 2052, cy: 786,  r: 52  },
    '_7':  { cx: 2043, cy: 545,  r: 52  },
    '_8':  { cx: 1587, cy: 526,  r: 52  },
    '_9':  { cx: 1585, cy: 704,  r: 52  },
    '_10': { cx: 1572, cy: 983,  r: 52  },
    '_11': { cx: 1572, cy: 1288, r: 52  },
    '_12': { cx: 1322, cy: 1285, r: 52  },
    '_14': { cx: 1206, cy: 992,  r: 95  },
    '_15': { cx: 1285, cy: 661,  r: 68  },
    '_16':  { cx: 1110, cy: 236,  r: 68  },
    '_161': { cx: 695,  cy: 253,  r: 68  },
    '_17': { cx: 944,  cy: 509,  r: 52  },
    '_18': { cx: 940,  cy: 794,  r: 52  },
    '_19': { cx: 959,  cy: 1345, r: 79  },
    '_20': { cx: 632,  cy: 1204, r: 52  },
    '_21': { cx: 632,  cy: 1015, r: 52  },
    '_22': { cx: 636,  cy: 795,  r: 52  },
    '_23': { cx: 635,  cy: 510,  r: 52  },
    '_24': { cx: 312,  cy: 312,  r: 67  },
    '_25': { cx: 289,  cy: 549,  r: 58  },
    '_26': { cx: 287,  cy: 1228, r: 50  },
    '_27': { cx: 330,  cy: 1689, r: 78  },
    '_28': { cx: 381,  cy: 2078, r: 128 },
    '_29': { cx: 717,  cy: 1900, r: 52  },
    '_30': { cx: 720,  cy: 1644, r: 52  },
    '_31': { cx: 1209, cy: 1594, r: 89  },
    '_32': { cx: 1099, cy: 2066, r: 60  },
    '_33': { cx: 1016, cy: 2354, r: 76  },
    '_34': { cx: 658,  cy: 2354, r: 76  },
    '_35': { cx: 716,  cy: 2116, r: 52  }
  };

  const CARD_H  = 40;
  const GAP     = 8;
  const FONT_SZ = 22;
  const PAD_X   = 14;
  const MIN_CARD_W = 96;

  const vb = svg.viewBox?.baseVal;
  const viewMinX = vb ? vb.x : 0;
  const viewMaxX = vb ? vb.x + vb.width : 2600;
  const viewMinY = vb ? vb.y : 0;
  const viewMaxY = vb ? vb.y + vb.height : 2600;

  function measureTextWidth(text) {
    const probe = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    probe.setAttribute('x', '-99999');
    probe.setAttribute('y', '-99999');
    probe.setAttribute('font-size', String(FONT_SZ));
    probe.setAttribute('font-weight', '600');
    probe.setAttribute('font-family', 'system-ui, sans-serif');
    probe.textContent = text;
    svg.appendChild(probe);
    const width = probe.getComputedTextLength();
    probe.remove();
    return width;
  }

  Object.values(STATE.tables).forEach(table => {
    const pos = positions[table.id];
    if (!pos) return;
    const tableCapacity = table.capacity ?? 2;

    // Build ordered list of badge entries — hard cap of 2 time tags total,
    // plus a plain "+" indicator if any reservations are hidden.
    const MAX_TIME_TAGS = 2;
    const entries = [];

    // 1. Seated time counts as the first tag (cyan)
    if (table.status === 'occupied' && table.seatedAt) {
      entries.push({ time: table.seatedAt, color: '#00e5ff' });
    }

    // 2. Fill remaining tag slots with upcoming reservations for this table
    const allFutureReservations = STATE.reservations
      .filter(r =>
        (r.assignedTable === table.id || r.suggestedTable === table.id) &&
        r.status === 'upcoming'
      )
      .sort((a, b) => a.time.localeCompare(b.time));

    const remainingSlots = MAX_TIME_TAGS - entries.length;
    const displayReservations = allFutureReservations.slice(0, remainingSlots);

    displayReservations.forEach(r => {
      const assigned = r.assignedTable === table.id;
      entries.push({ time: r.time, color: assigned ? '#e0e0e0' : '#606060' });
    });

    // 3. Plain "+" if any upcoming reservations are hidden
    if (allFutureReservations.length > displayReservations.length) {
      entries.push({ time: '+', color: '#aaa', isIndicator: true });
    }

    if (entries.length === 0) return;

    // Stack starts one card-height above table centre, grows downward.
    const stackH = entries.length * CARD_H + (entries.length - 1) * GAP;
    let bY = pos.cy - CARD_H;
    // Clamp to keep entire stack inside the current viewBox.
    bY = Math.max(viewMinY + 10, Math.min(viewMaxY - stackH - 10, bY));

    entries.forEach(entry => {
      const textW = measureTextWidth(entry.time);
      const cardW = Math.max(MIN_CARD_W, Math.ceil(textW + PAD_X * 2));

      // Place card overlapping the table edge by 40px; flip side if no room.
      const overlapAmount = 40;
      const spaceToRight = viewMaxX - (pos.cx + pos.r);
      let bX;
      if (spaceToRight > cardW) {
        bX = pos.cx + pos.r - overlapAmount;
      } else {
        bX = pos.cx - pos.r - (cardW - overlapAmount);
      }
      if (bX < viewMinX + 10) bX = viewMinX + 10;

      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'table-time-label');
      g.setAttribute('pointer-events', 'none');

      const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      bg.setAttribute('x', String(bX));
      bg.setAttribute('y', bY);
      bg.setAttribute('width', String(cardW));
      bg.setAttribute('height', String(CARD_H));
      bg.setAttribute('rx', '4');
      bg.setAttribute('fill', '#1a1a1a');
      g.appendChild(bg);

      const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('x', String(bX + cardW / 2));
      t.setAttribute('y', bY + CARD_H / 2);
      t.setAttribute('dominant-baseline', 'central');
      t.setAttribute('text-anchor', 'middle');
      t.setAttribute('fill', entry.color);
      t.setAttribute('font-size', String(FONT_SZ));
      t.setAttribute('font-weight', '600');
      t.setAttribute('font-family', 'Roboto, sans-serif');
      t.textContent = entry.time;
      g.appendChild(t);

      svg.appendChild(g);
      bY += CARD_H + GAP;
    });
  });
}

// ------------------------------------------------------------
// GUEST PROFILE MODAL
// ------------------------------------------------------------

function openGuestProfile(res) {
  document.getElementById('guest-modal-name').textContent = res.guestName;
  document.getElementById('guest-modal-booktype').textContent =
    res.bookingType === 'confirmed' ? 'Confirmed' : 'Pending';
  document.getElementById('guest-modal-time').textContent = res.time;
  document.getElementById('guest-modal-covers').textContent = res.covers + ' guests';
  document.getElementById('guest-modal-phone').textContent = res.phone || '—';
  document.getElementById('guest-modal-email').textContent = res.email || '—';

  const allergyRow = document.getElementById('guest-modal-allergy-row');
  if (res.allergies && res.allergies.length > 0) {
    allergyRow.style.display = 'flex';
    document.getElementById('guest-modal-allergies').textContent =
      res.allergies.join(', ');
  } else {
    allergyRow.style.display = 'none';
  }

  const notesRow = document.getElementById('guest-modal-notes-row');
  if (res.notes && res.notes.trim() !== '') {
    notesRow.style.display = 'flex';
    document.getElementById('guest-modal-notes').textContent = res.notes;
  } else {
    notesRow.style.display = 'none';
  }

  // Tags
  const tagsEl = document.getElementById('guest-modal-tags');
  tagsEl.innerHTML = (res.tags || []).map(tag => {
    const cls = tag.replace(' ', '-');
    return `<span class="res-tag res-tag--${cls}">${tag}</span>`;
  }).join(' ');

  // Table
  let tableText = '—';
  if (res.assignedTable) {
    tableText = 'Table ' + res.assignedTable.replace('_', '') + ' (assigned)';
  } else if (res.suggestedTable) {
    tableText = 'Table ' + res.suggestedTable.replace('_', '') + ' (suggested)';
  }
  document.getElementById('guest-modal-table').textContent = tableText;

  // Store current res id on modal for action buttons
  document.getElementById('guest-modal').dataset.resId = res.id;

  // Actions differ based on status
  const actionsEl = document.getElementById('guest-modal-actions');
  if (res.status === 'arrived') {
    actionsEl.innerHTML = `
      <button class="guest-action-btn" id="btn-move-table">Move Table</button>
      <button class="guest-action-btn" id="btn-mark-leaving">Leaving Soon</button>
      <button class="guest-action-btn guest-action-btn--danger" id="btn-clear-table">Clear Table</button>
    `;
    document.getElementById('btn-move-table')?.addEventListener('click', () => {
      closeGuestProfile();
      openTablePicker(res, 'move');
    });
    document.getElementById('btn-mark-leaving')?.addEventListener('click', () => {
      if (res.assignedTable) {
        const table = STATE.tables[res.assignedTable];
        if (table) {
          table.minutesRemaining = 5;
          table.courseStatus = 'payment';
        }
      }
      closeGuestProfile();
      renderAll();
    });
    document.getElementById('btn-clear-table')?.addEventListener('click', () => {
      if (res.assignedTable) {
        const table = STATE.tables[res.assignedTable];
        if (table) {
          table.status = 'empty';
          table.covers = 0;
          table.seatedAt = null;
          table.guestName = null;
          table.turnoverDue = null;
          table.minutesRemaining = null;
          table.courseStatus = null;
          table.drinksOrderedAt = null;
          table.foodOrderedAt   = null;
          table.billPrintedAt   = null;
        }
      }
      res.status = 'completed';
      res.assignedTable = null;
      closeGuestProfile();
      Object.keys(STATE.sections).forEach(id => calculateSectionWorkload(id));
      renderAll();
    });
  } else {
    actionsEl.innerHTML = `
      <button class="guest-action-btn guest-action-btn--primary" id="btn-seat">Seat Now</button>
      <button class="guest-action-btn" id="btn-assign">Assign Table</button>
      <button class="guest-action-btn" id="btn-no-show">No Show</button>
    `;
    document.getElementById('btn-seat')?.addEventListener('click', () => {
      if (res.assignedTable) {
        seatGuest(res, res.assignedTable);
      } else {
        const suggestion = suggestBestTable(res);
        closeGuestProfile();
        if (suggestion) openSuggestModal(res, suggestion);
        else openTablePicker(res, 'seat');
      }
    });
    document.getElementById('btn-assign')?.addEventListener('click', () => {
      closeGuestProfile();
      openTablePicker(res, 'assign');
    });
    document.getElementById('btn-no-show')?.addEventListener('click', () => {
      res.status = 'no-show';
      closeGuestProfile();
      renderReservationList();
    });
  }

  document.getElementById('guest-modal').classList.remove('modal-hidden');
}

function closeGuestProfile() {
  document.getElementById('guest-modal').classList.add('modal-hidden');
}

// ------------------------------------------------------------
// SEAT GUEST
// ------------------------------------------------------------

function addMinutes(timeStr, mins) {
  const [hh, mm] = timeStr.split(':').map(Number);
  const total = hh * 60 + mm + mins;
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
}

let _conflictRes     = null;
let _conflictTableId = null;
let _tablePickerMode = 'seat'; // 'seat' | 'assign' | 'move'
let _suggestRes      = null;
let _suggestTableId  = null;
let _partyRes        = null;
let _partyTableId    = null;

// ------------------------------------------------------------
// SUGGEST BEST TABLE (Part 2)
// ------------------------------------------------------------

function nextReservationAt(tableId) {
  // Returns the HH:MM of the soonest upcoming reservation on this table, or null.
  const upcoming = STATE.reservations
    .filter(r => r.assignedTable === tableId && r.status === 'upcoming')
    .sort((a, b) => a.time.localeCompare(b.time));
  return upcoming.length > 0 ? upcoming[0].time : null;
}

function suggestBestTable(reservation) {
  const candidates = [];

  Object.keys(STATE.sections).forEach(sid => {
    const section = STATE.sections[sid];
    const tables  = section.tables.map(id => STATE.tables[id]);
    const fitting = tables.filter(t => t.status === 'empty' && t.capacity >= reservation.covers);
    if (fitting.length === 0) return;

    // For each fitting table, score: prefer no upcoming reservation, then tightest capacity
    fitting.sort((a, b) => {
      const aNext = nextReservationAt(a.id);
      const bNext = nextReservationAt(b.id);
      if (!aNext && bNext) return -1;
      if (aNext && !bNext) return  1;
      return a.capacity - b.capacity;
    });

    const best       = fitting[0];
    const conflictAt = nextReservationAt(best.id);
    candidates.push({
      tableId:     best.id,
      sectionId:   sid,
      workload:    section.workload,
      isOverloaded: section.workload >= 70,
      conflictAt,          // null = no upcoming reservation on this table
      hasConflict: conflictAt !== null
    });
  });

  if (candidates.length === 0) return null;

  // Rank: no conflict first, then lowest workload
  candidates.sort((a, b) => {
    if (!a.hasConflict && b.hasConflict) return -1;
    if (a.hasConflict && !b.hasConflict) return  1;
    return a.workload - b.workload;
  });

  return candidates[0];
}

function openSuggestModal(res, suggestion) {
  _suggestRes     = res;
  _suggestTableId = suggestion.tableId;

  const tableNum  = suggestion.tableId.replace('_', '');
  const nextRelief = getNextRelief(suggestion.sectionId);

  document.getElementById('suggest-modal-desc').innerHTML = `
    <div>Best available: <strong>Table ${tableNum}</strong></div>
    <div style="margin-top:4px;color:#666">Section ${suggestion.sectionId}&nbsp;·&nbsp;${suggestion.workload}% load</div>`;

  const warningEl = document.getElementById('suggest-modal-warning');
  const warnings  = [];
  if (suggestion.isOverloaded) {
    const nextRelief = getNextRelief(suggestion.sectionId);
    const reliefText = nextRelief ? `Next relief ~${nextRelief.minsAway}min` : 'no relief soon';
    warnings.push(`Section ${suggestion.sectionId} is at ${suggestion.workload}% — ${reliefText}`);
  }
  if (suggestion.hasConflict) {
    warnings.push(`Table ${tableNum} has a reservation at ${suggestion.conflictAt} — guest may need to move`);
  }
  if (warnings.length > 0) {
    warningEl.innerHTML = warnings.map(w => `⚠️ ${w}`).join('<br>');
    warningEl.classList.remove('modal-hidden');
  } else {
    warningEl.classList.add('modal-hidden');
  }

  document.getElementById('suggest-modal').classList.remove('modal-hidden');
}

function closeSuggestModal() {
  document.getElementById('suggest-modal').classList.add('modal-hidden');
  _suggestRes     = null;
  _suggestTableId = null;
}

// ------------------------------------------------------------
// WALK-IN COVER PICKER
// ------------------------------------------------------------

function openWalkInModal(preferredTableId = null) {
  const grid = document.getElementById('walkin-covers-grid');
  grid.innerHTML = '';
  for (let i = 1; i <= 12; i++) {
    const btn = document.createElement('button');
    btn.className = 'walkin-cover-btn';
    btn.textContent = i;
    btn.addEventListener('click', () => {
      const walkIn = {
        id: null, guestName: 'Walk-in',
        time: STATE.service.currentTime, covers: i,
        status: 'upcoming', bookingType: 'confirmed',
        assignedTable: null, suggestedTable: null,
        tags: [], allergies: [], notes: '', phone: '—', email: '—'
      };
      closeWalkInModal();

      // If triggered from a specific table click, prefer that table when it fits
      let suggestion = null;
      if (preferredTableId) {
        const pref = STATE.tables[preferredTableId];
        if (pref && pref.status === 'empty' && pref.capacity >= i) {
          const section    = STATE.sections[pref.section];
          const conflictAt = nextReservationAt(preferredTableId);
          suggestion = {
            tableId:     preferredTableId,
            sectionId:   pref.section,
            workload:    section.workload,
            isOverloaded: section.workload >= 70,
            conflictAt,
            hasConflict: conflictAt !== null
          };
        }
      }
      // Fall back to global best if no valid preferred table
      if (!suggestion) suggestion = suggestBestTable(walkIn);

      if (suggestion) openSuggestModal(walkIn, suggestion);
      else            openTablePicker(walkIn, 'seat');
    });
    grid.appendChild(btn);
  }
  document.getElementById('walkin-modal').classList.remove('modal-hidden');
}

function closeWalkInModal() {
  document.getElementById('walkin-modal').classList.add('modal-hidden');
}

// ------------------------------------------------------------
// MOVE GUEST (Part 1 — Move Table action)
// ------------------------------------------------------------

function moveGuest(res, newTableId) {
  const newTable = STATE.tables[newTableId];
  if (!newTable) return;

  if (newTable.status === 'occupied') {
    openConflictModal(res, newTableId);
    return;
  }

  // Check party size vs table capacity
  if (res.covers && newTable.capacity && res.covers > newTable.capacity) {
    openPartyModal(res, newTableId);
    return;
  }

  // Preserve progress from old table before clearing it
  const oldTableId = res.assignedTable;
  let seatedAt = STATE.service.currentTime;
  let drinksOrderedAt = null;
  let foodOrderedAt   = null;

  if (oldTableId) {
    const oldTable = STATE.tables[oldTableId];
    if (oldTable) {
      seatedAt        = oldTable.seatedAt        || STATE.service.currentTime;
      drinksOrderedAt = oldTable.drinksOrderedAt || null;
      foodOrderedAt   = oldTable.foodOrderedAt   || null;
      oldTable.status           = 'empty';
      oldTable.covers           = 0;
      oldTable.seatedAt         = null;
      oldTable.guestName        = null;
      oldTable.turnoverDue      = null;
      oldTable.minutesRemaining = null;
      oldTable.courseStatus     = null;
      oldTable.drinksOrderedAt  = null;
      oldTable.foodOrderedAt    = null;
      oldTable.billPrintedAt    = null;
      calculateSectionWorkload(oldTable.section);
    }
  }

  newTable.status           = 'occupied';
  newTable.covers           = res.covers;
  newTable.seatedAt         = seatedAt;
  newTable.guestName        = res.guestName;
  newTable.drinksOrderedAt  = drinksOrderedAt;
  newTable.foodOrderedAt    = foodOrderedAt;
  newTable.turnoverDue      = addMinutes(seatedAt, 120);
  newTable.minutesRemaining = timeToMinutes(addMinutes(seatedAt, 120)) - timeToMinutes(STATE.service.currentTime);

  res.assignedTable = newTableId;
  calculateSectionWorkload(newTable.section);
  closeGuestProfile();
  renderAll();
}

function openConflictModal(res, tableId) {
  _conflictRes     = res;
  _conflictTableId = tableId;
  const occupant = STATE.tables[tableId];
  document.getElementById('conflict-desc').textContent =
    `Table ${tableId.replace('_', '')} is currently occupied by ${occupant?.guestName || 'another guest'}. How would you like to proceed?`;
  document.getElementById('conflict-modal').classList.remove('modal-hidden');
}

function closeConflictModal() {
  document.getElementById('conflict-modal').classList.add('modal-hidden');
  _conflictRes     = null;
  _conflictTableId = null;
}

function openPartyModal(res, tableId) {
  _partyRes     = res;
  _partyTableId = tableId;
  const table   = STATE.tables[tableId];
  document.getElementById('party-modal-desc').textContent =
    `Table ${tableId.replace('_', '')} seats ${table.capacity} but this party has ${res.covers} guests. The table is too small.`;
  document.getElementById('party-modal').classList.remove('modal-hidden');
}

function closePartyModal() {
  document.getElementById('party-modal').classList.add('modal-hidden');
  _partyRes     = null;
  _partyTableId = null;
}

function openTablePicker(res, mode = 'seat') {
  _conflictRes     = res;
  _tablePickerMode = mode;
  const modeLabel  = mode === 'assign' ? 'Assigning table for' : mode === 'move' ? 'Moving' : 'Seating';
  document.getElementById('table-picker-desc').textContent =
    `${modeLabel} ${res.guestName} (${res.covers} covers). Recommended tables are highlighted.`;

  const list = document.getElementById('table-picker-list');
  list.innerHTML = '';

  const suggested = res.suggestedTable;

  Object.values(STATE.tables)
    .filter(t => t.capacity >= res.covers)
    .sort((a, b) => {
      if (a.id === suggested) return -1;
      if (b.id === suggested) return  1;
      return a.status.localeCompare(b.status);
    })
    .forEach(t => {
      const row = document.createElement('div');
      row.className = 'table-pick-row' + (t.id === suggested ? ' recommended' : '');

      const statusText = t.status === 'empty'    ? 'Available' :
                         t.status === 'occupied' ? `Occupied — ${t.minutesRemaining ?? '?'}min left`
                                                 : t.status;

      row.innerHTML = `
        <div>
          <span class="table-pick-label">Table ${t.id.replace('_', '')}</span>
          <span class="table-pick-meta"> · Section ${t.section} · ${t.capacity} covers</span>
        </div>
        <div style="display:flex;align-items:center;gap:6px">
          <span class="table-pick-meta">${statusText}</span>
          ${t.id === suggested ? '<span class="table-pick-tag">Recommended</span>' : ''}
        </div>`;

      row.addEventListener('click', () => {
        if (_tablePickerMode === 'assign') {
          res.assignedTable = t.id;
          closeTablePicker();
          renderAll();
        } else if (_tablePickerMode === 'move') {
          closeTablePicker();
          moveGuest(res, t.id);
        } else {
          seatGuest(res, t.id);
          closeTablePicker();
        }
      });

      list.appendChild(row);
    });

  document.getElementById('table-picker-modal').classList.remove('modal-hidden');
}

function closeTablePicker() {
  document.getElementById('table-picker-modal').classList.add('modal-hidden');
  _conflictRes = null;
}

function seatGuest(res, tableId) {
  const table = STATE.tables[tableId];
  if (!table) return;

  // Check for conflict
  if (table.status === 'occupied') {
    openConflictModal(res, tableId);
    return;
  }

  // Check party size vs table capacity
  if (res.covers && table.capacity && res.covers > table.capacity) {
    openPartyModal(res, tableId);
    return;
  }

  // Seat the guest
  const now = STATE.service.currentTime;
  table.status = 'occupied';
  table.covers = res.covers;
  table.seatedAt = now;
  table.guestName = res.guestName;
  table.turnoverDue = addMinutes(now, 120);
  table.minutesRemaining = 120;
  table.drinksOrderedAt = null;
  table.foodOrderedAt   = null;
  table.billPrintedAt   = null;
  table.courseStatus    = null;

  res.status = 'arrived';
  res.assignedTable = tableId;
  res.suggestedTable = null;

  // Walk-ins have no id — register them so they appear in the arrived list
  if (!res.id) {
    res.id = 'walkin-' + Date.now();
    STATE.reservations.push(res);
  }

  // Displace any upcoming reservations that were assigned to this table.
  // Find each one a new suggested table so they don't become stranded.
  STATE.reservations
    .filter(r => r.assignedTable === tableId && r.status === 'upcoming')
    .forEach(r => {
      r.assignedTable  = null;
      const next = suggestBestTable(r);
      r.suggestedTable = next ? next.tableId : null;
    });

  // Recalculate workload for the affected section
  calculateSectionWorkload(table.section);

  closeGuestProfile();
  renderAll();
}

// ------------------------------------------------------------
// INIT
// ------------------------------------------------------------

function initBookingListClick() {
  const scroll = document.getElementById('booking-list-scroll');
  if (!scroll) return;
  scroll.addEventListener('click', e => {
    const item = e.target.closest('.res-item[data-res-id]');
    if (!item) return;
    const res = STATE.reservations.find(r => r.id === item.dataset.resId);
    if (res) openGuestProfile(res);
  });
}

function initListTabs() {
  const tabBar = document.getElementById('tab-bar');
  if (!tabBar) return;
  tabBar.addEventListener('click', e => {
    const tab = e.target.closest('.tab-item:not(.tab-inactive)');
    if (!tab) return;
    tabBar.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderReservationList();
  });
}

// ------------------------------------------------------------
// DEMO RESET
// ------------------------------------------------------------

function allocateReservationsEvenly() {
  const tablesBySection = {};
  ['A', 'B', 'C', 'D', 'E'].forEach(sid => {
    tablesBySection[sid] = STATE.sections[sid].tables.map(id => STATE.tables[id]);
  });

  // Per-table allocation counter — ensures every table gets an even share
  const tableCounts = {};
  Object.keys(STATE.tables).forEach(id => { tableCounts[id] = 0; });

  // Per-section counter — used only for section-level balancing
  const sectionCounts = { A: 0, B: 0, C: 0, D: 0, E: 0 };

  STATE.reservations.forEach(res => {
    // Find sections that have at least one table fitting this party size
    const suitableSections = Object.keys(tablesBySection)
      .filter(sid => tablesBySection[sid].some(t => t.capacity >= res.covers));

    if (suitableSections.length === 0) return;

    // Pick the suitable section with the lowest reservation count so far
    const bestSection = suitableSections.reduce((best, sid) =>
      sectionCounts[sid] < sectionCounts[best] ? sid : best
    );

    // Within that section, pick the fitting table with fewest allocations so far
    const fittingTables = tablesBySection[bestSection]
      .filter(t => t.capacity >= res.covers);

    const assignedTable = fittingTables.reduce((best, t) =>
      tableCounts[t.id] < tableCounts[best.id] ? t : best
    );

    res.assignedTable  = assignedTable.id;
    res.suggestedTable = assignedTable.id;
    tableCounts[assignedTable.id]++;
    sectionCounts[bestSection]++;
  });
}

function resetDemo() {
  // 1. Reset service time
  STATE.service.currentTime = '12:00';

  // 2. Reset all tables
  Object.values(STATE.tables).forEach(t => {
    t.status          = 'empty';
    t.covers          = 0;
    t.seatedAt        = null;
    t.guestName       = null;
    t.turnoverDue     = null;
    t.minutesRemaining= null;
    t.courseStatus    = null;
    t.drinksOrderedAt = null;
    t.foodOrderedAt   = null;
    t.billPrintedAt   = null;
    t.overridden      = false;
  });

  // 3. Generate fresh reservations (all unassigned)
  STATE.reservations = generateFullReservations();

  // 4. Allocate every reservation to a table spread evenly across all sections
  allocateReservationsEvenly();

  // 5. Seat the first wave (time <= 12:30, up to 15 tables)
  const firstWave = STATE.reservations
    .filter(r => r.time <= '12:30' && r.assignedTable)
    .slice(0, 15);

  firstWave.forEach(res => {
    const table = STATE.tables[res.assignedTable];
    if (table && table.status === 'empty') {
      table.status          = 'occupied';
      table.covers          = res.covers;
      table.seatedAt        = res.time;
      table.guestName       = res.guestName;
      table.drinksOrderedAt = addMinutes(res.time, 7);
      table.foodOrderedAt   = addMinutes(res.time, 15);
      table.turnoverDue     = addMinutes(res.time, 120);
      table.minutesRemaining= timeToMinutes(table.turnoverDue) - timeToMinutes('12:00');
      table.courseStatus    = 'ordering';
      res.status            = 'arrived';
    }
  });

  // 6. Recalculate workloads for all sections
  Object.keys(STATE.sections).forEach(id => calculateSectionWorkload(id));

  // 7. Refresh UI
  hideTooltip();
  renderAll();

  // 8. Ensure simulation is running
  if (simulationIntervalId !== null) {
    clearInterval(simulationIntervalId);
    simulationIntervalId = null;
  }
  if (simulationRunning) {
    simulationIntervalId = setInterval(advanceTime, getSimInterval());
  }
  const toggleBtn = document.getElementById('btn-toggle-simulation');
  if (toggleBtn) {
    toggleBtn.innerHTML = simulationRunning ? ICON_PAUSE + 'Pause' : ICON_PLAY + 'Play';
    toggleBtn.title = simulationRunning ? 'Pause simulation' : 'Resume simulation';
  }
}

// ------------------------------------------------------------
// PAN + ZOOM
// ------------------------------------------------------------

function initPanZoom() {
  const svg = document.getElementById('floorplan');
  if (!svg) return;

  let viewBox = { x: -20, y: -20, width: 2620, height: 2600 };
  let isPanning = false;
  let panStart = { x: 0, y: 0 };
  let viewBoxStart = { x: 0, y: 0 };

  svg.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);

  function updateViewBox(newX, newY, newWidth, newHeight) {
    viewBox.x = newX;
    viewBox.y = newY;
    viewBox.width = newWidth;
    viewBox.height = newHeight;
    svg.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
  }

  svg.addEventListener('wheel', (e) => {
    e.preventDefault();
    const rect = svg.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const svgX = viewBox.x + (mouseX / rect.width) * viewBox.width;
    const svgY = viewBox.y + (mouseY / rect.height) * viewBox.height;
    const zoomFactor = e.deltaY < 0 ? 0.92 : 1.08;
    let newWidth = viewBox.width * zoomFactor;
    let newHeight = viewBox.height * zoomFactor;
    if (newWidth < 800) newWidth = 800;
    if (newWidth > 5000) newWidth = 5000;
    newHeight = newWidth * (viewBox.height / viewBox.width);
    const newX = svgX - (mouseX / rect.width) * newWidth;
    const newY = svgY - (mouseY / rect.height) * newHeight;
    updateViewBox(newX, newY, newWidth, newHeight);
  }, { passive: false });

  svg.addEventListener('mousedown', (e) => {
    if (e.target.closest('g[id^="_"]')) return;
    isPanning = true;
    panStart = { x: e.clientX, y: e.clientY };
    viewBoxStart = { x: viewBox.x, y: viewBox.y };
    svg.style.cursor = 'grabbing';
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isPanning) return;
    const dx = e.clientX - panStart.x;
    const dy = e.clientY - panStart.y;
    const rect = svg.getBoundingClientRect();
    const panX = (dx / rect.width) * viewBox.width;
    const panY = (dy / rect.height) * viewBox.height;
    updateViewBox(viewBoxStart.x - panX, viewBoxStart.y - panY, viewBox.width, viewBox.height);
  });

  window.addEventListener('mouseup', () => {
    if (isPanning) {
      isPanning = false;
      svg.style.cursor = 'grab';
    }
  });

  svg.style.cursor = 'grab';

  document.getElementById('btn-reset-view')?.addEventListener('click', () => {
    updateViewBox(-20, -20, 2620, 2600);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  startClock();
  renderTableNumberLabels(); // one-time static labels — must run before resetDemo
  initTableInteraction();
  initListTabs();
  initBookingListClick();
  initPanZoom();

  // Page load behaves exactly like pressing Reset
  resetDemo();

  // Guest modal — close
  document.getElementById('guest-modal-close')
    .addEventListener('click', closeGuestProfile);

  document.getElementById('guest-modal')
    .addEventListener('click', e => {
      if (e.target === document.getElementById('guest-modal')) {
        closeGuestProfile();
      }
    });

  // Section panel — collapse handlers
  document.getElementById('col-right')?.addEventListener('click', e => {
    // Section-level collapse (click on card header)
    const sectionHeader = e.target.closest('.section-card-header');
    if (sectionHeader) {
      const sid = sectionHeader.dataset.section;
      _sectionCollapsed[sid] = !_sectionCollapsed[sid];
      const card    = sectionHeader.closest('.section-card');
      const content = card?.querySelector('.section-collapsible-content');
      const chevron = sectionHeader.querySelector('.sc-section-chevron');
      const overlay = card?.querySelector('.sc-overload-overlay');
      if (content) content.classList.toggle('collapsed', _sectionCollapsed[sid]);
      if (chevron) chevron.textContent = _sectionCollapsed[sid] ? '▸' : '▾';
      if (overlay) overlay.classList.toggle('sc-overload-overlay--hidden', !_sectionCollapsed[sid]);
      return;
    }
    // Table list collapse (click on table list header)
    const tableHeader = e.target.closest('.sc-table-list-header');
    if (!tableHeader) return;
    const sid = tableHeader.dataset.section;
    _tableListCollapsed[sid] = !_tableListCollapsed[sid];
    const body    = document.getElementById(`table-list-${sid}`);
    const chevron = tableHeader.querySelector('.sc-table-list-chevron');
    if (body)    body.classList.toggle('collapsed', _tableListCollapsed[sid]);
    if (chevron) chevron.style.transform = _tableListCollapsed[sid] ? 'rotate(-90deg)' : '';
  });

  // Speed control buttons
  document.querySelectorAll('.speed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      simSpeed = parseInt(btn.dataset.speed, 10);
      document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('speed-btn--active'));
      btn.classList.add('speed-btn--active');
      if (simulationRunning && simulationIntervalId) {
        clearInterval(simulationIntervalId);
        simulationIntervalId = setInterval(advanceTime, getSimInterval());
      }
    });
  });

  // Pause / Play toggle
  document.getElementById('btn-toggle-simulation')?.addEventListener('click', () => {
    simulationRunning = !simulationRunning;
    const btn = document.getElementById('btn-toggle-simulation');
    if (simulationRunning) {
      btn.innerHTML = ICON_PAUSE + 'Pause';
      btn.title = 'Pause simulation';
      if (!simulationIntervalId) {
        simulationIntervalId = setInterval(advanceTime, getSimInterval());
      }
    } else {
      btn.innerHTML = ICON_PLAY + 'Play';
      btn.title = 'Resume simulation';
      if (simulationIntervalId) {
        clearInterval(simulationIntervalId);
        simulationIntervalId = null;
      }
    }
  });

  // Reset demo button
  document.getElementById('btn-reset-demo')?.addEventListener('click', () => {
    resetDemo();
  });

  // Conflict modal — close / cancel
  document.getElementById('conflict-modal-close')
    .addEventListener('click', closeConflictModal);
  document.getElementById('btn-conflict-cancel')
    .addEventListener('click', closeConflictModal);

  // Conflict modal — override (seat anyway)
  document.getElementById('btn-override').addEventListener('click', () => {
    if (_conflictRes && _conflictTableId) {
      const table = STATE.tables[_conflictTableId];
      if (table) {
        table.status = 'empty';
        table.covers = 0;
        table.seatedAt = null;
        table.guestName = null;
        table.minutesRemaining = null;
        table.turnoverDue = null;
      }
      const res = _conflictRes;
      const tableId = _conflictTableId;
      closeConflictModal();
      seatGuest(res, tableId);
    }
  });

  // Conflict modal — pick a different table
  document.getElementById('btn-pick-other').addEventListener('click', () => {
    const res = _conflictRes;
    closeConflictModal();
    if (res) openTablePicker(res);
  });

  // Party modal — close / cancel
  document.getElementById('party-modal-close')
    .addEventListener('click', closePartyModal);
  document.getElementById('btn-party-cancel')
    .addEventListener('click', closePartyModal);
  document.getElementById('party-modal')
    .addEventListener('click', e => {
      if (e.target === document.getElementById('party-modal')) closePartyModal();
    });

  // Party modal — choose a larger table
  document.getElementById('btn-party-larger').addEventListener('click', () => {
    const res = _partyRes;
    closePartyModal();
    if (res) openTablePicker(res, 'seat');
  });

  // Party modal — seat here anyway (ignore capacity)
  document.getElementById('btn-party-anyway').addEventListener('click', () => {
    const res = _partyRes;
    const tableId = _partyTableId;
    closePartyModal();
    if (res && tableId) {
      // Temporarily override capacity check by calling seat logic directly
      const table = STATE.tables[tableId];
      if (!table) return;
      const now = STATE.service.currentTime;
      table.status = 'occupied';
      table.covers = res.covers;
      table.seatedAt = now;
      table.guestName = res.guestName;
      table.turnoverDue = addMinutes(now, 120);
      table.minutesRemaining = 120;
      table.drinksOrderedAt = null;
      table.foodOrderedAt   = null;
      table.billPrintedAt   = null;
      table.courseStatus    = null;
      res.status = 'arrived';
      res.assignedTable = tableId;
      res.suggestedTable = null;
      if (!res.id) {
        res.id = 'walkin-' + Date.now();
        STATE.reservations.push(res);
      }
      STATE.reservations
        .filter(r => r.assignedTable === tableId && r.status === 'upcoming')
        .forEach(r => {
          r.assignedTable  = null;
          const next = suggestBestTable(r);
          r.suggestedTable = next ? next.tableId : null;
        });
      calculateSectionWorkload(table.section);
      closeGuestProfile();
      renderAll();
    }
  });

  // Table picker — close
  document.getElementById('table-picker-close')
    .addEventListener('click', closeTablePicker);

  // Suggest modal
  document.getElementById('suggest-modal-close')
    .addEventListener('click', closeSuggestModal);
  document.getElementById('suggest-modal')
    .addEventListener('click', e => {
      if (e.target === document.getElementById('suggest-modal')) closeSuggestModal();
    });
  document.getElementById('btn-suggest-seat').addEventListener('click', () => {
    const res = _suggestRes;
    const tableId = _suggestTableId;
    closeSuggestModal();
    if (res && tableId) seatGuest(res, tableId);
  });
  document.getElementById('btn-suggest-other').addEventListener('click', () => {
    const res = _suggestRes;
    closeSuggestModal();
    if (res) openTablePicker(res, 'seat');
  });
  document.getElementById('btn-suggest-cancel').addEventListener('click', closeSuggestModal);

  // Walk-in button (topbar)
  document.getElementById('btn-walkin')
    .addEventListener('click', openWalkInModal);

  // Walk-in modal
  document.getElementById('walkin-close')
    .addEventListener('click', closeWalkInModal);
  document.getElementById('walkin-modal')
    .addEventListener('click', e => {
      if (e.target === document.getElementById('walkin-modal')) closeWalkInModal();
    });

  // Table options modal
  document.getElementById('table-options-close')
    .addEventListener('click', closeTableOptionsModal);
  document.getElementById('table-options-modal')
    .addEventListener('click', e => {
      if (e.target === document.getElementById('table-options-modal')) closeTableOptionsModal();
    });

  // Collapse handles
  document.getElementById('collapse-left').addEventListener('click', () => {
    document.getElementById('col-left').classList.toggle('collapsed');
  });

  document.getElementById('collapse-right').addEventListener('click', () => {
    document.getElementById('col-right').classList.toggle('collapsed');
  });

  // ── Guided Tour ──────────────────────────────────────────────
  let _tourStep            = 0;
  let _tourTarget          = null;
  let _tourSaved           = {};   // scratch space for per-step saved state
  let _tourWasRunning      = false; // simulation state before tour started

  const tourPopup   = document.getElementById('tour-popup');
  const tourOverlay = document.getElementById('tour-overlay');
  const tourBody    = document.getElementById('tour-popup-body');
  const tourCounter = document.getElementById('tour-step-counter');
  const tourPrev    = document.getElementById('tour-prev');
  const tourNext    = document.getElementById('tour-next');
  const tourExit    = document.getElementById('tour-exit');
  const tourArrow   = document.getElementById('tour-arrow');
  const tourBtn     = document.getElementById('btn-start-tour');

  // Each step: selector, message, optional onEnter(saved) / onExit(saved)
  const TOUR_STEPS = [
    {
      selector: '#topbar',
      message: '<strong>Welcome to the guided tour.</strong> This demo visualises <strong>temporal workload</strong> - not just how many tables are full, but where pressure is building due to task convergence. The interface helps you <strong>anticipate</strong>, not just react. Use the controls here to Pause, change speed, Reset, or start this tour again.',
    },
    {
      selector: '#col-right .section-card[data-section="A"]',
      message: 'The <strong>red glow</strong> around a section signals overload (workload over 70%). Workload is calculated from active tables in the ordering phase, large tables, and outstanding bills. The intensity grows with pressure - so you can see <em>where effort is concentrated</em>, not just how full the room is.',
      onEnter(saved) {
        const sec = STATE.sections['A'];
        // Save and force section metadata
        saved.workload         = sec.workload;
        saved.isRed            = sec.isRed;
        saved.activeCount      = sec.activeCount;
        saved.billCount        = sec.billCount;
        saved.largeTableActive = sec.largeTableActive;
        sec.workload           = 85;
        sec.isRed              = true;
        sec.activeCount        = 3;
        sec.billCount          = 1;
        sec.largeTableActive   = false;

        // Also lift the floor plan above the overlay so the red glow is visible
        const floor = document.getElementById('col-centre');
        if (floor) floor.classList.add('tour-above-overlay');

        // Also force a real table into "drinks ordered, food pending" so
        // getNextRelief() finds a prospect and shows a time instead of "no relief"
        const t = sec.tables.map(id => STATE.tables[id]).find(t => t.status !== 'occupied');
        if (t) {
          saved.reliefTableId      = t.id;
          saved.reliefStatus       = t.status;
          saved.reliefCovers       = t.covers;
          saved.reliefSeatedAt     = t.seatedAt;
          saved.reliefDrinksAt     = t.drinksOrderedAt;
          saved.reliefFoodAt       = t.foodOrderedAt;
          saved.reliefGuestName    = t.guestName;
          t.status                 = 'occupied';
          t.covers                 = 3;
          t.guestName              = 'Demo Guest';
          t.seatedAt               = addMinutes(STATE.service.currentTime, -8);
          t.drinksOrderedAt        = addMinutes(STATE.service.currentTime, -4);
          t.foodOrderedAt          = null;
          t.billPrintedAt          = null;
          t.turnoverDue            = addMinutes(STATE.service.currentTime, 112);
          t.minutesRemaining       = 112;
        }

        renderWorkloadGlows();
        renderSectionPanel();
        renderForecastWidget();
      },
      onExit(saved) {
        const sec = STATE.sections['A'];
        sec.workload         = saved.workload;
        sec.isRed            = saved.isRed;
        sec.activeCount      = saved.activeCount;
        sec.billCount        = saved.billCount;
        sec.largeTableActive = saved.largeTableActive;

        if (saved.reliefTableId) {
          const t = STATE.tables[saved.reliefTableId];
          if (t) {
            t.status          = saved.reliefStatus;
            t.covers          = saved.reliefCovers;
            t.seatedAt        = saved.reliefSeatedAt;
            t.drinksOrderedAt = saved.reliefDrinksAt;
            t.foodOrderedAt   = saved.reliefFoodAt;
            t.guestName       = saved.reliefGuestName;
          }
        }

        // Remove floor plan lift
        const floor = document.getElementById('col-centre');
        if (floor) floor.classList.remove('tour-above-overlay');

        renderWorkloadGlows();
        renderSectionPanel();
        renderForecastWidget();
      },
    },
    {
      selector: '.hourglass',
      fallback: 'No tables near turnover right now. The <strong>hourglass</strong> appears when a table has 20 minutes or less remaining. It turns urgent at 5 minutes. This gives you <strong>foresight</strong> - you can plan the next seating before the table actually frees up.',
      message: 'This <strong>hourglass</strong> marks a table with less than 20 minutes remaining. It turns urgent at 5 minutes. Rather than waiting for guests to leave, you already know this table is freeing up - so you can line up the next seating in advance.',
      onEnter(saved) {
        const t = Object.values(STATE.tables).find(t => t.status === 'occupied');
        if (!t) return;
        saved.tableId           = t.id;
        saved.minutesRemaining  = t.minutesRemaining;
        saved.turnoverDue       = t.turnoverDue;
        t.minutesRemaining      = 8;
        t.turnoverDue           = addMinutes(STATE.service.currentTime, 8);
        renderHourglassIndicators();

        // Place a ghost hourglass above the tour overlay at the same screen position
        requestAnimationFrame(() => {
          const hg = document.querySelector('.hourglass');
          if (!hg) return;
          const rect = hg.getBoundingClientRect();
          const ghost = document.createElement('div');
          ghost.id = 'tour-hourglass-ghost';
          ghost.textContent = '⏳';
          ghost.style.cssText = [
            'position:fixed',
            'z-index:91',
            'pointer-events:none',
            'left:' + (rect.left + rect.width  / 2) + 'px',
            'top:'  + (rect.top  + rect.height / 2) + 'px',
            'transform:translate(-50%,-50%)',
            'font-size:' + Math.max(rect.height, 24) + 'px',
            'line-height:1',
            'filter:drop-shadow(0 0 8px rgba(255,210,80,0.9))',
          ].join(';');
          document.body.appendChild(ghost);
        });
      },
      onExit(saved) {
        const ghost = document.getElementById('tour-hourglass-ghost');
        if (ghost) ghost.remove();
        if (!saved.tableId) return;
        const t = STATE.tables[saved.tableId];
        if (!t) return;
        t.minutesRemaining = saved.minutesRemaining;
        t.turnoverDue      = saved.turnoverDue;
        renderHourglassIndicators();
      },
    },
    {
      selector: '.fc-canvas',
      message: 'The <strong>forecast chart</strong> projects workload for the next 20 minutes. The cyan area shows the trend; the red overlay highlights values above 60%. Use this to decide whether seating a large party now will create a pressure spike shortly after.',
      onEnter(saved) {
        saved.collapsed = Object.assign({}, _sectionCollapsed);
        _sectionCollapsed['A'] = false;
        renderSectionPanel();
        renderForecastWidget();
      },
      onExit(saved) {
        Object.assign(_sectionCollapsed, saved.collapsed);
        renderSectionPanel();
        renderForecastWidget();
      },
    },
    {
      selector: '.sc-attention',
      fallback: 'No attention rows at the moment. They appear when a table has been seated for a while without ordering, or has an overdue bill. This list lets you <strong>prioritise</strong> where to direct your team without scanning the whole floor.',
      message: '<strong>Tables Requiring Attention</strong> surfaces the tables that need service most urgently - waiting to order, large parties, or overdue bills. Rather than scanning the whole floor, this list tells you exactly where to go first.',
      onEnter(saved) {
        const sec = STATE.sections['A'];
        _sectionCollapsed['A'] = false;
        const t = sec.tables.map(id => STATE.tables[id]).find(t => t.status === 'occupied');
        if (t) {
          saved.tableId        = t.id;
          saved.seatedAt       = t.seatedAt;
          saved.drinksOrderedAt = t.drinksOrderedAt;
          saved.foodOrderedAt  = t.foodOrderedAt;
          t.seatedAt           = addMinutes(STATE.service.currentTime, -16);
          t.drinksOrderedAt    = addMinutes(STATE.service.currentTime, -10);
          t.foodOrderedAt      = null;
        }
        calculateSectionWorkload('A');
        renderSectionPanel();
        renderForecastWidget();
      },
      onExit(saved) {
        if (saved.tableId) {
          const t = STATE.tables[saved.tableId];
          if (t) {
            t.seatedAt        = saved.seatedAt;
            t.drinksOrderedAt = saved.drinksOrderedAt;
            t.foodOrderedAt   = saved.foodOrderedAt;
          }
        }
        calculateSectionWorkload('A');
        renderSectionPanel();
        renderForecastWidget();
      },
    },
    {
      selector: '.table-time-label',
      fallback: 'Time labels appear directly on the floor plan. Cyan = how long a guest has been seated. White or grey = when the next reservation arrives. You get an instant read of table flow without clicking anything.',
      message: 'Time badges appear directly on tables on the floor plan. <strong>Cyan</strong> shows how long a guest has been seated. <strong>White or grey</strong> shows when the next reservation is due. You get an instant read of flow without having to click anything.',
    },
    {
      selector: '#col-left',
      message: 'The <strong>left panel</strong> organises reservations into Arrived and Upcoming. Click any booking to open a guest profile - from there you can Seat Now, Assign a specific Table, Move Table, or mark No Show. The system always suggests the best available table automatically.',
    },
    {
      selector: '#btn-walkin',
      message: 'The floating <strong>Walk-in</strong> button adds spontaneous guests instantly. Choose the cover count and the system suggests the best table based on capacity and current section workload - keeping the load balanced across the floor.',
    },
    {
      selector: '#topbar',
      message: 'Tour complete. The core idea: make workload <strong>visible</strong>, anticipate turnover, and support informed decisions. The system does not replace your judgement - it surfaces the signals that help you act faster and more confidently. Click <strong>Finish</strong> to close the tour.',
    },
  ];

  function tourClearHighlight() {
    if (_tourTarget) {
      _tourTarget.classList.remove('tour-highlight');
      _tourTarget = null;
    }
  }

  function tourRunExit(idx) {
    const step = TOUR_STEPS[idx];
    if (step && step.onExit) {
      try { step.onExit(_tourSaved); } catch(e) {}
    }
    _tourSaved = {};
  }

  function tourPosition(el) {
    const pad = 16;
    const pw  = 360;
    const ph  = tourPopup.offsetHeight || 200;
    const rect = el.getBoundingClientRect();
    const vw   = window.innerWidth;
    const vh   = window.innerHeight;

    let top, left, arrowSide;

    if (rect.bottom + ph + pad < vh) {
      top = rect.bottom + pad; left = rect.left + rect.width / 2 - pw / 2; arrowSide = 'top';
    } else if (rect.top - ph - pad > 0) {
      top = rect.top - ph - pad; left = rect.left + rect.width / 2 - pw / 2; arrowSide = 'bottom';
    } else {
      top = rect.top + rect.height / 2 - ph / 2; left = rect.right + pad; arrowSide = 'left';
    }

    left = Math.max(pad, Math.min(left, vw - pw - pad));
    top  = Math.max(pad, Math.min(top,  vh - ph - pad));

    tourPopup.style.top    = top  + 'px';
    tourPopup.style.left   = left + 'px';
    tourPopup.style.transform = '';

    // Arrow
    const sides = { top: 'auto', left: 'auto', bottom: 'auto', right: 'auto' };
    tourArrow.style.cssText = '';
    if (arrowSide === 'top') {
      let ax = rect.left + rect.width / 2 - left - 6;
      ax = Math.max(12, Math.min(ax, pw - 24));
      tourArrow.style.top    = '-7px';
      tourArrow.style.left   = ax + 'px';
      tourArrow.style.borderBottomColor = 'transparent';
      tourArrow.style.borderRightColor  = 'transparent';
    } else if (arrowSide === 'bottom') {
      let ax = rect.left + rect.width / 2 - left - 6;
      ax = Math.max(12, Math.min(ax, pw - 24));
      tourArrow.style.bottom = '-7px';
      tourArrow.style.left   = ax + 'px';
      tourArrow.style.borderTopColor  = 'transparent';
      tourArrow.style.borderLeftColor = 'transparent';
    } else {
      tourArrow.style.top  = (ph / 2 - 6) + 'px';
      tourArrow.style.left = '-7px';
      tourArrow.style.borderTopColor   = 'transparent';
      tourArrow.style.borderRightColor = 'transparent';
    }
  }

  function tourShowStep(idx) {
    tourClearHighlight();
    const step  = TOUR_STEPS[idx];
    const total = TOUR_STEPS.length;

    tourCounter.textContent = 'Step ' + (idx + 1) + ' of ' + total;
    tourPrev.disabled       = idx === 0;
    tourNext.textContent    = idx === total - 1 ? 'Finish' : 'Next';

    _tourSaved = {};
    if (step.onEnter) { try { step.onEnter(_tourSaved); } catch(e) {} }

    const el = document.querySelector(step.selector);
    tourBody.innerHTML = el ? step.message : (step.fallback || step.message);

    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      el.classList.add('tour-highlight');
      _tourTarget = el;
      tourArrow.style.display = '';
      requestAnimationFrame(() => requestAnimationFrame(() => tourPosition(el)));
    } else {
      tourPopup.style.top    = '50%';
      tourPopup.style.left   = '50%';
      tourPopup.style.transform = 'translate(-50%,-50%)';
      tourArrow.style.display = 'none';
    }
  }

  function tourPauseSimulation() {
    _tourWasRunning = simulationRunning;
    if (simulationRunning) {
      simulationRunning = false;
      if (simulationIntervalId) { clearInterval(simulationIntervalId); simulationIntervalId = null; }
      const btn = document.getElementById('btn-toggle-simulation');
      if (btn) { btn.innerHTML = ICON_PLAY + 'Play'; btn.title = 'Resume simulation'; }
    }
  }

  function tourRestoreSimulation() {
    if (_tourWasRunning) {
      simulationRunning = true;
      if (!simulationIntervalId) simulationIntervalId = setInterval(advanceTime, getSimInterval());
      const btn = document.getElementById('btn-toggle-simulation');
      if (btn) { btn.innerHTML = ICON_PAUSE + 'Pause'; btn.title = 'Pause simulation'; }
    }
  }

  function tourStart() {
    _tourStep        = 0;
    tourBtn.disabled = true;
    tourPauseSimulation();
    tourOverlay.classList.remove('tour-hidden');
    tourPopup.classList.remove('tour-hidden');
    tourShowStep(0);
  }

  function tourStop() {
    tourRunExit(_tourStep);
    tourClearHighlight();
    tourPopup.classList.add('tour-hidden');
    tourOverlay.classList.add('tour-hidden');
    tourBtn.disabled = false;
    tourRestoreSimulation();
  }

  tourBtn?.addEventListener('click', tourStart);
  tourExit?.addEventListener('click', tourStop);
  tourNext?.addEventListener('click', () => {
    tourRunExit(_tourStep);
    if (_tourStep < TOUR_STEPS.length - 1) {
      _tourStep++;
      tourShowStep(_tourStep);
    } else {
      tourStop();
    }
  });
  tourPrev?.addEventListener('click', () => {
    if (_tourStep > 0) {
      tourRunExit(_tourStep);
      _tourStep--;
      tourShowStep(_tourStep);
    }
  });

  // Escape key — close whichever modal is open
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!document.getElementById('guest-modal').classList.contains('modal-hidden'))         { closeGuestProfile();        return; }
    if (!document.getElementById('conflict-modal').classList.contains('modal-hidden'))       { closeConflictModal();       return; }
    if (!document.getElementById('party-modal').classList.contains('modal-hidden'))          { closePartyModal();          return; }
    if (!document.getElementById('table-picker-modal').classList.contains('modal-hidden'))   { closeTablePicker();         return; }
    if (!document.getElementById('walkin-modal').classList.contains('modal-hidden'))         { closeWalkInModal();         return; }
    if (!document.getElementById('table-options-modal').classList.contains('modal-hidden'))  { closeTableOptionsModal();   return; }
    if (!document.getElementById('suggest-modal').classList.contains('modal-hidden'))        { closeSuggestModal();        return; }
    if (!document.getElementById('tour-popup').classList.contains('tour-hidden'))            { tourStop();                 return; }
  });

  // Accordion toggle
  document.querySelectorAll('.booking-section-header[data-section]').forEach(header => {
    header.addEventListener('click', () => {
      const section = header.dataset.section;
      const body    = document.getElementById('list-' + section);
      const chevron = header.querySelector('.booking-section-chevron');
      if (body) {
        body.classList.toggle('collapsed');
        chevron.textContent = body.classList.contains('collapsed') ? '▸' : '▾';
      }
    });
  });

});
