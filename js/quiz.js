/* =========================================================
   js/quiz.js — knowledge check: 10-question bank, 5 random
   questions per round, instant feedback with explanations,
   exact scoring out of 5, results doughnut, answer review.
   ========================================================= */

const QUIZ_BANK = [
  { q: 'A qubit can exist in a blend of |0⟩ and |1⟩ at the same time. What is this called?', options: ['Superposition', 'Entanglement', 'Decoherence', 'Interference'], answer: 0, explain: 'Superposition means the qubit is described by both amplitudes at once: |ψ⟩ = α|0⟩ + β|1⟩.' },
  { q: 'What does the X gate do to |0⟩?', options: ['Creates superposition', 'Flips it to |1⟩', 'Leaves it unchanged', 'Changes only its phase'], answer: 1, explain: 'X is the quantum NOT gate: X|0⟩ = |1⟩ and X|1⟩ = |0⟩.' },
  { q: 'Applying a Hadamard (H) gate to |0⟩ produces…', options: ['|1⟩', '−|0⟩', 'An equal 50/50 superposition of |0⟩ and |1⟩', 'A permanently random state'], answer: 2, explain: 'H|0⟩ = |+⟩ = (|0⟩ + |1⟩)/√2 — equal amplitudes, so each outcome has exactly 50% probability.' },
  { q: 'For |ψ⟩ = α|0⟩ + β|1⟩, the probability of measuring |0⟩ is…', options: ['α', '|β|²', 'α + β', '|α|²'], answer: 3, explain: 'The Born rule: probability equals the squared magnitude of the amplitude, so P(|0⟩) = |α|².' },
  { q: 'When you measure a qubit in superposition, it…', options: ['Collapses to |0⟩ or |1⟩', 'Stays in superposition', 'Becomes entangled', 'Speeds up'], answer: 0, explain: 'Measurement collapses the state to one definite outcome — you can never observe the amplitudes directly.' },
  { q: 'The Bell state |Φ⁺⟩ = (|00⟩ + |11⟩)/√2 is the classic example of…', options: ['Error correction', 'Decoherence', 'Quantum tunnelling', 'Entanglement'], answer: 3, explain: 'Both qubits are perfectly correlated — you only ever see 00 or 11, never 01 or 10.' },
  { q: 'What does the Z gate do?', options: ['Swaps |0⟩ and |1⟩', 'Flips the phase of |1⟩ (Z|1⟩ = −|1⟩)', 'Measures the qubit', 'Creates entanglement'], answer: 1, explain: 'Z multiplies the |1⟩ component by −1. It changes phase, not the measurement probabilities of basis states.' },
  { q: 'The Bloch sphere is used to…', options: ['Cool the processor', 'Visualise the state of a single qubit', 'Store many qubits', 'Correct errors'], answer: 1, explain: 'Every single-qubit state is a point on the Bloch sphere — this platform shows a 2D slice of it.' },
  { q: 'Superconducting qubits (used by IBM and Google) must be kept…', options: ['At room temperature', 'In direct sunlight', 'Near absolute zero (~15 millikelvin)', 'Under water'], answer: 2, explain: 'They only behave quantum-mechanically at millikelvin temperatures — colder than deep space.' },
  { q: 'Quantum computers can outperform classical ones because…', options: ['They have larger hard drives', 'Superposition and entanglement let them process many possibilities at once', 'They skip electricity', 'They use faster internet'], answer: 1, explain: 'n entangled qubits track 2ⁿ amplitudes simultaneously — the source of quantum speed-ups.' }
];

let quizQs = [], qi = 0, score = 0, answers = [];

charts.quiz = makeChart('quizChart', {
  type: 'doughnut',
  data: { labels: ['Correct', 'Incorrect'], datasets: [{ data: [0, 5], backgroundColor: ['#34d399', 'rgba(244,63,94,.7)'], borderWidth: 0 }] },
  options: { cutout: '68%', plugins: { legend: { position: 'bottom' } } }
});

function startQuiz() {
  quizQs = shuffle([...QUIZ_BANK]).slice(0, 5);   // 5 random questions from the bank of 10
  qi = 0; score = 0; answers = [];
  $('btn-quiz').style.display = 'none';
  $('quiz-results-card').hidden = true;
  renderQuestion();
}

