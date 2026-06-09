// Configuration
var CONFIG = {
  app: {
    name: 'Surgeon Assistant',
    version: '1.0.0',
  },
  storage: {
    key: 'surgeon_assistant_state',
  },
};

// Application State
var state = {
  currentScreen: 'patients-list',
  currentPatientId: null,
  cache: {},
  focusedElementIndex: 0,
};

// Patient Database (Demo Data)
var PATIENTS_DB = {
  P001: {
    id: 'P001',
    name: 'John Anderson',
    age: 58,
    dob: '1965-03-15',
    vitals: {
      bloodPressure: '138/85 mmHg',
      heartRate: '72 bpm',
      temperature: '98.2°F',
    },
    allergies: ['Penicillin', 'Latex'],
    medications: ['Lisinopril 10mg', 'Atorvastatin 20mg', 'Aspirin 81mg'],
    medicalHistory: [
      'Hypertension (2010)',
      'Type 2 Diabetes (2015)',
      'Hyperlipidemia (2012)',
    ],
    procedures: [
      'Colonoscopy (2022)',
      'Cardiac catheterization (2020)',
    ],
    xray: {
      date: '2024-06-05',
      type: 'Chest X-Ray',
      area: 'Thorax',
      notes: 'Normal cardiac silhouette. Lungs clear. No acute findings.',
      imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400"><rect width="300" height="400" fill="%23333"/><ellipse cx="80" cy="150" rx="30" ry="50" fill="none" stroke="%23888" stroke-width="2"/><ellipse cx="220" cy="150" rx="30" ry="50" fill="none" stroke="%23888" stroke-width="2"/><path d="M 150 80 Q 140 120 145 160 Q 150 180 155 160 Q 160 120 150 80" fill="none" stroke="%23888" stroke-width="2"/><text x="150" y="350" text-anchor="middle" fill="%23ccc" font-size="14">Chest X-Ray</text></svg>',
    },
  },
  P002: {
    id: 'P002',
    name: 'Sarah Mitchell',
    age: 42,
    dob: '1981-07-22',
    vitals: {
      bloodPressure: '118/76 mmHg',
      heartRate: '68 bpm',
      temperature: '98.6°F',
    },
    allergies: ['Shellfish', 'Sulfa drugs'],
    medications: ['Levothyroxine 75mcg', 'Sertraline 50mg'],
    medicalHistory: [
      'Hypothyroidism (2015)',
      'Anxiety disorder (2018)',
    ],
    procedures: [
      'Thyroid ultrasound (2023)',
      'Mammography (2024)',
    ],
    xray: {
      date: '2024-05-20',
      type: 'Lumbar Spine X-Ray',
      area: 'Lumbar Spine',
      notes: 'Mild degenerative disc disease at L4-L5. Otherwise unremarkable.',
      imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400"><rect width="300" height="400" fill="%23333"/><line x1="150" y1="50" x2="150" y2="350" stroke="%23888" stroke-width="3"/><circle cx="150" cy="100" r="25" fill="none" stroke="%23888" stroke-width="2"/><circle cx="150" cy="150" r="28" fill="none" stroke="%23888" stroke-width="2"/><circle cx="150" cy="205" r="30" fill="none" stroke="%23888" stroke-width="2"/><circle cx="150" cy="265" r="28" fill="none" stroke="%23888" stroke-width="2"/><text x="150" y="350" text-anchor="middle" fill="%23ccc" font-size="14">Lumbar Spine</text></svg>',
    },
  },
  P003: {
    id: 'P003',
    name: 'Michael Chen',
    age: 67,
    dob: '1956-11-10',
    vitals: {
      bloodPressure: '142/88 mmHg',
      heartRate: '76 bpm',
      temperature: '98.1°F',
    },
    allergies: ['NAID'],
    medications: ['Metformin 1000mg', 'Lisinopril 20mg', 'Amlodipine 5mg', 'Clopidogrel 75mg'],
    medicalHistory: [
      'Type 2 Diabetes (2005)',
      'Coronary artery disease (2018)',
      'Hypertension (2008)',
      'Atrial fibrillation (2019)',
    ],
    procedures: [
      'Stent placement (2020)',
      'Ablation for AFib (2019)',
      'Stress test (2023)',
    ],
    xray: {
      date: '2024-04-10',
      type: 'Abdominal X-Ray',
      area: 'Abdomen',
      notes: 'No acute abdominal pathology. Bowel gas pattern normal.',
      imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400"><rect width="300" height="400" fill="%23333"/><rect x="50" y="60" width="200" height="280" fill="none" stroke="%23888" stroke-width="2"/><path d="M 60 100 Q 90 120 120 110 Q 150 100 170 130 Q 180 150 160 170 Q 130 190 90 180 Q 60 175 60 150" fill="none" stroke="%23888" stroke-width="1.5"/><path d="M 170 200 Q 180 220 170 240 Q 150 260 130 250 Q 120 240 140 210" fill="none" stroke="%23888" stroke-width="1.5"/><text x="150" y="350" text-anchor="middle" fill="%23ccc" font-size="14">Abdominal X-Ray</text></svg>',
    },
  },
};

