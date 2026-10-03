/* =========================================================
   js/gates.js — X, Z, S, T, H as complex matrix operations
   on the shared state; RY continuous real rotation.
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
  $('before-state').textContent=before;$('after-state').textContent=after;
  const notes={
    X:'the quantum NOT.',
    H:'the superposition builder.',
    Z:'a phase flip — probabilities unchanged, but watch the needle flip to the other side.',
    S:'a 90° phase gate — probabilities unchanged, the needle sweeps a quarter way around the equator into 3D.',
    T:'a 45° phase gate — the fine phase adjuster; probabilities unchanged, needle moves halfway to |+i⟩.'
  };
  $('gate-result').innerHTML='<strong>'+g+'</strong> applied: <strong>'+before+'</strong> → <strong>'+after+'</strong>. '+notes[g];
  refresh();
}

let ryPrev=0;
function resetRY(){ryPrev=0;const s=$('ry-slider');if(s)s.value=0;const l=$('ry-deg');if(l)l.textContent='0';}
function ryOnInput(val){
  const deg=Number(val),d=deg-ryPrev;ryPrev=deg;
  $('ry-deg').textContent=deg;
  if(d!==0){
    const t=d*Math.PI/180,c=Math.cos(t/2),s=Math.sin(t/2),A=S.a,B=S.b;
    S.a={re:c*A.re-s*B.re,im:c*A.im-s*B.im};
    S.b={re:s*A.re+c*B.re,im:s*A.im+c*B.im};
    refresh();
  }
}