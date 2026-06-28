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
