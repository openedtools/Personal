// ============================================================
// Desert Turkey 2026 — App Logic
// Backend: Firebase Firestore (real-time, shared across devices)
// Data model:
//   campers:          [{ id, name, adults, kids, setup, arrival, departure, note }]
//   siteReservations: [{ id, reservedBy, sites:[{ siteNum, usedBy }], arrival, departure, note }]
//   potluck:          [{ id, name, dish, category, note }]
//   tshirts:          [{ id, name, size, qty, note }]
// ============================================================

// ── Password gate ────────────────────────────────────────────
const TRIP_PASS = '2026';

function isAuthenticated() {
  return sessionStorage.getItem('dt2026_auth') === '1';
}

function submitPassword() {
  const input = document.getElementById('pwInput');
  const error = document.getElementById('pwError');
  if (input.value === TRIP_PASS) {
    sessionStorage.setItem('dt2026_auth', '1');
    document.getElementById('pwOverlay').classList.add('hidden');
    initFirestore();
  } else {
    error.textContent = 'Incorrect password — try again.';
    input.value = '';
    input.focus();
  }
}

// ── Tab switching ─────────────────────────────────────────────
const TAB_LABELS = {
  welcome: 'Welcome', sites: 'Sites', campers: 'Campers', gear: 'Gear',
  itinerary: 'Itinerary', trails: 'Trails', info: 'Info',
  potluck: 'Potluck', tshirts: 'T-Shirts',
};

function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  document.querySelectorAll('.mobile-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === 'tab-' + tabId);
  });
  const label = document.getElementById('currentTabLabel');
  if (label) label.textContent = TAB_LABELS[tabId] || tabId;

  window.scrollTo({ top: 0 });
}

function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });
  const hash = location.hash.replace('#', '');
  if (hash) switchTab(hash);
}

function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const menu      = document.getElementById('mobileMenu');
  const backdrop  = document.getElementById('menuBackdrop');

  function openMenu() {
    hamburger.classList.add('open');
    menu.classList.add('open');
    backdrop.classList.add('open');
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    menu.classList.remove('open');
    backdrop.classList.remove('open');
  }

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeMenu() : openMenu();
  });

  backdrop.addEventListener('click', closeMenu);

  document.querySelectorAll('.mobile-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.dataset.tab);
      closeMenu();
    });
  });
}

// ── Trip day grid ────────────────────────────────────────────
// Columns Sun Nov 22 → Sat Nov 28 (7 days inclusive)
const TRIP_DAYS = [
  { iso: '2026-11-22', dow: 'Sun', day: 22 },
  { iso: '2026-11-23', dow: 'Mon', day: 23 },
  { iso: '2026-11-24', dow: 'Tue', day: 24 },
  { iso: '2026-11-25', dow: 'Wed', day: 25 },
  { iso: '2026-11-26', dow: 'Thu', day: 26 },
  { iso: '2026-11-27', dow: 'Fri', day: 27 },
  { iso: '2026-11-28', dow: 'Sat', day: 28 },
];

function dayIndex(iso) {
  if (!iso) return -1;
  return TRIP_DAYS.findIndex(d => d.iso === iso);
}

// ── State ────────────────────────────────────────────────────
let state = {
  campers:          [],
  siteReservations: [],
  potluck:          [],
  tshirts:          [],
  activeGearCat:    'all',
  loaded:           false,
};

// ── Firestore sync ───────────────────────────────────────────
function syncToFirestore() {
  return TRIP_DOC.set({
    campers:          state.campers,
    siteReservations: state.siteReservations,
    potluck:          state.potluck,
    tshirts:          state.tshirts,
  });
}

function initFirestore() {
  setSyncStatus('connecting');

  TRIP_DOC.onSnapshot(
    snap => {
      setSyncStatus('live');
      if (snap.exists) {
        const data = snap.data();
        // Migrate legacy `attendees` → `campers` on read if needed
        state.campers          = data.campers          || migrateAttendees(data.attendees) || [];
        state.siteReservations = data.siteReservations || [];
        state.potluck          = data.potluck          || [];
        state.tshirts          = data.tshirts          || [];
      } else {
        state.campers          = [];
        state.siteReservations = [];
        state.potluck          = [];
        state.tshirts          = [];
        syncToFirestore();
      }
      state.loaded = true;
      renderAll();
    },
    err => {
      setSyncStatus('error');
      console.error('Firestore error:', err);
    }
  );
}

