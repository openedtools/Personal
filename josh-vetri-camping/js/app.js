// ============================================================
// Josh Vetri Camping Trip — App Logic
// Uses localStorage for persistence (swap for Firebase/backend later)
// ============================================================

// ── Storage helpers ──────────────────────────────────────────
const store = {
  get: (key, fallback) => {
    try {
      const val = localStorage.getItem('jvc_' + key);
      return val ? JSON.parse(val) : fallback;
    } catch { return fallback; }
  },
  set: (key, val) => {
    try { localStorage.setItem('jvc_' + key, JSON.stringify(val)); } catch {}
  }
};

// ── State ────────────────────────────────────────────────────
let state = {
  attendees: store.get('attendees', []),
  siteClaims: store.get('siteClaims', {}),  // { siteId: attendeeIndex }
  gear:       store.get('gear', DEFAULT_GEAR),
  activeGearCat: 'all',
};

function save() {
  store.set('attendees', state.attendees);
  store.set('siteClaims', state.siteClaims);
  store.set('gear', state.gear);
}

// ── Countdown ────────────────────────────────────────────────
function renderCountdown() {
  const target = new Date('2026-11-25T12:00:00');
  const now    = new Date();
  const diff   = target - now;

  const el = document.getElementById('countdown');
  if (!el) return;

  if (diff <= 0) {
    el.innerHTML = '<span style="color:var(--amber);font-family:\'Playfair Display\',serif;font-size:1.1rem;letter-spacing:0.05em">We\'re there! 🏕️</span>';
    return;
  }

  const days    = Math.floor(diff / 86400000);
  const hours   = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000)  / 60000);
  const seconds = Math.floor((diff % 60000)    / 1000);

  const unit = (num, label) => `
    <div class="countdown-unit">
      <span class="countdown-num">${String(num).padStart(2,'0')}</span>
      <span class="countdown-label">${label}</span>
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
  buildMap(state.siteClaims);
}

// ── Site Modal ───────────────────────────────────────────────
function openSiteModal(siteId) {
  const modal   = document.getElementById('siteModal');
  const title   = document.getElementById('modalTitle');
  const content = document.getElementById('modalContent');

  title.textContent = 'Site ' + siteId;

  const claimIdx = state.siteClaims[siteId];
  const claim    = claimIdx !== undefined ? state.attendees[claimIdx] : null;

  if (claim) {
    content.innerHTML = `
      <div class="site-claimed-by">
        <div class="site-claimed-name">${esc(claim.name)}</div>
        <div style="font-size:0.85rem;color:var(--muted);margin-top:4px">${esc(claim.arrival)} → ${esc(claim.departure)}</div>
        ${claim.note ? `<div style="font-size:0.8rem;color:var(--muted);margin-top:6px;font-style:italic">"${esc(claim.note)}"</div>` : ''}
      </div>
      <div class="site-info-row"><span class="site-info-label">Status</span><span class="site-info-value" style="color:var(--orange)">Claimed</span></div>
      <button class="btn btn-outline" style="margin-top:16px;width:100%" onclick="releaseSite('${siteId}')">Release This Site</button>
    `;
  } else {
    // Show attendees who haven't claimed a site yet
    const unclaimed = state.attendees.filter((a, i) =>
      !Object.values(state.siteClaims).includes(i)
    );

    let claimOptions = '';
    if (unclaimed.length > 0) {
      claimOptions = `
        <div class="form-group" style="margin-top:16px">
          <label>Assign to</label>
          <select id="claimSelect">
            <option value="">-- pick a camper --</option>
            ${unclaimed.map((a, i) => `<option value="${state.attendees.indexOf(a)}">${esc(a.name)}</option>`).join('')}
          </select>
        </div>
        <button class="btn btn-primary" style="width:100%" onclick="claimSiteForAttendee('${siteId}')">Claim This Site</button>
      `;
    } else if (state.attendees.length === 0) {
      claimOptions = `<p style="color:var(--muted);font-size:0.85rem;margin-top:12px">Add yourself to <a href="#attendees" style="color:var(--amber)" onclick="closeSiteModal()">Who's Coming</a> first, then claim a site.</p>`;
    } else {
      claimOptions = `<p style="color:var(--muted);font-size:0.85rem;margin-top:12px">All attendees have sites. Add more campers to claim this site.</p>`;
    }

    content.innerHTML = `
      <div class="site-info-row"><span class="site-info-label">Status</span><span class="site-info-value" style="color:var(--muted)">Available</span></div>
      ${claimOptions}
    `;
  }

  modal.classList.add('open');
}

function closeSiteModal() {
  document.getElementById('siteModal').classList.remove('open');
}

