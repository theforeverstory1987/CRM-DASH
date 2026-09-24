// Gustavo data layer: team, clients, cases ("files") and the activity log.
// Kept in localStorage until there is a real backend.
const DATA_KEY = 'gustavo_data_v1';

// Request types, shown as hashtags (#Restaurant). One word each so the hashtag reads cleanly.
const CATEGORIES = ['Restaurant', 'Hotel', 'Flights', 'Transfers', 'Massage', 'Yacht', 'Events', 'Tickets', 'Shopping', 'Gifts', 'Other'];

// Older request types, mapped to the new ones.
const OLD_CATEGORIES = { Dining: 'Restaurant', Travel: 'Flights', Lifestyle: 'Shopping' };

// ISO code and name; the code picks the flag image.
const COUNTRIES = [
  ['AE', 'United Arab Emirates'], ['AT', 'Austria'], ['AU', 'Australia'], ['BE', 'Belgium'], ['BR', 'Brazil'],
  ['CA', 'Canada'], ['CH', 'Switzerland'], ['CN', 'China'], ['CY', 'Cyprus'], ['DE', 'Germany'], ['DK', 'Denmark'],
  ['ES', 'Spain'], ['FR', 'France'], ['GB', 'United Kingdom'], ['GR', 'Greece'], ['HK', 'Hong Kong'], ['IE', 'Ireland'],
  ['IL', 'Israel'], ['IN', 'India'], ['IT', 'Italy'], ['JP', 'Japan'], ['KR', 'South Korea'], ['MC', 'Monaco'],
  ['MX', 'Mexico'], ['NL', 'Netherlands'], ['NO', 'Norway'], ['PT', 'Portugal'], ['QA', 'Qatar'], ['RU', 'Russia'],
  ['SA', 'Saudi Arabia'], ['SE', 'Sweden'], ['SG', 'Singapore'], ['TH', 'Thailand'], ['TR', 'Türkiye'],
  ['US', 'United States'], ['ZA', 'South Africa'],
];

// Sample clients: id, name, phone, email, tier, country, notes, days ago.
// The ids are from before the Israeli names, so older saves can be renamed (see migrate).
const SAMPLE_CLIENTS = [
  ['emma', 'Yael Mizrahi', '+972 52 555 0142', 'yael.mizrahi@example.com', 'VIP', 'IL', 'Window tables. Shellfish allergy.', 120],
  ['james', 'Eitan Ben-David', '+44 7700 900187', 'eitan.bendavid@example.com', 'Platinum', 'GB', 'Flies private. Aisle seat when flying commercial.', 95],
  ['aiko', 'Tamar Avraham', '+972 54 555 0119', 'tamar.avraham@example.com', 'Gold', 'IL', 'Vegetarian. Loves spa hotels.', 60],
  ['marco', 'Omer Katz', '+972 50 555 0163', 'omer.katz@example.com', 'Platinum', 'IL', 'Opera and basketball. Always 2 seats.', 45],
  ['olivia', 'Shira Friedman', '+1 212 555 0128', 'shira.friedman@example.com', 'Gold', 'US', 'White flowers only.', 20],
  ['noah', 'Itai Levi', '+972 53 555 0176', 'itai.levi@example.com', 'Standard', 'IL', 'Referred by Eitan Ben-David.', 3],
];

// What the sample data said before the Israeli names; saves that still have it get the new wording.
const OLD_SAMPLE_NAMES = { emma: 'Emma Laurent', james: 'James Whitfield', aiko: 'Aiko Tanaka', marco: 'Marco Bellini', olivia: 'Olivia Grant', noah: 'Noah Berger' };
const OLD_SAMPLE_TEXT = {
  'Call Emma to confirm the anniversary cake': 'Call Yael to confirm the anniversary cake',
  'Marco always wants 2 seats together, aisle if possible.': 'Omer always wants 2 seats together, aisle if possible.',
  'Sent two seat options by email. Waiting for Marco to choose.': 'Sent two seat options by email. Waiting for Omer to choose.',
};

// Request types for the sample data, so older saves pick them up too.
const SAMPLE_TYPES = { c6: 'Yacht', c9: 'Transfers', c11: 'Massage' };

// Who opened a case when it wasn't the client: an assistant, a family member. Sample ones by case id.
const SAMPLE_REQUESTERS = {
  c2: { name: 'Roni Cohen', phone: '+972 52 555 0199', email: 'roni.cohen@example.com' },
  c14: { name: 'Dana Shalev', phone: '+972 54 555 0137', email: 'dana.shalev@example.com' },
  c40: { name: 'Roni Cohen', phone: '+972 52 555 0199', email: 'roni.cohen@example.com' },
};

