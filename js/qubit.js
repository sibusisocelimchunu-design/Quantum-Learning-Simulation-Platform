/* =========================================================
   js/qubit.js — real single-qubit state-vector simulation,
   Born-rule probabilities, measurement, 100-shot histogram,
   animated Bloch-circle diagram and the two qubit charts
   ========================================================= */

/* ---------- state vector (real amplitudes: enough for |0>, |1>, |+> with X, H, Z) ---------- */
const S = { a: 1, b: 0 };                       // |ψ> = a|0> + b|1>
const P0 = () => S.a * S.a;                     // Born rule: |a|²
const P1 = () => S.b * S.b;                     // Born rule: |b|²

function stateLabel() {
  const e = 1e-6, { a, b } = S;
  if (Math.abs(Math.abs(a) - 1) < e) return a > 0 ? '|0⟩' : '−|0⟩';
  if (Math.abs(Math.abs(b) - 1) < e) return b > 0 ? '|1⟩' : '−|1⟩';
  if (Math.abs(Math.abs(a) - Math.SQRT1_2) < e && Math.abs(Math.abs(b) - Math.SQRT1_2) < e)
    return (a > 0) === (b > 0) ? '|+⟩' : '|−⟩';
  return `(${fmt(a)})|0⟩ + (${fmt(b)})|1⟩`;
}

function setQubitState(s) {
  const M = { '0': [1, 0], '1': [0, 1], '+': [Math.SQRT1_2, Math.SQRT1_2] }[s];
  S.a = M[0]; S.b = M[1]; refresh();
  $('measure-result').innerHTML =
    `State set to <strong>${stateLabel()}</strong>${s === '+' ? ' — a perfect 50/50 superposition!' : '.'}`;
}

/* master update: text, stats, chart and Bloch diagram */
function refresh() {
  $('qubit-state').innerHTML = `Current State: <strong>${stateLabel()}</strong>`;
  $('qubit-amps').textContent = `|ψ⟩ = ${fmt(S.a)}|0⟩ ${S.b < 0 ? '−' : '+'} ${Math.abs(fmt(S.b))}|1⟩`;
  $('stat-p0').textContent = pct(P0());
  $('stat-p1').textContent = pct(P1());
  if (charts.qubit) {
    charts.qubit.data.datasets[0].data = [Math.round(P0() * 100), Math.round(P1() * 100)];
    charts.qubit.update();
  }
  blochTarget = { x: 2 * S.a * S.b, z: S.a * S.a - S.b * S.b };
  $('after-state').textContent = stateLabel();
}

/* ---------- measurement ---------- */
function measureQubit() {
  const p0 = P0(), p1 = P1(), res = Math.random() < p0 ? 0 : 1;
  if (res === 0) { S.a = 1; S.b = 0; } else { S.a = 0; S.b = 1; }
  refresh();
  $('measure-result').innerHTML =
    `📷 Measured <strong>|${res}⟩</strong> — the superposition <em>collapsed</em>. ` +
    `Before: P(|0⟩)=${pct(p0)}, P(|1⟩)=${pct(p1)}. The state is now exactly |${res}⟩.`;
}

function runShots() {
  let c0 = 0;
  for (let i = 0; i < 100; i++) if (Math.random() < P0()) c0++;
  if (charts.shots) { charts.shots.data.datasets[0].data = [c0, 100 - c0]; charts.shots.update(); }
  $('measure-result').innerHTML =
    `📊 100 shots on <strong>${stateLabel()}</strong>: |0⟩ ${c0}×, |1⟩ ${100 - c0}× — matching theory P(|0⟩)=${pct(P0())}.`;
}

/* ---------- animated Bloch-circle diagram ---------- */
const bl = $('bloch'), bx = bl.getContext('2d');
let blochTarget = { x: 0, z: 1 }, blochCur = { x: 0, z: 1 };

function drawBloch() {
  const W = bl.width, H = bl.height, cx = W / 2, cy = H / 2, R = H / 2 - 32;
  bx.clearRect(0, 0, W, H);
  bx.strokeStyle = 'rgba(255,255,255,.25)'; bx.lineWidth = 2;
  bx.beginPath(); bx.arc(cx, cy, R, 0, 7); bx.stroke();
  bx.strokeStyle = 'rgba(255,255,255,.1)'; bx.lineWidth = 1;
  bx.beginPath(); bx.moveTo(cx - R, cy); bx.lineTo(cx + R, cy);
  bx.moveTo(cx, cy - R); bx.lineTo(cx, cy + R); bx.stroke();
  bx.fillStyle = '#9aa5c4'; bx.font = '14px Inter,sans-serif'; bx.textAlign = 'center';
  bx.fillText('|0⟩', cx, cy - R - 12); bx.fillText('|1⟩', cx, cy + R + 22);
  bx.fillText('|+⟩', cx + R + 22, cy + 5); bx.fillText('|−⟩', cx - R - 22, cy + 5);
  const px = cx + blochCur.x * R, py = cy - blochCur.z * R;
  const g = bx.createLinearGradient(cx, cy, px, py);
  g.addColorStop(0, '#22d3ee'); g.addColorStop(1, '#f472b6');
  bx.strokeStyle = g; bx.lineWidth = 3.5;
  bx.beginPath(); bx.moveTo(cx, cy); bx.lineTo(px, py); bx.stroke();
  bx.beginPath(); bx.arc(px, py, 7, 0, 7);
  bx.fillStyle = '#f472b6'; bx.shadowColor = '#f472b6'; bx.shadowBlur = 16;
  bx.fill(); bx.shadowBlur = 0;
}
(function blochLoop() {
  blochCur.x += (blochTarget.x - blochCur.x) * .1;
  blochCur.z += (blochTarget.z - blochCur.z) * .1;
  drawBloch(); requestAnimationFrame(blochLoop);
})();

/* ---------- charts for this section ---------- */
charts.qubit = makeChart('qubitChart', {
  type: 'bar',
  data: { labels: ['|0⟩', '|1⟩'], datasets: [{ data: [100, 0], backgroundColor: ['rgba(34,211,238,.8)', 'rgba(244,114,182,.8)'], borderRadius: 10 }] },
  options: { plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100, ticks: { callback: v => v + '%' } } } }
});

charts.shots = makeChart('shotsChart', {
  type: 'bar',
  data: { labels: ['Measured |0⟩', 'Measured |1⟩'], datasets: [{ data: [0, 0], backgroundColor: ['rgba(34,211,238,.8)', 'rgba(244,114,182,.8)'], borderRadius: 10 }] },
  options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, title: { display: true, text: 'shots out of 100' } } } }
});

/* ---------- init ---------- */
refresh();