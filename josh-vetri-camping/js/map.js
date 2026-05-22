// ============================================================
// Jumbo Rocks Campground — SVG Map Generator
// Stylized schematic, not to scale
// ============================================================

// Site data: [id, x, y, loop]
const CAMP_SITES = [
  // Loop A (northwest)
  ['A1',  80, 200], ['A2',  80, 230], ['A3',  80, 260],
  ['A4', 115, 195], ['A5', 115, 225], ['A6', 115, 255],
  ['A7', 115, 285], ['A8',  80, 290],

  // Loop B (west-central)
  ['B1', 160, 160], ['B2', 160, 190], ['B3', 160, 220],
  ['B4', 160, 250], ['B5', 195, 155], ['B6', 195, 185],
  ['B7', 195, 215], ['B8', 195, 245], ['B9', 195, 275],
  ['B10',160, 280],

  // Loop C (central-north)
  ['C1', 280, 100], ['C2', 310, 100], ['C3', 340, 100],
  ['C4', 280, 130], ['C5', 310, 130], ['C6', 340, 130],
  ['C7', 370, 110], ['C8', 370, 140],

  // Loop D (central)
  ['D1', 290, 210], ['D2', 320, 195], ['D3', 350, 185],
  ['D4', 380, 195], ['D5', 380, 225], ['D6', 350, 240],
  ['D7', 320, 240], ['D8', 290, 240],

  // Loop E (central-east upper)
  ['E1', 450, 130], ['E2', 480, 120], ['E3', 510, 120],
  ['E4', 540, 130], ['E5', 540, 160], ['E6', 510, 165],
  ['E7', 480, 165], ['E8', 450, 165],

  // Loop F (east-upper)
  ['F1', 600, 80],  ['F2', 630, 75],  ['F3', 660, 80],
  ['F4', 690, 95],  ['F5', 690, 125], ['F6', 660, 130],
  ['F7', 630, 130], ['F8', 600, 125], ['F9', 600, 110],

  // Loop G (east-mid)
  ['G1', 600, 220], ['G2', 630, 210], ['G3', 660, 210],
  ['G4', 690, 220], ['G5', 690, 250], ['G6', 660, 255],
  ['G7', 630, 255], ['G8', 600, 250],

  // Loop H (far east)
  ['H1', 760, 150], ['H2', 790, 140], ['H3', 820, 150],
  ['H4', 820, 180], ['H5', 790, 185], ['H6', 760, 180],

  // Loop J (south-central)
  ['J1', 320, 360], ['J2', 350, 350], ['J3', 380, 350],
  ['J4', 410, 360], ['J5', 410, 390], ['J6', 380, 395],
  ['J7', 350, 395], ['J8', 320, 390],

  // Loop K (south-east)
  ['K1', 500, 380], ['K2', 530, 370], ['K3', 560, 370],
  ['K4', 590, 380], ['K5', 590, 410], ['K6', 560, 415],
  ['K7', 530, 415], ['K8', 500, 410],

  // Loop L (far south)
  ['L1', 460, 480], ['L2', 490, 470], ['L3', 520, 470],
  ['L4', 550, 480], ['L5', 550, 510], ['L6', 520, 515],
  ['L7', 490, 515], ['L8', 460, 510],

  // Scattered sites
  ['110', 240, 340], ['111', 270, 340], ['112', 240, 370],
  ['113', 680, 340], ['114', 710, 330], ['115', 710, 360],
  ['116', 740, 370], ['117', 740, 340],
  ['118', 640, 450], ['119', 670, 450], ['120', 670, 480],
  ['121', 640, 480], ['122', 700, 465],
  ['123', 150, 380], ['124', 180, 375],
];

