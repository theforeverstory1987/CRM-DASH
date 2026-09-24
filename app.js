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
  // The dashboard shows My cases or All files; the tiles switch between them in place.
  dash: 'mine',
  home: { view: 'all', type: '', priority: '', date: '', sort: 'due', text: '' },
  all: { status: 'all', whose: '', type: '', priority: '', date: '', sort: 'due', text: '' },
  suppliers: { group: 'transfers', id: '' },
  files: { view: 'calendar', handled: 'all', status: 'new', tier: 'VIP', name: '', from: '', to: '', type: '', priority: '', date: '', sort: 'due', text: '' },
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
  moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  card: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19M6.5 15h4"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>',
  store: '<path d="M3 9l1.5-5h15L21 9"/><path d="M3 9h18v1.5a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0z"/><path d="M5 13v7h14v-7"/><path d="M10 20v-4h4v4"/>',
  receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
  send: '<path d="M21 3 10 14"/><path d="M21 3 14 21l-4-7-7-4z"/>',
  folder: '<path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h4.3l2 2.5h8.7A1.5 1.5 0 0 1 21 9v9.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z"/>',
};

const STATUS_ICONS = { new: 'plus', in_progress: 'refresh', waiting_provider: 'store', waiting_client: 'clock', done: 'check' };

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

