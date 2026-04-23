/* ═══════════════════════════════════════════
   ARJUN // PLAYER PROFILE — script.js
   ═══════════════════════════════════════════ */

'use strict';

/* ─── BOOT SCREEN ───────────────────────────── */
(function bootScreen() {
  const bootEl   = document.getElementById('bootScreen');
  const fillEl   = document.getElementById('bootFill');
  const pctEl    = document.getElementById('bootPct');
  const linesEl  = document.getElementById('bootLines');

  const lines = [
    'BIOS v2.04 initializing...',
    'Loading ARJUN_OS kernel...',
    'Scanning hardware peripherals...',
    'Mounting skill modules...',
    'Connecting to guild network...',
    'Verifying player credentials...',
    'Decrypting quest log...',
    'Rendering HUD interface...',
    'System ready. Welcome, Recruiter.'
  ];

  let progress  = 0;
  let lineIndex = 0;
  const lineInterval = setInterval(() => {
    if (lineIndex < lines.length) {
      const div = document.createElement('div');
      div.textContent = '> ' + lines[lineIndex++];
      linesEl.appendChild(div);
      linesEl.scrollTop = linesEl.scrollHeight;
    }
  }, 320);

  const barInterval = setInterval(() => {
    progress += Math.random() * 4 + 1;
    if (progress >= 100) {
      progress = 100;
      clearInterval(barInterval);
      clearInterval(lineInterval);
      setTimeout(() => {
        bootEl.classList.add('hidden');
        document.body.style.overflow = 'auto';
        initXPBar();
      }, 600);
    }
    fillEl.style.width = progress + '%';
    pctEl.textContent  = Math.floor(progress) + '%';
  }, 50);

  document.body.style.overflow = 'hidden';
})();

/* ─── PARTICLE BACKGROUND ───────────────────── */
(function particles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, dots = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Dot {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.r  = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = (Math.random() - 0.5) * 0.25;
      this.a  = Math.random() * 0.5 + 0.1;
      this.col = Math.random() < 0.5 ? '0,245,255' : '191,0,255';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.col},${this.a})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 120; i++) dots.push(new Dot());

  function drawLines() {
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = `rgba(0,245,255,${0.06 * (1 - dist/100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    dots.forEach(d => { d.update(); d.draw(); });
    drawLines();
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ─── CUSTOM CURSOR ──────────────────────────── */
(function cursor() {
  const cur   = document.getElementById('cursor');
  const trail = document.getElementById('cursorTrail');
  let tx = 0, ty = 0, cx = 0, cy = 0;

  window.addEventListener('mousemove', e => {
    tx = e.clientX; ty = e.clientY;
    cur.style.left = tx + 'px';
    cur.style.top  = ty + 'px';
  });

  function animTrail() {
    cx += (tx - cx) * 0.15;
    cy += (ty - cy) * 0.15;
    trail.style.left = cx + 'px';
    trail.style.top  = cy + 'px';
    requestAnimationFrame(animTrail);
  }
  animTrail();

  document.querySelectorAll('a, button, .btn, .quest-btn, .social-btn, .nav-link').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cur.style.width  = '28px';
      cur.style.height = '28px';
      cur.style.background = 'rgba(0,245,255,0.15)';
    });
    el.addEventListener('mouseleave', () => {
      cur.style.width  = '14px';
      cur.style.height = '14px';
      cur.style.background = '';
    });
  });
})();

/* ─── NAVBAR ─────────────────────────────────── */
(function navbar() {
  const nav  = document.getElementById('navbar');
  const hbg  = document.getElementById('hamburger');
  const mob  = document.getElementById('mobileNav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) nav.classList.add('scrolled');
    else                     nav.classList.remove('scrolled');
  });

  hbg.addEventListener('click', () => mob.classList.toggle('open'));

  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => mob.classList.remove('open'));
  });
})();

/* ─── SMOOTH SCROLLING ───────────────────────── */
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ─── TYPING ANIMATION ───────────────────────── */
(function typing() {
  const el    = document.getElementById('typingText');
  const roles = [
    'Full Stack Developer',
    'AI/ML Engineer',
    'Hardware Hacker',
    'Python Expert',
    'Problem Solver'
  ];
  let ri = 0, ci = 0, deleting = false;
  const SPEED_TYPE = 90, SPEED_DEL = 50, PAUSE = 1800;

  function tick() {
    const word = roles[ri];
    if (!deleting) {
      el.textContent = word.substring(0, ++ci);
      if (ci === word.length) { deleting = true; setTimeout(tick, PAUSE); return; }
    } else {
      el.textContent = word.substring(0, --ci);
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
    }
    setTimeout(tick, deleting ? SPEED_DEL : SPEED_TYPE);
  }
  tick();
})();

/* ─── XP BAR ─────────────────────────────────── */
function initXPBar() {
  const xp = document.getElementById('xpFill');
  if (xp) xp.style.width = '87.5%';
}

/* ─── INTERSECTION OBSERVER ──────────────────── */
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);

      /* counters */
      if (entry.target.classList.contains('stat-card')) {
        const numEl = entry.target.querySelector('.stat-number');
        if (numEl) animateCounter(numEl);
      }
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ─── COUNTER ANIMATION ──────────────────────── */
function animateCounter(el) {
  const target = +el.dataset.target;
  const suffix = target >= 100 ? '+' : '';
  let count = 0;
  const step = Math.ceil(target / 60);
  const timer = setInterval(() => {
    count = Math.min(count + step, target);
    el.textContent = count + suffix;
    if (count >= target) clearInterval(timer);
  }, 25);
}

/* ─── SKILL BARS ─────────────────────────────── */
const skillIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bars = entry.target.querySelectorAll('.skill-bar');
      bars.forEach(bar => {
        bar.style.width = bar.dataset.pct + '%';
      });
      skillIO.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-category').forEach(cat => skillIO.observe(cat));

/* ─── GLITCH EFFECT (extra randomness) ──────── */
(function extraGlitch() {
  const el = document.querySelector('.glitch');
  if (!el) return;
  setInterval(() => {
    if (Math.random() > 0.95) {
      el.style.filter = `hue-rotate(${Math.random()*360}deg)`;
      setTimeout(() => el.style.filter = '', 80);
    }
  }, 500);
})();

/* ─── STAT BAR REVEAL ────────────────────────── */
const statIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-bar-fill').forEach(bar => {
        const pct = bar.style.getPropertyValue('--pct');
        bar.style.width = '0';
        requestAnimationFrame(() => {
          setTimeout(() => { bar.style.transition = 'width 1.2s cubic-bezier(0.2,0.8,0.3,1)'; bar.style.width = pct; }, 50);
        });
      });
      statIO.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.stat-card').forEach(c => statIO.observe(c));

/* ─── CERT CARD GLOW ON HOVER ────────────────── */
document.querySelectorAll('.cert-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.querySelector('.cert-glow').style.opacity = '1';
  });
  card.addEventListener('mouseleave', () => {
    card.querySelector('.cert-glow').style.opacity = '';
  });
});

/* ─── KONAMI CODE EASTER EGG ─────────────────── */
(function konamiCode() {
  const code = [
    'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
    'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
    'b','a'
  ];
  let idx = 0;
  const overlay = document.getElementById('konamiOverlay');
  const closeBtn = document.getElementById('konamiClose');

  document.addEventListener('keydown', e => {
    if (e.key === code[idx]) {
      idx++;
      if (idx === code.length) {
        idx = 0;
        overlay.classList.add('show');
        launchKonamiEffect();
      }
    } else {
      idx = 0;
    }
  });

  closeBtn.addEventListener('click', () => overlay.classList.remove('show'));
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('show'); });

  function launchKonamiEffect() {
    const canvas = document.getElementById('particleCanvas');
    const ctx    = canvas.getContext('2d');
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        ctx.fillStyle = `rgba(255,215,0,${Math.random()*0.15})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setTimeout(() => ctx.clearRect(0, 0, canvas.width, canvas.height), 100);
      }, i * 80);
    }
  }
})();

