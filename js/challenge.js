/* =========================================================
   js/challenge.js — Challenge Mode: reach a mystery target
   state from |0> using X, H, Z. Own local state — never
   touches the main simulator's state object S.
   ========================================================= */
let chTarget = null, chAttempts = 0, chSolved = 0;
let chState = { a: 1, b: 0 };

function chApplyGate(st, g) {
  if (g === 'X') return { a: st.b, b: st.a };
  if (g === 'Z') return { a: st.a, b: -st.b };
  return { a: (st.a + st.b) / Math.SQRT2, b: (st.a - st.b) / Math.SQRT2 };
}
function chLabel(st) {
  const e = 1e-6;
  if (Math.abs(Math.abs(st.a) - 1) < e) return st.a > 0 ? '|0⟩' : '−|0⟩';
  if (Math.abs(Math.abs(st.b) - 1) < e) return st.b > 0 ? '|1⟩' : '−|1⟩';
  if (Math.abs(Math.abs(st.a) - Math.SQRT1_2) < e && Math.abs(Math.abs(st.b) - Math.SQRT1_2) < e)
    return (st.a > 0) === (st.b > 0) ? '|+⟩' : '|−⟩';
  return '(' + fmt(st.a) + ')|0⟩ + (' + fmt(st.b) + ')|1⟩';
}
function chDescribe(st) {
  return '<strong>' + chLabel(st) + '</strong> · P(|0⟩)=' + pct(st.a * st.a) + ', P(|1⟩)=' + pct(st.b * st.b);
}
function chNew() {
  const gates = ['X', 'H', 'Z'];
  let st, tries = 0;
  do {
    st = { a: 1, b: 0 };
    const n = 2 + Math.floor(Math.random() * 2);   // 2 or 3 gates
    for (let i = 0; i < n; i++) st = chApplyGate(st, gates[Math.floor(Math.random() * 3)]);
    tries++;
  } while (Math.abs(st.a * st.a - 1) < 1e-6 && tries < 20);   // reject trivial |0⟩-like targets
  chTarget = st; chState = { a: 1, b: 0 }; chAttempts = 0;
  $('ch-target').innerHTML = chDescribe(st) +
    '<br><small>Needle direction matters — |+⟩ and |−⟩ have identical probabilities but are different states.</small>';
  $('ch-feedback').hidden = true;
  chUpdate();
}
function chApply(g) {
  if (!chTarget) { $('ch-target').textContent = 'Press "🎲 New Challenge" first.'; return; }
  chState = chApplyGate(chState, g);
  chAttempts++;
  const eps = 1e-6, same = (x, y) => Math.abs(x - y) < eps;
  // exact match up to a global sign (global phase is physically irrelevant)
  const exact = (same(chState.a, chTarget.a) && same(chState.b, chTarget.b)) ||
                (same(chState.a, -chTarget.a) && same(chState.b, -chTarget.b));
  const sameProbs = Math.abs(chState.a * chState.a - chTarget.a * chTarget.a) < eps &&
                    Math.abs(chState.b * chState.b - chTarget.b * chTarget.b) < eps;
  $('ch-feedback').hidden = false;
  if (exact) {
    chSolved++; chTarget = null;
    $('ch-feedback').innerHTML = '<strong>🎉 Solved in ' + chAttempts + ' gate' + (chAttempts === 1 ? '' : 's') + '!</strong> Total solved: ' + chSolved + '. Press 🎲 for the next one.';
  } else if (sameProbs) {
    $('ch-feedback').innerHTML = 'Right probabilities, wrong phase! The needle points the wrong way — try <strong>Z</strong>.';
  } else {
    $('ch-feedback').innerHTML = 'Not yet. You are at ' + chDescribe(chState) + '.';
  }
  chUpdate();
}
function chReset() { chState = { a: 1, b: 0 }; chUpdate(); }
function chUpdate() {
  $('ch-current').innerHTML = chDescribe(chState);
  $('ch-attempts').textContent = 'Attempts: ' + chAttempts + ' · Solved: ' + chSolved;
}