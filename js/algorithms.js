/* =========================================================
   js/algorithms.js — Deutsch's algorithm demonstration:
   animated circuit steps, guaranteed-correct verdicts
   (constant → |0>, balanced → |1>) and a 10-run chart.
   ========================================================= */

charts.algo = makeChart('algoChart', {
  type: 'bar',
  data: {
    labels: ['Measured 0 (constant)', 'Measured 1 (balanced)'],
    datasets: [{ data: [0, 0], backgroundColor: ['rgba(34,211,238,.8)', 'rgba(244,114,182,.8)'], borderRadius: 10 }]
  },
  options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, title: { display: true, text: 'runs out of 10' } } } }
});

function runAlgorithm() {
  const sel = $('algo-type').value;
  const type = sel === 'random' ? (Math.random() < .5 ? 'constant' : 'balanced') : sel;
  const steps = [...document.querySelectorAll('.astep')];
  let i = 0;
  $('algo-result').innerHTML = '⏳ Running quantum circuit…';

  const t = setInterval(() => {
    if (i < steps.length) {
      steps.forEach((s, k) => { s.classList.toggle('active', k === i); s.classList.toggle('done', k < i); });
      i++;
    } else {
      clearInterval(t);
      steps.forEach(s => { s.classList.remove('active'); s.classList.add('done'); });
      finishDeutsch(type);
    }
  }, 700);
}

function finishDeutsch(type) {
  const target = type === 'balanced' ? 1 : 0, counts = [0, 0];
  counts[target] = 10;
  if (charts.algo) { charts.algo.data.datasets[0].data = counts; charts.algo.update(); }
  $('algo-result').innerHTML = type === 'constant'
    ? `✅ The function is <strong>CONSTANT</strong> (same output for every input). Measured <strong>|0⟩</strong> in all 10 runs — with certainty. A classical computer would need <em>two</em> function evaluations to be sure; Deutsch's algorithm needed only <strong>one</strong>.`
    : `✅ The function is <strong>BALANCED</strong> (outputs 0 for one input, 1 for the other). Measured <strong>|1⟩</strong> in all 10 runs — with certainty. One quantum evaluation replaced two classical ones!`;
}