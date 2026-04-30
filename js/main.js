/* ============================================
   THE KNIFE GUYS — Premium Interactions
   GSAP ScrollTrigger + Scroll-Frame + Effects
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Reduced Motion Check ──
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Loading Screen ──
  const loader = document.querySelector('.loading-screen');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 2200);
  }

  // ── Custom Cursor (desktop only) ──
  if (!prefersReducedMotion) {
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    if (cursorDot && cursorRing && window.matchMedia('(hover: hover)').matches) {
      let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
      document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; cursorDot.style.left = mouseX + 'px'; cursorDot.style.top = mouseY + 'px'; });
      function animateRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
        requestAnimationFrame(animateRing);
      }
      animateRing();
      document.querySelectorAll('a, button, .btn, [role="button"]').forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
      });
    }
  }

  // ── Navigation ──
  const nav = document.querySelector('.nav');
  const scrollProgress = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
    if (scrollProgress) {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.style.width = (window.scrollY / docH * 100) + '%';
    }
  }, { passive: true });

  // ── Mobile Nav Toggle ──
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => navLinks.classList.remove('open')));
  }

  // ── Active Nav Link ──
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) link.classList.add('active');
  });

  // ── Animated Counters ──
  document.querySelectorAll('.counter').forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const suffix = counter.getAttribute('data-suffix') || '';
    const prefix = counter.getAttribute('data-prefix') || '';
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) { current = target; clearInterval(timer); }
          counter.textContent = prefix + Math.floor(current) + suffix;
        }, 25);
        obs.unobserve(counter);
      }
    }, { threshold: 0.5 });
    obs.observe(counter);
  });

  // ── FAQ Accordion ──
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ── Button Ripple Effect ──
  if (!prefersReducedMotion) {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        ripple.style.cssText = `position:absolute;border-radius:50%;background:rgba(255,255,255,0.3);width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px;transform:scale(0);animation:rippleAnim 0.6s ease-out;pointer-events:none;`;
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  // ── Smooth Scroll for Anchor Links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ── GSAP ScrollTrigger Animations ──
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Premium hero word reveal + blade draw-in
    const splitTitle = document.querySelector('[data-split]');
    if (splitTitle) {
      const words = splitTitle.textContent.trim().split(/\s+/);
      splitTitle.innerHTML = words.map(w => `<span class="word"><span class="word-inner">${w}</span></span>`).join(' ');
    }

    if (!prefersReducedMotion) {
      const tl = gsap.timeline({ delay: 2.15 });
      tl.fromTo('.kg-eyebrow', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .55, ease: 'power2.out' })
        .to('.kg-word-title .word-inner', { y: 0, opacity: 1, duration: .7, stagger: .055, ease: 'power3.out' }, '-=.18')
        .fromTo('.kg-hero-lede', { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: .65, ease: 'power2.out' }, '-=.28')
        .fromTo('.kg-hero-actions, .kg-trust-line', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .55, stagger: .1, ease: 'power2.out' }, '-=.25')
        .fromTo('.kg-blade-stage', { opacity: 0, scale: .92, rotate: -4 }, { opacity: 1, scale: 1, rotate: 0, duration: .9, ease: 'power3.out' }, '-=.95')
        .fromTo('.blade-edge, .blade-highlight', { strokeDasharray: 700, strokeDashoffset: 700 }, { strokeDashoffset: 0, duration: .9, ease: 'power2.inOut' }, '-=.35')
        .fromTo('.kg-product-note', { opacity: 0, x: 18 }, { opacity: 1, x: 0, duration: .5, ease: 'power2.out' }, '-=.25');

      gsap.to('.kg-blade-stage', { y: -16, duration: 3.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      gsap.to('.ring-one', { rotateZ: 360, duration: 34, repeat: -1, ease: 'none' });
      gsap.to('.ring-two', { rotateZ: -360, duration: 42, repeat: -1, ease: 'none' });

      // Magnetic buttons, desktop only
      if (window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.kg-magnetic').forEach(btn => {
          btn.addEventListener('mousemove', e => {
            const r = btn.getBoundingClientRect();
            const x = (e.clientX - r.left - r.width / 2) * .14;
            const y = (e.clientY - r.top - r.height / 2) * .14;
            gsap.to(btn, { x, y, duration: .25, ease: 'power2.out' });
          });
          btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: .35, ease: 'power2.out' }));
        });
      }
    } else {
      document.querySelectorAll('.kg-word-title .word-inner').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    }

    // Section headers — fade in + slide up
    gsap.utils.toArray('.section-header.reveal, .kg-section-head.reveal, .kg-split-copy.reveal').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    });

    // Staggered grids (stats, product cards, process steps, testimonials)
    gsap.utils.toArray('.gsap-stagger').forEach(container => {
      const items = container.querySelectorAll('.gsap-stagger-item');
      if (items.length === 0) return;
      gsap.fromTo(items,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: container, start: 'top 80%', toggleActions: 'play none none none' }
        }
      );
    });

    // CTA banner
    gsap.utils.toArray('.gsap-reveal').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    });

    // Brand strip — infinite scroll
    const brandStrip = document.querySelector('.brand-strip-inner');
    if (brandStrip && !prefersReducedMotion) {
      gsap.to(brandStrip, {
        x: '-50%',
        duration: 20,
        ease: 'none',
        repeat: -1
      });
    }

    // Parallax on CTA banner background
    const ctaBg = document.querySelector('.cta-banner-bg');
    if (ctaBg && !prefersReducedMotion) {
      gsap.to(ctaBg, { y: -80, ease: 'none', scrollTrigger: { trigger: '.cta-banner', start: 'top bottom', end: 'bottom top', scrub: 1 } });
    }

    const ctaLines = document.querySelector('.kg-cta-lines');
    if (ctaLines && !prefersReducedMotion) {
      gsap.to(ctaLines, { xPercent: -10, ease: 'none', scrollTrigger: { trigger: '.kg-cta-band', start: 'top bottom', end: 'bottom top', scrub: 1 } });
    }

    // Refresh ScrollTrigger after all images load
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }

  // ── Ripple CSS keyframe injection ──
  if (!document.getElementById('ripple-styles')) {
    const style = document.createElement('style');
    style.id = 'ripple-styles';
    style.textContent = '@keyframes rippleAnim { to { transform: scale(4); opacity: 0; } }';
    document.head.appendChild(style);
  }
});