// Two letters: "Yael Mizrahi" → YM, "Admin" → AD.
function initials(name) {
  // Dots split too, so "C.K." → CK.
  const words = (name || '?').split(/[\s.]+/).filter(Boolean);
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

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

// White or near-black text, whichever reads better on the colour.
function inkFor(hex) {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
  return 0.299 * r + 0.587 * g + 0.114 * b > 170 ? '#111111' : '#ffffff';
}

// A colour picked with the colour picker paints inline; otherwise one of the tone classes.
function paintOf(member, seed) {
  if (member && HEX_COLOR.test(member.color || '')) {
    return { cls: '', style: ` style="background:${member.color};color:${inkFor(member.color)}"` };
  }
  return { cls: `tone-${toneOf(member, seed)}`, style: '' };
}

function memberAvatar(id, size = '', { badge = false } = {}) {
  const member = findMember(id);
  const { cls, style } = paintOf(member, id);
  let face;
  if (member && member.photo) face = `<span class="avatar ${size}"><img src="${esc(member.photo)}" alt=""></span>`;
  else if (member && member.emoji) face = `<span class="avatar emoji ${cls} ${size}"${style}>${esc(member.emoji)}</span>`;
  else return `<span class="avatar ${cls} ${size}"${style} aria-hidden="true">${esc(memberInitials(member))}</span>`;
  // With a photo or icon, only the profile button in the side rail keeps the initials, in a corner bubble.
  if (!badge) return face.replace('<span class="avatar', '<span aria-hidden="true" class="avatar');
  return `<span class="avatar-wrap ${size}" aria-hidden="true">${face}<span class="avatar-badge ${cls}"${style}>${esc(memberInitials(member))}</span></span>`;
}

function caseNo(kase) {
  return `G-${kase.number}`;
}

// An email about a case, with the case number (and request) already in the subject line.
function caseMailto(kase, email) {
  return `mailto:${email}?subject=${encodeURIComponent(`#${caseNo(kase)} · ${kase.title}`)}`;
}

// Flags drawn inline from flags.js (not emoji, which Windows shows as two letters).
function flag(code) {
  const country = COUNTRIES.find(([c]) => c === code);
  if (!country || !FLAG_SVGS[code]) return '';
  return `<svg class="flag" viewBox="0 0 ${FLAG_W} ${FLAG_H}" preserveAspectRatio="none" role="img" aria-label="${esc(country[1])}"><title>${esc(country[1])}</title>${FLAG_SVGS[code]}</svg>`;
}

// The request type as a hashtag, with the request's picture in front when given (🎤 #Tickets).
function hashtag(category, pic = '') {
  return `<span class="hashtag">${pic ? `<span class="hashtag-pic" aria-hidden="true">${pic}</span>` : ''}#${esc(category)}</span>`;
}

function clientNo(client) {
  return `C-${client.number}`;
}

// An ID that copies itself to the clipboard when clicked.
function idChip(id, cls = '') {
  return `<button type="button" class="id-chip ${cls}" data-copy="${esc(id)}" title="Copy ${esc(id)}" aria-label="Copy ${esc(id)}">${esc(id)}${icon('copy')}</button>`;
}

// Case numbers are always the bigger chip, #G-1001; `lg` for a case's own header.
function caseChip(kase, size = '') {
  return idChip(`#${caseNo(kase)}`, `case-no ${size}`);
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

// 24-hour clock everywhere: 19:00.
const timeFmt = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
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
  return { label: 'Requested', text: fmtDayTime(kase.dueAt), cls: dayDiff(kase.dueAt) === 0 ? 'today' : '' };
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

// A coloured dashboard tile: a link (href), a list shortcut, or an action button.
function dashTile({ label, value, sub = '', ic, color, href = '', shortcut = '', action = '', active = false }) {
  const tag = href ? 'a' : 'button';
  const attrs = href ? ` href="${href}"`
    : ` type="button"${shortcut ? ` data-shortcut="${shortcut}"` : ''}${action ? ` data-action="${action}"` : ''}`;
  return `
    <${tag} class="dash-tile tile-${color}${active ? ' active' : ''}"${attrs}${active ? ' aria-current="page"' : ''}>
      <span class="dash-tile-icon">${icon(ic)}</span>
      <span class="dash-tile-value">${value}</span>
      <span class="dash-tile-label">${label}</span>
      ${sub ? `<span class="dash-tile-sub">${sub}</span>` : ''}
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
const STATUS_FILTERS = [['all', 'All open'], ['new', 'Open'], ['in_progress', 'Ongoing'], ['waiting_provider', 'Wait: supplier'], ['waiting_client', 'Wait: client'], ['done', 'Done']];
const TYPE_FILTERS = [['', 'Any request type'], ...CATEGORIES.map(c => [c, `#${c}`])];
const PRIORITY_FILTERS = [['', 'Any priority'], ['hot', 'Urgent & high'], ['urgent', 'Urgent'], ['high', 'High'], ['normal', 'Normal'], ['low', 'Low']];
const DATE_FILTERS = [['', 'Any date'], ['overdue', 'Overdue'], ['today', 'Due today'], ['week', 'Due this week'], ['later', 'Due later'], ['none', 'No due date']];
const SORTS = [['due', 'Sort: due date'], ['priority', 'Sort: priority'], ['newest', 'Sort: newest']];

// The dashboard's side menu: one view at a time, like mail folders.
const HOME_VIEWS = [
  {
    section: 'My cases',
    items: [
      { id: 'all', label: 'All my cases', icon: 'briefcase', hint: 'Everything assigned to you or taken by you, open first', empty: 'Nothing on your plate. Open a new file with +.' },
      { id: 'new', label: 'New cases', icon: 'folder', hint: 'Not started yet', empty: 'No new cases.' },
      { id: 'urgent', label: 'Urgent', icon: 'flame', hint: 'Open cases marked urgent', empty: 'No urgent cases right now.' },
      { id: 'waiting_provider', label: 'Waiting on supplier', icon: 'store', hint: 'Waiting for the supplier to reply', empty: 'No cases waiting on a supplier.' },
      { id: 'waiting_client', label: 'Waiting on client', icon: 'clock', hint: 'Waiting for the client to reply', empty: 'No cases waiting on a client.' },
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
    case 'waiting_provider':
    case 'waiting_client':
      return mine.filter(k => k.status === view);
    case 'urgent': return mine.filter(k => isOpen(k) && k.priority === 'urgent');
    default: return mine;
  }
}

// All files: the whole team's cases, opening on the calendar.
const FILE_VIEWS = [
  {
    section: 'Views',
    items: [
      { id: 'calendar', label: 'Calendar view', icon: 'calendar', hint: 'Cases on the day they’re needed, this month and a month ahead', count: () => calendarCases().length },
      { id: 'today', label: 'Opened today', icon: 'filePlus', hint: 'Files opened today', empty: 'No files opened today yet.', count: () => filesFor('today').length },
      { id: 'all', label: 'All files', icon: 'layers', hint: 'Every file across the team, open first', empty: 'No files yet.', count: () => db.cases.length },
    ],
  },
  {
    section: 'Needs attention',
    items: [
      { id: 'urgent', label: 'Urgent', icon: 'flame', hint: 'Open cases marked urgent, across the team', empty: 'No urgent cases right now.', count: () => filesFor('urgent').length, alert: true },
      { id: 'waiting_provider', label: 'Waiting on supplier', icon: 'store', hint: 'Waiting for the supplier to reply', empty: 'No cases waiting on a supplier.', count: () => filesFor('waiting_provider').length },
      { id: 'waiting_client', label: 'Waiting on client', icon: 'clock', hint: 'Waiting for the client to reply', empty: 'No cases waiting on a client.', count: () => filesFor('waiting_client').length },
    ],
  },
  {
    section: 'Filter by',
    items: [
      { id: 'date', label: 'Date', icon: 'clock', hint: 'By the date the client needs it', empty: 'No files for these dates.' },
      { id: 'name', label: 'Client name', icon: 'user', hint: 'Sorted by client, A to Z', empty: 'No client matches that name.' },
      { id: 'status', label: 'Status', icon: 'refresh', hint: 'Every file with the status you pick', empty: 'No files with this status.' },
      { id: 'tier', label: 'Card type', icon: 'card', hint: 'By the client’s membership card', empty: 'No files for this card type.' },
    ],
  },
];

function fileView(id) {
  for (const s of FILE_VIEWS) for (const v of s.items) if (v.id === id) return v;
  return FILE_VIEWS[0].items[0];
}

function filesFor(view) {
  const f = state.files;
  switch (view) {
    case 'today': {
      const today = startOfDay(new Date()).getTime();
      return db.cases.filter(k => startOfDay(k.createdAt).getTime() === today);
    }
    case 'date': {
      const from = f.from ? new Date(`${f.from}T00:00`) : null;
      const to = f.to ? new Date(`${f.to}T23:59:59`) : null;
      if (!from && !to) return db.cases;
      return db.cases.filter(k => k.dueAt && (!from || new Date(k.dueAt) >= from) && (!to || new Date(k.dueAt) <= to));
    }
    case 'name': {
      const term = f.name.trim().toLowerCase();
      if (!term) return db.cases;
      return db.cases.filter(k => {
        const c = findClient(k.clientId);
        return c && (c.name.toLowerCase().includes(term) || clientNo(c).toLowerCase().includes(term));
      });
    }
    case 'status': return db.cases.filter(k => k.status === f.status);
    case 'tier': return db.cases.filter(k => (findClient(k.clientId) || {}).tier === f.tier);
    case 'all': return db.cases.filter(k => matchesHandled(k, f.handled));
    case 'urgent': return db.cases.filter(k => isOpen(k) && k.priority === 'urgent');
    case 'waiting_provider':
    case 'waiting_client':
      return db.cases.filter(k => k.status === view);
    default: return db.cases;
  }
}

const clientNameOf = kase => (findClient(kase.clientId) || {}).name || '';

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
  const showsDone = key === 'files' ? f.view === 'status' && f.status === 'done' : key !== 'home' && f.status === 'done';
  const sorters = {
    due: showsDone ? doneSort : dueSort,
    priority: (a, b) => (PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]) || dueSort(a, b),
    newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
  };
  const byClient = (a, b) => clientNameOf(a).localeCompare(clientNameOf(b)) || (isOpen(b) - isOpen(a)) || dueSort(a, b);
  const base = key === 'home' ? homeViewCases(f.view)
    : key === 'files' ? filesFor(f.view)
      : scopedCases(key).filter(k => (f.status === 'all' ? isOpen(k) : k.status === f.status));
  return base
    .filter(k => !f.type || k.category === f.type)
    .filter(k => matchesPriority(k, f.priority))
    .filter(k => matchesDate(k, f.date))
    .filter(k => matchesText(k, term))
    .sort(key === 'files' && f.view === 'name' ? byClient
      : (a, b) => (isOpen(b) - isOpen(a)) || (sorters[f.sort] || dueSort)(a, b));
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
  return Boolean(f.type || f.priority || f.date || f.text.trim());
}

// Name search, request type, priority, date and sort narrow whichever view is showing.
function refineRow(key, leading = '') {
  const f = state[key];
  return `
    <div class="filter-row">
      ${leading}
      <label class="search">${icon('search')}<input type="search" data-ftext="${key}" placeholder="Filter by client name, request or ID" aria-label="Filter cases" value="${esc(f.text)}"></label>
      ${filterSelect(key, 'type', TYPE_FILTERS, f.type, 'Request type')}
      ${filterSelect(key, 'priority', PRIORITY_FILTERS, f.priority, 'Priority')}
      ${filterSelect(key, 'date', DATE_FILTERS, f.date, 'Requested date')}
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
    : key === 'home' ? homeView(state.home.view).empty
      : key === 'files' ? fileView(state.files.view).empty : 'No cases here.';
  listEl.innerHTML = list.length
    ? list.map(k => caseCard(k, key)).join('')
    : `<div class="empty">${emptyText}</div>`;
}

function lastUpdateOf(kase) {
  return kase.updates.length ? kase.updates.reduce((a, b) => (a.at > b.at ? a : b)) : null;
}

// What a request is about: a picture, a short label (NBA) and what its date means.
// Tickets and events are read from the title; everything else goes by request type.
const TICKET_KINDS = [
  { test: /\bNBA\b/i, icon: '🏀', label: 'NBA', date: 'Game date' },
  { test: /basketball|courtside|euroleague/i, icon: '🏀', label: 'Basketball', date: 'Game date' },
  { test: /champions league|premier league|football|soccer|la liga/i, icon: '⚽', label: 'Football', date: 'Game date' },
  { test: /tennis|wimbledon|roland.garros/i, icon: '🎾', label: 'Tennis', date: 'Match date' },
  { test: /formula 1|\bF1\b|grand prix/i, icon: '🏎️', label: 'F1', date: 'Race date' },
  { test: /concert|festival|jazz|arena/i, icon: '🎤', label: 'Concert', date: 'Show date' },
  { test: /opera|theatre|theater|musical|premiere|stand-up|comedy|show/i, icon: '🎤', label: 'Show', date: 'Show date' },
];

const CATEGORY_KINDS = {
  Restaurant: { icon: '🍽️', date: 'Reservation' },
  Hotel: { icon: '🏨', date: 'Check-in' },
  Flights: { icon: '✈️', date: 'Flight' },
  Transfers: { icon: CAR_PIC, date: 'Pickup' },
  Massage: { icon: '💆', date: 'Appointment' },
  Yacht: { icon: '🛥️', date: 'Sailing' },
  Events: { icon: '🎉', date: 'Event date' },
  Tickets: { icon: '🎤', date: 'Show date' },
  Shopping: { icon: '🛍️', date: 'Needed by' },
  Gifts: { icon: '🎁', date: 'Deliver by' },
  Other: { icon: '📌', date: 'Needed by' },
};

function requestKind(kase) {
  const byTitle = ['Tickets', 'Events'].includes(kase.category) && TICKET_KINDS.find(k => k.test.test(kase.title));
  return byTitle || { label: '', ...(CATEGORY_KINDS[kase.category] || CATEGORY_KINDS.Other) };
}

const shortTimeFmt = timeFmt;

// "+ Follow-up" on a case card: opens a box on the card to add one without opening the case.
function followupAddButton() {
  return `<button type="button" class="followup-add" data-action="toggle-followup" aria-label="Add a follow-up">${icon('plus')}Follow-up</button>`;
}

// How far off the request is: "In 3 days", "Tomorrow", "Overdue by 2 days".
function dueCountdown(kase) {
  if (!isOpen(kase)) return { text: 'Done', cls: 'done' };
  if (!kase.dueAt) return { text: 'No date', cls: '' };
  const diff = dayDiff(kase.dueAt);
  if (new Date(kase.dueAt) < new Date()) return { text: diff === 0 ? 'Overdue today' : `Overdue by ${-diff} day${diff === -1 ? '' : 's'}`, cls: 'overdue' };
  if (diff === 0) return { text: `Today, ${shortTimeFmt.format(new Date(kase.dueAt))}`, cls: 'today' };
  if (diff === 1) return { text: 'Tomorrow', cls: '' };
  return { text: `In ${diff} days`, cls: '' };
}

// Cases the lists show opened up; the rest stay one-line bars.
const expandedCases = new Set();

// A case in a list: one bar with the client, file ID, headline, status (changeable there) and "+ Follow-up".
// Clicking the bar opens it up to the date, the request, the last follow-up and the case's actions.
function caseCard(kase, key) {
  const client = findClient(kase.clientId);
  const open = expandedCases.has(kase.id);
  const d = kase.dueAt ? new Date(kase.dueAt) : null;
  const late = isOpen(kase) && d && d < new Date();
  const cls = [`st-${kase.status}`, !isOpen(kase) && 'is-done', late && 'is-overdue', isOpen(kase) && kase.priority === 'urgent' && 'is-urgent', open && 'is-open'].filter(Boolean).join(' ');
  const lastUpdate = lastUpdateOf(kase);
  const kind = requestKind(kase);
  const countdown = dueCountdown(kase);
  return `
    <div class="case-bar ${cls}" data-bar="${kase.id}" data-list-key="${key}">
      <div class="bar-row" role="button" tabindex="0" data-case="${kase.id}" aria-label="Open case #${caseNo(kase)}">
        <span class="bar-client"><span class="bar-name">${esc(client ? client.name : 'Unknown client')}</span>${client ? flag(client.country) : ''}</span>
        <span class="bar-no">#${caseNo(kase)}</span>
        <span class="bar-title">${esc(kase.title)}</span>
        <span class="bar-ctrl" data-stop>
          <select class="status-select st-${kase.status}" data-status-for="${kase.id}" aria-label="Change status">
            ${STATUSES.map(s => `<option value="${s.id}"${s.id === kase.status ? ' selected' : ''}>${esc(s.short)}</option>`).join('')}
          </select>
        </span>
        ${followupAddButton()}
        <button type="button" class="bar-chevron" data-expand="${kase.id}" aria-expanded="${open}" aria-label="${open ? 'Hide details' : 'Show details'}" title="${open ? 'Hide details' : 'Show details'}">${icon('chevronDown')}</button>
      </div>
      <form class="quick-followup" data-followup-form="${kase.id}" data-list-key="${key}" data-stop hidden>
        <input type="text" placeholder="Write a follow-up…" aria-label="New follow-up for #${caseNo(kase)}">
        <button type="submit" class="btn btn-primary btn-md">${icon('plus')}Add</button>
      </form>
      ${open ? `
        <div class="bar-more">
          <div class="bar-facts">
            <span class="bar-when ${late ? 'overdue' : !isOpen(kase) ? 'done' : ''}">
              <span class="bar-when-pic" aria-hidden="true">${kind.icon}</span>
              <span><small>${esc(kind.date)}</small><b>${esc(d ? `${longDayFmt.format(d)}, ${timeFmt.format(d)}` : 'No date')}</b>${d ? `<em>${esc(countdown.text)}</em>` : ''}</span>
            </span>
            <span class="bar-request">${hashtag(kase.category)}${kind.label ? `<span class="kind-badge">${esc(kind.label)}</span>` : ''}${hotTag(kase.priority, 'sm')}</span>
          </div>
          ${lastUpdate ? `
            <div class="case-last">
              <span class="case-last-meta">${icon('layers')}<b>Last follow-up</b><span>${esc(firstName(memberName(lastUpdate.by)))} · ${esc(fmtDayTime(lastUpdate.at))}</span></span>
              <span class="case-last-text">${esc(lastUpdate.text)}</span>
            </div>` : `<div class="case-last none">${icon('layers')}<span>No follow-up yet</span></div>`}
          <div class="bar-actions">
            ${client && client.email ? `<a class="btn-email" href="${esc(caseMailto(kase, client.email))}" title="${esc(client.email)}" data-stop>${icon('mail')}Email ${esc(firstName(client.name))}</a>` : ''}
            ${!kase.assignee && isOpen(kase) ? `<button type="button" class="btn-take" data-take="${kase.id}">${icon('plus')}Take</button>`
              : kase.assignee ? `<span class="bar-who">${memberAvatar(kase.assignee, 'xs')}Handled by <b>${esc(kase.assignee === ME ? 'you' : firstName(memberName(kase.assignee)))}</b></span>` : ''}
            <button type="button" class="btn btn-primary btn-md bar-open" data-case="${kase.id}">${icon('arrowUpRight')}Open case</button>
          </div>
        </div>` : ''}
    </div>`;
}

function poolItem(kase) {
  const client = findClient(kase.clientId);
  const due = fmtDue(kase);
  return `
    <div class="pool-item">
      <div class="pool-body" role="button" tabindex="0" data-case="${kase.id}">
        <span class="pool-title">${esc(kase.title)}</span>
        <span class="pool-sub">${caseChip(kase)}<span>${esc(client ? client.name : 'Unknown client')} · ${esc(kase.category)}</span></span>
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
  if (['home', 'activity', 'suppliers', 'settings', 'new', 'search'].includes(name)) return { name, params };
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
  // The dashboard's own scrolling list; toggled before drawing so a redraw keeps its scroll position.
  viewEl.classList.toggle('is-dash', route.name === 'home');
  if (route.name === 'activity') renderActivity();
  else if (route.name === 'suppliers') renderSuppliers();
  else if (route.name === 'settings') renderSettings();
  else if (route.name === 'new') renderNewFilePage({ clientId: route.params.get('client') || '' });
  else if (route.name === 'search') renderSearchPage(route.params.get('q') || '');
  else if (route.name === 'case') renderCasePage(route.id);
  else if (state.dash === 'files') renderFiles();
  else renderHome();
}

function refreshAvatars() {
  document.querySelectorAll('[data-me-avatar]').forEach(el => { el.innerHTML = memberAvatar(ME, '', { badge: el.dataset.meAvatar === 'badge' }); });
}

// ---------- My dashboard ----------
// Only the case list scrolls here, so keep its position when the page redraws in the same view.
let homeListView = null;

// Quick search and the overview tiles, shared by My dashboard and All files.
function dashTop(active) {
  const mine = myCases();
  const reminders = myReminders().filter(r => !r.done);
  const overdue = reminders.filter(r => isPast(r.at));
  const notes = myNotes();
  return `
      <div class="quick-search" id="quickSearch">
        <label class="quick-label" for="quickInput">${icon('search')}Quick search</label>
        <input id="quickInput" type="search" autocomplete="off" placeholder="File ID, client name or ID">
        <div class="quick-results" id="quickResults" hidden></div>
      </div>

      <section class="dash-tiles" aria-label="Overview">
        ${dashTile({ label: 'My cases', value: mine.length, sub: `${mine.filter(isOpen).length} open`, ic: 'briefcase', color: 'blue', shortcut: 'view:all', active: active === 'home' })}
        ${dashTile({ label: 'All files', value: db.cases.length, sub: `${db.cases.filter(isOpen).length} open · whole team`, ic: 'layers', color: 'purple',
          action: 'show-files', active: active === 'files' })}
        ${dashTile({ label: 'Reminders', value: reminders.length, ic: 'clock', color: 'orange', action: 'open-reminders',
          sub: overdue.length ? `${overdue.length} overdue` : reminders[0] ? `Next: ${esc(fmtDayTime(reminders[0].at))}` : 'Add a reminder' })}
        ${dashTile({ label: 'Sticky notes', value: notes.length, ic: 'pencil', color: 'green', action: 'open-notes',
          sub: notes[0] ? esc(notes[0].text) : 'Add a note' })}
      </section>`;
}

function renderHome() {
  const oldList = document.getElementById('homeList');
  const keepTop = oldList && homeListView === state.home.view ? oldList.scrollTop : 0;
  const me = findMember(ME);
  const view = homeView(state.home.view);

  viewEl.innerHTML = `
    <div class="dash">
      <h1 class="visually-hidden">My dashboard</h1>
      ${dashTop('home')}

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
              const alert = item.id === 'urgent' && count > 0;
              return `
                <button type="button" class="dash-item${item.id === view.id ? ' active' : ''}" data-view="${item.id}"${item.id === view.id ? ' aria-current="true"' : ''}>
                  ${icon(item.icon)}<span class="dash-item-label">${item.label}</span><span class="dash-count${alert ? ' alert' : ''}">${count}</span>
                </button>`;
            }).join('')}
          </div>`).join('')}
      </aside>

      <div class="dash-main">
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
  document.getElementById('homeList').scrollTop = keepTop;
  homeListView = state.home.view;
  bindQuickSearch();
}

// ---------- All files ----------
let filesListView = null;

