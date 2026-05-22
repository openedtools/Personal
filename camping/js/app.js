let state = {
  attendees:     [],
  siteClaims:    {},
  gear:          [],
  activeGearCat: 'all',
  loaded:        false,
};

function syncToFirestore() {
  return TRIP_DOC.set({ attendees: state.attendees, siteClaims: state.siteClaims, gear: state.gear });
}

function initFirestore() {
  setSyncStatus('connecting');
  TRIP_DOC.onSnapshot(
    snap => {
      setSyncStatus('live');
      if (snap.exists) {
        const data = snap.data();
        state.attendees  = data.attendees  || [];
        state.siteClaims = data.siteClaims || {};
        state.gear       = data.gear       || DEFAULT_GEAR;
      } else {
        state.attendees = []; state.siteClaims = {}; state.gear = DEFAULT_GEAR;
        syncToFirestore();
      }
      state.loaded = true;
      renderAll();
    },
    err => { setSyncStatus('error'); console.error('Firestore error:', err); }
  );
}

function setSyncStatus(status) {
  const dot = document.getElementById('syncDot');
  const label = document.getElementById('syncLabel');
  if (!dot || !label) return;
  dot.className = 'sync-dot sync-' + status;
  label.textContent = { live:'Live', connecting:'connecting…', error:'offline' }[status] || status;
}

function renderAll() {
  renderMap(); renderAttendees(); renderGearCategories(); renderGearList(); renderStats();
}

function renderCountdown() {
  const diff = new Date('2026-11-25T12:00:00') - new Date();
  const el = document.getElementById('countdown');
  if (!el) return;
  if (diff <= 0) { el.innerHTML = '<span style="color:var(--amber);font-family:\'Playfair Display\',serif;font-size:1.1rem">We\'re there! 🏕️</span>'; return; }
  const d=Math.floor(diff/86400000), h=Math.floor((diff%86400000)/3600000), m=Math.floor((diff%3600000)/60000), s=Math.floor((diff%60000)/1000);
  const unit=(n,l)=>`<div class="countdown-unit"><span class="countdown-num">${String(n).padStart(2,'0')}</span><span class="countdown-label">${l}</span></div>`;
  el.innerHTML = unit(d,'Days')+unit(h,'Hrs')+unit(m,'Min')+unit(s,'Sec');
}

function renderStats() {
  document.getElementById('statAttendees').textContent = state.attendees.length;
  document.getElementById('statSites').textContent     = Object.keys(state.siteClaims).length;
  document.getElementById('statGear').textContent      = state.gear.filter(g=>g.packed).length;
}

function renderStars() {
  const c = document.getElementById('stars');
  if (!c) return;
  for (let i=0;i<180;i++) {
    const s=document.createElement('div'); s.className='star';
    const sz=Math.random()*2.5+0.5;
    s.style.cssText=`width:${sz}px;height:${sz}px;top:${Math.random()*85}%;left:${Math.random()*100}%;--dur:${(Math.random()*4+2).toFixed(1)}s;--delay:${(Math.random()*5).toFixed(1)}s;--op:${(Math.random()*0.5+0.2).toFixed(2)};`;
    c.appendChild(s);
  }
}

function renderMap() { buildMap(state.siteClaims); }

function openSiteModal(siteId) {
  const modal=document.getElementById('siteModal'), title=document.getElementById('modalTitle'), content=document.getElementById('modalContent');
  title.textContent='Site '+siteId;
  const claimedById=state.siteClaims[siteId];
  const claimer=claimedById?state.attendees.find(a=>a.id===claimedById):null;
  if (claimer) {
    content.innerHTML=`<div class="site-claimed-by"><div class="site-claimed-name">${esc(claimer.name)}</div><div style="font-size:0.85rem;color:var(--muted);margin-top:4px">${fmtDate(claimer.arrival)} → ${fmtDate(claimer.departure)}</div>${claimer.note?`<div style="font-size:0.8rem;color:var(--muted);margin-top:6px;font-style:italic">"${esc(claimer.note)}"</div>`:''}</div><div class="site-info-row"><span class="site-info-label">Status</span><span class="site-info-value" style="color:var(--orange)">Claimed</span></div><button class="btn btn-outline" style="margin-top:16px;width:100%" onclick="releaseSite('${siteId}')">Release This Site</button>`;
  } else {
    const unclaimed=state.attendees.filter(a=>!Object.values(state.siteClaims).includes(a.id));
    let opts='';
    if (unclaimed.length>0) opts=`<div class="form-group" style="margin-top:16px"><label>Assign to</label><select id="claimSelect"><option value="">-- pick a camper --</option>${unclaimed.map(a=>`<option value="${esc(a.id)}">${esc(a.name)}</option>`).join('')}</select></div><button class="btn btn-primary" style="width:100%" onclick="claimSiteForAttendee('${siteId}')">Claim This Site</button>`;
    else if (state.attendees.length===0) opts='<p style="color:var(--muted);font-size:0.85rem;margin-top:12px">Add yourself to <a href="#attendees" style="color:var(--amber)" onclick="closeSiteModal()">Who\'s Coming</a> first.</p>';
    else opts='<p style="color:var(--muted);font-size:0.85rem;margin-top:12px">All attendees have sites assigned.</p>';
    content.innerHTML=`<div class="site-info-row"><span class="site-info-label">Status</span><span class="site-info-value" style="color:var(--muted)">Available</span></div>${opts}`;
  }
  modal.classList.add('open');
}

