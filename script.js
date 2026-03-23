/* ===========================
   MOLO.DEV — script.js
   =========================== */

// ===== LOADER =====
const loader     = document.getElementById('loader');
const loaderFill = document.getElementById('loaderFill');
const loaderText = document.getElementById('loaderText');
const messages   = ['Loading...', 'Setting up...', 'Almost ready...', 'Welcome!'];
let prog = 0;

const loaderInterval = setInterval(() => {
  prog += Math.random() * 18 + 5;
  if (prog >= 100) { prog = 100; clearInterval(loaderInterval); }
  loaderFill.style.width = prog + '%';
  const idx = Math.floor((prog / 100) * (messages.length - 1));
  loaderText.textContent = messages[idx];
  if (prog === 100) {
    setTimeout(() => {
      loader.classList.add('hide');
      document.body.classList.remove('loading');
      revealHero();
    }, 400);
  }
}, 80);

// ===== HERO REVEAL =====
function revealHero() {
  document.querySelector('.t1')?.classList.add('vis');
  document.querySelector('.t2')?.classList.add('vis');
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }, 200);
}

// ===== CUSTOM CURSOR =====
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
let mx = 0, my = 0, cx = 0, cy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursorDot.style.left = mx + 'px';
  cursorDot.style.top  = my + 'px';
});
(function animCursor() {
  cx += (mx - cx) * 0.1;
  cy += (my - cy) * 0.1;
  cursor.style.left = cx + 'px';
  cursor.style.top  = cy + 'px';
  requestAnimationFrame(animCursor);
})();

// Hover effect
document.querySelectorAll('a, button, .project-card, .service-card, .skill-chip, .contact-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

// ===== SCROLL PROGRESS BAR =====
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  progressBar.style.width = pct + '%';
});

// ===== NAVBAR SCROLL BEHAVIOUR =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ===== HAMBURGER / MOBILE MENU =====
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mob-link').forEach(l => {
  l.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ===== SIDE DOTS + NAV ACTIVE =====
const sections  = [...document.querySelectorAll('section[id]')];
const navLinks  = document.querySelectorAll('.nav-link');
const sideDots  = document.querySelectorAll('.side-dot');

function onScroll() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
  });
  navLinks.forEach(l => {
    l.classList.toggle('active', l.dataset.section === current);
  });
  sideDots.forEach(d => {
    d.classList.toggle('active', d.dataset.target === current);
  });
}
window.addEventListener('scroll', onScroll, { passive: true });

sideDots.forEach(d => {
  d.addEventListener('click', () => {
    document.getElementById(d.dataset.target)?.scrollIntoView({ behavior: 'smooth' });
  });
});

// ===== SCROLL REVEAL =====
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('vis');
      ro.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('section:not(.hero) .reveal, .project-card, .service-card, .skill-chip').forEach((el, i) => {
  el.style.transitionDelay = (i * 0.04) + 's';
  ro.observe(el);
});

// ===== COUNTER ANIMATION =====
const co = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { animCounter(e.target); co.unobserve(e.target); }
  });
}, { threshold: 0.6 });
document.querySelectorAll('.stat-num').forEach(el => co.observe(el));

function animCounter(el) {
  const target = +el.dataset.target;
  const dur    = 1600;
  const start  = performance.now();
  const suffix = target === 100 ? '%' : target >= 50 ? '+' : '';
  (function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const e = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.floor(e * target) + (p === 1 ? suffix : '');
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}

// ===== TYPED EFFECT =====
const typedEl = document.getElementById('typed');
const words   = ['Discord Bots.', 'Websites.', 'MC Servers.', 'Apps.', 'Experiences.'];
let wi = 0, ci = 0, deleting = false;

function typeLoop() {
  const word    = words[wi];
  const display = deleting ? word.substring(0, ci--) : word.substring(0, ci++);
  if (typedEl) typedEl.textContent = display;

  let delay = deleting ? 60 : 110;
  if (!deleting && ci === word.length + 1) { deleting = true; delay = 1400; }
  else if (deleting && ci < 0)              { deleting = false; ci = 0; wi = (wi + 1) % words.length; delay = 300; }
  setTimeout(typeLoop, delay);
}
setTimeout(typeLoop, 2000);

// ===== HERO PARTICLES CANVAS =====
const canvas = document.getElementById('heroCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * canvas.width;
      this.y  = Math.random() * canvas.height;
      this.r  = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.a  = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232,213,163,${this.a})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  (function animParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(232,213,163,${(1 - dist/100) * 0.08})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animParticles);
  })();
}

// ===== HERO PARALLAX BLOBS =====
document.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth  - 0.5) * 25;
  const y = (e.clientY / window.innerHeight - 0.5) * 25;
  const b1 = document.querySelector('.blob1');
  const b2 = document.querySelector('.blob2');
  const b3 = document.querySelector('.blob3');
  if (b1) b1.style.transform = `translate(${x}px, ${y}px)`;
  if (b2) b2.style.transform = `translate(${-x*.5}px, ${-y*.5}px)`;
  if (b3) b3.style.transform = `translate(${x*.3}px, ${y*.3}px)`;
});

// ===== WHO AM I BUTTON FLASH =====
document.getElementById('whoBtn')?.addEventListener('click', e => {
  e.preventDefault();
  document.body.style.transition = 'filter 0.15s';
  document.body.style.filter = 'brightness(1.08)';
  setTimeout(() => { document.body.style.filter = ''; }, 150);
  setTimeout(() => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  }, 80);
});
