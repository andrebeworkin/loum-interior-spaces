/* ============================================================
   LOUM INTERIOR SPACES — Enhanced Interactions
   Features: Loader · Cursor · Scroll Progress · Floating Nav ·
   Mobile Menu · Magnetic Buttons · Ripple · Service Accordion ·
   Spotlight · Parallax · Scroll Reveals · Counter · Marquee ·
   Quote Words · Particle Constellation · Text Scramble
   ============================================================ */
'use strict';

/* ─────────────────────────────────────────
   1. LOADER
───────────────────────────────────────── */
const loader = document.getElementById('loader');
let siteReady = false;

function revealSite() {
  if (siteReady) return;
  siteReady = true;
  document.body.classList.remove('is-loading');
  loader.classList.add('gone');
  setTimeout(() => loader.remove(), 1000);
  triggerHeroReveal();
}

// Hide after assets load, minimum 1.6s
window.addEventListener('load', () => setTimeout(revealSite, 1600));
setTimeout(revealSite, 3500); // Hard fallback

/* ─────────────────────────────────────────
   2. CUSTOM CURSOR
───────────────────────────────────────── */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor || window.innerWidth <= 700) return;

  const dot  = cursor.querySelector('.c-dot');
  const ring = cursor.querySelector('.c-ring');
  const glow = document.getElementById('cursor-glow');

  let mx = -300, my = -300;
  let rx = -300, ry = -300;
  let gx = -300, gy = -300;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function animate() {
    // Dot: instant
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
    // Ring: lerp 0.14
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    // Glow: lerp 0.055
    if (glow) {
      gx += (mx - gx) * 0.055;
      gy += (my - gy) * 0.055;
      glow.style.left = gx + 'px';
      glow.style.top  = gy + 'px';
    }
    requestAnimationFrame(animate);
  })();

  // Hover / click states
  const hoverSel = 'a, button, [role=button], .svc-hd, .photo-frame, .brand-note, .txt-lnk, .email-link, .ft-top-btn';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverSel)) document.body.classList.add('cu-hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverSel)) document.body.classList.remove('cu-hover');
  });
  document.addEventListener('mousedown', () => document.body.classList.add('cu-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cu-click'));
})();

/* ─────────────────────────────────────────
   3. SCROLL PROGRESS BAR
───────────────────────────────────────── */
(function initScrollBar() {
  const bar = document.getElementById('scroll-bar');
  if (!bar) return;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = ((window.scrollY / max) * 100) + '%';
  };
  window.addEventListener('scroll', update, { passive: true });
})();

