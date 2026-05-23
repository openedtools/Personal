// ============================================================
// Static data — trip content + shared color palette
// ============================================================

// Avatar / Gantt bar colors — cycled by camper index
const AVATAR_COLORS = ['#c4622d','#2d6bc4','#6bc42d','#c42d8a','#2dc4b0','#c4a02d','#8a2dc4'];

const ITINERARY = [];

const TRAILS = [
  { name:"Skull Rock Nature Trail", difficulty:"easy", distance:"1.7 mi", time:"~1 hr", elevation:"minimal", desc:"Starts right at Jumbo Rocks campground. Wind through boulder formations to the iconic skull-shaped rock. Interpretive signs along the way.", url:"https://www.nps.gov/places/skull-rock-nature-trail.htm", altUrl:"https://www.alltrails.com/trail/us/california/skull-rock-trail" },
  { name:"Ryan Mountain Trail", difficulty:"moderate", distance:"3.0 mi", time:"2–3 hrs", elevation:"+1,070 ft", desc:"Best panoramic summit in the park. On a clear winter day you can see Mt. San Jacinto, Mt. San Gorgonio, and the Salton Sea.", url:"https://www.nps.gov/places/ryan-mountain.htm", altUrl:"https://www.alltrails.com/trail/us/california/ryan-mountain-trail" },
  { name:"Arch Rock Nature Trail", difficulty:"easy", distance:"1.3 mi", time:"~45 min", elevation:"minimal", desc:"Short loop through boulder-strewn terrain to a massive natural arch. Great for all fitness levels.", url:"https://www.nps.gov/places/arch-rock-nature-trail.htm", altUrl:"https://www.alltrails.com/trail/us/california/arch-rock-trail" },
  { name:"Hidden Valley Nature Trail", difficulty:"easy", distance:"1.0 mi", time:"~45 min", elevation:"minimal", desc:"Classic Joshua Tree loop through a hidden boulder-ringed valley once used by cattle rustlers. Surrounded by world-class bouldering.", url:"https://www.nps.gov/places/hidden-valley-nature-trail.htm", altUrl:"https://www.alltrails.com/trail/us/california/hidden-valley-nature-trail" },
  { name:"Cholla Cactus Garden Loop", difficulty:"easy", distance:"0.25 mi", time:"20 min", elevation:"flat", desc:"An alien landscape of dense teddy bear cholla cactus. They WILL attach themselves if you get too close — watch carefully.", url:"https://www.nps.gov/places/cholla-cactus-garden.htm", altUrl:"https://www.alltrails.com/trail/us/california/cholla-cactus-garden-nature-trail" },
  { name:"Split Rock Loop", difficulty:"easy", distance:"2.0 mi", time:"~1.5 hrs", elevation:"minimal", desc:"A huge boulder split cleanly in two by erosion. Loop trail through great desert scenery, close to Jumbo Rocks.", url:"https://www.nps.gov/places/split-rock.htm", altUrl:"https://www.alltrails.com/trail/us/california/split-rock-loop-trail" },
  { name:"Keys View", difficulty:"easy", distance:"0.25 mi (paved)", time:"15 min", elevation:"drive-up", desc:"Drive to 5,185 ft for stunning views across the Coachella Valley, San Andreas Fault, Salton Sea, and into Mexico. Best at sunset.", url:"https://www.nps.gov/places/keys-view.htm", altUrl:"https://www.alltrails.com/trail/us/california/keys-view" },
  { name:"Barker Dam Nature Trail", difficulty:"easy", distance:"1.3 mi", time:"~1 hr", elevation:"minimal", desc:"Walk to a historic stone dam with a natural water tank. Often frequented by bighorn sheep in winter.", url:"https://www.nps.gov/places/barker-dam-nature-trail.htm", altUrl:"https://www.alltrails.com/trail/us/california/barker-dam-trail" }
];

