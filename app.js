const users = [
  { username: 'callan.jackson', password: 'Mabelcat1CC!!', name: 'Mr Callan Jackson', role: 'slt' },
  { username: 'bob', password: 'admin456', name: 'Bob', role: 'slt' }
];

// Simulated sessions and claims (localStorage-backed)
let sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
let claims = JSON.parse(localStorage.getItem('claims') || '[]');
let user = JSON.parse(localStorage.getItem('user') || 'null');
let activeClaim = {};
let claimType = null;

// Login handler
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

// Welcome message
function showWelcome() {
  if (!user) return (window.location.href = 'login.html');
  document.getElementById('welcome-msg').innerText = `Hello ${user.name} (${user.role})`;

  if (user.role !== 'slt') {
    const adminLink = document.getElementById('admin-link');
    if (adminLink) adminLink.style.display = 'none';
  }
}

// Logout
function logout() {
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}

// ----------------- CLAIMING ------------------

function renderSessions() {
  const select = document.getElementById('session-select');
  select.innerHTML = '<option disabled selected>Select session</option>';
  sessions.forEach((s, i) => {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `${s.day} @ ${s.time}`;
    select.appendChild(option);
  });
}

function renderPeriods() {
  const selected = document.getElementById('session-select').value;
  if (selected === '' || selected === undefined) return;

  const container = document.getElementById('periods-container');
  container.innerHTML = '';
  const periods = [
    'Form', 'Period 1', 'Period 2', 'Break', 'Period 3',
    'Period 4', 'Lunch', 'Period 5'
  ];

  periods.forEach(p => {
    const btn = document.createElement('button');
    btn.textContent = `${p} – CLAIM`;
    btn.onclick = () => openModal(parseInt(selected), p);
    container.appendChild(btn);
  });

  // Add Cafeteria, Food Truck, Detention Duty (special rules)
  ['Cafeteria', 'Food Truck'].forEach(p => {
    const btn = document.createElement('button');
    btn.textContent = `${p} – CLAIM (Break/Lunch Only)`;
    btn.onclick = () => openModal(parseInt(selected), p);
    container.appendChild(btn);
  });

  const detentionBtn = document.createElement('button');
  detentionBtn.textContent = 'Detention Duty – CLAIM (Lunch Only)';
  detentionBtn.onclick = () => openModal(parseInt(selected), 'Detention Duty');
  container.appendChild(detentionBtn);
}

// Modal open
function openModal(sessionId, period) {
  activeClaim = { sessionId, period };
  claimType = null;

  document.getElementById('claim-popup').classList.remove('hidden');
  document.getElementById('teaching-form').classList.add('hidden');
  document.getElementById('admin-form').classList.add('hidden');
}

// Modal close
function closeModal() {
  document.getElementById('claim-popup').classList.add('hidden');
}

// Modal: show teaching form
function showTeachingForm() {
  claimType = 'teaching';
  document.getElementById('teaching-form').classList.remove('hidden');
  document.getElementById('admin-form').classList.add('hidden');
}

// Modal: show admin form
function showAdminForm() {
  claimType = 'admin';
  document.getElementById('admin-form').classList.remove('hidden');
  document.getElementById('teaching-form').classList.add('hidden');
}

// Modal: confirm
function confirmClaim() {
  if (!claimType) return alert('Please select a claim type first.');

  let claimData = {
    ...activeClaim,
    user: user.name,
    role: user.role,
    type: claimType
  };

  if (claimType === 'teaching') {
    claimData.year = document.getElementById('year').value;
    claimData.room = document.getElementById('room').value;
    claimData.department = document.getElementById('department').value;
    claimData.subject = document.getElementById('subject').value;
  } else if (claimType === 'admin') {
    claimData.duty = document.getElementById('admin-duty').value;
  }

  claims.push(claimData);
  localStorage.setItem('claims', JSON.stringify(claims));
  alert('Claim submitted successfully!');
  closeModal();
}

// ----------------- ADMIN ------------------

function renderSessionList() {
  const list = document.getElementById('session-list');
  list.innerHTML = '';

  sessions.forEach((s, i) => {
    const li = document.createElement('li');
    li.textContent = `Session ${i + 1}: ${s.day} @ ${s.time}`;
    list.appendChild(li);
  });
}

function createSession() {
  const day = document.getElementById('session-day').value;
  const time = document.getElementById('session-time').value;
  if (!day || !time) return alert('Fill all session fields');
  sessions.push({ day, time });
  localStorage.setItem('sessions', JSON.stringify(sessions));
  renderSessionList();
  alert('Session created!');
}

// ----------------- INIT ------------------

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  if (path.includes('home.html')) showWelcome();
  if (path.includes('claim.html')) {
    if (!user) return (window.location.href = 'login.html');
    renderSessions();
  }
  if (path.includes('admin.html')) {
    if (!user || user.role !== 'slt') return (window.location.href = 'login.html');
    renderSessionList();
  }
});