function migrateAttendees(attendees) {
  if (!Array.isArray(attendees) || attendees.length === 0) return null;
  return attendees.map(a => ({
    id:        a.id || uid(),
    name:      a.name || '',
    adults:    1,
    kids:      0,
    setup:     'Tent',
    arrival:   a.arrival   || '2026-11-25',
    departure: a.departure || '2026-11-28',
    note:      a.note      || '',
  }));
}

function setSyncStatus(status) {
  const dot   = document.getElementById('syncDot');
  const label = document.getElementById('syncLabel');
  if (!dot || !label) return;
  dot.className = 'sync-dot sync-' + status;
  label.textContent = { live: 'Live', connecting: 'connecting…', error: 'offline' }[status] || status;
}

// ── Full re-render ────────────────────────────────────────────
function renderAll() {
  renderGantt();
  renderCampers();
  renderReservations();
  renderPotluck();
  renderTshirts();
}

// ── Countdown ────────────────────────────────────────────────
function renderCountdown() {
  const target = new Date('2026-11-22T12:00:00');
  const diff   = target - new Date();
  const el     = document.getElementById('countdown');
  if (!el) return;

  if (diff <= 0) {
    el.innerHTML = '<span style="color:var(--terracotta);font-family:\'Playfair Display\',serif;font-size:1.1rem;letter-spacing:0.05em">We\'re there! 🏕️</span>';
    return;
  }

  const days    = Math.floor(diff / 86400000);
  const hours   = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000)  / 60000);
  const seconds = Math.floor((diff % 60000)    / 1000);

  const unit = (num, lbl) => `
    <div class="countdown-unit">
      <span class="countdown-num">${String(num).padStart(2,'0')}</span>
      <span class="countdown-label">${lbl}</span>
    </div>`;

  el.innerHTML = unit(days,'Days') + unit(hours,'Hrs') + unit(minutes,'Min') + unit(seconds,'Sec');
}

// ── Welcome Gantt timeline ────────────────────────────────────
function renderGantt() {
  const el = document.getElementById('gantt');
  if (!el) return;

  const cols = TRIP_DAYS.length;
  const headerCells = TRIP_DAYS.map(d => `
    <div class="gantt-day-head">
      <div class="gantt-dow">${d.dow}</div>
      <div class="gantt-date">Nov ${d.day}</div>
    </div>`).join('');

  let rows = '';
  if (state.campers.length === 0) {
    rows = `<div class="gantt-empty">No campers yet — add yourself on the Campers tab.</div>`;
  } else {
    rows = state.campers.map((c, i) => {
      const color  = AVATAR_COLORS[i % AVATAR_COLORS.length];
      let aIdx = dayIndex(c.arrival);
      let dIdx = dayIndex(c.departure);
      // Clamp to trip range
      if (aIdx < 0) aIdx = 0;
      if (dIdx < 0) dIdx = cols - 1;
      if (dIdx < aIdx) dIdx = aIdx;

      // Bar spans nights between arrival and departure days
      const startPct = (aIdx / cols) * 100;
      const widthPct = Math.max(((dIdx - aIdx + 1) / cols) * 100, 100 / cols);

      const headcount = (Number(c.adults) || 0) + (Number(c.kids) || 0);
      const peopleStr = headcount > 1 ? ` · ${headcount}` : '';
      const setup = c.setup || '';

      return `
        <div class="gantt-row">
          <div class="gantt-label">
            <span class="gantt-swatch" style="background:${color}"></span>
            <div class="gantt-label-text">
              <div class="gantt-name">${esc(c.name)}${peopleStr ? `<span class="gantt-headcount">${peopleStr}</span>` : ''}</div>
              <div class="gantt-setup">${esc(setup)}</div>
            </div>
          </div>
          <div class="gantt-track">
            ${TRIP_DAYS.map(() => `<div class="gantt-cell"></div>`).join('')}
            <div class="gantt-bar" style="left:${startPct}%;width:${widthPct}%;background:${color}" title="${esc(c.name)} · ${fmtDate(c.arrival)} → ${fmtDate(c.departure)}">
              <span class="gantt-bar-text">${esc(c.name)}</span>
            </div>
          </div>
        </div>`;
    }).join('');
  }

  el.innerHTML = `
    <div class="gantt-header">
      <div class="gantt-label gantt-label-head">Camper</div>
      <div class="gantt-track gantt-track-head">${headerCells}</div>
    </div>
    <div class="gantt-body">${rows}</div>
  `;
}

