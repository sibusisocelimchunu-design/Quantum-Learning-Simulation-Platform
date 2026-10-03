 /* =========================================================
   js/qubit.js — complex state engine (multi-page edition).
   Guards all DOM access; persists state across pages via
   sessionStorage. Also hosts the RY continuous rotation.
   ========================================================= */
const C = {
  add:(u,v)=>({re:u.re+v.re, im:u.im+v.im}),
  sub:(u,v)=>({re:u.re-v.re, im:u.im-v.im}),
  scale:(u,k)=>({re:u.re*k, im:u.im*k}),
  mul:(u,v)=>({re:u.re*v.re-u.im*v.im, im:u.re*v.im+u.im*v.re}),
  abs2:u=>u.re*u.re+u.im*u.im
};
const S = { a:{re:1,im:0}, b:{re:0,im:0} };
const P0 = () => C.abs2(S.a);
const P1 = () => C.abs2(S.b);

function cstr(u){
  const re=fmt(u.re), im=Math.abs(fmt(u.im));
  return fmt(u.im)===0 ? String(re) : re+(u.im<0?'−':'+')+im+'i';
}
function stateLabel(){
  const e=1e-6, pa=C.abs2(S.a), pb=C.abs2(S.b);
  if(Math.abs(pa-1)<e) return '|0⟩';
  if(Math.abs(pb-1)<e) return '|1⟩';
  if(Math.abs(pa-.5)<e && Math.abs(pb-.5)<e){
    let rel=Math.atan2(S.b.im,S.b.re)-Math.atan2(S.a.im,S.a.re);
    rel=((rel+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;
    if(Math.abs(rel)<.02) return '|+⟩';
    if(Math.abs(Math.abs(rel)-Math.PI)<.02) return '|−⟩';
    if(Math.abs(rel-Math.PI/2)<.02) return '|+i⟩';
    if(Math.abs(rel+Math.PI/2)<.02) return '|−i⟩';
  }
  return '('+cstr(S.a)+')|0⟩ + ('+cstr(S.b)+')|1⟩';
}

/* ---------- RY continuous rotation (engine-resident) ---------- */
let ryPrev = 0;
function resetRY(){ ryPrev=0; const s=$('ry-slider'); if(s)s.value=0; const l=$('ry-deg'); if(l)l.textContent='0'; }
function ryOnInput(val){
  const deg=Number(val), d=deg-ryPrev; ryPrev=deg;
  const l=$('ry-deg'); if(l)l.textContent=deg;
  if(d!==0){
    const t=d*Math.PI/180, c=Math.cos(t/2), s=Math.sin(t/2), A=S.a, B=S.b;
    S.a={re:c*A.re-s*B.re, im:c*A.im-s*B.im};
    S.b={re:s*A.re+c*B.re, im:s*A.im+c*B.im};
    refresh();
  }
}

/* ---------- state persistence across pages ---------- */
function qSave(){ try{ sessionStorage.setItem('qlp_qstate', JSON.stringify({a:S.a,b:S.b,ry:ryPrev})); }catch(e){} }
function qRestore(){
  try{
    const d=JSON.parse(sessionStorage.getItem('qlp_qstate')||'null');
    if(d&&d.a){ S.a=d.a; S.b=d.b; ryPrev=d.ry||0;
      const s=$('ry-slider'); if(s)s.value=ryPrev;
      const l=$('ry-deg'); if(l)l.textContent=ryPrev; }
  }catch(e){}
}

function setQubitState(s){
  resetRY();
  const R=Math.SQRT1_2;
  const M={
    '0':[{re:1,im:0},{re:0,im:0}],
    '1':[{re:0,im:0},{re:1,im:0}],
    '+':[{re:R,im:0},{re:R,im:0}],
    '-':[{re:R,im:0},{re:-R,im:0}],
    'i':[{re:R,im:0},{re:0,im:R}]
  }[s];
  if(!M) return;
  S.a={re:M[0].re,im:M[0].im}; S.b={re:M[1].re,im:M[1].im};
  refresh();
  const note={'+':' — 50/50 probabilities, zero relative phase.',
    '-':' — identical probabilities to |+⟩ but OPPOSITE phase — look where the needle points now!',
    'i':' — 50/50 with 90° relative phase — the needle has left the flat page into 3D!'}[s]||'.';
  setHTML('measure-result','State set to <strong>'+stateLabel()+'</strong>'+note);
}

function refresh(){
  setHTML('qubit-state','Current State: <strong>'+stateLabel()+'</strong>');
  setText('qubit-amps','|ψ⟩ = ('+cstr(S.a)+')|0⟩ + ('+cstr(S.b)+')|1⟩');
  const e0=$('stat-p0'); if(e0)e0.textContent=pct(P0());
  const e1=$('stat-p1'); if(e1)e1.textContent=pct(P1());
  if(charts.qubit){ charts.qubit.data.datasets[0].data=[Math.round(P0()*100),Math.round(P1()*100)]; charts.qubit.update(); }
  blochTarget={
    x:2*(S.a.re*S.b.re + S.a.im*S.b.im),
    y:2*(S.a.re*S.b.im - S.a.im*S.b.re),
    z:C.abs2(S.a)-C.abs2(S.b)
  };
  setText('after-state',stateLabel());
  qSave();
}

function measureQubit(){
  const p0=P0(), res=Math.random()<p0?0:1;
  S.a={re:res===0?1:0,im:0}; S.b={re:res===0?0:1,im:0};
  refresh();
  setHTML('measure-result','📷 Measured <strong>|'+res+'⟩</strong> — the superposition <em>collapsed</em>. Before: P(|0⟩)='+pct(p0)+', P(|1⟩)='+pct(1-p0)+'. Now certain.');
}
function runShots(){
  let c0=0; for(let i=0;i<100;i++) if(Math.random()<P0()) c0++;
  if(charts.shots){ charts.shots.data.datasets[0].data=[c0,100-c0]; charts.shots.update(); }
  setHTML('measure-result','📊 100 shots on <strong>'+stateLabel()+'</strong>: |0⟩ '+c0+'×, |1⟩ '+(100-c0)+'× — theory P(|0⟩)='+pct(P0())+'.');
}

/* ---------- 3D Bloch sphere (only when the canvas exists) ---------- */
let blochTarget={x:0,y:0,z:1}, blochCur={x:0,y:0,z:1};
const bl=$('bloch');
if(bl && bl.getContext){
  const bx=bl.getContext('2d');
  let yaw=0.6, dragging=false, lastX=0, lastDrag=0;
  bl.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;bl.setPointerCapture(e.pointerId);});
  bl.addEventListener('pointermove',e=>{if(!dragging)return;yaw+=(e.clientX-lastX)*.01;lastX=e.clientX;lastDrag=performance.now();});
  bl.addEventListener('pointerup',()=>{dragging=false;lastDrag=performance.now();});
  function proj(p){
    const cy=Math.cos(yaw), sy=Math.sin(yaw);
    const x1=p.x*cy-p.y*sy, y1=p.x*sy+p.y*cy;
    const cp=Math.cos(pitch||0.35), sp=Math.sin(pitch||0.35);
    return {sx:x1, sy:-(y1*sp+p.z*cp)};
  }
  const pitch=0.35;
  function ring(f,style){
    bx.strokeStyle=style;bx.lineWidth=1.3;bx.beginPath();
    for(let i=0;i<=48;i++){
      const t=i/48*2*Math.PI, s=proj(f(t));
      const X=bl.width/2+s.sx*(bl.height/2-30), Y=bl.height/2+s.sy*(bl.height/2-30);
      i?bx.lineTo(X,Y):bx.moveTo(X,Y);
    }
    bx.stroke();
  }
  function drawBloch3d(){
    const W=bl.width,H=bl.height,cx=W/2,cy=H/2,R=H/2-30;
    bx.clearRect(0,0,W,H);
    bx.strokeStyle='rgba(255,255,255,.28)';bx.lineWidth=2;
    bx.beginPath();bx.arc(cx,cy,R,0,7);bx.stroke();
    ring(t=>({x:Math.cos(t),y:Math.sin(t),z:0}),'rgba(255,255,255,.16)');
    ring(t=>({x:Math.cos(t),y:0,z:Math.sin(t)}),'rgba(255,255,255,.16)');
    ring(t=>({x:0,y:Math.cos(t),z:Math.sin(t)}),'rgba(255,255,255,.10)');
    bx.fillStyle='#9aa5c4';bx.font='13px Inter,sans-serif';bx.textAlign='center';
    [['|0⟩',{x:0,y:0,z:1}],['|1⟩',{x:0,y:0,z:-1}],['|+⟩',{x:1,y:0,z:0}],['|−⟩',{x:-1,y:0,z:0}],['|+i⟩',{x:0,y:1,z:0}]]
      .forEach(([t,p])=>{const s=proj(p);bx.fillText(t,cx+s.sx*(R+16),cy+s.sy*(R+16)+4);});
    const n=proj(blochCur);
    const g=bx.createLinearGradient(cx,cy,cx+n.sx*R,cy+n.sy*R);
    g.addColorStop(0,'#22d3ee');g.addColorStop(1,'#f472b6');
    bx.strokeStyle=g;bx.lineWidth=4;
    bx.beginPath();bx.moveTo(cx,cy);bx.lineTo(cx+n.sx*R,cy+n.sy*R);bx.stroke();
    bx.beginPath();bx.arc(cx,cy,3,0,7);bx.fillStyle='#fff';bx.fill();
    bx.beginPath();bx.arc(cx+n.sx*R,cy+n.sy*R,8,0,7);
    bx.fillStyle='#f472b6';bx.shadowColor='#f472b6';bx.shadowBlur=18;bx.fill();bx.shadowBlur=0;
  }
  (function loop(){
    if(!dragging && performance.now()-lastDrag>2500) yaw+=.004;
    blochCur.x+=(blochTarget.x-blochCur.x)*.1;
    blochCur.y+=(blochTarget.y-blochCur.y)*.1;
    blochCur.z+=(blochTarget.z-blochCur.z)*.1;
    drawBloch3d();requestAnimationFrame(loop);
  })();
}

/* ---------- charts (page-optional) ---------- */
charts.qubit=makeChart('qubitChart',{type:'bar',data:{labels:['|0⟩','|1⟩'],datasets:[{data:[100,0],backgroundColor:['rgba(34,211,238,.8)','rgba(244,114,182,.8)'],borderRadius:10}]},options:{plugins:{legend:{display:false}},scales:{y:{min:0,max:100,ticks:{callback:v=>v+'%'}}}}});
charts.shots=makeChart('shotsChart',{type:'bar',data:{labels:['Measured |0⟩','Measured |1⟩'],datasets:[{data:[0,0],backgroundColor:['rgba(34,211,238,.8)','rgba(244,114,182,.8)'],borderRadius:10}]},options:{plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,title:{display:true,text:'shots out of 100'}}}}});

qRestore();
refresh();