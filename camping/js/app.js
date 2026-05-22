// ============================================================
// Desert Turkey 2026 — App Logic
// Backend: Firebase Firestore (real-time, shared across devices)
// Data model:
//   attendees:  [{ id, name, site, arrival, departure, note }]
//   siteClaims: { siteId: attendeeId }
//   gear:       [{ id, name, category, owner, packed }]
//   potluck:    [{ id, name, dish, category, note }]
//   tshirts:    [{ id, name, size, qty, note }]
// ============================================================

// ── Password gate ────────────────────────────────────────────
const TRIP_PASS = 'ieatturkeyinthedesert';

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
function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === 'tab-' + tabId);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Re-render map when switching to it (markers need the panel visible)
  if (tabId === 'map') renderMap();
}

function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Honour hash on load
  const hash = location.hash.replace('#', '');
  if (hash) switchTab(hash);
}

// ── State ────────────────────────────────────────────────────
let state = {
  attendees:     [],
  siteClaims:    {},
  potluck:       [],
  tshirts:       [],
  activeGearCat: 'all',
  loaded:        false,
};

// ── Firestore sync ───────────────────────────────────────────
function syncToFirestore() {
  return TRIP_DOC.set({
    attendees:  state.attendees,
    siteClaims: state.siteClaims,
    potluck:    state.potluck,
    tshirts:    state.tshirts,
  });
}

