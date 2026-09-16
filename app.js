const STORAGE_KEY = 'client_dashboard_v1';

/** @typedef {{id:string,text:string,createdAt:string}} Note */
/** @typedef {{id:string,text:string,dueDate:string,done:boolean,createdAt:string}} Reminder */
/** @typedef {{id:string,name:string,company:string,email:string,phone:string,createdAt:string,notes:Note[],reminders:Reminder[]}} Client */

const state = {
  clients: /** @type {Client[]} */ (loadClients()),
  selectedClientId: /** @type {string|null} */ (null),
  view: 'dashboard',
  search: '',
};

function loadClients() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveClients() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.clients));
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function getClient(id) {
  return state.clients.find(c => c.id === id) || null;
}

function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function fmtDateTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function reminderStatus(reminder) {
  if (reminder.done) return 'done';
  const due = new Date(reminder.dueDate).getTime();
  const now = Date.now();
  const soonThreshold = now + 3 * 24 * 60 * 60 * 1000;
  if (due < now) return 'overdue';
  if (due <= soonThreshold) return 'due-soon';
  return 'upcoming';
}

// ---------- DOM refs ----------
const clientListEl = document.getElementById('clientList');
const clientSearchEl = document.getElementById('clientSearch');
const dashboardView = document.getElementById('dashboardView');
const clientView = document.getElementById('clientView');
const statClients = document.getElementById('statClients');
const statUpcoming = document.getElementById('statUpcoming');
const statOverdue = document.getElementById('statOverdue');
const allRemindersEl = document.getElementById('allReminders');
const noClientSelected = document.getElementById('noClientSelected');
const clientDetail = document.getElementById('clientDetail');
const clientNameEl = document.getElementById('clientName');
const clientMetaEl = document.getElementById('clientMeta');
const notesListEl = document.getElementById('notesList');
const remindersListEl = document.getElementById('remindersList');
const modalRoot = document.getElementById('modalRoot');

// ---------- Rendering ----------
function render() {
  renderClientList();
  renderTabs();
  if (state.view === 'dashboard') {
    dashboardView.classList.remove('hidden');
    clientView.classList.add('hidden');
    renderDashboard();
  } else {
    dashboardView.classList.add('hidden');
    clientView.classList.remove('hidden');
    renderClientDetail();
  }
}

function renderTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === state.view);
  });
}

function renderClientList() {
  const term = state.search.trim().toLowerCase();
  const clients = state.clients
    .filter(c => !term || c.name.toLowerCase().includes(term) || c.company.toLowerCase().includes(term))
    .sort((a, b) => a.name.localeCompare(b.name));

  clientListEl.innerHTML = '';
  if (clients.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'client-list-empty';
    empty.textContent = state.clients.length === 0 ? 'No clients yet.' : 'No matches.';
    clientListEl.appendChild(empty);
    return;
  }

  for (const client of clients) {
    const item = document.createElement('div');
    item.className = 'client-list-item' + (client.id === state.selectedClientId && state.view === 'client' ? ' active' : '');
    item.innerHTML = `
      <div class="client-item-name">${escapeHtml(client.name)}</div>
      <div class="client-item-sub">${escapeHtml(client.company || 'No company')}</div>
    `;
    item.addEventListener('click', () => {
      state.selectedClientId = client.id;
      state.view = 'client';
      render();
    });
    clientListEl.appendChild(item);
  }
}

function renderDashboard() {
  statClients.textContent = String(state.clients.length);

  const allReminders = [];
  for (const client of state.clients) {
    for (const r of client.reminders) {
      allReminders.push({ ...r, clientId: client.id, clientName: client.name });
    }
  }

  const upcoming = allReminders.filter(r => !r.done && reminderStatus(r) === 'due-soon');
  const overdue = allReminders.filter(r => !r.done && reminderStatus(r) === 'overdue');
  statUpcoming.textContent = String(upcoming.length);
  statOverdue.textContent = String(overdue.length);

  allReminders.sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  allRemindersEl.innerHTML = '';
  if (allReminders.length === 0) {
    allRemindersEl.innerHTML = '<div class="list-empty">No reminders yet. Add one from a client\'s page.</div>';
    return;
  }

  for (const reminder of allReminders) {
    allRemindersEl.appendChild(renderReminderItem(reminder, reminder.clientId, true));
  }
}