// ── Campers ──────────────────────────────────────────────────
function renderCampers() {
  const grid = document.getElementById('campersGrid');
  if (!grid) return;

  if (state.campers.length === 0) {
    grid.innerHTML = '<div class="empty-state">No campers yet — be the first to add yourself!</div>';
    return;
  }

  grid.innerHTML = state.campers.map((c, i) => {
    const color   = AVATAR_COLORS[i % AVATAR_COLORS.length];
    const initial = (c.name || '?')[0].toUpperCase();
    const adults  = Number(c.adults) || 0;
    const kids    = Number(c.kids)   || 0;
    const head    = adults + kids;
    const dates   = (c.arrival && c.departure)
      ? `<div class="camper-dates">${fmtDate(c.arrival)} → ${fmtDate(c.departure)}</div>` : '';
    const note    = c.note ? `<div class="camper-note">"${esc(c.note)}"</div>` : '';
    const kidsTxt = kids > 0 ? ` · ${kids} ${kids === 1 ? 'kid' : 'kids'}` : '';

    return `
      <div class="camper-card">
        <button class="camper-delete" onclick="deleteCamper('${esc(c.id)}')" title="Remove">✕</button>
        <div class="camper-head">
          <div class="camper-avatar" style="background:${color}">${initial}</div>
          <div class="camper-head-text">
            <div class="camper-name">${esc(c.name)}</div>
            <div class="camper-meta">
              <span class="camper-setup-pill">${esc(c.setup || 'Tent')}</span>
              <span class="camper-people">${head} ${head === 1 ? 'person' : 'people'}${kidsTxt && adults > 0 ? ` (${adults} adult${adults===1?'':'s'}${kidsTxt})` : ''}</span>
            </div>
          </div>
        </div>
        ${dates}${note}
      </div>
    `;
  }).join('');
}

function deleteCamper(camperId) {
  const camper = state.campers.find(c => c.id === camperId);
  if (!camper) return;
  if (!confirm(`Remove ${camper.name} from the trip?`)) return;
  state.campers = state.campers.filter(c => c.id !== camperId);
  syncToFirestore();
}

// ── Site Reservations ────────────────────────────────────────
function renderReservations() {
  const wrap = document.getElementById('reservationsList');
  if (!wrap) return;

  if (state.siteReservations.length === 0) {
    wrap.innerHTML = '<div class="empty-state">No reservations yet — add one above.</div>';
    return;
  }

  wrap.innerHTML = state.siteReservations.map(r => {
    const dates = (r.arrival && r.departure)
      ? `${fmtDate(r.arrival)} → ${fmtDate(r.departure)}` : 'Dates not set';
    const note  = r.note ? `<div class="res-note">"${esc(r.note)}"</div>` : '';

    const siteRows = (r.sites || []).map(s => {
      const empty = !((s.usedBy || '').trim());
      return `
        <div class="res-site-row${empty ? ' res-site-empty' : ''}">
          <div class="res-site-num">Site ${esc(s.siteNum)}</div>
          <input class="res-site-input" type="text" placeholder="open · click to assign"
                 value="${esc(s.usedBy || '')}" maxlength="40"
                 onchange="updateSiteUser('${esc(r.id)}','${esc(s.siteNum)}', this.value)" />
        </div>`;
    }).join('');

    return `
      <div class="res-card">
        <div class="res-card-head">
          <div>
            <div class="res-owner">${esc(r.reservedBy || 'Unknown')}</div>
            <div class="res-dates">${dates} · ${(r.sites || []).length} site${(r.sites||[]).length === 1 ? '' : 's'}</div>
          </div>
          <button class="res-delete" onclick="deleteReservation('${esc(r.id)}')" title="Delete reservation">✕</button>
        </div>
        ${note}
        <div class="res-sites">${siteRows || '<div class="res-empty">No sites on this reservation.</div>'}</div>
      </div>`;
  }).join('');
}

function updateSiteUser(resId, siteNum, value) {
  const res = state.siteReservations.find(r => r.id === resId);
  if (!res) return;
  const site = (res.sites || []).find(s => s.siteNum === siteNum);
  if (!site) return;
  site.usedBy = value.trim();
  syncToFirestore();
}

function deleteReservation(resId) {
  const res = state.siteReservations.find(r => r.id === resId);
  if (!res) return;
  if (!confirm(`Delete ${res.reservedBy || 'this'} reservation?`)) return;
  state.siteReservations = state.siteReservations.filter(r => r.id !== resId);
  syncToFirestore();
}

