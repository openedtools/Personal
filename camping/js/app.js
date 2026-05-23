// ============================================================
// Desert Turkey 2026 — App Logic
// Data model (Firestore document — synced with merge:true so
// unknown fields are preserved):
//   campers:          [{ id, name, adults, kids, setup, arrival, departure, note }]
//   siteReservations: [{ id, reservedBy, sites:[{siteNum,usedBy}], arrival, departure, note }]
//   potluck:          [{ id, name, dish, category, note }]
//   tshirts:          [{ id, name, size, qty, note }]
//   itinerary:        [{ id, day, date, title, activities:[string] }]
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

  function openMenu()  { hamburger.classList.add('open');    menu.classList.add('open');    backdrop.classList.add('open'); }
  function closeMenu() { hamburger.classList.remove('open'); menu.classList.remove('open'); backdrop.classList.remove('open'); }

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeMenu() : openMenu();
  });
  backdrop.addEventListener('click', closeMenu);
  document.querySelectorAll('.mobile-tab').forEach(btn => {
    btn.addEventListener('click', () => { switchTab(btn.dataset.tab); closeMenu(); });
  });
}

// ── State ────────────────────────────────────────────────────
let state = {
  campers:          [],
  siteReservations: [],
  potluck:          [],
  tshirts:          [],
  itinerary:        [],
  activeGearCat:    'all',
  loaded:           false,
};

// Track which entry is being edited (id, or null for new)
const editing = {
  camper: null, reservation: null, potluck: null, tshirt: null, itinerary: null,
};

// ── Firestore sync ───────────────────────────────────────────
// merge:true — Firestore preserves any fields the client doesn't
// touch. This protects legacy data and any keys added by a newer
// client version from being wiped by an older tab.
function syncToFirestore() {
  const payload = {
    campers:          state.campers,
    siteReservations: state.siteReservations,
    potluck:          state.potluck,
    tshirts:          state.tshirts,
    itinerary:        state.itinerary,
  };
  postBackup(payload); // fire-and-forget mirror to Google Sheets
  return TRIP_DOC.set(payload, { merge: true });
}

// Mirror writes to a Google Sheets backup (Apps Script Web App).
// Best-effort: failures never block the real Firestore write.
// Uses no-cors so we don't need a CORS preflight on the script.
function postBackup(payload) {
  if (typeof BACKUP_WEBHOOK_URL !== 'string' || !BACKUP_WEBHOOK_URL) return;
  try {
    fetch(BACKUP_WEBHOOK_URL, {
      method:    'POST',
      mode:      'no-cors',
      keepalive: true,
      body: JSON.stringify({
        secret:  BACKUP_SECRET,
        ts:      new Date().toISOString(),
        payload,
      }),
    }).catch(() => {});
  } catch (e) { /* ignore */ }
}

// One-time migration of pre-redesign data (attendees / siteClaims)
// into the current schema. Returns true if anything was migrated.
function migrateLegacyShape(data) {
  let migrated = false;

  if ((!data.campers || data.campers.length === 0) && Array.isArray(data.attendees) && data.attendees.length > 0) {
    state.campers = data.attendees.map(a => ({
      id:        a.id || uid(),
      name:      a.name || '',
      adults:    1,
      kids:      0,
      setup:     'Tent',
      arrival:   a.arrival   || '2026-11-25',
      departure: a.departure || '2026-11-28',
      note:      a.note      || '',
    }));
    migrated = true;
  }

  if ((!data.siteReservations || data.siteReservations.length === 0)
      && data.siteClaims && typeof data.siteClaims === 'object') {
    // Best-effort: group claims by attendee
    const byAttendee = {};
    for (const [siteNum, attId] of Object.entries(data.siteClaims)) {
      if (!byAttendee[attId]) byAttendee[attId] = [];
      byAttendee[attId].push(siteNum);
    }
    state.siteReservations = Object.entries(byAttendee).map(([attId, siteNums]) => {
      const att = (data.attendees || []).find(a => a.id === attId);
      return {
        id:         uid(),
        reservedBy: att ? att.name : 'Unknown',
        sites:      siteNums.map(n => ({ siteNum: String(n), usedBy: att ? att.name : '' })),
        arrival:    att ? att.arrival   : '2026-11-25',
        departure:  att ? att.departure : '2026-11-28',
        note:       '',
      };
    });
    if (state.siteReservations.length > 0) migrated = true;
  }

  return migrated;
}

