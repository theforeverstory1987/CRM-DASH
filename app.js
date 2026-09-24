// Gustavo app: round-button rail, My dashboard, Activity (all open cases + reports),
// Settings, search drawers, and full pages for new files and cases.
const session = getSession();
const ME = session ? session.username : 'admin';

if (session && !findMember(ME)) {
  db.team.unshift({
    id: ME,
    name: session.name || ME,
    title: session.role === 'admin' ? 'Administrator' : 'Concierge',
    role: session.role || 'staff',
  });
  saveData();
}
const IS_ADMIN = (findMember(ME) || {}).role === 'admin';

const state = {
  route: { name: 'home' },
  home: { view: 'all', priority: '', date: '', sort: 'due', text: '' },
  all: { status: 'all', whose: '', priority: '', date: '', sort: 'due', text: '' },
  activityTab: 'cases',
  range: 30,
  logType: 'all',
  logPerson: '',
  adv: null,
};

// ---------- Icons ----------
const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/>',
  activity: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  filePlus: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M12 11v6M9 14h6"/>',
  userPlus: '<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0"/><path d="M19 8v6M16 11h6"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  phone: '<path d="M5 3h3.5l1.5 4.5-2.2 1.4a11 11 0 0 0 7.3 7.3l1.4-2.2L21 15.5V19a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  sliders: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5h13l3.5 7v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6z"/>',
  flame: '<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.2 1-3.6 2-4.6.3 1.6 1 2.6 2 3.1C11 9 11 6 12 3z"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7"/><path d="M3 12.5h18"/>',
  arrowIn: '<path d="M4 12h12"/><path d="m11 6 6 6-6 6"/><path d="M20 4v16"/>',
  refresh: '<path d="M20 12a8 8 0 1 1-2.3-5.7L20 8.5"/><path d="M20 4v4.5h-4.5"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  arrowRight: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  arrowUpRight: '<path d="M7 17 17 7"/><path d="M8 7h9v9"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2.5"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
  hash: '<path d="M5 9h14M5 15h14M10 3 8 21M16 3l-2 18"/>',
  pencil: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  upload: '<path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/>',
  calendar: '<rect x="3" y="4.5" width="18" height="16.5" rx="2.5"/><path d="M8 3v3M16 3v3M3 10h18"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
};

const STATUS_ICONS = { new: 'plus', in_progress: 'refresh', waiting_provider: 'briefcase', waiting_client: 'clock', done: 'check' };