// Parse "4, 5, 6-9, 12" → ["4","5","6","7","8","9","12"]
function parseSiteNumbers(raw) {
  if (!raw) return [];
  const out = [];
  const seen = new Set();
  raw.split(/[,\s]+/).forEach(tok => {
    tok = tok.trim();
    if (!tok) return;
    const m = tok.match(/^(\d+)\s*-\s*(\d+)$/);
    if (m) {
      const a = parseInt(m[1], 10);
      const b = parseInt(m[2], 10);
      if (Number.isFinite(a) && Number.isFinite(b) && b >= a && (b - a) < 60) {
        for (let n = a; n <= b; n++) {
          const s = String(n);
          if (!seen.has(s)) { seen.add(s); out.push(s); }
        }
      }
    } else if (/^\d+$/.test(tok)) {
      if (!seen.has(tok)) { seen.add(tok); out.push(tok); }
    }
  });
  return out;
}

// ── Gear (static packing list) ────────────────────────────────
function renderGearCategories() {
  const container = document.getElementById('gearCategories');
  if (!container) return;
  container.innerHTML = GEAR_CATEGORIES.map(c => `
    <button class="cat-btn ${state.activeGearCat === c.id ? 'active' : ''}"
            onclick="setGearCat('${c.id}')">${c.label}</button>
  `).join('');
}

function setGearCat(cat) {
  state.activeGearCat = cat;
  renderGearCategories();
  renderGearList();
}

function renderGearList() {
  const list = document.getElementById('gearList');
  if (!list) return;

  const filtered = state.activeGearCat === 'all'
    ? DEFAULT_GEAR
    : DEFAULT_GEAR.filter(g => g.category === state.activeGearCat);

  list.innerHTML = filtered.map(g => {
    const cat = GEAR_CATEGORIES.find(c => c.id === g.category) || { label: g.category };
    return `
      <div class="gear-item">
        <span class="gear-item-bullet">·</span>
        <span class="gear-item-name">${esc(g.name)}</span>
        <span class="gear-item-cat">${cat.label}</span>
      </div>
    `;
  }).join('');
}

// ── Itinerary ────────────────────────────────────────────────
function renderItinerary() {
  const el = document.getElementById('itineraryTimeline');
  if (!el) return;
  if (ITINERARY.length === 0) {
    el.innerHTML = `<div class="itinerary-tbd">TBD — itinerary coming together. Check back closer to the trip.</div>`;
    return;
  }
  el.innerHTML = ITINERARY.map(day => `
    <div class="itinerary-day">
      <div class="day-marker">
        <div class="day-dot"></div>
        <div class="day-num">${esc(day.day)}</div>
      </div>
      <div class="day-content">
        <div class="day-date">${esc(day.date)}</div>
        <div class="day-title">${esc(day.title)}</div>
        <ul class="day-activities">
          ${day.activities.map(a => `<li>${esc(a)}</li>`).join('')}
        </ul>
      </div>
    </div>
  `).join('');
}

// ── Trails ───────────────────────────────────────────────────
function renderTrails() {
  const grid = document.getElementById('trailsGrid');
  if (!grid) return;
  grid.innerHTML = TRAILS.map(t => `
    <div class="trail-card">
      <span class="trail-difficulty difficulty-${t.difficulty}">${t.difficulty}</span>
      <div class="trail-name">${esc(t.name)}</div>
      <div class="trail-stats">
        <span class="trail-stat"><span>Distance</span>${esc(t.distance)}</span>
        <span class="trail-stat"><span>Time</span>${esc(t.time)}</span>
        <span class="trail-stat"><span>Gain</span>${esc(t.elevation)}</span>
      </div>
      <div class="trail-desc">${esc(t.desc)}</div>
    </div>
  `).join('');
}

