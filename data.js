// ============================================================
// WHEN THINGS GO TO SEAT — data.js
// Mock state for Saturday lunch service at 14:00
// ============================================================

const STATE = {

  // ----------------------------------------------------------
  // TABLES
  // One entry per data-id in the SVG.
  // status: "empty" | "occupied" | "arriving"
  // ----------------------------------------------------------

  tables: {

    // ---- SECTION A (moderate) ----

    "_26": {
      id: "_26", section: "A", capacity: 4,
      status: "empty", covers: 0,
      seatedAt: null, turnoverDue: null, minutesRemaining: null,
      drinksOrderedAt: null, foodOrderedAt: null, billPrintedAt: null, overridden: false
    },
    "_16": {
      id: "_16", section: "A", capacity: 8,
      status: "arriving", covers: 6,
      seatedAt: null, turnoverDue: null, minutesRemaining: null,
      drinksOrderedAt: null, foodOrderedAt: null, billPrintedAt: null, overridden: false
    },
    "_161": {
      id: "_161", section: "A", capacity: 8,
      status: "empty", covers: 0,
      seatedAt: null, turnoverDue: null, minutesRemaining: null,
      drinksOrderedAt: null, foodOrderedAt: null, billPrintedAt: null, overridden: false
    },
    "_24": {
      id: "_24", section: "A", capacity: 5,
      status: "occupied", covers: 4,
      seatedAt: "12:45", turnoverDue: "14:45", minutesRemaining: 45,
      drinksOrderedAt: "12:50", foodOrderedAt: "13:00", billPrintedAt: null, overridden: false
    },
    "_25": {
      id: "_25", section: "A", capacity: 2,
      status: "occupied", covers: 2,
      seatedAt: "13:40", turnoverDue: "15:40", minutesRemaining: 100,
      drinksOrderedAt: "13:45", foodOrderedAt: null, billPrintedAt: null, overridden: false
    },
    "_23": {
      id: "_23", section: "A", capacity: 2,
      status: "empty", covers: 0,
      seatedAt: null, turnoverDue: null, minutesRemaining: null,
      drinksOrderedAt: null, foodOrderedAt: null, billPrintedAt: null, overridden: false
    },
    "_22": {
      id: "_22", section: "A", capacity: 2,
      status: "occupied", covers: 2,
      seatedAt: "12:50", turnoverDue: "14:50", minutesRemaining: 50,
      drinksOrderedAt: "12:55", foodOrderedAt: "13:05", billPrintedAt: null, overridden: false
    },
    "_21": {
      id: "_21", section: "A", capacity: 2,
      status: "arriving", covers: 2,
      seatedAt: null, turnoverDue: null, minutesRemaining: null,
      drinksOrderedAt: null, foodOrderedAt: null, billPrintedAt: null, overridden: false
    },
    "_20": {
      id: "_20", section: "A", capacity: 2,
      status: "empty", covers: 0,
      seatedAt: null, turnoverDue: null, minutesRemaining: null,
      drinksOrderedAt: null, foodOrderedAt: null, billPrintedAt: null, overridden: false
    },

    // ---- SECTION B (busy) ----

    "_15": {
      id: "_15", section: "B", capacity: 8,
      status: "occupied", covers: 8,
      seatedAt: "12:45", turnoverDue: "14:45", minutesRemaining: 45,
      drinksOrderedAt: "12:50", foodOrderedAt: "13:00", billPrintedAt: null, overridden: false
    },
    "_14": {
      id: "_14", section: "B", capacity: 10,
      status: "occupied", covers: 8,
      seatedAt: "13:15", turnoverDue: "15:15", minutesRemaining: 75,
      drinksOrderedAt: "13:20", foodOrderedAt: "13:30", billPrintedAt: null, overridden: false
    },
    "_17": {
      id: "_17", section: "B", capacity: 2,
      status: "occupied", covers: 2,
      seatedAt: "13:40", turnoverDue: "15:40", minutesRemaining: 100,
      drinksOrderedAt: "13:45", foodOrderedAt: null, billPrintedAt: null, overridden: false
    },
    "_18": {
      id: "_18", section: "B", capacity: 2,
      status: "arriving", covers: 2,
      seatedAt: null, turnoverDue: null, minutesRemaining: null,
      drinksOrderedAt: null, foodOrderedAt: null, billPrintedAt: null, overridden: false
    },
    "_9": {
      id: "_9", section: "B", capacity: 2,
      status: "occupied", covers: 2,
      seatedAt: "12:10", turnoverDue: "14:10", minutesRemaining: 10,
      drinksOrderedAt: "12:15", foodOrderedAt: "12:25", billPrintedAt: "13:50", overridden: false
    },
    "_8": {
      id: "_8", section: "B", capacity: 2,
      status: "occupied", covers: 2,
      seatedAt: "12:50", turnoverDue: "14:50", minutesRemaining: 50,
      drinksOrderedAt: "12:55", foodOrderedAt: "13:05", billPrintedAt: null, overridden: false
    },

    // ---- SECTION C (busy) ----

    "_1": {
      id: "_1", section: "C", capacity: 8,
      status: "occupied", covers: 7,
      seatedAt: "12:45", turnoverDue: "14:45", minutesRemaining: 45,
      drinksOrderedAt: "12:50", foodOrderedAt: "13:00", billPrintedAt: null, overridden: false
    },
    "_4": {
      id: "_4", section: "C", capacity: 10,
      status: "occupied", covers: 9,
      seatedAt: "13:00", turnoverDue: "15:00", minutesRemaining: 60,
      drinksOrderedAt: "13:05", foodOrderedAt: "13:15", billPrintedAt: null, overridden: false
    },
    "_5": {
      id: "_5", section: "C", capacity: 2,
      status: "occupied", covers: 2,
      seatedAt: "13:30", turnoverDue: "15:30", minutesRemaining: 90,
      drinksOrderedAt: "13:35", foodOrderedAt: "13:42", billPrintedAt: null, overridden: false
    },
    "_6": {
      id: "_6", section: "C", capacity: 2,
      status: "occupied", covers: 2,
      seatedAt: "12:55", turnoverDue: "14:55", minutesRemaining: 55,
      drinksOrderedAt: "13:00", foodOrderedAt: "13:10", billPrintedAt: null, overridden: false
    },
    "_3": {
      id: "_3", section: "C", capacity: 2,
      status: "arriving", covers: 2,
      seatedAt: null, turnoverDue: null, minutesRemaining: null,
      drinksOrderedAt: null, foodOrderedAt: null, billPrintedAt: null, overridden: false
    },
    "_7": {
      id: "_7", section: "C", capacity: 2,
      status: "occupied", covers: 2,
      seatedAt: "12:15", turnoverDue: "14:15", minutesRemaining: 15,
      drinksOrderedAt: "12:20", foodOrderedAt: "12:30", billPrintedAt: "13:55", overridden: false
    },
    "_2": {
      id: "_2", section: "C", capacity: 2,
      status: "occupied", covers: 2,
      seatedAt: "13:10", turnoverDue: "15:10", minutesRemaining: 70,
      drinksOrderedAt: "13:15", foodOrderedAt: "13:25", billPrintedAt: null, overridden: false
    },

    // ---- SECTION D (moderate) ----

    "_31": {
      id: "_31", section: "D", capacity: 8,
      status: "occupied", covers: 6,
      seatedAt: "13:10", turnoverDue: "15:10", minutesRemaining: 70,
      drinksOrderedAt: "13:15", foodOrderedAt: "13:25", billPrintedAt: null, overridden: false
    },
    "_12": {
      id: "_12", section: "D", capacity: 2,
      status: "occupied", covers: 2,
      seatedAt: "13:35", turnoverDue: "15:35", minutesRemaining: 95,
      drinksOrderedAt: "13:40", foodOrderedAt: "13:47", billPrintedAt: null, overridden: false
    },
    "_11": {
      id: "_11", section: "D", capacity: 2,
      status: "empty", covers: 0,
      seatedAt: null, turnoverDue: null, minutesRemaining: null,
      drinksOrderedAt: null, foodOrderedAt: null, billPrintedAt: null, overridden: false
    },
    "_30": {
      id: "_30", section: "D", capacity: 2,
      status: "occupied", covers: 2,
      seatedAt: "12:18", turnoverDue: "14:18", minutesRemaining: 18,
      drinksOrderedAt: "12:23", foodOrderedAt: "12:33", billPrintedAt: "13:48", overridden: false
    },
    "_19": {
      id: "_19", section: "D", capacity: 6,
      status: "occupied", covers: 5,
      seatedAt: "13:00", turnoverDue: "15:00", minutesRemaining: 60,
      drinksOrderedAt: "13:05", foodOrderedAt: "13:15", billPrintedAt: null, overridden: false
    },
    "_10": {
      id: "_10", section: "D", capacity: 2,
      status: "arriving", covers: 2,
      seatedAt: null, turnoverDue: null, minutesRemaining: null,
      drinksOrderedAt: null, foodOrderedAt: null, billPrintedAt: null, overridden: false
    },

    // ---- SECTION E (lighter) ----

    "_27": {
      id: "_27", section: "E", capacity: 8,
      status: "empty", covers: 0,
      seatedAt: null, turnoverDue: null, minutesRemaining: null,
      drinksOrderedAt: null, foodOrderedAt: null, billPrintedAt: null, overridden: false
    },
    "_34": {
      id: "_34", section: "E", capacity: 8,
      status: "occupied", covers: 5,
      seatedAt: "13:30", turnoverDue: "15:30", minutesRemaining: 90,
      drinksOrderedAt: "13:35", foodOrderedAt: "13:42", billPrintedAt: null, overridden: false
    },
    "_33": {
      id: "_33", section: "E", capacity: 8,
      status: "empty", covers: 0,
      seatedAt: null, turnoverDue: null, minutesRemaining: null,
      drinksOrderedAt: null, foodOrderedAt: null, billPrintedAt: null, overridden: false
    },
    "_28": {
      id: "_28", section: "E", capacity: 10,
      status: "occupied", covers: 8,
      seatedAt: "13:15", turnoverDue: "15:15", minutesRemaining: 75,
      drinksOrderedAt: "13:20", foodOrderedAt: "13:30", billPrintedAt: null, overridden: false
    },
    "_29": {
      id: "_29", section: "E", capacity: 2,
      status: "empty", covers: 0,
      seatedAt: null, turnoverDue: null, minutesRemaining: null,
      drinksOrderedAt: null, foodOrderedAt: null, billPrintedAt: null, overridden: false
    },
    "_35": {
      id: "_35", section: "E", capacity: 2,
      status: "arriving", covers: 2,
      seatedAt: null, turnoverDue: null, minutesRemaining: null,
      drinksOrderedAt: null, foodOrderedAt: null, billPrintedAt: null, overridden: false
    },
    "_32": {
      id: "_32", section: "E", capacity: 4,
      status: "occupied", covers: 3,
      seatedAt: "13:45", turnoverDue: "15:45", minutesRemaining: 105,
      drinksOrderedAt: null, foodOrderedAt: null, billPrintedAt: null, overridden: false
    }
  },

  // ----------------------------------------------------------
  // SECTIONS
  // workload: 0–100, derived from table states
  // (occupied=1.0, arriving=0.5, empty=0 — weighted avg)
  // ----------------------------------------------------------

  sections: {
    "A": {
      id: "A",
      tables: ["_20", "_21", "_22", "_23", "_24", "_25", "_26", "_161", "_16"],
      workload: 61   // 5 occupied + 1 arriving out of 9
    },
    "B": {
      id: "B",
      tables: ["_15", "_14", "_17", "_18", "_9", "_8"],
      workload: 92   // 5 occupied + 1 arriving out of 6
    },
    "C": {
      id: "C",
      tables: ["_1", "_4", "_5", "_6", "_3", "_7", "_2"],
      workload: 79   // 5 occupied + 1 arriving out of 7
    },
    "D": {
      id: "D",
      tables: ["_31", "_12", "_11", "_30", "_19", "_10"],
      workload: 75   // 4 occupied + 1 arriving + 1 empty out of 6
    },
    "E": {
      id: "E",
      tables: ["_27", "_34", "_33", "_28", "_29", "_35", "_32"],
      workload: 36   // 3 occupied + 1 arriving + 3 empty out of 7
    }
  },

  // ----------------------------------------------------------
  // SERVICE
  // Global service context
  // ----------------------------------------------------------

  service: {
    currentTime: "14:00",
    nextWave: "14:30",
    phase: "peak"
  }

};

// ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------

function timeToMinutes(timeStr) {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function minutesSince(timestamp, currentTime) {
  if (!timestamp) return null;
  return timeToMinutes(currentTime) - timeToMinutes(timestamp);
}

// ------------------------------------------------------------
// WORKLOAD CALCULATION
// Active-table model: red glow = ordering-phase capacity saturated.
//
// A table is ACTIVE if occupied, food not yet ordered, AND either:
//   - seated within the last 15 minutes, OR
//   - drinks already ordered (waiter must return for food order)
//
// Formula: (activeCount × 33) + (30 if large active table) + (billCount × 20)
// Capped at 100. Red glow threshold: ≥ 70.
// ------------------------------------------------------------

function calculateSectionWorkload(sectionId) {
  const section = STATE.sections[sectionId];
  const tables = section.tables.map(id => STATE.tables[id]);
  const currentTime = STATE.service.currentTime;

  let activeCount = 0;
  let largeTableActive = false;
  let billCount = 0;

  tables.forEach(table => {
    if (table.status !== 'occupied') return;

    if (table.billPrintedAt !== null) billCount++;

    if (table.foodOrderedAt === null) {
      const seatedMins = minutesSince(table.seatedAt, currentTime);
      const recentlySeat = seatedMins !== null && seatedMins <= 15;
      const drinksOrdered = table.drinksOrderedAt !== null;

      if (recentlySeat || drinksOrdered) {
        activeCount++;
        if (table.covers >= 6) largeTableActive = true;
      }
    }
  });

  const workload = Math.min(100,
    (activeCount * 33) +
    (largeTableActive ? 30 : 0) +
    (billCount * 20)
  );

  section.workload = workload;
  section.isRed = workload >= 70;
  section.activeCount = activeCount;
  section.billCount = billCount;
  section.largeTableActive = largeTableActive;

  return workload;
}

// Calculate workloads for all sections on init
Object.keys(STATE.sections).forEach(id => calculateSectionWorkload(id));

// ------------------------------------------------------------
// GUEST + COURSE DATA — visual refinement
// Non-destructive: merged into existing table entries
// ------------------------------------------------------------
(function() {
  const meta = {
    "_9":  { guestName: "Helen Ford",      courseStatus: "payment"  },
    "_7":  { guestName: "Lucy Kim",        courseStatus: "payment"  },
    "_30": { guestName: "Grace Chen",      courseStatus: "payment"  },
    "_24": { guestName: "Peter Osei",      courseStatus: "dessert"  },
    "_15": { guestName: "Sarah Collins",   courseStatus: "dessert"  },
    "_1":  { guestName: "Nina Ross",       courseStatus: "dessert"  },
    "_26": { guestName: "Marcus Webb",     courseStatus: "mains"    },
    "_22": { guestName: "Tom Ashby",       courseStatus: "mains"    },
    "_14": { guestName: "David Park",      courseStatus: "mains"    },
    "_8":  { guestName: "James Okafor",    courseStatus: "mains"    },
    "_4":  { guestName: "Carlos Lima",     courseStatus: "mains"    },
    "_6":  { guestName: "André Moreau",    courseStatus: "mains"    },
    "_2":  { guestName: "Mike Reeves",     courseStatus: "mains"    },
    "_31": { guestName: "Sasha Petrov",    courseStatus: "mains"    },
    "_19": { guestName: "Frank Torres",    courseStatus: "mains"    },
    "_28": { guestName: "Omar Khalil",     courseStatus: "mains"    },
    "_16": { guestName: "Diane Holloway",  courseStatus: "starters" },
    "_5":  { guestName: "Priya Shah",      courseStatus: "starters" },
    "_12": { guestName: "Ali Hassan",      courseStatus: "starters" },
    "_34": { guestName: "Beth Murphy",     courseStatus: "starters" },
    "_25": { guestName: "Lucia Ferri",     courseStatus: "ordering" },
    "_17": { guestName: "Yuki Tanaka",     courseStatus: "ordering" },
    "_32": { guestName: "Tara Singh",      courseStatus: "ordering" },
    "_21": { guestName: "Kai Nakamura"   },
    "_18": { guestName: "Rosa Martinez"  },
    "_3":  { guestName: "Ivan Petrov"    },
    "_10": { guestName: "Zoe Williams"   },
    "_35": { guestName: "Sam O'Brien"    },
  };
  Object.keys(meta).forEach(id => {
    if (STATE.tables[id]) Object.assign(STATE.tables[id], meta[id]);
  });
})();

// ------------------------------------------------------------
// RESERVATIONS — dynamic generator, 300 entries (12:00–20:45)
// ------------------------------------------------------------

function generateFullReservations() {
  const names = [
    "James Okafor",    "Sarah Mitchell",   "Elena Vasquez",   "Michael Chen",
    "Aisha Patel",     "Thomas Brennan",   "Priya Nair",      "Lucas Ferreira",
    "Sophie Andersen", "Omar Khalil",      "Mei Lin",         "David Osei",
    "Francesca Romano","Yuki Tanaka",      "Marcus Webb",     "Isabelle Dupont",
    "Kofi Mensah",     "Zara Ahmed",       "Nathan Cole",     "John Doe",
    "Helen Ford",      "Lucy Kim",         "Grace Chen",      "Peter Osei",
    "Nina Ross",       "Carlos Lima",      "André Moreau",    "Mike Reeves",
    "Sasha Petrov",    "Frank Torres",     "Ali Hassan",      "Beth Murphy",
    "Lucia Ferri",     "Kai Nakamura",     "Rosa Martinez",   "Ivan Petrov",
    "Zoe Williams",    "Sam O'Brien",      "Tara Singh",      "Diana Holloway",
    "Raj Patel",       "Amara Diallo",     "Leon Fischer",    "Nadia Okonkwo",
    "Stefan Müller",   "Camille Dubois",   "Hiroshi Yamamoto","Fatima Al-Zahra",
    "Antoine Leblanc", "Mia Thornton",     "Caleb Ross",      "Ingrid Svensson",
    "Pablo Reyes",     "Jasmine Wu",       "Ahmed Hassan",    "Clara Johansson",
    "Marco Esposito",  "Siobhan O'Connor", "Dmitri Volkov",   "Layla Mansour"
  ];

  const coversDist = [2, 2, 2, 2, 2, 2, 3, 3, 4, 4, 4, 5, 6, 6, 8];
  const tagSets    = [
    [], [], [], [], [],
    ["birthday"], ["anniversary"], ["vip"],
    ["allergy"], ["special request"], ["note"]
  ];
  const allergySubs = ["nuts", "gluten", "dairy", "shellfish", "soy"];
  const noteTexts   = {
    "special request": "Window seat preferred",
    "note":            "High chair needed",
    "anniversary":     "Celebrating tonight",
    "birthday":        "Birthday cake arranged"
  };

  const START = 12 * 60;       // 720 mins
  const END   = 20 * 60 + 45;  // 1245 mins
  const SPAN  = END - START;    // 525 mins
  const COUNT = 300;

  const out = [];
  for (let i = 0; i < COUNT; i++) {
    const mins = START + Math.round((i / (COUNT - 1)) * SPAN);
    const hh   = String(Math.floor(mins / 60)).padStart(2, '0');
    const mm   = String(mins % 60).padStart(2, '0');

    const covers    = coversDist[Math.floor(Math.random() * coversDist.length)];
    const tags      = tagSets[Math.floor(Math.random() * tagSets.length)];
    const allergies = tags.includes("allergy")
      ? [allergySubs[Math.floor(Math.random() * allergySubs.length)]]
      : [];
    const noteTag = tags.find(t => noteTexts[t]);

    out.push({
      id:            `res_${String(i + 1).padStart(4, '0')}`,
      guestName:     names[Math.floor(Math.random() * names.length)],
      time:          `${hh}:${mm}`,
      covers,
      status:        "upcoming",
      bookingType:   Math.random() > 0.2 ? "confirmed" : "pending",
      assignedTable:  null,
      suggestedTable: null,
      tags,
      allergies,
      notes:  noteTag ? noteTexts[noteTag] : "",
      phone:  `+44 7700 ${String(900000 + i).slice(-6)}`,
      email:  `guest${i + 1}@email.com`
    });
  }
  return out;
}

STATE.reservations = generateFullReservations();

// ---- Legacy static list (35 entries kept for reference only, not used) ----
const _legacyReservations = [
  {
    id: "res_001", guestName: "John Doe",          time: "12:00", covers: 2,
    status: "arrived",  bookingType: "confirmed",
    assignedTable: "_9",   suggestedTable: null,
    tags: ["birthday"], allergies: ["nuts"],
    notes: "", phone: "+44 7700 900123", email: "john.doe@email.com"
  },
  {
    id: "res_002", guestName: "Sarah Mitchell",    time: "12:15", covers: 4,
    status: "arrived",  bookingType: "confirmed",
    assignedTable: "_8",   suggestedTable: null,
    tags: ["vip"], allergies: [],
    notes: "", phone: "+44 7700 900234", email: "s.mitchell@email.com"
  },
  {
    id: "res_003", guestName: "James Okafor",      time: "12:30", covers: 2,
    status: "arrived",  bookingType: "confirmed",
    assignedTable: "_17",  suggestedTable: null,
    tags: [], allergies: [],
    notes: "", phone: "+44 7700 900345", email: "j.okafor@email.com"
  },
  {
    id: "res_004", guestName: "Elena Vasquez",     time: "12:30", covers: 3,
    status: "arrived",  bookingType: "pending",
    assignedTable: "_18",  suggestedTable: null,
    tags: ["special request"], allergies: [],
    notes: "Quieter table if possible", phone: "+44 7700 900456", email: "elena.v@email.com"
  },
  {
    id: "res_005", guestName: "Michael Chen",      time: "12:45", covers: 6,
    status: "arrived",  bookingType: "confirmed",
    assignedTable: "_6",   suggestedTable: null,
    tags: ["anniversary"], allergies: [],
    notes: "", phone: "+44 7700 900567", email: "m.chen@email.com"
  },
  {
    id: "res_006", guestName: "Aisha Patel",       time: "12:45", covers: 2,
    status: "arrived",  bookingType: "confirmed",
    assignedTable: "_7",   suggestedTable: null,
    tags: ["allergy"], allergies: ["gluten"],
    notes: "", phone: "+44 7700 900678", email: "aisha.p@email.com"
  },
  {
    id: "res_007", guestName: "Thomas Brennan",    time: "13:00", covers: 4,
    status: "arrived",  bookingType: "confirmed",
    assignedTable: "_3",   suggestedTable: null,
    tags: [], allergies: [],
    notes: "", phone: "+44 7700 900789", email: "t.brennan@email.com"
  },
  {
    id: "res_008", guestName: "Priya Nair",        time: "13:00", covers: 2,
    status: "arrived",  bookingType: "pending",
    assignedTable: "_2",   suggestedTable: null,
    tags: ["note"], allergies: [],
    notes: "High chair needed", phone: "+44 7700 900890", email: "priya.n@email.com"
  },
  {
    id: "res_009", guestName: "Lucas Ferreira",    time: "13:15", covers: 8,
    status: "arrived",  bookingType: "confirmed",
    assignedTable: "_1",   suggestedTable: null,
    tags: ["birthday", "vip"], allergies: [],
    notes: "", phone: "+44 7700 900901", email: "l.ferreira@email.com"
  },
  {
    id: "res_010", guestName: "Sophie Andersen",   time: "13:15", covers: 2,
    status: "arrived",  bookingType: "confirmed",
    assignedTable: "_22",  suggestedTable: null,
    tags: ["allergy"], allergies: ["dairy"],
    notes: "", phone: "+44 7700 901012", email: "s.andersen@email.com"
  },
  {
    id: "res_011", guestName: "Omar Khalil",       time: "13:30", covers: 4,
    status: "arrived",  bookingType: "confirmed",
    assignedTable: "_23",  suggestedTable: null,
    tags: [], allergies: [],
    notes: "", phone: "+44 7700 901123", email: "o.khalil@email.com"
  },
  {
    id: "res_012", guestName: "Mei Lin",           time: "13:30", covers: 2,
    status: "arrived",  bookingType: "pending",
    assignedTable: "_24",  suggestedTable: null,
    tags: ["special request"], allergies: [],
    notes: "Window seat preferred", phone: "+44 7700 901234", email: "mei.lin@email.com"
  },
  {
    id: "res_013", guestName: "David Osei",        time: "13:45", covers: 4,
    status: "arrived",  bookingType: "confirmed",
    assignedTable: "_25",  suggestedTable: null,
    tags: ["vip"], allergies: [],
    notes: "", phone: "+44 7700 901345", email: "d.osei@email.com"
  },
  {
    id: "res_014", guestName: "Francesca Romano",  time: "13:45", covers: 2,
    status: "arrived",  bookingType: "confirmed",
    assignedTable: "_30",  suggestedTable: null,
    tags: ["anniversary", "note"], allergies: [],
    notes: "Celebrating 10 years", phone: "+44 7700 901456", email: "f.romano@email.com"
  },
  {
    id: "res_015", guestName: "Yuki Tanaka",       time: "14:00", covers: 2,
    status: "arrived",  bookingType: "confirmed",
    assignedTable: "_29",  suggestedTable: null,
    tags: ["allergy"], allergies: ["shellfish"],
    notes: "", phone: "+44 7700 901567", email: "yuki.t@email.com"
  },
  {
    id: "res_016", guestName: "Marcus Webb",       time: "14:00", covers: 6,
    status: "arrived",  bookingType: "confirmed",
    assignedTable: "_33",  suggestedTable: null,
    tags: [], allergies: [],
    notes: "", phone: "+44 7700 901678", email: "m.webb@email.com"
  },
  {
    id: "res_017", guestName: "Isabelle Dupont",   time: "14:15", covers: 2,
    status: "upcoming", bookingType: "confirmed",
    assignedTable: null,   suggestedTable: null,
    tags: ["birthday"], allergies: [],
    notes: "", phone: "+44 7700 901789", email: "i.dupont@email.com"
  },
  {
    id: "res_018", guestName: "Kofi Mensah",       time: "14:15", covers: 4,
    status: "upcoming", bookingType: "pending",
    assignedTable: null,   suggestedTable: null,
    tags: [], allergies: [],
    notes: "", phone: "+44 7700 901890", email: "k.mensah@email.com"
  },
  {
    id: "res_019", guestName: "Zara Ahmed",        time: "14:30", covers: 2,
    status: "upcoming", bookingType: "confirmed",
    assignedTable: null,   suggestedTable: null,
    tags: ["allergy", "note"], allergies: ["soy"],
    notes: "Seated away from kitchen", phone: "+44 7700 901901", email: "zara.a@email.com"
  },
  {
    id: "res_020", guestName: "Nathan Cole",       time: "14:30", covers: 8,
    status: "upcoming", bookingType: "confirmed",
    assignedTable: null,   suggestedTable: null,
    tags: ["vip"], allergies: [],
    notes: "", phone: "+44 7700 902012", email: "n.cole@email.com"
  },
  {
    id: "res_021", guestName: "John Doe",          time: "14:45", covers: 2,
    status: "upcoming", bookingType: "pending",
    assignedTable: null,   suggestedTable: null,
    tags: [], allergies: [],
    notes: "", phone: "+44 7700 902123", email: "john2.doe@email.com"
  },
  {
    id: "res_022", guestName: "Sarah Mitchell",    time: "15:00", covers: 4,
    status: "upcoming", bookingType: "confirmed",
    assignedTable: null,   suggestedTable: null,
    tags: ["special request"], allergies: [],
    notes: "Prefer booth seating", phone: "+44 7700 902234", email: "sarah2.m@email.com"
  },
  {
    id: "res_023", guestName: "James Okafor",      time: "15:00", covers: 2,
    status: "upcoming", bookingType: "confirmed",
    assignedTable: null,   suggestedTable: null,
    tags: [], allergies: [],
    notes: "", phone: "+44 7700 902345", email: "james2.o@email.com"
  },
  {
    id: "res_024", guestName: "Elena Vasquez",     time: "15:15", covers: 3,
    status: "upcoming", bookingType: "confirmed",
    assignedTable: null,   suggestedTable: null,
    tags: ["allergy"], allergies: ["nuts", "gluten"],
    notes: "", phone: "+44 7700 902456", email: "elena2.v@email.com"
  },
  {
    id: "res_025", guestName: "Michael Chen",      time: "15:30", covers: 4,
    status: "upcoming", bookingType: "pending",
    assignedTable: null,   suggestedTable: null,
    tags: [], allergies: [],
    notes: "", phone: "+44 7700 902567", email: "m2.chen@email.com"
  },
  {
    id: "res_026", guestName: "Aisha Patel",       time: "15:30", covers: 2,
    status: "upcoming", bookingType: "confirmed",
    assignedTable: null,   suggestedTable: null,
    tags: ["birthday", "note"], allergies: [],
    notes: "Cake arranged with kitchen", phone: "+44 7700 902678", email: "aisha2.p@email.com"
  },
  {
    id: "res_027", guestName: "Thomas Brennan",    time: "16:00", covers: 6,
    status: "upcoming", bookingType: "confirmed",
    assignedTable: null,   suggestedTable: null,
    tags: ["vip"], allergies: [],
    notes: "", phone: "+44 7700 902789", email: "t2.brennan@email.com"
  },
  {
    id: "res_028", guestName: "Priya Nair",        time: "16:30", covers: 2,
    status: "upcoming", bookingType: "confirmed",
    assignedTable: null,   suggestedTable: null,
    tags: ["allergy"], allergies: ["dairy"],
    notes: "", phone: "+44 7700 902890", email: "priya2.n@email.com"
  },
  {
    id: "res_029", guestName: "Lucas Ferreira",    time: "17:00", covers: 4,
    status: "upcoming", bookingType: "pending",
    assignedTable: null,   suggestedTable: null,
    tags: [], allergies: [],
    notes: "", phone: "+44 7700 902901", email: "l2.ferreira@email.com"
  },
  {
    id: "res_030", guestName: "Sophie Andersen",   time: "17:00", covers: 2,
    status: "upcoming", bookingType: "confirmed",
    assignedTable: null,   suggestedTable: null,
    tags: ["special request"], allergies: [],
    notes: "Near window if available", phone: "+44 7700 903012", email: "s2.andersen@email.com"
  },
  {
    id: "res_031", guestName: "Omar Khalil",       time: "17:30", covers: 8,
    status: "upcoming", bookingType: "confirmed",
    assignedTable: null,   suggestedTable: null,
    tags: ["vip", "anniversary"], allergies: [],
    notes: "", phone: "+44 7700 903123", email: "o2.khalil@email.com"
  },
  {
    id: "res_032", guestName: "Mei Lin",           time: "18:00", covers: 2,
    status: "upcoming", bookingType: "confirmed",
    assignedTable: null,   suggestedTable: null,
    tags: [], allergies: [],
    notes: "", phone: "+44 7700 903234", email: "mei2.lin@email.com"
  },
  {
    id: "res_033", guestName: "David Osei",        time: "18:30", covers: 4,
    status: "upcoming", bookingType: "pending",
    assignedTable: null,   suggestedTable: null,
    tags: ["allergy", "note"], allergies: ["shellfish"],
    notes: "Allergy confirmed with manager", phone: "+44 7700 903345", email: "d2.osei@email.com"
  },
  {
    id: "res_034", guestName: "Francesca Romano",  time: "19:00", covers: 2,
    status: "upcoming", bookingType: "confirmed",
    assignedTable: null,   suggestedTable: null,
    tags: ["birthday"], allergies: [],
    notes: "", phone: "+44 7700 903456", email: "f2.romano@email.com"
  },
  {
    id: "res_035", guestName: "Yuki Tanaka",       time: "19:30", covers: 6,
    status: "upcoming", bookingType: "confirmed",
    assignedTable: null,   suggestedTable: null,
    tags: ["vip", "special request"], allergies: [],
    notes: "Private area requested", phone: "+44 7700 903567", email: "yuki2.t@email.com"
  },
]; // end _legacyReservations (not used)

console.log('Reservations loaded:', STATE.reservations.length);

// ------------------------------------------------------------
// FORECAST CALCULATION
// Projects workload for each section at +10 and +20 minutes.
//   - Occupied tables turning within the window are removed
//   - Arriving tables are seated by +10 (add as occupied, no urgency)
//   - Remaining occupied tables have minutesRemaining adjusted
// ------------------------------------------------------------

function projectWorkload(tables, minutesAhead) {
  let score = 0;

  tables.forEach(t => {
    if (t.status === 'empty') return;

    if (t.status === 'arriving') {
      // Assumed seated by +10; contributes base score, no urgency
      if (minutesAhead >= 10) score += 100;
      return;
    }

    // Occupied — skip if turned within the window
    if (t.minutesRemaining !== null && t.minutesRemaining <= minutesAhead) return;

    score += 100;
    const adjusted = t.minutesRemaining !== null ? t.minutesRemaining - minutesAhead : null;
    if (adjusted !== null && adjusted <= 20) score += 25;
    if (adjusted !== null && adjusted <= 5)  score += 15;
  });

  const maxScore = tables.length * 140;
  return maxScore > 0 ? Math.min(100, Math.round((score / maxScore) * 100)) : 0;
}

function calculateForecast() {
  const result = {};

  Object.keys(STATE.sections).forEach(id => {
    const tables = STATE.sections[id].tables.map(tid => STATE.tables[tid]);
    result[id] = {
      now:    STATE.sections[id].workload,
      plus10: projectWorkload(tables, 10),
      plus20: projectWorkload(tables, 20)
    };
  });

  return result;
}

// ------------------------------------------------------------
// TABLE SUGGESTION
// Returns the best available table id for a reservation, or null.
// ------------------------------------------------------------

function suggestTable(reservation) {
  // Step 1: get all empty tables
  const candidates = Object.values(STATE.tables).filter(t => t.status === 'empty');

  // Step 2: filter by capacity >= reservation.covers
  const capacityMap = {
    '_1': 8,  '_2': 2,  '_3': 2,  '_4': 5,  '_5': 2,
    '_6': 2,  '_7': 2,  '_8': 2,  '_9': 2,  '_10': 2,
    '_11': 2, '_12': 2, '_14': 10,'_15': 8, '_16': 8,
    '_17': 2, '_18': 2, '_19': 5, '_20': 2, '_21': 2,
    '_22': 2, '_23': 2, '_24': 2, '_25': 2, '_26': 4,
    '_27': 4, '_28': 10,'_29': 2, '_30': 2, '_31': 6,
    '_32': 2, '_33': 8, '_34': 8, '_35': 2
  };

  const suitable = candidates.filter(t => {
    const cap = capacityMap[t.id] || 2;
    return cap >= reservation.covers;
  });

  if (suitable.length === 0) return null;

  // Step 3: score each candidate
  const scored = suitable.map(t => {
    let score = 0;
    const section  = STATE.sections[t.section];
    const workload = section ? section.workload : 50;
    const cap      = capacityMap[t.id] || 2;

    // Lower workload = better
    if      (workload < 40) score += 30;
    else if (workload < 60) score += 15;
    else if (workload > 80) score -= 20;

    // Capacity match — penalise oversized tables
    const diff = cap - reservation.covers;
    if      (diff === 0) score += 20;
    else if (diff <= 2)  score += 10;
    else                 score -= diff * 3;

    // Tables turning soon are good if arrival is within 30 min
    const [rHH, rMM] = reservation.time.split(':').map(Number);
    const [cHH, cMM] = STATE.service.currentTime.split(':').map(Number);
    const minsUntilArrival = (rHH * 60 + rMM) - (cHH * 60 + cMM);

    if (minsUntilArrival <= 30 && t.minutesRemaining <= 30) score += 25;

    return { id: t.id, score };
  });

  // Step 4: return highest scoring table id
  scored.sort((a, b) => b.score - a.score);
  return scored[0].id;
}

// ------------------------------------------------------------
// SUGGESTION INITIALISATION
// Populates suggestedTable for all unassigned reservations.
// ------------------------------------------------------------

function initSuggestions() {
  STATE.reservations.forEach(res => {
    if (!res.assignedTable) {
      res.suggestedTable = suggestTable(res);
    }
  });
}

initSuggestions();

console.log(
  'Suggestions generated:',
  STATE.reservations.filter(r => r.suggestedTable).length,
  'of',
  STATE.reservations.filter(r => !r.assignedTable).length,
  'unassigned reservations'
);