function renderReminderItem(reminder, clientId, showClientLink) {
  const status = reminderStatus(reminder);
  const item = document.createElement('div');
  item.className = 'reminder-item' + (status === 'overdue' ? ' overdue' : '') + (status === 'due-soon' ? ' due-soon' : '') + (reminder.done ? ' done' : '');

  const main = document.createElement('div');
  main.className = 'reminder-main';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = reminder.done;
  checkbox.addEventListener('change', () => {
    toggleReminderDone(clientId, reminder.id, checkbox.checked);
  });
  main.appendChild(checkbox);

  const textWrap = document.createElement('div');
  const text = document.createElement('div');
  text.className = 'reminder-text';
  text.textContent = reminder.text;
  textWrap.appendChild(text);

  if (showClientLink) {
    const link = document.createElement('div');
    link.className = 'reminder-client-link';
    link.textContent = reminder.clientName;
    link.addEventListener('click', () => {
      state.selectedClientId = clientId;
      state.view = 'client';
      render();
    });
    textWrap.appendChild(link);
  }

  main.appendChild(textWrap);
  item.appendChild(main);

  const right = document.createElement('div');
  right.style.display = 'flex';
  right.style.alignItems = 'center';
  right.style.gap = '10px';

  const due = document.createElement('div');
  due.className = 'reminder-due';
  due.textContent = fmtDateTime(reminder.dueDate);
  right.appendChild(due);

  const actions = document.createElement('div');
  actions.className = 'reminder-actions';
  const delBtn = document.createElement('button');
  delBtn.className = 'icon-btn';
  delBtn.title = 'Delete reminder';
  delBtn.textContent = '✕';
  delBtn.addEventListener('click', () => deleteReminder(clientId, reminder.id));
  actions.appendChild(delBtn);
  right.appendChild(actions);

  item.appendChild(right);
  return item;
}

