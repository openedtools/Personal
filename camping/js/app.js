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
  activeRsvp:       'all',  // 'all' | 'Confirmed' | 'Tentative' | 'Out'
  weather:          null,   // cached forecast/climate (null until fetched)
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
  const nav    = document.getElementById('navCountdown');

  if (diff <= 0) {
    if (el) el.innerHTML = '<span style="color:var(--terracotta);font-family:\'Playfair Display\',serif;font-size:1.1rem;letter-spacing:0.05em">We\'re there! 🏕️</span>';
    if (nav) nav.textContent = "We're there! 🏕️";
    return;
  }

  const days    = Math.floor(diff / 86400000);
  const hours   = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000)  / 60000);
  const seconds = Math.floor((diff % 60000)    / 1000);

  if (el) {
    const unit = (num, lbl) => `
      <div class="countdown-unit">
        <span class="countdown-num">${String(num).padStart(2,'0')}</span>
        <span class="countdown-label">${lbl}</span>
      </div>`;
    el.innerHTML = unit(days,'Days') + unit(hours,'Hrs') + unit(minutes,'Min') + unit(seconds,'Sec');
  }

  if (nav) {
    // Short form on mobile so it fits next to the hamburger
    const tight = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
    if      (days > 1)   nav.textContent = tight ? `${days} days` : `${days} days to the desert`;
    else if (days === 1) nav.textContent = tight ? '1 day!'       : "1 day · tomorrow!";
    else                 nav.textContent = `${hours}h ${minutes}m`;
  }
}

// ── Weather (Open-Meteo, no API key) ──────────────────────────
const WEATHER_CACHE_KEY = 'dt2026_weather_v1';
const WEATHER_CACHE_TTL = 60 * 60 * 1000; // 1 hour
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast'
  + '?latitude=34.0108&longitude=-116.0503'
  + '&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code'
  + '&temperature_unit=fahrenheit&timezone=America%2FLos_Angeles'
  + '&start_date=2026-11-22&end_date=2026-11-28';

// WMO weather code → emoji. Coarse but readable.
function weatherEmoji(code) {
  if (code == null)               return '·';
  if (code === 0)                 return '☀️';
  if ([1,2].includes(code))       return '🌤';
  if (code === 3)                 return '☁️';
  if ([45,48].includes(code))     return '🌫';
  if (code >= 51 && code <= 57)   return '🌦';
  if (code >= 61 && code <= 67)   return '🌧';
  if (code >= 71 && code <= 77)   return '🌨';
  if (code >= 80 && code <= 82)   return '🌧';
  if (code >= 95)                 return '⛈';
  return '·';
}

function renderWeather() {
  const grid = document.getElementById('weatherGrid');
  const sub  = document.getElementById('weatherSub');
  if (!grid || !sub) return;

  // Try cache
  let cached = null;
  try {
    const raw = localStorage.getItem(WEATHER_CACHE_KEY);
    if (raw) {
      const obj = JSON.parse(raw);
      if (obj && obj.ts && Date.now() - obj.ts < WEATHER_CACHE_TTL) cached = obj.data;
    }
  } catch (e) {}

  if (cached) {
    paintWeather(cached);
  } else {
    paintFallback('Loading forecast…');
    fetchWeather();
  }
}

function fetchWeather() {
  fetch(WEATHER_URL)
    .then(r => r.ok ? r.json() : null)
    .then(data => {
      if (!data || !data.daily || !data.daily.time || data.daily.time.length === 0) {
        paintFallback();
        return;
      }
      try { localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify({ ts: Date.now(), data })); } catch (e) {}
      paintWeather(data);
    })
    .catch(() => paintFallback());
}

