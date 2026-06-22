/* =============================================
   ROMANTIC PROPOSAL — script.js
   ============================================= */

/* ---------- CONFIGURATION ---------- */
const DATE_CONFIG = {
  personName:  'Ananya',
  date:        'Saturday, June 20',
  time:        '7:00 PM',
  location:    'Cafe Coffee Day',
  quote:       'Every great love story has a first evening. This is ours.',
};

/* ---------- FOOD OPTIONS ---------- */
const FOOD_OPTIONS = [
  { emoji: '🍣', label: 'Sushi'    },
  { emoji: '🍝', label: 'Pasta'    },
  { emoji: '🍕', label: 'Pizza'    },
  { emoji: '🍛', label: 'Biryani'  },
  { emoji: '🍢', label: 'Kebabs'   },
  { emoji: '🌮', label: 'Tacos'    },
  { emoji: '🍜', label: 'Ramen'    },
  { emoji: '🍔', label: 'Burgers'  },
  { emoji: '🍰', label: 'Desserts' },
];

/* ---------- TIME OPTIONS ---------- */
const TIME_OPTIONS = [
  { label: 'Evening',    value: '7:00 PM'  },
  { label: 'Night',      value: '8:30 PM'  },
  { label: 'Late Night', value: '10:00 PM' },
];

/* ---------- STATE ---------- */
let selectedFoods    = [];
let selectedTime     = null;
let heartsInterval   = null;

/* ---------- HELPERS ---------- */
function goToScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const next = document.getElementById(id);
  next.classList.add('active');
}

/* ---------- FLOATING HEARTS ---------- */
function spawnHeart() {
  const container = document.getElementById('hearts-container');
  const hearts    = ['💕','💗','💖','❤️','🩷','💓','💝'];
  const el        = document.createElement('span');

  el.className   = 'floating-heart';
  el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
  el.style.left  = Math.random() * 100 + 'vw';
  el.style.fontSize = (0.8 + Math.random() * 1.0) + 'rem';

  const dur = 6 + Math.random() * 8;
  el.style.animationDuration = dur + 's';
  el.style.animationDelay    = Math.random() * 2 + 's';

  container.appendChild(el);
  setTimeout(() => el.remove(), (dur + 2) * 1000);
}

function startHearts() {
  spawnHeart();
  heartsInterval = setInterval(spawnHeart, 900);
}

/* ---------- CONFETTI ---------- */
function launchConfetti() {
  const container = document.getElementById('confetti-container');
  const colors    = ['#e05c8a','#f7a8c4','#ffd0e8','#ffcce0','#c0456e','#ff90bb','#ffffff'];
  const count     = 90;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left            = Math.random() * 100 + 'vw';
    el.style.background      = colors[Math.floor(Math.random() * colors.length)];
    el.style.width           = (6 + Math.random() * 8) + 'px';
    el.style.height          = (6 + Math.random() * 8) + 'px';
    el.style.animationDuration = (1.8 + Math.random() * 2.4) + 's';
    el.style.animationDelay  = (Math.random() * 1.0) + 's';
    el.style.borderRadius    = Math.random() > 0.5 ? '50%' : '2px';
    container.appendChild(el);
    setTimeout(() => el.remove(), 5000);
  }
}

/* ---------- NO BUTTON DODGE ---------- */
function setupNoDodge() {
  const btnNo  = document.getElementById('btn-no');
  const screen = document.getElementById('screen-1');

  let dodgeCount = 0;
  const maxDodges = 12;

  function dodge(e) {
    if (dodgeCount >= maxDodges) return; // let them click after many tries (easter egg: it just says Yes)
    e.preventDefault();
    dodgeCount++;

    const bounds   = screen.getBoundingClientRect();
    const maxX     = bounds.width  - btnNo.offsetWidth  - 20;
    const maxY     = bounds.height - btnNo.offsetHeight - 20;

    const randX = Math.floor(Math.random() * maxX) + 10;
    const randY = Math.floor(Math.random() * maxY) + 10;

    btnNo.style.position = 'fixed';
    btnNo.style.left     = randX + 'px';
    btnNo.style.top      = randY + 'px';
    btnNo.style.zIndex   = '200';
    btnNo.style.transition = 'left 0.25s ease, top 0.25s ease';
  }

  btnNo.addEventListener('mouseover', dodge);
  btnNo.addEventListener('touchstart', dodge, { passive: false });
}