function closeSiteModal() { document.getElementById('siteModal').classList.remove('open'); }

function claimSiteForAttendee(siteId) {
  const attendeeId=document.getElementById('claimSelect').value;
  if (!attendeeId) return;
  for (const [sid,aid] of Object.entries(state.siteClaims)) if (aid===attendeeId) delete state.siteClaims[sid];
  state.siteClaims[siteId]=attendeeId;
  const a=state.attendees.find(a=>a.id===attendeeId); if (a) a.site=siteId;
  syncToFirestore(); closeSiteModal();
}

function releaseSite(siteId) {
  const aid=state.siteClaims[siteId];
  if (aid) { const a=state.attendees.find(a=>a.id===aid); if (a) a.site=''; }
  delete state.siteClaims[siteId];
  syncToFirestore(); closeSiteModal();
}

const AVATAR_COLORS=['#c4622d','#2d6bc4','#6bc42d','#c42d8a','#2dc4b0','#c4a02d','#8a2dc4'];

function renderAttendees() {
  const grid=document.getElementById('attendeesGrid'); if (!grid) return;
  if (state.attendees.length===0) { grid.innerHTML='<div class="empty-state">No campers yet — be the first to add yourself!</div>'; return; }
  grid.innerHTML=state.attendees.map((a,i)=>{
    const color=AVATAR_COLORS[i%AVATAR_COLORS.length], initial=(a.name||'?')[0].toUpperCase();
    return `<div class="attendee-card"><button class="attendee-delete" onclick="deleteAttendee('${esc(a.id)}')" title="Remove">✕</button><div class="attendee-avatar" style="background:${color}">${initial}</div><div class="attendee-name">${esc(a.name)}</div>${a.site?`<span class="attendee-site">Site ${esc(a.site)}</span>`:''  }${(a.arrival&&a.departure)?`<div class="attendee-dates">${fmtDate(a.arrival)} → ${fmtDate(a.departure)}</div>`:''  }${a.note?`<div class="attendee-note">"${esc(a.note)}"</div>`:''}</div>`;
  }).join('');
}

function deleteAttendee(id) {
  const a=state.attendees.find(a=>a.id===id); if (!a) return;
  if (!confirm(`Remove ${a.name} from the trip?`)) return;
  for (const [sid,aid] of Object.entries(state.siteClaims)) if (aid===id) delete state.siteClaims[sid];
  state.attendees=state.attendees.filter(a=>a.id!==id);
  syncToFirestore();
}

function renderGearCategories() {
  const c=document.getElementById('gearCategories'); if (!c) return;
  c.innerHTML=GEAR_CATEGORIES.map(cat=>`<button class="cat-btn ${state.activeGearCat===cat.id?'active':''}" onclick="setGearCat('${cat.id}')">${cat.label}</button>`).join('');
}

function setGearCat(cat) { state.activeGearCat=cat; renderGearCategories(); renderGearList(); }

function renderGearList() {
  const list=document.getElementById('gearList'); if (!list) return;
  const filtered=state.activeGearCat==='all'?state.gear:state.gear.filter(g=>g.category===state.activeGearCat);
  if (filtered.length===0) { list.innerHTML='<div class="empty-state">No items in this category yet.</div>'; return; }
  list.innerHTML=filtered.map(g=>{
    const cat=GEAR_CATEGORIES.find(c=>c.id===g.category)||{label:g.category};
    return `<div class="gear-item ${g.packed?'packed':''}"><div class="gear-checkbox ${g.packed?'checked':''}" onclick="toggleGear('${g.id}')"></div><div class="gear-item-info"><div class="gear-item-name">${esc(g.name)}</div>${g.owner?`<div class="gear-item-owner">Brought by: ${esc(g.owner)}</div>`:'<div class="gear-item-owner" style="color:var(--border)">Unassigned</div>'}</div><span class="gear-item-cat">${cat.label}</span><button class="gear-delete" onclick="deleteGear('${g.id}')" title="Remove">✕</button></div>`;
  }).join('');
}

function toggleGear(id) { const g=state.gear.find(g=>g.id===id); if (g) { g.packed=!g.packed; syncToFirestore(); } }
function deleteGear(id) { state.gear=state.gear.filter(g=>g.id!==id); syncToFirestore(); }

