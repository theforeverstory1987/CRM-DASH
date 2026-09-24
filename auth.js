// Client-side auth for the prototype. There is no server yet, so these
// credentials are visible to anyone who opens this file — replace with a
// real backend before giving the portal to clients.
const USERS = [
  { username: 'admin', password: '12345', name: 'Amit.R', role: 'admin' },
];

const SESSION_KEY = 'crm_session';

function findUser(username, password) {
  const u = username.trim().toLowerCase();
  return USERS.find(user => user.username === u && user.password === password) || null;
}

function getSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function startSession(user, remember) {
  const session = { username: user.username, name: user.name, role: user.role, at: new Date().toISOString() };
  const store = remember ? localStorage : sessionStorage;
  store.setItem(SESSION_KEY, JSON.stringify(session));
}

function endSession() {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY);
}
