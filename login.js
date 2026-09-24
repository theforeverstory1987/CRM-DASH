if (getSession()) window.location.replace('app.html');

const form = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const rememberInput = document.getElementById('remember');
const errorEl = document.getElementById('loginError');
const toggleBtn = document.getElementById('togglePassword');

function showError(message) {
  errorEl.textContent = message;
  errorEl.classList.remove('hidden');
}

toggleBtn.addEventListener('click', () => {
  const show = passwordInput.type === 'password';
  passwordInput.type = show ? 'text' : 'password';
  toggleBtn.textContent = show ? 'Hide' : 'Show';
  toggleBtn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  errorEl.classList.add('hidden');

  if (!usernameInput.value.trim() || !passwordInput.value) {
    showError('Please enter your username and password.');
    return;
  }

  const user = findUser(usernameInput.value, passwordInput.value);
  if (!user) {
    showError('Incorrect username or password.');
    passwordInput.value = '';
    passwordInput.focus();
    return;
  }

  startSession(user, rememberInput.checked);
  window.location.replace('app.html');
});