function renderFiles() {
  const f = state.files;
  const old = document.querySelector('#filesScroll, #filesList');
  const keepTop = old && filesListView === f.view ? old.scrollTop : 0;
  const view = fileView(f.view);
  const isCal = view.id === 'calendar';

  viewEl.innerHTML = `
    <div class="dash">
      <h1 class="visually-hidden">All files</h1>
      ${dashTop('files')}

      <aside class="dash-nav" aria-label="All files views">
        <div class="dash-me">
          <span class="dash-me-icon">${icon('layers')}</span>
          <div class="dash-me-text">
            <div class="dash-me-name">All files</div>
            <div class="dash-me-sub">${db.cases.length} files · ${db.cases.filter(isOpen).length} open</div>
          </div>
        </div>
        ${FILE_VIEWS.map(section => `
          <div class="dash-section">
            <p class="dash-label">${section.section}</p>
            ${section.items.map(item => `
              <button type="button" class="dash-item${item.id === view.id ? ' active' : ''}" data-fview="${item.id}"${item.id === view.id ? ' aria-current="true"' : ''}>
                ${icon(item.icon)}<span class="dash-item-label">${item.label}</span>${item.count ? dashCount(item) : ''}
              </button>`).join('')}
          </div>`).join('')}
      </aside>

      <div class="dash-main">
        <section class="panel">
          <div class="panel-head">
            <h2>${esc(view.label)} <span class="count-badge" id="filesCount"></span></h2>
            <span class="muted small">${esc(view.hint)}</span>
          </div>
          ${isCal
            ? `<div class="cal-scroll" id="filesScroll">${filesCalendar()}</div>`
            : `${filesControls(view.id)}<div class="case-list" id="filesList"></div>`}
        </section>
      </div>
    </div>`;
  if (isCal) document.getElementById('filesCount').textContent = calendarCases().length;
  else renderList('files');
  // A fresh calendar opens on today's week; a redraw keeps its place.
  if (isCal && !(old && filesListView === 'calendar')) scrollCalendarToToday();
  else document.querySelector('#filesScroll, #filesList').scrollTop = keepTop;
  filesListView = view.id;
  bindQuickSearch();
}

function dashCount(item) {
  const n = item.count();
  return `<span class="dash-count${item.alert && n > 0 ? ' alert' : ''}">${n}</span>`;
}

// The controls above the list, one kind per view.
function filesControls(view) {
  const f = state.files;
  const pill = (field, value, label, count) => `<button type="button" class="${f[field] === value ? 'active' : ''}" data-fset="files.${field}" data-value="${esc(value)}">${esc(label)}${count !== undefined ? `<span class="pill-count">${count}</span>` : ''}</button>`;
  switch (view) {
    case 'all':
      return `
        <div class="filters">
          <div class="pills" role="group" aria-label="Show">${HANDLED_FILTERS.map(([v, l]) => pill('handled', v, l, db.cases.filter(k => matchesHandled(k, v)).length)).join('')}</div>
          ${refineRow('files')}
        </div>`;
    case 'date':
      return `
        <div class="filters">
          <div class="pills" role="group" aria-label="Needed by">${DATE_FILTERS.map(([v, l]) => pill('date', v, l)).join('')}</div>
          <div class="filter-row">
            <label class="date-field">From<input type="date" class="date-input" data-fdate="from" value="${esc(f.from)}"></label>
            <label class="date-field">Until<input type="date" class="date-input" data-fdate="to" value="${esc(f.to)}"></label>
            ${f.from || f.to ? `<button type="button" class="link-btn" data-action="clear-dates">${icon('x')}Clear dates</button>` : ''}
          </div>
        </div>`;
    case 'name': {
      const clients = [...db.clients].sort((a, b) => a.name.localeCompare(b.name));
      return `
        <div class="filters">
          <div class="filter-row">
            <label class="search">${icon('search')}<input type="search" data-fname placeholder="Type a client name or ID" aria-label="Client name" value="${esc(f.name)}"></label>
          </div>
          <div class="pills" role="group" aria-label="Clients">
            ${pill('name', '', 'All clients')}
            ${clients.map(c => pill('name', c.name, c.name, db.cases.filter(k => k.clientId === c.id).length)).join('')}
          </div>
        </div>`;
    }
    case 'status':
      return `<div class="filters"><div class="pills" role="group" aria-label="Status">${STATUSES.map(s => pill('status', s.id, s.label, db.cases.filter(k => k.status === s.id).length)).join('')}</div></div>`;
    case 'tier':
      return `<div class="filters"><div class="pills" role="group" aria-label="Card type">${[...TIERS].reverse().map(t => pill('tier', t, t, db.cases.filter(k => (findClient(k.clientId) || {}).tier === t).length)).join('')}</div></div>`;
    default:
      return '';
  }
}

// ---------- Calendar: from the 1st of this month to a month ahead ----------
const CAL_DAYS = 31;
const monthFmt = new Intl.DateTimeFormat(undefined, { month: 'short' });

// Earlier days this month show what was handled; it opens scrolled to today.
function calendarRange() {
  const today = startOfDay(new Date());
  return { today, start: new Date(today.getFullYear(), today.getMonth(), 1), end: addDays(today, CAL_DAYS - 1) };
}

// The Done / Not done filter shared by the calendar and the All files list.
function matchesHandled(kase, filter) {
  if (filter === 'open') return isOpen(kase);
  if (filter === 'done') return !isOpen(kase);
  return true;
}

const HANDLED_FILTERS = [['all', 'All cases'], ['open', 'Not done'], ['done', 'Done']];

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

