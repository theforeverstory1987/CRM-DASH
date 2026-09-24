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

// Countries and request types for the sample data, so older saves pick them up too.
const SAMPLE_COUNTRIES = { emma: 'FR', james: 'GB', aiko: 'JP', marco: 'IT', olivia: 'US', noah: 'CH' };
const SAMPLE_TYPES = { c6: 'Yacht', c9: 'Transfers', c11: 'Massage' };

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
  { id: 'waiting_provider', label: 'Waiting on provider', short: 'On provider' },
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
    if (raw) return migrate(JSON.parse(raw));
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
  // "Waiting" used to be one status; it's now split into provider vs. client.
  for (const k of data.cases) if (k.status === 'waiting') k.status = 'waiting_client';
  if (!data.reminders) data.reminders = [];
  if (!data.notes) data.notes = [];
  for (const c of data.clients) if (c.country === undefined) c.country = SAMPLE_COUNTRIES[c.id] || '';
  for (const k of data.cases) {
    if (SAMPLE_TYPES[k.id] && OLD_CATEGORIES[k.category]) k.category = SAMPLE_TYPES[k.id];
    else if (OLD_CATEGORIES[k.category]) k.category = OLD_CATEGORIES[k.category];
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

// Personal reminders and sticky notes, kept per team member (`by`).
function addReminder(text, at, by) {
  db.reminders.push({ id: uid(), text: text.trim(), at, by, done: false });
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

function addNote(text, color, by) {
  db.notes.unshift({ id: uid(), text: text.trim(), color, by, at: new Date().toISOString() });
  saveData();
}

function deleteNote(id) {
  db.notes = db.notes.filter(n => n.id !== id);
  saveData();
}

// Removes the sample clients, cases and activity; the team list stays.
function clearSampleData() {
  db = { ...db, demo: false, clients: [], cases: [], activity: [], nextNumber: 1001, nextClientNumber: 2001 };
  saveData();
}

// Brings the sample data back, keeping everyone's chosen name and icon, reminders and notes.
function restoreSampleData() {
  const icons = Object.fromEntries(db.team.map(m => [m.id, { name: m.name, initials: m.initials, photo: m.photo, emoji: m.emoji, tone: m.tone, color: m.color }]));
  const extra = db.team.filter(m => !['admin', 'daniel', 'sofia', 'noa'].includes(m.id));
  const { reminders, notes } = db;
  db = { ...buildSeed(), reminders, notes };
  db.team.push(...extra);
  for (const m of db.team) Object.assign(m, icons[m.id] || {});
  saveData();
}

// ---------- Sample data ----------
function buildSeed() {
  const now = Date.now();
  const iso = ms => new Date(Math.min(ms, now)).toISOString();
  const dayAt = (offset, h, m = 0) => {
    const d = new Date(now);
    d.setDate(d.getDate() + offset);
    d.setHours(h, m, 0, 0);
    return d.toISOString();
  };

  const team = [
    { id: 'admin', name: 'Amit.R', initials: 'AR', title: 'Administrator', role: 'admin' },
    { id: 'daniel', name: 'Daniel Reyes', title: 'Head concierge', role: 'admin' },
    { id: 'sofia', name: 'Sofia Marín', title: 'Concierge', role: 'staff' },
    { id: 'noa', name: 'Noa Adler', title: 'Concierge', role: 'staff' },
  ];

  const clients = [
    ['emma', 'Emma Laurent', '+1 555 0142', 'emma.laurent@example.com', 'VIP', 'Window tables. Shellfish allergy.', 120],
    ['james', 'James Whitfield', '+1 555 0187', 'j.whitfield@example.com', 'Platinum', 'Flies private. Aisle seat when flying commercial.', 95],
    ['aiko', 'Aiko Tanaka', '+1 555 0119', 'aiko.tanaka@example.com', 'Gold', 'Vegetarian. Loves spa hotels.', 60],
    ['marco', 'Marco Bellini', '+1 555 0163', 'marco@example.com', 'Platinum', 'Opera and basketball. Always 2 seats.', 45],
    ['olivia', 'Olivia Grant', '+1 555 0128', 'olivia.grant@example.com', 'Gold', 'White flowers only.', 20],
    ['noah', 'Noah Berger', '+1 555 0176', 'noah.berger@example.com', 'Standard', 'Referred by James Whitfield.', 3],
  ].map(([id, name, phone, email, tier, notes, daysAgo]) => ({
    id, name, phone, email, tier, notes, country: SAMPLE_COUNTRIES[id], createdAt: iso(now - daysAgo * DAY),
  }));
  clients.forEach((c, i) => { c.number = 2001 + i; });

  // id, title, client, category, channel, priority, status, assignee, assignedBy, createdBy, hours ago, due, completed hours ago
  const rows = [
    ['c1', "Anniversary dinner for 2 at the chef's table", 'emma', 'Restaurant', 'phone', 'high', 'in_progress', 'admin', 'daniel', 'daniel', 26, dayAt(0, 19, 30)],
    ['c2', 'Private jet, Nice to London', 'james', 'Flights', 'email', 'urgent', 'new', 'admin', 'daniel', 'daniel', 3, dayAt(1, 9)],
    ['c3', 'Courtside tickets for Saturday', 'marco', 'Tickets', 'phone', 'normal', 'waiting_client', 'admin', 'admin', 'admin', 50, dayAt(3, 18)],
    ['c4', 'Suite upgrade for the Tokyo stay', 'aiko', 'Hotel', 'email', 'normal', 'in_progress', 'admin', 'admin', 'sofia', 30, dayAt(-1, 17)],
    ['c5', '40 white roses for a birthday', 'olivia', 'Gifts', 'phone', 'low', 'done', 'admin', 'admin', 'admin', 80, dayAt(-2, 10), 50],
    ['c6', 'Yacht charter in Mykonos, 4 days', 'noah', 'Yacht', 'email', 'high', 'new', null, null, 'daniel', 5, dayAt(6, 12)],
    ['c7', 'Table for 8, Friday at 8pm', 'james', 'Restaurant', 'phone', 'normal', 'new', null, null, 'sofia', 2, dayAt(2, 20)],
    ['c8', 'Personal shopper in Milan', 'emma', 'Shopping', 'email', 'normal', 'in_progress', 'sofia', 'daniel', 'daniel', 40, dayAt(4, 11)],
    ['c9', 'Airport transfer from JFK', 'olivia', 'Transfers', 'phone', 'normal', 'done', 'noa', 'noa', 'noa', 110, dayAt(-4, 7), 96],
    ['c10', 'Opera box for the premiere', 'marco', 'Events', 'email', 'high', 'waiting_provider', 'sofia', 'sofia', 'sofia', 70, dayAt(9, 19)],
    ['c11', 'Spa day for two', 'aiko', 'Massage', 'phone', 'low', 'new', null, null, 'admin', 20, dayAt(7, 10)],
    ['c12', 'Late checkout and a car to the airport', 'james', 'Hotel', 'email', 'normal', 'in_progress', 'noa', 'daniel', 'daniel', 16, dayAt(1, 11)],
  ];

  const cases = rows
    .map(([id, title, clientId, category, channel, priority, status, assignee, assignedBy, createdBy, hoursAgo, dueAt, doneHoursAgo]) => ({
      id, title, clientId, category, channel, priority, status, assignee, assignedBy, createdBy, dueAt,
      details: '',
      createdAt: iso(now - hoursAgo * HOUR),
      completedAt: doneHoursAgo ? iso(now - doneHoursAgo * HOUR) : null,
      updates: [],
    }))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  cases.forEach((k, i) => { k.number = 1001 + i; });

  const byId = Object.fromEntries(cases.map(k => [k.id, k]));
  byId.c1.details = 'Celebrating 10 years. Would love a small cake at the end, no shellfish.';
  byId.c1.updates.push({ id: uid(), at: iso(now - 4 * HOUR), by: 'admin', text: 'Chef confirmed the counter for 7:30pm and a shellfish-free menu.' });
  byId.c3.updates.push({ id: uid(), at: iso(now - 20 * HOUR), by: 'admin', text: 'Sent two seat options by email. Waiting for Marco to choose.' });
  byId.c10.updates.push({ id: uid(), at: iso(now - 30 * HOUR), by: 'sofia', text: 'Box office says they’ll confirm availability by Friday.' });
  byId.c2.details = 'Two passengers, one dog. Flexible by an hour either way.';

  const activity = [];
  const push = (type, by, atMs, fields) => activity.push({ id: uid(), type, by, at: iso(atMs), ...fields });
  for (const c of clients) push('client_added', c.id === 'noah' ? 'daniel' : 'admin', Date.parse(c.createdAt), { clientId: c.id });
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
  activity.sort((a, b) => b.at.localeCompare(a.at));

  const reminders = [
    { id: uid(), text: 'Call Emma to confirm the anniversary cake', at: dayAt(0, 17), by: 'admin', done: false },
    { id: uid(), text: 'Check jet availability with the charter company', at: dayAt(1, 10), by: 'admin', done: false },
  ];
  const notes = [
    { id: uid(), text: 'Marco always wants 2 seats together, aisle if possible.', color: 'yellow', by: 'admin', at: iso(now - 2 * HOUR) },
    { id: uid(), text: 'Restaurants: ask for the host by name when booking.', color: 'pink', by: 'admin', at: iso(now - 30 * HOUR) },
  ];

  return { version: 1, demo: true, team, clients, cases, activity, reminders, notes, nextNumber: 1001 + cases.length, nextClientNumber: 2001 + clients.length };
}