function renderClientDetail() {
  const client = getClient(state.selectedClientId);
  if (!client) {
    noClientSelected.classList.remove('hidden');
    clientDetail.classList.add('hidden');
    return;
  }
  noClientSelected.classList.add('hidden');
  clientDetail.classList.remove('hidden');

  clientNameEl.textContent = client.name;
  const metaParts = [client.company, client.email, client.phone].filter(Boolean);
  clientMetaEl.textContent = metaParts.join(' · ') || 'No details added';

  // Notes
  notesListEl.innerHTML = '';
  const notes = [...client.notes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (notes.length === 0) {
    notesListEl.innerHTML = '<div class="list-empty">No notes yet.</div>';
  } else {
    for (const note of notes) {
      const item = document.createElement('div');
      item.className = 'note-item';
      item.innerHTML = `<div class="note-text">${escapeHtml(note.text)}</div>`;
      const footer = document.createElement('div');
      footer.className = 'note-footer';
      const date = document.createElement('span');
      date.className = 'note-date';
      date.textContent = fmtDateTime(note.createdAt);
      footer.appendChild(date);
      const delBtn = document.createElement('button');
      delBtn.className = 'btn-text';
      delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', () => deleteNote(client.id, note.id));
      footer.appendChild(delBtn);
      item.appendChild(footer);
      notesListEl.appendChild(item);
    }
  }

  // Reminders
  remindersListEl.innerHTML = '';
  const reminders = [...client.reminders].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });
  if (reminders.length === 0) {
    remindersListEl.innerHTML = '<div class="list-empty">No reminders yet.</div>';
  } else {
    for (const reminder of reminders) {
      remindersListEl.appendChild(renderReminderItem(reminder, client.id, false));
    }
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

// ---------- Mutations ----------
function addClient({ name, company, email, phone }) {
  const client = {
    id: uid(),
    name: name.trim(),
    company: (company || '').trim(),
    email: (email || '').trim(),
    phone: (phone || '').trim(),
    createdAt: new Date().toISOString(),
    notes: [],
    reminders: [],
  };
  state.clients.push(client);
  saveClients();
  state.selectedClientId = client.id;
  state.view = 'client';
  render();
}

function updateClient(id, { name, company, email, phone }) {
  const client = getClient(id);
  if (!client) return;
  client.name = name.trim();
  client.company = (company || '').trim();
  client.email = (email || '').trim();
  client.phone = (phone || '').trim();
  saveClients();
  render();
}

function deleteClient(id) {
  state.clients = state.clients.filter(c => c.id !== id);
  if (state.selectedClientId === id) {
    state.selectedClientId = null;
    state.view = 'dashboard';
  }
  saveClients();
  render();
}

function addNote(clientId, text) {
  const client = getClient(clientId);
  if (!client || !text.trim()) return;
  client.notes.push({ id: uid(), text: text.trim(), createdAt: new Date().toISOString() });
  saveClients();
  render();
}

function deleteNote(clientId, noteId) {
  const client = getClient(clientId);
  if (!client) return;
  client.notes = client.notes.filter(n => n.id !== noteId);
  saveClients();
  render();
}

function addReminder(clientId, { text, dueDate }) {
  const client = getClient(clientId);
  if (!client || !text.trim() || !dueDate) return;
  client.reminders.push({
    id: uid(),
    text: text.trim(),
    dueDate: new Date(dueDate).toISOString(),
    done: false,
    createdAt: new Date().toISOString(),
  });
  saveClients();
  render();
}

function toggleReminderDone(clientId, reminderId, done) {
  const client = getClient(clientId);
  if (!client) return;
  const reminder = client.reminders.find(r => r.id === reminderId);
  if (!reminder) return;
  reminder.done = done;
  saveClients();
  render();
}

function deleteReminder(clientId, reminderId) {
  const client = getClient(clientId);
  if (!client) return;
  client.reminders = client.reminders.filter(r => r.id !== reminderId);
  saveClients();
  render();
}

// ---------- Modals ----------
function closeModal() {
  modalRoot.innerHTML = '';
  modalRoot.classList.add('hidden');
}

function openModal(html, onMount) {
  modalRoot.innerHTML = `<div class="modal-overlay"><div class="modal">${html}</div></div>`;
  modalRoot.classList.remove('hidden');
  const overlay = modalRoot.querySelector('.modal-overlay');
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  if (onMount) onMount(modalRoot);
}

function openClientForm(existingClient) {
  const isEdit = !!existingClient;
  openModal(`
    <h3>${isEdit ? 'Edit Client' : 'Add Client'}</h3>
    <div class="form-field">
      <label>Name *</label>
      <input type="text" id="fName" value="${isEdit ? escapeHtml(existingClient.name) : ''}">
    </div>
    <div class="form-field">
      <label>Company</label>
      <input type="text" id="fCompany" value="${isEdit ? escapeHtml(existingClient.company) : ''}">
    </div>
    <div class="form-field">
      <label>Email</label>
      <input type="email" id="fEmail" value="${isEdit ? escapeHtml(existingClient.email) : ''}">
    </div>
    <div class="form-field">
      <label>Phone</label>
      <input type="text" id="fPhone" value="${isEdit ? escapeHtml(existingClient.phone) : ''}">
    </div>
    <div class="modal-actions">
      <button class="btn btn-secondary" id="cancelBtn">Cancel</button>
      <button class="btn btn-primary" id="saveBtn">${isEdit ? 'Save' : 'Add'}</button>
    </div>
  `, (root) => {
    const nameInput = root.querySelector('#fName');
    nameInput.focus();
    root.querySelector('#cancelBtn').addEventListener('click', closeModal);
    root.querySelector('#saveBtn').addEventListener('click', () => {
      const name = nameInput.value.trim();
      if (!name) { nameInput.focus(); return; }
      const payload = {
        name,
        company: root.querySelector('#fCompany').value,
        email: root.querySelector('#fEmail').value,
        phone: root.querySelector('#fPhone').value,
      };
      if (isEdit) updateClient(existingClient.id, payload);
      else addClient(payload);
      closeModal();
    });
  });
}

function openNoteForm(clientId) {
  openModal(`
    <h3>Add Note</h3>
    <div class="form-field">
      <label>Note</label>
      <textarea id="fNoteText" placeholder="Write a note..."></textarea>
    </div>
    <div class="modal-actions">
      <button class="btn btn-secondary" id="cancelBtn">Cancel</button>
      <button class="btn btn-primary" id="saveBtn">Add Note</button>
    </div>
  `, (root) => {
    const textarea = root.querySelector('#fNoteText');
    textarea.focus();
    root.querySelector('#cancelBtn').addEventListener('click', closeModal);
    root.querySelector('#saveBtn').addEventListener('click', () => {
      if (!textarea.value.trim()) { textarea.focus(); return; }
      addNote(clientId, textarea.value);
      closeModal();
    });
  });
}

function openReminderForm(clientId) {
  const defaultDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const defaultValue = defaultDate.toISOString().slice(0, 16);
  openModal(`
    <h3>Add Reminder</h3>
    <div class="form-field">
      <label>Reminder</label>
      <input type="text" id="fReminderText" placeholder="Follow up about...">
    </div>
    <div class="form-field">
      <label>Due date</label>
      <input type="datetime-local" id="fDueDate" value="${defaultValue}">
    </div>
    <div class="modal-actions">
      <button class="btn btn-secondary" id="cancelBtn">Cancel</button>
      <button class="btn btn-primary" id="saveBtn">Add Reminder</button>
    </div>
  `, (root) => {
    const textInput = root.querySelector('#fReminderText');
    textInput.focus();
    root.querySelector('#cancelBtn').addEventListener('click', closeModal);
    root.querySelector('#saveBtn').addEventListener('click', () => {
      const dueDate = root.querySelector('#fDueDate').value;
      if (!textInput.value.trim() || !dueDate) return;
      addReminder(clientId, { text: textInput.value, dueDate });
      closeModal();
    });
  });
}

// ---------- Event wiring ----------
document.getElementById('addClientBtn').addEventListener('click', () => openClientForm(null));

clientSearchEl.addEventListener('input', (e) => {
  state.search = e.target.value;
  renderClientList();
});

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    state.view = btn.dataset.view;
    render();
  });
});

document.getElementById('editClientBtn').addEventListener('click', () => {
  const client = getClient(state.selectedClientId);
  if (client) openClientForm(client);
});

document.getElementById('deleteClientBtn').addEventListener('click', () => {
  const client = getClient(state.selectedClientId);
  if (client && confirm(`Delete "${client.name}" and all their notes/reminders?`)) {
    deleteClient(client.id);
  }
});

document.getElementById('addNoteBtn').addEventListener('click', () => {
  if (state.selectedClientId) openNoteForm(state.selectedClientId);
});

document.getElementById('addReminderBtn').addEventListener('click', () => {
  if (state.selectedClientId) openReminderForm(state.selectedClientId);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

render();