function initFirestore() {
  setSyncStatus('connecting');
  TRIP_DOC.onSnapshot(
    snap => {
      setSyncStatus('live');
      if (snap.exists) {
        const data             = snap.data();
        state.campers          = Array.isArray(data.campers)          ? data.campers          : [];
        state.siteReservations = Array.isArray(data.siteReservations) ? data.siteReservations : [];
        state.potluck          = Array.isArray(data.potluck)          ? data.potluck          : [];
        state.tshirts          = Array.isArray(data.tshirts)          ? data.tshirts          : [];
        state.itinerary        = Array.isArray(data.itinerary)        ? data.itinerary        : [];

        if (migrateLegacyShape(data)) {
          // Save migrated data back — uses merge so legacy keys stay
          // in place as a backup until we explicitly remove them.
          syncToFirestore();
        }
      } else {
        // No document yet — initialize an empty one.
        syncToFirestore();
      }
      state.loaded = true;
      renderAll();
    },
    err => { setSyncStatus('error'); console.error('Firestore error:', err); }
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
  renderArrivalTimeline();
  renderCampers();
  renderSiteReservations();
  renderPotluck();
  renderTshirts();
  renderItinerary();
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

// ── Arrival Timeline (Gantt) ──────────────────────────────────
const TRIP_START = new Date('2026-11-22T00:00:00');
const GANTT_DAYS = [
  { dow: 'Sun', date: 'Nov 22' },
  { dow: 'Mon', date: 'Nov 23' },
  { dow: 'Tue', date: 'Nov 24' },
  { dow: 'Wed', date: 'Nov 25' },
  { dow: 'Thu', date: 'Nov 26' },
  { dow: 'Fri', date: 'Nov 27' },
  { dow: 'Sat', date: 'Nov 28' },
];

function dayIndex(isoDate) {
  if (!isoDate) return -1;
  return Math.round((new Date(isoDate + 'T00:00:00') - TRIP_START) / 86400000);
}

function renderArrivalTimeline() {
  const el = document.getElementById('arrivalTimeline');
  if (!el) return;

  const N = GANTT_DAYS.length;

  if (state.campers.length === 0) {
    el.innerHTML = '<div class="empty-state">Add campers to see the arrival timeline.</div>';
    return;
  }

  let html = `<div class="gantt-wrap"><div class="gantt-table">`;

  html += `<div class="gantt-header-row">
    <div class="gantt-label-col gantt-col-header">Camper</div>
    <div class="gantt-days-header">
      ${GANTT_DAYS.map(d => `
        <div class="gantt-header-day">
          <span class="gantt-dow">${d.dow}</span>
          <span class="gantt-date">${d.date}</span>
        </div>`).join('')}
    </div>
  </div>`;

  state.campers.forEach((c, i) => {
    const color    = AVATAR_COLORS[i % AVATAR_COLORS.length];
    const initial  = (c.name || '?')[0].toUpperCase();
    const arrIdx   = dayIndex(c.arrival);
    const depIdx   = dayIndex(c.departure);
    const barStart = Math.max(0, Math.min(N - 1, arrIdx));
    const barEnd   = Math.max(0, Math.min(N - 1, depIdx));
    const hasBar   = !!c.arrival && !!c.departure && depIdx >= arrIdx && barEnd >= barStart;
    const leftPct  = (barStart / N * 100).toFixed(2);
    const widthPct = ((barEnd - barStart + 1) / N * 100).toFixed(2);
    const barSpan  = barEnd - barStart + 1;

    html += `
      <div class="gantt-row">
        <div class="gantt-label-col">
          <span class="gantt-avatar" style="background:${color}">${esc(initial)}</span>
          <div class="gantt-name-info">
            <span class="gantt-camper-name">${esc(c.name)}</span>
            ${c.setup ? `<span class="gantt-setup-type">${esc(c.setup)}</span>` : ''}
          </div>
        </div>
        <div class="gantt-days-area">
          ${Array(N).fill(0).map(() => '<div class="gantt-cell"></div>').join('')}
          ${hasBar ? `
            <div class="gantt-bar"
                 style="left:${leftPct}%;width:${widthPct}%;background:${color};"
                 title="${esc(c.name)}: ${fmtDate(c.arrival)} → ${fmtDate(c.departure)}">
              ${barSpan >= 2 ? `<span class="gantt-bar-label">${fmtDate(c.arrival)} → ${fmtDate(c.departure)}</span>` : ''}
            </div>` : ''}
        </div>
      </div>`;
  });

  html += `</div></div>`;
  el.innerHTML = html;
}

// ── Campers ───────────────────────────────────────────────────
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
    const adults  = Number(c.adults) || 1;
    const kids    = Number(c.kids)   || 0;
    const peopleTxt = adults + (kids > 0
      ? ` adult${adults !== 1 ? 's' : ''} · ${kids} kid${kids !== 1 ? 's' : ''}`
      : ` adult${adults !== 1 ? 's' : ''}`);

    return `
      <div class="attendee-card">
        <div class="card-actions">
          <button class="card-edit" onclick="openCamperModal('${esc(c.id)}')" title="Edit">✎</button>
          <button class="attendee-delete" onclick="deleteCamper('${esc(c.id)}')" title="Remove">✕</button>
        </div>
        <div class="attendee-avatar" style="background:${color}">${initial}</div>
        <div class="attendee-name">${esc(c.name)}</div>
        ${c.setup ? `<span class="camper-setup-badge">${esc(c.setup)}</span>` : ''}
        <div class="camper-people">${esc(peopleTxt)}</div>
        ${(c.arrival && c.departure) ? `<div class="attendee-dates">${fmtDate(c.arrival)} → ${fmtDate(c.departure)}</div>` : ''}
        ${c.note ? `<div class="attendee-note">"${esc(c.note)}"</div>` : ''}
      </div>`;
  }).join('');
}

