// ============================================================
// Static data + real Jumbo Rocks site coordinates
// ============================================================

// Campsite positions as [x%, y%] on the official NPS map image.
// x=0 is left edge, x=100 is right edge; y=0 top, y=100 bottom.
const SITE_COORDS = {
  '1':  [13.5,50], '2':  [14,  53], '3':  [16,  53], '4':  [17,  54], '5':  [18,  55],
  '6':  [21,  47], '7':  [22,  47], '8':  [23,  48], '9':  [23,  51],
  '10': [27,  43], '11': [28,  43], '12': [28,  45], '13': [29,  46], '14': [30,  46],
  '15': [31,  45], '16': [31,  43],
  '17': [35,  52], '18': [35,  55], '19': [34,  58], '20': [37,  52], '21': [37,  57],
  '22': [38,  51], '23': [39,  52], '24': [39,  48], '25': [40,  47], '26': [40,  51],
  '27': [37,  55], '28': [36,  59], '29': [37,  60], '30': [36,  63], '31': [39,  63],
  '32': [38,  60], '33': [40,  61],
  '34': [43,  55], '35': [43,  53], '36': [43,  57], '37': [46,  53], '38': [46,  50],
  '39': [47,  45], '40': [48,  52], '41': [48,  54], '42': [49,  55], '43': [50,  55],
  '44': [51,  55], '45': [51,  52], '46': [49,  57], '47': [48,  57], '48': [48,  59],
  '49': [47,  61], '50': [48,  63], '51': [47,  66],
  '52': [50,  66], '53': [51,  65], '54': [52,  64], '55': [53,  67], '56': [52,  71],
  '57': [53,  71], '58': [54,  72], '59': [54,  71], '60': [55,  70], '61': [55,  66],
  '62': [56,  68], '63': [57,  69], '64': [57,  67], '65': [57,  65], '66': [57.5,67],
  '67': [58,  64], '68': [59,  65], '69': [60,  64], '70': [60,  63],
  '71': [62,  57], '72': [62,  61], '73': [63,  62], '74': [63,  64], '75': [63,  60],
  '76': [64,  57], '77': [68,  40], '78': [68,  38], '79': [67,  40],
  '80': [63,  59], '81': [62.5,60], '82': [61,  60],
  '83': [59,  55], '84': [59,  53], '85': [57,  51], '86': [57,  48], '87': [59,  46],
  '88': [60,  45], '89': [61,  43], '90': [55,  47], '91': [55,  43], '92': [58,  41],
  '93': [59,  38], '94': [57,  36], '95': [59,  29], '96': [57,  28], '97': [55,  27],
  '98': [56,  32], '99': [55,  29], '100':[54,  28], '101':[53,  29], '102':[54,  32],
  '103':[56,  33], '104':[53,  30],
  '105':[44,  37], '106':[46,  38], '107':[46,  41], '108':[49,  42], '109':[50,  43],
  '110':[50,  45], '111':[47,  40], '112':[45,  41],
  '113':[34,  38], '114':[31,  37], '115':[30,  37], '116':[29,  40], '117':[27,  39],
  '118':[24,  37], '119':[24,  34], '120':[24,  33], '121':[24,  38],
  '122':[18,  46], '123':[18,  47], '124':[17,  47],
};

// Avatar colors — shared across map.js and app.js (data.js loads first)
const AVATAR_COLORS = ['#c4622d','#2d6bc4','#6bc42d','#c42d8a','#2dc4b0','#c4a02d','#8a2dc4'];

