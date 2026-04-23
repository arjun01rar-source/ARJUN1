// ================================================
//   MANAV GAMING RESUME — script.js
//   All interactivity, animations & game logic
// ================================================

/* ── BOOT SEQUENCE ── */
(function bootSequence() {
  const bootScreen = document.getElementById('bootScreen');
  const bootBar    = document.getElementById('bootBar');
  const bootText   = document.getElementById('bootText');
  const mainSite   = document.getElementById('mainSite');

  const bootMessages = [
    'Initializing systems...',
    'Loading skill modules...',
    'Connecting to GitHub servers...',
    'Compiling character data...',
    'Rendering HUD interface...',
    'Quest log loaded.',
    'Welcome, Recruiter!',
  ];

  let progress = 0;
  let msgIndex = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 14 + 4;
    if (progress > 100) progress = 100;

    bootBar.style.width = progress + '%';

    if (msgIndex < bootMessages.length) {
      bootText.textContent = bootMessages[msgIndex];
      msgIndex++;
    }

    if (progress >= 100) {
      clearInterval(interval);
      bootText.textContent = '[ SYSTEM READY ] — Press any key to continue';

      setTimeout(() => {
        bootScreen.style.transition = 'opacity 0.6s ease';
        bootScreen.style.opacity = '0';
        setTimeout(() => {
          bootScreen.style.display = 'none';
          mainSite.classList.remove('hidden');
          mainSite.style.opacity = '0';
          mainSite.style.transition = 'opacity 0.6s ease';
          setTimeout(() => {
            mainSite.style.opacity = '1';
            onSiteLoad();
          }, 50);
        }, 600);
      }, 700);
    }
  }, 120);
})();

/* ── ON SITE LOAD ── */
function onSiteLoad() {
  startParticles();
  startTypingEffect();
  animateXP();
  initScrollAnimations();
  initNavSmooth();
  initContactForm();
  initSkillHover();
  initStatCounters();
}

/* ── PARTICLE SYSTEM ── */
function startParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');

  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  const PARTICLE_COUNT = 80;
  const particles = [];

  const colors = ['#00ffe0', '#a855f7', '#ff2d78', '#ffd700'];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x:    Math.random() * W,
      y:    Math.random() * H,
      r:    Math.random() * 2 + 0.3,
      vx:   (Math.random() - 0.5) * 0.4,
      vy:   (Math.random() - 0.5) * 0.4,
      col:  colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.6 + 0.2,
    });
  }

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.col;
      ctx.globalAlpha = p.alpha;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(drawFrame);
  }

  drawFrame();
}

/* ── TYPING EFFECT ── */
function startTypingEffect() {
  const el = document.getElementById('typingTitle');
  const phrases = [
    'FULL-STACK LEARNER',
    'EMBEDDED SYSTEMS DEV',
    'C / C++ PROGRAMMER',
    'PYTHON CODER',
    'HARDWARE HACKER',
    'JAVASCRIPT EXPLORER',
    'ARDUINO WIZARD',
  ];

  let pIndex = 0;
  let cIndex = 0;
  let deleting = false;
  let pause = 0;

  function type() {
    const current = phrases[pIndex];

    if (pause > 0) {
      pause--;
      setTimeout(type, 100);
      return;
    }

    if (!deleting) {
      el.textContent = current.slice(0, cIndex + 1);
      cIndex++;
      if (cIndex === current.length) {
        deleting = true;
        pause = 18;
      }
      setTimeout(type, 90);
    } else {
      el.textContent = current.slice(0, cIndex - 1);
      cIndex--;
      if (cIndex === 0) {
        deleting = false;
        pIndex = (pIndex + 1) % phrases.length;
        pause = 4;
      }
      setTimeout(type, 45);
    }
  }

  type();
}

/* ── XP BAR ANIMATION ── */
function animateXP() {
  const fill = document.getElementById('xpFill');
  if (!fill) return;
  setTimeout(() => {
    fill.style.width = '49%'; // 2450/5000
  }, 400);
}

/* ── INTERSECTION OBSERVER — SCROLL ANIMATIONS ── */
function initScrollAnimations() {

  // Skill bars
  const statRows = document.querySelectorAll('.stat-row');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const row  = entry.target;
        const val  = row.dataset.val;
        const fill = row.querySelector('.sr-fill');
        if (fill) fill.style.width = val + '%';
        statObserver.unobserve(row);
      }
    });
  }, { threshold: 0.3 });

  statRows.forEach(row => statObserver.observe(row));

  // Fade-in for cards
  const fadeTargets = document.querySelectorAll(
    '.quest-card, .skill-node, .lore-card, .about-card, .about-stats-panel, .contact-form-panel, .ci-link'
  );

  fadeTargets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, 80 * (i % 6));
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeTargets.forEach(el => fadeObserver.observe(el));

  // Section headers
  const headers = document.querySelectorAll('.section-header');
  headers.forEach(h => {
    h.style.opacity = '0';
    h.style.transform = 'translateX(-20px)';
    h.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  const headerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateX(0)';
        headerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  headers.forEach(h => headerObserver.observe(h));
}

/* ── SMOOTH NAV ── */
function initNavSmooth() {
  document.querySelectorAll('[data-sound="click"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      // Visual click flash
      link.style.color = '#fff';
      link.style.textShadow = '0 0 12px #fff';
      setTimeout(() => {
        link.style.color = '';
        link.style.textShadow = '';
      }, 200);
    });
  });
}