// Boulder formations [x, y, rx, ry, rotation]
const BOULDERS = [
  // Large central formations
  [240, 170, 45, 32, 20],
  [240, 170, 30, 22, -15],
  [430, 200, 55, 38, 10],
  [430, 200, 35, 25, 35],
  [560, 180, 42, 30, -10],
  [650, 165, 48, 35, 15],
  [170, 110, 38, 26, 25],
  [310, 50,  44, 30, -5],
  [480, 55,  38, 28, 20],
  [730, 100, 42, 30, -20],
  [830, 100, 36, 25, 10],
  [760, 260, 40, 28, 30],
  [690, 310, 38, 26, -15],
  [450, 310, 44, 32, 10],
  [380, 450, 48, 34, -10],
  [560, 540, 42, 30, 20],
  [200, 450, 36, 24, 15],
  [100, 380, 32, 22, -5],
  [820, 380, 40, 28, 25],
  [740, 510, 36, 26, -10],
  [300, 510, 44, 32, 15],
  [430, 560, 38, 26, -20],
  [160, 330, 28, 20, 10],
  [580, 300, 34, 24, -15],
  [860, 230, 32, 22, 5],
  [50,  130, 30, 20, 20],
  [50,  320, 28, 18, -10],
  [860, 430, 34, 24, 15],
];

// Roads [x1,y1, x2,y2] for main roads
const ROADS = [
  // Main park road (horizontal, middle)
  [0, 310, 900, 310],
  // Spur roads
  [100, 310, 100, 170],
  [200, 310, 200, 130],
  [330, 310, 330, 170],
  [460, 310, 460, 170],
  [460, 170, 620, 150],
  [620, 150, 750, 155],
  [750, 155, 840, 155],
  [620, 310, 620, 240],
  [780, 310, 780, 165],
  [330, 310, 330, 390],
  [530, 310, 530, 420],
  [530, 420, 530, 540],
  [200, 310, 200, 410],
  [690, 310, 690, 390],
  [690, 390, 690, 510],
];