function icon(name, cls = '') {
  return `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;
}

// ---------- Helpers ----------
function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function labelOf(list, id) {
  return (list.find(x => x.id === id) || { label: id }).label;
}

function firstName(name) {
  return (name || '').split(' ')[0];
}

// "You" for the signed-in person, otherwise their name.
function memberName(id) {
  if (!id) return 'Open pool';
  if (id === ME) return 'You';
  const member = findMember(id);
  return member ? member.name : 'Someone';
}

// Two letters: "Emma Laurent" → EL, "Admin" → AD.
function initials(name) {
  const words = (name || '?').split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words.slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

function hashTone(seed) {
  let hash = 0;
  for (const ch of String(seed)) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return hash % 5;
}

function avatar(name, seed, size = '') {
  return `<span class="avatar tone-${hashTone(seed)} ${size}" aria-hidden="true">${esc(initials(name))}</span>`;
}

// A team member's own initials if they set them, otherwise from their name.
function memberInitials(member) {
  if (!member) return '?';
  return member.initials || initials(member.name);
}

function toneOf(member, seed) {
  return member && Number.isInteger(member.tone) ? member.tone : hashTone(seed);
}

function memberAvatar(id, size = '') {
  const member = findMember(id);
  const tone = toneOf(member, id);
  let face;
  if (member && member.photo) face = `<span class="avatar ${size}"><img src="${esc(member.photo)}" alt=""></span>`;
  else if (member && member.emoji) face = `<span class="avatar emoji tone-${tone} ${size}">${esc(member.emoji)}</span>`;
  else return `<span class="avatar tone-${tone} ${size}" aria-hidden="true">${esc(memberInitials(member))}</span>`;
  // With a photo or icon, keep the initials in a small bubble so people stay recognisable.
  if (size === 'xs' || size === 'sm') return face.replace('<span class="avatar', '<span aria-hidden="true" class="avatar');
  return `<span class="avatar-wrap ${size}" aria-hidden="true">${face}<span class="avatar-badge tone-${tone}">${esc(memberInitials(member))}</span></span>`;
}

function caseNo(kase) {
  return `G-${kase.number}`;
}

function clientNo(client) {
  return `C-${client.number}`;
}

// An ID that copies itself to the clipboard when clicked.
function idChip(id) {
  return `<button type="button" class="id-chip" data-copy="${esc(id)}" title="Copy ${esc(id)}" aria-label="Copy ${esc(id)}">${esc(id)}${icon('copy')}</button>`;
}

const isOpen = kase => kase.status !== 'done';
const PRIORITY_RANK = { urgent: 0, high: 1, normal: 2, low: 3 };
const dueSort = (a, b) => (a.dueAt || '9999').localeCompare(b.dueAt || '9999');
const doneSort = (a, b) => (b.completedAt || '').localeCompare(a.completedAt || '');

function toLocalInputValue(date) {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function defaultDue() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(12, 0, 0, 0);
  return toLocalInputValue(d);
}

const timeFmt = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' });
const weekdayFmt = new Intl.DateTimeFormat(undefined, { weekday: 'long' });
const weekdayShortFmt = new Intl.DateTimeFormat(undefined, { weekday: 'short' });
const shortDateFmt = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' });
const longDayFmt = new Intl.DateTimeFormat(undefined, { weekday: 'long', day: 'numeric', month: 'long' });

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function dayDiff(date) {
  return Math.round((startOfDay(date) - startOfDay(new Date())) / DAY);
}

// "Today, 12:20", "Monday, 09:00", "22 Sep, 14:10"
function fmtDayTime(iso) {
  const d = new Date(iso);
  const diff = dayDiff(d);
  const day = diff === 0 ? 'Today'
    : diff === -1 ? 'Yesterday'
      : diff === 1 ? 'Tomorrow'
        : Math.abs(diff) < 7 ? weekdayFmt.format(d)
          : shortDateFmt.format(d);
  return `${day}, ${timeFmt.format(d)}`;
}

function fmtDue(kase) {
  if (kase.status === 'done') {
    return { label: 'Done', text: kase.completedAt ? fmtDayTime(kase.completedAt) : '', cls: 'done' };
  }
  if (!kase.dueAt) return { label: '', text: 'No due date', cls: '' };
  if (new Date(kase.dueAt) < new Date()) return { label: 'Overdue', text: fmtDayTime(kase.dueAt), cls: 'overdue' };
  return { label: 'Due', text: fmtDayTime(kase.dueAt), cls: dayDiff(kase.dueAt) === 0 ? 'today' : '' };
}

function dayLabel(iso) {
  const diff = dayDiff(iso);
  if (diff === 0) return 'Today';
  if (diff === -1) return 'Yesterday';
  return longDayFmt.format(new Date(iso));
}

// ---------- Small components ----------
function statusTag(status, cls = '') {
  return `<span class="tag st-${status} ${cls}">${icon(STATUS_ICONS[status])}${esc(labelOf(STATUSES, status))}</span>`;
}

function priorityTag(priority, cls = '') {
  const hot = priority === 'urgent' || priority === 'high';
  return `<span class="tag pr-${priority} ${cls}">${hot ? icon('flame') : ''}${esc(labelOf(PRIORITIES, priority))}</span>`;
}

// Only surface priority when it needs attention.
function hotTag(priority, cls = '') {
  return priority === 'urgent' || priority === 'high' ? priorityTag(priority, cls) : '';
}

function channelTag(channel, cls = '') {
  return `<span class="tag ${cls}">${icon(channel === 'email' ? 'mail' : 'phone')}${esc(labelOf(CHANNELS, channel))}</span>`;
}

function tierTag(tier) {
  return tier && tier !== 'Standard' ? `<span class="tag sm tier-${tier.toLowerCase()}">${esc(tier)}</span>` : '';
}

function stat({ label, value, sub = '', ic, featured = false, shortcut = '' }) {
  const tag = shortcut ? 'button' : 'div';
  const attrs = shortcut ? ` type="button" data-shortcut="${shortcut}" aria-label="${esc(label)}: ${value}. Show these cases"` : '';
  return `
    <${tag} class="stat${featured ? ' featured' : ''}"${attrs}>
      <span class="stat-top"><span class="stat-label">${label}</span><span class="stat-icon">${icon(ic)}</span></span>
      <span class="stat-value">${value}</span>
      <span class="stat-sub">${sub}</span>
    </${tag}>`;
}

function miniStat({ label, value, ic, tone = '', shortcut = '' }) {
  const tag = shortcut ? 'button' : 'div';
  const attrs = shortcut ? ` type="button" data-shortcut="${shortcut}" aria-label="${esc(label)}: ${value}. Show these cases"` : '';
  return `
    <${tag} class="mini-stat${tone ? ` mini-stat-${tone}` : ''}"${attrs}>
      <span class="mini-stat-icon">${icon(ic)}</span>
      <span class="mini-stat-value">${value}</span>
      <span class="mini-stat-label">${label}</span>
    </${tag}>`;
}

function pillButtons(attr, opts, active) {
  return opts.map(([value, label, count]) => `
    <button type="button" class="${String(value) === String(active) ? 'active' : ''}" data-${attr}="${value}">
      ${esc(label)}${count !== undefined ? `<span class="pill-count">${count}</span>` : ''}
    </button>`).join('');
}

function segRadio(name, opts, value, labelKey = 'label') {
  return `<div class="seg-radio" role="radiogroup">${opts.map(o => `
    <label><input type="radio" name="${name}" value="${o.id}"${o.id === value ? ' checked' : ''}><span>${esc(o[labelKey])}</span></label>`).join('')}
  </div>`;
}

function checkGroup(name, opts, selected = []) {
  return `<div class="check-group">${opts.map(o => `
    <label><input type="checkbox" name="${name}" value="${o.id}"${selected.includes(o.id) ? ' checked' : ''}><span>${esc(o.label)}</span></label>`).join('')}
  </div>`;
}

function options(list, selected) {
  return list.map(([value, label]) => `<option value="${esc(value)}"${value === selected ? ' selected' : ''}>${esc(label)}</option>`).join('');
}

function selectWrap(id, optionsHtml) {
  return `<div class="select-wrap"><select id="${id}" class="control">${optionsHtml}</select><span class="select-tile" aria-hidden="true">${icon('chevronDown')}</span></div>`;
}

// ---------- Case lists with filters ----------
const STATUS_FILTERS = [['all', 'All open'], ['new', 'Open'], ['in_progress', 'Ongoing'], ['waiting_provider', 'Wait: provider'], ['waiting_client', 'Wait: client'], ['done', 'Done']];
const PRIORITY_FILTERS = [['', 'Any priority'], ['hot', 'Urgent & high'], ['urgent', 'Urgent'], ['high', 'High'], ['normal', 'Normal'], ['low', 'Low']];
const DATE_FILTERS = [['', 'Any date'], ['overdue', 'Overdue'], ['today', 'Due today'], ['week', 'Due this week'], ['later', 'Due later'], ['none', 'No due date']];
const SORTS = [['due', 'Sort: due date'], ['priority', 'Sort: priority'], ['newest', 'Sort: newest']];

// The dashboard's side menu: one view at a time, like mail folders.
const HOME_VIEWS = [
  {
    section: 'My cases',
    items: [
      { id: 'all', label: 'All open', icon: 'briefcase', hint: 'Assigned to you, or taken yourself', empty: 'Nothing on your plate. Take a case from the open pool, or open a new file with +.' },
      { id: 'new', label: 'Open', icon: 'plus', hint: 'Not started yet', empty: 'No cases waiting to be started.' },
      { id: 'in_progress', label: 'Ongoing', icon: 'refresh', hint: 'You’re working on these', empty: 'Nothing in progress right now.' },
      { id: 'waiting_provider', label: 'Waiting on provider', icon: 'briefcase', hint: 'Waiting for the vendor to reply', empty: 'No cases waiting on a provider.' },
      { id: 'waiting_client', label: 'Waiting on client', icon: 'clock', hint: 'Waiting for the client to reply', empty: 'No cases waiting on a client.' },
      { id: 'done', label: 'Done', icon: 'check', hint: 'Cases you finished', empty: 'Nothing finished yet.' },
    ],
  },
  {
    section: 'How they reached me',
    items: [
      { id: 'assigned', label: 'Assigned to me', icon: 'arrowIn', hint: 'Given to you by the admin', empty: 'No open cases assigned to you.' },
      { id: 'taken', label: 'I took', icon: 'user', hint: 'Cases you picked up yourself', empty: 'You haven’t taken any open cases.' },
    ],
  },
  {
    section: 'Team',
    items: [
      { id: 'pool', label: 'Open pool', icon: 'inbox', hint: 'Nobody has taken these yet — take one to make it yours', empty: 'The pool is empty. Nice work.' },
    ],
  },
];
const VIEW_KEY = 'gustavo_home_view';

function homeView(id) {
  for (const s of HOME_VIEWS) for (const v of s.items) if (v.id === id) return v;
  return HOME_VIEWS[0].items[0];
}

function whoseAll() {
  return [['', 'Everyone'], ['__pool', 'Open pool'], ...db.team.map(m => [m.id, m.id === ME ? `${m.name} (you)` : m.name])];
}

function myCases() {
  return db.cases.filter(k => k.assignee === ME);
}

function homeViewCases(view) {
  const mine = myCases();
  switch (view) {
    case 'new':
    case 'in_progress':
    case 'waiting_provider':
    case 'waiting_client':
    case 'done':
      return mine.filter(k => k.status === view);
    case 'assigned': return mine.filter(k => isOpen(k) && k.assignedBy !== ME);
    case 'taken': return mine.filter(k => isOpen(k) && k.assignedBy === ME);
    case 'pool': return db.cases.filter(k => !k.assignee && isOpen(k));
    default: return mine.filter(isOpen);
  }
}

function matchesText(kase, term) {
  if (!term) return true;
  const client = findClient(kase.clientId);
  return [kase.title, caseNo(kase), String(kase.number), client && client.name, client && clientNo(client), kase.category, kase.details]
    .some(v => (v || '').toLowerCase().includes(term));
}

// Activity's "All cases" scope before the status/priority/date filters.
function scopedCases(key) {
  const f = state[key];
  if (f.whose === '__pool') return db.cases.filter(k => !k.assignee);
  if (f.whose) return db.cases.filter(k => k.assignee === f.whose);
  return db.cases;
}

function matchesDate(kase, filter) {
  if (!filter) return true;
  const now = new Date();
  const due = kase.dueAt ? new Date(kase.dueAt) : null;
  if (filter === 'none') return !due;
  if (!due) return false;
  const weekEnd = endOfDay(new Date(now.getTime() + 6 * DAY));
  if (filter === 'overdue') return isOpen(kase) && due < now;
  if (filter === 'today') return due >= startOfDay(now) && due <= endOfDay(now);
  if (filter === 'week') return due >= startOfDay(now) && due <= weekEnd;
  if (filter === 'later') return due > weekEnd;
  return true;
}

function matchesPriority(kase, filter) {
  if (!filter) return true;
  if (filter === 'hot') return kase.priority === 'urgent' || kase.priority === 'high';
  return kase.priority === filter;
}

function filteredCases(key) {
  const f = state[key];
  const term = f.text.trim().toLowerCase();
  const showsDone = key === 'home' ? f.view === 'done' : f.status === 'done';
  const sorters = {
    due: showsDone ? doneSort : dueSort,
    priority: (a, b) => (PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]) || dueSort(a, b),
    newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
  };
  const base = key === 'home'
    ? homeViewCases(f.view)
    : scopedCases(key).filter(k => (f.status === 'all' ? isOpen(k) : k.status === f.status));
  return base
    .filter(k => matchesPriority(k, f.priority))
    .filter(k => matchesDate(k, f.date))
    .filter(k => matchesText(k, term))
    .sort(sorters[f.sort] || dueSort);
}

function statusCounts(key) {
  const scope = scopedCases(key);
  const counts = { all: scope.filter(isOpen).length };
  for (const s of STATUSES) counts[s.id] = scope.filter(k => k.status === s.id).length;
  return counts;
}

function filterSelect(key, field, opts, value, label) {
  const isSet = value && field !== 'sort';
  return `<select class="control-sm${isSet ? ' set' : ''}" data-fset="${key}.${field}" aria-label="${label}">${options(opts, value)}</select>`;
}

function isRefined(key) {
  const f = state[key];
  return Boolean(f.priority || f.date || f.text.trim());
}

// Search, priority, date and sort narrow whichever view is showing.
function refineRow(key, leading = '') {
  const f = state[key];
  return `
    <div class="filter-row">
      ${leading}
      <label class="search">${icon('search')}<input type="search" data-ftext="${key}" placeholder="Filter by title, client or ID" aria-label="Filter cases" value="${esc(f.text)}"></label>
      ${filterSelect(key, 'priority', PRIORITY_FILTERS, f.priority, 'Priority')}
      ${filterSelect(key, 'date', DATE_FILTERS, f.date, 'Due date')}
      ${filterSelect(key, 'sort', SORTS, f.sort, 'Sort')}
      ${isRefined(key) ? `<button type="button" class="link-btn" data-action="clear-refine" data-key="${key}">${icon('x')}Clear filters</button>` : ''}
    </div>`;
}

function filterBar(key) {
  const f = state[key];
  const counts = statusCounts(key);
  return `
    <div class="filters">
      <div class="pills" role="group" aria-label="Status">
        ${STATUS_FILTERS.map(([v, l]) => `<button type="button" class="${f.status === v ? 'active' : ''}" data-fset="${key}.status" data-value="${v}">${l}<span class="pill-count">${counts[v]}</span></button>`).join('')}
      </div>
      ${refineRow(key, filterSelect(key, 'whose', whoseAll(), f.whose, 'Whose cases'))}
    </div>`;
}

function renderList(key) {
  const listEl = document.getElementById(`${key}List`);
  if (!listEl) return;
  const list = filteredCases(key);
  const countEl = document.getElementById(`${key}Count`);
  if (countEl) countEl.textContent = list.length;
  const emptyText = isRefined(key)
    ? 'No cases match these filters.'
    : key === 'home' ? homeView(state.home.view).empty : 'No cases here.';
  listEl.innerHTML = list.length
    ? list.map(k => caseCard(k, key)).join('')
    : `<div class="empty">${emptyText}</div>`;
}

function lastUpdateOf(kase) {
  return kase.updates.length ? kase.updates.reduce((a, b) => (a.at > b.at ? a : b)) : null;
}

function caseCard(kase, key) {
  const client = findClient(kase.clientId);
  const due = fmtDue(kase);
  let who;
  if (!kase.assignee) {
    who = isOpen(kase)
      ? `<span>Open pool</span><button type="button" class="btn-take" data-take="${kase.id}">${icon('plus')}Take</button>`
      : `${icon('inbox')}<span><b>Open pool</b></span>`;
  } else if (key === 'home' && kase.assignee === ME) {
    who = kase.assignedBy === ME
      ? `${memberAvatar(ME, 'xs')}<span>You took this</span>`
      : `${memberAvatar(kase.assignedBy, 'xs')}<span>Assigned by <b>${esc(firstName(memberName(kase.assignedBy)))}</b></span>`;
  } else {
    who = `${memberAvatar(kase.assignee, 'xs')}<span>Handled by <b>${esc(kase.assignee === ME ? 'you' : firstName(memberName(kase.assignee)))}</b></span>`;
  }
  const cls = [!isOpen(kase) && 'is-done', due.cls === 'overdue' && 'is-overdue'].filter(Boolean).join(' ');
  const lastUpdate = lastUpdateOf(kase);
  return `
    <div class="case ${cls}" role="button" tabindex="0" data-case="${kase.id}">
      <span class="case-check" aria-hidden="true">${isOpen(kase) ? '' : icon('check')}</span>
      <span class="case-body">
        <span class="case-top">
          <span class="case-title">${esc(kase.title)}</span>
          <span class="case-when ${due.cls}">${due.label ? `<span class="lbl">${due.label}:</span> ` : ''}${esc(due.text)}</span>
        </span>
        <span class="case-sub">${idChip(caseNo(kase))}<span>${esc(client ? client.name : 'Unknown client')} · ${esc(kase.category)}</span></span>
        ${lastUpdate ? `
        <span class="case-followup">${icon('layers')}<span class="quote-text">“${esc(lastUpdate.text)}”</span><span class="muted">— ${esc(firstName(memberName(lastUpdate.by)))}</span></span>` : ''}
        <span class="case-bottom">
          <span class="tags">${channelTag(kase.channel, 'sm')}${hotTag(kase.priority, 'sm')}</span>
          <span class="case-by">${who}</span>
        </span>
        <span class="case-quick" data-stop>
          <select class="status-select st-${kase.status}" data-status-for="${kase.id}" aria-label="Change status">
            ${STATUSES.map(s => `<option value="${s.id}"${s.id === kase.status ? ' selected' : ''}>${esc(s.short)}</option>`).join('')}
          </select>
          ${client && client.email ? `<a class="icon-btn sm" data-action="email-client" href="mailto:${esc(client.email)}" title="Email ${esc(client.name)}" aria-label="Email ${esc(client.name)}">${icon('mail')}</a>` : ''}
          <button type="button" class="icon-btn sm" data-action="toggle-followup" title="Add a quick follow-up" aria-label="Add a quick follow-up">${icon('pencil')}</button>
        </span>
        <form class="quick-followup" data-followup-form="${kase.id}" data-list-key="${key}" data-stop hidden>
          <input type="text" placeholder="Quick follow-up for the team…" aria-label="Quick follow-up">
          <button type="submit" class="btn btn-primary btn-sm" aria-label="Send">${icon('check')}</button>
        </form>
      </span>
    </div>`;
}

function poolItem(kase) {
  const client = findClient(kase.clientId);
  const due = fmtDue(kase);
  return `
    <div class="pool-item">
      <div class="pool-body" role="button" tabindex="0" data-case="${kase.id}">
        <span class="pool-title">${esc(kase.title)}</span>
        <span class="pool-sub">${idChip(caseNo(kase))}<span>${esc(client ? client.name : 'Unknown client')} · ${esc(kase.category)}</span></span>
        <span class="tags">${hotTag(kase.priority, 'sm')}<span class="tag sm${due.cls === 'overdue' ? ' pr-urgent' : ''}">${icon('clock')}${esc(due.text)}</span></span>
      </div>
      <button type="button" class="btn-take" data-take="${kase.id}">${icon('plus')}Take</button>
    </div>`;
}

function poolPanel() {
  const pool = db.cases.filter(k => !k.assignee && isOpen(k)).sort(dueSort);
  return `
    <section class="panel">
      <div class="panel-head"><h2>Open pool <span class="count-badge">${pool.length}</span></h2></div>
      <p class="panel-sub">Cases nobody has taken yet. Take one to make it yours.</p>
      <div class="pool-list">${pool.length ? pool.map(poolItem).join('') : '<div class="empty">The pool is empty. Nice work.</div>'}</div>
    </section>`;
}

// ---------- Activity entries ----------
function transition(fromHtml, toHtml) {
  return `<div class="transition">${fromHtml}<span class="arrow" aria-hidden="true"></span>${toHtml}</div>`;
}

function describe(entry) {
  const who = `<b>${esc(memberName(entry.by))}</b>`;
  const v = text => `<span class="verb">${text}</span>`;
  const kase = entry.caseId ? findCase(entry.caseId) : null;
  const link = kase
    ? `<button type="button" class="feed-link" data-case="${kase.id}">${esc(kase.title)}</button>`
    : '<b>a removed case</b>';
  const client = entry.clientId ? findClient(entry.clientId) : kase ? findClient(kase.clientId) : null;
  const target = entry.to === ME ? 'you' : memberName(entry.to);

  switch (entry.type) {
    case 'case_created':
      return {
        html: `${who} ${v('opened')} ${link}${client ? ` ${v('for')} <b>${esc(client.name)}</b>` : ''}`,
        extra: kase ? `<div class="tags">${channelTag(kase.channel, 'sm')}<span class="tag sm">${esc(kase.category)}</span>${hotTag(kase.priority, 'sm')}</div>` : '',
      };
    case 'case_assigned':
      return {
        html: `${who} ${v('assigned')} ${link} ${v('to')} <b>${esc(target)}</b>`,
        extra: transition(`<span class="tag">${icon('arrowIn')}Assigned</span>`, `<span class="tag to">${icon('user')}${esc(target)}</span>`),
      };
    case 'case_taken':
      return {
        html: `${who} ${v('took')} ${link}`,
        extra: transition(`<span class="tag">${icon('inbox')}Open pool</span>`, `<span class="tag to">${icon('check')}Taken</span>`),
      };
    case 'case_unassigned':
      return {
        html: `${who} ${v('moved')} ${link} ${v('to the open pool')}`,
        extra: transition('<span class="tag">Assigned</span>', `<span class="tag to st-new">${icon('inbox')}Open pool</span>`),
      };
    case 'status_changed':
      return {
        html: `${who} ${v('updated')} ${link}`,
        extra: transition(statusTag(entry.from), statusTag(entry.to, 'to')),
      };
    case 'note_added':
      return { html: `${who} ${v('added an update on')} ${link}`, extra: `<div class="quote">${esc(entry.text)}</div>` };
    case 'client_added':
      return {
        html: `${who} ${v('added client')} <b>${esc(client ? client.name : 'a client')}</b>`,
        extra: client && client.tier !== 'Standard' ? `<div class="tags">${tierTag(client.tier)}</div>` : '',
      };
    default:
      return { html: who, extra: '' };
  }
}

function updateCard(entry, featured = false) {
  const d = describe(entry);
  return `
    <article class="update${featured ? ' featured' : ''}">
      <div class="update-head">
        ${memberAvatar(entry.by)}
        <div class="update-main">
          <p class="update-text">${d.html}</p>
          <p class="update-time">${fmtDayTime(entry.at)}</p>
        </div>
      </div>
      ${d.extra}
    </article>`;
}

// ---------- Routing ----------
const viewEl = document.getElementById('view');

function parseRoute() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [path, query = ''] = raw.split('?');
  const parts = path.split('/').filter(Boolean);
  const params = new URLSearchParams(query);
  const name = parts[0] || 'home';
  if (name === 'case') return { name: 'case', id: parts[1], params };
  if (['home', 'activity', 'settings', 'new', 'search'].includes(name)) return { name, params };
  return { name: 'home', params };
}

function render() {
  const route = state.route;
  const navKey = route.name === 'case' || route.name === 'new' || route.name === 'search' ? '' : route.name;
  document.querySelectorAll('[data-route]').forEach(el => {
    const active = el.dataset.route === navKey;
    el.classList.toggle('active', active);
    if (active) el.setAttribute('aria-current', 'page');
    else el.removeAttribute('aria-current');
  });
  if (route.name === 'activity') renderActivity();
  else if (route.name === 'settings') renderSettings();
  else if (route.name === 'new') renderNewFilePage({ clientId: route.params.get('client') || '' });
  else if (route.name === 'search') renderSearchPage(route.params.get('q') || '');
  else if (route.name === 'case') renderCasePage(route.id);
  else renderHome();
}

function refreshAvatars() {
  document.querySelectorAll('[data-me-avatar]').forEach(el => { el.innerHTML = memberAvatar(ME); });
}

// ---------- My dashboard ----------
function renderHome() {
  const mine = myCases();
  const myOpen = mine.filter(isOpen);
  const urgent = myOpen.filter(k => k.priority === 'urgent');
  const ongoing = myOpen.filter(k => k.status === 'in_progress');
  const waitProvider = myOpen.filter(k => k.status === 'waiting_provider');
  const waitClient = myOpen.filter(k => k.status === 'waiting_client');
  const me = findMember(ME);
  const view = homeView(state.home.view);

  viewEl.innerHTML = `
    <div class="dash">
      <aside class="dash-nav" aria-label="Dashboard views">
        <div class="dash-me">
          ${memberAvatar(ME)}
          <div class="dash-me-text">
            <div class="dash-me-name">${esc(me.name)}</div>
            <div class="dash-me-sub">${esc(me.title)}</div>
          </div>
          <button type="button" class="icon-btn" data-action="edit-avatar" aria-label="Change your icon" title="Change your icon">${icon('pencil')}</button>
        </div>
        ${HOME_VIEWS.map(section => `
          <div class="dash-section">
            <p class="dash-label">${section.section}</p>
            ${section.items.map(item => {
              const count = homeViewCases(item.id).length;
              const alert = item.id === 'pool' && count > 0;
              return `
                <button type="button" class="dash-item${item.id === view.id ? ' active' : ''}" data-view="${item.id}"${item.id === view.id ? ' aria-current="true"' : ''}>
                  ${icon(item.icon)}<span class="dash-item-label">${item.label}</span><span class="dash-count${alert ? ' alert' : ''}">${count}</span>
                </button>`;
            }).join('')}
          </div>`).join('')}
      </aside>

      <div class="dash-main">
        <header class="dash-head">
          <p class="eyebrow"><img class="eyebrow-logo" src="favicon.svg" alt="">Dashboard</p>
          <h1 class="page-title dash-title">My <span class="soft">dashboard</span></h1>
        </header>

        <section class="stats stats-mini">
          ${miniStat({ label: 'To handle', value: myOpen.length, ic: 'briefcase', shortcut: 'view:all' })}
          ${miniStat({ label: 'All', value: mine.length, ic: 'layers' })}
          ${miniStat({ label: 'Urgent', value: urgent.length, ic: 'flame', tone: 'urgent', shortcut: 'priority:urgent' })}
          ${miniStat({ label: 'Ongoing', value: ongoing.length, ic: 'refresh', tone: 'progress', shortcut: 'view:in_progress' })}
          ${miniStat({ label: 'On provider', value: waitProvider.length, ic: 'briefcase', tone: 'provider', shortcut: 'view:waiting_provider' })}
          ${miniStat({ label: 'On client', value: waitClient.length, ic: 'clock', tone: 'client', shortcut: 'view:waiting_client' })}
        </section>

        <section class="panel">
          <div class="panel-head">
            <h2>${esc(view.label)} <span class="count-badge" id="homeCount"></span></h2>
            <span class="muted small">${esc(view.hint)}</span>
          </div>
          <div class="filters">${refineRow('home')}</div>
          <div class="case-list" id="homeList"></div>
        </section>
      </div>
    </div>`;
  renderList('home');
}

// Number cards jump straight to what they count.
function applyShortcut(shortcut) {
  const [field, value] = shortcut.split(':');
  state.home = { ...state.home, view: 'all', priority: '', date: '', text: '' };
  state.home[field] = value;
  saveHomeView();
  render();
  document.getElementById('homeList')?.closest('.panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function saveHomeView() {
  try {
    localStorage.setItem(VIEW_KEY, state.home.view);
  } catch {
    // Remembering the view is a nicety; ignore blocked storage.
  }
}

// ---------- Activity: all open cases + reports ----------
function renderActivity() {
  const tabParam = state.route.params && state.route.params.get('tab');
  if (tabParam) state.activityTab = tabParam === 'reports' ? 'reports' : 'cases';
  const tabs = [['cases', 'Open cases'], ['reports', 'Reports & log']];

  const head = `
    <header class="page-head">
      <div>
        <p class="eyebrow"><img class="eyebrow-logo" src="favicon.svg" alt="">Activity</p>
        <h1 class="page-title">${state.activityTab === 'cases' ? '<span class="soft">All</span> open cases' : '<span class="soft">Team</span> reports'}</h1>
      </div>
      <div class="pills" role="group" aria-label="Activity view">${pillButtons('atab', tabs, state.activityTab)}</div>
    </header>`;

  if (state.activityTab === 'reports') {
    viewEl.innerHTML = head + reportsHtml();
    document.getElementById('logPerson').addEventListener('change', e => {
      state.logPerson = e.target.value;
      renderActivity();
    });
    return;
  }

  const open = db.cases.filter(isOpen);
  const pool = open.filter(k => !k.assignee);
  const overdue = open.filter(k => k.dueAt && new Date(k.dueAt) < new Date());
  const today = open.filter(k => k.dueAt && dayDiff(k.dueAt) === 0);
  const byPerson = db.team.map(m => ({ label: m.id === ME ? `${m.name} (you)` : m.name, value: open.filter(k => k.assignee === m.id).length }));

  viewEl.innerHTML = `${head}
    <section class="stats">
      ${stat({ label: 'Open cases', value: open.length, sub: 'Across the whole team', ic: 'briefcase', featured: true })}
      ${stat({ label: 'Open pool', value: pool.length, sub: 'Not taken yet', ic: 'inbox' })}
      ${stat({ label: 'Overdue', value: overdue.length, sub: overdue.length ? '<span class="badge red">Needs attention</span>' : '<span class="badge green">All on time</span>', ic: 'flame' })}
      ${stat({ label: 'Due today', value: today.length, sub: 'Team-wide', ic: 'clock' })}
    </section>

    <div class="home-grid">
      <section class="panel">
        <div class="panel-head"><h2>All cases <span class="count-badge" id="allCount"></span></h2></div>
        ${filterBar('all')}
        <div class="case-list" id="allList"></div>
      </section>
      <div class="side-col">
        ${poolPanel()}
        <section class="panel">
          <div class="panel-head"><h2>Open cases by person</h2></div>
          ${hbars(byPerson, 'No open cases.')}
        </section>
      </div>
    </div>`;
  renderList('all');
}

function reportsHtml() {
  const since = state.range ? Date.now() - state.range * DAY : 0;
  const inRange = iso => !state.range || Date.parse(iso) >= since;
  const rangeText = state.range ? `Last ${state.range} days` : 'All time';

  const opened = db.cases.filter(k => inRange(k.createdAt));
  const completed = db.cases.filter(k => k.completedAt && inRange(k.completedAt));
  const openNow = db.cases.filter(isOpen);
  const avgMs = completed.length
    ? completed.reduce((sum, k) => sum + (Date.parse(k.completedAt) - Date.parse(k.createdAt)), 0) / completed.length
    : null;
  const avgValue = avgMs === null ? '–'
    : avgMs < DAY ? `${Math.max(1, Math.round(avgMs / HOUR))}<small>h</small>`
      : `${(avgMs / DAY).toFixed(1)}<small>days</small>`;
  const byCategory = CATEGORIES
    .map(c => ({ label: c, value: opened.filter(k => k.category === c).length }))
    .filter(r => r.value > 0)
    .sort((a, b) => b.value - a.value);
  const byPriority = [
    { label: 'Urgent', color: '#ff3848', value: openNow.filter(k => k.priority === 'urgent').length },
    { label: 'High', color: '#f97316', value: openNow.filter(k => k.priority === 'high').length },
    { label: 'Normal', color: '#0067ff', value: openNow.filter(k => k.priority === 'normal').length },
    { label: 'Low', color: '#b8b8bd', value: openNow.filter(k => k.priority === 'low').length },
  ];

  const caseTypes = ['case_created', 'case_assigned', 'case_taken', 'case_unassigned', 'status_changed', 'note_added'];
  const log = db.activity
    .filter(e => inRange(e.at))
    .filter(e => state.logType === 'all' || (state.logType === 'cases' ? caseTypes.includes(e.type) : e.type === 'client_added'))
    .filter(e => !state.logPerson || e.by === state.logPerson);
  const shown = log.slice(0, 150);
  let logHtml = '';
  let lastDay = '';
  for (const e of shown) {
    const day = dayLabel(e.at);
    if (day !== lastDay) {
      logHtml += `<h3 class="log-day">${esc(day)}</h3>`;
      lastDay = day;
    }
    logHtml += updateCard(e);
  }

  return `
    <div class="pills" role="group" aria-label="Time range" style="margin-bottom:16px">${pillButtons('range', [[7, '7 days'], [30, '30 days'], [0, 'All time']], state.range)}</div>

    <section class="stats">
      ${stat({ label: 'Files opened', value: opened.length, sub: rangeText, ic: 'filePlus', featured: true })}
      ${stat({ label: 'Completed', value: completed.length, sub: rangeText, ic: 'check' })}
      ${stat({ label: 'Open now', value: openNow.length, sub: `<span class="badge">${openNow.filter(k => !k.assignee).length} in the open pool</span>`, ic: 'briefcase' })}
      ${stat({ label: 'Avg. time to complete', value: avgValue, sub: 'From opening to done', ic: 'clock' })}
    </section>

    <div class="report-grid">
      <section class="panel wide">
        <div class="panel-head"><h2>Files per day</h2><span class="muted small">Last 14 days</span></div>
        ${dotChart()}
      </section>
      <section class="panel wide">
        <div class="panel-head"><h2>Team workload</h2><span class="muted small">Actions per person, last 14 days</span></div>
        ${heatmap()}
      </section>
      <section class="panel">
        <div class="panel-head"><h2>Open by priority</h2></div>
        ${donut(byPriority, 'open cases')}
      </section>
      <section class="panel">
        <div class="panel-head"><h2>Files by category</h2><span class="muted small">${rangeText}</span></div>
        ${hbars(byCategory, 'No files opened in this period.', 'warm')}
      </section>
    </div>

    <section class="panel">
      <div class="panel-head"><h2>Everything that happened <span class="count-badge">${log.length}</span></h2></div>
      <div class="filter-row" style="margin-bottom:16px">
        <div class="pills" role="group" aria-label="Filter activity">${pillButtons('logtype', [['all', 'All'], ['cases', 'Cases'], ['clients', 'Clients']], state.logType)}</div>
        <select id="logPerson" class="control-sm" aria-label="Filter by person">
          ${options([['', 'Everyone'], ...db.team.map(m => [m.id, m.id === ME ? `${m.name} (you)` : m.name])], state.logPerson)}
        </select>
      </div>
      <div class="log-grid">${logHtml || '<div class="empty" style="grid-column:1/-1">No activity for these filters.</div>'}</div>
      ${log.length > shown.length ? `<p class="muted small">Showing the latest ${shown.length} of ${log.length}.</p>` : ''}
    </section>`;
}

// ---------- Charts ----------
function hbars(rows, emptyText, variant = '') {
  const max = Math.max(0, ...rows.map(r => r.value));
  if (!max) return `<div class="empty">${emptyText}</div>`;
  return `<div class="hbars ${variant}">${rows.map(r => `
    <div class="hbar" data-tip="${esc(r.label)}: ${r.value}">
      <span class="hbar-label">${esc(r.label)}</span>
      <span class="hbar-track"><span class="hbar-fill" style="width:${(r.value / max) * 100}%"></span></span>
      <span class="hbar-value">${r.value}</span>
    </div>`).join('')}</div>`;
}

// Ring with rounded, gapped segments.
function donut(rows, caption) {
  const total = rows.reduce((s, r) => s + r.value, 0);
  if (!total) return '<div class="empty">No open cases.</div>';
  const r = 78;
  const sw = 26;
  const C = 2 * Math.PI * r;
  const gap = 7;
  const parts = rows.filter(x => x.value > 0);
  let offset = 0;
  const arcs = parts.map(x => {
    const share = (x.value / total) * C;
    const tip = `${x.label}: ${x.value} (${Math.round((x.value / total) * 100)}%)`;
    if (parts.length === 1) {
      return `<circle cx="100" cy="100" r="${r}" fill="none" stroke="${x.color}" stroke-width="${sw}" data-tip="${esc(tip)}"/>`;
    }
    // Round caps add half the stroke at each end, so trim the dash to keep the gap.
    const dash = Math.max(0.01, share - gap - sw);
    const start = offset + (gap + sw) / 2;
    offset += share;
    return `<circle cx="100" cy="100" r="${r}" fill="none" stroke="${x.color}" stroke-width="${sw}" stroke-linecap="round"
      stroke-dasharray="${dash.toFixed(2)} ${C.toFixed(2)}" stroke-dashoffset="${(-start).toFixed(2)}" data-tip="${esc(tip)}"/>`;
  });
  return `
    <div class="donut-wrap">
      <div class="donut">
        <svg viewBox="0 0 200 200" role="img" aria-label="Open cases by priority">
          <g transform="rotate(-90 100 100)">${arcs.join('')}</g>
        </svg>
        <div class="donut-center"><div class="donut-value">${total}</div><div class="donut-caption">${caption}</div></div>
      </div>
      <ul class="legend">
        ${rows.map(x => `<li><span class="swatch" style="background:${x.color}"></span><span>${x.label}</span><b>${x.value}</b><span class="pct">${Math.round((x.value / total) * 100)}%</span></li>`).join('')}
      </ul>
    </div>`;
}

function lastDays(n) {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = startOfDay(new Date());
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  return days;
}

// People × days, shaded by how many actions each person logged that day.
const WORKLOAD_LEVELS = [
  { min: 0, label: 'None' },
  { min: 1, label: 'Light' },
  { min: 2, label: 'Medium' },
  { min: 3, label: 'High' },
  { min: 5, label: 'Fully occupied' },
];

function heatmap() {
  const days = lastDays(14);
  const level = n => WORKLOAD_LEVELS.reduce((lvl, l, i) => (n >= l.min ? i : lvl), 0);
  const rows = db.team.map(m => {
    const cells = days.map(d => {
      const n = db.activity.filter(e => e.by === m.id && startOfDay(e.at).getTime() === d.getTime()).length;
      const tip = `${m.id === ME ? 'You' : m.name}, ${weekdayShortFmt.format(d)} ${shortDateFmt.format(d)}: ${n} action${n === 1 ? '' : 's'}`;
      return `<span class="heat-cell lv-${level(n)}" data-tip="${esc(tip)}"></span>`;
    }).join('');
    return `<span class="heat-name">${esc(m.id === ME ? 'You' : firstName(m.name))}</span>${cells}`;
  }).join('');
  return `
    <div class="chart-legend">${WORKLOAD_LEVELS.map((l, i) => `<span><i class="heat-cell lv-${i}"></i>${l.label}</span>`).join('')}</div>
    <div class="heatmap" style="--days:${days.length}">
      ${rows}
      <span></span>${days.map(d => `<span class="heat-day">${d.getDate()}</span>`).join('')}
    </div>`;
}

// Columns of dots: blue = files opened that day, light blue = completed.
function dotChart() {
  const sameDay = (iso, d) => iso && startOfDay(iso).getTime() === d.getTime();
  const data = lastDays(14).map(d => ({
    d,
    opened: db.cases.filter(k => sameDay(k.createdAt, d)).length,
    completed: db.cases.filter(k => sameDay(k.completedAt, d)).length,
  }));
  const rows = Math.max(6, ...data.map(x => x.opened + x.completed));
  const gapPx = rows > 10 ? 3 : 5;
  const dot = Math.max(6, Math.min(20, Math.floor((200 - (rows - 1) * gapPx) / rows)));
  const cols = data.map(x => {
    let dots = '';
    for (let i = 0; i < rows; i++) {
      const cls = i < x.opened ? 'opened' : i < x.opened + x.completed ? 'completed' : '';
      dots += `<span class="dot ${cls}"></span>`;
    }
    const tip = `${weekdayShortFmt.format(x.d)} ${shortDateFmt.format(x.d)}: ${x.opened} opened · ${x.completed} completed`;
    return `<div class="dot-col" data-tip="${esc(tip)}">${dots}</div>`;
  }).join('');
  return `
    <div class="chart-legend"><span><i style="background:var(--primary)"></i>Opened</span><span><i style="background:#a9c8ff"></i>Completed</span></div>
    <div class="dot-cols" style="--dot:${dot}px; --dot-gap:${gapPx}px">${cols}</div>
    <div class="dot-labels">${data.map((x, i) => `<span>${i % 2 === 1 ? x.d.getDate() : ''}</span>`).join('')}</div>`;
}

// ---------- Settings ----------
const EMOJIS = ['🛎️', '🎩', '✈️', '🍷', '🌴', '⭐', '🦋', '🌙', '🗝️', '🥂', '💎', '🌸'];

const BG_THEMES = [
  { id: 0, label: 'Default' },
  { id: 1, label: 'Blue' },
  { id: 2, label: 'Green' },
  { id: 3, label: 'Rose' },
  { id: 4, label: 'Graphite' },
];

function bgThemeOf(member) {
  return member && Number.isInteger(member.bg) ? member.bg : 0;
}

// Applies the signed-in member's background colour to the whole app shell.
function applyBgTheme() {
  const bg = bgThemeOf(findMember(ME));
  document.body.classList.remove(...BG_THEMES.map(t => `bg-${t.id}`));
  if (bg) document.body.classList.add(`bg-${bg}`);
}

function renderSettings() {
  const me = findMember(ME);
  const mine = myCases();
  const bg = bgThemeOf(me);
  viewEl.innerHTML = `
    <header class="page-head">
      <div>
        <p class="eyebrow"><img class="eyebrow-logo" src="favicon.svg" alt="">Settings</p>
        <h1 class="page-title"><span class="soft">Your</span> settings</h1>
      </div>
    </header>

    <div class="settings-grid">
      <div class="side-col">
        <section class="panel profile-card">
          <div class="profile-banner"></div>
          <div class="profile-body">
            <span class="profile-avatar">${memberAvatar(ME, 'xl')}</span>
            <div class="profile-actions">
              <button type="button" class="btn btn-secondary btn-md" data-action="edit-avatar">${icon('pencil')}Change icon</button>
            </div>
            <h2 class="profile-name">${esc(me.name)}</h2>
            <p class="profile-handle">@${esc(me.id)}</p>
            <div class="profile-meta">
              <span>${icon('briefcase')}${esc(me.title)}</span>
              <span>${icon('shield')}${me.role === 'admin' ? 'Admin' : 'Staff'}</span>
              <span>${icon('calendar')}Gustavo team</span>
            </div>
            <div class="profile-stats">
              <span><b>${mine.filter(isOpen).length}</b> open cases</span>
              <span><b>${mine.filter(k => !isOpen(k)).length}</b> completed</span>
            </div>
          </div>
        </section>

        <section class="panel">
          <div class="panel-head"><h2>Team <span class="count-badge">${db.team.length}</span></h2></div>
          <div class="team-list">
            ${db.team.map(m => `
              <div class="team-row">
                ${memberAvatar(m.id)}
                <span class="hit-main"><span class="hit-name">${esc(m.name)}${m.id === ME ? ' (you)' : ''}</span><span class="hit-sub">${esc(m.title)} · ${m.role === 'admin' ? 'Admin' : 'Staff'}</span></span>
              </div>`).join('')}
          </div>
        </section>
      </div>

      <section class="panel">
        <div class="panel-head"><h2>Workspace</h2></div>
        <div class="setting-row">
          <div><b>Your icon</b><p>Upload a photo, pick an icon, or use your initials (${esc(memberInitials(me))}).</p></div>
          <button type="button" class="btn btn-secondary btn-md" data-action="edit-avatar">${icon('pencil')}Change</button>
        </div>
        <div class="setting-row">
          <div><b>Background colour</b><p>Pick a background tint for your workspace.</p></div>
          <div class="tone-row">
            ${BG_THEMES.map(t => `<button type="button" class="bg-swatch bg-swatch-${t.id}${t.id === bg ? ' active' : ''}" data-bg="${t.id}" aria-label="${t.label} background" title="${t.label}"></button>`).join('')}
          </div>
        </div>
        <div class="setting-row">
          <div><b>Sample data</b><p>${db.demo ? 'Sample clients and cases are showing so you can try Gustavo.' : 'Sample data is cleared.'}</p></div>
          ${db.demo
            ? '<button type="button" class="btn btn-danger btn-md" data-action="clear-sample">Clear sample data</button>'
            : '<button type="button" class="btn btn-secondary btn-md" data-action="restore-sample">Restore sample data</button>'}
        </div>
        <div class="setting-row">
          <div><b>New files</b><p>Opening a new file always uses a new browser tab, so your work stays put.</p></div>
        </div>
        <div class="setting-row">
          <div><b>Log out</b><p>Signed in as ${esc(me.name)}.</p></div>
          <button type="button" class="btn btn-danger btn-md" data-action="sign-out">${icon('logout')}Log out</button>
        </div>
      </section>
    </div>`;
}

function openAvatarSheet() {
  const me = findMember(ME);
  const tone = toneOf(me, ME);
  openSheet(`
    ${sheetHead('user', 'Your icon', 'Choose how you appear')}
    <div class="form">
      <div class="avatar-preview">
        ${memberAvatar(ME, 'xl')}
        <div><b>${esc(me.name)}</b><p class="fld-hint">Shown in the menu and next to everything you do.</p></div>
      </div>
      <div class="fld">
        <span class="fld-label">Photo</span>
        <div class="filter-row">
          <label class="btn btn-secondary btn-md upload-btn">${icon('upload')}Upload a photo<input type="file" accept="image/*" id="photoInput"></label>
          <button type="button" class="btn btn-secondary btn-md" data-avatar-reset>Use my initials (${esc(memberInitials(me))})</button>
        </div>
      </div>
      <form class="fld" id="nameForm" novalidate>
        <div class="fld-grid">
          <div class="fld">
            <label class="fld-label" for="pName">Your name</label>
            <input id="pName" class="control" autocomplete="name" value="${esc(me.name)}">
          </div>
          <div class="fld">
            <label class="fld-label" for="pInitials">Initials</label>
            <input id="pInitials" class="control" maxlength="2" autocomplete="off" value="${esc(memberInitials(me))}" style="text-transform:uppercase">
          </div>
        </div>
        <div><button type="submit" class="btn btn-secondary btn-md">${icon('check')}Save name &amp; initials</button></div>
      </form>
      <div class="fld">
        <span class="fld-label">Or pick an icon</span>
        <div class="emoji-grid">
          ${EMOJIS.map(e => `<button type="button" data-emoji="${e}" class="${!me.photo && me.emoji === e ? 'active' : ''}" aria-label="Use ${e}">${e}</button>`).join('')}
        </div>
      </div>
      <div class="fld">
        <span class="fld-label">Colour</span>
        <div class="tone-row">
          ${[0, 1, 2, 3, 4].map(t => `<button type="button" class="tone-${t}${t === tone ? ' active' : ''}" data-tone="${t}" aria-label="Colour ${t + 1}"></button>`).join('')}
        </div>
      </div>
      <div class="fld">
        <span class="fld-label">Gradient</span>
        <div class="tone-row">
          ${[5, 6, 7, 8, 9].map(t => `<button type="button" class="tone-${t}${t === tone ? ' active' : ''}" data-tone="${t}" aria-label="Gradient ${t - 4}"></button>`).join('')}
        </div>
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn-primary btn-md" data-action="close-sheet">Done</button>
      </div>
    </div>`, {
    label: 'Your icon',
    onMount(sheet) {
      const apply = patch => {
        updateMember(ME, patch);
        refreshAvatars();
        render();
        openAvatarSheet();
      };
      sheet.addEventListener('click', e => {
        const b = e.target.closest('[data-emoji],[data-tone],[data-avatar-reset]');
        if (!b) return;
        if (b.dataset.emoji) apply({ emoji: b.dataset.emoji, photo: null });
        else if (b.dataset.tone) apply({ tone: Number(b.dataset.tone) });
        else apply({ emoji: null, photo: null });
      });
      sheet.querySelector('#nameForm').addEventListener('submit', e => {
        e.preventDefault();
        const name = sheet.querySelector('#pName').value.trim() || me.name;
        const typed = sheet.querySelector('#pInitials').value.replace(/[^\p{L}\p{N}]/gu, '').toUpperCase().slice(0, 2);
        apply({ name, initials: typed || null });
        toast('Name and initials saved');
      });
      sheet.querySelector('#photoInput').addEventListener('change', async e => {
        const file = e.target.files[0];
        if (!file) return;
        try {
          apply({ photo: await squareImage(file, 160), emoji: null });
          toast('Photo updated');
        } catch {
          toast("That image couldn't be read");
        }
      });
    },
  });
}

// Centre-crops an image file to a small square JPEG data URL.
function squareImage(file, size) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const side = Math.min(img.width, img.height);
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        canvas.getContext('2d').drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// ---------- Sheets ----------
const sheetRoot = document.getElementById('sheetRoot');
let lastFocus = null;
let openCaseId = null;

function openSheet(html, { label = '', onMount } = {}) {
  if (!sheetRoot.contains(document.activeElement)) lastFocus = document.activeElement;
  openCaseId = null;
  sheetRoot.innerHTML = `
    <div class="sheet-overlay">
      <div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(label)}">${html}</div>
    </div>`;
  const overlay = sheetRoot.firstElementChild;
  overlay.addEventListener('mousedown', e => {
    if (e.target === overlay) closeSheet();
  });
  document.body.classList.add('sheet-open');
  if (onMount) onMount(overlay.querySelector('.sheet'));
}

function closeSheet() {
  if (!sheetRoot.firstElementChild) return;
  sheetRoot.innerHTML = '';
  openCaseId = null;
  document.body.classList.remove('sheet-open');
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}

function sheetHead(ic, eyebrow, title, extra = '') {
  return `
    <div class="sheet-head">
      <span class="sheet-tile">${icon(ic)}</span>
      <div class="sheet-head-text">
        <p class="eyebrow">${eyebrow}</p>
        <h2 class="sheet-title">${title}</h2>
      </div>
      ${extra}
      <button type="button" class="square-btn" data-action="close-sheet" aria-label="Close">${icon('x')}</button>
    </div>`;
}

// ---------- Search (case ID, client ID, name, phone or email) ----------
function caseMatches(query) {
  const digits = query.replace(/\D/g, '');
  if (!digits) return [];
  return db.cases
    .filter(k => String(k.number).includes(digits))
    .sort((a, b) => (String(b.number).startsWith(digits) - String(a.number).startsWith(digits)) || a.number - b.number)
    .slice(0, 20);
}

function clientMatches(query) {
  const term = query.trim().toLowerCase();
  if (!term) return [];
  const idDigits = term.replace(/^c-?/, '');
  const phoneDigits = term.replace(/\D/g, '');
  return db.clients
    .filter(c =>
      c.name.toLowerCase().includes(term) ||
      (/^\d+$/.test(idDigits) && String(c.number).includes(idDigits)) ||
      (c.email && c.email.toLowerCase().includes(term)) ||
      (phoneDigits && c.phone && c.phone.replace(/\D/g, '').includes(phoneDigits)))
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 50);
}

function caseHit(kase) {
  const client = findClient(kase.clientId);
  return `
    <div class="hit" role="button" tabindex="0" data-case="${kase.id}">
      <span class="hit-no">${kase.number}</span>
      <span class="hit-main">
        <span class="hit-name">${esc(kase.title)}</span>
        <span class="hit-sub">${esc(client ? client.name : 'Unknown client')} · ${esc(labelOf(STATUSES, kase.status))} · ${esc(fmtDue(kase).text)}</span>
      </span>
      ${idChip(caseNo(kase))}
    </div>`;
}

function rankTag(tier) {
  return `<span class="tag sm${tier !== 'Standard' ? ` tier-${tier.toLowerCase()}` : ''}">${esc(tier)}</span>`;
}

function clientResultRow(client) {
  const total = db.cases.filter(k => k.clientId === client.id).length;
  return `
    <div class="hit client-result" role="button" tabindex="0" data-client="${client.id}">
      ${avatar(client.name, client.id, 'sm')}
      <span class="hit-main">
        <span class="hit-name">${esc(client.name)}</span>
        <span class="hit-sub">${esc([client.phone, client.email].filter(Boolean).join(' · ') || 'No contact details')}</span>
      </span>
      <span class="client-result-meta">
        ${rankTag(client.tier)}
        <span class="tag sm">${total} case${total === 1 ? '' : 's'}</span>
        ${idChip(clientNo(client))}
      </span>
      ${client.email ? `<a class="icon-btn" data-action="email-client" href="mailto:${esc(client.email)}" title="Email ${esc(client.name)}" aria-label="Email ${esc(client.name)}">${icon('mail')}</a>` : ''}
    </div>`;
}

// ---------- Search page (always in a new tab) ----------
function openSearchTab(query = '') {
  const hash = `#/search${query ? `?q=${encodeURIComponent(query)}` : ''}`;
  const tab = window.open(`app.html${hash}`, '_blank');
  if (!tab) {
    location.hash = hash;
    toast('Pop-ups are blocked, so search opened here');
  }
}

