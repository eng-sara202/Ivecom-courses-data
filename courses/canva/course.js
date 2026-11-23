const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.rise').forEach(el=>io.observe(el));
const pg=document.getElementById('pg');
addEventListener('scroll',()=>{pg.style.width=(scrollY/(document.body.scrollHeight-innerHeight)*100)+'%'},{passive:true});

/* نسخ السعر الكلي من قسم الأسعار إلى مربع السعر في أعلى الصفحة */
(function(){var t=document.getElementById('price-total'),p=document.getElementById('price');if(t&&p&&t.textContent.trim())p.textContent=t.textContent.trim()})();
