/* =========================================================
   js/app.js — shared helpers, chart factory, navigation,
   scroll-reveal animations and the animated starfield
   ========================================================= */

/* ---------- shared helpers (used by every module) ---------- */
const $ = id => document.getElementById(id);
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pct = p => (p * 100).toFixed(2) + '%';
const fmt = x => { const v = Math.round(x * 1000) / 1000; return v === 0 ? 0 : v; };

if (typeof Chart !== 'undefined') {
  Chart.defaults.color = '#9aa5c4';
  Chart.defaults.borderColor = 'rgba(255,255,255,0.07)';
}

/* every module registers its chart here: charts.qubit, charts.quiz, ... */
const charts = {};

function makeChart(id, cfg) {
  if (typeof Chart === 'undefined') {
    $(id).outerHTML = '<p class="lead">⚠ Charts need an internet connection (Chart.js CDN).</p>';
    return null;
  }
  return new Chart($(id), cfg);
}

/* ---------- animated starfield background ---------- */
const sf = $('starfield'), sx = sf.getContext('2d');
let stars = [];
function initStars() {
  sf.width = innerWidth; sf.height = innerHeight;
  stars = Array.from({ length: 130 }, () => ({
    x: Math.random() * sf.width, y: Math.random() * sf.height,
    r: Math.random() * 1.4 + .3, s: Math.random() * .25 + .05, t: Math.random() * 6.28
  }));
}
function drawStars() {
  sx.clearRect(0, 0, sf.width, sf.height);
  stars.forEach(s => {
    s.y += s.s; if (s.y > sf.height) s.y = 0; s.t += .02;
    sx.beginPath(); sx.arc(s.x, s.y, s.r, 0, 7);
    sx.fillStyle = `rgba(255,255,255,${.3 + .35 * Math.sin(s.t)})`; sx.fill();
  });
  requestAnimationFrame(drawStars);
}
initStars(); drawStars(); addEventListener('resize', initStars);

/* ---------- scroll-reveal + mobile navigation ---------- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
}), { threshold: .08 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

document.querySelectorAll('#navLinks a').forEach(a =>
  a.addEventListener('click', () => $('navLinks').classList.remove('open')));

  /* ================= RESET CONTROLS ================= */
function resetQubit() {
  S.a = 1; S.b = 0; refresh();
  if (charts.shots) { charts.shots.data.datasets[0].data = [0, 0]; charts.shots.update(); }
  $('measure-result').innerHTML = 'Measurement results will appear here.';
}
function resetGates() {
  S.a = 1; S.b = 0; refresh();
  $('before-state').textContent = '|0⟩';
  $('after-state').textContent = '|0⟩';
  $('gate-result').innerHTML = 'Select a gate to begin.';
}
function resetBell() {
  bellReady = false;
  if (charts.bell) { charts.bell.data.datasets[0].data = [0, 0, 0, 0]; charts.bell.update(); }
  $('bell-result').innerHTML = 'Click "Create Bell State" to begin.';
  $('bell-samples').textContent = '';
  $('btn-bell-measure').disabled = true;
}
function resetAlgo() {
  if (charts.algo) { charts.algo.data.datasets[0].data = [0, 0]; charts.algo.update(); }
  $('algo-result').innerHTML = 'Choose a function type and press Run.';
  document.querySelectorAll('.astep').forEach(s => s.classList.remove('active', 'done'));
}
function resetQuiz() {
  quizQs = []; qi = 0; score = 0; answers = [];
  $('quiz-body').innerHTML = '<p>Click <strong>Start Quiz</strong> to begin. Score out of 5.</p>';
  $('btn-quiz').style.display = '';
  $('quiz-results-card').hidden = true;
  if (charts.quiz) { charts.quiz.data.datasets[0].data = [0, 5]; charts.quiz.update(); }
}
function resetAll() { resetQubit(); resetGates(); resetBell(); resetAlgo(); resetQuiz(); }