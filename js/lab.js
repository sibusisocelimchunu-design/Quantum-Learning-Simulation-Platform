/* =========================================================
   js/lab.js — Two-Qubit Lab: real 4-amplitude state vector,
   gates on either qubit, CNOT both directions, live
   entanglement detection via the separability determinant
   (det = v00·v11 − v01·v10; 0 ⟺ product state), and
   guided Bell-state construction. |00⟩=0 |01⟩=1 |10⟩=2 |11⟩=3
   ========================================================= */
const Q2NAMES = ['|00⟩','|01⟩','|10⟩','|11⟩'];
let V = [{re:1,im:0},{re:0,im:0},{re:0,im:0},{re:0,im:0}];
const R2 = Math.SQRT1_2;
let labBusy = false;

/* ---------- gate primitives (mutate V) ---------- */
function g_h1(){const a=V[0],b=V[2],c=V[1],d=V[3];
  V[0]={re:(a.re+b.re)*R2,im:(a.im+b.im)*R2};V[2]={re:(a.re-b.re)*R2,im:(a.im-b.im)*R2};
  V[1]={re:(c.re+d.re)*R2,im:(c.im+d.im)*R2};V[3]={re:(c.re-d.re)*R2,im:(c.im-d.im)*R2};}
function g_h2(){const a=V[0],b=V[1],c=V[2],d=V[3];
  V[0]={re:(a.re+b.re)*R2,im:(a.im+b.im)*R2};V[1]={re:(a.re-b.re)*R2,im:(a.im-b.im)*R2};
  V[2]={re:(c.re+d.re)*R2,im:(c.im+d.im)*R2};V[3]={re:(c.re-d.re)*R2,im:(c.im-d.im)*R2};}
function g_x1(){const t=V[0];V[0]=V[2];V[2]=t;const u=V[1];V[1]=V[3];V[3]=u;}
function g_x2(){const t=V[0];V[0]=V[1];V[1]=t;const u=V[2];V[2]=V[3];V[3]=u;}
function g_z1(){V[2]={re:-V[2].re,im:-V[2].im};V[3]={re:-V[3].re,im:-V[3].im};}
function g_z2(){V[1]={re:-V[1].re,im:-V[1].im};V[3]={re:-V[3].re,im:-V[3].im};}
function g_cnot12(){const t=V[2];V[2]=V[3];V[3]=t;}   /* control q1=1 → flip q2 */
function g_cnot21(){const t=V[1];V[1]=V[3];V[3]=t;}   /* control q2=1 → flip q1 */
const LAB_GATES={h1:g_h1,h2:g_h2,x1:g_x1,x2:g_x2,z1:g_z1,z2:g_z2,cnot12:g_cnot12,cnot21:g_cnot21};

function labGate(name){ if(labBusy)return; LAB_GATES[name](); labUpdate(); }

/* ---------- labelling ---------- */
function labAmps(){
  return V.map((v,i)=>{
    if(Math.abs(v.re)<1e-6&&Math.abs(v.im)<1e-6) return null;
    const s=Math.abs(v.im)<1e-6? String(fmt(v.re)) : fmt(v.re)+(v.im<0?'−':'+')+Math.abs(fmt(v.im))+'i';
    return s+Q2NAMES[i];
  }).filter(Boolean).join(' + ')||'0';
}
function labLabel(){
  const p=V.map(v=>v.re*v.re+v.im*v.im), e=1e-6;
  const isPhi=Math.abs(p[0]-.5)<e&&Math.abs(p[3]-.5)<e&&p[1]<e&&p[2]<e;
  const isPsi=Math.abs(p[1]-.5)<e&&Math.abs(p[2]-.5)<e&&p[0]<e&&p[3]<e;
  if(isPhi) return (V[0].re*V[3].re+V[0].im*V[3].im>0)?'|Φ⁺⟩':'|Φ⁻⟩';
  if(isPsi) return (V[1].re*V[2].re+V[1].im*V[2].im>0)?'|Ψ⁺⟩':'|Ψ⁻⟩';
  return null;
}