/* ---------- SCREEN 1 ---------- */
function initScreen1() {
  document.getElementById('btn-yes').addEventListener('click', () => {
    // Reset No button position
    const btnNo = document.getElementById('btn-no');
    btnNo.style.position = '';
    btnNo.style.left     = '';
    btnNo.style.top      = '';
    goToScreen('screen-2');
  });

  setupNoDodge();
}

/* ---------- SCREEN 2 ---------- */
function buildFoodGrid() {
  const grid = document.getElementById('food-grid');
  grid.innerHTML = '';

  FOOD_OPTIONS.forEach(opt => {
    const card = document.createElement('div');
    card.className   = 'food-card';
    card.dataset.label = opt.label;
    card.innerHTML   = `<span class="food-emoji">${opt.emoji}</span><span class="food-label">${opt.label}</span>`;

    card.addEventListener('click', () => {
      const idx = selectedFoods.indexOf(opt.label);
      if (idx === -1) {
        selectedFoods.push(opt.label);
        card.classList.add('selected');
      } else {
        selectedFoods.splice(idx, 1);
        card.classList.remove('selected');
      }
    });

    grid.appendChild(card);
  });
}

function initScreen2() {
  buildFoodGrid();

  document.getElementById('btn-food-continue').addEventListener('click', () => {
    if (selectedFoods.length === 0) {
      // Gentle shake prompt
      const btn = document.getElementById('btn-food-continue');
      btn.style.animation = 'none';
      btn.textContent = 'Pick at least one 😋';
      setTimeout(() => { btn.textContent = 'Continue'; }, 1800);
      return;
    }
    goToScreen('screen-3');
  });
}

/* ---------- SCREEN 3 ---------- */
function buildTimeOptions() {
  const container = document.getElementById('time-options');
  container.innerHTML = '';

  TIME_OPTIONS.forEach(opt => {
    const el = document.createElement('div');
    el.className   = 'time-option';
    el.innerHTML   = `<span class="time-label">${opt.label}</span><span class="time-value">${opt.value}</span>`;

    el.addEventListener('click', () => {
      document.querySelectorAll('.time-option').forEach(o => o.classList.remove('selected'));
      el.classList.add('selected');
      selectedTime = opt.value;
    });

    container.appendChild(el);
  });
}

function initScreen3() {
  buildTimeOptions();

  document.getElementById('btn-time-continue').addEventListener('click', () => {
    if (!selectedTime) {
      const btn = document.getElementById('btn-time-continue');
      btn.textContent = 'Choose a time first 🕐';
      setTimeout(() => { btn.textContent = 'Continue'; }, 1800);
      return;
    }
    buildInvitation();
    goToScreen('screen-4');
    setTimeout(launchConfetti, 200);
  });
}

/* ---------- SCREEN 4 — INVITATION ---------- */
function buildInvitation() {
  // Merge selected time from screen 3 (overrides config default)
  const finalTime = selectedTime || DATE_CONFIG.time;

  document.getElementById('inv-date').textContent     = DATE_CONFIG.date;
  document.getElementById('inv-time').textContent     = finalTime;
  document.getElementById('inv-location').textContent = DATE_CONFIG.location;
  document.getElementById('inv-food').textContent     = selectedFoods.join(' · ') || 'Surprise me!';
  document.getElementById('inv-quote').textContent    = `"${DATE_CONFIG.quote}"`;
}

/* ---------- CALENDAR (.ics) ---------- */
function generateICS() {
  // Build a simple iCalendar file
  const title       = 'Our Date ❤️';
  const description = `Can't wait to see you.\\nCuisine: ${selectedFoods.join(', ')}\\nLocation: ${DATE_CONFIG.location}`;

  // Use a fixed reference date (2026 June 20) — adjust year if needed
  const year    = new Date().getFullYear();
  const dateStr = `${year}0620`;

  // Parse time
  const timeMap = {
    '7:00 PM':  '190000',
    '8:30 PM':  '203000',
    '10:00 PM': '220000',
  };
  const endMap = {
    '7:00 PM':  '210000',
    '8:30 PM':  '223000',
    '10:00 PM': '000000',
  };
  const startT  = timeMap[selectedTime] || '190000';
  const endT    = endMap[selectedTime]  || '210000';

  const uid     = `date-${Date.now()}@romanticproposal.app`;
  const now     = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Romantic Proposal//EN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${dateStr}T${startT}`,
    `DTEND:${dateStr}T${endT}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${DATE_CONFIG.location}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'our-date.ics';
  a.click();
  URL.revokeObjectURL(url);
}

function initScreen4() {
  document.getElementById('btn-calendar').addEventListener('click', generateICS);
}

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
  startHearts();
  initScreen1();
  initScreen2();
  initScreen3();
  initScreen4();
});
