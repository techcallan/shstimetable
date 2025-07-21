// Users for login
const users = [
  { username: 'callan.jackson', password: 'Mabelcat1CC!!', name: 'Mr Callan Jackson', role: 'slt' },
  { username: 'bob', password: 'admin456', name: 'Bob', role: 'slt' }
];

const periods = ["Form", "Period 1", "Period 2", "Break", "Period 3", "Period 4", "Lunch", "Period 5"];
const claims = JSON.parse(localStorage.getItem('claims') || '[]');
let sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
const user = JSON.parse(localStorage.getItem('user') || 'null');

// Login
function login() {
  const usernameInput = document.getElementById('username').value.trim();
  const passwordInput = document.getElementById('password').value;

  const found = users.find(
    u => u.username === usernameInput && u.password === passwordInput
  );

  if (!found) {
    alert('Invalid credentials');
    return;
  }

  localStorage.setItem('user', JSON.stringify(found));
  window.location.href = 'home.html';
}

// Logout
function logout() {
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}

// Show welcome
function showWelcome() {
  if (!user) return window.location.href = 'login.html';
  document.getElementById('welcome-msg').innerText = `Hello ${user.name} (${user.role})`;
  if (user.role !== 'slt') document.getElementById('admin-link').style.display = 'none';
}

// Admin session creation
function createSession() {
  const date = document.getElementById('session-date').value;
  if (!date) return alert('Enter a date');
  sessions.push({ id: Date.now(), date, periods });
  localStorage.setItem('sessions', JSON.stringify(sessions));
  renderSessionList();
}

function renderSessionList() {
  const ul = document.getElementById('session-list');
  if (!ul) return;
  ul.innerHTML = '';
  sessions.forEach(s => {
    const li = document.createElement('li');
    li.innerText = s.date;
    ul.appendChild(li);
  });
}

// Claim page
function loadSessionsForClaim() {
  const select = document.getElementById('session-select');
  if (!select) return;
  select.innerHTML = '';
  sessions.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.innerText = s.date;
    select.appendChild(opt);
  });
  renderPeriods();
}

function renderPeriods() {
  const sessionId = document.getElementById('session-select').value;
  const session = sessions.find(s => s.id == sessionId);
  const container = document.getElementById('periods-container');
  container.innerHTML = '';
  if (!session) return;
  session.periods.forEach(period => {
    const btn = document.createElement('button');
    btn.innerText = `Claim ${period}`;
    btn.onclick = () => openModal(session.id, period);
    container.appendChild(btn);
  });
}

let activeClaim = {};
function openModal(sessionId, period) {
  activeClaim = { sessionId, period };
  document.getElementById('claim-popup').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('claim-popup').classList.add('hidden');
}

function confirmClaim() {
  const room = document.getElementById('room').value;
  const subject = document.getElementById('subject').value;
  const year = document.getElementById('year').value;
  claims.push({
    ...activeClaim,
    user: user.name,
    room,
    subject,
    year
  });
  localStorage.setItem('claims', JSON.stringify(claims));
  alert(`Claimed ${activeClaim.period} for ${subject} in ${room}`);
  closeModal();
}

// Protect pages and render on load
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('home')) showWelcome();
  if (window.location.pathname.includes('admin')) {
    if (!user || user.role !== 'slt') window.location.href = 'login.html';
    renderSessionList();
  }
  if (window.location.pathname.includes('claim')) loadSessionsForClaim();
});
