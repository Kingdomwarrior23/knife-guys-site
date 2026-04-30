/**
 * Content Loader — reads content.json and populates the page
 * Dashboard edits appear on the live site automatically
 */
(async function() {
  try {
    const resp = await fetch('/content.json');
    if (!resp.ok) return;
    const c = await resp.json();

    // Hero
    if (c.hero) {
      const h = c.hero;
      const badge = document.querySelector('.hero-badge');
      const title = document.querySelector('.hero-title');
      const subtitle = document.querySelector('.hero-subtitle');
      const btns = document.querySelectorAll('.hero-actions .btn');
      
      if (badge && h.badge) badge.textContent = h.badge;
      if (title && h.title) title.innerHTML = h.title;
      if (subtitle && h.subtitle) subtitle.textContent = h.subtitle;
      if (btns[0] && h.ctaPrimary) { btns[0].textContent = h.ctaPrimary.text; btns[0].href = h.ctaPrimary.link; }
      if (btns[1] && h.ctaSecondary) { btns[1].textContent = h.ctaSecondary.text; btns[1].href = h.ctaSecondary.link; }

      // Background type
      if (h.backgroundType === 'video' && h.videoSrc) {
        const heroSticky = document.querySelector('.hero-sticky');
        const frame = document.getElementById('heroFrame');
        if (heroSticky && frame) {
          // Replace frame image with video
          const video = document.createElement('video');
          video.src = h.videoSrc;
          video.autoplay = true;
          video.loop = true;
          video.muted = true;
          video.playsInline = true;
          video.className = 'hero-frame';
          video.id = 'heroVideo';
          video.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover';
          frame.replaceWith(video);
          // Hide scroll hint since no scroll animation
          const hint = document.getElementById('scrollHint');
          if (hint) hint.style.display = 'none';
          // Reset hero height
          document.querySelector('.hero').style.height = '100vh';
        }
      } else if (h.backgroundType === 'image' && h.posterImage) {
        const frame = document.getElementById('heroFrame');
        if (frame) {
          frame.src = h.posterImage;
          // Disable scroll animation
          const hint = document.getElementById('scrollHint');
          if (hint) hint.style.display = 'none';
          document.querySelector('.hero').style.height = '100vh';
        }
      }
    }

    // About
    if (c.about) {
      const label = document.querySelector('#about .section-label');
      const title = document.querySelector('#about .section-title');
      const subtitle = document.querySelector('#about .section-subtitle');
      if (label && c.about.label) label.textContent = c.about.label;
      if (title && c.about.title) title.textContent = c.about.title;
      if (subtitle && c.about.subtitle) subtitle.textContent = c.about.subtitle;
    }

    // Products
    if (c.products && c.products.length) {
      const cards = document.querySelectorAll('.product-card');
      c.products.forEach((p, i) => {
        if (!cards[i]) return;
        const label = cards[i].querySelector('.product-card-label');
        const title = cards[i].querySelector('.product-card-title');
        const desc = cards[i].querySelector('.product-card-desc');
        const price = cards[i].querySelector('.product-card-price');
        const cta = cards[i].querySelector('.product-card-cta');
        const img = cards[i].querySelector('.product-card-img');
        const kenBurns = cards[i].querySelector('.ken-burns-inner');
        
        if (label) label.textContent = p.label;
        if (title) title.textContent = p.title;
        if (desc) desc.textContent = p.desc;
        if (price) price.textContent = p.price;
        if (cta) { cta.textContent = p.cta; cta.href = p.link; }
        if (img && p.image) { 
          img.style.backgroundImage = `url('${p.image}')`; 
          if (kenBurns) kenBurns.style.backgroundImage = `url('${p.image}')`;
        }
      });
    }

    // Why Us
    if (c.whyUs) {
      const section = document.querySelectorAll('.section')[2]; // 3rd section
      if (section) {
        const label = section.querySelector('.section-label');
        const title = section.querySelector('.section-title');
        const subtitle = section.querySelector('.section-subtitle');
        if (label && c.whyUs.label) label.textContent = c.whyUs.label;
        if (title && c.whyUs.title) title.textContent = c.whyUs.title;
        if (subtitle && c.whyUs.subtitle) subtitle.textContent = c.whyUs.subtitle;
      }
    }

    // Testimonials
    if (c.testimonials && c.testimonials.length) {
      const els = document.querySelectorAll('.testimonial');
      c.testimonials.forEach((t, i) => {
        if (!els[i]) return;
        const text = els[i].querySelector('.testimonial-text');
        const author = els[i].querySelector('.testimonial-author');
        const role = els[i].querySelector('.testimonial-role');
        if (text) text.textContent = t.text;
        if (author) author.textContent = t.author;
        if (role) role.textContent = t.role;
      });
    }

    // FAQ
    if (c.faq && c.faq.length) {
      const items = document.querySelectorAll('.faq-item');
      c.faq.forEach((f, i) => {
        if (!items[i]) return;
        const q = items[i].querySelector('.faq-question');
        const a = items[i].querySelector('.faq-answer p');
        if (q) q.textContent = f.q;
        if (a) a.textContent = f.a;
      });
    }

  } catch (e) {
    // content.json not found or parse error — site works with static HTML
    console.log('Content loader: using static HTML content');
  }
})();
