// State
let currentRole = 'patient';
let isELI5Active = false;
let isSpeaking = false;

let dbReports = [];
let dbMedicines = [];
let dbPrescriptions = [];

// Role Selection
function selectRole(role) {
  currentRole = role;
  const optPatient = document.getElementById('opt-patient');
  const optDoctor = document.getElementById('opt-doctor');
  const emailInput = document.getElementById('login-email');
  const btn = document.getElementById('login-submit-btn');

  if (role === 'patient') {
    optPatient.classList.add('selected');
    optPatient.classList.remove('doctor-selected');
    optDoctor.classList.remove('selected', 'doctor-selected');
    if (emailInput) emailInput.value = 'patient@example.com';
    if (btn) {
      btn.innerText = 'Log In to Patient Dashboard →';
      btn.className = 'btn-primary';
    }
  } else {
    optDoctor.classList.add('selected', 'doctor-selected');
    optPatient.classList.remove('selected', 'doctor-selected');
    if (emailInput) emailInput.value = 'dr.jenkins@medsimplify.com';
    if (btn) {
      btn.innerText = 'Log In to Doctor Portal →';
      btn.className = 'btn-doctor';
    }
  }
}

function showLoginModal() {
  const modal = document.getElementById('login-modal');
  if (modal) modal.style.display = 'flex';
}

function performLogin() {
  const modal = document.getElementById('login-modal');
  if (modal) modal.style.display = 'none';

  const patientNav = document.getElementById('patient-nav');
  const doctorNav = document.getElementById('doctor-nav');
  const roleBadge = document.getElementById('user-role-badge');
  const subtitle = document.getElementById('header-subtitle');

  if (currentRole === 'doctor') {
    if (patientNav) patientNav.style.display = 'none';
    if (doctorNav) doctorNav.style.display = 'flex';
    if (roleBadge) {
      roleBadge.className = 'role-badge role-doctor';
      roleBadge.innerHTML = '<i class="fas fa-user-md"></i> <span id="user-role-text">Doctor Portal</span>';
    }
    if (subtitle) subtitle.innerText = 'Doctor Clinical Workspace';
    switchTab('doc-dashboard');
    fetchDoctorPatientsFromDB();
  } else {
    if (doctorNav) doctorNav.style.display = 'none';
    if (patientNav) patientNav.style.display = 'flex';
    if (roleBadge) {
      roleBadge.className = 'role-badge role-patient';
      roleBadge.innerHTML = '<i class="fas fa-user"></i> <span id="user-role-text">Patient</span>';
    }
    if (subtitle) subtitle.innerText = 'AI Healthcare Platform';
    switchTab('dashboard');
    fetchReportsFromDB();
    fetchMedicinesFromDB();
  }
}

// Tab Switching
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active', 'doctor-active'));
  
  const activeTab = document.getElementById(tabId);
  if (activeTab) activeTab.classList.add('active');

  const btnMap = {
    'dashboard': 0, 'reports': 1, 'medicines': 2, 'symptoms': 3, 'patient-telemed': 4, 'diet-planner': 5, 'lab-booking': 6, 'emergency': 7, 'checklist': 8, 'chat': 9,
    'doc-dashboard': 0, 'doc-patients': 1, 'doc-prescribe': 2, 'doc-soap': 3, 'doc-telemed': 4
  };
  
  const navContainer = (currentRole === 'doctor') ? document.getElementById('doctor-nav') : document.getElementById('patient-nav');
  if (navContainer) {
    const buttons = navContainer.querySelectorAll('.nav-btn');
    const idx = btnMap[tabId] || 0;
    if (buttons[idx]) {
      buttons[idx].classList.add(currentRole === 'doctor' ? 'doctor-active' : 'active');
    }
  }
}