function buildMap(claims) {
  const svg = document.getElementById('campMap');
  if (!svg) return;
  svg.innerHTML = '';

  const ns = 'http://www.w3.org/2000/svg';

  const mk = (tag, attrs) => {
    const el = document.createElementNS(ns, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    return el;
  };

  // Background
  svg.appendChild(mk('rect', { x: 0, y: 0, width: 900, height: 620, fill: '#17110a' }));

  // Sandy desert ground texture (subtle dots)
  const defs = mk('defs', {});
  const pattern = mk('pattern', { id: 'sand', x: 0, y: 0, width: 20, height: 20, patternUnits: 'userSpaceOnUse' });
  const sandRect = mk('rect', { x: 0, y: 0, width: 20, height: 20, fill: '#1a1208' });
  const dot1 = mk('circle', { cx: 3, cy: 7,  r: 0.6, fill: '#2a1e10', opacity: 0.8 });
  const dot2 = mk('circle', { cx: 13, cy: 3, r: 0.5, fill: '#2a1e10', opacity: 0.7 });
  const dot3 = mk('circle', { cx: 7, cy: 15, r: 0.4, fill: '#2a1e10', opacity: 0.6 });
  pattern.append(sandRect, dot1, dot2, dot3);
  defs.appendChild(pattern);
  svg.appendChild(defs);
  svg.appendChild(mk('rect', { x: 0, y: 0, width: 900, height: 620, fill: 'url(#sand)' }));

  // Roads
  for (const [x1, y1, x2, y2] of ROADS) {
    svg.appendChild(mk('line', { x1, y1, x2, y2, class: 'map-road' }));
  }

  // Boulders
  for (const [bx, by, rx, ry, rot] of BOULDERS) {
    const g = mk('g', { transform: `rotate(${rot} ${bx} ${by})` });
    // Outer boulder
    g.appendChild(mk('ellipse', { cx: bx, cy: by, rx, ry, class: 'map-boulder' }));
    // Inner highlight
    g.appendChild(mk('ellipse', {
      cx: bx - rx * 0.2, cy: by - ry * 0.25,
      rx: rx * 0.55, ry: ry * 0.45,
      fill: '#6e5e4a', opacity: '0.35'
    }));
    // Shadow
    g.appendChild(mk('ellipse', {
      cx: bx + rx * 0.15, cy: by + ry * 0.3,
      rx: rx * 0.7, ry: ry * 0.45,
      fill: '#0d0904', opacity: '0.5'
    }));
    svg.appendChild(g);
  }

  // Area labels
  const areaLabels = [
    [100, 85, 'Loop A'],
    [180, 50, 'Loop B'],
    [330, 20, 'Loops C/D'],
    [500, 45, 'Loop E/F'],
    [720, 55, 'Loop H'],
    [625, 175, 'Loop G'],
    [345, 415, 'Loop J'],
    [545, 445, 'Loop K'],
    [505, 560, 'Loop L'],
  ];
  for (const [lx, ly, label] of areaLabels) {
    svg.appendChild(mk('text', { x: lx, y: ly, class: 'map-area-label' })).textContent = label;
  }

  // Sites
  for (const [id, sx, sy] of CAMP_SITES) {
    const claim = claims[id];
    const rect = mk('rect', {
      x: sx - 13, y: sy - 9, width: 26, height: 18,
      class: 'map-site' + (claim ? ' claimed' : ''),
      'data-site': id,
      rx: 3
    });
    svg.appendChild(rect);

    const label = mk('text', { x: sx, y: sy + 1, class: 'map-site-label' });
    label.textContent = id;
    svg.appendChild(label);
  }

  // Entrance arrow
  const entryG = mk('g', {});
  entryG.appendChild(mk('text', { x: 820, y: 325, class: 'map-entrance-label', 'text-anchor': 'start' })).textContent = '→ PARK BLVD';
  svg.appendChild(entryG);

  // Compass rose
  const cx = 860, cy = 555;
  const compass = mk('g', {});
  compass.appendChild(mk('circle', { cx, cy, r: 18, fill: 'none', stroke: '#3d2f1e', 'stroke-width': 1 }));
  // N arrow
  compass.appendChild(mk('polygon', { points: `${cx},${cy-14} ${cx-5},${cy+2} ${cx+5},${cy+2}`, fill: '#e8a44a' }));
  compass.appendChild(mk('polygon', { points: `${cx},${cy+14} ${cx-5},${cy-2} ${cx+5},${cy-2}`, fill: '#3d2f1e' }));
  const nLabel = mk('text', { x: cx, y: cy - 18, class: 'map-compass', 'text-anchor': 'middle', 'font-size': 9 });
  nLabel.textContent = 'N';
  compass.appendChild(nLabel);
  svg.appendChild(compass);

  // Legend
  const leg = mk('g', {});
  leg.appendChild(mk('rect', { x: 20, y: 560, width: 180, height: 50, fill: 'rgba(0,0,0,0.5)', rx: 6 }));
  const legTitle = mk('text', { x: 110, y: 575, class: 'map-entrance-label', 'text-anchor': 'middle', 'font-size': 8 });
  legTitle.textContent = 'JUMBO ROCKS CAMPGROUND';
  leg.appendChild(legTitle);
  const legSub = mk('text', { x: 110, y: 587, class: 'map-compass', 'text-anchor': 'middle', 'font-size': 7, fill: '#7a6a55' });
  legSub.textContent = 'Joshua Tree National Park · 4,360 ft elevation';
  leg.appendChild(legSub);
  const legSub2 = mk('text', { x: 110, y: 600, class: 'map-compass', 'text-anchor': 'middle', 'font-size': 7, fill: '#7a6a55' });
  legSub2.textContent = '124 sites · First-come, First-served';
  leg.appendChild(legSub2);
  svg.appendChild(leg);

  // Click handlers
  svg.querySelectorAll('.map-site').forEach(el => {
    el.addEventListener('click', () => openSiteModal(el.dataset.site));
  });
}
