const words=["Programming","Robotics","Artificial Intelligence","Arduino","IoT & Smart Home"];let wi=0;const w=document.getElementById('word');
setInterval(()=>{wi=(wi+1)%words.length;w.style.animation='none';w.offsetHeight;w.style.animation='';w.textContent=words[wi]},2200);
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll('.rise').forEach(el=>io.observe(el));
const co=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;co.unobserve(e.target);const b=e.target,t=+b.dataset.to;let n=0;const s=setInterval(()=>{n++;b.textContent=n;if(n>=t)clearInterval(s)},1200/t)}),{threshold:.6});
document.querySelectorAll('[data-to]').forEach(b=>co.observe(b));
/* ===== تأثير الكروت: spotlight + tilt ===== */
(()=>{
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  const MAX=7;
  document.querySelectorAll('.card,.pc').forEach(card=>{
    let raf=0;
    card.addEventListener('pointermove',e=>{
      if(e.pointerType!=='mouse')return;
      cancelAnimationFrame(raf);
      raf=requestAnimationFrame(()=>{
        const r=card.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
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
const pg=document.getElementById('pg');addEventListener('scroll',()=>{pg.style.width=(scrollY/(document.body.scrollHeight-innerHeight)*100)+'%'},{passive:true});
const reel=document.getElementById('reel');reel.style.backgroundImage='linear-gradient(#033b3666,#033b36dd),url('+document.querySelector('.mascot img').src+')';
function playReel(){reel.innerHTML='<iframe src="https://www.facebook.com/plugins/video.php?href='+encodeURIComponent(reel.dataset.u)+'&show_text=false&autoplay=true" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="IVECOM video"></iframe>'}
reel.addEventListener('click',playReel,{once:true});reel.addEventListener('keydown',e=>{if(e.key==='Enter')playReel()});


// ===== IVECOM CREATIVE INTERACTIONS =====
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Soft pointer glow on devices with a precise pointer.
  if (window.matchMedia('(pointer:fine)').matches && !reducedMotion) {
    const glow = document.createElement('div');
    glow.className = 'pointer-glow';
    document.body.appendChild(glow);
    window.addEventListener('pointermove', (event) => {
      glow.style.left = event.clientX + 'px';
      glow.style.top = event.clientY + 'px';
    }, { passive: true });
  }

  // Lightweight animated particles in the hero section.
  const hero = document.querySelector('.hero');
  if (hero && !reducedMotion) {
    const canvas = document.createElement('canvas');
    canvas.id = 'particleCanvas';
    hero.prepend(canvas);
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width = 0, height = 0, raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = hero.clientWidth; height = hero.clientHeight;
      canvas.width = width * dpr; canvas.height = height * dpr;
      canvas.style.width = width + 'px'; canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(48, Math.max(18, Math.floor(width / 25)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width, y: Math.random() * height,
        r: Math.random() * 2 + .6, vx: (Math.random() - .5) * .28,
        vy: (Math.random() - .5) * .28, a: Math.random() * .45 + .15
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,191,174,${p.a})`; ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j], dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 105) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(0,191,174,${.10 * (1 - dist / 105)})`;
            ctx.lineWidth = .7; ctx.stroke();
          }
        }
      });
      raf = requestAnimationFrame(draw);
    };
    resize(); draw();
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (!reducedMotion) draw();
    });
  }

  // Back-to-top button.
  const backTop = document.createElement('button');
  backTop.id = 'backTop';
  backTop.type = 'button';
  backTop.setAttribute('aria-label', 'العودة إلى أعلى الصفحة');
  backTop.innerHTML = '↑';
  document.body.appendChild(backTop);
  const updateBackTop = () => backTop.classList.toggle('visible', window.scrollY > 550);
  window.addEventListener('scroll', updateBackTop, { passive: true });
  updateBackTop();
  backTop.addEventListener('click', () => window.scrollTo({
    top: 0, behavior: reducedMotion ? 'auto' : 'smooth'
  }));
})();

// ===== IVECOM MOMENTS: تكرار الشريط تلقائيًا عشان الحركة تفضل مستمرة بدون فراغ =====
(() => {
  const set = document.getElementById('momentsSet');
  if (!set) return;
  const clone = set.cloneNode(true);
  clone.removeAttribute('id');
  clone.setAttribute('aria-hidden', 'true');
  clone.querySelectorAll('img').forEach(img => { img.alt = ''; });
  set.parentNode.appendChild(clone);
  // سرعة ثابتة تقريبًا مهما كان عدد الصور (~5 ثواني لكل صورة)
  const n = set.querySelectorAll('.moments-card').length;
  set.parentNode.style.setProperty('--moments-speed', Math.max(30, n * 5) + 's');
})();
