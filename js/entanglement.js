/* =========================================================
   js/entanglement.js — Bell-state |Φ⁺> demonstration:
   theory probabilities, 100 simulated pair measurements
   with a live outcomes chart and sample display.
   ========================================================= */

let bellReady = false;

charts.bell = makeChart('bellChart', {
  type: 'bar',
  data: {
    labels: ['|00⟩', '|01⟩', '|10⟩', '|11⟩'],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: ['rgba(34,211,238,.8)', 'rgba(255,255,255,.15)', 'rgba(255,255,255,.15)', 'rgba(244,114,182,.8)'],
      borderRadius: 10
    }]
  },
  options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, title: { display: true, text: '% / count' } } } }
});

function createBellState() {
  bellReady = true;
  if (charts.bell) { charts.bell.data.datasets[0].data = [50, 0, 0, 50]; charts.bell.update(); }
  $('bell-result').innerHTML =
    `🔗 Bell state created: <strong>|Φ⁺⟩ = (|00⟩ + |11⟩)/√2</strong>. ` +
    `Each qubit alone is random (50/50), but together they are perfectly correlated.`;
  $('btn-bell-measure').disabled = false;
  $('bell-samples').textContent = '';
}

function measureBellShots() {
  if (!bellReady) return;
  const counts = [0, 0, 0, 0], names = ['00', '01', '10', '11'], samples = [];
  for (let i = 0; i < 100; i++) {
    const r = Math.random() < .5 ? 0 : 3;   // only 00 or 11 ever occur
    counts[r]++;
    if (i < 8) samples.push(names[r]);
  }
  if (charts.bell) { charts.bell.data.datasets[0].data = counts; charts.bell.update(); }
  $('bell-result').innerHTML =
    `📊 100 entangled pairs measured: <strong>|00⟩ ${counts[0]}×</strong>, <strong>|11⟩ ${counts[3]}×</strong>, |01⟩ 0×, |10⟩ 0×.`;
  $('bell-samples').innerHTML =
    `First 8 pairs: <strong>${samples.join(', ')}</strong> — notice 01 and 10 <em>never</em> appear. Perfect correlation!`;
}