function deleteCamper(camperId) {
  const c = state.campers.find(x => x.id === camperId);
  if (!c) return;
  if (!confirm(`Remove ${c.name} from the trip?`)) return;
  state.campers = state.campers.filter(x => x.id !== camperId);
  syncToFirestore();
}

function openCamperModal(camperId) {
  const c = camperId ? state.campers.find(x => x.id === camperId) : null;
  editing.camper = c ? c.id : null;
  document.getElementById('camperModalTitle').textContent = c ? 'Edit Camper' : 'Add Camper';
  document.getElementById('saveCamperBtn').textContent    = c ? 'Save Changes' : 'Add to Trip';
  document.getElementById('camperName').value      = c ? (c.name || '')        : '';
  document.getElementById('camperAdults').value    = c ? String(c.adults || 1) : '1';
  document.getElementById('camperKids').value      = c ? String(c.kids   || 0) : '0';
  document.getElementById('camperSetup').value     = c ? (c.setup || 'Tent')   : 'Tent';
  document.getElementById('camperArrival').value   = c ? (c.arrival   || '2026-11-25') : '2026-11-25';
  document.getElementById('camperDeparture').value = c ? (c.departure || '2026-11-28') : '2026-11-28';
  document.getElementById('camperNote').value      = c ? (c.note || '')        : '';
  openModal('camperModal');
}