// Where a sample case happens (country code) and its budget; other cases start without them.
const SAMPLE_CASE_EXTRAS = {
  c1: { location: 'IL', budget: { amount: 1200, currency: '₪' } },
  c2: { location: 'GB', budget: { amount: 18000, currency: '€' } },
  c3: { location: 'US', budget: { amount: 3600, currency: '$' } },
  c4: { location: 'FR', budget: { amount: 150, currency: '€' } },
  c10: { location: 'IL', budget: { amount: 4400, currency: '₪' } },
  c18: { location: 'FR', budget: { amount: 900, currency: '€' } },
  c39: { location: 'GB', budget: { amount: 500, currency: '$' } },
  c40: { location: 'IL', budget: { amount: 8000, currency: '₪' } },
};

const SAMPLE_GENDERS = { emma: 'female', james: 'male', aiko: 'female', marco: 'male', olivia: 'female', noah: 'male' };

// Sample cases whose request changed: id → [old title, new title, new request type].
const RETITLED_SAMPLES = {
  c4: ['Suite upgrade for the Tokyo stay', 'Transfer from Paris airport to the hotel', 'Transfers'],
  c3: ['Courtside tickets for Saturday', 'NBA: Knicks vs. Celtics, 2 courtside seats', 'Tickets'],
};

// Batches added to the sample data after the first release, with the flag that marks a save as having them.
const SAMPLE_BATCHES = [['moreSamples', extraSampleRows], ['pastSamples', pastSampleRows], ['supplierSamples', supplierSampleRows]];

// Supplier categories, in the Suppliers menu's order. `qty` and `date` name the booking's columns.
const SUPPLIER_GROUPS = [
  { id: 'transfers', label: 'Transfers', icon: '🚘', qty: 'Passengers', date: 'Pickup' },
  { id: 'shows', label: 'Shows', icon: '🎤', qty: 'Tickets', date: 'Show date' },
  { id: 'sports', label: 'Sports', icon: '🏀', qty: 'Tickets', date: 'Game date' },
  { id: 'airport', label: 'Airport VIP', icon: '✈️', qty: 'Passengers', date: 'Flight' },
  { id: 'restaurants', label: 'Restaurants', icon: '🍽️', qty: 'Guests', date: 'Reservation' },
];

// The suppliers you start with; after that they live in the saved data (db.suppliers) and can be added to.
const DEFAULT_SUPPLIERS = [
  { id: 'connect', name: 'Connect', group: 'shows' },
  { id: 'live', name: 'Live', group: 'shows' },
  { id: 'lord', name: 'Lord', group: 'shows' },
  { id: 'alex-thompson', name: 'Alex Thompson', group: 'shows' },
  { id: 'julia-tv', name: 'JULIA TV', group: 'shows' },
  { id: 'assistant', name: 'Assistant', group: 'transfers' },
  { id: 'elite-vip', name: 'Elite VIP', group: 'transfers' },
  { id: 'blacklane', name: 'Blacklane', group: 'transfers' },
  { id: 'flow', name: 'Flow', group: 'airport' },
  { id: 'laufer', name: 'Laufer', group: 'airport' },
];

const CHANNELS = [
  { id: 'phone', label: 'Phone' },
  { id: 'email', label: 'Email' },
];

const PRIORITIES = [
  { id: 'low', label: 'Low' },
  { id: 'normal', label: 'Normal' },
  { id: 'high', label: 'High' },
  { id: 'urgent', label: 'Urgent' },
];

const STATUSES = [
  { id: 'new', label: 'New', short: 'New' },
  { id: 'in_progress', label: 'In progress', short: 'Ongoing' },
  { id: 'waiting_provider', label: 'Waiting on supplier', short: 'On supplier' },
  { id: 'waiting_client', label: 'Waiting on client', short: 'On client' },
  { id: 'done', label: 'Done', short: 'Done' },
];

const TIERS = ['Standard', 'Gold', 'Platinum', 'VIP'];

const HOUR = 3600e3;
const DAY = 24 * HOUR;

let db = loadData();

function loadData() {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (raw) {
      const data = migrate(JSON.parse(raw));
      if (data.migrated) {
        delete data.migrated;
        saveData(data);
      }
      return data;
    }
  } catch {
    // Unreadable storage falls through to fresh sample data.
  }
  const seeded = buildSeed();
  saveData(seeded);
  return seeded;
}