function initFirestore() {
  setSyncStatus('connecting');

  TRIP_DOC.onSnapshot(
    snap => {
      setSyncStatus('live');
      if (snap.exists) {
        const data       = snap.data();
        state.attendees  = data.attendees  || [];
        state.siteClaims = data.siteClaims || {};
        state.potluck    = data.potluck    || [];
        state.tshirts    = data.tshirts    || [];
      } else {
        state.attendees  = [];
        state.siteClaims = {};
        state.potluck    = [];
        state.tshirts    = [];
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

function setSyncStatus(status) {
  const dot   = document.getElementById('syncDot');
  const label = document.getElementById('syncLabel');
  if (!dot || !label) return;
  dot.className = 'sync-dot sync-' + status;
  label.textContent = { live: 'Live', connecting: 'connecting…', error: 'offline' }[status] || status;
}

// ── Full re-render ────────────────────────────────────────────
function renderAll() {
  renderMap();
  renderAttendees();
  renderStats();
  renderPotluck();
  renderTshirts();
}

// ── Countdown ────────────────────────────────────────────────
function renderCountdown() {
  const target = new Date('2026-11-25T12:00:00');
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

// ── Stats bar ────────────────────────────────────────────────
function renderStats() {
  document.getElementById('statAttendees').textContent = state.attendees.length;
  document.getElementById('statSites').textContent     = Object.keys(state.siteClaims).length;
}

// ── Map ──────────────────────────────────────────────────────
function renderMap() {
  buildMap(state.siteClaims, state.attendees);
}

// ── Site Modal ───────────────────────────────────────────────
function openSiteModal(siteId) {
  const modal   = document.getElementById('siteModal');
  const title   = document.getElementById('modalTitle');
  const content = document.getElementById('modalContent');

  title.textContent = 'Site ' + siteId;

  const claimedById = state.siteClaims[siteId];
  const claimer     = claimedById ? state.attendees.find(a => a.id === claimedById) : null;

  if (claimer) {
    content.innerHTML = `
      <div class="site-claimed-by">
        <div class="site-claimed-name">${esc(claimer.name)}</div>
        <div style="font-size:0.85rem;color:var(--muted);margin-top:4px">${fmtDate(claimer.arrival)} → ${fmtDate(claimer.departure)}</div>
        ${claimer.note ? `<div style="font-size:0.8rem;color:var(--muted);margin-top:6px;font-style:italic">"${esc(claimer.note)}"</div>` : ''}
      </div>
      <div class="site-info-row">
        <span class="site-info-label">Status</span>
        <span class="site-info-value" style="color:var(--terracotta)">Claimed</span>
      </div>
      <button class="btn btn-outline" style="margin-top:16px;width:100%" onclick="releaseSite('${siteId}')">
        Release This Site
      </button>
    `;
  } else {
    const unclaimed = state.attendees.filter(a => !Object.values(state.siteClaims).includes(a.id));

    let claimOptions = '';
    if (unclaimed.length > 0) {
      claimOptions = `
        <div class="form-group" style="margin-top:16px">
          <label>Assign to</label>
          <select id="claimSelect">
            <option value="">-- pick a camper --</option>
            ${unclaimed.map(a => `<option value="${esc(a.id)}">${esc(a.name)}</option>`).join('')}
          </select>
        </div>
        <button class="btn btn-primary" style="width:100%" onclick="claimSiteForAttendee('${siteId}')">
          Claim This Site
        </button>
      `;
    } else if (state.attendees.length === 0) {
      claimOptions = `<p style="color:var(--muted);font-size:0.85rem;margin-top:12px">
        Add yourself in the <a href="#" style="color:var(--terracotta)" onclick="closeSiteModal();switchTab('campers')">Campers tab</a> first, then claim a site.
      </p>`;
    } else {
      claimOptions = `<p style="color:var(--muted);font-size:0.85rem;margin-top:12px">
        All attendees have sites assigned. Add more campers first.
      </p>`;
    }

    content.innerHTML = `
      <div class="site-info-row">
        <span class="site-info-label">Status</span>
        <span class="site-info-value" style="color:var(--muted)">Available</span>
      </div>
      ${claimOptions}
    `;
  }

  modal.classList.add('open');
}

function closeSiteModal() {
  document.getElementById('siteModal').classList.remove('open');
}

function claimSiteForAttendee(siteId) {
  const select      = document.getElementById('claimSelect');
  const attendeeId  = select.value;
  if (!attendeeId) return;

  for (const [sid, aid] of Object.entries(state.siteClaims)) {
    if (aid === attendeeId) delete state.siteClaims[sid];
  }

  state.siteClaims[siteId] = attendeeId;

  const attendee = state.attendees.find(a => a.id === attendeeId);
  if (attendee) attendee.site = siteId;

  syncToFirestore();
  closeSiteModal();
}

function releaseSite(siteId) {
  const attendeeId = state.siteClaims[siteId];
  if (attendeeId) {
    const attendee = state.attendees.find(a => a.id === attendeeId);
    if (attendee) attendee.site = '';
  }
  delete state.siteClaims[siteId];
  syncToFirestore();
  closeSiteModal();
}

// ── Attendees ────────────────────────────────────────────────
function renderAttendees() {
  const grid = document.getElementById('attendeesGrid');
  if (!grid) return;

  if (state.attendees.length === 0) {
    grid.innerHTML = '<div class="empty-state">No campers yet — be the first to add yourself!</div>';
    return;
  }

  grid.innerHTML = state.attendees.map((a, i) => {
    const color   = AVATAR_COLORS[i % AVATAR_COLORS.length];
    const initial = (a.name || '?')[0].toUpperCase();
    const site    = a.site ? `<span class="attendee-site">Site ${esc(a.site)}</span>` : '';
    const dates   = (a.arrival && a.departure)
      ? `<div class="attendee-dates">${fmtDate(a.arrival)} → ${fmtDate(a.departure)}</div>` : '';
    const note    = a.note ? `<div class="attendee-note">"${esc(a.note)}"</div>` : '';

    return `
      <div class="attendee-card">
        <button class="attendee-delete" onclick="deleteAttendee('${esc(a.id)}')" title="Remove">✕</button>
        <div class="attendee-avatar" style="background:${color}">${initial}</div>
        <div class="attendee-name">${esc(a.name)}</div>
        ${site}${dates}${note}
      </div>
    `;
  }).join('');
}

function deleteAttendee(attendeeId) {
  const attendee = state.attendees.find(a => a.id === attendeeId);
  if (!attendee) return;
  if (!confirm(`Remove ${attendee.name} from the trip?`)) return;

  for (const [sid, aid] of Object.entries(state.siteClaims)) {
    if (aid === attendeeId) delete state.siteClaims[sid];
  }

  state.attendees = state.attendees.filter(a => a.id !== attendeeId);
  syncToFirestore();
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

  // Update size summary
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
  setInterval(renderCountdown, 1000);
  initTabs();

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

  // ── Site modal close ──
  document.getElementById('modalClose').addEventListener('click', closeSiteModal);
  document.getElementById('siteModal').addEventListener('click', e => {
    if (e.target.id === 'siteModal') closeSiteModal();
  });

  // ── Add attendee ──
  document.getElementById('addAttendeeBtn').addEventListener('click', () => {
    document.getElementById('attendeeName').value      = '';
    document.getElementById('attendeeSite').value      = '';
    document.getElementById('attendeeArrival').value   = '2026-11-25';
    document.getElementById('attendeeDeparture').value = '2026-11-30';
    document.getElementById('attendeeNote').value      = '';
    openModal('attendeeModal');
  });

  document.getElementById('attendeeModalClose').addEventListener('click', () => closeModal('attendeeModal'));
  document.getElementById('attendeeModal').addEventListener('click', e => {
    if (e.target.id === 'attendeeModal') closeModal('attendeeModal');
  });

  document.getElementById('saveAttendeeBtn').addEventListener('click', () => {
    const name      = document.getElementById('attendeeName').value.trim();
    const site      = document.getElementById('attendeeSite').value.trim();
    const arrival   = document.getElementById('attendeeArrival').value;
    const departure = document.getElementById('attendeeDeparture').value;
    const note      = document.getElementById('attendeeNote').value.trim();

    if (!name) { document.getElementById('attendeeName').focus(); return; }

    const id       = uid();
    const attendee = { id, name, site, arrival, departure, note };
    state.attendees.push(attendee);

    if (site && SITE_COORDS[site] && !state.siteClaims[site]) {
      state.siteClaims[site] = id;
    }

    syncToFirestore();
    closeModal('attendeeModal');
  });

  // ── Add potluck ──
  document.getElementById('addPotluckBtn').addEventListener('click', () => {
    document.getElementById('potluckName').value  = '';
    document.getElementById('potluckDish').value  = '';
    document.getElementById('potluckNote').value  = '';
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
      closeSiteModal();
      closeModal('attendeeModal');
      closeModal('potluckModal');
      closeModal('tshirtModal');
    }
  });
});
