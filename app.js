// Define all periods and available rooms (from your room list)
const periods = ["Form", "Period 1", "Period 2", "Break", "Period 3", "Period 4", "Lunch", "Period 5"];
const rooms = [
  "C1", "C2", "C3", "L1", "L2", "L3", "S1", "S2", "S3", "PE Hall", "Drama Studio",
  "Comp1", "Comp2", "H1", "H2", "G1", "G2", "MFL1", "MFL2", "BS1", "BS2", "English Hub"
];

// Teaching departments
const departments = [
  "English", "History", "Geography", "Science", "Business",
  "Computing Science", "Physical Education", "Drama", "Modern Languages"
];

// Student year groups
const years = [
  "Year 7", "Year 8", "Year 9", "Year 10", "Year 11",
  "Sixth Form", "Learning Support", "Behaviour Support"
];

// Admin tasks (some restricted to specific periods)
const adminDuties = [
  "On-Call", "Isolation", "Pastoral Base", "Detention Duty",
  "Cafeteria", "Food Truck"
];

let claims = JSON.parse(localStorage.getItem("claims") || "[]");
let selectedPeriod = "";

// Render the timetable grid
function buildTimetable() {
  const table = document.getElementById("timetable");

  periods.forEach(p => {
    const cell = document.createElement("div");
    cell.className = "period-cell";
    cell.innerHTML = `
      <h3>${p}</h3>
      <button onclick="openClaim('${p}')">Claim</button>
    `;
    table.appendChild(cell);
  });

  // Populate dynamic dropdowns
  const roomSelect = document.getElementById("room");
  rooms.forEach(room => {
    const opt = document.createElement("option");
    opt.textContent = room;
    roomSelect.appendChild(opt);
  });

  const yearSelect = document.getElementById("year");
  years.forEach(y => {
    const opt = document.createElement("option");
    opt.textContent = y;
    yearSelect.appendChild(opt);
  });

  const departmentSelect = document.getElementById("department");
  departments.forEach(d => {
    const opt = document.createElement("option");
    opt.textContent = d;
    departmentSelect.appendChild(opt);
  });

  const adminSelect = document.getElementById("admin-duty");
  adminDuties.forEach(d => {
    const opt = document.createElement("option");
    opt.textContent = d;
    adminSelect.appendChild(opt);
  });
}

// Open claim modal
function openClaim(period) {
  selectedPeriod = period;
  document.getElementById("modal-info").textContent = `Claiming: ${period}`;
  document.getElementById("claim-modal").classList.remove("hidden");
  document.getElementById("teaching-form").classList.add("hidden");
  document.getElementById("admin-form").classList.add("hidden");
  document.getElementById("claim-modal").dataset.type = "";
}

// Close modal
function closeModal() {
  document.getElementById("claim-modal").classList.add("hidden");
  document.getElementById("teaching-form").classList.add("hidden");
  document.getElementById("admin-form").classList.add("hidden");
  document.getElementById("claim-modal").dataset.type = "";
}

// User chooses period type
function chooseType(type) {
  document.getElementById("claim-modal").dataset.type = type;

  if (type === "teaching") {
    document.getElementById("teaching-form").classList.remove("hidden");
    document.getElementById("admin-form").classList.add("hidden");
  } else {
    document.getElementById("admin-form").classList.remove("hidden");
    document.getElementById("teaching-form").classList.add("hidden");
  }
}

// Submit claim
function submitClaim() {
  const type = document.getElementById("claim-modal").dataset.type;
  if (!type) return alert("Please choose a period type first.");

  const claim = {
    period: selectedPeriod,
    type,
    user: JSON.parse(localStorage.getItem("user") || "{}").username || "Unknown",
    timestamp: new Date().toISOString()
  };

  if (type === "teaching") {
    claim.year = document.getElementById("year").value;
    claim.room = document.getElementById("room").value;
    claim.department = document.getElementById("department").value;
    claim.subject = document.getElementById("subject").value;
  } else {
    claim.duty = document.getElementById("admin-duty").value;

    // Validate restrictions
    const p = selectedPeriod.toLowerCase();
    if (
      claim.duty === "Detention Duty" && p !== "lunch" ||
      (["Cafeteria", "Food Truck"].includes(claim.duty) && !["lunch", "break"].includes(p))
    ) {
      return alert(`${claim.duty} can only be claimed at valid periods.`);
    }
  }

  claims.push(claim);
  localStorage.setItem("claims", JSON.stringify(claims));
  alert("Claim submitted.");
  closeModal();
}

document.addEventListener("DOMContentLoaded", buildTimetable);
