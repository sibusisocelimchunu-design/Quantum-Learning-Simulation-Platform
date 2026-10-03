/* =========================================================
   js/gates.js — X, Z, S, T, H as complex matrix operations
   on the shared engine state (qubit.js provides S/refresh).
   RY rotation lives in qubit.js (engine-resident).
   ========================================================= */
function applyGateToState(g){
  const before=stateLabel();
  if(g==='X'){const t=S.a;S.a=S.b;S.b=t;}
  else if(g==='Z'){S.b={re:-S.b.re,im:-S.b.im};}
  else if(g==='S'){S.b=C.mul(S.b,{re:0,im:1});}
  else if(g==='T'){S.b=C.mul(S.b,{re:Math.SQRT1_2,im:Math.SQRT1_2});}
  else if(g==='H'){
    const t=C.add(S.a,S.b),u=C.sub(S.a,S.b);
    S.a=C.scale(t,Math.SQRT1_2);S.b=C.scale(u,Math.SQRT1_2);
  }
  const after=stateLabel();
  setText('before-state',before); setText('after-state',after);
  const notes={
    X:'the quantum NOT.',
    H:'the superposition builder.',
    Z:'a phase flip — probabilities unchanged, but watch the needle flip to the other side.',
    S:'a 90° phase gate — probabilities unchanged, the needle sweeps a quarter way around the equator into 3D.',
    T:'a 45° phase gate — the fine phase adjuster; probabilities unchanged, needle moves halfway to |+i⟩.'
  };
  setHTML('gate-result','<strong>'+g+'</strong> applied: <strong>'+before+'</strong> → <strong>'+after+'</strong>. '+notes[g]);
  refresh();
}