function paintWeather(data) {
  const grid = document.getElementById('weatherGrid');
  const sub  = document.getElementById('weatherSub');
  if (!grid || !sub) return;

  const days = data.daily.time;
  // If the API gave us mostly nulls (trip too far in future for forecast),
  // fall back to climate text.
  const valid = data.daily.temperature_2m_max.filter(v => v != null).length;
  if (valid < days.length / 2) {
    paintFallback();
    return;
  }

  sub.textContent = 'Forecast from Open-Meteo. Refreshed hourly.';

  const dow = (iso) => {
    const d = new Date(iso + 'T12:00:00');
    return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()];
  };

  grid.innerHTML = days.map((iso, i) => {
    const hi = data.daily.temperature_2m_max[i];
    const lo = data.daily.temperature_2m_min[i];
    const pp = data.daily.precipitation_probability_max[i];
    const wc = data.daily.weather_code[i];
    return `
      <div class="weather-card">
        <div class="weather-dow">${dow(iso)}</div>
        <div class="weather-date">${fmtDate(iso)}</div>
        <div class="weather-icon">${weatherEmoji(wc)}</div>
        <div class="weather-temps">
          <strong>${hi != null ? Math.round(hi) + '°' : '—'}</strong>
          <span class="lo">${lo != null ? Math.round(lo) + '°' : ''}</span>
        </div>
        ${pp != null && pp > 0 ? `<div class="weather-precip">${pp}% precip</div>` : ''}
      </div>`;
  }).join('');
}

function paintFallback(loadingMsg) {
  const grid = document.getElementById('weatherGrid');
  const sub  = document.getElementById('weatherSub');
  if (!grid || !sub) return;
  if (loadingMsg) {
    sub.textContent = loadingMsg;
    grid.innerHTML = '';
    return;
  }
  sub.textContent = 'Forecast available about 14 days out. Typical late-November Joshua Tree weather:';
  grid.innerHTML = `
    <div class="weather-fallback" style="grid-column: 1 / -1;">
      <div style="font-size:2rem;margin-bottom:8px">🌤️</div>
      Highs <strong>55–65°F</strong> · Lows <strong>30–40°F</strong> · Windy nights · Almost no chance of rain
    </div>`;
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
  // Render into every container present (Welcome + duplicate on Campers).
  const targets = [
    document.getElementById('arrivalTimeline'),
    document.getElementById('arrivalTimelineCampers'),
  ].filter(Boolean);
  if (targets.length === 0) return;

  const N = GANTT_DAYS.length;

  if (state.campers.length === 0) {
    const empty = '<div class="empty-state">Add campers to see the arrival timeline.</div>';
    targets.forEach(t => t.innerHTML = empty);
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
    if (rsvpOf(c) === 'Out') return; // skip "Out" on the timeline
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
    const tentative = rsvpOf(c) === 'Tentative';

    html += `
      <div class="gantt-row${tentative ? ' gantt-row-tentative' : ''}">
        <div class="gantt-label-col">
          <span class="gantt-avatar" style="background:${color}">${esc(initial)}</span>
          <div class="gantt-name-info">
            <span class="gantt-camper-name">${esc(c.name)}${tentative ? ' <span class="gantt-tentative-tag">tentative</span>' : ''}</span>
            ${c.setup ? `<span class="gantt-setup-type">${esc(c.setup)}</span>` : ''}
          </div>
        </div>
        <div class="gantt-days-area">
          ${Array(N).fill(0).map(() => '<div class="gantt-cell"></div>').join('')}
          ${hasBar ? `
            <div class="gantt-bar${tentative ? ' gantt-bar-tentative' : ''}"
                 style="left:${leftPct}%;width:${widthPct}%;background:${color};"
                 title="${esc(c.name)}: ${fmtDate(c.arrival)} → ${fmtDate(c.departure)}">
              ${barSpan >= 2 ? `<span class="gantt-bar-label">${fmtDate(c.arrival)} → ${fmtDate(c.departure)}</span>` : ''}
            </div>` : ''}
        </div>
      </div>`;
  });

  html += `</div></div>`;
  targets.forEach(t => t.innerHTML = html);
}

// ── Campers ───────────────────────────────────────────────────
function rsvpOf(c) { return c.rsvp || 'Confirmed'; }