// ── Info cards ───────────────────────────────────────────────
function renderInfo() {
  const grid = document.getElementById('infoGrid');
  if (!grid) return;
  grid.innerHTML = INFO_CARDS.map(card => `
    <div class="info-card">
      <span class="info-icon">${card.icon}</span>
      <div class="info-title">${esc(card.title)}</div>
      <ul class="info-items">
        ${card.items.map(item => `<li>${esc(item)}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

// ── Potluck ───────────────────────────────────────────────────
const POTLUCK_CAT_LABELS = {
  main: 'Main Course', side: 'Side Dish', appetizer: 'Appetizer',
  dessert: 'Dessert', drinks: 'Drinks', snacks: 'Snacks', other: 'Other',
};

function renderPotluck() {
  const tbody = document.getElementById('potluckBody');
  if (!tbody) return;

  if (state.potluck.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="table-empty">No sign-ups yet — be the first!</td></tr>';
    return;
  }

  tbody.innerHTML = state.potluck.map(p => `
    <tr>
      <td><strong>${esc(p.name)}</strong></td>
      <td>${esc(p.dish)}</td>
      <td><span class="potluck-badge cat-${esc(p.category)}">${esc(POTLUCK_CAT_LABELS[p.category] || p.category)}</span></td>
      <td style="color:var(--muted);font-style:italic">${esc(p.note)}</td>
      <td><button class="table-delete" onclick="deletePotluck('${esc(p.id)}')" title="Remove">✕</button></td>
    </tr>
  `).join('');
}

function deletePotluck(id) {
  const entry = state.potluck.find(p => p.id === id);
  if (!entry) return;
  if (!confirm(`Remove ${entry.name}'s entry from the potluck?`)) return;
  state.potluck = state.potluck.filter(p => p.id !== id);
  syncToFirestore();
}

// ── T-shirts ──────────────────────────────────────────────────
function renderTshirts() {
  const tbody = document.getElementById('tshirtBody');
  if (!tbody) return;

  if (state.tshirts.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="table-empty">No orders yet — be the first!</td></tr>';
    return;
  }

  tbody.innerHTML = state.tshirts.map(t => `
    <tr>
      <td><strong>${esc(t.name)}</strong></td>
      <td><strong style="color:var(--terracotta)">${esc(t.size)}</strong></td>
      <td>${esc(String(t.qty))}</td>
      <td style="color:var(--muted);font-style:italic">${esc(t.note)}</td>
      <td><button class="table-delete" onclick="deleteTshirt('${esc(t.id)}')" title="Remove">✕</button></td>
    </tr>
  `).join('');

  const summary = document.getElementById('tshirtSummary');
  if (summary) {
    const sizes = ['XS','S','M','L','XL','2XL'];
    const counts = {};
    state.tshirts.forEach(t => {
      counts[t.size] = (counts[t.size] || 0) + Number(t.qty);
    });
    const total = Object.values(counts).reduce((a,b) => a + b, 0);
    summary.innerHTML = sizes
      .filter(s => counts[s])
      .map(s => `<span class="size-count"><strong>${s}</strong>${counts[s]}</span>`)
      .join('') + (total ? `<span class="size-count"><strong>Total</strong>${total}</span>` : '');
  }
}

function deleteTshirt(id) {
  const entry = state.tshirts.find(t => t.id === id);
  if (!entry) return;
  if (!confirm(`Remove ${entry.name}'s shirt order?`)) return;
  state.tshirts = state.tshirts.filter(t => t.id !== id);
  syncToFirestore();
}

// ── Modal helpers ────────────────────────────────────────────
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// ── Utility ──────────────────────────────────────────────────
function esc(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fmtDate(iso) {
  if (!iso) return '';
  const [, m, d] = iso.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(m,10)-1]} ${parseInt(d,10)}`;
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Static renders
  renderItinerary();
  renderTrails();
  renderInfo();
  renderCountdown();
  renderGearCategories();
  renderGearList();
  renderGantt(); // empty state until Firestore loads
  setInterval(renderCountdown, 1000);
  initTabs();
  initMobileMenu();

  // Password gate
  const pwOverlay = document.getElementById('pwOverlay');
  if (isAuthenticated()) {
    pwOverlay.classList.add('hidden');
    initFirestore();
  } else {
    document.getElementById('pwSubmit').addEventListener('click', submitPassword);
    document.getElementById('pwInput').addEventListener('keydown', e => {
      if (e.key === 'Enter') submitPassword();
    });
  }

  // ── Add camper ──
  document.getElementById('addCamperBtn').addEventListener('click', () => {
    document.getElementById('camperName').value      = '';
    document.getElementById('camperAdults').value    = '1';
    document.getElementById('camperKids').value      = '0';
    document.getElementById('camperSetup').value     = 'Tent';
    document.getElementById('camperArrival').value   = '2026-11-25';
    document.getElementById('camperDeparture').value = '2026-11-28';
    document.getElementById('camperNote').value      = '';
    openModal('camperModal');
  });

  document.getElementById('camperModalClose').addEventListener('click', () => closeModal('camperModal'));
  document.getElementById('camperModal').addEventListener('click', e => {
    if (e.target.id === 'camperModal') closeModal('camperModal');
  });

  document.getElementById('saveCamperBtn').addEventListener('click', () => {
    const name      = document.getElementById('camperName').value.trim();
    const adults    = Math.max(0, parseInt(document.getElementById('camperAdults').value, 10) || 0);
    const kids      = Math.max(0, parseInt(document.getElementById('camperKids').value, 10) || 0);
    const setup     = document.getElementById('camperSetup').value;
    const arrival   = document.getElementById('camperArrival').value;
    const departure = document.getElementById('camperDeparture').value;
    const note      = document.getElementById('camperNote').value.trim();

    if (!name) { document.getElementById('camperName').focus(); return; }

    state.campers.push({ id: uid(), name, adults, kids, setup, arrival, departure, note });
    syncToFirestore();
    closeModal('camperModal');
  });

  // ── Add reservation ──
  document.getElementById('addReservationBtn').addEventListener('click', () => {
    document.getElementById('resOwner').value     = '';
    document.getElementById('resSites').value     = '';
    document.getElementById('resArrival').value   = '2026-11-25';
    document.getElementById('resDeparture').value = '2026-11-28';
    document.getElementById('resNote').value      = '';
    openModal('reservationModal');
  });

  document.getElementById('reservationModalClose').addEventListener('click', () => closeModal('reservationModal'));
  document.getElementById('reservationModal').addEventListener('click', e => {
    if (e.target.id === 'reservationModal') closeModal('reservationModal');
  });

  document.getElementById('saveReservationBtn').addEventListener('click', () => {
    const reservedBy = document.getElementById('resOwner').value.trim();
    const sitesRaw   = document.getElementById('resSites').value.trim();
    const arrival    = document.getElementById('resArrival').value;
    const departure  = document.getElementById('resDeparture').value;
    const note       = document.getElementById('resNote').value.trim();

    if (!reservedBy) { document.getElementById('resOwner').focus(); return; }
    const siteNums = parseSiteNumbers(sitesRaw);
    if (siteNums.length === 0) { document.getElementById('resSites').focus(); return; }

    const sites = siteNums.map(n => ({ siteNum: n, usedBy: '' }));
    state.siteReservations.push({
      id: uid(), reservedBy, sites, arrival, departure, note,
    });
    syncToFirestore();
    closeModal('reservationModal');
  });

  // ── Add potluck ──
  document.getElementById('addPotluckBtn').addEventListener('click', () => {
    document.getElementById('potluckName').value = '';
    document.getElementById('potluckDish').value = '';
    document.getElementById('potluckNote').value = '';
    openModal('potluckModal');
  });

  document.getElementById('potluckModalClose').addEventListener('click', () => closeModal('potluckModal'));
  document.getElementById('potluckModal').addEventListener('click', e => {
    if (e.target.id === 'potluckModal') closeModal('potluckModal');
  });

  document.getElementById('savePotluckBtn').addEventListener('click', () => {
    const name     = document.getElementById('potluckName').value.trim();
    const dish     = document.getElementById('potluckDish').value.trim();
    const category = document.getElementById('potluckCategory').value;
    const note     = document.getElementById('potluckNote').value.trim();

    if (!name) { document.getElementById('potluckName').focus(); return; }
    if (!dish) { document.getElementById('potluckDish').focus(); return; }

    state.potluck.push({ id: uid(), name, dish, category, note });
    syncToFirestore();
    closeModal('potluckModal');
  });

  // ── Add t-shirt ──
  document.getElementById('addTshirtBtn').addEventListener('click', () => {
    document.getElementById('tshirtName').value = '';
    document.getElementById('tshirtNote').value = '';
    openModal('tshirtModal');
  });

  document.getElementById('tshirtModalClose').addEventListener('click', () => closeModal('tshirtModal'));
  document.getElementById('tshirtModal').addEventListener('click', e => {
    if (e.target.id === 'tshirtModal') closeModal('tshirtModal');
  });

  document.getElementById('saveTshirtBtn').addEventListener('click', () => {
    const name = document.getElementById('tshirtName').value.trim();
    const size = document.getElementById('tshirtSize').value;
    const qty  = document.getElementById('tshirtQty').value;
    const note = document.getElementById('tshirtNote').value.trim();

    if (!name) { document.getElementById('tshirtName').focus(); return; }

    state.tshirts.push({ id: uid(), name, size, qty: Number(qty), note });
    syncToFirestore();
    closeModal('tshirtModal');
  });

  // ── Keyboard close ──
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal('camperModal');
      closeModal('reservationModal');
      closeModal('potluckModal');
      closeModal('tshirtModal');
    }
  });
});