function saveCamper() {
  const name      = document.getElementById('camperName').value.trim();
  const adults    = parseInt(document.getElementById('camperAdults').value) || 1;
  const kids      = parseInt(document.getElementById('camperKids').value)   || 0;
  const setup     = document.getElementById('camperSetup').value;
  const arrival   = document.getElementById('camperArrival').value;
  const departure = document.getElementById('camperDeparture').value;
  const note      = document.getElementById('camperNote').value.trim();

  if (!name) { document.getElementById('camperName').focus(); return; }

  if (editing.camper) {
    const idx = state.campers.findIndex(c => c.id === editing.camper);
    if (idx >= 0) state.campers[idx] = { id: editing.camper, name, adults, kids, setup, arrival, departure, note };
  } else {
    state.campers.push({ id: uid(), name, adults, kids, setup, arrival, departure, note });
  }
  syncToFirestore();
  closeModal('camperModal');
}

// ── Site Reservations ─────────────────────────────────────────
function renderSiteReservations() {
  const grid = document.getElementById('reservationsGrid');
  if (!grid) return;

  if (state.siteReservations.length === 0) {
    grid.innerHTML = '<div class="empty-state">No reservations yet — add one to get started!</div>';
    return;
  }

  grid.innerHTML = state.siteReservations.map(res => {
    const sites = res.sites || [];
    const sitesHtml = sites.map((s, idx) => `
      <div class="res-site-row" data-res-id="${esc(res.id)}" data-site-idx="${idx}">
        <span class="res-site-num">Site ${esc(s.siteNum)}</span>
        <span class="res-site-user${s.usedBy ? '' : ' res-site-open'}">${s.usedBy ? esc(s.usedBy) : 'open'}</span>
        <button class="res-site-edit-btn" onclick="startEditSiteUser('${esc(res.id)}',${idx})">${s.usedBy ? 'Edit' : 'Assign'}</button>
      </div>`).join('');

    return `
      <div class="reservation-card">
        <div class="res-card-header">
          <div class="res-card-title">
            <span class="res-owner">${esc(res.reservedBy)}</span>
            <span class="res-dates">${fmtDate(res.arrival)} → ${fmtDate(res.departure)}</span>
          </div>
          <div class="card-actions">
            <button class="card-edit" onclick="openReservationModal('${esc(res.id)}')" title="Edit reservation">✎</button>
            <button class="attendee-delete" onclick="deleteReservation('${esc(res.id)}')" title="Remove reservation">✕</button>
          </div>
        </div>
        ${res.note ? `<div class="res-note">"${esc(res.note)}"</div>` : ''}
        <div class="res-sites-list">${sitesHtml}</div>
      </div>`;
  }).join('');
}

function startEditSiteUser(resId, siteIdx) {
  const row = document.querySelector(`[data-res-id="${resId}"][data-site-idx="${siteIdx}"]`);
  if (!row) return;
  const userSpan = row.querySelector('.res-site-user');
  const editBtn  = row.querySelector('.res-site-edit-btn');
  const currentVal = userSpan.classList.contains('res-site-open') ? '' : userSpan.textContent;

  userSpan.innerHTML = `<input class="res-site-input" value="${esc(currentVal)}" placeholder="Name or blank = open" maxlength="30" />`;
  editBtn.textContent = 'Save';
  editBtn.onclick = () => saveSiteUser(resId, siteIdx);

  const input = userSpan.querySelector('input');
  input.focus();
  input.select();
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') saveSiteUser(resId, siteIdx);
    if (e.key === 'Escape') renderSiteReservations();
  });
}

function saveSiteUser(resId, siteIdx) {
  const row = document.querySelector(`[data-res-id="${resId}"][data-site-idx="${siteIdx}"]`);
  if (!row) return;
  const input = row.querySelector('.res-site-input');
  if (!input) return;
  const res = state.siteReservations.find(r => r.id === resId);
  if (!res || !res.sites[siteIdx]) return;
  res.sites[siteIdx].usedBy = input.value.trim();
  renderSiteReservations();
  syncToFirestore();
}

function deleteReservation(resId) {
  const res = state.siteReservations.find(r => r.id === resId);
  if (!res) return;
  if (!confirm(`Delete reservation by ${res.reservedBy}?`)) return;
  state.siteReservations = state.siteReservations.filter(r => r.id !== resId);
  syncToFirestore();
}