function renderCampers() {
  const grid = document.getElementById('campersGrid');
  if (!grid) return;

  // Update filter pill counts + active state
  const filterEl = document.getElementById('rsvpFilter');
  if (filterEl) {
    const counts = { all: state.campers.length, Confirmed: 0, Tentative: 0, Out: 0 };
    state.campers.forEach(c => { counts[rsvpOf(c)] = (counts[rsvpOf(c)] || 0) + 1; });
    filterEl.querySelectorAll('.rsvp-pill').forEach(btn => {
      const k = btn.dataset.rsvp;
      btn.classList.toggle('active', state.activeRsvp === k);
      const label = (k === 'all' ? 'All' : k) + ` · ${counts[k] || 0}`;
      btn.textContent = label;
    });
  }

  const filtered = state.campers.filter(c =>
    state.activeRsvp === 'all' || rsvpOf(c) === state.activeRsvp);

  if (filtered.length === 0) {
    grid.innerHTML = state.campers.length === 0
      ? '<div class="empty-state">No campers yet — be the first to add yourself!</div>'
      : `<div class="empty-state">Nobody with status "${esc(state.activeRsvp)}" yet.</div>`;
    return;
  }

  grid.innerHTML = filtered.map((c) => {
    const i       = state.campers.findIndex(x => x.id === c.id); // stable color across filter changes
    const color   = AVATAR_COLORS[i % AVATAR_COLORS.length];
    const initial = (c.name || '?')[0].toUpperCase();
    const adults  = Number(c.adults) || 1;
    const kids    = Number(c.kids)   || 0;
    const peopleTxt = adults + (kids > 0
      ? ` adult${adults !== 1 ? 's' : ''} · ${kids} kid${kids !== 1 ? 's' : ''}`
      : ` adult${adults !== 1 ? 's' : ''}`);
    const rsvp    = rsvpOf(c);
    const rsvpKey = rsvp.toLowerCase();

    return `
      <div class="attendee-card rsvp-${rsvpKey}">
        <div class="card-actions">
          <button class="card-edit" onclick="openCamperModal('${esc(c.id)}')" title="Edit">✎</button>
          <button class="attendee-delete" onclick="deleteCamper('${esc(c.id)}')" title="Remove">✕</button>
        </div>
        <div class="attendee-avatar" style="background:${color}">${initial}</div>
        <div class="attendee-name">${esc(c.name)}</div>
        <div class="card-badges">
          ${c.setup ? `<span class="camper-setup-badge">${esc(c.setup)}</span>` : ''}
          <span class="rsvp-badge rsvp-badge-${rsvpKey}">${esc(rsvp)}</span>
        </div>
        <div class="camper-people">${esc(peopleTxt)}</div>
        ${(c.arrival && c.departure) ? `<div class="attendee-dates">${fmtDate(c.arrival)} → ${fmtDate(c.departure)}</div>` : ''}
        ${c.emergency ? `<div class="attendee-emergency">🚨 Emergency contact: ${esc(c.emergency)}</div>` : ''}
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
  setText('camperModalTitle', c ? 'Edit Camper' : 'Add Camper');
  setText('saveCamperBtn',    c ? 'Save Changes' : 'Add to Trip');
  setField('camperName',      c ? c.name      : '');
  setField('camperAdults',    c ? String(c.adults || 1) : '1');
  setField('camperKids',      c ? String(c.kids   || 0) : '0');
  setField('camperSetup',     c ? (c.setup || 'Tent')   : 'Tent');
  setField('camperRsvp',      c ? (c.rsvp  || 'Confirmed') : 'Confirmed');
  setField('camperArrival',   c ? (c.arrival   || '2026-11-25') : '2026-11-25');
  setField('camperDeparture', c ? (c.departure || '2026-11-28') : '2026-11-28');
  setField('camperEmergency', c ? c.emergency : '');
  setField('camperNote',      c ? c.note      : '');
  openModal('camperModal');
}

function saveCamper() {
  const name      = getField('camperName').trim();
  const adults    = parseInt(getField('camperAdults', '1')) || 1;
  const kids      = parseInt(getField('camperKids',   '0')) || 0;
  const setup     = getField('camperSetup', 'Tent');
  const rsvp      = getField('camperRsvp',  'Confirmed') || 'Confirmed';
  const arrival   = getField('camperArrival',   '2026-11-25');
  const departure = getField('camperDeparture', '2026-11-28');
  const emergency = getField('camperEmergency').trim();
  const note      = getField('camperNote').trim();

  if (!name) { const el = document.getElementById('camperName'); if (el) el.focus(); return; }

  const record = { name, adults, kids, setup, rsvp, arrival, departure, emergency, note };

  if (editing.camper) {
    const idx = state.campers.findIndex(c => c.id === editing.camper);
    if (idx >= 0) state.campers[idx] = { id: editing.camper, ...record };
  } else {
    state.campers.push({ id: uid(), ...record });
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
  setText('reservationModalTitle', r ? 'Edit Reservation' : 'Add Reservation');
  setText('saveReservationBtn',    r ? 'Save Changes'     : 'Save Reservation');
  setField('resOwner',     r ? r.reservedBy : '');
  setField('resSiteNums',  r ? (r.sites || []).map(s => s.siteNum).join(', ') : '');
  setField('resArrival',   r ? (r.arrival   || '2026-11-25') : '2026-11-25');
  setField('resDeparture', r ? (r.departure || '2026-11-28') : '2026-11-28');
  setField('resNote',      r ? r.note : '');
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
  setText('itineraryModalTitle', d ? 'Edit Day' : 'Add Day');
  setText('saveItineraryBtn',    d ? 'Save Changes' : 'Add Day');
  setField('itDay',        d ? d.day   : '');
  setField('itDate',       d ? d.date  : '');
  setField('itTitle',      d ? d.title : '');
  setField('itActivities', d && Array.isArray(d.activities) ? d.activities.join('\n') : '');
  openModal('itineraryModal');
}

function saveItinerary() {
  const day        = getField('itDay').trim();
  const date       = getField('itDate').trim();
  const title      = getField('itTitle').trim();
  const activities = getField('itActivities')
    .split('\n').map(s => s.trim()).filter(Boolean);

  if (!date && !title && activities.length === 0 && !day) {
    const el = document.getElementById('itDate'); if (el) el.focus();
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
  setText('potluckModalTitle', p ? 'Edit Potluck Entry' : 'Sign Up for Potluck');
  setText('savePotluckBtn',    p ? 'Save Changes'       : 'Add to Potluck');
  setField('potluckName',     p ? p.name : '');
  setField('potluckDish',     p ? p.dish : '');
  setField('potluckCategory', p ? (p.category || 'main') : 'main');
  setField('potluckNote',     p ? p.note : '');
  openModal('potluckModal');
}

function savePotluck() {
  const name     = getField('potluckName').trim();
  const dish     = getField('potluckDish').trim();
  const category = getField('potluckCategory', 'main');
  const note     = getField('potluckNote').trim();
  if (!name) { const el = document.getElementById('potluckName'); if (el) el.focus(); return; }
  if (!dish) { const el = document.getElementById('potluckDish'); if (el) el.focus(); return; }

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
    const sizes  = [
      'XS','S','M','L','XL','2XL',
      'Youth XS','Youth S','Youth M','Youth L','Youth XL',
      '2T','3T','4T','5T',
    ];
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
  setText('tshirtModalTitle', t ? 'Edit T-Shirt Order' : 'Add T-Shirt Order');
  setText('saveTshirtBtn',    t ? 'Save Changes'       : 'Add Order');
  setField('tshirtName', t ? t.name : '');
  setField('tshirtSize', t ? (t.size || 'M')  : 'M');
  setField('tshirtQty',  t ? String(t.qty || 1) : '1');
  setField('tshirtNote', t ? t.note : '');
  openModal('tshirtModal');
}

function saveTshirt() {
  const name = getField('tshirtName').trim();
  const size = getField('tshirtSize', 'M');
  const qty  = getField('tshirtQty', '1');
  const note = getField('tshirtNote').trim();
  if (!name) { const el = document.getElementById('tshirtName'); if (el) el.focus(); return; }

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
function openModal(id)  { const el = document.getElementById(id); if (el) el.classList.add('open'); }
function closeModal(id) { const el = document.getElementById(id); if (el) el.classList.remove('open'); }

// Defensive setters so a slightly-stale cached HTML can't break new
// JS by throwing on a missing element. (No-op if id isn't in DOM.)
function setField(id, val) { const el = document.getElementById(id); if (el) el.value = val == null ? '' : val; }
function getField(id, def) { const el = document.getElementById(id); return el ? el.value : (def == null ? '' : def); }
function setText (id, txt) { const el = document.getElementById(id); if (el) el.textContent = txt; }

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
  renderWeather();
  setInterval(renderCountdown, 1000);
  initTabs();
  initMobileMenu();

  // Safely attach a listener — no-op if the element doesn't exist
  // in a slightly-stale cached HTML. Prevents one missing button
  // from aborting all subsequent wiring.
  const on = (id, ev, fn) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener(ev, fn);
  };

  // Password gate
  const pwOverlay = document.getElementById('pwOverlay');
  if (isAuthenticated()) {
    if (pwOverlay) pwOverlay.classList.add('hidden');
    initFirestore();
  } else {
    on('pwSubmit', 'click', submitPassword);
    on('pwInput',  'keydown', e => { if (e.key === 'Enter') submitPassword(); });
  }

  // ── Camper modal wiring ──
  on('addCamperBtn',     'click', () => openCamperModal(null));
  on('camperModalClose', 'click', () => closeModal('camperModal'));
  on('camperModal',      'click', e => { if (e.target.id === 'camperModal') closeModal('camperModal'); });
  on('saveCamperBtn',    'click', saveCamper);

  // RSVP filter pills
  on('rsvpFilter', 'click', e => {
    const btn = e.target.closest('.rsvp-pill');
    if (!btn) return;
    state.activeRsvp = btn.dataset.rsvp;
    renderCampers();
  });

  // ── Reservation modal wiring ──
  on('addReservationBtn',     'click', () => openReservationModal(null));
  on('reservationModalClose', 'click', () => closeModal('reservationModal'));
  on('reservationModal',      'click', e => { if (e.target.id === 'reservationModal') closeModal('reservationModal'); });
  on('saveReservationBtn',    'click', saveReservation);

  // ── Itinerary modal wiring ──
  on('addItineraryBtn',     'click', () => openItineraryModal(null));
  on('itineraryModalClose', 'click', () => closeModal('itineraryModal'));
  on('itineraryModal',      'click', e => { if (e.target.id === 'itineraryModal') closeModal('itineraryModal'); });
  on('saveItineraryBtn',    'click', saveItinerary);

  // ── Potluck modal wiring ──
  on('addPotluckBtn',     'click', () => openPotluckModal(null));
  on('potluckModalClose', 'click', () => closeModal('potluckModal'));
  on('potluckModal',      'click', e => { if (e.target.id === 'potluckModal') closeModal('potluckModal'); });
  on('savePotluckBtn',    'click', savePotluck);

  // ── T-shirt modal wiring ──
  on('addTshirtBtn',     'click', () => openTshirtModal(null));
  on('tshirtModalClose', 'click', () => closeModal('tshirtModal'));
  on('tshirtModal',      'click', e => { if (e.target.id === 'tshirtModal') closeModal('tshirtModal'); });
  on('saveTshirtBtn',    'click', saveTshirt);

  // ── Map lightbox wiring ──
  on('mapExpandBtn',  'click', () => openModal('mapLightbox'));
  on('mapImg',        'click', () => openModal('mapLightbox'));
  on('lightboxClose', 'click', () => closeModal('mapLightbox'));
  on('mapLightbox',   'click', e => {
    if (e.target.id === 'mapLightbox' || e.target.tagName === 'IMG') closeModal('mapLightbox');
  });

  // ── Keyboard close ──
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal('camperModal');
      closeModal('reservationModal');
      closeModal('itineraryModal');
      closeModal('potluckModal');
      closeModal('tshirtModal');
      closeModal('mapLightbox');
    }
  });
});