function claimSiteForAttendee(siteId) {
  const select = document.getElementById('claimSelect');
  const idx    = parseInt(select.value, 10);
  if (isNaN(idx)) return;
  // Remove any existing claim by this attendee
  for (const [sid, aidx] of Object.entries(state.siteClaims)) {
    if (aidx === idx) delete state.siteClaims[sid];
  }
  state.siteClaims[siteId] = idx;
  // Update attendee's site field
  state.attendees[idx].site = siteId;
  save();
  renderMap();
  renderAttendees();
  renderStats();
  closeSiteModal();
}

function releaseSite(siteId) {
  const idx = state.siteClaims[siteId];
  if (idx !== undefined && state.attendees[idx]) {
    state.attendees[idx].site = '';
  }
  delete state.siteClaims[siteId];
  save();
  renderMap();
  renderAttendees();
  renderStats();
  closeSiteModal();
}

// ── Attendees ────────────────────────────────────────────────
const AVATAR_COLORS = ['#c4622d','#2d6bc4','#6bc42d','#c42d8a','#2dc4b0','#c4a02d','#8a2dc4'];

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
        <button class="attendee-delete" onclick="deleteAttendee(${i})" title="Remove">✕</button>
        <div class="attendee-avatar" style="background:${color}">${initial}</div>
        <div class="attendee-name">${esc(a.name)}</div>
        ${site}
        ${dates}
        ${note}
      </div>
    `;
  }).join('');
}

function deleteAttendee(i) {
  if (!confirm(`Remove ${state.attendees[i].name} from the trip?`)) return;
  // Release their site
  for (const [sid, aidx] of Object.entries(state.siteClaims)) {
    if (aidx === i) delete state.siteClaims[sid];
    else if (aidx > i) state.siteClaims[sid] = aidx - 1;
  }
  state.attendees.splice(i, 1);
  save();
  renderAttendees();
  renderMap();
  renderStats();
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
    const realIdx = state.gear.indexOf(g);
    const cat     = GEAR_CATEGORIES.find(c => c.id === g.category) || { label: g.category };
    return `
      <div class="gear-item ${g.packed ? 'packed' : ''}">
        <div class="gear-checkbox ${g.packed ? 'checked' : ''}" onclick="toggleGear('${g.id}')"></div>
        <div class="gear-item-info">
          <div class="gear-item-name">${esc(g.name)}</div>
          ${g.owner ? `<div class="gear-item-owner">Brought by: ${esc(g.owner)}</div>` : '<div class="gear-item-owner" style="color:var(--border)">Unassigned</div>'}
        </div>
        <span class="gear-item-cat">${cat.label}</span>
        <button class="gear-delete" onclick="deleteGear('${g.id}')" title="Remove">✕</button>
      </div>
    `;
  }).join('');
}

function toggleGear(id) {
  const item = state.gear.find(g => g.id === id);
  if (item) { item.packed = !item.packed; save(); renderGearList(); renderStats(); }
}

function deleteGear(id) {
  state.gear = state.gear.filter(g => g.id !== id);
  save(); renderGearList(); renderStats();
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

// ── Nav scroll effect ────────────────────────────────────────
function initNav() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.style.borderBottomColor = window.scrollY > 50 ? 'var(--border)' : 'transparent';
  }, { passive: true });
}

// ── Hamburger ────────────────────────────────────────────────
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
  const [y, m, d] = iso.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(m,10)-1]} ${parseInt(d,10)}`;
}

function uid() {
  return 'g' + Date.now().toString(36) + Math.random().toString(36).slice(2,6);
}

// ── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Render everything
  renderStars();
  renderMap();
  renderAttendees();
  renderGearCategories();
  renderGearList();
  renderItinerary();
  renderTrails();
  renderInfo();
  renderStats();
  renderCountdown();
  setInterval(renderCountdown, 1000);
  initNav();

  // ── Hamburger menu ──
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

    const attendee = { name, site, arrival, departure, note };
    state.attendees.push(attendee);
    const newIdx = state.attendees.length - 1;

    // Auto-claim site if specified and valid
    if (site && CAMP_SITES.find(s => s[0] === site)) {
      for (const [sid, aidx] of Object.entries(state.siteClaims)) {
        if (aidx === newIdx) delete state.siteClaims[sid];
      }
      state.siteClaims[site] = newIdx;
    }

    save();
    renderAttendees();
    renderMap();
    renderStats();
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
    save();
    renderGearList();
    renderStats();
    closeModal('gearModal');
  });

  // Keyboard close
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeSiteModal();
      closeModal('attendeeModal');
      closeModal('gearModal');
      closeDrawer();
    }
  });
});