function openReservationModal(resId) {
  const r = resId ? state.siteReservations.find(x => x.id === resId) : null;
  editing.reservation = r ? r.id : null;
  document.getElementById('reservationModalTitle').textContent = r ? 'Edit Reservation' : 'Add Reservation';
  document.getElementById('saveReservationBtn').textContent    = r ? 'Save Changes'     : 'Save Reservation';
  document.getElementById('resOwner').value     = r ? (r.reservedBy || '') : '';
  document.getElementById('resSiteNums').value  = r ? (r.sites || []).map(s => s.siteNum).join(', ') : '';
  document.getElementById('resArrival').value   = r ? (r.arrival   || '2026-11-25') : '2026-11-25';
  document.getElementById('resDeparture').value = r ? (r.departure || '2026-11-28') : '2026-11-28';
  document.getElementById('resNote').value      = r ? (r.note || '') : '';
  openModal('reservationModal');
}

function saveReservation() {
  const reservedBy  = document.getElementById('resOwner').value.trim();
  const siteNumsRaw = document.getElementById('resSiteNums').value.trim();
  const arrival     = document.getElementById('resArrival').value;
  const departure   = document.getElementById('resDeparture').value;
  const note        = document.getElementById('resNote').value.trim();

  if (!reservedBy)  { document.getElementById('resOwner').focus();    return; }
  if (!siteNumsRaw) { document.getElementById('resSiteNums').focus(); return; }

  const requested = siteNumsRaw.split(/[\s,]+/).map(s => s.trim()).filter(Boolean);

  if (editing.reservation) {
    const idx = state.siteReservations.findIndex(r => r.id === editing.reservation);
    if (idx >= 0) {
      // Preserve existing `usedBy` for sites that are still in the list
      const oldSites = state.siteReservations[idx].sites || [];
      const newSites = requested.map(siteNum => {
        const prev = oldSites.find(s => s.siteNum === siteNum);
        return { siteNum, usedBy: prev ? prev.usedBy : '' };
      });
      state.siteReservations[idx] = {
        id: editing.reservation, reservedBy, sites: newSites, arrival, departure, note,
      };
    }
  } else {
    const sites = requested.map(siteNum => ({ siteNum, usedBy: '' }));
    state.siteReservations.push({ id: uid(), reservedBy, sites, arrival, departure, note });
  }
  syncToFirestore();
  closeModal('reservationModal');
}

