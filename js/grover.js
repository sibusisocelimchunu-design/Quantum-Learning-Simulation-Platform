/* =========================================================
   js/grover.js — Grover's search on 2 qubits (N = 4 items).
   State = 4 real amplitudes for |00>,|01>,|10>,|11>.
   Grover iteration:  D·O·v   where  O = oracle phase flip,
   D = H² · (2|0⟩⟨0| − I) · H²   — applied in exactly that
   order: H² FIRST, then negate-all-but-zero, then H² again.
   For N = 4 one iteration amplifies the marked state to 100%.
   ========================================================= */
const H2 = [[.5, .5, .5, .5],
            [.5, -.5, .5, -.5],
            [.5, .5, -.5, -.5],
            [.5, -.5, -.5, .5]];
const h2 = v => H2.map(r => r.reduce((s, x, i) => s + x * v[i], 0));
const G2 = ['|00⟩', '|01⟩', '|10⟩', '|11⟩'];

charts.grover = makeChart('groverChart', {
  type: 'bar',
  data: { labels: G2, datasets: [{ data: [25, 25, 25, 25], backgroundColor: ['rgba(34,211,238,.8)', 'rgba(167,139,250,.8)', 'rgba(129,140,248,.8)', 'rgba(244,114,182,.8)'], borderRadius: 8 }] },
  options: { plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100, ticks: { callback: v => v + '%' } } } }
});

function runGrover() {
  const sel = $('grover-target').value;
  const m = sel === 'rand' ? Math.floor(Math.random() * 4) : Number(sel);
  let v = [0.5, 0.5, 0.5, 0.5];                       // uniform superposition
  const setChart = arr => { if (charts.grover) { charts.grover.data.datasets[0].data = arr.map(x => Math.round(x * x * 1000) / 10); charts.grover.update(); } };
  setChart(v);
  $('grover-result').innerHTML = '⏳ Step 0 — uniform superposition: all four states at 25%. Querying the oracle…';

  setTimeout(() => {
    v[m] = -v[m];                                     // ORACLE: phase flip on the marked state
    setChart(v);
    $('grover-result').innerHTML = '🔒 Oracle queried <strong>once</strong> — it marked ' + G2[m] +
      ' with a phase flip. Probabilities <em>unchanged</em>: 25% each. The answer is hidden in the phases!';
  }, 900);

  setTimeout(() => {
    v = h2(v);                                        // diffusion step, order matters:
    v = v.map((x, i) => i === 0 ? x : -x);            //   H²  →  (2|0⟩⟨0| − I)  →  H²
    v = h2(v);
    setChart(v);
    const p = Math.round(v[m] * v[m] * 100);
    $('grover-result').innerHTML = '✅ After interference: <strong>' + G2[m] + ' at ' + p +
      '%</strong>. Classical search needs up to 3 checks — <strong>Grover found it with 1 query</strong>.';
  }, 2000);
}