function renderQuestion() {
  const Q = quizQs[qi];
  $('quiz-body').innerHTML = `
    <div class="quiz-top"><span class="chip">Question ${qi + 1} of 5</span><span class="chip score-chip">Score: ${score}</span></div>
    <div class="progress"><div class="progress-fill" style="width:${qi / 5 * 100}%"></div></div>
    <h4 class="quiz-q">${Q.q}</h4>
    <div class="options">${Q.options.map((o, i) => `<button class="option" onclick="pickAnswer(${i},this)">${o}</button>`).join('')}</div>
    <div id="feedback"></div>`;
}

function pickAnswer(i, btn) {
  const Q = quizQs[qi];
  const buttons = [...document.querySelectorAll('.option')];
  buttons.forEach(b => b.disabled = true);        // lock — one answer per question

  const ok = (i === Q.answer);                    // single source of truth: index comparison
  if (ok) score++;
  answers.push({ q: Q.q, chosen: Q.options[i], correct: Q.options[Q.answer], ok });

  btn.classList.add(ok ? 'correct' : 'wrong');
  if (!ok) buttons[Q.answer].classList.add('correct');

  $('feedback').innerHTML = `
    <div class="explain ${ok ? 'good' : 'bad'}"><strong>${ok ? '✓ Correct!' : '✗ Not quite.'}</strong> ${Q.explain}</div>
    <button class="btn next-btn" onclick="nextQuestion()">${qi === 4 ? 'See Results →' : 'Next Question →'}</button>`;
  document.querySelector('.score-chip').textContent = `Score: ${score}`;
}

function nextQuestion() { qi++; if (qi < 5) renderQuestion(); else showQuizResults(); }

function showQuizResults() {
  qhSave(score);
  const msg = score === 5 ? '🏆 Perfect score! You are officially quantum-literate.'
    : score === 4 ? '🌟 Excellent — you clearly understand the fundamentals.'
    : score === 3 ? '👍 Good effort — review the sections above and try again.'
    : '📚 Keep learning — replay the simulator and gates, then retry for 5 fresh questions.';

  $('quiz-body').innerHTML = `
    <div class="quiz-score"><span class="big-score">${score}<small>/5</small></span><p>${msg}</p></div>
    <div class="progress"><div class="progress-fill" style="width:100%"></div></div>`;

  $('quiz-review').innerHTML = `<h3 style="margin-bottom:8px">Answer Review</h3>` + answers.map(a => `
    <div class="review-item ${a.ok ? 'good' : 'bad'}"><strong>${a.ok ? '✓' : '✗'} ${a.q}</strong><br>
    Your answer: ${a.chosen}${a.ok ? '' : `<br>Correct answer: <strong>${a.correct}</strong>`}</div>`).join('');

  if (charts.quiz) { charts.quiz.data.datasets[0].data = [score, 5 - score]; charts.quiz.update(); }

  $('btn-quiz').style.display = '';
  $('quiz-results-card').hidden = false;
  $('quiz-results-card').scrollIntoView({ behavior: 'smooth' });
}

/* =========================================================
   Persistent round history — localStorage. Survives page
   refreshes; graceful no-op if storage is unavailable.
   ========================================================= */
function qhLoad() {
  try { return JSON.parse(localStorage.getItem('qlp_history') || '[]'); } catch (e) { return []; }
}
function qhSave(score) {
  const h = qhLoad();
  h.push({ d: new Date().toLocaleDateString(), s: score });
  try { localStorage.setItem('qlp_history', JSON.stringify(h)); } catch (e) {}
  qhRenderStats();
}
function qhRenderStats() {
  const h = qhLoad(), el = $('quiz-stats');
  if (!el) return;
  if (!h.length) { el.textContent = 'No rounds played yet — your history will appear here.'; return; }
  const best = Math.max(...h.map(r => r.s));
  const avg = (h.reduce((t, r) => t + r.s, 0) / h.length).toFixed(1);
  el.innerHTML = '📚 Rounds played: <strong>' + h.length + '</strong> · Personal best: <strong>' + best + '/5</strong> · Average: <strong>' + avg + '/5</strong>';
}
qhRenderStats();

function qhClear() {
  if (!confirm('Clear all quiz history? This cannot be undone.')) return;
  try { localStorage.removeItem('qlp_history'); } catch (e) {}
  qhRenderStats();
}