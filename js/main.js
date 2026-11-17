/**
 * RUMMAN JALALI — PORTFOLIO CORE JAVASCRIPT
 * LUXURY MINIMALIST + MODERN EDITORIAL
 * "DATA MINDED. WORLD CURIOUS."
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Management (Dark / Light Switcher)
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const storedTheme = localStorage.getItem('rumman_portfolio_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const currentTheme = storedTheme || (systemPrefersDark ? 'dark' : 'dark');
  document.documentElement.setAttribute('data-theme', currentTheme);

  const updateThemeButtonAria = (theme) => {
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
  };
  updateThemeButtonAria(currentTheme);

  themeToggleBtn?.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('rumman_portfolio_theme', newTheme);
    updateThemeButtonAria(newTheme);
  });

  // 2. Dynamic Year
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 3. Sticky Navbar & Active Link Observer
  const siteNav = document.getElementById('site-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const sections = document.querySelectorAll('section[id]');

  const handleNavScroll = () => {
    if (window.scrollY > 40) {
      siteNav?.classList.add('scrolled');
    } else {
      siteNav?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // Active section spy
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
        mobileLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -60% 0px'
  });

  sections.forEach(sec => sectionObserver.observe(sec));

  // 4. Mobile Hamburger Menu Drawer
  const hamburger = document.getElementById('hamburger-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');

  const toggleMobileMenu = (forceClose = false) => {
    const isOpen = forceClose ? false : !mobileDrawer?.classList.contains('is-open');
    if (isOpen) {
      hamburger?.classList.add('is-active');
      mobileDrawer?.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      hamburger?.setAttribute('aria-expanded', 'true');
    } else {
      hamburger?.classList.remove('is-active');
      mobileDrawer?.classList.remove('is-open');
      document.body.style.overflow = '';
      hamburger?.setAttribute('aria-expanded', 'false');
    }
  };

  hamburger?.addEventListener('click', () => toggleMobileMenu());
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(true));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer?.classList.contains('is-open')) {
      toggleMobileMenu(true);
    }
  });

  // 5. Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 6. Stat Counter Animation
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  const countUp = (el) => {
    const target = parseFloat(el.getAttribute('data-target') || '0');
    const isDecimal = el.getAttribute('data-decimal') === 'true';
    const duration = 1600;
    const start = 0;
    const startTime = performance.now();

    const updateVal = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = start + (target - start) * ease;

      el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);

      if (progress < 1) {
        requestAnimationFrame(updateVal);
      } else {
        el.textContent = isDecimal ? target.toFixed(1) : target;
      }
    };

    requestAnimationFrame(updateVal);
  };

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsCounted) {
          statsCounted = true;
          statNumbers.forEach(countUp);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    statsObserver.observe(statsSection);
  }

  // 7. Travel Journal Gallery Filter & Lightbox
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxMedia = document.getElementById('lightbox-media');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxLocation = document.getElementById('lightbox-location');
  const lightboxCloseBtn = document.getElementById('lightbox-close');
  const lightboxPrevBtn = document.getElementById('lightbox-prev');
  const lightboxNextBtn = document.getElementById('lightbox-next');

  let activeFilter = 'all';
  let visibleItems = [...galleryItems];
  let currentIndex = 0;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      activeFilter = btn.getAttribute('data-filter') || 'all';

      galleryItems.forEach(item => {
        const itemCategories = item.getAttribute('data-category')?.split(' ') || [];
        if (activeFilter === 'all' || itemCategories.includes(activeFilter)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });

      visibleItems = galleryItems.filter(item => item.style.display !== 'none');
    });
  });

  const openLightbox = (index) => {
    if (!visibleItems.length) return;
    currentIndex = index;
    const item = visibleItems[currentIndex];
    const isVideo = item.getAttribute('data-is-video') === 'true';
    const mediaSrc = item.getAttribute('data-full-src');
    const title = item.getAttribute('data-title') || '';
    const location = item.getAttribute('data-location') || '';

    if (lightboxMedia) {
      lightboxMedia.innerHTML = '';
      if (isVideo) {
        const video = document.createElement('video');
        video.src = mediaSrc || '';
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.controls = true;
        video.playsInline = true;
        lightboxMedia.appendChild(video);
      } else {
        const img = document.createElement('img');
        img.src = mediaSrc || '';
        img.alt = title;
        lightboxMedia.appendChild(img);
      }
    }

    if (lightboxCounter) {
      const currentFormatted = String(currentIndex + 1).padStart(2, '0');
      const totalFormatted = String(visibleItems.length).padStart(2, '0');
      lightboxCounter.innerHTML = `<strong>${currentFormatted}</strong> / ${totalFormatted}`;
    }

    if (lightboxCaption) lightboxCaption.textContent = title;
    if (lightboxLocation) lightboxLocation.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="12" height="12"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> ${location}`;

    lightbox?.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox?.classList.remove('is-active');
    document.body.style.overflow = '';
    if (lightboxMedia) {
      lightboxMedia.innerHTML = '';
    }
  };

  const navigateLightbox = (direction) => {
    if (!visibleItems.length) return;
    currentIndex = (currentIndex + direction + visibleItems.length) % visibleItems.length;
    openLightbox(currentIndex);
  };

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const idx = visibleItems.indexOf(item);
      if (idx !== -1) openLightbox(idx);
    });
  });

  lightboxCloseBtn?.addEventListener('click', closeLightbox);
  lightboxPrevBtn?.addEventListener('click', () => navigateLightbox(-1));
  lightboxNextBtn?.addEventListener('click', () => navigateLightbox(1));

  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('is-active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  // Touch Swipe for Mobile Lightbox
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox?.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) {
      navigateLightbox(1);
    } else if (touchEndX - touchStartX > 50) {
      navigateLightbox(-1);
    }
  }, { passive: true });

  // 8. Concept Synthesis Matrix Toggles
  const layerToggles = document.querySelectorAll('.stage-layer-toggle');
  const stageTelemetry = document.getElementById('telemetry-coords');
  const svgContours = document.querySelectorAll('.contour-line');
  const svgNodes = document.querySelectorAll('.data-node');

  const layerPresets = {
    topo: {
      coords: 'LAT 31°10\'N · LON 77°17\'E · ELEV 2,240M · HIMALAYAN RIDGELINE',
      contourOpacity: '0.8',
      nodeOpacity: '0.2'
    },
    data: {
      coords: 'ATTRIBUTES: 14 VARS · CLUSTER CONFIDENCE: 94.6% · TELEMETRY ACTIVE',
      contourOpacity: '0.25',
      nodeOpacity: '0.9'
    },
    synthesis: {
      coords: 'SYNTHESIS: SPATIAL COGNITION + DATA DRIVEN INSIGHT · EQUILIBRIUM',
      contourOpacity: '0.7',
      nodeOpacity: '0.75'
    }
  };

  layerToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      layerToggles.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const layer = btn.getAttribute('data-layer') || 'topo';
      const preset = layerPresets[layer] || layerPresets.topo;

      if (stageTelemetry) stageTelemetry.textContent = preset.coords;

      svgContours.forEach(line => {
        line.style.opacity = preset.contourOpacity;
      });
      svgNodes.forEach(node => {
        node.style.opacity = preset.nodeOpacity;
      });
    });
  });

  // 9. Contact Form Handling
  const contactForm = document.getElementById('portfolio-contact-form');
  const formStatus = document.getElementById('form-status');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('sender-name');
    const emailInput = document.getElementById('sender-email');
    const inquiryType = document.getElementById('inquiry-type');
    const messageInput = document.getElementById('sender-message');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const topic = inquiryType ? inquiryType.value : 'General Inquiry';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !email || !message) {
      alert('Please fill out all required fields.');
      return;
    }

    if (formStatus) {
      formStatus.className = 'form-status-message success';
      formStatus.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>Message acknowledged! Opening default mail client to dispatch to rummanmohd123@gmail.com...</span>
      `;
      formStatus.style.display = 'flex';
    }

    const subject = encodeURIComponent(`[Portfolio Inquiry - ${topic}] From ${name}`);
    const body = encodeURIComponent(`Hello Rumman,\n\nName: ${name}\nEmail: ${email}\nTopic: ${topic}\n\nMessage:\n${message}\n\n---\nDispatched from rummanjalali.github.io`);
    
    setTimeout(() => {
      window.location.href = `mailto:rummanmohd123@gmail.com?subject=${subject}&body=${body}`;
    }, 900);
  });

  // 10. Back To Top
  const backToTopBtn = document.getElementById('back-to-top');
  backToTopBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});