function renderSearchPage(query) {
  viewEl.innerHTML = `
    <div class="form-page">
      <header class="page-head">
        <div>
          <p class="eyebrow"><img class="eyebrow-logo" src="favicon.svg" alt="">Search</p>
          <h1 class="page-title"><span class="soft">Find a</span> client or case</h1>
        </div>
      </header>
      ${window.opener ? `<div class="tab-note">${icon('layers')}This opened in a new tab, so your other tab stays exactly where you left it.</div>` : ''}
      <section class="panel">
        <div class="form">
          <div class="fld">
            <label class="fld-label" for="pSearch">Case ID, client ID, name, phone or email</label>
            <label class="search lg">${icon('search')}<input id="pSearch" autocomplete="off" placeholder="e.g. Nir, C-2004, G-1006, +1 555…" value="${esc(query)}"></label>
          </div>
          <div class="results" id="pResults"></div>
          <div class="search-divider"></div>
          <div class="fld-row">
            <button type="button" class="link-btn" data-action="advanced-search">${icon('sliders')}Advanced search</button>
            <button type="button" class="link-btn" data-action="add-client">${icon('userPlus')}Add client</button>
          </div>
        </div>
      </section>
    </div>`;

  const input = viewEl.querySelector('#pSearch');
  const results = viewEl.querySelector('#pResults');
  const draw = () => {
    const q = input.value.trim();
    if (!q) { results.innerHTML = ''; return; }
    const cases = caseMatches(q);
    const clients = clientMatches(q);
    let html = '';
    html += `<p class="results-title">Cases</p>${cases.length ? cases.map(caseHit).join('') : '<div class="empty">No case with that ID.</div>'}`;
    html += `<p class="results-title">Clients ${clients.length ? `<span class="count-badge">${clients.length}</span>` : ''}</p>${clients.length ? clients.map(clientResultRow).join('') : '<div class="empty">No client matches that.</div>'}`;
    results.innerHTML = html;
  };
  input.addEventListener('input', draw);
  input.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const hits = caseMatches(input.value);
    const exact = hits.find(k => String(k.number) === input.value.replace(/\D/g, '')) || (hits.length === 1 && hits[0]);
    if (exact) openCaseSheet(exact.id);
  });
  input.focus();
  draw();
}