// Older saves predate client IDs and custom initials.
function migrate(data) {
  if (!data.nextClientNumber) {
    data.nextClientNumber = 2001;
    for (const c of data.clients) if (!c.number) c.number = data.nextClientNumber++;
  }
  const admin = data.team.find(m => m.id === 'admin');
  if (admin && admin.initials === undefined) admin.initials = 'AR';
  // "Waiting" used to be one status; it's now split into supplier vs. client.
  for (const k of data.cases) if (k.status === 'waiting') k.status = 'waiting_client';
  if (!data.reminders) data.reminders = [];
  if (!data.notes) data.notes = [];
  for (const c of data.clients) if (c.country === undefined) c.country = '';
  // Sample clients still under their old names get the Israeli ones, and so do notes that mention them.
  let renamed = false;
  for (const c of data.clients) {
    const sample = SAMPLE_CLIENTS.find(s => s[0] === c.id);
    if (!sample || c.name !== OLD_SAMPLE_NAMES[c.id]) continue;
    const [, name, phone, email, , country, notes] = sample;
    Object.assign(c, { name, phone, email, country, notes });
    renamed = true;
  }
  if (renamed) {
    const retext = text => OLD_SAMPLE_TEXT[text] || text;
    for (const r of data.reminders) r.text = retext(r.text);
    for (const n of data.notes) n.text = retext(n.text);
    for (const k of data.cases) for (const u of k.updates) u.text = retext(u.text);
    for (const e of data.activity) if (e.text) e.text = retext(e.text);
    data.migrated = true;
  }
  for (const k of data.cases) {
    if (SAMPLE_TYPES[k.id] && OLD_CATEGORIES[k.category]) k.category = SAMPLE_TYPES[k.id];
    else if (OLD_CATEGORIES[k.category]) k.category = OLD_CATEGORIES[k.category];
    const retitle = RETITLED_SAMPLES[k.id];
    if (retitle && k.title === retitle[0]) {
      [, k.title, k.category] = retitle;
      data.migrated = true;
    }
    // Cases from before "Opened by": the client, except the sample ones someone opened for them.
    if (k.requester === undefined) {
      k.requester = (data.demo && SAMPLE_REQUESTERS[k.id]) || null;
      data.migrated = true;
    }
    // Cases from before location and budget.
    if (k.location === undefined) {
      const extras = (data.demo && SAMPLE_CASE_EXTRAS[k.id]) || {};
      k.location = extras.location || '';
      k.budget = extras.budget || null;
      data.migrated = true;
    }
  }
  for (const c of data.clients) {
    if (c.gender === undefined) {
      c.gender = (data.demo && SAMPLE_GENDERS[c.id]) || '';
      data.migrated = true;
    }
  }
  if (!data.suppliers) {
    data.suppliers = DEFAULT_SUPPLIERS.map(s => ({ ...s }));
    data.migrated = true;
  }
  // Bookings with suppliers: saves from before suppliers get the sample ones once (after the cases below).
  const needsBookings = !data.bookings;
  // Sample cases added after the first release reach older saves once, if they still show sample data.
  for (const [flag, rows] of SAMPLE_BATCHES) {
    if (data[flag]) continue;
    if (data.demo) {
      const clientIds = new Set(data.clients.map(c => c.id));
      const extra = sampleCases(rows(seedClock(Date.now()).dayAt))
        .filter(k => clientIds.has(k.clientId) && !data.cases.some(c => c.id === k.id));
      extra.forEach(k => { k.number = data.nextNumber++; });
      data.cases.push(...extra);
      data.activity = [...data.activity, ...sampleActivity(extra)].sort((a, b) => b.at.localeCompare(a.at));
    }
    data[flag] = true;
    data.migrated = true;
  }
  if (needsBookings) {
    data.bookings = data.demo ? sampleBookings(data.cases) : [];
    data.migrated = true;
  }
  return data;
}

