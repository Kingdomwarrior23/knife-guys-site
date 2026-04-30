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

  // ── Scroll-Frame Blade Animation ──
  const TOTAL_FRAMES = 97;
  const heroSection = document.querySelector('.hero');
  const heroFrame = document.getElementById('heroFrame');
  const scrollHint = document.getElementById('scrollHint');

  if (heroSection && heroFrame) {
    const frameCache = [];
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `frames/f_${String(i).padStart(4, '0')}.jpg`;
      frameCache.push(img);
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = heroSection.getBoundingClientRect();
          const heroH = heroSection.offsetHeight - window.innerHeight;
          const p = Math.min(1, Math.max(0, -rect.top / heroH));
          const idx = Math.min(TOTAL_FRAMES - 1, Math.floor(p * TOTAL_FRAMES));
          if (frameCache[idx] && frameCache[idx].complete) heroFrame.src = frameCache[idx].src;
          if (scrollHint) scrollHint.style.opacity = Math.max(0, 1 - p * 5);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
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

    // Hero entrance
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && !prefersReducedMotion) {
      const badge = heroContent.querySelector('.hero-badge');
      const title = heroContent.querySelector('.hero-title');
      const subtitle = heroContent.querySelector('.hero-subtitle');
      const actions = heroContent.querySelector('.hero-actions');

      const tl = gsap.timeline({ delay: 2.4 });
      if (badge) tl.fromTo(badge, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
      if (title) tl.fromTo(title, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.3');
      if (subtitle) tl.fromTo(subtitle, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4');
      if (actions) tl.fromTo(actions, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3');
    }

    // Section headers — fade in + slide up
    gsap.utils.toArray('.section-header.reveal').forEach(el => {
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
      gsap.to(ctaBg, {
        y: -80,
        ease: 'none',
        scrollTrigger: { trigger: '.cta-banner', start: 'top bottom', end: 'bottom top', scrub: 1 }
      });
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