function openClientSheet(id) {
  const client = findClient(id);
  if (!client) return;
  const cases = db.cases.filter(k => k.clientId === id).sort((a, b) => (isOpen(b) - isOpen(a)) || dueSort(a, b));
  openSheet(`
    ${sheetHead('user', `Client ${idChip(clientNo(client))}`, esc(client.name))}
    <div class="client-card">
      ${avatar(client.name, client.id, 'lg')}
      <div class="client-card-body">
        <div class="client-card-name">${esc(client.name)} ${tierTag(client.tier)}</div>
        <div class="client-card-meta">${[client.phone, client.email].filter(Boolean).map(esc).join(' · ') || 'No contact details'}</div>
        ${client.notes ? `<div class="client-card-notes">${esc(client.notes)}</div>` : ''}
      </div>
      <div class="client-card-actions">
        ${client.phone ? `<a class="round-btn" href="tel:${esc(client.phone.replace(/[^\d+]/g, ''))}" aria-label="Call ${esc(client.name)}">${icon('phone')}</a>` : ''}
        ${client.email ? `<a class="round-btn" href="mailto:${esc(client.email)}" aria-label="Email ${esc(client.name)}">${icon('mail')}</a>` : ''}
      </div>
    </div>
    <div class="fld-row" style="margin-bottom:12px">
      <span class="fld-label">Cases <span class="count-badge">${cases.length}</span></span>
      <button type="button" class="btn btn-primary btn-md" data-action="new-file-client" data-client-id="${client.id}">New file<span class="btn-ring">${icon('plus')}</span></button>
    </div>
    <div class="results">${cases.length ? cases.map(caseHit).join('') : '<div class="empty">No cases for this client yet.</div>'}</div>
    <div class="search-divider"></div>
    <button type="button" class="link-btn" data-action="search">${icon('search')}Back to search</button>`, { label: client.name });
}