function saveData(data = db) {
  try {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
  } catch {
    // Private mode or full storage: keep working in memory.
  }
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function findClient(id) { return db.clients.find(c => c.id === id) || null; }
function findCase(id) { return db.cases.find(k => k.id === id) || null; }
function findMember(id) { return db.team.find(m => m.id === id) || null; }

function logActivity(type, by, fields = {}) {
  db.activity.unshift({ id: uid(), type, by, at: new Date().toISOString(), ...fields });
  if (db.activity.length > 2000) db.activity.length = 2000;
}

// ---------- Mutations ----------
function addClient(input, by) {
  const client = {
    id: uid(),
    number: db.nextClientNumber++,
    name: input.name.trim(),
    phone: (input.phone || '').trim(),
    email: (input.email || '').trim(),
    country: input.country || '',
    gender: input.gender || '',
    tier: input.tier || 'Standard',
    notes: (input.notes || '').trim(),
    createdAt: new Date().toISOString(),
  };
  db.clients.push(client);
  logActivity('client_added', by, { clientId: client.id });
  saveData();
  return client;
}

function createCase(input, by) {
  const kase = {
    id: uid(),
    number: db.nextNumber++,
    title: input.title.trim(),
    clientId: input.clientId,
    // null when the client opened it; otherwise { name, phone, email } of whoever did.
    requester: input.requester || null,
    location: input.location || '',
    budget: input.budget || null,
    category: input.category,
    channel: input.channel,
    priority: input.priority,
    status: 'new',
    details: (input.details || '').trim(),
    dueAt: input.dueAt || null,
    createdAt: new Date().toISOString(),
    createdBy: by,
    assignee: input.assignee || null,
    assignedBy: input.assignee ? by : null,
    completedAt: null,
    updates: [],
  };
  db.cases.push(kase);
  logActivity('case_created', by, { caseId: kase.id });
  if (kase.assignee) {
    logActivity(kase.assignee === by ? 'case_taken' : 'case_assigned', by, { caseId: kase.id, to: kase.assignee });
  }
  saveData();
  return kase;
}

function assignCase(caseId, to, by) {
  const kase = findCase(caseId);
  if (!kase || (kase.assignee || null) === (to || null)) return;
  kase.assignee = to || null;
  kase.assignedBy = to ? by : null;
  const type = !to ? 'case_unassigned' : to === by ? 'case_taken' : 'case_assigned';
  logActivity(type, by, { caseId, to: to || null });
  saveData();
}

function setCaseStatus(caseId, status, by) {
  const kase = findCase(caseId);
  if (!kase || kase.status === status) return;
  const from = kase.status;
  kase.status = status;
  kase.completedAt = status === 'done' ? new Date().toISOString() : null;
  logActivity('status_changed', by, { caseId, from, to: status });
  saveData();
}

// Changes what a case is (request, date, location, budget, description) from the case window.
function updateCaseInfo(caseId, patch) {
  const kase = findCase(caseId);
  if (!kase) return;
  Object.assign(kase, patch);
  saveData();
}

function setCaseDetails(caseId, text) {
  const kase = findCase(caseId);
  if (!kase) return;
  kase.details = text.trim();
  saveData();
}

function setRequester(caseId, requester) {
  const kase = findCase(caseId);
  if (!kase) return;
  kase.requester = requester || null;
  saveData();
}

function addCaseUpdate(caseId, text, by) {
  const kase = findCase(caseId);
  if (!kase || !text.trim()) return;
  kase.updates.push({ id: uid(), at: new Date().toISOString(), by, text: text.trim() });
  logActivity('note_added', by, { caseId, text: text.trim() });
  saveData();
}

// Profile icon: { photo } (data URL), { emoji }, or neither for initials; tone picks the colour.
function updateMember(id, patch) {
  const member = findMember(id);
  if (!member) return;
  Object.assign(member, patch);
  saveData();
}

// Personal reminders and sticky notes, kept per team member (`by`). A reminder can belong to a case.
function addReminder(text, at, by, caseId = null) {
  db.reminders.push({ id: uid(), text: text.trim(), at, by, done: false, caseId });
  saveData();
}

function toggleReminder(id) {
  const reminder = db.reminders.find(r => r.id === id);
  if (!reminder) return;
  reminder.done = !reminder.done;
  saveData();
}

function deleteReminder(id) {
  db.reminders = db.reminders.filter(r => r.id !== id);
  saveData();
}

// sharedWith: team member ids who also see the note; only its author (`by`) can delete it.
function addNote(text, color, by, sharedWith = []) {
  db.notes.unshift({ id: uid(), text: text.trim(), color, by, sharedWith, at: new Date().toISOString() });
  saveData();
}

function deleteNote(id) {
  db.notes = db.notes.filter(n => n.id !== id);
  saveData();
}

function shareNote(id, memberIds) {
  const note = db.notes.find(n => n.id === id);
  if (!note) return;
  note.sharedWith = memberIds;
  saveData();
}

// Someone a note was shared with takes it off their own board.
function unshareNote(id, memberId) {
  const note = db.notes.find(n => n.id === id);
  if (!note) return;
  note.sharedWith = (note.sharedWith || []).filter(m => m !== memberId);
  saveData();
}

function findSupplier(id) { return db.suppliers.find(s => s.id === id) || null; }

function addSupplier(input) {
  const supplier = {
    id: uid(),
    name: input.name.trim(),
    group: input.group,
    phone: (input.phone || '').trim(),
    email: (input.email || '').trim(),
  };
  db.suppliers.push(supplier);
  saveData();
  return supplier;
}

// A purchase from a supplier for a case: tickets, a transfer, an airport VIP service.
function addBooking(input) {
  const kase = findCase(input.caseId);
  db.bookings.push({
    id: uid(),
    supplierId: input.supplierId,
    caseId: input.caseId,
    clientId: kase ? kase.clientId : '',
    date: input.date,
    qty: input.qty,
    price: input.price,
    invoice: (input.invoice || '').trim(),
  });
  saveData();
}

// Removes the sample clients, cases, bookings and activity; the team list stays.
function clearSampleData() {
  db = { ...db, demo: false, clients: [], cases: [], bookings: [], activity: [], nextNumber: 1001, nextClientNumber: 2001 };
  saveData();
}

// Brings the sample data back, keeping everyone's chosen name and icon, reminders, notes and suppliers.
function restoreSampleData() {
  const icons = Object.fromEntries(db.team.map(m => [m.id, { name: m.name, initials: m.initials, photo: m.photo, emoji: m.emoji, tone: m.tone, color: m.color }]));
  const extra = db.team.filter(m => !['admin', 'daniel', 'sofia', 'noa'].includes(m.id));
  const { reminders, notes, suppliers } = db;
  db = { ...buildSeed(), reminders, notes, ...(suppliers ? { suppliers } : {}) };
  db.team.push(...extra);
  for (const m of db.team) Object.assign(m, icons[m.id] || {});
  saveData();
}

// ---------- Sample data ----------
// iso() never goes past now; dayAt(offset, h, m) is a time `offset` days from today.
function seedClock(now) {
  return {
    iso: ms => new Date(Math.min(ms, now)).toISOString(),
    dayAt: (offset, h, m = 0) => {
      const d = new Date(now);
      d.setDate(d.getDate() + offset);
      d.setHours(h, m, 0, 0);
      return d.toISOString();
    },
  };
}

// Rows: id, title, client, category, channel, priority, status, assignee, assignedBy, createdBy, hours ago, due, completed hours ago
function sampleCases(rows) {
  const now = Date.now();
  const { iso } = seedClock(now);
  return rows.map(([id, title, clientId, category, channel, priority, status, assignee, assignedBy, createdBy, hoursAgo, dueAt, doneHoursAgo]) => ({
    id, title, clientId, category, channel, priority, status, assignee, assignedBy, createdBy, dueAt,
    requester: SAMPLE_REQUESTERS[id] || null,
    location: (SAMPLE_CASE_EXTRAS[id] || {}).location || '',
    budget: (SAMPLE_CASE_EXTRAS[id] || {}).budget || null,
    details: '',
    createdAt: iso(now - hoursAgo * HOUR),
    completedAt: doneHoursAgo ? iso(now - doneHoursAgo * HOUR) : null,
    updates: [],
  }));
}

// Opened, assigned and status-change entries for sample cases (updates are logged too).
function sampleActivity(cases) {
  const { iso } = seedClock(Date.now());
  const activity = [];
  const push = (type, by, atMs, fields) => activity.push({ id: uid(), type, by, at: iso(atMs), ...fields });
  for (const k of cases) {
    const created = Date.parse(k.createdAt);
    push('case_created', k.createdBy, created, { caseId: k.id });
    if (k.assignee) {
      push(k.assignee === k.assignedBy ? 'case_taken' : 'case_assigned', k.assignedBy, created + 10 * 60e3, { caseId: k.id, to: k.assignee });
    }
    if (k.status !== 'new') {
      const at = k.completedAt ? Date.parse(k.completedAt) : created + 2 * HOUR;
      push('status_changed', k.assignee, at, { caseId: k.id, from: k.status === 'done' ? 'in_progress' : 'new', to: k.status });
    }
    for (const u of k.updates) push('note_added', u.by, Date.parse(u.at), { caseId: k.id, text: u.text });
  }
  return activity;
}

// Busier days for the calendar: two days from now has 5 cases (3 transfers, 2 restaurants, with c7).
function extraSampleRows(dayAt) {
  return [
    ['c13', 'Airport pickup at Nice for 2', 'james', 'Transfers', 'phone', 'normal', 'new', 'noa', 'daniel', 'daniel', 6, dayAt(2, 9)],
    ['c14', 'Chauffeur for the day in Monaco', 'emma', 'Transfers', 'email', 'high', 'in_progress', 'admin', 'admin', 'admin', 12, dayAt(2, 11)],
    ['c15', 'Lunch for 6 by the sea', 'olivia', 'Restaurant', 'email', 'normal', 'waiting_provider', 'sofia', 'sofia', 'sofia', 18, dayAt(2, 13)],
    ['c16', 'Car to the restaurant and back', 'marco', 'Transfers', 'phone', 'normal', 'new', null, null, 'sofia', 4, dayAt(2, 19)],
    ['c17', 'Two nights at a spa hotel', 'aiko', 'Hotel', 'email', 'normal', 'new', 'admin', 'daniel', 'daniel', 8, dayAt(5, 14)],
    ['c18', 'Front-row seats for the fashion show', 'emma', 'Tickets', 'phone', 'high', 'waiting_client', 'admin', 'admin', 'admin', 28, dayAt(5, 18)],
    ['c19', 'Birthday dinner for 12', 'noah', 'Restaurant', 'phone', 'normal', 'new', null, null, 'noa', 9, dayAt(5, 20)],
    ['c20', 'Helicopter to Saint-Tropez', 'james', 'Flights', 'email', 'urgent', 'in_progress', 'daniel', 'daniel', 'daniel', 22, dayAt(12, 10)],
    ['c21', 'Private wine tasting', 'marco', 'Events', 'email', 'normal', 'new', 'sofia', 'daniel', 'daniel', 14, dayAt(12, 17)],
    ['c22', 'Deep-tissue massage at the hotel', 'olivia', 'Massage', 'phone', 'low', 'new', null, null, 'admin', 7, dayAt(16, 16)],
    ['c23', 'Anniversary gift, a watch', 'emma', 'Gifts', 'email', 'normal', 'in_progress', 'noa', 'noa', 'noa', 36, dayAt(20, 12)],
    ['c24', 'Yacht day trip, 10 guests', 'aiko', 'Yacht', 'email', 'high', 'new', null, null, 'daniel', 10, dayAt(25, 10)],
  ];
}

// Earlier this month, for the calendar's colours: two days ago everything is done (green),
// eight days ago one case is still open (orange).
function pastSampleRows(dayAt) {
  return [
    ['c25', 'Dinner at the chef’s counter', 'marco', 'Restaurant', 'phone', 'normal', 'done', 'admin', 'admin', 'admin', 80, dayAt(-2, 20), 40],
    ['c26', 'Airport drop-off at Ben Gurion', 'emma', 'Transfers', 'phone', 'normal', 'done', 'noa', 'noa', 'noa', 90, dayAt(-2, 6), 60],
    ['c27', 'Spa morning for two', 'olivia', 'Massage', 'email', 'low', 'done', 'sofia', 'sofia', 'sofia', 100, dayAt(-2, 9), 55],
    ['c28', 'Concert tickets, 4 seats', 'noah', 'Tickets', 'email', 'normal', 'done', 'admin', 'daniel', 'daniel', 120, dayAt(-2, 21), 70],
    ['c29', 'Hotel in Eilat, 3 nights', 'aiko', 'Hotel', 'email', 'normal', 'done', 'admin', 'admin', 'admin', 260, dayAt(-8, 12), 200],
    ['c30', 'Flowers for a shiva', 'olivia', 'Gifts', 'phone', 'high', 'done', 'noa', 'daniel', 'daniel', 250, dayAt(-8, 10), 196],
    ['c31', 'Refund for a cancelled show', 'marco', 'Tickets', 'email', 'normal', 'waiting_provider', 'sofia', 'sofia', 'sofia', 240, dayAt(-8, 17)],
    ['c32', 'Table for 2 in Jaffa', 'james', 'Restaurant', 'phone', 'normal', 'done', 'admin', 'admin', 'admin', 150, dayAt(-5, 20), 110],
    ['c33', 'Driver for a wedding', 'noah', 'Transfers', 'phone', 'normal', 'done', 'daniel', 'daniel', 'daniel', 160, dayAt(-5, 16), 115],
    ['c34', 'Flights to Paris for the family', 'emma', 'Flights', 'email', 'high', 'done', 'admin', 'daniel', 'daniel', 400, dayAt(-12, 8), 300],
    ['c35', 'Yacht dinner cruise', 'james', 'Yacht', 'email', 'normal', 'done', 'sofia', 'sofia', 'sofia', 380, dayAt(-12, 19), 290],
    ['c36', 'Birthday cake delivery', 'aiko', 'Gifts', 'phone', 'low', 'done', 'noa', 'noa', 'noa', 370, dayAt(-12, 15), 285],
  ];
}

// Shows and airport cases that go with the sample supplier bookings.
function supplierSampleRows(dayAt) {
  return [
    ['c37', 'Stand-up show, 2 tickets', 'aiko', 'Tickets', 'phone', 'normal', 'in_progress', 'admin', 'admin', 'admin', 30, dayAt(8, 21)],
    ['c38', 'Concert at Park Hayarkon, 4 tickets', 'noah', 'Tickets', 'email', 'normal', 'done', 'sofia', 'sofia', 'sofia', 200, dayAt(11, 20), 150],
    ['c39', 'Musical in London, 2 tickets', 'olivia', 'Tickets', 'email', 'normal', 'waiting_client', 'noa', 'daniel', 'daniel', 50, dayAt(15, 19)],
    ['c40', 'Arena concert, VIP box for 6', 'james', 'Tickets', 'phone', 'high', 'in_progress', 'admin', 'daniel', 'daniel', 60, dayAt(18, 20)],
    ['c41', 'Theatre premiere, 2 seats', 'emma', 'Tickets', 'email', 'normal', 'done', 'admin', 'admin', 'admin', 120, dayAt(7, 20), 90],
    ['c42', 'Comedy night, 8 tickets', 'james', 'Tickets', 'phone', 'normal', 'new', null, null, 'sofia', 5, dayAt(21, 21)],
    ['c43', 'TV show taping, 4 studio seats', 'aiko', 'Events', 'email', 'low', 'done', 'noa', 'noa', 'noa', 140, dayAt(-6, 18), 100],
    ['c44', 'Festival passes, 3 days', 'olivia', 'Tickets', 'email', 'normal', 'in_progress', 'sofia', 'sofia', 'sofia', 26, dayAt(27, 12)],
    ['c45', 'VIP terminal at Ben Gurion, departure', 'marco', 'Flights', 'phone', 'high', 'in_progress', 'admin', 'admin', 'admin', 20, dayAt(4, 6)],
    ['c46', 'Airport VIP arrival, family of 5', 'aiko', 'Flights', 'email', 'normal', 'done', 'noa', 'daniel', 'daniel', 180, dayAt(-3, 14), 120],
  ];
}

// Sample bookings: supplier, case, quantity, price (₪), invoice number ('' when it hasn't come in yet).
function sampleBookings(cases) {
  const rows = [
    ['connect', 'c3', 2, 1800, 'INV-2031'], ['connect', 'c18', 2, 3200, 'INV-2044'], ['connect', 'c37', 2, 480, ''], ['connect', 'c38', 4, 1120, 'INV-2052'],
    ['live', 'c28', 4, 1360, 'INV-1187'], ['live', 'c39', 2, 1900, ''], ['live', 'c40', 6, 7800, 'INV-1203'],
    ['lord', 'c10', 4, 4400, 'L-5521'], ['lord', 'c41', 2, 760, ''],
    ['alex-thompson', 'c42', 8, 1600, 'AT-088'], ['alex-thompson', 'c31', 2, 900, 'AT-079'],
    ['julia-tv', 'c43', 4, 600, 'JTV-310'], ['julia-tv', 'c44', 3, 2100, ''],
    ['assistant', 'c13', 2, 650, 'AS-7710'], ['assistant', 'c26', 2, 380, 'AS-7682'], ['assistant', 'c16', 2, 420, ''],
    ['elite-vip', 'c14', 3, 2900, ''], ['elite-vip', 'c33', 4, 1500, 'EV-1450'],
    ['blacklane', 'c9', 1, 520, 'BL-90331'], ['blacklane', 'c12', 1, 310, ''],
    ['flow', 'c34', 4, 2400, 'FL-640'], ['flow', 'c45', 2, 1700, ''],
    ['laufer', 'c2', 2, 1950, ''], ['laufer', 'c46', 5, 3100, 'LF-2290'],
  ];
  return rows
    .map(([supplierId, caseId, qty, price, invoice]) => {
      const kase = cases.find(k => k.id === caseId);
      return kase && { id: uid(), supplierId, caseId, clientId: kase.clientId, date: kase.dueAt, qty, price, invoice };
    })
    .filter(Boolean);
}
function buildSeed() {
  const now = Date.now();
  const { iso, dayAt } = seedClock(now);

  const team = [
    { id: 'admin', name: 'Amit.R', initials: 'AR', title: 'Administrator', role: 'admin' },
    { id: 'daniel', name: 'Daniel Reyes', title: 'Head concierge', role: 'admin' },
    { id: 'sofia', name: 'Sofia Marín', title: 'Concierge', role: 'staff' },
    { id: 'noa', name: 'Noa Adler', title: 'Concierge', role: 'staff' },
  ];

  const clients = SAMPLE_CLIENTS.map(([id, name, phone, email, tier, country, notes, daysAgo]) => ({
    id, name, phone, email, tier, country, notes, gender: SAMPLE_GENDERS[id] || '', createdAt: iso(now - daysAgo * DAY),
  }));
  clients.forEach((c, i) => { c.number = 2001 + i; });

  const rows = [
    ['c1', "Anniversary dinner for 2 at the chef's table", 'emma', 'Restaurant', 'phone', 'high', 'in_progress', 'admin', 'daniel', 'daniel', 26, dayAt(0, 19, 30)],
    ['c2', 'Private jet, Nice to London', 'james', 'Flights', 'email', 'urgent', 'new', 'admin', 'daniel', 'daniel', 3, dayAt(1, 9)],
    ['c3', 'NBA: Knicks vs. Celtics, 2 courtside seats', 'marco', 'Tickets', 'phone', 'normal', 'waiting_client', 'admin', 'admin', 'admin', 50, dayAt(3, 18)],
    ['c4', 'Transfer from Paris airport to the hotel', 'aiko', 'Transfers', 'email', 'normal', 'in_progress', 'admin', 'admin', 'sofia', 30, dayAt(-1, 17)],
    ['c5', '40 white roses for a birthday', 'olivia', 'Gifts', 'phone', 'low', 'done', 'admin', 'admin', 'admin', 80, dayAt(-2, 10), 50],
    ['c6', 'Yacht charter in Mykonos, 4 days', 'noah', 'Yacht', 'email', 'high', 'new', null, null, 'daniel', 5, dayAt(6, 12)],
    ['c7', 'Table for 8, Friday at 8pm', 'james', 'Restaurant', 'phone', 'normal', 'new', null, null, 'sofia', 2, dayAt(2, 20)],
    ['c8', 'Personal shopper in Milan', 'emma', 'Shopping', 'email', 'normal', 'in_progress', 'sofia', 'daniel', 'daniel', 40, dayAt(4, 11)],
    ['c9', 'Airport transfer from JFK', 'olivia', 'Transfers', 'phone', 'normal', 'done', 'noa', 'noa', 'noa', 110, dayAt(-4, 7), 96],
    ['c10', 'Opera box for the premiere', 'marco', 'Events', 'email', 'high', 'waiting_provider', 'sofia', 'sofia', 'sofia', 70, dayAt(9, 19)],
    ['c11', 'Spa day for two', 'aiko', 'Massage', 'phone', 'low', 'new', null, null, 'admin', 20, dayAt(7, 10)],
    ['c12', 'Late checkout and a car to the airport', 'james', 'Hotel', 'email', 'normal', 'in_progress', 'noa', 'daniel', 'daniel', 16, dayAt(1, 11)],
    ...SAMPLE_BATCHES.flatMap(([, batch]) => batch(dayAt)),
  ];

  const cases = sampleCases(rows).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  cases.forEach((k, i) => { k.number = 1001 + i; });

  const byId = Object.fromEntries(cases.map(k => [k.id, k]));
  byId.c1.details = 'Celebrating 10 years. Would love a small cake at the end, no shellfish.';
  byId.c1.updates.push({ id: uid(), at: iso(now - 4 * HOUR), by: 'admin', text: 'Chef confirmed the counter for 7:30pm and a shellfish-free menu.' });
  byId.c3.updates.push({ id: uid(), at: iso(now - 20 * HOUR), by: 'admin', text: 'Sent two seat options by email. Waiting for Omer to choose.' });
  byId.c10.updates.push({ id: uid(), at: iso(now - 30 * HOUR), by: 'sofia', text: 'Box office says they’ll confirm availability by Friday.' });
  byId.c2.details = 'Two passengers, one dog. Flexible by an hour either way.';

  const activity = [
    ...clients.map(c => ({ id: uid(), type: 'client_added', by: c.id === 'noah' ? 'daniel' : 'admin', at: c.createdAt, clientId: c.id })),
    ...sampleActivity(cases),
  ].sort((a, b) => b.at.localeCompare(a.at));

  const reminders = [
    { id: uid(), text: 'Call Yael to confirm the anniversary cake', at: dayAt(0, 17), by: 'admin', done: false },
    { id: uid(), text: 'Check jet availability with the charter company', at: dayAt(1, 10), by: 'admin', done: false },
  ];
  const notes = [
    { id: uid(), text: 'Omer always wants 2 seats together, aisle if possible.', color: 'yellow', by: 'admin', at: iso(now - 2 * HOUR) },
    { id: uid(), text: 'Restaurants: ask for the host by name when booking.', color: 'pink', by: 'admin', at: iso(now - 30 * HOUR) },
  ];

  return {
    version: 1, demo: true, ...Object.fromEntries(SAMPLE_BATCHES.map(([flag]) => [flag, true])),
    team, clients, cases, suppliers: DEFAULT_SUPPLIERS.map(s => ({ ...s })), bookings: sampleBookings(cases), activity, reminders, notes,
    nextNumber: 1001 + cases.length, nextClientNumber: 2001 + clients.length,
  };
}
