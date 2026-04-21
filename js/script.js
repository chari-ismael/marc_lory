/* ═══════════════════════════════════════════════════════════
   MARC LORY — Portfolio · script.js
   ═══════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════
   ⚙️  CONFIGURATION — Modifiez ces valeurs librement
   ══════════════════════════════════════════════════════════ */
const CONFIG = {
  // ── Chiffres clés (section À propos + Réseaux)
  nb_experiences:     3,       // années d'expérience
  nb_tournages:       5,       // nombre de tournages
  nb_twitch:          1200,    // abonnés Twitch
  nb_collecte:        1960,    // euros récoltés pour associations

  // ── Compteurs réseaux sociaux
  nb_instagram:       33,      // abonnés Instagram
  nb_linkedin:        300,     // connexions LinkedIn
  nb_projets:        4,        // projets publiés

  // ── CV sécurisé
  cv_code:           'CV26',   // code d'accès pour le CV
  cv_url:            './public/docs/CV-Marc-Lory-Comedien-2026.pdf', // URL/nom du fichier CV

  // ── Typewriter hero
  typewriter_words:  ['Comédien', 'Figurant', 'Créateur de contenu', 'Disponible'],
  typewriter_speed:  90,   // ms par lettre
  typewriter_pause:  2000, // ms entre les mots

  // ── Instagram handle (pour les liens)
  instagram_handle:  'marc_comedien_figurant',
};

/* ══════════════════════════════════════════════════════════
   UTILS
   ══════════════════════════════════════════════════════════ */
const $ = id => document.getElementById(id);
const $$ = s => document.querySelectorAll(s);

function toast(msg, type = 'ok') {
  const wrap = $('toast-wrap');
  if (!wrap) return;
  const el = document.createElement('div');
  el.className = `toast${type === 'error' ? ' error' : ''}`;
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

/* ══════════════════════════════════════════════════════════
   LOADER
   ══════════════════════════════════════════════════════════ */
function initLoader() {
  const loader = $('loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    }, 1600);
  });
}

/* ══════════════════════════════════════════════════════════
   NAVBAR — scroll behaviour + active link
   ══════════════════════════════════════════════════════════ */
function initNavbar() {
  const header = $('site-header');
  const links  = $$('.nav-link');
  const sections = $$('section[id]');

  // Scroll state
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
    $('back-top').classList.toggle('visible', window.scrollY > 400);

    // Active nav link
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 100) current = s.id;
    });
    links.forEach(l => {
      const href = l.getAttribute('href').slice(1);
      l.classList.toggle('active', href === current);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger
  const burger = document.querySelector('.hamburger');
  const menu   = document.querySelector('.nav-menu');
  burger?.addEventListener('click', () => {
    const open = !menu.classList.contains('open');
    menu.classList.toggle('open', open);
    burger.classList.toggle('active', open);
    burger.setAttribute('aria-expanded', open);
  });
  // Close menu on link click (mobile)
  menu?.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => {
      menu.classList.remove('open');
      burger.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ══════════════════════════════════════════════════════════
   SCROLL PROGRESS BAR
   ══════════════════════════════════════════════════════════ */
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const max = document.body.scrollHeight - window.innerHeight;
    bar.style.width = `${(window.scrollY / max) * 100}%`;
  }, { passive: true });
}

/* ══════════════════════════════════════════════════════════
   CUSTOM CURSOR (desktop only)
   ══════════════════════════════════════════════════════════ */
function initCursor() {
  const dot  = $('cursor-dot');
  const ring = $('cursor-ring');
  if (!dot || !ring || window.matchMedia('(hover:none)').matches) return;

  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    ring.style.left = mx + 'px';
    ring.style.top  = my + 'px';
  });

  document.querySelectorAll('a,button,[role=button]').forEach(el => {
    el.addEventListener('mouseenter', () => ring.style.transform = 'translate(-50%,-50%) scale(1.5)');
    el.addEventListener('mouseleave', () => ring.style.transform = 'translate(-50%,-50%) scale(1)');
  });
}

/* ══════════════════════════════════════════════════════════
   SCROLL REVEAL
   ══════════════════════════════════════════════════════════ */
function initReveal() {
  const els = $$('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const delay = parseInt(e.target.dataset.delay || 0);
      setTimeout(() => e.target.classList.add('visible'), delay);
      observer.unobserve(e.target);
    });
  }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════════════════════
   TYPEWRITER
   ══════════════════════════════════════════════════════════ */
