// ============================================================
// Jumbo Rocks Campground — Real Map Overlay
// Renders site markers on top of the NPS map image using
// percentage coordinates from SITE_COORDS (data.js).
// ============================================================

function buildMap(claims, attendees) {
  const layer = document.getElementById('mapMarkersLayer');
  if (!layer) return;
  layer.innerHTML = '';

  const att = attendees || [];

  for (const [siteId, [xPct, yPct]] of Object.entries(SITE_COORDS)) {
    const claimedById = claims[siteId];
    const attIdx      = claimedById ? att.findIndex(a => a.id === claimedById) : -1;
    const attendee    = attIdx >= 0 ? att[attIdx] : null;
    const color       = attIdx >= 0 ? AVATAR_COLORS[attIdx % AVATAR_COLORS.length] : null;

    const marker = document.createElement('div');
    marker.className = 'site-marker' + (attendee ? ' claimed' : '');
    marker.dataset.site = siteId;
    marker.style.left = xPct + '%';
    marker.style.top  = yPct + '%';

    if (color) {
      marker.style.background  = color;
      marker.style.borderColor = color;
      marker.style.boxShadow   = `0 0 0 2px ${color}55`;
      marker.textContent = (attendee.name || '?')[0].toUpperCase();
    }

    marker.title = 'Site ' + siteId + (attendee ? ' · ' + attendee.name : ' (available)');
    marker.addEventListener('click', () => openSiteModal(siteId));
    layer.appendChild(marker);
  }

  renderMapLegend(claims, att);
}

function renderMapLegend(claims, attendees) {
  const el = document.getElementById('mapLegend');
  if (!el) return;
  el.innerHTML = '';

  const avail = document.createElement('span');
  avail.className = 'legend-item';
  const availDot = document.createElement('span');
  availDot.className = 'dot dot-available';
  avail.appendChild(availDot);
  avail.appendChild(document.createTextNode('Available'));
  el.appendChild(avail);

  const claimedIds = new Set(Object.values(claims));

  if (claimedIds.size === 0) {
    const claimedItem = document.createElement('span');
    claimedItem.className = 'legend-item';
    const claimedDot = document.createElement('span');
    claimedDot.className = 'dot dot-claimed';
    claimedItem.appendChild(claimedDot);
    claimedItem.appendChild(document.createTextNode('Claimed'));
    el.appendChild(claimedItem);
    return;
  }

  attendees.forEach((a, idx) => {
    if (!claimedIds.has(a.id)) return;
    const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
    const item  = document.createElement('span');
    item.className = 'legend-item';
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.style.background = color;
    dot.style.border = 'none';
    item.appendChild(dot);
    item.appendChild(document.createTextNode(a.name || 'Unknown'));
    el.appendChild(item);
  });
}
