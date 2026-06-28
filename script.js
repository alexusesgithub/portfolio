/**
 * script.js — Alex A Portfolio V2
 * Lean vanilla JS: nav, mobile menu, IntersectionObserver reveal,
 * active nav highlighting, mobile drawer, keyboard traps.
 */

(function () {
  'use strict';

  /* ─── Util ─────────────────────────────────────────────────────────── */
  const qs  = (s, ctx = document) => ctx.querySelector(s);
  const qsa = (s, ctx = document) => [...ctx.querySelectorAll(s)];

  /* ─── Rotating Specialization — Ping-Pong Engine ────────────────────────
   *
   * Two <span> elements (A and B) are always in the DOM.
   * "On stage" span = spec-on   (opacity:1, translateY:0,  blur:0)
   * "Off stage" span = spec-off  (opacity:0, translateY:-16px, blur:6px)
   * "Waiting"   span = spec-off-below (opacity:0, translateY:16px, blur:6px)
   *
   * Each rotation cycle:
   *   1. Write the next phrase to the standby span
   *   2. Swap classes: standby → spec-on, active → spec-off
   *   3. CSS transitions fire on BOTH simultaneously (500ms)
   *
   * Zero DOM creation during animation. Zero nested timeouts.
   * ─────────────────────────────────────────────────────────────────────── */
  const specStage = qs('#spec-stage');

  const phrases = [
    'Full Stack Development',
    'AI Engineering',
    'Machine Learning',
    'Spring Boot APIs',
    'Modern Web Apps',
    'Generative AI',
    'REST API Design',
    'Backend Systems',
  ];

  if (specStage) {
    const spanA = qs('#spec-a');
    const spanB = qs('#spec-b');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      // Static: just show first phrase, hide B
      if (spanA) spanA.textContent = phrases[0];
      if (spanB) spanB.style.display = 'none';
    } else {
      let phraseIdx = 1;           // B starts pre-loaded with phrases[1]
      let activeSpan  = spanA;    // currently ON stage
      let standbySpan = spanB;    // currently waiting below

      // Ensure correct initial classes
      if (spanA) { spanA.className = 'spec-span spec-on'; }
      if (spanB) { spanB.className = 'spec-span spec-off-below'; spanB.removeAttribute('aria-hidden'); }

      function rotate() {
        // 1. Load next phrase into the standby span
        phraseIdx = (phraseIdx + 1) % phrases.length;
        standbySpan.textContent = phrases[phraseIdx];
        specStage.setAttribute('aria-label', phrases[phraseIdx]);

        // 2. Swap classes — triggers CSS transitions on both spans at once
        //    Active: spec-on → spec-off  (fades up, blurs out)
        //    Standby: spec-off-below → spec-on  (rises up, unblurs)
        activeSpan.className  = 'spec-span spec-off';
        standbySpan.className = 'spec-span spec-on';

        // 3. Swap roles for next cycle, reset the now-offstage span to "below"
        const prev = activeSpan;
        activeSpan  = standbySpan;
        standbySpan = prev;

        // 4. After the exit transition finishes (500ms), move standby to below
        //    position so it's ready to enter from below next time.
        //    Use a timeout slightly longer than the CSS transition (500ms + buffer).
        setTimeout(() => {
          standbySpan.className = 'spec-span spec-off-below';
        }, 520);
      }

      // Start rotating. Pause when hero is off-screen to save CPU.
      let timer = null;
      const heroSection = qs('#home');

      function startTimer() { if (!timer) timer = setInterval(rotate, 3100); }
      function stopTimer()  { clearInterval(timer); timer = null; }

      if (heroSection && 'IntersectionObserver' in window) {
        new IntersectionObserver(entries => {
          entries[0].isIntersecting ? startTimer() : stopTimer();
        }, { threshold: 0.2 }).observe(heroSection);
      } else {
        startTimer();
      }
    }
  }


  /* ─── Navigation: scroll-based class & active link ──────────────────── */
  const header   = qs('.site-header');
  const navLinks = qsa('.nav-link');
  const sections = qsa('section[id], div[id]');

  let ticking = false;

  function onScroll() {
    if (ticking) return;
    window.requestAnimationFrame(() => {
      // Sticky header bg
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Active nav link highlight
      let current = '';
      sections.forEach(sec => {
        const top = sec.getBoundingClientRect().top;
        if (top <= 80) current = sec.id;
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });

      ticking = false;
    });
    ticking = true;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ─── Smooth Scroll for all anchor links ─────────────────────────────── */
  document.addEventListener('click', e => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const id     = anchor.getAttribute('href');
    const target = qs(id);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ─── Mobile Menu ────────────────────────────────────────────────────── */
  const openBtn  = qs('.mobile-menu-btn');
  const closeBtn = qs('.mobile-nav-close');
  const mobileNav     = qs('#mobile-nav');
  const mobileOverlay = qs('.mobile-nav-overlay');
  const mobileLinks   = qsa('.mobile-nav-link');
  let lastFocused = null;

  function openMobileNav() {
    mobileNav.classList.add('open');
    mobileOverlay.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    lastFocused = document.activeElement;
    // Focus close button
    setTimeout(() => closeBtn.focus(), 50);
    trapFocus(mobileNav);
  }

  function closeMobileNav() {
    mobileNav.classList.remove('open');
    mobileOverlay.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  openBtn.addEventListener('click', openMobileNav);
  closeBtn.addEventListener('click', closeMobileNav);
  mobileOverlay.addEventListener('click', closeMobileNav);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // Keyboard: close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      closeMobileNav();
    }
  });

  // Focus trap
  function trapFocus(modal) {
    const focusable = qsa(
      'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
      modal
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    modal.addEventListener('keydown', function handler(e) {
      if (e.key !== 'Tab') return;
      if (!modal.classList.contains('open')) {
        modal.removeEventListener('keydown', handler);
        return;
      }
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* ─── Scroll Reveal (IntersectionObserver) ───────────────────────────── */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealElements = qsa('.reveal');

  if (!prefersReduced && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el, i) => {
      // Stagger siblings within same parent
      el.style.transitionDelay = `${i * 40}ms`;
      observer.observe(el);
    });
  } else {
    // Immediately reveal for accessibility / no-motion
    revealElements.forEach(el => el.classList.add('in-view'));
  }

  /* ─── Stagger reveal delay reset per section ─────────────────────────── */
  // Reset stagger per section so it doesn't accumulate globally
  qsa('section').forEach(section => {
    const els = qsa('.reveal', section);
    els.forEach((el, i) => {
      el.style.transitionDelay = `${i * 60}ms`;
    });
  });

})();