/* ─────────────────────────────────────────
   4. FLOATING / ADAPTIVE HEADER
───────────────────────────────────────── */
(function initHeader() {
  const hdr  = document.getElementById('site-header');
  const hero = document.getElementById('hero');
  if (!hdr) return;

  const update = () => {
    const scrolled = window.scrollY > 55;
    hdr.classList.toggle('is-scrolled', scrolled);

    // Dark when over hero
    const heroEnd = hero ? hero.offsetTop + hero.offsetHeight : 0;
    hdr.classList.toggle('is-dark', window.scrollY < heroEnd - 70);
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ─────────────────────────────────────────
   5. MOBILE MENU
───────────────────────────────────────── */
(function initMobileMenu() {
  const hbg  = document.getElementById('hbg');
  const menu = document.getElementById('mob-menu');
  if (!hbg || !menu) return;

  const toggle = open => {
    hbg.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    hbg.setAttribute('aria-expanded', open);
    menu.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  hbg.addEventListener('click', () => toggle(!hbg.classList.contains('open')));
  menu.querySelectorAll('.mob-link').forEach(a => a.addEventListener('click', () => toggle(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
})();

/* ─────────────────────────────────────────
   6. MAGNETIC BUTTONS
───────────────────────────────────────── */
(function initMagnetic() {
  document.querySelectorAll('.mag-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) * 0.38;
      const dy = (e.clientY - (r.top  + r.height / 2)) * 0.38;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => btn.style.transform = '');
  });
})();

/* ─────────────────────────────────────────
   7. RIPPLE EFFECT
───────────────────────────────────────── */
document.querySelectorAll('.rip-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    const r    = btn.getBoundingClientRect();
    const size = Math.max(r.width, r.height);
    const wave = document.createElement('span');
    wave.className = 'ripple-wave';
    wave.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${e.clientX - r.left - size / 2}px;
      top:  ${e.clientY - r.top  - size / 2}px;
    `;
    btn.appendChild(wave);
    wave.addEventListener('animationend', () => wave.remove());
  });
});

/* ─────────────────────────────────────────
   8. SERVICE ACCORDION
───────────────────────────────────────── */
(function initAccordion() {
  const items = [...document.querySelectorAll('.svc-item')];
  if (!items.length) return;

  // Open first by default
  items[0].classList.add('open');

  items.forEach(item => {
    const hd = item.querySelector('.svc-hd');
    hd.addEventListener('click', () => activate(item));
    hd.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(item); }
    });
  });

  function activate(target) {
    const isOpen = target.classList.contains('open');
    items.forEach(i => {
      i.classList.remove('open');
      i.querySelector('.svc-hd')?.setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      target.classList.add('open');
      target.querySelector('.svc-hd')?.setAttribute('aria-expanded', 'true');
    }
  }
})();

/* ─────────────────────────────────────────
   9. SPOTLIGHT EFFECT ON SERVICE ITEMS
───────────────────────────────────────── */
document.querySelectorAll('.spl-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--spl-x', ((e.clientX - r.left) / r.width  * 100) + '%');
    card.style.setProperty('--spl-y', ((e.clientY - r.top)  / r.height * 100) + '%');
  });
});

/* ─────────────────────────────────────────
   10. SCROLL-TRIGGERED REVEALS
───────────────────────────────────────── */
(function initReveals() {
  const rtObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('vis'); rtObs.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.rt').forEach(el => rtObs.observe(el));

  const rhObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        // Apply stored delays from data-d attr
        e.target.querySelectorAll('.rl').forEach(rl => {
          rl.querySelector('span').style.transitionDelay = (rl.dataset.d || 0) + 's';
        });
        e.target.classList.add('vis');
        rhObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.rh').forEach(el => rhObs.observe(el));
})();

/* ─────────────────────────────────────────
   11. QUOTE — WORD-BY-WORD REVEAL
───────────────────────────────────────── */
(function initQuoteWords() {
  const kq = document.querySelector('.kq');
  if (!kq) return;
  const words = kq.querySelectorAll('.qw');
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      words.forEach((w, i) => setTimeout(() => w.classList.add('vis'), i * 70));
      obs.disconnect();
    }
  }, { threshold: 0.25 });
  obs.observe(kq);
})();

/* ─────────────────────────────────────────
   12. ANIMATED COUNTERS
───────────────────────────────────────── */
(function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = parseInt(el.dataset.target, 10);
      const dur    = 1900;
      const start  = performance.now();
      const tick   = now => {
        const t = Math.min((now - start) / dur, 1);
        const v = 1 - Math.pow(1 - t, 3); // ease-out cubic
        el.textContent = Math.floor(v * target);
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      };
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.cnt').forEach(el => obs.observe(el));
})();

/* ─────────────────────────────────────────
   13. PARALLAX (founder photo)
───────────────────────────────────────── */
(function initParallax() {
  const photoEl = document.getElementById('founder-photo');
  if (!photoEl || window.innerWidth <= 700) return;

  const tick = () => {
    const r   = photoEl.getBoundingClientRect();
    const mid = r.top + r.height / 2 - window.innerHeight / 2;
    photoEl.querySelector('.photo-frame').style.transform =
      `rotate(-3deg) translateY(${mid * 0.07}px)`;
    requestAnimationFrame(tick);
  };
  tick();
})();

/* ─────────────────────────────────────────
   14. MARQUEE — SCROLL-VELOCITY SPEED
───────────────────────────────────────── */
(function initMarquee() {
  const track = document.getElementById('marq-track');
  if (!track) return;

  let lastY    = window.scrollY;
  let velocity = 0;
  let current  = 22;

  window.addEventListener('scroll', () => {
    velocity = Math.abs(window.scrollY - lastY);
    lastY    = window.scrollY;
  }, { passive: true });

  (function animMarquee() {
    const target = Math.max(5, 22 - velocity * 0.25);
    current += (target - current) * 0.05;
    track.style.animationDuration = current.toFixed(2) + 's';
    velocity *= 0.88;
    requestAnimationFrame(animMarquee);
  })();
})();

/* ─────────────────────────────────────────
   15. HERO REVEAL (after loader)
───────────────────────────────────────── */
function triggerHeroReveal() {
  // Headline lines slide up
  document.querySelectorAll('.hl').forEach((el, i) => {
    setTimeout(() => el.classList.add('show'), 180 + i * 140);
  });
  // Fade-up elements in hero
  document.querySelectorAll('.hero .rt').forEach((el, i) => {
    setTimeout(() => el.classList.add('vis'), 320 + i * 90);
  });
  // Scramble the top label text
  const label = document.querySelector('.hero-top .label');
  if (label) scramble(label, 'DECOR · STYLING · CURATION', 700);
}

/* ─────────────────────────────────────────
   16. TEXT SCRAMBLE
───────────────────────────────────────── */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ·— ';

function scramble(el, original, delay = 0) {
  if (!el) return;
  let frame = 0;
  const total = 22;
  const run = () => {
    const progress = frame / total;
    el.textContent = original.split('').map((ch, i) => {
      if (ch === ' ') return ' ';
      if (i / original.length < progress) return ch;
      return CHARS[Math.floor(Math.random() * CHARS.length)];
    }).join('');
    frame++;
    if (frame <= total) requestAnimationFrame(run);
    else el.textContent = original;
  };
  setTimeout(run, delay);
}

/* ─────────────────────────────────────────
   17. PARTICLE CONSTELLATION (footer)
───────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('ptcl-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  const resize = () => {
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width  = W;
    canvas.height = H;
    buildParticles();
  };

  const buildParticles = () => {
    particles = [];
    const n = Math.min(Math.floor(W / 14), 80);
    for (let i = 0; i < n; i++) {
      particles.push({
        x:  Math.random() * W,
        y:  Math.random() * H,
        r:  Math.random() * 1.4 + 0.4,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
      });
    }
  };

  const LINK_DIST = 90;

  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x = ((p.x + p.vx) + W) % W;
      p.y = ((p.y + p.vy) + H) % H;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(38,56,29,0.55)';
      ctx.fill();
    });
    // Draw connections
    ctx.strokeStyle = 'rgba(38,56,29,0.15)';
    ctx.lineWidth = 0.6;
    for (let i = 0; i < particles.length - 1; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < LINK_DIST) {
          ctx.globalAlpha = (1 - d / LINK_DIST) * 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  };

  new ResizeObserver(resize).observe(canvas.parentElement);
  resize();
  draw();
})();

/* ─────────────────────────────────────────
   18. BACK TO TOP
───────────────────────────────────────── */
document.getElementById('back-top')?.addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─────────────────────────────────────────
   19. MOBILE MENU — close on nav link in main
───────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', () => {
    const menu = document.getElementById('mob-menu');
    const hbg  = document.getElementById('hbg');
    if (menu?.classList.contains('open')) {
      menu.classList.remove('open');
      hbg?.classList.remove('open');
      hbg?.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  });
});

/* ─────────────────────────────────────────
   20. PHOTO TILT — story section
───────────────────────────────────────── */
(function initPhotoTilt() {
  const frame = document.querySelector('.photo-frame');
  if (!frame || window.innerWidth <= 700) return;
  frame.addEventListener('mousemove', e => {
    const r  = frame.getBoundingClientRect();
    const x  = (e.clientX - r.left) / r.width  - 0.5;
    const y  = (e.clientY - r.top)  / r.height - 0.5;
    frame.style.transform = `perspective(700px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) rotate(-1.5deg)`;
  });
  frame.addEventListener('mouseleave', () => {
    frame.style.transform = '';
  });
})();

/* ─────────────────────────────────────────
   21. KONAMI CODE — easter egg
───────────────────────────────────────── */
(function initEasterEgg() {
  const seq = [38,38,40,40,37,39,37,39,66,65]; // ↑↑↓↓←→←→BA
  let pos = 0;
  document.addEventListener('keydown', e => {
    if (e.keyCode === seq[pos]) {
      pos++;
      if (pos === seq.length) {
        document.querySelectorAll('.aurora .ab').forEach(b => {
          b.style.opacity = '0.9';
          b.style.filter  = 'blur(50px) hue-rotate(180deg)';
        });
        const msg = document.createElement('div');
        msg.style.cssText = `
          position:fixed; bottom:30px; left:50%; transform:translateX(-50%);
          background:var(--ink); color:var(--yellow); padding:14px 28px;
          font-family:Loum,Georgia,serif; font-size:18px; letter-spacing:1px;
          border-radius:4px; z-index:999; animation:fadeInUp 0.5s ease both;
        `;
        msg.textContent = '✨ You found the secret. Good eye.';
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 4000);
        pos = 0;
      }
    } else { pos = 0; }
  });
})();
