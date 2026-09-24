// Gustavo data layer: team, clients, cases ("files") and the activity log.
// Kept in localStorage until there is a real backend.
const DATA_KEY = 'gustavo_data_v1';

const CATEGORIES = ['Dining', 'Travel', 'Hotel', 'Events', 'Tickets', 'Gifts', 'Lifestyle', 'Other'];

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
  { id: 'in_progress', label: 'In progress', short: 'In progress' },
  { id: 'waiting', label: 'Waiting on client', short: 'Waiting' },
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

// Older saves predate client IDs.
function migrate(data) {
  if (!data.nextClientNumber) {
    data.nextClientNumber = 2001;
    for (const c of data.clients) if (!c.number) c.number = data.nextClientNumber++;
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

// Removes the sample clients, cases and activity; the team list stays.
function clearSampleData() {
  db = { ...db, demo: false, clients: [], cases: [], activity: [], nextNumber: 1001, nextClientNumber: 2001 };
  saveData();
}

// Brings the sample data back, keeping everyone's chosen icon.
function restoreSampleData() {
  const icons = Object.fromEntries(db.team.map(m => [m.id, { photo: m.photo, emoji: m.emoji, tone: m.tone }]));
  const extra = db.team.filter(m => !['admin', 'daniel', 'sofia', 'noa'].includes(m.id));
  db = buildSeed();
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
    { id: 'admin', name: 'Admin', title: 'Administrator', role: 'admin' },
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
    id, name, phone, email, tier, notes, createdAt: iso(now - daysAgo * DAY),
  }));
  clients.forEach((c, i) => { c.number = 2001 + i; });

  // id, title, client, category, channel, priority, status, assignee, assignedBy, createdBy, hours ago, due, completed hours ago
  const rows = [
    ['c1', "Anniversary dinner for 2 at the chef's table", 'emma', 'Dining', 'phone', 'high', 'in_progress', 'admin', 'daniel', 'daniel', 26, dayAt(0, 19, 30)],
    ['c2', 'Private jet, Nice to London', 'james', 'Travel', 'email', 'urgent', 'new', 'admin', 'daniel', 'daniel', 3, dayAt(1, 9)],
    ['c3', 'Courtside tickets for Saturday', 'marco', 'Tickets', 'phone', 'normal', 'waiting', 'admin', 'admin', 'admin', 50, dayAt(3, 18)],
    ['c4', 'Suite upgrade for the Tokyo stay', 'aiko', 'Hotel', 'email', 'normal', 'in_progress', 'admin', 'admin', 'sofia', 30, dayAt(-1, 17)],
    ['c5', '40 white roses for a birthday', 'olivia', 'Gifts', 'phone', 'low', 'done', 'admin', 'admin', 'admin', 80, dayAt(-2, 10), 50],
    ['c6', 'Yacht charter in Mykonos, 4 days', 'noah', 'Travel', 'email', 'high', 'new', null, null, 'daniel', 5, dayAt(6, 12)],
    ['c7', 'Table for 8, Friday at 8pm', 'james', 'Dining', 'phone', 'normal', 'new', null, null, 'sofia', 2, dayAt(2, 20)],
    ['c8', 'Personal shopper in Milan', 'emma', 'Lifestyle', 'email', 'normal', 'in_progress', 'sofia', 'daniel', 'daniel', 40, dayAt(4, 11)],
    ['c9', 'Airport transfer from JFK', 'olivia', 'Travel', 'phone', 'normal', 'done', 'noa', 'noa', 'noa', 110, dayAt(-4, 7), 96],
    ['c10', 'Opera box for the premiere', 'marco', 'Events', 'email', 'high', 'waiting', 'sofia', 'sofia', 'sofia', 70, dayAt(9, 19)],
    ['c11', 'Spa day for two', 'aiko', 'Lifestyle', 'phone', 'low', 'new', null, null, 'admin', 20, dayAt(7, 10)],
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

  return { version: 1, demo: true, team, clients, cases, activity, nextNumber: 1001 + cases.length, nextClientNumber: 2001 + clients.length };
}
