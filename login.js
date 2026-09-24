// Sign in never asks for anything: the fields come filled in, and whatever is (or isn't) typed,
// Sign in opens the app. Known usernames sign in as that person; anything else as the team's admin.
const form = document.getElementById('loginForm');
const passwordInput = document.getElementById('password');
const toggleBtn = document.getElementById('togglePassword');

toggleBtn.addEventListener('click', () => {
  const show = passwordInput.type === 'password';
  passwordInput.type = show ? 'text' : 'password';
  toggleBtn.textContent = show ? 'Hide' : 'Show';
  toggleBtn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const typed = USERS.find(u => u.username === document.getElementById('username').value.trim().toLowerCase());
  try {
    startSession(typed || USERS[0], document.getElementById('remember').checked);
  } catch {
    // Storage is blocked: the app signs in by itself when it opens.
  }
  window.location.href = 'app.html';
});