const ITINERARY = [
  {
    date: "Wed, Nov 25", day: "Day 1", title: "Arrival Day",
    activities: [
      "Drive in, set up camp before dark — golden hour over the boulders",
      "First campfire, introductions, snacks & drinks",
      "Stargazing: Joshua Tree has near-zero light pollution — Milky Way visible",
      "Settle in and soak it up"
    ]
  },
  {
    date: "Thu, Nov 26", day: "Day 2", title: "Thanksgiving in the Desert",
    activities: [
      "Morning: easy hike to Skull Rock (1.7 mi loop from the campground)",
      "Afternoon: big group Thanksgiving feast at camp",
      "Turkey (or tofurky), sides, and all the fixings — campfire style",
      "Evening: bonfire, s'mores, live music if anyone brought a guitar",
      "Night hike if weather cooperates"
    ]
  },
  {
    date: "Fri, Nov 27", day: "Day 3", title: "Hike & Explore",
    activities: [
      "Morning: Ryan Mountain summit hike (3 mi, sweeping 360° views)",
      "Afternoon: Cholla Cactus Garden — otherworldly loop",
      "Arch Rock Nature Trail (1.3 mi) — massive boulder arch",
      "Sunset at Keys View overlook — views to the Salton Sea",
      "Happy hour, cooking dinner together"
    ]
  },
  {
    date: "Sat, Nov 28", day: "Day 4", title: "Rock Climbing + Adventure Day",
    activities: [
      "Morning: Jumbo Rocks area bouldering (no experience needed)",
      "Afternoon: Hidden Valley Nature Trail (1 mi loop)",
      "Cap Rock Nature Trail — giant cap-shaped boulders",
      "Sunset happy hour at camp",
      "Last big campfire night"
    ]
  },
  {
    date: "Sat, Nov 29", day: "Day 5", title: "Slow Morning + Wind Down",
    activities: [
      "Lazy morning — coffee, breakfast burritos, no rush",
      "Short stroll: Skull Rock or Split Rock loop",
      "Pack up site, Leave No Trace cleanup",
      "Final group photos with the Joshuas",
      "Some head home, some linger"
    ]
  },
  {
    date: "Mon, Nov 30", day: "Day 6", title: "Last Campers Out",
    activities: [
      "Final pack up for any stragglers",
      "Stop at 29 Palms for breakfast on the way out",
      "Safe travels home — until next year"
    ]
  }
];

const TRAILS = [
  { name:"Skull Rock Nature Trail", difficulty:"easy", distance:"1.7 mi", time:"~1 hr", elevation:"minimal", desc:"Starts right at Jumbo Rocks campground. Wind through boulder formations to the iconic skull-shaped rock. Interpretive signs along the way." },
  { name:"Ryan Mountain Trail", difficulty:"moderate", distance:"3.0 mi", time:"2–3 hrs", elevation:"+1,070 ft", desc:"Best panoramic summit in the park. On a clear winter day you can see Mt. San Jacinto, Mt. San Gorgonio, and the Salton Sea." },
  { name:"Arch Rock Nature Trail", difficulty:"easy", distance:"1.3 mi", time:"~45 min", elevation:"minimal", desc:"Short loop through boulder-strewn terrain to a massive natural arch. Great for all fitness levels." },
  { name:"Hidden Valley Nature Trail", difficulty:"easy", distance:"1.0 mi", time:"~45 min", elevation:"minimal", desc:"Classic Joshua Tree loop through a hidden boulder-ringed valley once used by cattle rustlers. Surrounded by world-class bouldering." },
  { name:"Cholla Cactus Garden Loop", difficulty:"easy", distance:"0.25 mi", time:"20 min", elevation:"flat", desc:"An alien landscape of dense teddy bear cholla cactus. They WILL attach themselves if you get too close — watch carefully." },
  { name:"Split Rock Loop", difficulty:"easy", distance:"2.0 mi", time:"~1.5 hrs", elevation:"minimal", desc:"A huge boulder split cleanly in two by erosion. Loop trail through great desert scenery, close to Jumbo Rocks." },
  { name:"Keys View", difficulty:"easy", distance:"0.25 mi (paved)", time:"15 min", elevation:"drive-up", desc:"Drive to 5,185 ft for stunning views across the Coachella Valley, San Andreas Fault, Salton Sea, and into Mexico. Best at sunset." },
  { name:"Barker Dam Nature Trail", difficulty:"easy", distance:"1.3 mi", time:"~1 hr", elevation:"minimal", desc:"Walk to a historic stone dam with a natural water tank. Often frequented by bighorn sheep in winter." }
];

