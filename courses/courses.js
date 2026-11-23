const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.rise').forEach(el=>io.observe(el));
const pg=document.getElementById('pg');
addEventListener('scroll',()=>{pg.style.width=(scrollY/(document.body.scrollHeight-innerHeight)*100)+'%'},{passive:true});

/* ===== تأثير الكروت: spotlight + tilt ===== */
(()=>{
  const canHover=matchMedia('(hover:hover) and (pointer:fine)').matches;
  const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  if(!canHover||reduce)return;
  const MAX=7; // أقصى زاوية ميل بالدرجات
  document.querySelectorAll('.ccard').forEach(card=>{
    let raf=0;
    card.addEventListener('pointermove',e=>{
      if(e.pointerType!=='mouse')return;
      cancelAnimationFrame(raf);
      raf=requestAnimationFrame(()=>{
        const r=card.getBoundingClientRect();
        const x=e.clientX-r.left,y=e.clientY-r.top;
        card.style.setProperty('--mx',x+'px');
        card.style.setProperty('--my',y+'px');
        card.style.setProperty('--rx',((0.5-y/r.height)*MAX*2).toFixed(2)+'deg');
        card.style.setProperty('--ry',((x/r.width-0.5)*MAX*2).toFixed(2)+'deg');
        card.classList.add('is-tilt');
      });
    });
    card.addEventListener('pointerleave',()=>{
      cancelAnimationFrame(raf);
      card.classList.remove('is-tilt');
      card.style.removeProperty('--rx');
      card.style.removeProperty('--ry');
    });
  });
})();

/* ===== حركة الهيرو (زي الصفحة الرئيسية): blobs + grid + circuit + particles + pointer glow ===== */
(()=>{
  const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const hero=document.querySelector('.lhero');

  // توهج خفيف يتبع الماوس
  if(matchMedia('(pointer:fine)').matches&&!reduced){
    const glow=document.createElement('div');
    glow.className='pointer-glow';
    document.body.appendChild(glow);
    addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'},{passive:true});
  }
  if(!hero)return;

  // عناصر الخلفية (نفس عناصر الرئيسية)
  const decor=document.createElement('div');
  decor.className='lhero-decor';
  decor.setAttribute('aria-hidden','true');
  decor.innerHTML='<div class="blob b1"></div><div class="blob b2"></div><div class="grid"></div>'+
    '<svg class="circ" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true"><path d="M0 120H200L260 180H520L580 120H1000"/><path d="M0 420H300L360 480H700L760 420H1000"/><path d="M1000 300H760L700 240H420L360 300H0"/></svg>';
  hero.prepend(decor);
  if(reduced)return;

  // Particles
  const canvas=document.createElement('canvas');
  canvas.id='particleCanvas';
  decor.appendChild(canvas);
  const ctx=canvas.getContext('2d');
  let particles=[],width=0,height=0,raf=0;

  const resize=()=>{
    const dpr=Math.min(devicePixelRatio||1,2);
    width=hero.clientWidth;height=hero.clientHeight;
    canvas.width=width*dpr;canvas.height=height*dpr;
    canvas.style.width=width+'px';canvas.style.height=height+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const count=Math.min(48,Math.max(18,Math.floor(width/25)));
    particles=Array.from({length:count},()=>({
      x:Math.random()*width,y:Math.random()*height,
      r:Math.random()*2+.6,vx:(Math.random()-.5)*.28,
      vy:(Math.random()-.5)*.28,a:Math.random()*.45+.15
    }));
  };

  const draw=()=>{
    ctx.clearRect(0,0,width,height);
    particles.forEach((p,i)=>{
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0||p.x>width)p.vx*=-1;
      if(p.y<0||p.y>height)p.vy*=-1;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(0,191,174,${p.a})`;ctx.fill();
      for(let j=i+1;j<particles.length;j++){
        const q=particles[j],dist=Math.hypot(p.x-q.x,p.y-q.y);
        if(dist<105){
          ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);
          ctx.strokeStyle=`rgba(0,191,174,${.10*(1-dist/105)})`;
          ctx.lineWidth=.7;ctx.stroke();
        }
      }
    });
    raf=requestAnimationFrame(draw);
  };
  resize();draw();
  addEventListener('resize',resize,{passive:true});
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden)cancelAnimationFrame(raf);
    else{cancelAnimationFrame(raf);draw()}
  });
})();
