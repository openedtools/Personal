// ============================================================
// Desert Turkey 2026 — App Logic
// Backend: Firebase Firestore (real-time, shared across devices)
// Data model:
//   attendees:  [{ id, name, site, arrival, departure, note }]
//   siteClaims: { siteId: attendeeId }   ← string IDs, never indices
//   gear:       [{ id, name, category, owner, packed }]
// ============================================================

// ── Password gate ────────────────────────────────────────────
const TRIP_PASS = 'DesertTurkey2026';

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

// ── State ────────────────────────────────────────────────────
let state = {
  attendees:     [],
  siteClaims:    {},
  gear:          [],
  activeGearCat: 'all',
  loaded:        false,
};

// ── Firestore sync ───────────────────────────────────────────
function syncToFirestore() {
  return TRIP_DOC.set({
    attendees:  state.attendees,
    siteClaims: state.siteClaims,
    gear:       state.gear,
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
        state.gear       = data.gear       || DEFAULT_GEAR;
      } else {
        // First ever load — seed with default gear list
        state.attendees  = [];
        state.siteClaims = {};
        state.gear       = DEFAULT_GEAR;
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
  renderGearCategories();
  renderGearList();
  renderStats();
}

// ── Countdown ────────────────────────────────────────────────
function renderCountdown() {
  const target = new Date('2026-11-25T12:00:00');
  const diff   = target - new Date();
  const el     = document.getElementById('countdown');
  if (!el) return;

  if (diff <= 0) {
    el.innerHTML = '<span style="color:var(--amber);font-family:\'Playfair Display\',serif;font-size:1.1rem;letter-spacing:0.05em">We\'re there! 🏕️</span>';
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
  document.getElementById('statGear').textContent      = state.gear.filter(g => g.packed).length;
}

// ── Stars ────────────────────────────────────────────────────
function renderStars() {
  const container = document.getElementById('stars');
  if (!container) return;
  for (let i = 0; i < 180; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2.5 + 0.5;
    star.style.cssText = `
      width:${size}px; height:${size}px;
      top:${Math.random() * 85}%;
      left:${Math.random() * 100}%;
      --dur:${(Math.random() * 4 + 2).toFixed(1)}s;
      --delay:${(Math.random() * 5).toFixed(1)}s;
      --op:${(Math.random() * 0.5 + 0.2).toFixed(2)};
    `;
    container.appendChild(star);
  }
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
        <span class="site-info-value" style="color:var(--orange)">Claimed</span>
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
        Add yourself to <a href="#attendees" style="color:var(--amber)" onclick="closeSiteModal()">Who's Coming</a> first, then claim a site.
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

  // Remove any pre-existing claim this attendee had
  for (const [sid, aid] of Object.entries(state.siteClaims)) {
    if (aid === attendeeId) delete state.siteClaims[sid];
  }

  state.siteClaims[siteId] = attendeeId;

  // Keep the attendee's .site field in sync for display
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

  // Release their site claim
  for (const [sid, aid] of Object.entries(state.siteClaims)) {
    if (aid === attendeeId) delete state.siteClaims[sid];
  }

  state.attendees = state.attendees.filter(a => a.id !== attendeeId);
  syncToFirestore();
}

// ── Gear ─────────────────────────────────────────────────────
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
    ? state.gear
    : state.gear.filter(g => g.category === state.activeGearCat);

  if (filtered.length === 0) {
    list.innerHTML = '<div class="empty-state">No items in this category yet.</div>';
    return;
  }

  list.innerHTML = filtered.map(g => {
    const cat = GEAR_CATEGORIES.find(c => c.id === g.category) || { label: g.category };
    return `
      <div class="gear-item ${g.packed ? 'packed' : ''}">
        <div class="gear-checkbox ${g.packed ? 'checked' : ''}" onclick="toggleGear('${g.id}')"></div>
        <div class="gear-item-info">
          <div class="gear-item-name">${esc(g.name)}</div>
          ${g.owner
            ? `<div class="gear-item-owner">Brought by: ${esc(g.owner)}</div>`
            : '<div class="gear-item-owner" style="color:var(--border)">Unassigned</div>'}
        </div>
        <span class="gear-item-cat">${cat.label}</span>
        <button class="gear-delete" onclick="deleteGear('${g.id}')" title="Remove">✕</button>
      </div>
    `;
  }).join('');
}

function toggleGear(id) {
  const item = state.gear.find(g => g.id === id);
  if (item) { item.packed = !item.packed; syncToFirestore(); }
}

function deleteGear(id) {
  state.gear = state.gear.filter(g => g.id !== id);
  syncToFirestore();
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

// ── Modal helpers ────────────────────────────────────────────
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// ── Nav ──────────────────────────────────────────────────────
function initNav() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.style.borderBottomColor = window.scrollY > 50 ? 'var(--border)' : 'transparent';
  }, { passive: true });
}

function closeDrawer() {
  document.getElementById('navDrawer').classList.remove('open');
}

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

  // Static renders (don't need Firestore data)
  renderStars();
  renderItinerary();
  renderTrails();
  renderInfo();
  renderCountdown();
  setInterval(renderCountdown, 1000);
  initNav();

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

  // ── Hamburger ──
  document.getElementById('navHamburger').addEventListener('click', () => {
    document.getElementById('navDrawer').classList.toggle('open');
  });

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
    const site      = document.getElementById('attendeeSite').value.trim().toUpperCase();
    const arrival   = document.getElementById('attendeeArrival').value;
    const departure = document.getElementById('attendeeDeparture').value;
    const note      = document.getElementById('attendeeNote').value.trim();

    if (!name) { document.getElementById('attendeeName').focus(); return; }

    const id       = uid();
    const attendee = { id, name, site, arrival, departure, note };
    state.attendees.push(attendee);

    // Auto-claim site if it's a known site ID and currently unclaimed
    if (site && SITE_COORDS[site] && !state.siteClaims[site]) {
      state.siteClaims[site] = id;
    }

    syncToFirestore();
    closeModal('attendeeModal');
  });

  // ── Add gear ──
  document.getElementById('addGearBtn').addEventListener('click', () => {
    document.getElementById('gearItemName').value  = '';
    document.getElementById('gearItemOwner').value = '';
    openModal('gearModal');
  });

  document.getElementById('gearModalClose').addEventListener('click', () => closeModal('gearModal'));
  document.getElementById('gearModal').addEventListener('click', e => {
    if (e.target.id === 'gearModal') closeModal('gearModal');
  });

  document.getElementById('saveGearBtn').addEventListener('click', () => {
    const name     = document.getElementById('gearItemName').value.trim();
    const category = document.getElementById('gearItemCategory').value;
    const owner    = document.getElementById('gearItemOwner').value.trim();

    if (!name) { document.getElementById('gearItemName').focus(); return; }

    state.gear.push({ id: uid(), name, category, owner, packed: false });
    syncToFirestore();
    closeModal('gearModal');
  });

  // ── Keyboard close ──
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeSiteModal();
      closeModal('attendeeModal');
      closeModal('gearModal');
      closeDrawer();
    }
  });
});