/* ---------- entanglement: separability determinant ---------- */
function labConcurrence(){
  const u={re:V[0].re*V[3].re-V[0].im*V[3].im, im:V[0].re*V[3].im+V[0].im*V[3].re};
  const w={re:V[1].re*V[2].re-V[1].im*V[2].im, im:V[1].re*V[2].im+V[1].im*V[2].re};
  const det={re:u.re-w.re, im:u.im-w.im};
  return Math.min(1, 2*Math.hypot(det.re,det.im));   /* concurrence = 2|det| */
}

function labUpdate(){
  const bell=labLabel();
  $('lab-state').innerHTML='<strong>|ψ⟩ = '+labAmps()+'</strong>'+(bell?' &nbsp;=&nbsp; <strong>'+bell+'</strong> — a Bell state!':'');
  const C=labConcurrence(), el=$('lab-ent');
  if(C>0.01){
    el.innerHTML='🔗 <strong>ENTANGLED — concurrence '+Math.round(C*100)+'%</strong>. These qubits can no longer be described separately.';
    el.style.color='#6ee7b7';
  }else{
    el.innerHTML='⬜ Separable — a product state; each qubit still has a life of its own.';
    el.style.color='';
  }
  if(charts.lab){
    charts.lab.data.datasets[0].data=V.map(v=>Math.round((v.re*v.re+v.im*v.im)*1000)/10);
    charts.lab.update();
  }
}

function labMeasure(){
  if(labBusy)return;
  const p=V.map(v=>v.re*v.re+v.im*v.im);
  const before=Q2NAMES.map((n,i)=>n+' '+Math.round(p[i]*100)+'%').join(' · ');
  let r=Math.random(),idx=3,acc=0;
  for(let i=0;i<4;i++){acc+=p[i];if(r<acc){idx=i;break;}}
  V=[{re:0,im:0},{re:0,im:0},{re:0,im:0},{re:0,im:0}];
  V[idx]={re:1,im:0};
  labUpdate();
  $('lab-msg').innerHTML='📷 Measured <strong>'+Q2NAMES[idx]+'</strong>. Before: '+before+'. Both qubits collapsed together — instantly, however far apart.';
}

function labReset(){
  if(labBusy)return;
  V=[{re:1,im:0},{re:0,im:0},{re:0,im:0},{re:0,im:0}];
  $('lab-msg').textContent='';
  labUpdate();
}

function labBuild(){
  if(labBusy)return;
  labBusy=true;
  V=[{re:1,im:0},{re:0,im:0},{re:0,im:0},{re:0,im:0}];
  $('lab-msg').innerHTML='⚡ Step 1 — start from |00⟩: two qubits, both definitely 0. Not entangled.';
  labUpdate();
  setTimeout(()=>{
    g_h1();
    $('lab-msg').innerHTML='⚡ Step 2 — H on q1: qubit 1 is now spinning in superposition, qubit 2 ordinary. <em>Still separable — check the meter!</em>';
    labUpdate();
  },1100);
  setTimeout(()=>{
    g_cnot12();
    $('lab-msg').innerHTML='⚡ Step 3 — CNOT: the conditional flip copied the superposition into correlation. <strong>Entanglement achieved — the Bell state |Φ⁺⟩!</strong>';
    labUpdate();
    labBusy=false;
  },2300);
}

/* ---------- chart + reset hook ---------- */
charts.lab=makeChart('labChart',{type:'bar',data:{labels:Q2NAMES,datasets:[{data:[100,0,0,0],backgroundColor:['rgba(34,211,238,.8)','rgba(167,139,250,.8)','rgba(129,140,248,.8)','rgba(244,114,182,.8)'],borderRadius:8}]},options:{plugins:{legend:{display:false}},scales:{y:{min:0,max:100,ticks:{callback:v=>v+'%'}}}}});
labUpdate();