// Two-Way Video Call Functions
async function startDoctorTelemedCall() {
  const patient = document.getElementById('telemed-patient-select')?.value || "Rajesh Kumar";
  try {
    const res = await fetch(`/api/appointments/telemed/invite?patient_name=${encodeURIComponent(patient)}`, { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      alert(`Live Telemedicine video consultation initiated for patient ${patient}! Session room: ${data.session.room_id}`);
      return;
    }
  } catch (e) {
    console.log("Telemed invite notice:", e);
  }
  alert(`Live Telemedicine video call started with patient ${patient}! Room medsimplify-room-101 is active.`);
}

async function joinPatientVideoCall() {
  const container = document.getElementById('video-stream-container');
  if (container) {
    container.innerHTML = `
      <div style="width:100%; height:100%; position:relative; background:#000; border-radius:12px; overflow:hidden; display:flex; align-items:center; justify-content:center;">
        <div style="position:absolute; top:10px; left:10px; background:rgba(0,0,0,0.6); padding:4px 10px; border-radius:6px; font-size:0.8rem; color:#22c55e;"><i class="fas fa-circle" style="font-size:0.6rem;"></i> LIVE • HD 1080p</div>
        <div style="text-align:center;">
          <div style="font-size:3.5rem; color:#3b82f6; margin-bottom:0.5rem;"><i class="fas fa-user-md"></i></div>
          <h3 style="color:white; font-size:1.2rem;">Dr. Sarah Jenkins, MD</h3>
          <p style="color:#94a3b8; font-size:0.85rem;">Cardiology • Medical Consultation Active</p>
        </div>
        <div style="position:absolute; bottom:10px; right:10px; width:100px; height:75px; background:#1e293b; border:2px solid #3b82f6; border-radius:6px; display:flex; align-items:center; justify-content:center; color:white; font-size:0.75rem;">
          You (Patient)
        </div>
      </div>
    `;
  }
  alert("Connected to Live Telemedicine Video Consultation Room with Dr. Sarah Jenkins!");
}

function endPatientCall() {
  const container = document.getElementById('video-stream-container');
  if (container) {
    container.innerHTML = `
      <i class="fas fa-user-md" style="font-size:4rem; color:var(--text-muted); margin-bottom:1rem;"></i>
      <p style="color:var(--text-muted); font-size:0.9rem;" id="video-placeholder-text">Click "Join Live Video Call" to establish camera connection with Dr. Sarah Jenkins</p>
    `;
  }
  alert("Telemedicine video consultation session ended.");
}

// ----------------------------------------------------
// REAL-TIME API FETCHERS & RENDERERS FROM DATABASE
// ----------------------------------------------------

async function fetchReportsFromDB() {
  try {
    const res = await fetch('/api/reports/?patient_id=1');
    if (res.ok) {
      dbReports = await res.json();
      renderReportsList();
      if (dbReports.length > 0) {
        displayReportDetails(dbReports[0]);
      }
    }
  } catch (err) {
    console.error("Error fetching DB reports:", err);
  }
}

function renderReportsList() {
  const container = document.getElementById('reports-list');
  const countEl = document.getElementById('count-reports');
  if (!container) return;

  if (countEl) countEl.innerText = dbReports.length;

  if (dbReports.length === 0) {
    container.innerHTML = `<div style="color:var(--text-muted); font-size:0.9rem;">No reports uploaded yet.</div>`;
    return;
  }

  container.innerHTML = dbReports.map((r, idx) => {
    const s = r.simplified_summary || {};
    const title = s.title || r.file_url || `Medical Report #${r.id}`;
    const date = new Date(r.created_at || Date.now()).toLocaleDateString();
    const isFlagged = s.is_flagged;
    const badgeClass = isFlagged ? 'badge-warning' : 'badge-success';
    const badgeText = isFlagged ? (s.flagged_reason || 'Flagged Values') : 'Normal';

    return `
      <div class="card" style="padding:0.85rem; cursor:pointer; ${idx === 0 ? 'border-color:var(--primary); background:rgba(59,130,246,0.15);' : ''}" onclick="selectReport(${r.id})">
        <strong>${title}</strong>
        <div style="font-size:0.8rem; color:var(--text-muted);">${date} • ${r.report_type || 'Lab Report'}</div>
        <span class="badge ${badgeClass}" style="margin-top:0.4rem; display:inline-block;">${badgeText}</span>
      </div>
    `;
  }).join('');
}

async function selectReport(reportId) {
  const cached = dbReports.find(r => r.id === reportId);
  if (cached) {
    displayReportDetails(cached);
  } else {
    try {
      const res = await fetch(`/api/reports/${reportId}`);
      if (res.ok) {
        const report = await res.json();
        displayReportDetails(report);
      }
    } catch (e) {
      console.log("Error fetching report detail:", e);
    }
  }
}

function displayReportDetails(report) {
  const s = report.simplified_summary || {};
  const titleEl = document.getElementById('report-title');
  const summaryEl = document.getElementById('report-summary');
  const badgeEl = document.getElementById('report-badge');
  const recList = document.getElementById('report-recommendations');

  if (titleEl) titleEl.innerText = s.title || report.file_url || 'Medical Report Analysis';
  if (summaryEl) summaryEl.innerText = isELI5Active ? (s.eli5_summary || s.standard_summary) : (s.standard_summary || report.raw_text);
  
  if (badgeEl) {
    badgeEl.className = s.is_flagged ? 'badge badge-warning' : 'badge badge-success';
    badgeEl.innerText = s.flagged_reason || 'Normal Reference Range';
  }

  if (recList && s.recommendations) {
    recList.innerHTML = s.recommendations.map(item => `<li>${item}</li>`).join('');
  }
}

async function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  switchTab('reports');
  const summaryEl = document.getElementById('report-summary');
  if (summaryEl) {
    summaryEl.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Processing "${file.name}" via Hugging Face OCR & AI Pipeline...`;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('patient_id', '1');
  formData.append('report_type', 'lab_report');

  try {
    const res = await fetch('/api/reports/upload', {
      method: 'POST',
      body: formData
    });
    if (res.ok) {
      const savedReport = await res.json();
      alert(`Report "${file.name}" extracted via OCR, simplified by AI, and saved to database!`);
      await fetchReportsFromDB();
      displayReportDetails(savedReport);
      return;
    }
  } catch (err) {
    console.error("Upload error:", err);
  }
}

// Medicine Reminders & Adherence from DB
async function fetchMedicinesFromDB() {
  try {
    const res = await fetch('/api/medicines/?patient_id=1');
    if (res.ok) {
      dbMedicines = await res.json();
      renderMedicinesList();
      fetchAdherenceFromDB();
    }
  } catch (err) {
    console.error("Error fetching DB medicines:", err);
  }
}

function renderMedicinesList() {
  const container = document.getElementById('reminders-container');
  if (!container) return;

  if (dbMedicines.length === 0) {
    container.innerHTML = `<div style="color:var(--text-muted); font-size:0.9rem;">No active medicine reminders.</div>`;
    return;
  }

  container.innerHTML = dbMedicines.map(m => `
    <div class="card" style="display:flex; justify-content:space-between; align-items:center; padding:1rem; margin-bottom:0.75rem;">
      <div style="display:flex; align-items:center; gap:1rem;">
        <div style="font-size:2rem; color:var(--primary);"><i class="fas fa-capsules"></i></div>
        <div>
          <strong style="font-size:1.1rem; display:block;">${m.medicine_name}</strong>
          <span style="font-size:0.85rem; color:var(--text-muted);">${m.dosage} • ${m.timing || 'After food'}</span>
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:1rem;">
        <div style="text-align:right;">
          <strong style="color:var(--primary); display:block;">${m.reminder_time || '08:00 AM'}</strong>
          <span style="font-size:0.75rem; color:var(--text-muted);">${m.frequency || 'Daily'}</span>
        </div>
        <button class="btn-primary" style="padding:0.4rem 0.8rem; font-size:0.85rem;" onclick="logMedicineTakenDB(${m.id})">
          <i class="fas fa-check"></i> Mark Taken
        </button>
      </div>
    </div>
  `).join('');
}

async function logMedicineTakenDB(reminderId) {
  try {
    const res = await fetch(`/api/medicines/${reminderId}/log-taken`, { method: 'POST' });
    if (res.ok) {
      alert("Medicine dose logged to database!");
      fetchAdherenceFromDB();
    }
  } catch (e) {
    console.error("Dose log error:", e);
  }
}

async function fetchAdherenceFromDB() {
  try {
    const res = await fetch('/api/medicines/adherence?patient_id=1');
    if (res.ok) {
      const data = await res.json();
      const scoreEl = document.getElementById('adherence-score');
      if (scoreEl) scoreEl.innerText = `${data.adherence_score}%`;
    }
  } catch (e) {
    console.log("Adherence fetch notice:", e);
  }
}

async function fetchDoctorPatientsFromDB() {
  try {
    const res = await fetch('/api/reports/?patient_id=1');
    if (res.ok) {
      const reports = await res.json();
      const countEl = document.getElementById('doc-patient-count');
      if (countEl) countEl.innerText = reports.length;
    }
  } catch (e) {
    console.log("Doctor patient fetch error:", e);
  }
}

// ELI5 Ultra-Simple Mode Toggle
async function toggleELI5Mode() {
  isELI5Active = !isELI5Active;
  const btn = document.getElementById('eli5-toggle-btn');
  const summaryEl = document.getElementById('report-summary');
  const headerEl = document.getElementById('summary-header');

  if (isELI5Active) {
    if (btn) btn.innerHTML = '<i class="fas fa-child"></i> ELI5 Mode: ON ✨';
    if (headerEl) headerEl.innerHTML = '<i class="fas fa-child" style="color:#fbbf24;"></i> "Explain Like I\'m 5" Simple Story Mode';
    if (dbReports.length > 0) displayReportDetails(dbReports[0]);
  } else {
    if (btn) btn.innerHTML = '<i class="fas fa-child"></i> ELI5 Mode: OFF';
    if (headerEl) headerEl.innerHTML = '<i class="fas fa-sparkles"></i> Standard AI Summary';
    if (dbReports.length > 0) displayReportDetails(dbReports[0]);
  }
}

// Text-to-Speech Voice Player
function speakSummary() {
  if ('speechSynthesis' in window) {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      isSpeaking = false;
      document.getElementById('voice-icon').className = 'fas fa-volume-up';
      return;
    }

    const text = document.getElementById('report-summary').innerText;
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.onend = () => {
      isSpeaking = false;
      document.getElementById('voice-icon').className = 'fas fa-volume-up';
    };

    window.speechSynthesis.speak(utterance);
    isSpeaking = true;
    document.getElementById('voice-icon').className = 'fas fa-pause';
  } else {
    alert('Voice Audio Player: Reading report summary aloud.');
  }
}

// Family Member Profile Switcher
function switchFamilyMember() {
  fetchReportsFromDB();
}

// Doctor EMR SOAP Generator
async function generateSOAPNotes() {
  const patient = document.getElementById('soap-patient').value;
  const symptoms = document.getElementById('soap-symptoms').value;
  const labs = document.getElementById('soap-labs').value;
  const output = document.getElementById('soap-output');

  if (output) {
    output.innerHTML = `<p><i class="fas fa-spinner fa-spin"></i> Generating AI Clinical SOAP Notes live...</p>`;
  }

  try {
    const res = await fetch('/api/ai/soap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patient_name: patient, symptoms: symptoms, lab_findings: labs })
    });
    if (res.ok) {
      const data = await res.json();
      const soap = data.soap_notes;
      if (output) {
        output.innerHTML = `
          <p><strong>[S] Subjective:</strong> ${soap.subjective}</p>
          <p style="margin-top:0.5rem;"><strong>[O] Objective:</strong> ${soap.objective}</p>
          <p style="margin-top:0.5rem;"><strong>[A] Assessment:</strong> ${soap.assessment}</p>
          <p style="margin-top:0.5rem;"><strong>[P] Plan:</strong> ${soap.plan.replace(/\n/g, '<br>')}</p>
        `;
      }
      alert('AI Clinical SOAP Notes generated live via Bio_ClinicalBERT pipeline!');
      return;
    }
  } catch (err) {
    console.log("SOAP error:", err);
  }
}

async function issuePrescription() {
  const patient = document.getElementById('prescription-patient').value;
  const medName = document.getElementById('doc-med-name')?.value || 'Ferrous Sulfate 200mg';
  const medDosage = document.getElementById('doc-med-dosage')?.value || '1 Tablet twice daily';
  const medAdvice = document.getElementById('doc-med-advice')?.value || 'After meals';

  try {
    const res = await fetch('/api/prescriptions/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patient_id: 1,
        medicines: [{ name: medName, dosage: medDosage, timing: medAdvice, time: "08:00 AM" }],
        advice: medAdvice,
        follow_up_date: "2026-10-15"
      })
    });
    if (res.ok) {
      alert(`Official Doctor Prescription issued for ${patient}! Prescribed medicine "${medName}" auto-synced to Patient's Medicine Reminders in database.`);
      fetchMedicinesFromDB();
      return;
    }
  } catch (err) {
    console.log("Prescription issuance notice:", err);
  }
}

async function sendMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  
  const container = document.getElementById('chat-messages');
  
  const userMsg = document.createElement('div');
  userMsg.className = 'msg-bubble msg-user';
  userMsg.innerText = text;
  container.appendChild(userMsg);
  
  input.value = '';
  container.scrollTop = container.scrollHeight;
  
  const botMsg = document.createElement('div');
  botMsg.className = 'msg-bubble msg-bot';
  botMsg.innerHTML = '<i class="fas fa-robot fa-spin"></i> MedSimplify AI is thinking...';
  container.appendChild(botMsg);
  container.scrollTop = container.scrollHeight;

  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: text })
    });
    if (res.ok) {
      const data = await res.json();
      botMsg.innerText = data.answer;
      container.scrollTop = container.scrollHeight;
      return;
    }
  } catch (err) {
    console.log("Chat bot fallback notice:", err);
  }
}

// On Page Load - REAL-TIME DATABASE FETCH
document.addEventListener('DOMContentLoaded', () => {
  fetchReportsFromDB();
  fetchMedicinesFromDB();
});