// Local date as YYYY-MM-DD, used to group cases by day.
function dayKey(value) {
  const d = new Date(value);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Cases due inside the calendar, open or done, after the Done / Not done filter.
function calendarCases() {
  const { start, end } = calendarRange();
  const last = endOfDay(end);
  return db.cases.filter(k => k.dueAt && new Date(k.dueAt) >= start && new Date(k.dueAt) <= last && matchesHandled(k, state.files.handled));
}

// Cases per request type, most first: [['Transfers', 3], ['Restaurant', 2]].
function typeCounts(cases) {
  const counts = {};
  for (const k of cases) counts[k.category] = (counts[k.category] || 0) + 1;
  return Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

// Still-open cases due before the calendar starts.
function openBeforeCalendar() {
  const { start } = calendarRange();
  return db.cases.filter(k => isOpen(k) && k.dueAt && new Date(k.dueAt) < start);
}

// Green when everything that day is done, orange when some of it isn't
// (partly done, or past and still open), blue shades for what's coming up.
function dayState(list, day, today) {
  const open = list.filter(isOpen).length;
  if (!open) return { cls: 'cal-done', label: 'all done' };
  if (open < list.length || day < today) return { cls: 'cal-mixed', label: `${open} not done` };
  const n = list.length;
  return { cls: `cal-l${n >= 5 ? 4 : n >= 3 ? 3 : n}`, label: `case${n === 1 ? '' : 's'}` };
}

function filesCalendar() {
  const { today, start, end } = calendarRange();
  const byDay = {};
  for (const k of calendarCases()) (byDay[dayKey(k.dueAt)] ||= []).push(k);

  // Whole weeks, Sunday to Saturday; days outside the range are faded.
  const cells = [];
  for (let d = addDays(start, -start.getDay()); d <= end || d.getDay() !== 0; d = addDays(d, 1)) cells.push(d);

  const head = cells.slice(0, 7).map(d => `<span class="cal-head">${esc(weekdayShortFmt.format(d))}</span>`).join('');
  const body = cells.map(d => {
    if (d < start || d > end) return `<div class="cal-day out" aria-hidden="true"><span class="cal-date">${d.getDate()}</span></div>`;
    const isToday = d.getTime() === today.getTime();
    const past = d < today ? ' past' : '';
    const tag = isToday ? '<small class="cal-today">Today</small>' : d.getDate() === 1 ? `<small>${esc(monthFmt.format(d))}</small>` : '';
    const date = `<span class="cal-date">${d.getDate()}${tag}</span>`;
    const list = (byDay[dayKey(d)] || []).sort(dueSort);
    if (!list.length) return `<div class="cal-day${isToday ? ' today' : ''}${past}">${date}</div>`;
    const state = dayState(list, d, today);
    // What kind of requests: "3 Transfers", "2 Restaurant".
    const types = typeCounts(list);
    const peek = types.slice(0, 2).map(([c, n]) => `<span><b>${n}</b> ${esc(c)}</span>`).join('');
    const breakdown = types.map(([c, n]) => `${n} ${c}`).join(', ');
    return `
      <button type="button" class="cal-day ${state.cls}${isToday ? ' today' : ''}${past}" data-day="${dayKey(d)}" aria-label="${esc(`${longDayFmt.format(d)}: ${list.length} case${list.length === 1 ? '' : 's'}, ${state.label}. ${breakdown}`)}" title="${esc(breakdown)}">
        ${date}
        <span class="cal-count">${list.length}<span>${esc(state.label)}</span></span>
        <span class="cal-peek">${peek}${types.length > 2 ? `<span>+${types.length - 2} more type${types.length === 3 ? '' : 's'}</span>` : ''}</span>
      </button>`;
  }).join('');

  const earlier = openBeforeCalendar();
  const handled = state.files.handled;
  return `
    <div class="cal-bar">
      <span class="cal-range">${icon('calendar')}${esc(`${shortDateFmt.format(start)} – ${shortDateFmt.format(end)}`)}</span>
      <div class="pills sm" role="group" aria-label="Show">
        ${HANDLED_FILTERS.map(([v, l]) => `<button type="button" class="${handled === v ? 'active' : ''}" data-fset="files.handled" data-value="${v}">${l}</button>`).join('')}
      </div>
      <button type="button" class="link-btn" data-action="cal-today">${icon('arrowRight')}Today</button>
      ${earlier.length && handled !== 'done' ? `<button type="button" class="cal-overdue" data-day="overdue">${icon('flame')}${earlier.length} still open from before ${esc(shortDateFmt.format(start))}</button>` : ''}
    </div>
    <div class="cal-grid">${head}${body}</div>
    <div class="chart-legend cal-legend">
      <span><i class="cal-done"></i>All done</span>
      <span><i class="cal-mixed"></i>Not all done</span>
      <span>Coming up:</span>
      <span><i class="cal-l1"></i>1</span><span><i class="cal-l2"></i>2</span><span><i class="cal-l3"></i>3–4</span><span><i class="cal-l4"></i>5+</span>
    </div>`;
}

// Scrolls the calendar so today's week is at the top.
function scrollCalendarToToday(smooth = false) {
  const scroller = document.getElementById('filesScroll');
  const todayCell = scroller && scroller.querySelector('.cal-day.today');
  if (!todayCell) return;
  if (scroller.scrollHeight > scroller.clientHeight) {
    scroller.scrollTo({ top: todayCell.offsetTop - 34, behavior: smooth ? 'smooth' : 'auto' });
  } else if (smooth) {
    // Phones: the page scrolls, not the calendar.
    todayCell.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// Side panel with the cases due on one day (or still open from before the calendar):
// a count per request type on top (tap one to show only those), then the cases grouped by type.
function openDaySheet(key, type = '') {
  const overdue = key === 'overdue';
  const all = (overdue ? openBeforeCalendar()
    : db.cases.filter(k => k.dueAt && dayKey(k.dueAt) === key && matchesHandled(k, state.files.handled)))
    .sort((a, b) => (isOpen(b) - isOpen(a)) || dueSort(a, b));
  const types = typeCounts(all);
  const shown = type ? types.filter(([c]) => c === type) : types;
  const list = type ? all.filter(k => k.category === type) : all;
  const title = overdue ? `Still open from before ${shortDateFmt.format(calendarRange().start)}` : longDayFmt.format(new Date(`${key}T00:00`));
  const openList = list.filter(isOpen);
  const done = all.length - all.filter(isOpen).length;
  const hot = openList.filter(k => k.priority === 'urgent' || k.priority === 'high').length;
  const pool = openList.filter(k => !k.assignee).length;
  const typeBtn = (value, count, label) => `
    <button type="button" class="day-type${type === value ? ' active' : ''}" data-day-type="${esc(value)}" aria-pressed="${type === value}">
      <span class="day-type-count">${count}</span><span class="day-type-label">${esc(label)}</span>
    </button>`;
  openSheet(`
    ${sheetHead('calendar', `${all.length} case${all.length === 1 ? '' : 's'}${done ? ` · ${done === all.length ? 'all' : done} done` : ''}`, esc(title))}
    ${all.length ? `
      <div class="day-types" role="group" aria-label="Request types">
        ${typeBtn('', all.length, 'All')}
        ${types.map(([c, n]) => typeBtn(c, n, `#${c}`)).join('')}
      </div>` : ''}
    ${hot || pool ? `
      <div class="tags day-summary">
        ${hot ? `<span class="tag sm pr-urgent">${icon('flame')}${hot} urgent or high</span>` : ''}
        ${pool ? `<span class="tag sm">${icon('inbox')}${pool} in the open pool</span>` : ''}
      </div>` : ''}
    <div class="day-list">
      ${list.length ? shown.map(([c, n]) => `
        <h3 class="day-group">${hashtag(c)}<span class="count-badge">${n}</span></h3>
        ${list.filter(k => k.category === c).map(k => dayCaseRow(k, overdue)).join('')}`).join('')
        : '<div class="empty">Nothing due on this day.</div>'}
    </div>`, {
    label: title,
    onMount(sheet) {
      sheet.addEventListener('click', e => {
        const btn = e.target.closest('[data-day-type]');
        if (btn) openDaySheet(key, btn.dataset.dayType);
      });
    },
  });
  sheetBack = () => openDaySheet(key, type);
  currentSheet = { type: 'day', key, dayType: type };
}

function dayCaseRow(kase, withDate) {
  const client = findClient(kase.clientId);
  const due = new Date(kase.dueAt);
  const who = kase.assignee
    ? `${memberAvatar(kase.assignee, 'sm')}<span>${esc(kase.assignee === ME ? 'You' : firstName(memberName(kase.assignee)))}</span>`
    : `<span class="day-pool">${icon('inbox')}</span><span>Open pool</span>`;
  const cls = !isOpen(kase) ? ' is-done' : due < new Date() ? ' is-overdue' : '';
  return `
    <div class="day-case${cls}" role="button" tabindex="0" data-case="${kase.id}">
      <span class="day-time">${esc(withDate ? shortDateFmt.format(due) : timeFmt.format(due))}</span>
      <span class="day-case-body">
        <span class="day-case-client">${esc(client ? client.name : 'Unknown client')}${client ? flag(client.country) + tierTag(client.tier) : ''}</span>
        <span class="case-request">${hashtag(kase.category)}<span class="case-title">${esc(kase.title)}</span></span>
        ${kase.details ? `<span class="day-details">${esc(kase.details)}</span>` : ''}
        <span class="tags">${caseChip(kase)}${statusTag(kase.status, 'sm')}${hotTag(kase.priority, 'sm')}${channelTag(kase.channel, 'sm')}</span>
      </span>
      <span class="day-case-who">${who}</span>
    </div>`;
}

// ---------- Quick search (dashboard) ----------
function quickClientHit(client) {
  const total = db.cases.filter(k => k.clientId === client.id).length;
  return `
    <div class="hit" role="button" tabindex="0" data-client="${client.id}">
      ${avatar(client.name, client.id, 'sm')}
      <span class="hit-main">
        <span class="hit-name">${esc(client.name)}</span>
        <span class="hit-sub">${esc(client.tier)} · ${total} case${total === 1 ? '' : 's'}</span>
      </span>
      ${idChip(clientNo(client))}
    </div>`;
}

function bindQuickSearch() {
  const box = document.getElementById('quickSearch');
  const input = box.querySelector('input');
  const results = box.querySelector('#quickResults');
  const draw = () => {
    const q = input.value.trim();
    results.hidden = !q;
    if (!q) return;
    const cases = caseMatches(q).slice(0, 5);
    const clients = clientMatches(q).slice(0, 5);
    results.innerHTML = `
      ${cases.length ? `<p class="results-title">Cases</p>${cases.map(caseHit).join('')}` : ''}
      ${clients.length ? `<p class="results-title">Clients</p>${clients.map(quickClientHit).join('')}` : ''}
      ${cases.length || clients.length ? '' : '<div class="empty">Nothing matches that.</div>'}
      <button type="button" class="link-btn" data-action="search-all">${icon('search')}Search everything for “${esc(q)}”</button>`;
  };
  input.addEventListener('input', draw);
  input.addEventListener('focus', draw);
  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      input.value = '';
      draw();
    } else if (e.key === 'Enter') {
      const hits = caseMatches(input.value);
      const exact = hits.find(k => String(k.number) === input.value.replace(/\D/g, ''));
      if (exact) openCaseSheet(exact.id);
      else if (input.value.trim()) openSearchTab(input.value.trim());
    }
  });
  // Close the results when focus leaves the search (clicking a result keeps it inside).
  box.addEventListener('focusout', e => {
    if (!box.contains(e.relatedTarget)) results.hidden = true;
  });
}

// ---------- Reminders and sticky notes ----------
const NOTE_COLORS = ['yellow', 'pink', 'blue', 'green'];

function noteColor(color) {
  return NOTE_COLORS.includes(color) ? color : 'yellow';
}

function isPast(iso) {
  return new Date(iso) < new Date();
}

function myReminders() {
  return db.reminders.filter(r => r.by === ME).sort((a, b) => (a.done - b.done) || a.at.localeCompare(b.at));
}

// Your own notes and the ones teammates shared with you.
function myNotes() {
  return db.notes.filter(n => n.by === ME || (n.sharedWith || []).includes(ME));
}

function namesOf(ids) {
  return ids.map(id => firstName(memberName(id))).join(', ');
}

function reminderRow(r) {
  const overdue = !r.done && isPast(r.at);
  return `
    <div class="reminder${r.done ? ' is-done' : ''}${overdue ? ' is-overdue' : ''}">
      <button type="button" class="reminder-check" data-reminder-toggle="${r.id}" aria-label="${r.done ? 'Mark as not done' : 'Mark as done'}">${r.done ? icon('check') : ''}</button>
      <span class="reminder-body">
        <span class="reminder-text">${esc(r.text)}</span>
        <span class="reminder-when">${overdue ? 'Overdue · ' : ''}${esc(fmtDayTime(r.at))}${r.caseId && findCase(r.caseId) ? ` · <button type="button" class="feed-link" data-case="${r.caseId}">#${caseNo(findCase(r.caseId))}</button>` : ''}</span>
      </span>
      <button type="button" class="icon-btn sm" data-reminder-delete="${r.id}" aria-label="Delete reminder" title="Delete">${icon('x')}</button>
    </div>`;
}

function openRemindersSheet() {
  const list = myReminders();
  openSheet(`
    ${sheetHead('clock', 'Reminders', 'Your reminders')}
    <form class="form" id="reminderForm" novalidate>
      <div class="fld">
        <label class="fld-label" for="rText">Remind me to…</label>
        <input id="rText" class="control" autocomplete="off" placeholder="e.g. Call Yael about the cake">
      </div>
      <div class="inline-add">
        <input id="rAt" type="datetime-local" class="control" value="${esc(defaultDue())}" aria-label="When">
        <button type="submit" class="btn btn-primary btn-md">${icon('plus')}Add</button>
      </div>
    </form>
    <div class="reminder-list">${list.length ? list.map(reminderRow).join('') : '<div class="empty">No reminders yet.</div>'}</div>`, {
    label: 'Reminders',
    onMount(sheet) {
      sheet.querySelector('#reminderForm').addEventListener('submit', e => {
        e.preventDefault();
        const text = sheet.querySelector('#rText').value;
        const at = sheet.querySelector('#rAt').value;
        if (!text.trim() || !at) return;
        addReminder(text, new Date(at).toISOString(), ME);
        render();
        openRemindersSheet();
        toast('Reminder added');
      });
      sheet.addEventListener('click', e => {
        const toggle = e.target.closest('[data-reminder-toggle]');
        const remove = e.target.closest('[data-reminder-delete]');
        if (toggle) toggleReminder(toggle.dataset.reminderToggle);
        else if (remove) deleteReminder(remove.dataset.reminderDelete);
        else return;
        render();
        openRemindersSheet();
      });
      sheet.querySelector('#rText').focus();
    },
  });
}

function stickyNote(n) {
  const mine = n.by === ME;
  const shared = (n.sharedWith || []).filter(id => findMember(id));
  const meta = mine
    ? (shared.length ? `<span class="sticky-meta">${icon('share')}Shared with ${esc(namesOf(shared))}</span>` : '')
    : `<span class="sticky-meta">${memberAvatar(n.by, 'xs')}From ${esc(firstName(memberName(n.by)))}</span>`;
  const actions = mine
    ? `<button type="button" class="icon-btn sm" data-note-share="${n.id}" aria-label="Share note" title="Share">${icon('share')}</button>
       <button type="button" class="icon-btn sm" data-note-delete="${n.id}" aria-label="Delete note" title="Delete">${icon('x')}</button>`
    : `<button type="button" class="icon-btn sm" data-note-remove="${n.id}" aria-label="Remove from my notes" title="Remove from my notes">${icon('x')}</button>`;
  return `
    <div class="sticky sticky-${noteColor(n.color)}">
      <p>${esc(n.text)}</p>
      ${meta}
      <span class="sticky-foot">${esc(fmtDayTime(n.at))}<span class="sticky-actions">${actions}</span></span>
    </div>`;
}

function backButton() {
  return `<button type="button" class="square-btn back" data-action="sheet-back" aria-label="Back" title="Back">${icon('arrowRight')}</button>`;
}

// Pick which teammates see a note; they get it on their own sticky notes, marked as from you.
function openShareNoteSheet(id) {
  const note = db.notes.find(n => n.id === id);
  if (!note) return;
  const shared = note.sharedWith || [];
  const others = db.team.filter(m => m.id !== note.by);
  openSheet(`
    ${sheetHead('share', 'Share note', 'Who should see it?', backButton())}
    <div class="sticky sticky-${noteColor(note.color)} share-preview"><p>${esc(note.text)}</p></div>
    <form class="form" id="shareForm" novalidate>
      <div class="share-list">
        ${others.map(m => `
          <label class="share-row">
            ${memberAvatar(m.id, 'sm')}
            <span class="hit-main"><span class="hit-name">${esc(m.name)}</span><span class="hit-sub">${esc(m.title)}</span></span>
            <input type="checkbox" name="share" value="${m.id}"${shared.includes(m.id) ? ' checked' : ''}>
          </label>`).join('')}
      </div>
      <p class="fld-hint">They’ll see it on their sticky notes, marked as from you. Only you can delete it.</p>
      <div class="form-actions">
        <button type="button" class="btn btn-secondary btn-md" data-action="sheet-back">Cancel</button>
        <button type="submit" class="btn btn-primary btn-md">${icon('share')}Save</button>
      </div>
    </form>`, {
    label: 'Share note',
    onMount(sheet) {
      const form = sheet.querySelector('#shareForm');
      form.addEventListener('submit', e => {
        e.preventDefault();
        const ids = [...form.querySelectorAll('input[name="share"]:checked')].map(i => i.value);
        shareNote(id, ids);
        render();
        openNotesSheet();
        toast(ids.length ? `Shared with ${namesOf(ids)}` : 'Note is private again');
      });
    },
  });
  sheetBack = () => openNotesSheet();
}

function openNotesSheet(color = 'yellow') {
  const notes = myNotes();
  const others = db.team.filter(m => m.id !== ME);
  openSheet(`
    ${sheetHead('pencil', 'Sticky notes', 'Your notes')}
    <form class="form" id="noteForm" novalidate>
      <textarea id="nText" class="control" rows="3" placeholder="Write a note…" aria-label="Note"></textarea>
      ${others.length ? `
        <div class="fld">
          <span class="fld-label">Share with <span class="muted small">(optional)</span></span>
          ${checkGroup('nShare', others.map(m => ({ id: m.id, label: firstName(m.name) })))}
        </div>` : ''}
      <div class="inline-add">
        <div class="note-colors" role="radiogroup" aria-label="Note colour">
          ${NOTE_COLORS.map(c => `<label class="note-swatch sticky-${c}"><input type="radio" name="nColor" value="${c}"${c === color ? ' checked' : ''}><span class="visually-hidden">${c}</span></label>`).join('')}
        </div>
        <button type="submit" class="btn btn-primary btn-md">${icon('plus')}Add note</button>
      </div>
    </form>
    <div class="note-grid">
      ${notes.length ? notes.map(stickyNote).join('') : '<div class="empty">No notes yet.</div>'}
    </div>`, {
    label: 'Sticky notes',
    onMount(sheet) {
      const form = sheet.querySelector('#noteForm');
      form.addEventListener('submit', e => {
        e.preventDefault();
        const text = sheet.querySelector('#nText').value;
        if (!text.trim()) return;
        const share = [...form.querySelectorAll('input[name="nShare"]:checked')].map(i => i.value);
        addNote(text, form.nColor.value, ME, share);
        render();
        openNotesSheet(form.nColor.value);
        toast(share.length ? `Note shared with ${namesOf(share)}` : 'Note added');
      });
      sheet.addEventListener('click', e => {
        const share = e.target.closest('[data-note-share]');
        const remove = e.target.closest('[data-note-delete]');
        const unshare = e.target.closest('[data-note-remove]');
        if (share) return openShareNoteSheet(share.dataset.noteShare);
        if (remove) deleteNote(remove.dataset.noteDelete);
        else if (unshare) unshareNote(unshare.dataset.noteRemove, ME);
        else return;
        render();
        openNotesSheet(form.nColor.value);
      });
      sheet.querySelector('#nText').focus();
    },
  });
}

// Number cards jump straight to what they count.
function applyShortcut(shortcut) {
  const [field, value] = shortcut.split(':');
  state.home = { ...state.home, view: 'all', type: '', priority: '', date: '', text: '' };
  state.home[field] = value;
  state.dash = 'mine';
  saveHomeView();
  if (state.route.name !== 'home') {
    location.hash = '#/home';
    return;
  }
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
    { label: 'Urgent', color: '#ff3350', value: openNow.filter(k => k.priority === 'urgent').length },
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

// ---------- Suppliers ----------
const moneyFmt = new Intl.NumberFormat('en', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 });
const eventDayFmt = new Intl.DateTimeFormat(undefined, { weekday: 'short', day: 'numeric', month: 'short' });

function money(n) {
  return moneyFmt.format(n || 0);
}

function supplierGroup(id) {
  return SUPPLIER_GROUPS.find(g => g.id === id) || SUPPLIER_GROUPS[0];
}

function bookingsOf(supplierId) {
  return db.bookings.filter(b => b.supplierId === supplierId);
}

function bookingTotals(list) {
  return {
    clients: new Set(list.map(b => b.clientId)).size,
    qty: list.reduce((n, b) => n + (b.qty || 0), 0),
    price: list.reduce((n, b) => n + (b.price || 0), 0),
    missing: list.filter(b => !b.invoice).length,
  };
}

// Suppliers, laid out like the dashboard: categories in a side menu, the category's suppliers and bookings beside it.
function renderSuppliers() {
  const group = supplierGroup(state.suppliers.group);
  const inGroup = id => db.suppliers.filter(s => s.group === id);
  const list = inGroup(group.id);
  const current = list.find(s => s.id === state.suppliers.id) || list[0];
  viewEl.innerHTML = `
    <header class="page-head">
      <div>
        <p class="eyebrow"><img class="eyebrow-logo" src="favicon.svg" alt="">Suppliers</p>
        <h1 class="page-title"><span class="soft">Your</span> suppliers</h1>
      </div>
      <button type="button" class="btn btn-primary btn-md" data-action="add-supplier">${icon('plus')}Add supplier</button>
    </header>

    <div class="dash suppliers-layout">
      <aside class="dash-nav" aria-label="Supplier categories">
        <div class="dash-me">
          <span class="dash-me-icon">${icon('store')}</span>
          <div class="dash-me-text">
            <div class="dash-me-name">Suppliers</div>
            <div class="dash-me-sub">${db.suppliers.length} suppliers · ${db.bookings.length} bookings</div>
          </div>
        </div>
        <div class="dash-section">
          <p class="dash-label">Categories</p>
          ${SUPPLIER_GROUPS.map(g => `
            <button type="button" class="dash-item${g.id === group.id ? ' active' : ''}" data-sgroup="${g.id}"${g.id === group.id ? ' aria-current="true"' : ''}>
              <span class="dash-item-pic" aria-hidden="true">${g.icon}</span><span class="dash-item-label">${esc(g.label)}</span><span class="dash-count">${inGroup(g.id).length}</span>
            </button>`).join('')}
        </div>
      </aside>

      <div class="dash-main">
        ${list.length ? `
          <section class="supplier-grid" aria-label="${esc(group.label)} suppliers">${list.map(s => supplierBox(s, group, s.id === current.id)).join('')}</section>
          ${supplierPanel(current, group)}` : `
          <section class="panel">
            <div class="panel-head"><h2>${group.icon} ${esc(group.label)}</h2></div>
            <div class="empty">
              No ${esc(group.label.toLowerCase())} suppliers yet. Add the ones you work with.
              <div class="empty-action"><button type="button" class="btn btn-primary btn-md" data-action="add-supplier">${icon('plus')}Add supplier</button></div>
            </div>
          </section>`}
      </div>
    </div>`;
}

function openAddSupplierSheet(groupId) {
  openSheet(`
    ${sheetHead('store', 'Suppliers', 'Add supplier')}
    <form class="form" id="supplierForm" novalidate>
      <div class="fld">
        <label class="fld-label" for="sName">Name</label>
        <input id="sName" class="control" autocomplete="off" placeholder="e.g. a ticket agency, a car service, a restaurant">
      </div>
      <div class="fld">
        <span class="fld-label">Category</span>
        ${segRadio('sGroup', SUPPLIER_GROUPS.map(g => ({ id: g.id, label: g.label })), groupId)}
      </div>
      <div class="fld-grid">
        <div class="fld"><label class="fld-label" for="sPhone">Phone</label><input id="sPhone" class="control" type="tel" autocomplete="off"></div>
        <div class="fld"><label class="fld-label" for="sEmail">Email</label><input id="sEmail" class="control" type="email" autocomplete="off"></div>
      </div>
      <p class="form-error hidden" id="supplierError" role="alert"></p>
      <div class="form-actions">
        <button type="button" class="btn btn-secondary btn-md" data-action="close-sheet">Cancel</button>
        <button type="submit" class="btn btn-primary btn-md">${icon('plus')}Add supplier</button>
      </div>
    </form>`, {
    label: 'Add supplier',
    onMount(sheet) {
      const form = sheet.querySelector('#supplierForm');
      const nameInput = sheet.querySelector('#sName');
      nameInput.focus();
      form.addEventListener('submit', e => {
        e.preventDefault();
        if (!nameInput.value.trim()) {
          const errorEl = sheet.querySelector('#supplierError');
          errorEl.textContent = 'Enter the supplier’s name.';
          errorEl.classList.remove('hidden');
          nameInput.focus();
          return;
        }
        const supplier = addSupplier({
          name: nameInput.value,
          group: form.sGroup.value,
          phone: sheet.querySelector('#sPhone').value,
          email: sheet.querySelector('#sEmail').value,
        });
        state.suppliers = { group: supplier.group, id: supplier.id };
        closeSheet();
        render();
        toast(`${supplier.name} added to ${supplierGroup(supplier.group).label}`);
      });
    },
  });
}

function supplierBox(supplier, group, active) {
  const t = bookingTotals(bookingsOf(supplier.id));
  return `
    <button type="button" class="supplier-box${active ? ' active' : ''}" data-supplier="${supplier.id}" aria-pressed="${active}">
      <span class="supplier-logo tone-${hashTone(supplier.id)}">${esc(initials(supplier.name))}</span>
      <span class="supplier-name">${esc(supplier.name)}</span>
      <span class="supplier-sub">${t.clients} client${t.clients === 1 ? '' : 's'} · ${t.qty} ${esc(group.qty.toLowerCase())}</span>
      <span class="supplier-total">${money(t.price)}</span>
      ${t.missing ? `<span class="badge red">${t.missing} invoice${t.missing === 1 ? '' : 's'} missing</span>`
        : t.qty ? '<span class="badge green">Invoices in</span>' : '<span class="badge">No bookings yet</span>'}
    </button>`;
}

// The chosen supplier's bookings: who bought, when, how many, for how much, and the invoice.
function supplierPanel(supplier, group) {
  const rows = bookingsOf(supplier.id).sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  const t = bookingTotals(rows);
  return `
    <section class="panel supplier-panel">
      <div class="panel-head">
        <h2>${esc(supplier.name)} <span class="count-badge">${rows.length}</span></h2>
        <div class="head-actions">
          ${supplier.phone ? `<a class="btn-email" href="tel:${esc(supplier.phone.replace(/[^\d+]/g, ''))}">${icon('phone')}${esc(supplier.phone)}</a>` : ''}
          ${supplier.email ? `<a class="btn-email" href="mailto:${esc(supplier.email)}">${icon('mail')}Email</a>` : ''}
          <button type="button" class="btn btn-primary btn-md" data-action="add-booking" data-supplier-id="${supplier.id}">${icon('plus')}Add booking</button>
        </div>
      </div>
      ${rows.length ? `
        <div class="table-wrap">
          <table class="bookings">
            <thead>
              <tr><th>Client</th><th>Phone</th><th>${esc(group.date)}</th><th class="num">${esc(group.qty)}</th><th class="num">Price</th><th>Invoice</th><th>Case</th></tr>
            </thead>
            <tbody>${rows.map(b => bookingRow(b, group)).join('')}</tbody>
            <tfoot>
              <tr>
                <td colspan="3">Total · ${t.clients} client${t.clients === 1 ? '' : 's'}</td>
                <td class="num" data-label="${esc(group.qty)}">${t.qty}</td>
                <td class="num" data-label="Price">${money(t.price)}</td>
                <td colspan="2" data-label="Invoices">${t.missing ? `<span class="tag sm alert">${t.missing} missing</span>` : '<span class="tag sm st-done">All in</span>'}</td>
              </tr>
            </tfoot>
          </table>
        </div>` : `<div class="empty">No bookings with ${esc(supplier.name)} yet. Add one when you buy for a client.</div>`}
    </section>`;
}

function bookingRow(b, group) {
  const client = findClient(b.clientId);
  const kase = findCase(b.caseId);
  const when = b.date ? new Date(b.date) : null;
  return `
    <tr data-case="${esc(b.caseId)}">
      <td data-label="Client">
        <span class="bk-client">
          ${client ? avatar(client.name, client.id, 'sm') : ''}
          <button type="button" class="feed-link" data-case="${esc(b.caseId)}">${esc(client ? client.name : 'Unknown client')}</button>
          ${client ? flag(client.country) : ''}
        </span>
      </td>
      <td data-label="Phone">${client && client.phone ? `<a class="bk-phone" data-stop href="tel:${esc(client.phone.replace(/[^\d+]/g, ''))}">${esc(client.phone)}</a>` : '<span class="muted">–</span>'}</td>
      <td data-label="${esc(group.date)}">${when ? `${esc(eventDayFmt.format(when))} · ${esc(timeFmt.format(when))}` : '<span class="muted">–</span>'}</td>
      <td class="num" data-label="${esc(group.qty)}">${b.qty}</td>
      <td class="num" data-label="Price">${money(b.price)}</td>
      <td data-label="Invoice">${b.invoice ? `<span class="tag sm st-done">${icon('receipt')}${esc(b.invoice)}</span>` : '<span class="tag sm alert">Missing</span>'}</td>
      <td data-label="Case">${kase ? caseChip(kase) : ''}</td>
    </tr>`;
}

function openBookingSheet(supplierId) {
  const supplier = findSupplier(supplierId);
  if (!supplier) return;
  const group = supplierGroup(supplier.group);
  const cases = [...db.cases].sort((a, b) => (isOpen(b) - isOpen(a)) || b.number - a.number);
  openSheet(`
    ${sheetHead('store', `${esc(group.label)} · ${esc(supplier.name)}`, 'Add booking')}
    <form class="form" id="bookingForm" novalidate>
      <div class="fld">
        <label class="fld-label" for="bCase">Case</label>
        ${selectWrap('bCase', options([['', 'Choose a case…'], ...cases.map(k => [k.id, `#${caseNo(k)} · ${clientNameOf(k)} · ${k.title}`])], ''))}
      </div>
      <div class="fld-grid">
        <div class="fld"><label class="fld-label" for="bDate">${esc(group.date)}</label><input id="bDate" type="datetime-local" class="control"></div>
        <div class="fld"><label class="fld-label" for="bQty">${esc(group.qty)}</label><input id="bQty" type="number" min="1" step="1" value="2" class="control"></div>
      </div>
      <div class="fld-grid">
        <div class="fld"><label class="fld-label" for="bPrice">Price (₪)</label><input id="bPrice" type="number" min="0" step="1" class="control" placeholder="0"></div>
        <div class="fld"><label class="fld-label" for="bInvoice">Invoice number</label><input id="bInvoice" class="control" autocomplete="off" placeholder="Leave empty until it arrives"></div>
      </div>
      <p class="form-error hidden" id="bookingError" role="alert"></p>
      <div class="form-actions">
        <button type="button" class="btn btn-secondary btn-md" data-action="close-sheet">Cancel</button>
        <button type="submit" class="btn btn-primary btn-md">${icon('plus')}Add booking</button>
      </div>
    </form>`, {
    label: `Add booking with ${supplier.name}`,
    onMount(sheet) {
      const caseSelect = sheet.querySelector('#bCase');
      const dateInput = sheet.querySelector('#bDate');
      // The booking's date starts as the case's requested date.
      caseSelect.addEventListener('change', () => {
        const kase = findCase(caseSelect.value);
        if (kase && kase.dueAt) dateInput.value = toLocalInputValue(new Date(kase.dueAt));
      });
      sheet.querySelector('#bookingForm').addEventListener('submit', e => {
        e.preventDefault();
        const qty = Number(sheet.querySelector('#bQty').value);
        const price = Number(sheet.querySelector('#bPrice').value || 0);
        const problem = !caseSelect.value ? 'Choose the case this booking is for.'
          : !(qty >= 1) ? `Enter how many ${group.qty.toLowerCase()}.`
            : price < 0 ? 'The price can’t be negative.' : '';
        if (problem) {
          const errorEl = sheet.querySelector('#bookingError');
          errorEl.textContent = problem;
          errorEl.classList.remove('hidden');
          return;
        }
        addBooking({
          supplierId,
          caseId: caseSelect.value,
          date: dateInput.value ? new Date(dateInput.value).toISOString() : null,
          qty,
          price,
          invoice: sheet.querySelector('#bInvoice').value,
        });
        closeSheet();
        render();
        toast(`Booking added with ${supplier.name}`);
      });
      caseSelect.focus();
    },
  });
}

// ---------- Settings ----------
const EMOJIS = [
  '🛎️', '🎩', '✈️', '🍷', '🌴', '⭐', '🦋', '🌙', '🗝️', '🥂', '💎', '🌸',
  '🌍', '🏝️', '🛥️', '🏨', '🍾', '🎭', '🎟️', '🍣', '☕', '🚗', '🚁', '🌺',
  '🦁', '🐬', '🔥', '⚡', '🎯', '👑', '🌈', '🍀', '🎵', '💼', '🧳', '🏆',
];

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

// Also read by app.html's <head> so dark mode is on before the first paint.
const THEME_KEY = 'gustavo_theme';

// Applies the signed-in member's background colour and light/dark mode to the whole app.
function applyTheme() {
  const me = findMember(ME);
  const bg = bgThemeOf(me);
  const dark = Boolean(me && me.dark);
  document.body.classList.remove(...BG_THEMES.map(t => `bg-${t.id}`));
  if (bg) document.body.classList.add(`bg-${bg}`);
  document.documentElement.classList.toggle('dark', dark);
  document.querySelectorAll('[data-dark-toggle]').forEach(el => {
    el.innerHTML = icon(dark ? 'sun' : 'moon');
    el.setAttribute('aria-pressed', String(dark));
  });
  try {
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
  } catch {
    // Without storage the page just starts light, then switches.
  }
}

function setDark(dark) {
  updateMember(ME, { dark });
  applyTheme();
  render();
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
          <div><b>Appearance</b><p>Light or dark mode for the whole app.</p></div>
          <div class="pills" role="group" aria-label="Appearance">
            <button type="button" class="${me.dark ? '' : 'active'}" data-action="light-mode">${icon('sun')}Light</button>
            <button type="button" class="${me.dark ? 'active' : ''}" data-action="dark-mode">${icon('moon')}Dark</button>
          </div>
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
  const custom = HEX_COLOR.test(me.color || '') ? me.color : '';
  const tone = custom ? null : toneOf(me, ME);
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
        <span class="fld-label">Solid</span>
        <div class="tone-row">
          ${[10, 11, 12, 13, 14].map(t => `<button type="button" class="tone-${t}${t === tone ? ' active' : ''}" data-tone="${t}" aria-label="Solid colour ${t - 9}"></button>`).join('')}
        </div>
      </div>
      <div class="fld">
        <span class="fld-label">Gradient</span>
        <div class="tone-row">
          ${[5, 6, 7, 8, 9].map(t => `<button type="button" class="tone-${t}${t === tone ? ' active' : ''}" data-tone="${t}" aria-label="Gradient ${t - 4}"></button>`).join('')}
        </div>
      </div>
      <div class="fld">
        <span class="fld-label">Any colour</span>
        <label class="color-pick${custom ? ' active' : ''}">
          <input type="color" id="pColor" value="${custom || '#7b61ff'}">
          <span>${custom ? `Your colour · ${custom.toUpperCase()}` : 'Pick any colour'}</span>
        </label>
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
        else if (b.dataset.tone) apply({ tone: Number(b.dataset.tone), color: null });
        else apply({ emoji: null, photo: null });
      });
      // "change" fires once the picker closes, so the sheet isn't redrawn mid-pick.
      sheet.querySelector('#pColor').addEventListener('change', e => apply({ color: e.target.value }));
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
// Reopens the sheet a case was opened from (a calendar day), for the case's back button.
let sheetBack = null;
// The case or calendar day that's open, so a refresh can bring it back.
let currentSheet = null;

// `full` fills the screen (a case); otherwise it's a drawer from the side.
function openSheet(html, { label = '', onMount, full = false } = {}) {
  if (!sheetRoot.contains(document.activeElement)) lastFocus = document.activeElement;
  openCaseId = null;
  sheetBack = null;
  currentSheet = null;
  sheetRoot.innerHTML = `
    <div class="sheet-overlay${full ? ' full' : ''}">
      <div class="sheet${full ? ' case-full' : ''}" role="dialog" aria-modal="true" aria-label="${esc(label)}">${html}</div>
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
  sheetBack = null;
  currentSheet = null;
  document.body.classList.remove('sheet-open');
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}

// `ic` is an icon name, or ready markup (a case's request picture).
function sheetHead(ic, eyebrow, title, extra = '') {
  return `
    <div class="sheet-head">
      <span class="sheet-tile">${ic.startsWith('<') ? ic : icon(ic)}</span>
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
      ${caseChip(kase)}
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
            <label class="search lg">${icon('search')}<input id="pSearch" autocomplete="off" placeholder="e.g. Omer, C-2004, G-1006, +972 50…" value="${esc(query)}"></label>
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
        <div class="client-card-name">${esc(client.name)}${flag(client.country)} ${tierTag(client.tier)}</div>
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
      ${requesterFields(draft.requester)}
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
      <div class="fld-grid">
        <div class="fld">
          <label class="fld-label" for="fLocation">Location</label>
          ${selectWrap('fLocation', options([['', 'Not set'], ...COUNTRIES], draft.location || ''))}
        </div>
        <div class="fld">
          <label class="fld-label" for="fBudget">Budget</label>
          <div class="budget-row">
            <input id="fBudget" type="number" min="0" step="1" class="control" placeholder="0" value="${esc(draft.budget || '')}">
            ${segRadio('currency', CURRENCIES.map(c => ({ id: c, label: c })), draft.currency || '₪')}
          </div>
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
    requester: readRequester(viewEl),
    location: viewEl.querySelector('#fLocation').value,
    budget: viewEl.querySelector('#fBudget').value,
    currency: form.currency.value,
  });
  bindRequesterFields(viewEl);

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
    const problem = !v.clientId ? 'Choose a client for this file.'
      : v.requester && !v.requester.name ? 'Enter the name of the person who opened the case.'
        : !v.title.trim() ? 'Describe what the client needs.' : '';
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
      requester: v.requester,
      location: v.location,
      budget: Number(v.budget) > 0 ? { amount: Number(v.budget), currency: v.currency } : null,
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
        <input id="cName" class="control" autocomplete="off" placeholder="e.g. Yael Mizrahi">
      </div>
      <div class="fld-grid">
        <div class="fld"><label class="fld-label" for="cPhone">Phone</label><input id="cPhone" class="control" type="tel" autocomplete="off"></div>
        <div class="fld"><label class="fld-label" for="cEmail">Email</label><input id="cEmail" class="control" type="email" autocomplete="off"></div>
      </div>
      <div class="fld">
        <label class="fld-label" for="cCountry">Country</label>
        ${selectWrap('cCountry', options([['', 'Choose a country…'], ...COUNTRIES], ''))}
      </div>
      <div class="fld"><span class="fld-label">Gender</span>${segRadio('gender', [{ id: '', label: 'Not set' }, ...GENDERS], '')}</div>
      <div class="fld"><span class="fld-label">Card type</span>${segRadio('tier', TIERS.map(t => ({ id: t, label: t })), 'Standard')}</div>
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
          country: sheet.querySelector('#cCountry').value,
          gender: form.gender.value,
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
// Phone and email of the client (or whoever opened the case for them), each with its action.
function contactRows(person, kase) {
  const tel = person.phone ? person.phone.replace(/[^\d+]/g, '') : '';
  const mail = person.email ? caseMailto(kase, person.email) : '';
  return `
    <div class="contact-rows">
      <div class="contact-row">
        <span class="contact-icon">${icon('phone')}</span>
        ${person.phone ? `<a class="contact-value" href="tel:${esc(tel)}">${esc(person.phone)}</a>` : '<span class="contact-value muted">No phone</span>'}
        ${person.phone ? `<a class="btn-email" href="tel:${esc(tel)}">${icon('phone')}Call</a>` : ''}
      </div>
      <div class="contact-row">
        <span class="contact-icon">${icon('mail')}</span>
        ${person.email ? `<a class="contact-value" href="${esc(mail)}">${esc(person.email)}</a>` : '<span class="contact-value muted">No email</span>'}
        ${person.email ? `<a class="btn-email send" href="${esc(mail)}" title="Email about #${caseNo(kase)}">${icon('mail')}Send email</a>` : ''}
      </div>
    </div>`;
}

// ---------- A case, full screen ----------
// Laid out like the sketch: New case / My cases / All cases along the top, the case box and the
// client box on the left, the follow-ups on the right.

// When a case last changed, and who changed it: its newest follow-up or logged event.
function lastUpdateInfo(kase) {
  let last = { at: kase.createdAt, by: kase.createdBy };
  for (const u of kase.updates) if (u.at > last.at) last = u;
  for (const e of db.activity) if (e.caseId === kase.id && e.at > last.at) last = e;
  return last;
}

function rankBadge(tier) {
  return `<span class="rank-badge tier-${esc((tier || 'Standard').toLowerCase())}">${icon('shield')}${esc(tier || 'Standard')}</span>`;
}

const GENDERS = [{ id: 'female', label: 'Female' }, { id: 'male', label: 'Male' }];
const CURRENCIES = ['₪', '$', '€', '£'];

function budgetText(budget) {
  if (!budget || !budget.amount) return '';
  return `${budget.currency || ''}${Number(budget.amount).toLocaleString('en')}`;
}

function caseWindowTop(actions = '') {
  return `
    <header class="cw-top">
      <nav class="cw-nav" aria-label="Cases">
        <button type="button" class="cw-nav-btn primary" data-action="new-file">${icon('plus')}New case</button>
        <button type="button" class="cw-nav-btn" data-action="go-mine">${icon('briefcase')}My cases</button>
        <button type="button" class="cw-nav-btn" data-action="go-all">${icon('layers')}All cases</button>
      </nav>
      ${actions ? `<div class="cf-head-actions">${actions}</div>` : ''}
    </header>`;
}

// The case: file ID, reminder, status and supplier; the description; date and location; what they need and the budget.
function caseBox(kase) {
  const client = findClient(kase.clientId);
  const kind = requestKind(kase);
  const d = kase.dueAt ? new Date(kase.dueAt) : null;
  const late = isOpen(kase) && d && d < new Date();
  const bookings = db.bookings.filter(b => b.caseId === kase.id);
  const suppliers = [...new Set(bookings.map(b => (findSupplier(b.supplierId) || {}).name).filter(Boolean))];
  const country = COUNTRIES.find(([c]) => c === kase.location);
  const reminders = db.reminders.filter(r => r.caseId === kase.id && !r.done).sort((a, b) => a.at.localeCompare(b.at));
  const last = lastUpdateInfo(kase);
  const budget = budgetText(kase.budget);
  const handler = kase.assignee
    ? `${memberAvatar(kase.assignee, 'xs')}${esc(memberName(kase.assignee))}`
    : '<span class="muted">Open pool</span>';

  return `
    <section class="cw-box cw-case" aria-label="Case">
      <div class="cw-case-top">
        <div class="cw-field"><span class="cw-label">File ID</span>${caseChip(kase, 'lg')}</div>
        <button type="button" class="btn-email" data-reminder-toggle>${icon('clock')}Add reminder</button>
        <div class="cw-field cw-status">
          <span class="cw-label">File status</span>
          <select class="status-select st-${kase.status}" data-case-status aria-label="File status">
            ${STATUSES.map(s => `<option value="${s.id}"${s.id === kase.status ? ' selected' : ''}>${esc(s.label)}</option>`).join('')}
          </select>
          ${suppliers.length ? `<span class="cw-supplier">${icon('store')}${esc(suppliers.join(', '))}</span>` : ''}
        </div>
      </div>

      <form class="cw-reminder" data-reminder-form hidden>
        <input class="control" data-reminder-text aria-label="Reminder" value="${esc(`Follow up on #${caseNo(kase)}${client ? ` with ${firstName(client.name)}` : ''}`)}">
        <input class="control" type="datetime-local" data-reminder-at aria-label="When" value="${esc(defaultDue())}">
        <div class="form-actions">
          <button type="button" class="btn btn-secondary btn-md" data-reminder-cancel>Cancel</button>
          <button type="submit" class="btn btn-primary btn-md">${icon('check')}Save reminder</button>
        </div>
      </form>
      ${reminders.length ? `
        <ul class="cw-reminders">
          ${reminders.map(r => `
            <li class="${isPast(r.at) ? 'overdue' : ''}">
              ${icon('clock')}<b>${esc(fmtDayTime(r.at))}</b><span>${esc(r.text)}</span>
              <button type="button" class="icon-btn sm" data-reminder-done="${r.id}" aria-label="Mark reminder done" title="Done">${icon('check')}</button>
            </li>`).join('')}
        </ul>` : ''}

      <div class="cw-block" data-case-view>
        <div class="cw-label-row">
          <span class="cw-label">General description</span>
          <button type="button" class="link-btn" data-case-edit>${icon('pencil')}Edit case</button>
        </div>
        <p class="cf-desc">${kase.details ? esc(kase.details) : '<span class="muted">No description yet. Edit the case to add what the client asked for.</span>'}</p>
      </div>

      <div class="cw-facts" data-case-view>
        <div class="cw-field cw-date${late ? ' overdue' : !isOpen(kase) ? ' done' : ''}">
          <span class="cw-label">${esc(kind.date)}</span>
          <b>${esc(d ? `${longDayFmt.format(d)}, ${timeFmt.format(d)}` : 'No date')}</b>
          ${d ? `<small>${esc(dueCountdown(kase).text)}</small>` : ''}
        </div>
        <div class="cw-field">
          <span class="cw-label">Location</span>
          <b class="cw-location">${country ? `${flag(kase.location)}${esc(country[1])}` : '<span class="muted">Not set</span>'}</b>
        </div>
      </div>

      <div class="cw-request" data-case-view>
        <span class="cw-request-pic" aria-hidden="true">${kind.icon}</span>
        <div class="cw-request-main">
          <b class="cw-request-title">${esc(kase.title)}</b>
          <span class="cw-request-tags">${hashtag(kase.category)}${kind.label ? `<span class="kind-badge">${esc(kind.label)}</span>` : ''}${hotTag(kase.priority, 'sm')}</span>
        </div>
        <div class="cw-field cw-budget"><span class="cw-label">Budget</span><b>${budget ? esc(budget) : '<span class="muted">Not set</span>'}</b></div>
      </div>

      <form class="cw-edit form" data-case-edit-form hidden>
        <div class="fld">
          <label class="fld-label" for="ceTitle">What they need</label>
          <input id="ceTitle" class="control" autocomplete="off" value="${esc(kase.title)}" placeholder="e.g. 5 tickets for Harry Styles">
        </div>
        <div class="fld-grid">
          <div class="fld"><label class="fld-label" for="ceDue">${esc(kind.date)}</label><input id="ceDue" type="datetime-local" class="control" value="${esc(d ? toLocalInputValue(d) : '')}"></div>
          <div class="fld"><label class="fld-label" for="ceLocation">Location</label>${selectWrap('ceLocation', options([['', 'Not set'], ...COUNTRIES], kase.location || ''))}</div>
        </div>
        <div class="fld-grid">
          <div class="fld"><label class="fld-label" for="ceBudget">Budget</label><input id="ceBudget" type="number" min="0" step="1" class="control" value="${esc(kase.budget ? kase.budget.amount : '')}" placeholder="0"></div>
          <div class="fld"><span class="fld-label">Currency</span>${segRadio('ceCurrency', CURRENCIES.map(c => ({ id: c, label: c })), (kase.budget && kase.budget.currency) || '₪')}</div>
        </div>
        <div class="fld">
          <label class="fld-label" for="ceDetails">General description</label>
          <textarea id="ceDetails" class="control" rows="4">${esc(kase.details)}</textarea>
        </div>
        <p class="form-error hidden" data-case-edit-error role="alert"></p>
        <div class="form-actions">
          <button type="button" class="btn btn-secondary btn-md" data-case-edit-cancel>Cancel</button>
          <button type="submit" class="btn btn-primary btn-md">${icon('check')}Save</button>
        </div>
      </form>

      <dl class="cw-meta">
        <div><dt>Handled by</dt><dd>${handler}</dd></div>
        <div><dt>Came in by</dt><dd>${channelTag(kase.channel, 'sm')}</dd></div>
        <div><dt>Created by</dt><dd>${memberAvatar(kase.createdBy, 'xs')}${esc(memberName(kase.createdBy))} · ${esc(fmtDayTime(kase.createdAt))}</dd></div>
        <div><dt>Last updated</dt><dd>${memberAvatar(last.by, 'xs')}${esc(memberName(last.by))} · ${esc(fmtDayTime(last.at))}</dd></div>
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
    </section>`;
}

// The client: name, gender and card type; ID; phone and email; the secondary contact; notes.
function clientBox(kase) {
  const client = findClient(kase.clientId);
  if (!client) return '';
  const req = kase.requester;
  const gender = GENDERS.find(g => g.id === client.gender);
  const clientCases = db.cases.filter(k => k.clientId === client.id);
  return `
    <section class="cw-box cw-client" aria-label="Client">
      <div class="cw-client-top">
        <div class="cw-field cw-client-name">
          <span class="cw-label">Client name</span>
          <b>${esc(client.name)}${flag(client.country)}</b>
        </div>
        <div class="cw-field"><span class="cw-label">Gender</span><b>${gender ? esc(gender.label) : '<span class="muted">Not set</span>'}</b></div>
        <div class="cw-field"><span class="cw-label">Card type</span>${rankBadge(client.tier)}</div>
      </div>
      <div class="cw-client-ids">
        <div class="cw-field"><span class="cw-label">ID</span>${idChip(clientNo(client))}</div>
        <div class="cw-field"><span class="cw-label">Cases</span><b>${clientCases.filter(isOpen).length} open · ${clientCases.length} in total</b></div>
      </div>
      ${contactRows(client, kase)}
      <div class="cw-block">
        <div class="cw-label-row">
          <span class="cw-label">Secondary contact</span>
          <button type="button" class="link-btn" data-action="edit-requester" data-case-id="${kase.id}">${icon('pencil')}${req ? 'Change' : 'Add'}</button>
        </div>
        ${req ? `
          <div class="opened-by-person">
            ${avatar(req.name, req.name, 'sm')}
            <span class="hit-main"><span class="hit-name">${esc(req.name)}</span><span class="hit-sub">Opened this case for ${esc(firstName(client.name))}</span></span>
          </div>
          ${contactRows(req, kase)}` : '<p class="cw-none">None. The client opened this case themselves.</p>'}
      </div>
      <div class="cw-block">
        <span class="cw-label">Client notes</span>
        <p class="cw-notes">${client.notes ? esc(client.notes) : '<span class="muted">No notes.</span>'}</p>
      </div>
    </section>`;
}

function caseWindowBody(kase) {
  return `
    <div class="cw-body">
      <div class="cw-left">${caseBox(kase)}${clientBox(kase)}</div>
      ${caseChat(kase)}
    </div>`;
}

// ---------- Follow-ups as a chat ----------
// Follow-ups are the messages; the case's own events (opened, assigned, status changes) sit between them.
function caseChatItems(kase) {
  const events = db.activity
    .filter(e => e.caseId === kase.id && e.type !== 'note_added')
    .map(e => ({ kind: 'event', at: e.at, event: e }));
  const notes = kase.updates.map(u => ({ kind: 'note', at: u.at, by: u.by, text: u.text }));
  return [...events, ...notes].sort((a, b) => a.at.localeCompare(b.at));
}

function chatEventText(e) {
  const who = memberName(e.by);
  const to = e.to === ME ? 'you' : memberName(e.to);
  switch (e.type) {
    case 'case_created': return `${who} opened the case`;
    case 'case_assigned': return `${who} assigned it to ${to}`;
    case 'case_taken': return `${who} took the case`;
    case 'case_unassigned': return `${who} moved it to the open pool`;
    case 'status_changed': return `${who} changed the status: ${labelOf(STATUSES, e.from)} → ${labelOf(STATUSES, e.to)}`;
    default: return who;
  }
}

// What "done" sounds like for each kind of request.
const DONE_REPLIES = {
  Tickets: 'Tickets sent to the client ✓',
  Events: 'Tickets sent to the client ✓',
  Transfers: 'Driver details sent to the client ✓',
  Restaurant: 'Table confirmed, details sent to the client ✓',
  Flights: 'Flight booked, details sent to the client ✓',
  Hotel: 'Booking confirmed and sent to the client ✓',
  Yacht: 'Charter confirmed, details sent to the client ✓',
  Massage: 'Appointment confirmed with the client ✓',
};

// Ready-made follow-ups; the ones with a status also move the case there when sent.
function quickReplies(kase) {
  return [
    { text: 'Working on it', status: 'in_progress' },
    { text: 'Called the client, no answer', status: null },
    { text: 'Sent options to the client, waiting for their answer', status: 'waiting_client' },
    { text: 'Asked the supplier, waiting for confirmation', status: 'waiting_provider' },
    { text: DONE_REPLIES[kase.category] || 'Done and confirmed with the client ✓', status: 'done' },
  ].filter(r => !r.status || r.status !== kase.status);
}

function caseChat(kase) {
  let lastDay = '';
  const log = caseChatItems(kase).map(item => {
    const day = dayLabel(item.at);
    const sep = day !== lastDay ? `<div class="chat-day"><span>${esc(day)}</span></div>` : '';
    lastDay = day;
    const time = esc(timeFmt.format(new Date(item.at)));
    if (item.kind === 'event') return `${sep}<div class="chat-event">${esc(chatEventText(item.event))} · ${time}</div>`;
    const mine = item.by === ME;
    return `${sep}
      <div class="chat-msg${mine ? ' mine' : ''}">
        ${mine ? '' : memberAvatar(item.by, 'sm')}
        <div class="chat-bubble">
          ${mine ? '' : `<span class="chat-name">${esc(memberName(item.by))}</span>`}
          <p>${esc(item.text)}</p>
          <span class="chat-time">${time}</span>
        </div>
      </div>`;
  }).join('');
  return `
    <section class="case-chat" aria-label="Follow-ups">
      <header class="chat-head">${icon('layers')}<h3>Follow-ups</h3><span class="count-badge">${kase.updates.length}</span><button type="button" class="btn btn-primary btn-md chat-add" data-chat-focus>${icon('plus')}Add new</button></header>
      <div class="chat-log" data-chat-log>${log}${kase.updates.length ? '' : '<div class="chat-empty">No follow-ups yet. Write the first one below, or pick a ready one.</div>'}</div>
      <form class="chat-form" data-chat-form>
        <div class="chat-replies" role="group" aria-label="Ready follow-ups">
          ${quickReplies(kase).map((r, i) => `<button type="button" class="chat-reply" data-reply="${i}">${esc(r.text)}${r.status ? `<span class="chat-reply-status">→ ${esc(labelOf(STATUSES, r.status))}</span>` : ''}</button>`).join('')}
        </div>
        <div class="chat-pending" hidden></div>
        <div class="chat-input">
          <textarea rows="1" placeholder="Write a follow-up… Enter sends" aria-label="Follow-up"></textarea>
          <button type="submit" class="chat-send" aria-label="Send">${icon('send')}</button>
        </div>
      </form>
    </section>`;
}

function bindCaseChat(root, kase, rerender) {
  const form = root.querySelector('[data-chat-form]');
  const box = form.querySelector('textarea');
  const pending = form.querySelector('.chat-pending');
  const replies = quickReplies(kase);
  let status = null;

  // Grows with what you type, up to a few lines.
  const grow = () => {
    box.style.height = 'auto';
    box.style.height = `${Math.min(box.scrollHeight, 160)}px`;
  };
  const setPending = next => {
    status = next;
    pending.hidden = !next;
    pending.innerHTML = next
      ? `Sending also moves the case to <b>${esc(labelOf(STATUSES, next))}</b> <button type="button" class="link-btn" data-pending-clear>Keep the status</button>`
      : '';
  };

  form.querySelectorAll('[data-reply]').forEach(btn => {
    btn.addEventListener('click', () => {
      const reply = replies[Number(btn.dataset.reply)];
      box.value = reply.text;
      setPending(reply.status);
      grow();
      box.focus();
    });
  });
  pending.addEventListener('click', e => {
    if (e.target.closest('[data-pending-clear]')) setPending(null);
  });
  box.addEventListener('input', grow);
  box.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const text = box.value.trim();
    if (!text) return;
    addCaseUpdate(kase.id, text, ME);
    if (status) setCaseStatus(kase.id, status, ME);
    rerender();
    toast(status ? `Follow-up added · ${labelOf(STATUSES, status)}` : 'Follow-up added');
  });

  // Open on the newest message.
  const log = root.querySelector('[data-chat-log]');
  log.scrollTop = log.scrollHeight;
}

function bindCaseView(root, kase, rerender) {
  root.querySelector('[data-case-status]').addEventListener('change', e => {
    setCaseStatus(kase.id, e.target.value, ME);
    rerender();
    toast(`${caseNo(kase)} moved to ${labelOf(STATUSES, e.target.value)}`);
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

  // Edit case: the description, date, location, headline and budget swap for a form.
  const views = root.querySelectorAll('[data-case-view]');
  const editForm = root.querySelector('[data-case-edit-form]');
  const editing = on => {
    views.forEach(v => { v.hidden = on; });
    editForm.hidden = !on;
    if (on) editForm.querySelector('#ceTitle').focus();
  };
  root.querySelector('[data-case-edit]').addEventListener('click', () => editing(true));
  editForm.querySelector('[data-case-edit-cancel]').addEventListener('click', () => editing(false));
  editForm.addEventListener('submit', e => {
    e.preventDefault();
    const title = editForm.querySelector('#ceTitle').value.trim();
    if (!title) {
      const errorEl = editForm.querySelector('[data-case-edit-error]');
      errorEl.textContent = 'Write what the client needs.';
      errorEl.classList.remove('hidden');
      return;
    }
    const due = editForm.querySelector('#ceDue').value;
    const amount = Number(editForm.querySelector('#ceBudget').value);
    updateCaseInfo(kase.id, {
      title,
      dueAt: due ? new Date(due).toISOString() : null,
      location: editForm.querySelector('#ceLocation').value,
      budget: amount > 0 ? { amount, currency: editForm.ceCurrency.value } : null,
      details: editForm.querySelector('#ceDetails').value.trim(),
    });
    rerender();
    toast('Case saved');
  });

  // Reminders for this case, which also show in your Reminders.
  const reminderForm = root.querySelector('[data-reminder-form]');
  root.querySelector('[data-reminder-toggle]').addEventListener('click', () => {
    reminderForm.hidden = !reminderForm.hidden;
    if (!reminderForm.hidden) reminderForm.querySelector('[data-reminder-text]').focus();
  });
  reminderForm.querySelector('[data-reminder-cancel]').addEventListener('click', () => { reminderForm.hidden = true; });
  reminderForm.addEventListener('submit', e => {
    e.preventDefault();
    const text = reminderForm.querySelector('[data-reminder-text]').value;
    const at = reminderForm.querySelector('[data-reminder-at]').value;
    if (!text.trim() || !at) return;
    addReminder(text, new Date(at).toISOString(), ME, kase.id);
    rerender();
    toast(`Reminder set for ${fmtDayTime(new Date(at).toISOString())}`);
  });
  root.querySelectorAll('[data-reminder-done]').forEach(btn => {
    btn.addEventListener('click', () => {
      toggleReminder(btn.dataset.reminderDone);
      rerender();
      toast('Reminder done');
    });
  });

  bindCaseChat(root, kase, rerender);
  const chatBox = root.querySelector('[data-chat-form] textarea');
  root.querySelector('[data-chat-focus]').addEventListener('click', () => chatBox.focus());
}

// Who opened the case: the client, or someone for them (with their phone and email).
function requesterFields(req) {
  return `
    <div class="fld">
      <span class="fld-label">Opened by</span>
      ${segRadio('reqWho', [{ id: 'client', label: 'The client' }, { id: 'other', label: 'Someone else' }], req ? 'other' : 'client')}
    </div>
    <div class="requester-fields"${req ? '' : ' hidden'}>
      <div class="fld">
        <label class="fld-label" for="rqName">Their name</label>
        <input id="rqName" class="control" autocomplete="off" placeholder="e.g. Roni Cohen" value="${esc(req ? req.name : '')}">
      </div>
      <div class="fld-grid">
        <div class="fld"><label class="fld-label" for="rqPhone">Their phone</label><input id="rqPhone" class="control" type="tel" autocomplete="off" value="${esc(req ? req.phone : '')}"></div>
        <div class="fld"><label class="fld-label" for="rqEmail">Their email</label><input id="rqEmail" class="control" type="email" autocomplete="off" value="${esc(req ? req.email : '')}"></div>
      </div>
    </div>`;
}

function bindRequesterFields(root) {
  const fields = root.querySelector('.requester-fields');
  root.querySelectorAll('input[name="reqWho"]').forEach(input => {
    input.addEventListener('change', () => {
      fields.hidden = input.value !== 'other';
      if (!fields.hidden) fields.querySelector('#rqName').focus();
    });
  });
}

// null when the client opened it; otherwise what was typed (the name may still be empty).
function readRequester(root) {
  const other = (root.querySelector('input[name="reqWho"]:checked') || {}).value === 'other';
  if (!other) return null;
  return {
    name: root.querySelector('#rqName').value.trim(),
    phone: root.querySelector('#rqPhone').value.trim(),
    email: root.querySelector('#rqEmail').value.trim(),
  };
}

function openRequesterSheet(caseId) {
  const kase = findCase(caseId);
  if (!kase) return;
  // Coming back to the case keeps the case's own back button (to a calendar day, say).
  const caseBack = sheetBack;
  const backToCase = () => {
    if (state.route.name === 'case') {
      closeSheet();
      render();
      return;
    }
    sheetBack = caseBack;
    openCaseSheet(caseId);
  };
  openSheet(`
    ${sheetHead('user', caseChip(kase), 'Secondary contact', backButton())}
    <form class="form" id="requesterForm" novalidate>
      ${requesterFields(kase.requester)}
      <p class="form-error hidden" id="requesterError" role="alert"></p>
      <div class="form-actions">
        <button type="button" class="btn btn-secondary btn-md" data-action="sheet-back">Cancel</button>
        <button type="submit" class="btn btn-primary btn-md">${icon('check')}Save</button>
      </div>
    </form>`, {
    label: 'Who opened this case',
    onMount(sheet) {
      bindRequesterFields(sheet);
      sheet.querySelector('#requesterForm').addEventListener('submit', e => {
        e.preventDefault();
        const req = readRequester(sheet);
        if (req && !req.name) {
          const errorEl = sheet.querySelector('#requesterError');
          errorEl.textContent = 'Enter the name of the person who opened the case.';
          errorEl.classList.remove('hidden');
          return;
        }
        setRequester(caseId, req);
        backToCase();
        toast(req ? `Opened by ${req.name}` : 'Opened by the client');
      });
    },
  });
  sheetBack = backToCase;
}

// Opening a case fills the screen: the case and client boxes on the left, the follow-ups on the right.
function openCaseSheet(id) {
  const kase = findCase(id);
  if (!kase) return;
  const back = sheetBack;
  // Redrawing the same case keeps the left column where it was scrolled to.
  const oldLeft = openCaseId === id ? sheetRoot.querySelector('.cw-left') : null;
  const keepTop = oldLeft ? oldLeft.scrollTop : 0;
  const actions = `
    ${back ? `<button type="button" class="square-btn back" data-action="sheet-back" aria-label="Back" title="Back">${icon('arrowRight')}</button>` : ''}
    <a class="square-btn" href="app.html#/case/${kase.id}" target="_blank" aria-label="Open in a new tab" title="Open in a new tab">${icon('arrowUpRight')}</a>
    <button type="button" class="square-btn" data-action="close-sheet" aria-label="Close" title="Close">${icon('x')}</button>`;
  openSheet(`${caseWindowTop(actions)}${caseWindowBody(kase)}`, {
    label: `Case ${caseNo(kase)}`,
    full: true,
    onMount(sheet) {
      bindCaseView(sheet, kase, () => {
        render();
        openCaseSheet(kase.id);
      });
      sheet.querySelector('.cw-left').scrollTop = keepTop;
    },
  });
  openCaseId = kase.id;
  sheetBack = back;
  currentSheet = { type: 'case', id: kase.id };
}

function renderCasePage(id) {
  const kase = findCase(id);
  if (!kase) {
    viewEl.innerHTML = `
      <a class="back-link" href="#/home">${icon('arrowRight')}My dashboard</a>
      <div class="empty">This case doesn't exist, or it was removed.</div>`;
    return;
  }
  viewEl.innerHTML = `
    <div class="case-full page">
      ${caseWindowTop()}
      ${caseWindowBody(kase)}
    </div>`;
  bindCaseView(viewEl, kase, () => renderCasePage(id));
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
  const el = e.target.closest('[data-copy],[data-take],[data-case],[data-client],[data-view],[data-fview],[data-day],[data-expand],[data-sgroup],[data-supplier],[data-open-supplier],[data-shortcut],[data-fset],[data-atab],[data-range],[data-logtype],[data-bg],[data-stop],[data-action]');
  if (!el || el.tagName === 'SELECT' || el.dataset.stop !== undefined) return;
  if (el.dataset.copy) return copyId(el.dataset.copy);
  if (el.dataset.take) return takeCase(el.dataset.take);
  if (el.dataset.sgroup) {
    state.suppliers = { group: el.dataset.sgroup, id: '' };
    return render();
  }
  if (el.dataset.supplier) {
    state.suppliers.id = el.dataset.supplier;
    return render();
  }
  if (el.dataset.openSupplier) {
    // From a case: the link goes to Suppliers, showing this supplier.
    const supplier = findSupplier(el.dataset.openSupplier);
    if (supplier) state.suppliers = { group: supplier.group, id: supplier.id };
    if (state.route.name === 'suppliers') {
      closeSheet();
      render();
    }
    return;
  }
  if (el.dataset.day) return openDaySheet(el.dataset.day);
  if (el.dataset.expand) {
    // Open or close one bar in place, without redrawing the list.
    const id = el.dataset.expand;
    if (expandedCases.has(id)) expandedCases.delete(id);
    else expandedCases.add(id);
    const bar = el.closest('.case-bar');
    bar.outerHTML = caseCard(findCase(id), bar.dataset.listKey);
    return;
  }
  if (el.dataset.fview) {
    // A new view starts without the previous view's filters.
    Object.assign(state.files, { view: el.dataset.fview, name: '', from: '', to: '', type: '', priority: '', date: '', text: '' });
    return render();
  }
  if (el.dataset.bg !== undefined) {
    updateMember(ME, { bg: Number(el.dataset.bg) });
    applyTheme();
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
    case 'search-all': return openSearchTab(document.getElementById('quickInput').value.trim());
    case 'open-reminders': return openRemindersSheet();
    case 'open-notes': return openNotesSheet();
    case 'light-mode': return setDark(false);
    case 'dark-mode': return setDark(true);
    case 'toggle-dark': return setDark(!(findMember(ME) || {}).dark);
    case 'advanced-search': return openAdvancedSearch();
    case 'add-client': return openAddClientSheet();
    case 'edit-avatar': return openAvatarSheet();
    case 'close-sheet': return closeSheet();
    case 'sheet-back': return sheetBack && sheetBack();
    case 'show-files':
      state.dash = 'files';
      Object.assign(state.files, { view: 'calendar', name: '', from: '', to: '', type: '', priority: '', date: '', text: '' });
      return render();
    case 'my-dashboard':
      // The link itself goes to #/home; already there, just switch back to My cases.
      state.dash = 'mine';
      if (state.route.name === 'home') render();
      return;
    case 'cal-today': return scrollCalendarToToday(true);
    case 'go-mine':
    case 'go-all':
      // From a case window: back to the dashboard, on My cases or on All files' full list.
      state.dash = el.dataset.action === 'go-all' ? 'files' : 'mine';
      if (state.dash === 'files') Object.assign(state.files, { view: 'all', name: '', from: '', to: '', type: '', priority: '', date: '', text: '' });
      closeSheet();
      if (state.route.name === 'home') render();
      else location.hash = '#/home';
      return;
    case 'add-booking': return openBookingSheet(el.dataset.supplierId);
    case 'add-supplier': return openAddSupplierSheet(state.suppliers.group || SUPPLIER_GROUPS[0].id);
    case 'edit-requester': return openRequesterSheet(el.dataset.caseId);
    case 'clear-dates':
      Object.assign(state.files, { from: '', to: '' });
      return render();
    case 'sign-out': return signOut();
    case 'toggle-followup': {
      const form = el.closest('.case-bar').querySelector('[data-followup-form]');
      form.hidden = !form.hidden;
      if (!form.hidden) form.querySelector('input').focus();
      return;
    }
    case 'clear-refine':
      Object.assign(state[el.dataset.key], { type: '', priority: '', date: '', text: '' });
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
  const dateEl = e.target.closest('input[data-fdate]');
  if (dateEl) {
    state.files[dateEl.dataset.fdate] = dateEl.value;
    return render();
  }
});