// Initialize App
function init() {
  loadState();
  setupEventListeners();
  navigateTo('patients-list');
  moveFocus(0);
}

// Event Listeners
function setupEventListeners() {
  document.addEventListener('keydown', handleKeydown);
  document.addEventListener('click', handleClick);
}

function handleKeydown(e) {
  var key = e.key;

  // D-pad navigation (arrow keys)
  if (key === 'ArrowDown') {
    e.preventDefault();
    moveFocus(1);
  } else if (key === 'ArrowUp') {
    e.preventDefault();
    moveFocus(-1);
  } else if (key === 'ArrowLeft') {
    e.preventDefault();
    // Left arrow can also go back
  } else if (key === 'ArrowRight') {
    e.preventDefault();
    // Right arrow reserved for future use
  } else if (key === 'Enter' || key === ' ') {
    e.preventDefault();
    var focused = document.querySelector('.focusable.focused');
    if (focused) {
      focused.click();
    }
  } else if (key === 'Escape') {
    e.preventDefault();
    handleAppAction('back');
  }
}

function handleClick(e) {
  var target = e.target.closest('[data-action]');
  if (target) {
    var action = target.getAttribute('data-action');
    handleAppAction(action, target);
  }
}

// Focus Management
function moveFocus(direction) {
  var currentScreen = document.getElementById(state.currentScreen);
  if (!currentScreen) return;

  var focusables = Array.from(currentScreen.querySelectorAll('.focusable'));
  if (focusables.length === 0) return;

  // Remove current focus
  var current = currentScreen.querySelector('.focusable.focused');
  if (current) {
    current.classList.remove('focused');
  }

  // Calculate next index
  var currentIndex = focusables.indexOf(current);
  var nextIndex = currentIndex + direction;

  // Wrap around
  if (nextIndex < 0) {
    nextIndex = focusables.length - 1;
  } else if (nextIndex >= focusables.length) {
    nextIndex = 0;
  }

  // Focus new element
  var next = focusables[nextIndex];
  next.classList.add('focused');
  next.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Screen Navigation
function navigateTo(screenId) {
  var current = document.querySelector('.screen.active');
  if (current) {
    current.classList.remove('active');
  }

  var next = document.getElementById(screenId);
  if (next) {
    next.classList.add('active');
    state.currentScreen = screenId;
    setTimeout(function() {
      moveFocus(0);
      onScreenEnter(screenId);
    }, 100);
  }
}

function onScreenEnter(screenId) {
  switch (screenId) {
    case 'patients-list':
      renderPatientsList();
      break;
    case 'patient-history':
      if (state.currentPatientId) {
        renderPatientHistory(state.currentPatientId);
      }
      break;
    case 'xray-viewer':
      if (state.currentPatientId) {
        renderXRayViewer(state.currentPatientId);
      }
      break;
  }
}

// Action Handler
function handleAppAction(action, element) {
  switch (action) {
    case 'select-patient':
      var patientId = element.getAttribute('data-patient-id');
      state.currentPatientId = patientId;
      navigateTo('patient-history');
      saveState();
      break;

    case 'view-xray':
      navigateTo('xray-viewer');
      break;

    case 'back':
      handleBack();
      break;

    case 'refresh':
      onScreenEnter(state.currentScreen);
      showToast('Refreshed', 'success');
      break;
  }
}

function handleBack() {
  switch (state.currentScreen) {
    case 'patient-history':
      navigateTo('patients-list');
      break;
    case 'xray-viewer':
      navigateTo('patient-history');
      break;
    default:
      navigateTo('patients-list');
  }
}

// Render Functions
function renderPatientsList() {
  var container = document.getElementById('patients-container');
  container.innerHTML = '';

  Object.keys(PATIENTS_DB).forEach(function(patientId) {
    var patient = PATIENTS_DB[patientId];
    var item = document.createElement('div');
    item.className = 'list-item focusable';
    item.tabIndex = 0;
    item.setAttribute('data-action', 'select-patient');
    item.setAttribute('data-patient-id', patientId);
    item.innerHTML =
      '<div class="list-item-primary">' + patient.name + '</div>' +
      '<div class="list-item-secondary">Age: ' + patient.age + ' | ID: ' + patientId + '</div>';
    container.appendChild(item);
  });
}

function renderPatientHistory(patientId) {
  var patient = PATIENTS_DB[patientId];
  if (!patient) return;

  // Update header
  document.getElementById('patient-name').textContent = patient.name;
  document.getElementById('patient-id').textContent = 'ID: ' + patientId;

  // Update vitals
  document.getElementById('vitals-bp').textContent = patient.vitals.bloodPressure;
  document.getElementById('vitals-hr').textContent = patient.vitals.heartRate;
  document.getElementById('vitals-temp').textContent = patient.vitals.temperature;

  // Update allergies
  var allergiesHtml = patient.allergies.length > 0
    ? patient.allergies.join(', ')
    : 'None documented';
  document.getElementById('allergies-list').textContent = allergiesHtml;

  // Update medications
  var medsHtml = '';
  if (patient.medications.length > 0) {
    medsHtml = patient.medications
      .map(function(med) {
        return '<div class="detail-item"><span class="detail-label">•</span><span class="detail-value">' + med + '</span></div>';
      })
      .join('');
  } else {
    medsHtml = '<div class="detail-item">None documented</div>';
  }
  document.getElementById('medications-list').innerHTML = medsHtml;

  // Update medical history
  var historyHtml = patient.medicalHistory
    .map(function(item) {
      return '<div class="detail-item"><span class="detail-label">•</span><span class="detail-value">' + item + '</span></div>';
    })
    .join('');
  document.getElementById('history-list').innerHTML = historyHtml;

  // Update procedures
  var procsHtml = patient.procedures
    .map(function(proc) {
      return '<div class="detail-item"><span class="detail-label">•</span><span class="detail-value">' + proc + '</span></div>';
    })
    .join('');
  document.getElementById('procedures-list').innerHTML = procsHtml;
}

function renderXRayViewer(patientId) {
  var patient = PATIENTS_DB[patientId];
  if (!patient) return;

  var xray = patient.xray;
  document.getElementById('xray-title').textContent = xray.type;
  document.getElementById('xray-date').textContent = 'Date: ' + xray.date;
  document.getElementById('xray-type').textContent = xray.type;
  document.getElementById('xray-area').textContent = xray.area;
  document.getElementById('xray-notes').textContent = xray.notes;
  document.getElementById('xray-image').src = xray.imageUrl;
}

// Toast Notification
function showToast(message, type) {
  type = type || 'info';
  var toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast ' + type;
  toast.classList.remove('hidden');

  setTimeout(function() {
    toast.classList.add('hidden');
  }, 2000);
}

// State Management
function saveState() {
  var data = {
    currentPatientId: state.currentPatientId,
  };
  try {
    localStorage.setItem(CONFIG.storage.key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

function loadState() {
  try {
    var saved = localStorage.getItem(CONFIG.storage.key);
    if (saved) {
      var data = JSON.parse(saved);
      state.currentPatientId = data.currentPatientId;
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
}

// Start app on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