function initTypewriter() {
  const el = $('tw-text');
  if (!el) return;

  const words = CONFIG.typewriter_words;
  let wi = 0, ci = 0, deleting = false;

  const tick = () => {
    const word = words[wi];
    if (deleting) {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length }
      setTimeout(tick, CONFIG.typewriter_speed * .5);
    } else {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) {
        deleting = true;
        setTimeout(tick, CONFIG.typewriter_pause);
      } else {
        setTimeout(tick, CONFIG.typewriter_speed);
      }
    }
  };
  setTimeout(tick, 1200);
}

/* ══════════════════════════════════════════════════════════
   HERO VIDEO — fade in when ready
   ══════════════════════════════════════════════════════════ */
function initHeroVideo() {
  const video = document.querySelector('.hero-video');
  if (!video) return;
  const onReady = () => video.classList.add('loaded');
  video.addEventListener('canplay', onReady, { once: true });
  video.addEventListener('loadeddata', onReady, { once: true });
}

/* ══════════════════════════════════════════════════════════
   COUNTER ANIMATION
   ══════════════════════════════════════════════════════════ */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  if (isNaN(target)) return;
  const duration = 1800;
  const start = performance.now();

  const step = now => {
    const progress = Math.min((now - start) / duration, 1);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString('fr-FR');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function initCounters() {
  // Sync with CONFIG values
  const syncMap = {
    '.about-stats .stat-num': [CONFIG.nb_experiences, CONFIG.nb_tournages, CONFIG.nb_twitch, CONFIG.nb_collecte],
    '.social-counters .sc-num': [CONFIG.nb_instagram, CONFIG.nb_twitch, CONFIG.nb_linkedin, CONFIG.nb_projets],
  };
  Object.entries(syncMap).forEach(([sel, vals]) => {
    $$(sel).forEach((el, i) => { if (vals[i] !== undefined) el.dataset.target = vals[i] });
  });

  const counters = $$('[data-target]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: .5 });
  counters.forEach(c => observer.observe(c));
}

/* ══════════════════════════════════════════════════════════
   BENTO VIDEO SHOWREEL
   ══════════════════════════════════════════════════════════ */
function initBento() {
  const items = $$('.bento-item');

  items.forEach(item => {
    const video = item.querySelector('.bento-video');
    if (!video) return;

    item.addEventListener('mouseenter', () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    });
    item.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });

    // Click — open lightbox
    item.addEventListener('click', () => openVideoLightbox(item));

    // Touch — single tap plays, double tap opens
    let tapTimer;
    item.addEventListener('touchend', e => {
      clearTimeout(tapTimer);
      tapTimer = setTimeout(() => {
        if (!video.paused) { video.pause() } else { video.play().catch(() => {}) }
      }, 250);
    });
  });
}

/* ══════════════════════════════════════════════════════════
   VIDEO LIGHTBOX
   ══════════════════════════════════════════════════════════ */
function openVideoLightbox(item) {
  const lb    = $('video-lb');
  const vid   = $('vlb-video');
  const title = $('vlb-title');
  const tags  = $('vlb-tags');
  if (!lb || !vid) return;

  vid.src = item.dataset.video || '';
  title.textContent = item.dataset.title || '';
  tags.innerHTML = (item.dataset.tags || '').split('·').map(t => `<span>${t.trim()}</span>`).join('');
  lb.classList.add('open');
  vid.play().catch(() => {});
  document.body.style.overflow = 'hidden';
}

function closeVideoLightbox() {
  const lb  = $('video-lb');
  const vid = $('vlb-video');
  if (!lb) return;
  lb.classList.remove('open');
  vid.pause();
  vid.src = '';
  document.body.style.overflow = '';
}

function initVideoLightbox() {
  $('vlb-close')?.addEventListener('click', closeVideoLightbox);
  $('video-lb')?.addEventListener('click', e => {
    if (e.target === $('video-lb')) closeVideoLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeVideoLightbox();
  });
}

/* ══════════════════════════════════════════════════════════
   GALLERY LIGHTBOX
   ══════════════════════════════════════════════════════════ */
function initGalleryLightbox() {
  const imgs = Array.from($$('.gallery-item img'));
  const lb   = $('lightbox');
  const lbImg = $('lb-img');
  const lbCounter = $('lb-counter');
  let current = 0;

  const open = i => {
    current = i;
    lbImg.src = imgs[i].src;
    lbImg.alt = imgs[i].alt;
    lbCounter.textContent = `${i + 1} / ${imgs.length}`;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => { lb.classList.remove('open'); document.body.style.overflow = '' };
  const prev  = () => open((current - 1 + imgs.length) % imgs.length);
  const next  = () => open((current + 1) % imgs.length);

  // Open on zoom button click
  $$('.gi-zoom').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      open(parseInt(btn.dataset.index));
    });
  });
  // Open on item click
  $$('.gallery-item').forEach((item, i) => {
    item.addEventListener('click', () => open(i));
  });

  $('lb-close')?.addEventListener('click', close);
  $('lb-prev')?.addEventListener('click', prev);
  $('lb-next')?.addEventListener('click', next);
  lb?.addEventListener('click', e => { if (e.target === lb) close() });

  // Keyboard + swipe
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'Escape')     close();
  });

  // Touch swipe
  let touchX = 0;
  lb?.addEventListener('touchstart', e => touchX = e.touches[0].clientX);
  lb?.addEventListener('touchend',   e => {
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev() }
  });
}

