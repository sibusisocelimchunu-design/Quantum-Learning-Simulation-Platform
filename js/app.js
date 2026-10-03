/* =========================================================
   js/app.js — shared engine (multi-page edition).
   Null-safe: every helper tolerates missing elements, so
   each page loads only the modules it needs.
   ========================================================= */

/* ---------- helpers ---------- */
const $ = id => document.getElementById(id);
function setHTML(id, h) { const el = $(id); if (el) el.innerHTML = h; }
function setText(id, t) { const el = $(id); if (el) el.textContent = t; }
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pct = p => (p * 100).toFixed(2) + '%';
const fmt = x => { const v = Math.round(x * 1000) / 1000; return v === 0 ? 0 : v; };

if (typeof Chart !== 'undefined') { Chart.defaults.color = '#9aa5c4'; Chart.defaults.borderColor = 'rgba(255,255,255,0.07)'; }

/* ---------- crash-proof chart factory ---------- */
const charts = {};
function makeChart(id, cfg) {
  if (typeof Chart === 'undefined' || !$(id)) return null;
  try { return new Chart($(id), cfg); } catch (e) { console.warn('Chart ' + id + ' failed:', e); return null; }
}

/* ---------- starfield ---------- */
const sf = $('starfield'), sx = sf.getContext('2d'); let stars = [];
function initStars() { sf.width = innerWidth; sf.height = innerHeight; stars = Array.from({ length: 130 }, () => ({ x: Math.random() * sf.width, y: Math.random() * sf.height, r: Math.random() * 1.4 + .3, s: Math.random() * .25 + .05, t: Math.random() * 6.28 })); }
function drawStars() { sx.clearRect(0, 0, sf.width, sf.height); stars.forEach(s => { s.y += s.s; if (s.y > sf.height) s.y = 0; s.t += .02; sx.beginPath(); sx.arc(s.x, s.y, s.r, 0, 7); sx.fillStyle = 'rgba(255,255,255,' + (.3 + .35 * Math.sin(s.t)) + ')'; sx.fill(); }); requestAnimationFrame(drawStars); }
initStars(); drawStars(); addEventListener('resize', initStars);

/* ---------- scroll reveal + mobile nav ---------- */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }), { threshold: .08 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
document.querySelectorAll('#navLinks a').forEach(a => a.addEventListener('click', () => $('navLinks').classList.remove('open')));

/* ---------- reset controls (all null-safe) ---------- */
function resetQubit() {
  if (typeof S === 'undefined') return;               // qubit engine not on this page
  S.a = { re: 1, im: 0 }; S.b = { re: 0, im: 0 };
  if (typeof resetRY === 'function') resetRY();
  refresh();
  if (charts.shots) { charts.shots.data.datasets[0].data = [0, 0]; charts.shots.update(); }
  setHTML('measure-result', 'Measurement results will appear here.');
  try { sessionStorage.removeItem('qlp_qstate'); } catch (e) {}
}
function resetGates() {
  if (typeof S === 'undefined') return;
  S.a = { re: 1, im: 0 }; S.b = { re: 0, im: 0 };
  if (typeof resetRY === 'function') resetRY();
  refresh();
  setText('before-state', '|0⟩'); setText('after-state', '|0⟩');
  setHTML('gate-result', 'Select a gate to begin.');
}
function resetBell() {
  if (typeof bellReady === 'undefined') return;
  bellReady = false;
  if (charts.bell) { charts.bell.data.datasets[0].data = [0, 0, 0, 0]; charts.bell.update(); }
  setHTML('bell-result', 'Click "Create Bell State" to begin.');
  setText('bell-samples', '');
  const b = $('btn-bell-measure'); if (b) b.disabled = true;
}
function resetAlgo() {
  if (typeof charts.algo === 'undefined' && !$('algo-result')) return;
  if (charts.algo) { charts.algo.data.datasets[0].data = [0, 0]; charts.algo.update(); }
  setHTML('algo-result', 'Choose a function type and press Run.');
  document.querySelectorAll('.astep').forEach(s => s.classList.remove('active', 'done'));
}
function resetQuiz() {
  if (typeof quizQs === 'undefined') return;
  quizQs = []; qi = 0; score = 0; answers = [];
  setHTML('quiz-body', '<p>Click <strong>Start Quiz</strong> to begin. Score out of 5.</p>');
  const b = $('btn-quiz'); if (b) b.style.display = '';
  const c = $('quiz-results-card'); if (c) c.hidden = true;
  if (charts.quiz) { charts.quiz.data.datasets[0].data = [0, 5]; charts.quiz.update(); }
}
function resetLab() {
  if (typeof V === 'undefined') return;
  V = [{ re: 1, im: 0 }, { re: 0, im: 0 }, { re: 0, im: 0 }, { re: 0, im: 0 }];
  setHTML('lab-msg', '');
  if (typeof labUpdate === 'function') labUpdate();
}
function resetAll() {
  if (typeof resetQubit === 'function') resetQubit();
  if (typeof resetGates === 'function') resetGates();
  if (typeof resetBell === 'function') resetBell();
  if (typeof resetAlgo === 'function') resetAlgo();
  if (typeof resetLab === 'function') resetLab();
  if (typeof resetQuiz === 'function') resetQuiz();
}