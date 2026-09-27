/* =========================================================
   js/gates.js — X, H and Z gate mathematics.
   These operate on the SAME live state vector (S) defined
   in qubit.js, so the Bloch diagram and both charts stay in
   sync across Sections 1 and 2.
   ========================================================= */

function applyGateToState(g) {
  const before = stateLabel();

  if (g === 'X') {                    // quantum NOT: swap amplitudes
    const t = S.a; S.a = S.b; S.b = t;
  }
  else if (g === 'Z') {               // phase flip on |1>
    S.b = -S.b;
  }
  else if (g === 'H') {               // Hadamard matrix multiplication
    const a = (S.a + S.b) / Math.SQRT2;
    const b = (S.a - S.b) / Math.SQRT2;
    S.a = a; S.b = b;
  }

  const after = stateLabel();
  $('before-state').textContent = before;
  $('after-state').textContent = after;

  $('gate-result').innerHTML = (before === after)
    ? `<strong>${g}</strong> gate applied: <strong>${before}</strong> → <strong>${after}</strong>. ` +
      `No visible change — for ${g === 'Z' ? 'basis states a phase flip has no measurable effect' : 'this input the gate acts trivially'}.`
    : `<strong>${g}</strong> gate applied: <strong>${before}</strong> → <strong>${after}</strong>. ` +
      `Probabilities updated below and in Section 1.`;

  refresh();
}