/* ══════════════════════════════════════════════════════════
   GALLERY — show more
   ══════════════════════════════════════════════════════════ */
function initGalleryMore() {
  const btn = $('gallery-more-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    $$('.gallery-hidden').forEach(el => {
      el.classList.remove('gallery-hidden');
      // Trigger reveal
      setTimeout(() => el.classList.add('visible'), 50);
    });
    btn.style.display = 'none';
  });
}

/* ══════════════════════════════════════════════════════════
   EXPERIENCE FILTER + SHOW MORE
   ══════════════════════════════════════════════════════════ */
function initExperiences() {
  // Filter buttons
  const filterBtns = $$('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      $$('.tl-item:not(.tl-hidden)').forEach(item => {
        const match = filter === 'all' || item.dataset.cat === filter;
        item.classList.toggle('filtered', !match);
      });
    });
  });

  // Show more
  const moreBtn = $('exp-more-btn');
  if (!moreBtn) return;
  moreBtn.addEventListener('click', () => {
    $$('.tl-hidden').forEach(el => {
      el.classList.remove('tl-hidden');
      setTimeout(() => el.classList.add('visible'), 50);
    });
    moreBtn.style.display = 'none';
  });
}

/* ══════════════════════════════════════════════════════════
   SKILL TOOLTIP
   ══════════════════════════════════════════════════════════ */
function initSkillTooltip() {
  const tip = $('skill-tooltip');
  if (!tip) return;

  $$('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', e => {
      const detail = tag.dataset.detail;
      if (!detail) return;
      tip.textContent = detail;
      tip.classList.add('show');
    });
    tag.addEventListener('mousemove', e => {
      tip.style.left = (e.clientX + 14) + 'px';
      tip.style.top  = (e.clientY - 36) + 'px';
    });
    tag.addEventListener('mouseleave', () => tip.classList.remove('show'));
  });
}

/* ══════════════════════════════════════════════════════════
   TESTIMONIALS CAROUSEL
   ══════════════════════════════════════════════════════════ */
function initTestimonials() {
  const track  = $('testi-track');
  const dotsEl = $('testi-dots');
  if (!track) return;

  const cards = track.querySelectorAll('.testi-card');
  let current = 0;
  let autoTimer;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = `testi-dot${i === 0 ? ' active' : ''}`;
    dot.setAttribute('aria-label', `Témoignage ${i + 1}`);
    dot.addEventListener('click', () => go(i));
    dotsEl?.appendChild(dot);
  });

  const go = i => {
    current = (i + cards.length) % cards.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsEl?.querySelectorAll('.testi-dot').forEach((d, idx) => {
      d.classList.toggle('active', idx === current);
    });
  };

  $('testi-prev')?.addEventListener('click', () => { go(current - 1); resetAuto() });
  $('testi-next')?.addEventListener('click', () => { go(current + 1); resetAuto() });

  const startAuto = () => { autoTimer = setInterval(() => go(current + 1), 5500) };
  const resetAuto = () => { clearInterval(autoTimer); startAuto() };
  startAuto();

  // Touch swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX }, { passive: true });
  track.addEventListener('touchend',   e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { go(current + (diff > 0 ? 1 : -1)); resetAuto() }
  });
}

/* ══════════════════════════════════════════════════════════
   FAQ
   ══════════════════════════════════════════════════════════ */
function initFAQ() {
  // Smooth close — ensure only one open at a time (optional)
  $$('.faq-item').forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        $$('.faq-item[open]').forEach(other => {
          if (other !== item) other.removeAttribute('open');
        });
      }
    });
  });
}

/* ══════════════════════════════════════════════════════════
   CV POPUP
   ══════════════════════════════════════════════════════════ */
