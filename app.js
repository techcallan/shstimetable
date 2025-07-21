const periods = ["Form", "Period 1", "Period 2", "Break", "Period 3", "Period 4", "Lunch", "Period 5"];
const claims = JSON.parse(localStorage.getItem('claims') || '[]');
let sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
const user = JSON.parse(localStorage.getItem('user') || 'null');

function login() {
  const name = document.getElementById('username').value;
  const role = document.getElementById('role').value;
  if (!name) return alert('Please enter your name');
  const user = { name, role };
  localStorage.setItem('user', JSON.stringify(user));
  window.location.href = 'home.html';
}

function logout() {
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}

function showWelcome() {
  if (!user) return window.location.href = 'login.html';
  document.getElementById('welcome-msg').innerText = `Hello ${user.name} (${user.role})`;
  if (user.role !== 'slt') document.getElementById('admin-link').style.display = 'none';
}

function createSession() {
  const date = document.getElementById('session-date').value;
  if (!date) return alert('Enter a date');
  sessions.push({ id: Date.now(), date, periods });
  localStorage.setItem('sessions', JSON.stringify(sessions));
  renderSessionList();
}

function renderSessionList() {
  const ul = document.getElementById('session-list');
  ul.innerHTML = '';
  sessions.forEach(s => {
    const li = document.createElement('li');
    li.innerText = s.date;
    ul.appendChild(li);
  });
}

function loadSessionsForClaim() {
  const select = document.getElementById('session-select');
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

// Auto-run on page load
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('welcome-msg')) showWelcome();
  if (document.getElementById('session-list')) renderSessionList();
  if (document.getElementById('session-select')) loadSessionsForClaim();
});