// ── Gear (static packing list) ────────────────────────────────
function renderGearCategories() {
  const container = document.getElementById('gearCategories');
  if (!container) return;
  container.innerHTML = GEAR_CATEGORIES.map(c => `
    <button class="cat-btn ${state.activeGearCat === c.id ? 'active' : ''}"
            onclick="setGearCat('${c.id}')">${c.label}</button>`).join('');
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
      </div>`;
  }).join('');
}

// ── Itinerary (editable + Firestore-backed) ──────────────────
function renderItinerary() {
  const el = document.getElementById('itineraryTimeline');
  if (!el) return;
  if (!state.itinerary || state.itinerary.length === 0) {
    el.innerHTML = `<div class="itinerary-tbd">TBD — itinerary coming together. Use <strong>+ Add Day</strong> to start filling it in.</div>`;
    return;
  }
  el.innerHTML = state.itinerary.map(day => `
    <div class="itinerary-day">
      <div class="day-marker">
        <div class="day-dot"></div>
        <div class="day-num">${esc(day.day || '')}</div>
      </div>
      <div class="day-content">
        <div class="card-actions itinerary-actions">
          <button class="card-edit" onclick="openItineraryModal('${esc(day.id)}')" title="Edit">✎</button>
          <button class="attendee-delete" onclick="deleteItinerary('${esc(day.id)}')" title="Remove">✕</button>
        </div>
        ${day.date  ? `<div class="day-date">${esc(day.date)}</div>`   : ''}
        ${day.title ? `<div class="day-title">${esc(day.title)}</div>` : ''}
        ${Array.isArray(day.activities) && day.activities.length
          ? `<ul class="day-activities">${day.activities.map(a => `<li>${esc(a)}</li>`).join('')}</ul>`
          : ''}
      </div>
    </div>`).join('');
}

function openItineraryModal(dayId) {
  const d = dayId ? state.itinerary.find(x => x.id === dayId) : null;
  editing.itinerary = d ? d.id : null;
  document.getElementById('itineraryModalTitle').textContent = d ? 'Edit Day' : 'Add Day';
  document.getElementById('saveItineraryBtn').textContent    = d ? 'Save Changes' : 'Add Day';
  document.getElementById('itDay').value        = d ? (d.day || '')   : '';
  document.getElementById('itDate').value       = d ? (d.date || '')  : '';
  document.getElementById('itTitle').value      = d ? (d.title || '') : '';
  document.getElementById('itActivities').value = d && Array.isArray(d.activities) ? d.activities.join('\n') : '';
  openModal('itineraryModal');
}

function saveItinerary() {
  const day        = document.getElementById('itDay').value.trim();
  const date       = document.getElementById('itDate').value.trim();
  const title      = document.getElementById('itTitle').value.trim();
  const activities = document.getElementById('itActivities').value
    .split('\n').map(s => s.trim()).filter(Boolean);

  if (!date && !title && activities.length === 0 && !day) {
    document.getElementById('itDate').focus();
    return;
  }

  if (editing.itinerary) {
    const idx = state.itinerary.findIndex(x => x.id === editing.itinerary);
    if (idx >= 0) state.itinerary[idx] = { id: editing.itinerary, day, date, title, activities };
  } else {
    state.itinerary.push({ id: uid(), day, date, title, activities });
  }
  syncToFirestore();
  closeModal('itineraryModal');
}

function deleteItinerary(dayId) {
  const d = state.itinerary.find(x => x.id === dayId);
  if (!d) return;
  if (!confirm(`Remove "${d.title || d.date || 'this day'}" from the itinerary?`)) return;
  state.itinerary = state.itinerary.filter(x => x.id !== dayId);
  syncToFirestore();
}

// ── Trails ───────────────────────────────────────────────────
function renderTrails() {
  const grid = document.getElementById('trailsGrid');
  if (!grid) return;
  grid.innerHTML = TRAILS.map(t => {
    const nameHtml = t.url
      ? `<a class="trail-name" href="${esc(t.url)}" target="_blank" rel="noopener">${esc(t.name)} <span class="ext-arrow">↗</span></a>`
      : `<div class="trail-name">${esc(t.name)}</div>`;
    const linkRow = [];
    if (t.url)    linkRow.push(`<a class="trail-link" href="${esc(t.url)}"    target="_blank" rel="noopener">NPS ↗</a>`);
    if (t.altUrl) linkRow.push(`<a class="trail-link" href="${esc(t.altUrl)}" target="_blank" rel="noopener">AllTrails ↗</a>`);
    return `
      <div class="trail-card">
        <span class="trail-difficulty difficulty-${t.difficulty}">${t.difficulty}</span>
        ${nameHtml}
        <div class="trail-stats">
          <span class="trail-stat"><span>Distance</span>${esc(t.distance)}</span>
          <span class="trail-stat"><span>Time</span>${esc(t.time)}</span>
          <span class="trail-stat"><span>Gain</span>${esc(t.elevation)}</span>
        </div>
        <div class="trail-desc">${esc(t.desc)}</div>
        ${linkRow.length ? `<div class="trail-links">${linkRow.join('')}</div>` : ''}
      </div>`;
  }).join('');
}

// ── Info cards ───────────────────────────────────────────────
function renderInfo() {
  const grid = document.getElementById('infoGrid');
  if (!grid) return;
  grid.innerHTML = INFO_CARDS.map(card => {
    const links = (card.links || []).map(l =>
      `<a class="info-link" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} <span class="ext-arrow">↗</span></a>`
    ).join('');
    return `
      <div class="info-card">
        <span class="info-icon">${card.icon}</span>
        <div class="info-title">${esc(card.title)}</div>
        <ul class="info-items">
          ${card.items.map(item => `<li>${esc(item)}</li>`).join('')}
        </ul>
        ${links ? `<div class="info-links">${links}</div>` : ''}
      </div>`;
  }).join('');
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
      <td class="row-actions">
        <button class="table-edit"   onclick="openPotluckModal('${esc(p.id)}')" title="Edit">✎</button>
        <button class="table-delete" onclick="deletePotluck('${esc(p.id)}')"   title="Remove">✕</button>
      </td>
    </tr>`).join('');
}