document.addEventListener('input', e => {
  if (e.target.matches('input[data-fname]')) {
    state.files.name = e.target.value;
    return renderList('files');
  }
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
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role="button"][data-case],[role="button"][data-client],[role="button"][data-expand]')) {
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

// ---------- Staying put across a refresh ----------
// Where you are in this tab (My cases or All files, views and filters, the supplier,
// the open case or calendar day) is kept, so a refresh brings you straight back.
const UI_KEY = 'gustavo_ui';

function saveUi() {
  try {
    sessionStorage.setItem(UI_KEY, JSON.stringify({
      hash: location.hash,
      dash: state.dash,
      home: state.home,
      files: state.files,
      all: state.all,
      suppliers: state.suppliers,
      activityTab: state.activityTab,
      range: state.range,
      logType: state.logType,
      logPerson: state.logPerson,
      sheet: currentSheet,
    }));
  } catch {
    // Without storage a refresh just starts on the dashboard.
  }
}

// Puts the saved state back; returns the sheet to reopen when it's the same page.
function restoreUi() {
  let saved = null;
  try {
    saved = JSON.parse(sessionStorage.getItem(UI_KEY) || 'null');
  } catch {
    return null;
  }
  if (!saved) return null;
  for (const key of ['home', 'files', 'all', 'suppliers']) Object.assign(state[key], saved[key] || {});
  for (const key of ['dash', 'activityTab', 'range', 'logType', 'logPerson']) {
    if (saved[key] !== undefined) state[key] = saved[key];
  }
  return saved.hash === location.hash ? saved.sheet : null;
}

window.addEventListener('pagehide', saveUi);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') saveUi();
});

function init() {
  try {
    const saved = localStorage.getItem(VIEW_KEY);
    if (saved && homeView(saved).id === saved) state.home.view = saved;
  } catch {
    // Start on "All open" when storage is unavailable.
  }
  const sheet = restoreUi();
  document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });
  refreshAvatars();
  applyTheme();
  state.route = parseRoute();
  render();
  if (sheet && sheet.type === 'case') openCaseSheet(sheet.id);
  else if (sheet && sheet.type === 'day') openDaySheet(sheet.key, sheet.dayType || '');
}

if (session) init();
