let currentUser = null;
let sessions = [];
let claims = [];

function login() {
  const name = document.getElementById('username').value;
  const role = document.getElementById('role').value;
  if (!name) return alert('Enter your name');
  currentUser = { name, role };
  document.getElementById('login-page').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  document.getElementById('welcome').innerText = `Welcome, ${name} (${role})`;
  if (role === 'slt') document.getElementById('slt-panel').classList.remove('hidden');
  loadSessions();
}

function logout() {
  currentUser = null;
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('login-page').classList.remove('hidden');
}

function createSession() {
  const date = document.getElementById('session-date').value;
  if (!date) return alert('Choose a date');
  const session = {
    id: Date.now(),
    date,
    periods: ["Form", "Period 1", "Period 2", "Break", "Period 3", "Period 4", "Lunch", "Period 5"],
  };
  sessions.push(session);
  loadSessions();
}

function loadSessions() {
  const select = document.getElementById('session-select');
  select.innerHTML = '';
  sessions.forEach(session => {
    const opt = document.createElement('option');
    opt.value = session.id;
    opt.textContent = session.date;
    select.appendChild(opt);
  });
  loadPeriods();
}

function loadPeriods() {
  const container = document.getElementById('periods-container');
  container.innerHTML = '';
  const sessionId = document.getElementById('session-select').value;
  const session = sessions.find(s => s.id == sessionId);
  if (!session) return;
  session.periods.forEach(period => {
    const btn = document.createElement('button');
    btn.innerText = `${period} - CLAIM`;
    btn.onclick = () => openModal(sessionId, period);
    container.appendChild(btn);
  });
}

let modalData = {};
function openModal(sessionId, period) {
  modalData = { sessionId, period };
  document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
}

function confirmClaim() {
  const room = document.getElementById('claim-room').value;
  const subject = document.getElementById('claim-subject').value;
  const year = document.getElementById('claim-year').value;
  claims.push({
    ...modalData,
    user: currentUser.name,
    room,
    subject,
    year
  });
  alert(`Claimed ${modalData.period} for ${subject} in ${room}`);
  closeModal();
}