function openAdvancedSearch() {
  const f = state.adv || { text: '', clientId: '', statuses: [], priorities: [], category: '', channel: '', handler: '', from: '', to: '' };
  const clients = [...db.clients].sort((a, b) => a.name.localeCompare(b.name));
  openSheet(`
    ${sheetHead('sliders', 'Advanced search', 'Filter all cases')}
    <form class="form" id="advForm" novalidate>
      <div class="fld">
        <label class="fld-label" for="aText">Contains</label>
        <input id="aText" class="control" placeholder="Words in the title, details or case number" value="${esc(f.text)}">
      </div>
      <div class="fld">
        <label class="fld-label" for="aClient">Client</label>
        ${selectWrap('aClient', options([['', 'Any client'], ...clients.map(c => [c.id, `${c.name} · ${clientNo(c)}`])], f.clientId))}
      </div>
      <div class="fld"><span class="fld-label">Status</span>${checkGroup('aStatus', STATUSES, f.statuses)}</div>
      <div class="fld"><span class="fld-label">Priority</span>${checkGroup('aPriority', PRIORITIES, f.priorities)}</div>
      <div class="fld-grid">
        <div class="fld">
          <label class="fld-label" for="aCategory">Category</label>
          ${selectWrap('aCategory', options([['', 'Any'], ...CATEGORIES.map(c => [c, c])], f.category))}
        </div>
        <div class="fld">
          <label class="fld-label" for="aHandler">Handled by</label>
          ${selectWrap('aHandler', options(whoseAll().map(([v, l]) => [v, v === '' ? 'Anyone' : l]), f.handler))}
        </div>
      </div>
      <div class="fld"><span class="fld-label">Came in by</span>${segRadio('aChannel', [{ id: '', label: 'Any' }, ...CHANNELS], f.channel)}</div>
      <div class="fld-grid">
        <div class="fld"><label class="fld-label" for="aFrom">Opened from</label><input id="aFrom" type="date" class="control" value="${esc(f.from)}"></div>
        <div class="fld"><label class="fld-label" for="aTo">Opened until</label><input id="aTo" type="date" class="control" value="${esc(f.to)}"></div>
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn-secondary btn-md" id="advReset">Reset</button>
        <button type="submit" class="btn btn-primary btn-md">${icon('search')}Show results</button>
      </div>
      <div class="results" id="advResults"></div>
    </form>`, {
    label: 'Advanced search',
    onMount(sheet) {
      const form = sheet.querySelector('#advForm');
      const resultsEl = sheet.querySelector('#advResults');
      const show = () => {
        const hits = db.cases.filter(k => matchesAdv(k, state.adv)).sort((a, b) => (isOpen(b) - isOpen(a)) || dueSort(a, b));
        resultsEl.innerHTML = `<p class="results-title">${hits.length} case${hits.length === 1 ? '' : 's'} found</p>${hits.map(caseHit).join('') || '<div class="empty">No cases match these filters.</div>'}`;
      };
      sheet.querySelector('#advReset').addEventListener('click', () => {
        state.adv = null;
        openAdvancedSearch();
      });
      form.addEventListener('submit', e => {
        e.preventDefault();
        state.adv = {
          text: sheet.querySelector('#aText').value.trim(),
          clientId: sheet.querySelector('#aClient').value,
          statuses: [...form.querySelectorAll('input[name="aStatus"]:checked')].map(i => i.value),
          priorities: [...form.querySelectorAll('input[name="aPriority"]:checked')].map(i => i.value),
          category: sheet.querySelector('#aCategory').value,
          channel: form.aChannel.value,
          handler: sheet.querySelector('#aHandler').value,
          from: sheet.querySelector('#aFrom').value,
          to: sheet.querySelector('#aTo').value,
        };
        show();
        resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      if (state.adv) show();
      sheet.querySelector('#aText').focus();
    },
  });
}

function matchesAdv(kase, f) {
  if (!matchesText(kase, (f.text || '').toLowerCase())) return false;
  if (f.clientId && kase.clientId !== f.clientId) return false;
  if (f.statuses.length && !f.statuses.includes(kase.status)) return false;
  if (f.priorities.length && !f.priorities.includes(kase.priority)) return false;
  if (f.category && kase.category !== f.category) return false;
  if (f.channel && kase.channel !== f.channel) return false;
  if (f.handler === '__pool' && kase.assignee) return false;
  if (f.handler && f.handler !== '__pool' && kase.assignee !== f.handler) return false;
  if (f.from && new Date(kase.createdAt) < new Date(`${f.from}T00:00`)) return false;
  if (f.to && new Date(kase.createdAt) > new Date(`${f.to}T23:59:59`)) return false;
  return true;
}

// ---------- New file (always in a new tab) ----------
function openNewFileTab(clientId) {
  const hash = `#/new${clientId ? `?client=${encodeURIComponent(clientId)}` : ''}`;
  const tab = window.open(`app.html${hash}`, '_blank');
  if (!tab) {
    location.hash = hash;
    toast('Pop-ups are blocked, so the new file opened here');
  }
}

function newFileFormHtml(draft) {
  const clients = [...db.clients].sort((a, b) => a.name.localeCompare(b.name));
  const handlers = [[ME, "Me, I'll take it"], ['', 'Open pool, anyone can take it'],
    ...(IS_ADMIN ? db.team.filter(m => m.id !== ME).map(m => [m.id, m.name]) : [])];
  return `
    <form class="form" id="fileForm" novalidate>
      <div class="fld">
        <div class="fld-row">
          <label class="fld-label" for="fClient">Client</label>
          <button type="button" class="link-btn" id="newClientLink">${icon('userPlus')}New client</button>
        </div>
        ${clients.length
          ? selectWrap('fClient', options([['', 'Choose a client…'], ...clients.map(c => [c.id, `${c.name} · ${clientNo(c)}${c.tier !== 'Standard' ? ` · ${c.tier}` : ''}`])], draft.clientId || ''))
          : '<p class="fld-empty">No clients yet. Add one first with “New client”.</p>'}
      </div>
      <div class="fld">
        <label class="fld-label" for="fTitle">What do they need?</label>
        <input id="fTitle" class="control" placeholder="e.g. Table for 4 on Friday at 8pm" value="${esc(draft.title || '')}">
      </div>
      <div class="fld-grid">
        <div class="fld">
          <label class="fld-label" for="fCategory">Category</label>
          ${selectWrap('fCategory', options(CATEGORIES.map(c => [c, c]), draft.category || 'Dining'))}
        </div>
        <div class="fld">
          <label class="fld-label" for="fDue">Needed by</label>
          <input id="fDue" type="datetime-local" class="control" value="${esc(draft.due || defaultDue())}">
        </div>
      </div>
      <div class="fld"><span class="fld-label">Came in by</span>${segRadio('channel', CHANNELS, draft.channel || 'phone')}</div>
      <div class="fld"><span class="fld-label">Priority</span>${segRadio('priority', PRIORITIES, draft.priority || 'normal')}</div>
      <div class="fld">
        <label class="fld-label" for="fHandler">Who handles it</label>
        ${selectWrap('fHandler', options(handlers, draft.assignee !== undefined ? draft.assignee : ME))}
      </div>
      <div class="fld">
        <label class="fld-label" for="fDetails">Details</label>
        <textarea id="fDetails" class="control" rows="3" placeholder="Anything the team should know">${esc(draft.details || '')}</textarea>
      </div>
      <p class="form-error hidden" id="fileError" role="alert"></p>
      <div class="form-actions">
        <button type="button" class="btn btn-secondary btn-md" id="fileCancel">Cancel</button>
        <button type="submit" class="btn btn-primary btn-md">Create file<span class="btn-ring">${icon('plus')}</span></button>
      </div>
    </form>`;
}

function renderNewFilePage(draft) {
  viewEl.innerHTML = `
    <div class="form-page">
      <header class="page-head">
        <div>
          <p class="eyebrow"><img class="eyebrow-logo" src="favicon.svg" alt="">New file</p>
          <h1 class="page-title"><span class="soft">Open a</span> new case</h1>
        </div>
      </header>
      ${window.opener ? `<div class="tab-note">${icon('layers')}This opened in a new tab, so your other tab stays exactly where you left it.</div>` : ''}
      <section class="panel">${newFileFormHtml(draft)}</section>
    </div>`;

  const form = viewEl.querySelector('#fileForm');
  const collect = () => ({
    clientId: (viewEl.querySelector('#fClient') || {}).value || '',
    title: viewEl.querySelector('#fTitle').value,
    category: viewEl.querySelector('#fCategory').value,
    due: viewEl.querySelector('#fDue').value,
    channel: form.channel.value,
    priority: form.priority.value,
    assignee: viewEl.querySelector('#fHandler').value,
    details: viewEl.querySelector('#fDetails').value,
  });

  viewEl.querySelector('#newClientLink').addEventListener('click', () => {
    const saved = collect();
    openAddClientSheet({ onSaved: client => renderNewFilePage({ ...saved, clientId: client.id }) });
  });

  viewEl.querySelector('#fileCancel').addEventListener('click', () => {
    if (window.opener) window.close();
    else location.hash = '#/home';
  });

  (draft.clientId ? viewEl.querySelector('#fTitle') : viewEl.querySelector('#fClient') || viewEl.querySelector('#fTitle')).focus();

  form.addEventListener('submit', e => {
    e.preventDefault();
    const v = collect();
    const errorEl = viewEl.querySelector('#fileError');
    const problem = !v.clientId ? 'Choose a client for this file.' : !v.title.trim() ? 'Describe what the client needs.' : '';
    if (problem) {
      errorEl.textContent = problem;
      errorEl.classList.remove('hidden');
      return;
    }
    const kase = createCase({
      clientId: v.clientId,
      title: v.title,
      category: v.category,
      channel: v.channel,
      priority: v.priority,
      details: v.details,
      dueAt: v.due ? new Date(v.due).toISOString() : null,
      assignee: v.assignee || null,
    }, ME);
    location.hash = `#/case/${kase.id}`;
    toast(`File ${caseNo(kase)} created`);
  });
}

function openAddClientSheet({ onSaved } = {}) {
  openSheet(`
    ${sheetHead('userPlus', 'Add client', 'New client')}
    <form class="form" id="clientForm" novalidate>
      <div class="fld">
        <label class="fld-label" for="cName">Full name</label>
        <input id="cName" class="control" autocomplete="off" placeholder="e.g. Emma Laurent">
      </div>
      <div class="fld-grid">
        <div class="fld"><label class="fld-label" for="cPhone">Phone</label><input id="cPhone" class="control" type="tel" autocomplete="off"></div>
        <div class="fld"><label class="fld-label" for="cEmail">Email</label><input id="cEmail" class="control" type="email" autocomplete="off"></div>
      </div>
      <div class="fld"><span class="fld-label">Membership</span>${segRadio('tier', TIERS.map(t => ({ id: t, label: t })), 'Standard')}</div>
      <div class="fld">
        <label class="fld-label" for="cNotes">Preferences &amp; notes</label>
        <textarea id="cNotes" class="control" rows="3" placeholder="Allergies, favourite hotels, seat preferences…"></textarea>
      </div>
      <p class="form-error hidden" id="clientError" role="alert"></p>
      <div class="form-actions">
        <button type="button" class="btn btn-secondary btn-md" data-action="close-sheet">Cancel</button>
        <button type="submit" class="btn btn-primary btn-md">${icon('userPlus')}Add client</button>
      </div>
    </form>`, {
    label: 'Add client',
    onMount(sheet) {
      const form = sheet.querySelector('#clientForm');
      const nameInput = sheet.querySelector('#cName');
      nameInput.focus();
      form.addEventListener('submit', e => {
        e.preventDefault();
        if (!nameInput.value.trim()) {
          const errorEl = sheet.querySelector('#clientError');
          errorEl.textContent = "Enter the client's name.";
          errorEl.classList.remove('hidden');
          nameInput.focus();
          return;
        }
        const client = addClient({
          name: nameInput.value,
          phone: sheet.querySelector('#cPhone').value,
          email: sheet.querySelector('#cEmail').value,
          tier: form.tier.value,
          notes: sheet.querySelector('#cNotes').value,
        }, ME);
        closeSheet();
        toast(`${client.name} added · ${clientNo(client)}`);
        if (onSaved) onSaved(client);
        else render();
      });
    },
  });
}

// ---------- Case details (drawer and full page share the markup) ----------
function caseDetailParts(kase) {
  const client = findClient(kase.clientId);
  const due = fmtDue(kase);
  const updates = [...kase.updates].sort((a, b) => b.at.localeCompare(a.at));
  const handler = kase.assignee
    ? `${memberAvatar(kase.assignee, 'xs')}${esc(memberName(kase.assignee))}`
    : '<span class="muted">Open pool</span>';
  const byAssign = kase.assignedBy && kase.assignedBy !== kase.assignee;

  const main = `
    ${client ? `
      <div class="client-card">
        ${avatar(client.name, client.id, 'lg')}
        <div class="client-card-body">
          <div class="client-card-name">${esc(client.name)} ${tierTag(client.tier)} ${idChip(clientNo(client))}</div>
          <div class="client-card-meta">${[client.phone, client.email].filter(Boolean).map(esc).join(' · ') || 'No contact details'}</div>
          ${client.notes ? `<div class="client-card-notes">${esc(client.notes)}</div>` : ''}
        </div>
        <div class="client-card-actions">
          ${client.phone ? `<a class="round-btn" href="tel:${esc(client.phone.replace(/[^\d+]/g, ''))}" aria-label="Call ${esc(client.name)}">${icon('phone')}</a>` : ''}
          ${client.email ? `<a class="round-btn" href="mailto:${esc(client.email)}" aria-label="Email ${esc(client.name)}">${icon('mail')}</a>` : ''}
        </div>
      </div>` : ''}

    <div class="fld">
      <span class="fld-label">Status</span>
      ${segRadio('status', STATUSES, kase.status, 'short')}
    </div>

    <dl class="info-grid">
      <div><dt>Priority</dt><dd>${priorityTag(kase.priority, 'sm')}</dd></div>
      <div><dt>${due.label || 'Needed by'}</dt><dd class="${due.cls}">${esc(due.text)}</dd></div>
      <div><dt>Came in by</dt><dd>${channelTag(kase.channel, 'sm')}</dd></div>
      <div><dt>Handled by</dt><dd>${handler}</dd></div>
      <div><dt>Opened</dt><dd>${esc(fmtDayTime(kase.createdAt))}</dd></div>
      <div><dt>${byAssign ? 'Assigned by' : 'Opened by'}</dt><dd>${esc(memberName(byAssign ? kase.assignedBy : kase.createdBy))}</dd></div>
    </dl>

    ${!kase.assignee || IS_ADMIN ? `
      <div class="assign-row">
        ${!kase.assignee ? `<button type="button" class="btn btn-primary btn-md" data-take="${kase.id}">${icon('check')}Take this case</button>` : ''}
        ${IS_ADMIN ? `
          <label class="fld-inline">
            <span class="fld-label">Assign to</span>
            <select class="control-sm" data-assign aria-label="Assign to">
              ${options([['', 'Open pool'], ...db.team.map(m => [m.id, m.id === ME ? `${m.name} (you)` : m.name])], kase.assignee || '')}
            </select>
          </label>` : ''}
      </div>` : ''}

    ${kase.details ? `<div class="details"><span class="fld-label">Details</span><p>${esc(kase.details)}</p></div>` : ''}`;

  const notes = `
    <div class="updates-block">
      <span class="fld-label">Updates</span>
      <form class="update-form" data-update-form>
        <textarea class="control" rows="2" placeholder="Add an update for the team…" aria-label="Update"></textarea>
        <button type="submit" class="btn btn-primary btn-md">Add</button>
      </form>
      ${updates.length ? updates.map(u => `
        <article class="update">
          <div class="update-head">
            ${memberAvatar(u.by, 'sm')}
            <div class="update-main">
              <p class="update-text"><b>${esc(memberName(u.by))}</b></p>
              <p class="update-time">${fmtDayTime(u.at)}</p>
            </div>
          </div>
          <div class="quote">${esc(u.text)}</div>
        </article>`).join('') : '<div class="empty">No updates yet.</div>'}
    </div>`;

  return { main, notes };
}

function bindCaseDetail(root, kase, rerender) {
  root.querySelectorAll('input[name="status"]').forEach(input => {
    input.addEventListener('change', () => {
      setCaseStatus(kase.id, input.value, ME);
      rerender();
      toast(`${caseNo(kase)} moved to ${labelOf(STATUSES, input.value)}`);
    });
  });
  const select = root.querySelector('[data-assign]');
  if (select) {
    select.addEventListener('change', () => {
      assignCase(kase.id, select.value, ME);
      rerender();
      toast(!select.value ? `${caseNo(kase)} moved to the open pool`
        : `${caseNo(kase)} assigned to ${select.value === ME ? 'you' : memberName(select.value)}`);
    });
  }
  root.querySelector('[data-update-form]').addEventListener('submit', e => {
    e.preventDefault();
    const text = e.target.querySelector('textarea').value;
    if (!text.trim()) return;
    addCaseUpdate(kase.id, text, ME);
    rerender();
    toast('Update added');
  });
}

function openCaseSheet(id) {
  const kase = findCase(id);
  if (!kase) return;
  const parts = caseDetailParts(kase);
  const newTab = `<a class="square-btn" href="app.html#/case/${kase.id}" target="_blank" aria-label="Open in a new tab" title="Open in a new tab">${icon('arrowUpRight')}</a>`;
  openSheet(`${sheetHead('briefcase', `${idChip(caseNo(kase))} · ${esc(kase.category)}`, esc(kase.title), newTab)}${parts.main}${parts.notes}`, {
    label: `Case ${caseNo(kase)}`,
    onMount(sheet) {
      bindCaseDetail(sheet, kase, () => {
        render();
        openCaseSheet(kase.id);
      });
    },
  });
  openCaseId = kase.id;
}

function renderCasePage(id) {
  const kase = findCase(id);
  if (!kase) {
    viewEl.innerHTML = `
      <a class="back-link" href="#/home">${icon('arrowRight')}My dashboard</a>
      <div class="empty">This case doesn't exist, or it was removed.</div>`;
    return;
  }
  const parts = caseDetailParts(kase);
  viewEl.innerHTML = `
    <a class="back-link" href="#/home">${icon('arrowRight')}My dashboard</a>
    <header class="page-head">
      <div>
        <p class="eyebrow">${idChip(caseNo(kase))} · ${esc(kase.category)}</p>
        <h1 class="page-title">${esc(kase.title)}</h1>
      </div>
    </header>
    <div class="case-page">
      <section class="panel">${parts.main}</section>
      <section class="panel">${parts.notes}</section>
    </div>`;
  bindCaseDetail(viewEl, kase, () => renderCasePage(id));
}

// ---------- Actions ----------
function takeCase(id) {
  const kase = findCase(id);
  if (!kase || kase.assignee) return;
  assignCase(id, ME, ME);
  const reopen = openCaseId === id;
  render();
  if (reopen) openCaseSheet(id);
  toast(`You took ${caseNo(kase)}`);
}

function signOut() {
  endSession();
  window.location.replace('index.html');
}

async function copyId(id) {
  try {
    await navigator.clipboard.writeText(id);
  } catch {
    const tmp = document.createElement('textarea');
    tmp.value = id;
    document.body.appendChild(tmp);
    tmp.select();
    document.execCommand('copy');
    tmp.remove();
  }
  toast(`Copied ${id}`);
}

let toastTimer;
function toast(message) {
  const el = document.getElementById('toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
}

// ---------- Wiring ----------
document.addEventListener('click', e => {
  const el = e.target.closest('[data-copy],[data-take],[data-case],[data-client],[data-view],[data-shortcut],[data-fset],[data-atab],[data-range],[data-logtype],[data-bg],[data-stop],[data-action]');
  if (!el || el.tagName === 'SELECT' || el.dataset.stop !== undefined) return;
  if (el.dataset.copy) return copyId(el.dataset.copy);
  if (el.dataset.take) return takeCase(el.dataset.take);
  if (el.dataset.bg !== undefined) {
    updateMember(ME, { bg: Number(el.dataset.bg) });
    applyBgTheme();
    render();
    return toast('Background updated');
  }
  if (el.dataset.case) return openCaseSheet(el.dataset.case);
  if (el.dataset.client) return openClientSheet(el.dataset.client);
  if (el.dataset.view) {
    state.home.view = el.dataset.view;
    saveHomeView();
    return render();
  }
  if (el.dataset.shortcut) return applyShortcut(el.dataset.shortcut);
  if (el.dataset.fset) {
    const [key, field] = el.dataset.fset.split('.');
    state[key][field] = el.dataset.value;
    return render();
  }
  if (el.dataset.atab) {
    state.activityTab = el.dataset.atab;
    if (state.route.params) state.route.params.delete('tab');
    return renderActivity();
  }
  if (el.dataset.range !== undefined) {
    state.range = Number(el.dataset.range);
    return renderActivity();
  }
  if (el.dataset.logtype) {
    state.logType = el.dataset.logtype;
    return renderActivity();
  }
  switch (el.dataset.action) {
    case 'new-file': return openNewFileTab();
    case 'new-file-client': return openNewFileTab(el.dataset.clientId);
    case 'search': return openSearchTab();
    case 'advanced-search': return openAdvancedSearch();
    case 'add-client': return openAddClientSheet();
    case 'edit-avatar': return openAvatarSheet();
    case 'close-sheet': return closeSheet();
    case 'sign-out': return signOut();
    case 'toggle-followup': {
      const form = el.closest('.case').querySelector('[data-followup-form]');
      form.hidden = !form.hidden;
      if (!form.hidden) form.querySelector('input').focus();
      return;
    }
    case 'clear-refine':
      Object.assign(state[el.dataset.key], { priority: '', date: '', text: '' });
      return render();
    case 'clear-sample':
      if (confirm('Remove all sample clients, cases and activity? This cannot be undone.')) {
        clearSampleData();
        render();
        toast('Sample data cleared');
      }
      return;
    case 'restore-sample':
      restoreSampleData();
      render();
      toast('Sample data restored');
      return;
  }
});

document.addEventListener('change', e => {
  const fset = e.target.closest('select[data-fset]');
  if (fset) {
    const [key, field] = fset.dataset.fset.split('.');
    state[key][field] = fset.value;
    return render();
  }
  const statusEl = e.target.closest('select[data-status-for]');
  if (statusEl) {
    const id = statusEl.dataset.statusFor;
    setCaseStatus(id, statusEl.value, ME);
    toast(`${caseNo(findCase(id))} moved to ${labelOf(STATUSES, statusEl.value)}`);
    return render();
  }
});

document.addEventListener('input', e => {
  const el = e.target.closest('input[data-ftext]');
  if (!el) return;
  state[el.dataset.ftext].text = el.value;
  renderList(el.dataset.ftext);
});

document.addEventListener('submit', e => {
  const form = e.target.closest('[data-followup-form]');
  if (!form) return;
  e.preventDefault();
  const input = form.querySelector('input');
  if (!input.value.trim()) return;
  addCaseUpdate(form.dataset.followupForm, input.value, ME);
  toast('Follow-up added');
  renderList(form.dataset.listKey);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') return closeSheet();
  // Shortcuts: "/" searches, "n" opens a new file — unless you're typing.
  const typing = e.target.closest('input, textarea, select, [contenteditable="true"]');
  if (!typing && !e.ctrlKey && !e.metaKey && !e.altKey && !sheetRoot.firstElementChild) {
    if (e.key === '/') {
      e.preventDefault();
      return openSearchTab();
    }
    if (e.key === 'n' || e.key === 'N') {
      e.preventDefault();
      return openNewFileTab();
    }
  }
  // Cards are divs (they hold copy buttons), so give them button keys.
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role="button"][data-case],[role="button"][data-client]')) {
    e.preventDefault();
    e.target.click();
  }
});

// Chart tooltips: a white bubble above the pointer.
const tooltipEl = document.getElementById('tooltip');
document.addEventListener('mouseover', e => {
  const el = e.target.closest('[data-tip]');
  if (!el) return tooltipEl.classList.add('hidden');
  tooltipEl.textContent = el.dataset.tip;
  tooltipEl.classList.remove('hidden');
});
document.addEventListener('mousemove', e => {
  if (tooltipEl.classList.contains('hidden')) return;
  const rect = tooltipEl.getBoundingClientRect();
  const x = Math.min(Math.max(8, e.clientX - rect.width / 2), window.innerWidth - rect.width - 8);
  tooltipEl.style.left = `${x}px`;
  tooltipEl.style.top = `${Math.max(8, e.clientY - rect.height - 16)}px`;
});

window.addEventListener('hashchange', () => {
  state.route = parseRoute();
  closeSheet();
  render();
  window.scrollTo(0, 0);
});

// A file created in another tab shows up here without a reload.
window.addEventListener('storage', e => {
  if (e.key !== DATA_KEY) return;
  db = loadData();
  refreshAvatars();
  render();
});

function init() {
  try {
    const saved = localStorage.getItem(VIEW_KEY);
    if (saved && homeView(saved).id === saved) state.home.view = saved;
  } catch {
    // Start on "All open" when storage is unavailable.
  }
  document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });
  refreshAvatars();
  applyBgTheme();
  state.route = parseRoute();
  render();
}

if (session) init();