function renderItinerary() {
  const el=document.getElementById('itineraryTimeline'); if (!el) return;
  el.innerHTML=ITINERARY.map(day=>`<div class="itinerary-day"><div class="day-marker"><div class="day-dot"></div><div class="day-num">${esc(day.day)}</div></div><div class="day-content"><div class="day-date">${esc(day.date)}</div><div class="day-title">${esc(day.title)}</div><ul class="day-activities">${day.activities.map(a=>`<li>${esc(a)}</li>`).join('')}</ul></div></div>`).join('');
}

function renderTrails() {
  const grid=document.getElementById('trailsGrid'); if (!grid) return;
  grid.innerHTML=TRAILS.map(t=>`<div class="trail-card"><span class="trail-difficulty difficulty-${t.difficulty}">${t.difficulty}</span><div class="trail-name">${esc(t.name)}</div><div class="trail-stats"><span class="trail-stat"><span>Distance</span>${esc(t.distance)}</span><span class="trail-stat"><span>Time</span>${esc(t.time)}</span><span class="trail-stat"><span>Gain</span>${esc(t.elevation)}</span></div><div class="trail-desc">${esc(t.desc)}</div></div>`).join('');
}

function renderInfo() {
  const grid=document.getElementById('infoGrid'); if (!grid) return;
  grid.innerHTML=INFO_CARDS.map(c=>`<div class="info-card"><span class="info-icon">${c.icon}</span><div class="info-title">${esc(c.title)}</div><ul class="info-items">${c.items.map(i=>`<li>${esc(i)}</li>`).join('')}</ul></div>`).join('');
}

function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
function initNav() {
  const nav=document.getElementById('nav');
  window.addEventListener('scroll',()=>{ nav.style.borderBottomColor=window.scrollY>50?'var(--border)':'transparent'; },{passive:true});
}
function closeDrawer() { document.getElementById('navDrawer').classList.remove('open'); }

function esc(str) {
  if (str==null) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function fmtDate(iso) {
  if (!iso) return '';
  const [,m,d]=iso.split('-');
  return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(m,10)-1]+' '+parseInt(d,10);
}
function uid() { return Date.now().toString(36)+Math.random().toString(36).slice(2,7); }

document.addEventListener('DOMContentLoaded',()=>{
  renderStars(); renderItinerary(); renderTrails(); renderInfo(); renderCountdown();
  setInterval(renderCountdown,1000); initNav(); initFirestore();

  document.getElementById('navHamburger').addEventListener('click',()=>document.getElementById('navDrawer').classList.toggle('open'));
  document.getElementById('modalClose').addEventListener('click',closeSiteModal);
  document.getElementById('siteModal').addEventListener('click',e=>{ if(e.target.id==='siteModal') closeSiteModal(); });

  document.getElementById('addAttendeeBtn').addEventListener('click',()=>{
    document.getElementById('attendeeName').value='';
    document.getElementById('attendeeSite').value='';
    document.getElementById('attendeeArrival').value='2026-11-25';
    document.getElementById('attendeeDeparture').value='2026-11-30';
    document.getElementById('attendeeNote').value='';
    openModal('attendeeModal');
  });
  document.getElementById('attendeeModalClose').addEventListener('click',()=>closeModal('attendeeModal'));
  document.getElementById('attendeeModal').addEventListener('click',e=>{ if(e.target.id==='attendeeModal') closeModal('attendeeModal'); });
  document.getElementById('saveAttendeeBtn').addEventListener('click',()=>{
    const name=document.getElementById('attendeeName').value.trim();
    const site=document.getElementById('attendeeSite').value.trim().toUpperCase();
    const arrival=document.getElementById('attendeeArrival').value;
    const departure=document.getElementById('attendeeDeparture').value;
    const note=document.getElementById('attendeeNote').value.trim();
    if (!name) { document.getElementById('attendeeName').focus(); return; }
    const id=uid(), attendee={id,name,site,arrival,departure,note};
    state.attendees.push(attendee);
    if (site&&CAMP_SITES.find(s=>s[0]===site)&&!state.siteClaims[site]) state.siteClaims[site]=id;
    syncToFirestore(); closeModal('attendeeModal');
  });

  document.getElementById('addGearBtn').addEventListener('click',()=>{
    document.getElementById('gearItemName').value='';
    document.getElementById('gearItemOwner').value='';
    openModal('gearModal');
  });
  document.getElementById('gearModalClose').addEventListener('click',()=>closeModal('gearModal'));
  document.getElementById('gearModal').addEventListener('click',e=>{ if(e.target.id==='gearModal') closeModal('gearModal'); });
  document.getElementById('saveGearBtn').addEventListener('click',()=>{
    const name=document.getElementById('gearItemName').value.trim();
    const category=document.getElementById('gearItemCategory').value;
    const owner=document.getElementById('gearItemOwner').value.trim();
    if (!name) { document.getElementById('gearItemName').focus(); return; }
    state.gear.push({id:uid(),name,category,owner,packed:false});
    syncToFirestore(); closeModal('gearModal');
  });

  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){closeSiteModal();closeModal('attendeeModal');closeModal('gearModal');closeDrawer();}
  });
});