function initCVPopup() {
  const overlay  = $('popup-overlay');
  const input    = $('code-input');
  const errMsg   = $('error-msg');
  const open     = () => { overlay.classList.add('open'); input?.focus() };
  const close    = () => { overlay.classList.remove('open'); if (errMsg) errMsg.textContent = '' };
  const validate = () => {
    if (input.value.trim() === CONFIG.cv_code) {
      close();
      toast('Téléchargement en cours…');
      const a = document.createElement('a');
      a.href = CONFIG.cv_url;
      a.download = CONFIG.cv_url;
      a.click();
    } else {
      if (errMsg) errMsg.textContent = 'Code incorrect. Réessayez.';
      input.value = '';
      input.focus();
    }
  };

  $('cv-btn')?.addEventListener('click', open);
  $('cv-inline-btn')?.addEventListener('click', open);
  $('popup-cancel')?.addEventListener('click', close);
  $('popup-submit')?.addEventListener('click', validate);
  input?.addEventListener('keydown', e => { if (e.key === 'Enter') validate() });
  overlay?.addEventListener('click', e => { if (e.target === overlay) close() });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('open')) close() });
}

/* ══════════════════════════════════════════════════════════
   CONTACT FORM
   ══════════════════════════════════════════════════════════ */
function initContactForm() {
  const form = $('contact-form');
  if (!form) return;

  const validate = () => {
    let valid = true;
    const name  = $('c-name');
    const email = $('c-email');
    const msg   = $('c-message');

    const setErr = (id, txt) => {
      const el = $(id);
      if (el) el.textContent = txt;
      if (txt) valid = false;
    };

    setErr('err-name',  name.value.trim().length < 2 ? 'Nom requis.' : '');
    setErr('err-email', !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) ? 'Email invalide.' : '');
    setErr('err-msg',   msg.value.trim().length < 10  ? 'Message trop court.' : '');
    return valid;
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validate()) return;

    const btn = $('submit-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi…';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        toast('Message envoyé ! Je vous réponds sous 24h.');
        form.reset();
      } else {
        toast('Erreur. Contactez-moi par email.', 'error');
      }
    } catch {
      toast('Erreur réseau. Réessayez.', 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Envoyer le message';
    }
  });
}

/* ══════════════════════════════════════════════════════════
   NEWSLETTER FORM
   ══════════════════════════════════════════════════════════ */
function initNewsletter() {
  const form = $('newsletter-form');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    toast('Merci pour votre inscription !');
    form.reset();
  });
}

/* ══════════════════════════════════════════════════════════
   THEME TOGGLE
   ══════════════════════════════════════════════════════════ */
function initTheme() {
  const btn  = $('theme-toggle');
  const saved = localStorage.getItem('ml-theme');
  if (saved === 'light') document.body.classList.add('light');

  btn?.addEventListener('click', () => {
    document.body.classList.toggle('light');
    localStorage.setItem('ml-theme', document.body.classList.contains('light') ? 'light' : 'dark');
  });
}

/* ══════════════════════════════════════════════════════════
   BACK TO TOP
   ══════════════════════════════════════════════════════════ */
function initBackTop() {
  $('back-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ══════════════════════════════════════════════════════════
   FOOTER YEAR
   ══════════════════════════════════════════════════════════ */
function initFooter() {
  const el = $('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ══════════════════════════════════════════════════════════
   SMOOTH ANCHOR SCROLL (offset for fixed header)
   ══════════════════════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ══════════════════════════════════════════════════════════
   LAZY IMAGES — native loading="lazy" is enough,
   but we also add a fade-in once loaded
   ══════════════════════════════════════════════════════════ */
function initLazyImages() {
  const imgs = document.querySelectorAll('img[loading="lazy"]');
  imgs.forEach(img => {
    img.style.transition = 'opacity .5s ease';
    img.style.opacity = img.complete ? 1 : 0;
    img.addEventListener('load', () => { img.style.opacity = 1 });
  });
}

/* ══════════════════════════════════════════════════════════
   INSTAGRAM — update all insta links with real handle
   ══════════════════════════════════════════════════════════ */
function initInstaLinks() {
  const baseUrl = `https://www.instagram.com/${CONFIG.instagram_handle}/`;
  // All instagram thumb links redirect to profile (API needed for individual posts)
  $$('.insta-thumb').forEach(a => { a.href = baseUrl });
}

/* ══════════════════════════════════════════════════════════
   BOOT
   ══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavbar();
  initScrollProgress();
  initCursor();
  initReveal();
  initTypewriter();
  initHeroVideo();
  initCounters();
  initBento();
  initVideoLightbox();
  initGalleryLightbox();
  initGalleryMore();
  initExperiences();
  initSkillTooltip();
  initTestimonials();
  initFAQ();
  initCVPopup();
  initContactForm();
  initNewsletter();
  initTheme();
  initBackTop();
  initFooter();
  initSmoothScroll();
  initLazyImages();
  initInstaLinks();
});