/* ── SKILL NODE HOVER TOOLTIP ── */
function initSkillHover() {
  const skillDescs = {
    'C Language':      'Low-level systems programming. Pointers, memory management & algorithms.',
    'C++':             'Object-oriented programming, STL, and performance-critical applications.',
    'Python':          'Scripting, automation, data manipulation, and MicroPython for hardware.',
    'JavaScript':      'Building dynamic web pages and front-end interactivity. Currently levelling up!',
    'HTML/CSS':        'Structuring and styling web pages. Building this very portfolio!',
    'Arduino UNO':     'Programming microcontrollers in C/C++ for real-world hardware projects.',
    'Pi Pico':         'MicroPython on Raspberry Pi Pico for embedded IoT experiments.',
    'React':           'Frontend framework — next skill to unlock. Coming soon!',
  };

  // Create tooltip element
  const tooltip = document.createElement('div');
  tooltip.id = 'skillTooltip';
  tooltip.style.cssText = `
    position: fixed;
    background: rgba(5,7,15,0.97);
    border: 1px solid rgba(0,255,224,0.4);
    color: #c8d8e8;
    font-family: 'Rajdhani', sans-serif;
    font-size: 13px;
    font-weight: 600;
    padding: 10px 16px;
    border-radius: 8px;
    pointer-events: none;
    z-index: 5000;
    max-width: 260px;
    line-height: 1.5;
    box-shadow: 0 0 16px rgba(0,255,224,0.3);
    opacity: 0;
    transition: opacity 0.2s ease;
    letter-spacing: 0.5px;
  `;
  document.body.appendChild(tooltip);

  document.querySelectorAll('.skill-node').forEach(node => {
    node.addEventListener('mouseenter', (e) => {
      const skill = node.dataset.skill;
      const desc  = skillDescs[skill] || 'Skill description coming soon.';
      tooltip.textContent = desc;
      tooltip.style.opacity = '1';
    });

    node.addEventListener('mousemove', (e) => {
      tooltip.style.left = (e.clientX + 14) + 'px';
      tooltip.style.top  = (e.clientY - 40) + 'px';
    });

    node.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
    });

    // Click flash on unlocked nodes
    node.addEventListener('click', () => {
      if (node.classList.contains('locked')) return;
      node.style.boxShadow = '0 0 30px rgba(0,255,224,0.8)';
      node.style.borderColor = '#00ffe0';
      setTimeout(() => {
        node.style.boxShadow = '';
        node.style.borderColor = '';
      }, 400);
    });
  });
}

/* ── STAT COUNTER ANIMATION (XP numbers) ── */
function initStatCounters() {
  // Nothing extra needed — handled by CSS transitions
  // But we add a small label pulse when visible
  const statNums = document.querySelectorAll('.sr-num');
  statNums.forEach(el => {
    el.style.transition = 'color 0.3s ease';
  });
}

/* ── CONTACT FORM ── */
function initContactForm() {
  const btn      = document.getElementById('sendBtn');
  const feedback = document.getElementById('formFeedback');
  const nameInp  = document.getElementById('formName');
  const emailInp = document.getElementById('formEmail');
  const msgInp   = document.getElementById('formMsg');

  if (!btn) return;

  btn.addEventListener('click', () => {
    const name  = nameInp.value.trim();
    const email = emailInp.value.trim();
    const msg   = msgInp.value.trim();

    // Simple validation
    if (!name || !email || !msg) {
      shakeElement(btn);
      highlightEmpty([nameInp, emailInp, msgInp].filter(inp => !inp.value.trim()));
      return;
    }

    if (!isValidEmail(email)) {
      shakeElement(emailInp);
      emailInp.style.borderColor = '#ff2d78';
      emailInp.style.boxShadow = '0 0 12px rgba(255,45,120,0.4)';
      setTimeout(() => {
        emailInp.style.borderColor = '';
        emailInp.style.boxShadow = '';
      }, 1500);
      return;
    }

    // Simulate send
    btn.textContent = '⏳ TRANSMITTING...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    setTimeout(() => {
      btn.textContent = '✔ TRANSMITTED!';
      btn.style.background = '#00ff88';
      btn.style.borderColor = '#00ff88';
      btn.style.color = '#05070f';
      feedback.classList.remove('hidden');

      // Clear fields
      nameInp.value = '';
      emailInp.value = '';
      msgInp.value = '';

      setTimeout(() => {
        btn.textContent = '⚡ TRANSMIT';
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.style.color = '';
        btn.disabled = false;
        btn.style.opacity = '1';
      }, 3000);
    }, 1400);
  });
}