const INFO_CARDS = [
  { icon:"🌡️", title:"November Weather", items:["Highs: 55–65°F | Lows: 30–40°F","Nights get COLD — layers are essential","Possible wind, especially at night","Very little chance of rain in November","Sunny days, crystalline desert air"] },
  { icon:"📍", title:"Getting There", items:["Jumbo Rocks: off Park Blvd, Joshua Tree NP","GPS: 34.0108° N, 116.0503° W","Nearest entrance: Joshua Tree (north) or Cottonwood (south)","Entrance fee: $35/vehicle, valid 7 days","No cell service inside the park — download maps offline"] },
  { icon:"🚰", title:"Water & Facilities", items:["Jumbo Rocks has vault toilets — no showers","Water: bring ALL your own — no potable water on-site","Plan 1 gallon per person per day minimum","Nearest water fill: Oasis Visitor Center (north entrance)","Indian Cove Ranger Station also has water"] },
  { icon:"🔥", title:"Fire Rules", items:["Campfires allowed in provided fire grates only","Gathering wood prohibited — bring your own","Fire wood available at Twentynine Palms","Propane stoves are fine for cooking","Always have water nearby, fully extinguish"] },
  { icon:"🏕️", title:"Jumbo Rocks Campground", items:["124 sites — first-come, first-served (some reservable)","Max 6 people and 2 vehicles per site","Tent & RV/trailer friendly (no hookups)","Elevation: ~4,360 ft","Reservations via recreation.gov (book EARLY for Thanksgiving)"] },
  { icon:"🌟", title:"Stargazing", items:["Joshua Tree is an International Dark Sky Park","Thanksgiving 2026 new moon: perfect darkness","Milky Way visible with naked eye","Bring a red flashlight to preserve night vision","Astronomy programs sometimes offered by rangers"] },
  { icon:"🐾", title:"Wildlife", items:["Desert bighorn sheep — often near Barker Dam","Coyotes — don't leave food out","Rattlesnakes: rare in November (dormant in cold)","Jackrabbits, roadrunners, chuckwalla lizards","Bears: none in Joshua Tree — no bear canisters needed"] },
  { icon:"🏙️", title:"Nearest Towns", items:["Twentynine Palms: ~5 min east (gas, groceries, food)","Joshua Tree town: ~20 min northwest (quirky shops, coffee)","Palm Springs: ~45 min southwest (everything)","Closest ER: Desert Regional Medical Center, Palm Springs","Cell service: spotty at best inside the park"] }
];

const DEFAULT_GEAR = [
  { id:'g1',  name:'Tent (4-person)',                  category:'shelter', owner:'', packed:false },
  { id:'g2',  name:'Sleeping bag (20°F rated)',         category:'shelter', owner:'', packed:false },
  { id:'g3',  name:'Sleeping pad or air mattress',      category:'shelter', owner:'', packed:false },
  { id:'g4',  name:'Camp chairs',                       category:'shelter', owner:'', packed:false },
  { id:'g5',  name:'Folding table',                     category:'shelter', owner:'', packed:false },
  { id:'g6',  name:'Camp stove + fuel',                 category:'cooking', owner:'', packed:false },
  { id:'g7',  name:'Cooler with ice',                   category:'cooking', owner:'', packed:false },
  { id:'g8',  name:'Cast iron skillet',                 category:'cooking', owner:'', packed:false },
  { id:'g9',  name:'Cooking pot',                       category:'cooking', owner:'', packed:false },
  { id:'g10', name:'Plates, cups, utensils',            category:'cooking', owner:'', packed:false },
  { id:'g11', name:'Turkey (or protein main)',          category:'food',    owner:'', packed:false },
  { id:'g12', name:'Stuffing, mashed potatoes, sides', category:'food',    owner:'', packed:false },
  { id:'g13', name:'Firewood (2 bundles/night)',        category:'food',    owner:'', packed:false },
  { id:'g14', name:'Coffee + coffee maker',            category:'food',    owner:'', packed:false },
  { id:'g15', name:'Drinks & cooler drinks',           category:'food',    owner:'', packed:false },
  { id:'g16', name:"S'mores kit",                      category:'food',    owner:'', packed:false },
  { id:'g17', name:'First aid kit',                    category:'safety',  owner:'', packed:false },
  { id:'g18', name:'Headlamps (+ extra batteries)',    category:'tools',   owner:'', packed:false },
  { id:'g19', name:'Lantern',                          category:'tools',   owner:'', packed:false },
  { id:'g20', name:'Firestarter + lighter',            category:'tools',   owner:'', packed:false },
  { id:'g21', name:'Sunscreen + lip balm',             category:'safety',  owner:'', packed:false },
  { id:'g22', name:'Cards / board games',              category:'fun',     owner:'', packed:false },
  { id:'g23', name:'Guitar (if applicable)',           category:'fun',     owner:'', packed:false },
  { id:'g24', name:'Star map / astronomy app',         category:'fun',     owner:'', packed:false },
];

const GEAR_CATEGORIES = [
  { id:'all',      label:'All' },
  { id:'shelter',  label:'Shelter' },
  { id:'cooking',  label:'Cooking' },
  { id:'food',     label:'Food' },
  { id:'clothing', label:'Clothing' },
  { id:'safety',   label:'Safety' },
  { id:'tools',    label:'Tools' },
  { id:'fun',      label:'Fun' },
  { id:'other',    label:'Other' },
];
