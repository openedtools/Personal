const ITINERARY = [
  {
    date: "Wed, Nov 25",
    day: "Day 1",
    title: "Arrival Day",
    activities: [
      "Drive in, set up camp before dark — golden hour over the boulders",
      "First campfire, introductions, snacks & drinks",
      "Stargazing: Joshua Tree has near-zero light pollution — Milky Way visible",
      "Settle in and soak it up"
    ]
  },
  {
    date: "Thu, Nov 26",
    day: "Day 2",
    title: "Thanksgiving in the Desert",
    activities: [
      "Morning: easy hike to Skull Rock (1.7 mi loop from the campground)",
      "Afternoon: big group Thanksgiving feast at camp",
      "Turkey (or tofurky), sides, and all the fixings — campfire style",
      "Evening: bonfire, s'mores, live music if anyone brought a guitar",
      "Night hike if weather cooperates"
    ]
  },
  {
    date: "Fri, Nov 27",
    day: "Day 3",
    title: "Hike & Explore",
    activities: [
      "Morning: Ryan Mountain summit hike (3 mi, sweeping 360° views)",
      "Afternoon: Cholla Cactus Garden — otherworldly mile-long loop",
      "Arch Rock Nature Trail (1.3 mi) — massive boulder arch",
      "Sunset at Keys View overlook — views to the Salton Sea",
      "Happy hour, cooking dinner together"
    ]
  },
  {
    date: "Sat, Nov 28",
    day: "Day 4",
    title: "Rock Climbing + Adventure Day",
    activities: [
      "Morning: Jumbo Rocks area bouldering (no experience needed — it's everywhere)",
      "Afternoon: Hidden Valley Nature Trail (1 mi loop) — ranchers' cattle rustling history",
      "Cap Rock Nature Trail — giant cap-shaped boulders",
      "Sunset happy hour at camp",
      "Last big campfire night"
    ]
  },
  {
    date: "Sun, Nov 29",
    day: "Day 5",
    title: "Slow Morning + Wind Down",
    activities: [
      "Lazy morning — coffee, breakfast burritos, no rush",
      "Short stroll: Skull Rock or Split Rock loop",
      "Pack up site, Leave No Trace cleanup",
      "Final group photos with the Joshuas",
      "Some head home, some linger"
    ]
  },
  {
    date: "Mon, Nov 30",
    day: "Day 6",
    title: "Last Campers Out",
    activities: [
      "Final pack up for any stragglers",
      "Stop at 29 Palms for breakfast on the way out",
      "Safe travels home — until next year"
    ]
  }
];

const TRAILS = [
  { name: "Skull Rock Nature Trail", difficulty: "easy", distance: "1.7 mi", time: "~1 hr", elevation: "minimal", desc: "Starts right at Jumbo Rocks campground. Wind through boulder formations to the iconic skull-shaped rock. Interpretive signs along the way." },
  { name: "Ryan Mountain Trail", difficulty: "moderate", distance: "3.0 mi", time: "2–3 hrs", elevation: "+1,070 ft", desc: "Best panoramic summit in the park. On a clear winter day you can see Mt. San Jacinto, Mt. San Gorgonio, and the Salton Sea." },
  { name: "Arch Rock Nature Trail", difficulty: "easy", distance: "1.3 mi", time: "~45 min", elevation: "minimal", desc: "Short loop through boulder-strewn terrain to a massive natural arch. Great for all fitness levels. Stunning photo ops." },
  { name: "Hidden Valley Nature Trail", difficulty: "easy", distance: "1.0 mi", time: "~45 min", elevation: "minimal", desc: "Classic Joshua Tree loop through a hidden boulder-ringed valley once used by cattle rustlers. Surrounded by world-class bouldering." },
  { name: "Cholla Cactus Garden Loop", difficulty: "easy", distance: "0.25 mi", time: "20 min", elevation: "flat", desc: "An alien landscape of dense teddy bear cholla cactus. They WILL attack you if you get too close — wear gaiters or watch carefully." },
  { name: "Split Rock Loop", difficulty: "easy", distance: "2.0 mi", time: "~1.5 hrs", elevation: "minimal", desc: "A huge boulder split cleanly in two by erosion. Loop trail through great desert scenery, very close to Jumbo Rocks campground." },
  { name: "Keys View", difficulty: "easy", distance: "0.25 mi (paved)", time: "15 min", elevation: "drive-up", desc: "Drive to 5,185 ft for stunning views across the Coachella Valley, San Andreas Fault, Salton Sea, and into Mexico. Best at sunset." },
  { name: "Barker Dam Nature Trail", difficulty: "easy", distance: "1.3 mi", time: "~1 hr", elevation: "minimal", desc: "Walk to a historic stone dam with a natural water tank. Often frequented by bighorn sheep in winter. Native American rock art nearby." }
];