function shakeElement(el) {
  el.style.animation = 'none';
  el.style.transition = 'transform 0.1s ease';
  const shakes = ['-8px', '8px', '-6px', '6px', '-4px', '4px', '0px'];
  let i = 0;
  const shakeInterval = setInterval(() => {
    el.style.transform = `translateX(${shakes[i]})`;
    i++;
    if (i >= shakes.length) {
      clearInterval(shakeInterval);
      el.style.transform = '';
    }
  }, 60);
}

function highlightEmpty(inputs) {
  inputs.forEach(inp => {
    inp.style.borderColor = '#ff2d78';
    inp.style.boxShadow = '0 0 10px rgba(255,45,120,0.4)';
    setTimeout(() => {
      inp.style.borderColor = '';
      inp.style.boxShadow = '';
    }, 1500);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ── NAV HIGHLIGHT ON SCROLL ── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.hud-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom >= 120) {
        current = sec.id;
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.style.color = href === current ? 'var(--primary)' : '';
      link.style.textShadow = href === current ? 'var(--glow)' : '';
    });
  }, { passive: true });
})();

/* ── CURSOR GLOW TRAIL ── */
(function initCursorTrail() {
  const trail = [];
  const TRAIL_COUNT = 8;

  for (let i = 0; i < TRAIL_COUNT; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: fixed;
      width: ${6 - i * 0.6}px;
      height: ${6 - i * 0.6}px;
      background: rgba(0,255,224,${0.5 - i * 0.05});
      border-radius: 50%;
      pointer-events: none;
      z-index: 9998;
      transition: transform 0.05s ease;
      mix-blend-mode: screen;
    `;
    document.body.appendChild(dot);
    trail.push({ el: dot, x: 0, y: 0 });
  }

  let mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateTrail() {
    let x = mouseX, y = mouseY;
    trail.forEach((dot, i) => {
      dot.x += (x - dot.x) * (0.35 - i * 0.025);
      dot.y += (y - dot.y) * (0.35 - i * 0.025);
      dot.el.style.left = dot.x - 3 + 'px';
      dot.el.style.top  = dot.y - 3 + 'px';
      x = dot.x;
      y = dot.y;
    });
    requestAnimationFrame(animateTrail);
  }
  animateTrail();
})();

/* ── KONAMI CODE EASTER EGG ── */
(function initKonamiCode() {
  const KONAMI = [38,38,40,40,37,39,37,39,66,65]; // ↑↑↓↓←→←→BA
  let sequence = [];

  document.addEventListener('keydown', (e) => {
    sequence.push(e.keyCode);
    if (sequence.length > KONAMI.length) sequence.shift();

    if (sequence.join(',') === KONAMI.join(',')) {
      triggerEasterEgg();
    }
  });

  function triggerEasterEgg() {
    // Flash the screen
    const flash = document.createElement('div');
    flash.style.cssText = `
      position: fixed; inset: 0; z-index: 99999;
      background: rgba(0,255,224,0.15);
      pointer-events: none;
      animation: fadeOut 0.8s ease forwards;
    `;
    document.body.appendChild(flash);

    // Pop message
    const msg = document.createElement('div');
    msg.style.cssText = `
      position: fixed;
      top: 50%; left: 50%;
      transform: translate(-50%,-50%);
      background: rgba(5,7,15,0.98);
      border: 2px solid #ffd700;
      color: #ffd700;
      font-family: 'Press Start 2P', monospace;
      font-size: clamp(10px, 2vw, 16px);
      padding: 30px 40px;
      border-radius: 12px;
      z-index: 100000;
      text-align: center;
      line-height: 2.2;
      box-shadow: 0 0 40px rgba(255,215,0,0.5);
      animation: fadeIn 0.3s ease;
    `;
    msg.innerHTML = '🎮 CHEAT CODE ACTIVATED!<br><span style="font-size:0.7em;color:#00ffe0">+9999 XP AWARDED TO MANAV</span><br><span style="font-size:0.6em;color:#a855f7">You found the secret!</span>';
    document.body.appendChild(msg);

    setTimeout(() => {
      msg.style.transition = 'opacity 0.5s ease';
      msg.style.opacity = '0';
      flash.style.transition = 'opacity 0.5s ease';
      flash.style.opacity = '0';
      setTimeout(() => {
        msg.remove();
        flash.remove();
      }, 500);
    }, 2500);

    sequence = [];
  }
})();

/* ── INJECT MISSING KEYFRAMES INTO DOM ── */
(function injectKeyframes() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;
  document.head.appendChild(style);
})();
