/* ============================================
   THE KNIFE GUYS — Premium Interactions
   GSAP ScrollTrigger + Smooth Scroll + Effects
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Loading Screen ──
  const loader = document.querySelector('.loading-screen');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 2200);
  }

  // ── Custom Cursor ──
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  if (cursorDot && cursorRing && window.matchMedia('(hover: hover)').matches) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });
    
    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();
    
    // Hover state on interactive elements
    document.querySelectorAll('a, button, .btn, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
    });
  }

  // ── Scroll-Frame Blade Animation ──
  const TOTAL_FRAMES = 97;
  const heroSection = document.querySelector('.hero');
  const heroFrame = document.getElementById('heroFrame');
  const scrollHint = document.getElementById('scrollHint');

  if (heroSection && heroFrame) {
    // Preload all frames
    const frameCache = [];
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `frames/f_${String(i).padStart(4, '0')}.jpg`;
      frameCache.push(img);
    }

    // Update frame on scroll (works with or without Lenis)
    function updateHeroFrame() {
      const rect = heroSection.getBoundingClientRect();
      const heroH = heroSection.offsetHeight - window.innerHeight;
      const raw = -rect.top / heroH;
      const p = Math.min(1, Math.max(0, raw));

      // Update frame
      const idx = Math.min(TOTAL_FRAMES - 1, Math.floor(p * TOTAL_FRAMES));
      if (frameCache[idx] && frameCache[idx].complete) {
        heroFrame.src = frameCache[idx].src;
      }

      // Fade scroll hint
      if (scrollHint) {
        scrollHint.style.opacity = Math.max(0, 1 - p * 5);
      }
    }

    window.addEventListener('scroll', updateHeroFrame, { passive: true });
    // Initial call
    updateHeroFrame();
  }

  // ── Navigation Scroll Effect ──
  const nav = document.querySelector('.nav');
  const scrollProgress = document.querySelector('.scroll-progress');
  
  window.addEventListener('scroll', () => {
    if (nav) {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    }
    if (scrollProgress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / docHeight) * 100;
      scrollProgress.style.width = progress + '%';
    }
    // Also handle ID-based scroll progress
    const scrollProgressById = document.getElementById('scrollProgress');
    if (scrollProgressById) {
      const docHeight2 = document.documentElement.scrollHeight - window.innerHeight;
      const progress2 = (window.scrollY / docHeight2) * 100;
      scrollProgressById.style.width = progress2 + '%';
    }
  });

  // ── Mobile Nav Toggle ──
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // ── Active Nav Link ──
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── Scroll Reveal (IntersectionObserver — performant) ──
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    revealObserver.observe(el);
  });

  // ── Staggered Reveal for Grid Items ──
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = entry.target.querySelectorAll('.stagger-item');
        children.forEach((child, i) => {
          setTimeout(() => {
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
          }, i * 150);
        });
        staggerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.stagger-grid').forEach(grid => {
    grid.querySelectorAll('.stagger-item').forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(30px)';
      item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    staggerObserver.observe(grid);
  });

  // ── Hero Entrance Animation ──
  const hero = document.querySelector('.hero');
  if (hero) {
    const badge = hero.querySelector('.hero-badge');
    const title = hero.querySelector('.hero-title');
    const subtitle = hero.querySelector('.hero-subtitle');
    const actions = hero.querySelector('.hero-actions');

    setTimeout(() => {
      if (badge) {
        badge.style.opacity = '1';
        badge.style.transform = 'translateY(0)';
        badge.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      }
    }, 2400);
    setTimeout(() => {
      if (title) {
        title.style.opacity = '1';
        title.style.transform = 'translateY(0)';
        title.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      }
    }, 2600);
    setTimeout(() => {
      if (subtitle) {
        subtitle.style.opacity = '1';
        subtitle.style.transform = 'translateY(0)';
        subtitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      }
    }, 2900);
    setTimeout(() => {
      if (actions) {
        actions.style.opacity = '1';
        actions.style.transform = 'translateY(0)';
        actions.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      }
    }, 3100);
  }

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
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          counter.textContent = prefix + Math.floor(current) + suffix;
        }, 25);
        obs.unobserve(counter);
      }
    }, { threshold: 0.5 });
    obs.observe(counter);
  });

  // ── Parallax on Scroll ──
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  if (parallaxElements.length > 0) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          parallaxElements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-parallax')) || 0.3;
            const rect = el.getBoundingClientRect();
            const offset = (rect.top - window.innerHeight / 2) * speed;
            el.style.transform = `translateY(${offset}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ── FAQ Accordion ──
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      
      // Close all others
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
      });
      
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  // ── 3D Card Tilt Effect ──
  document.querySelectorAll('.product-card, .category-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = (y - rect.height / 2) / 20;
      const rotateY = (rect.width / 2 - x) / 20;
      card.style.transform = `perspective(800px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // ── Button Ripple Effect ──
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.3);
        width: ${Math.max(rect.width, rect.height)}px;
        height: ${Math.max(rect.width, rect.height)}px;
        left: ${e.clientX - rect.left - Math.max(rect.width, rect.height)/2}px;
        top: ${e.clientY - rect.top - Math.max(rect.width, rect.height)/2}px;
        transform: scale(0);
        animation: rippleAnim 0.6s ease-out;
        pointer-events: none;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ── Smooth Scroll for Anchor Links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── GSAP ScrollTrigger (if loaded) ──
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Section reveals with GSAP
    gsap.utils.toArray('.gsap-reveal').forEach(el => {
      gsap.from(el, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });

    // Staggered grids with GSAP
    gsap.utils.toArray('.gsap-stagger').forEach(container => {
      const items = container.querySelectorAll('.gsap-stagger-item');
      gsap.from(items, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    });

    // Pin sections for scroll storytelling
    gsap.utils.toArray('.pin-section').forEach(section => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        pin: true,
        pinSpacing: false
      });
    });
  }

  // ── Ripple CSS keyframe injection ──
  if (!document.getElementById('ripple-styles')) {
    const style = document.createElement('style');
    style.id = 'ripple-styles';
    style.textContent = `
      @keyframes rippleAnim {
        to { transform: scale(4); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  // ── Lenis Smooth Scroll ──
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2
    });
    
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    
    // Sync GSAP ScrollTrigger with Lenis
    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
    }
  }
});