const INFO_CARDS = [
  { icon: "🌡️", title: "November Weather", items: ["Highs: 55–65°F | Lows: 30–40°F", "Nights get COLD — layers are essential", "Possible wind, especially at night", "Very little chance of rain in November", "Sunny days, crystalline desert air"] },
  { icon: "📍", title: "Getting There", items: ["Jumbo Rocks: off Park Blvd, Joshua Tree NP", "GPS: 34.0108° N, 116.0503° W", "Nearest entrance: Joshua Tree (north) or Cottonwood (south)", "Entrance fee: $35/vehicle, valid 7 days", "No cell service inside the park — download maps offline"] },
  { icon: "🚰", title: "Water & Facilities", items: ["Jumbo Rocks has vault toilets — no showers", "Water: bring ALL your own — no potable water on-site", "Plan 1 gallon per person per day minimum", "Nearest water fill: Oasis Visitor Center (north entrance)", "Indian Cove Ranger Station also has water"] },
  { icon: "🔥", title: "Fire Rules", items: ["Campfires allowed in provided fire grates only", "Gathering wood prohibited — bring your own", "Fire wood available at Twentynine Palms", "Propane stoves are fine for cooking", "Always have water nearby, fully extinguish"] },
  { icon: "🏕️", title: "Jumbo Rocks Campground", items: ["124 sites — first-come, first-served (some reservable)", "Max 6 people and 2 vehicles per site", "Tent & RV/trailer friendly (no hookups)", "Elevation: ~4,360 ft", "Reservations via recreation.gov (book EARLY for Thanksgiving)"] },
  { icon: "🌟", title: "Stargazing", items: ["Joshua Tree is an International Dark Sky Park", "Thanksgiving 2026 new moon: perfect darkness", "Milky Way visible with naked eye", "Bring a red flashlight to preserve night vision", "Astronomy programs sometimes offered by rangers"] },
  { icon: "🐾", title: "Wildlife", items: ["Desert bighorn sheep — often near Barker Dam", "Coyotes — don't leave food out", "Rattlesnakes: rare in November (dormant in cold)", "Jackrabbits, roadrunners, chuckwalla lizards", "Bears: none in Joshua Tree — no bear canisters needed"] },
  { icon: "🏙️", title: "Nearest Towns", items: ["Twentynine Palms: ~5 min east (gas, groceries, food)", "Joshua Tree town: ~20 min northwest (quirky shops, coffee)", "Palm Springs: ~45 min southwest (everything)", "Closest ER: Desert Regional Medical Center, Palm Springs", "Cell service: spotty at best inside the park"] }
];

const DEFAULT_GEAR = [
  { id: 'g1',  name: 'Tent (4-person)',                   category: 'shelter',  owner: '', packed: false },
  { id: 'g2',  name: 'Sleeping bag (20°F rated)',          category: 'shelter',  owner: '', packed: false },
  { id: 'g3',  name: 'Sleeping pad or air mattress',       category: 'shelter',  owner: '', packed: false },
  { id: 'g4',  name: 'Camp chairs',                        category: 'shelter',  owner: '', packed: false },
  { id: 'g5',  name: 'Folding table',                      category: 'shelter',  owner: '', packed: false },
  { id: 'g6',  name: 'Camp stove + fuel',                  category: 'cooking',  owner: '', packed: false },
  { id: 'g7',  name: 'Cooler with ice',                    category: 'cooking',  owner: '', packed: false },
  { id: 'g8',  name: 'Cast iron skillet',                  category: 'cooking',  owner: '', packed: false },
  { id: 'g9',  name: 'Cooking pot',                        category: 'cooking',  owner: '', packed: false },
  { id: 'g10', name: 'Plates, cups, utensils',             category: 'cooking',  owner: '', packed: false },
  { id: 'g11', name: 'Turkey (or protein main)',           category: 'food',     owner: '', packed: false },
  { id: 'g12', name: 'Stuffing, mashed potatoes, sides',  category: 'food',     owner: '', packed: false },
  { id: 'g13', name: 'Firewood (2 bundles/night)',         category: 'food',     owner: '', packed: false },
  { id: 'g14', name: 'Coffee + coffee maker',             category: 'food',     owner: '', packed: false },
  { id: 'g15', name: 'Drinks & cooler drinks',            category: 'food',     owner: '', packed: false },
  { id: 'g16', name: "S'mores kit",                       category: 'food',     owner: '', packed: false },
  { id: 'g17', name: 'First aid kit',                     category: 'safety',   owner: '', packed: false },
  { id: 'g18', name: 'Headlamps (+ extra batteries)',     category: 'tools',    owner: '', packed: false },
  { id: 'g19', name: 'Lantern',                           category: 'tools',    owner: '', packed: false },
  { id: 'g20', name: 'Firestarter + lighter',             category: 'tools',    owner: '', packed: false },
  { id: 'g21', name: 'Sunscreen + lip balm',              category: 'safety',   owner: '', packed: false },
  { id: 'g22', name: 'Cards / board games',               category: 'fun',      owner: '', packed: false },
  { id: 'g23', name: 'Guitar (if applicable)',            category: 'fun',      owner: '', packed: false },
  { id: 'g24', name: 'Star map / astronomy app',          category: 'fun',      owner: '', packed: false },
];

const GEAR_CATEGORIES = [
  { id: 'all',      label: 'All' },
  { id: 'shelter',  label: 'Shelter' },
  { id: 'cooking',  label: 'Cooking' },
  { id: 'food',     label: 'Food' },
  { id: 'clothing', label: 'Clothing' },
  { id: 'safety',   label: 'Safety' },
  { id: 'tools',    label: 'Tools' },
  { id: 'fun',      label: 'Fun' },
  { id: 'other',    label: 'Other' },
];