function deletePotluck(id) {
  const entry = state.potluck.find(p => p.id === id);
  if (!entry) return;
  if (!confirm(`Remove ${entry.name}'s entry from the potluck?`)) return;
  state.potluck = state.potluck.filter(p => p.id !== id);
  syncToFirestore();
}

function openPotluckModal(id) {
  const p = id ? state.potluck.find(x => x.id === id) : null;
  editing.potluck = p ? p.id : null;
  document.getElementById('potluckModalTitle').textContent = p ? 'Edit Potluck Entry' : 'Sign Up for Potluck';
  document.getElementById('savePotluckBtn').textContent    = p ? 'Save Changes'       : 'Add to Potluck';
  document.getElementById('potluckName').value     = p ? (p.name || '') : '';
  document.getElementById('potluckDish').value     = p ? (p.dish || '') : '';
  document.getElementById('potluckCategory').value = p ? (p.category || 'main') : 'main';
  document.getElementById('potluckNote').value     = p ? (p.note || '') : '';
  openModal('potluckModal');
}

function savePotluck() {
  const name     = document.getElementById('potluckName').value.trim();
  const dish     = document.getElementById('potluckDish').value.trim();
  const category = document.getElementById('potluckCategory').value;
  const note     = document.getElementById('potluckNote').value.trim();
  if (!name) { document.getElementById('potluckName').focus(); return; }
  if (!dish) { document.getElementById('potluckDish').focus(); return; }

  if (editing.potluck) {
    const idx = state.potluck.findIndex(p => p.id === editing.potluck);
    if (idx >= 0) state.potluck[idx] = { id: editing.potluck, name, dish, category, note };
  } else {
    state.potluck.push({ id: uid(), name, dish, category, note });
  }
  syncToFirestore();
  closeModal('potluckModal');
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
      <td class="row-actions">
        <button class="table-edit"   onclick="openTshirtModal('${esc(t.id)}')" title="Edit">✎</button>
        <button class="table-delete" onclick="deleteTshirt('${esc(t.id)}')"   title="Remove">✕</button>
      </td>
    </tr>`).join('');

  const summary = document.getElementById('tshirtSummary');
  if (summary) {
    const sizes  = ['XS','S','M','L','XL','2XL'];
    const counts = {};
    state.tshirts.forEach(t => { counts[t.size] = (counts[t.size] || 0) + Number(t.qty); });
    const total  = Object.values(counts).reduce((a,b) => a + b, 0);
    summary.innerHTML = sizes.filter(s => counts[s])
      .map(s => `<span class="size-count"><strong>${s}</strong>${counts[s]}</span>`).join('')
      + (total ? `<span class="size-count"><strong>Total</strong>${total}</span>` : '');
  }
}

function deleteTshirt(id) {
  const entry = state.tshirts.find(t => t.id === id);
  if (!entry) return;
  if (!confirm(`Remove ${entry.name}'s shirt order?`)) return;
  state.tshirts = state.tshirts.filter(t => t.id !== id);
  syncToFirestore();
}

function openTshirtModal(id) {
  const t = id ? state.tshirts.find(x => x.id === id) : null;
  editing.tshirt = t ? t.id : null;
  document.getElementById('tshirtModalTitle').textContent = t ? 'Edit T-Shirt Order' : 'Add T-Shirt Order';
  document.getElementById('saveTshirtBtn').textContent    = t ? 'Save Changes'       : 'Add Order';
  document.getElementById('tshirtName').value = t ? (t.name || '') : '';
  document.getElementById('tshirtSize').value = t ? (t.size || 'M') : 'M';
  document.getElementById('tshirtQty').value  = t ? String(t.qty || 1) : '1';
  document.getElementById('tshirtNote').value = t ? (t.note || '') : '';
  openModal('tshirtModal');
}