/* ─── QS BAR ANIMATE (hero side) ────────────── */
(function qsBars() {
  const panel = document.querySelector('.quick-stats');
  if (!panel) return;
  const sideIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.qs-fill').forEach(fill => {
          const w = fill.style.width;
          fill.style.width = '0';
          requestAnimationFrame(() => {
            setTimeout(() => {
              fill.style.transition = 'width 1.2s cubic-bezier(0.2,0.8,0.3,1)';
              fill.style.width = w;
            }, 200);
          });
        });
        sideIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  sideIO.observe(panel);
})();

/* ─── HARDWARE TERMINAL TYPING ───────────────── */
(function hwTerminalAnim() {
  const term = document.getElementById('hwTerminal');
  if (!term) return;
  const termIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const lines = term.querySelectorAll('.t-line');
        lines.forEach((line, i) => {
          line.style.opacity = '0';
          setTimeout(() => {
            line.style.transition = 'opacity 0.3s';
            line.style.opacity = '1';
          }, i * 300);
        });
        termIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  termIO.observe(term);
})();

/* ─── STAGGER REVEAL DELAYS ──────────────────── */
(function staggerReveal() {
  const containers = ['.stats-grid', '.skills-grid', '.projects-grid', '.certs-grid', '.hardware-grid'];
  containers.forEach(sel => {
    const cards = document.querySelectorAll(`${sel} .reveal`);
    cards.forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.1}s`;
    });
  });
})();

/* ─── SCANLINE FLICKER ───────────────────────── */
(function scanlineFlicker() {
  const sl = document.querySelector('.scanlines');
  setInterval(() => {
    if (Math.random() > 0.97) {
      sl.style.opacity = '0.3';
      setTimeout(() => sl.style.opacity = '', 60);
    }
  }, 300);
})();