const INFO_CARDS = [
  {
    icon:"🌡️", title:"November Weather",
    items:["Highs: 55–65°F | Lows: 30–40°F","Nights get COLD — layers are essential","Possible wind, especially at night","Very little chance of rain in November","Sunny days, crystalline desert air"],
    links:[
      { label:"NPS · Weather & Climate", url:"https://www.nps.gov/jotr/planyourvisit/weather.htm" },
      { label:"NWS forecast for Joshua Tree", url:"https://forecast.weather.gov/MapClick.php?lat=33.8734&lon=-115.901" }
    ]
  },
  {
    icon:"📍", title:"Getting There",
    items:["Jumbo Rocks: off Park Blvd, Joshua Tree NP","GPS: 34.0108° N, 116.0503° W","Nearest entrance: Joshua Tree (north) or Cottonwood (south)","Entrance fee: $35/vehicle, valid 7 days","No cell service inside the park — download maps offline"],
    links:[
      { label:"NPS · Directions", url:"https://www.nps.gov/jotr/planyourvisit/directions.htm" },
      { label:"Drive to Jumbo Rocks (Google Maps)", url:"https://www.google.com/maps/place/Jumbo+Rocks+Campground/@34.0108,-116.0503,15z" },
      { label:"Park entrance fees", url:"https://www.nps.gov/jotr/planyourvisit/fees.htm" }
    ]
  },
  {
    icon:"🚰", title:"Water & Facilities",
    items:["Jumbo Rocks has vault toilets — no showers","Water: bring ALL your own — no potable water on-site","Plan 1 gallon per person per day minimum","Nearest water fill: Oasis Visitor Center (north entrance)","Indian Cove Ranger Station also has water"],
    links:[
      { label:"NPS · Drinking water locations", url:"https://www.nps.gov/jotr/planyourvisit/water.htm" }
    ]
  },
  {
    icon:"🔥", title:"Fire Rules",
    items:["Campfires allowed in provided fire grates only","Gathering wood prohibited — bring your own","Fire wood available at Twentynine Palms","Propane stoves are fine for cooking","Always have water nearby, fully extinguish"],
    links:[
      { label:"NPS · Campfires & wood", url:"https://www.nps.gov/jotr/planyourvisit/campfires.htm" }
    ]
  },
  {
    icon:"🏕️", title:"Jumbo Rocks Campground",
    items:["124 sites — first-come, first-served (some reservable)","Max 6 people and 2 vehicles per site","Tent & RV/trailer friendly (no hookups)","Elevation: ~4,360 ft","Reservations via recreation.gov (book EARLY for Thanksgiving)"],
    links:[
      { label:"Book on Recreation.gov", url:"https://www.recreation.gov/camping/campgrounds/272299" },
      { label:"NPS · Jumbo Rocks page", url:"https://www.nps.gov/jotr/planyourvisit/jumborocks.htm" }
    ]
  },
  {
    icon:"🌟", title:"Stargazing",
    items:["Joshua Tree is an International Dark Sky Park","Thanksgiving 2026 new moon: perfect darkness","Milky Way visible with naked eye","Bring a red flashlight to preserve night vision","Astronomy programs sometimes offered by rangers"],
    links:[
      { label:"NPS · Night Sky", url:"https://www.nps.gov/jotr/learn/nature/nightsky.htm" },
      { label:"DarkSky International listing", url:"https://darksky.org/places/joshua-tree-national-park/" }
    ]
  },
  {
    icon:"🐾", title:"Wildlife",
    items:["Desert bighorn sheep — often near Barker Dam","Coyotes — don't leave food out","Rattlesnakes: rare in November (dormant in cold)","Jackrabbits, roadrunners, chuckwalla lizards","Bears: none in Joshua Tree — no bear canisters needed"],
    links:[
      { label:"NPS · Animals of Joshua Tree", url:"https://www.nps.gov/jotr/learn/nature/animals.htm" }
    ]
  },
  {
    icon:"🏙️", title:"Nearest Towns",
    items:["Twentynine Palms: ~5 min east (gas, groceries, food)","Joshua Tree town: ~20 min northwest (quirky shops, coffee)","Palm Springs: ~45 min southwest (everything)","Closest ER: Desert Regional Medical Center, Palm Springs","Cell service: spotty at best inside the park"],
    links:[
      { label:"Visit Twentynine Palms", url:"https://visit29.org/" },
      { label:"Visit Joshua Tree", url:"https://visitjoshua.com/" },
      { label:"Desert Regional Medical Center", url:"https://www.desertcareresources.com/dch/locations/desert-regional-medical-center" }
    ]
  }
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