function saveTshirt() {
  const name = document.getElementById('tshirtName').value.trim();
  const size = document.getElementById('tshirtSize').value;
  const qty  = document.getElementById('tshirtQty').value;
  const note = document.getElementById('tshirtNote').value.trim();
  if (!name) { document.getElementById('tshirtName').focus(); return; }

  if (editing.tshirt) {
    const idx = state.tshirts.findIndex(t => t.id === editing.tshirt);
    if (idx >= 0) state.tshirts[idx] = { id: editing.tshirt, name, size, qty: Number(qty), note };
  } else {
    state.tshirts.push({ id: uid(), name, size, qty: Number(qty), note });
  }
  syncToFirestore();
  closeModal('tshirtModal');
}

// ── Modal helpers ────────────────────────────────────────────
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// ── Utility ──────────────────────────────────────────────────
function esc(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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

  renderItinerary();
  renderTrails();
  renderInfo();
  renderCountdown();
  renderGearCategories();
  renderGearList();
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

  // ── Camper modal wiring ──
  document.getElementById('addCamperBtn').addEventListener('click', () => openCamperModal(null));
  document.getElementById('camperModalClose').addEventListener('click', () => closeModal('camperModal'));
  document.getElementById('camperModal').addEventListener('click', e => { if (e.target.id === 'camperModal') closeModal('camperModal'); });
  document.getElementById('saveCamperBtn').addEventListener('click', saveCamper);

  // ── Reservation modal wiring ──
  document.getElementById('addReservationBtn').addEventListener('click', () => openReservationModal(null));
  document.getElementById('reservationModalClose').addEventListener('click', () => closeModal('reservationModal'));
  document.getElementById('reservationModal').addEventListener('click', e => { if (e.target.id === 'reservationModal') closeModal('reservationModal'); });
  document.getElementById('saveReservationBtn').addEventListener('click', saveReservation);

  // ── Itinerary modal wiring ──
  const addItBtn = document.getElementById('addItineraryBtn');
  if (addItBtn) addItBtn.addEventListener('click', () => openItineraryModal(null));
  const itClose = document.getElementById('itineraryModalClose');
  if (itClose) itClose.addEventListener('click', () => closeModal('itineraryModal'));
  const itModal = document.getElementById('itineraryModal');
  if (itModal) itModal.addEventListener('click', e => { if (e.target.id === 'itineraryModal') closeModal('itineraryModal'); });
  const saveItBtn = document.getElementById('saveItineraryBtn');
  if (saveItBtn) saveItBtn.addEventListener('click', saveItinerary);

  // ── Potluck modal wiring ──
  document.getElementById('addPotluckBtn').addEventListener('click', () => openPotluckModal(null));
  document.getElementById('potluckModalClose').addEventListener('click', () => closeModal('potluckModal'));
  document.getElementById('potluckModal').addEventListener('click', e => { if (e.target.id === 'potluckModal') closeModal('potluckModal'); });
  document.getElementById('savePotluckBtn').addEventListener('click', savePotluck);

  // ── T-shirt modal wiring ──
  document.getElementById('addTshirtBtn').addEventListener('click', () => openTshirtModal(null));
  document.getElementById('tshirtModalClose').addEventListener('click', () => closeModal('tshirtModal'));
  document.getElementById('tshirtModal').addEventListener('click', e => { if (e.target.id === 'tshirtModal') closeModal('tshirtModal'); });
  document.getElementById('saveTshirtBtn').addEventListener('click', saveTshirt);

  // ── Keyboard close ──
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal('camperModal');
      closeModal('reservationModal');
      closeModal('itineraryModal');
      closeModal('potluckModal');
      closeModal('tshirtModal');
    }
  });
});
