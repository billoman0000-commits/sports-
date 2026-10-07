/**
 * ADITHYAN C — PORTFOLIO INTERACTION ENGINE
 * Premium Dark Creative Agency + Modern Personal Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initNavigation();
  initHeroTilt();
  initProjectsModal();
  initVideoHover();
  initSkillsFilter();
  initProcessScroll();
  initClipboardAndForm();
  initScrollAnimations();
});

/* ==========================================================================
   1. CUSTOM CURSOR (DESKTOP)
   ========================================================================== */
function initCustomCursor() {
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const cursorLabel = document.getElementById('cursorLabel');

  if (!cursorDot || !cursorRing) return;

  // Disable on touch devices or fine pointer not matching
  if (!window.matchMedia('(pointer: fine)').matches) {
    cursorDot.style.display = 'none';
    cursorRing.style.display = 'none';
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let isHovered = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  function renderCursor() {
    // Smooth lerp for ring follower
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;

    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Interactive hover targets
  const interactiveTargets = document.querySelectorAll('a, button, .project-card, .video-container, .image-showcase-container, .tool-item-card, .skill-card');

  interactiveTargets.forEach((target) => {
    target.addEventListener('mouseenter', () => {
      isHovered = true;
      cursorRing.classList.add('active-hover');

      const customLabel = target.getAttribute('data-cursor');
      if (customLabel) {
        cursorLabel.textContent = customLabel;
      } else if (target.classList.contains('video-container')) {
        cursorLabel.textContent = 'PLAY';
      } else if (target.classList.contains('project-card')) {
        cursorLabel.textContent = 'VIEW';
      } else if (target.tagName.toLowerCase() === 'button' || target.tagName.toLowerCase() === 'a') {
        cursorLabel.textContent = 'GO';
      } else {
        cursorLabel.textContent = '';
      }
    });

    target.addEventListener('mouseleave', () => {
      isHovered = false;
      cursorRing.classList.remove('active-hover');
      cursorLabel.textContent = '';
    });
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
    cursorRing.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity = '1';
    cursorRing.style.opacity = '1';
  });
}

/* ==========================================================================
   2. STICKY NAVIGATION & SCROLLSPY
   ========================================================================== */
function initNavigation() {
  const header = document.getElementById('siteHeader');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
  const mobileCloseBtn = document.getElementById('mobileCloseBtn');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');

  // Sticky header class on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    updateActiveNav();
  }, { passive: true });

  // Mobile Drawer Toggle
  function openMobileMenu() {
    mobileMenuOverlay.classList.add('active');
    mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenuOverlay.classList.remove('active');
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openMobileMenu);
  if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMobileMenu);

  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Active section indicator / ScrollSpy
  function updateActiveNav() {
    const scrollPos = window.scrollY + 180;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // Smooth scroll click handler
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ==========================================================================
   3. HERO 3D PERSPECTIVE CARD TILT & MAGNETIC BUTTONS
   ========================================================================== */
function initHeroTilt() {
  const stage = document.getElementById('heroVisualStage');
  const card = document.getElementById('heroCard3D');

  if (!stage || !card || window.innerWidth < 1024) return;

  stage.addEventListener('mousemove', (e) => {
    const rect = stage.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  stage.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });

  // Magnetic button micro-interaction
  const magneticButtons = document.querySelectorAll('.magnetic-btn');
  magneticButtons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 1024) return;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });
}

/* ==========================================================================
   4. VIDEO HOVER & AUTOPLAY OBSERVER
   ========================================================================== */
function initVideoHover() {
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach((card) => {
    const video = card.querySelector('.project-preview-video');
    const playOverlay = card.querySelector('.video-play-overlay');

    if (!video) return;

    card.addEventListener('mouseenter', () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (playOverlay) playOverlay.style.opacity = '0';
          })
          .catch(() => {
            // Autoplay policy fallback
          });
      }
    });

    card.addEventListener('mouseleave', () => {
      video.pause();
      if (playOverlay) playOverlay.style.opacity = '1';
    });
  });
}

/* ==========================================================================
   5. SKILLS FILTER TABS
   ========================================================================== */
function initSkillsFilter() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.skill-card');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      cards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   6. PROCESS PROGRESSIVE TIMELINE ACTIVATION
   ========================================================================== */
function initProcessScroll() {
  const timeline = document.getElementById('processTimeline');
  const lineFill = document.getElementById('timelineLineFill');
  const steps = document.querySelectorAll('.process-step');

  if (!timeline || !lineFill) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Activate steps sequentially
        steps.forEach((step, idx) => {
          setTimeout(() => {
            step.classList.add('active');
            const percent = ((idx + 1) / steps.length) * 100;
            lineFill.style.width = `${percent}%`;
          }, idx * 220);
        });
      }
    });
  }, { threshold: 0.25 });

  observer.observe(timeline);
}

/* ==========================================================================
   7. PROJECT CASE-STUDY MODAL
   ========================================================================== */
const projectData = {
  1: {
    num: "PROJECT 01",
    title: "BENTLY — Cinematic AI Automotive Showcase",
    category: "AI Video Creation / Automotive Content",
    mediaType: "video",
    mediaSrc: "assets/bently.mp4",
    poster: "assets/ai-video-poster.png",
    overview: "A luxury automotive showcase generated using advanced AI prompt-to-video and image-to-video pipelines. Demonstrates camera stability, photorealistic reflections on sculpted body lines, and moody lighting control.",
    objective: "To evaluate how AI video models simulate high-end studio lighting, motion dynamics, metallic reflections, and authentic automotive commercial pacing.",
    role: "Prompt Architect, Visual Director, AI Video Synthesis & Audio Editor",
    tools: ["Midjourney", "Runway GenAI Engine", "CapCut", "Prompt Crafting"],
    process: "Designed complex prompt syntax incorporating cinematic keywords (anamorphic lens 35mm, dusk volumetric rim light, specular reflections on black gloss paint). Iterated multiple seed renders, applied motion control to steer camera panning, and synched sound effects in CapCut.",
    result: "A stunning commercial-quality automotive film asset highlighting technical mastery in AI video pacing and aesthetic consistency."
  },
  2: {
    num: "PROJECT 02",
    title: "EVERY BOY'S DREAM — Automotive Visual Storytelling",
    category: "AI Video Creation / Automotive Visual Storytelling",
    mediaType: "video",
    mediaSrc: "assets/every-boys-dream.mp4",
    poster: "assets/ai-video-poster.png",
    overview: "An evocative visual storytelling piece built around pure automotive enthusiasm. Synthesizes aesthetic vehicle motion, emotional pacing, and dreamlike atmosphere.",
    objective: "To craft a compelling narrative arc within a short-form video format that connects emotionally with car culture audiences.",
    role: "Storyboarding, AI Video Generation, Prompt Engineering, Pacing & Editing",
    tools: ["Generative AI Video", "ChatGPT (Concept)", "CapCut", "Sound Design"],
    process: "Explored prompt variations combining high-speed tracking shots with emotional night city visuals. Focused heavily on frame-to-frame stability and audio synchronization to keep viewers hooked.",
    result: "A high-retention video asset tailored for viral social distribution across Instagram Reels and YouTube Shorts."
  },
  3: {
    num: "PROJECT 03",
    title: "CARNOTTIX — E-Commerce Business Project",
    category: "E-commerce / Digital Marketing",
    mediaType: "video",
    mediaSrc: "assets/carnottix-video.mp4",
    poster: "assets/carnottix-logo.png",
    overview: "Built and managed an independent product-based e-commerce project centered around automotive-enthusiast apparel and lifestyle products.",
    objective: "To obtain real-world business exposure covering brand identity, consumer marketing, retail pricing, supplier coordination, and hands-on sales operations.",
    role: "Brand Founder, Product Marketer, Operations Manager, Ad Tester",
    tools: ["Meta Ads Manager", "Instagram Commerce", "Canva", "CapCut", "Packaging & Logistics"],
    process: "Developed the Carnottix brand from scratch including identity and logo. Produced social reels and car-themed t-shirt showcases. Handled direct buyer inquiries, pricing models, packaging, customer communication, and test ad iterations.",
    result: "Realized end-to-end practical execution of an online consumer brand with authentic sales, real customer communication, and operational problem solving."
  },
  4: {
    num: "PROJECT 04",
    title: "META ADS CAMPAIGNS — Practical Testing & Ad Sets",
    category: "Performance Marketing / Meta Ads",
    mediaType: "image",
    mediaSrc: "assets/bmc-supershield.png",
    secondarySrc: "assets/meta-ad-rust.png",
    overview: "Designed and tested experimental Meta Ads campaigns to understand audience targeting, ad set structuring, split testing, and creative variation.",
    objective: "To gain hands-on operational experience inside Meta Ads Manager with audience segments, hook angles, and creative iterations.",
    role: "Campaign Strategist, Ad Creative Designer, Copywriter, Performance Tester",
    tools: ["Meta Ads Manager", "Canva", "Photoshop", "Ad Copy Testing"],
    process: "Formulated problem-solution ad angles (e.g. 15-year durability, anti-rust protection for BMC paints), developed contrasting visual creatives, defined demographic and interest targeting sets, and monitored engagement indicators.",
    result: "Solid practical knowledge of campaign setup, audience segmentation, creative testing protocols, and data-driven ad iteration."
  },
  5: {
    num: "PROJECT 05",
    title: "AI CONTENT PROJECTS — Service Framework & Prompts",
    category: "AI Content Creation",
    mediaType: "image",
    mediaSrc: "assets/ai-video-poster.png",
    secondaryVideo: "assets/digital-growth-tools.mp4",
    overview: "Created AI-powered video content using text-to-video and image-to-video workflows, developed prompts for promotional content and edited short-form videos for digital marketing.",
    objective: "To translate AI content generation capabilities into structured commercial service packages (15-sec, 30-sec, and full info packages) with transparent deliverables.",
    role: "AI Creative Specialist, Prompt Engineer, Service Designer, Video Editor",
    tools: ["GenAI Video Models", "ChatGPT", "Canva", "CapCut", "Gemini"],
    process: "Engineered prompt templates for various business niches (automotive, real estate, jewelry, apparel, digital growth tools). Packaged pricing models and generated high-converting promotional collaterals.",
    result: "A turnkey creative capability to produce commercial promo videos and social reels rapidly without expensive production crews."
  }
};

function initProjectsModal() {
  const modal = document.getElementById('projectModal');
  const backdrop = document.getElementById('modalBackdrop');
  const closeBtn = document.getElementById('modalCloseBtn');
  const modalContent = document.getElementById('modalContent');
  let currentProjectId = 1;

  if (!modal) return;

  function openProjectModal(id) {
    currentProjectId = parseInt(id, 10);
    const data = projectData[currentProjectId];
    if (!data) return;

    let mediaHTML = '';
    if (data.mediaType === 'video') {
      mediaHTML = `
        <div class="modal-hero-media">
          <video class="modal-video-player" controls autoplay playsinline poster="${data.poster}">
            <source src="${data.mediaSrc}" type="video/mp4">
            Your browser does not support HTML5 video.
          </video>
        </div>
      `;
    } else {
      mediaHTML = `
        <div class="modal-hero-media">
          <img src="${data.mediaSrc}" alt="${data.title}" class="modal-image-view">
        </div>
      `;
    }

    const toolChips = data.tools.map(tool => `<span class="modal-chip">${tool}</span>`).join('');

    modalContent.innerHTML = `
      ${mediaHTML}
      <div class="modal-body">
        <div class="modal-header-meta">
          <span class="modal-project-num">${data.num}</span>
          <span class="modal-category-badge">${data.category}</span>
        </div>
        <h2 class="modal-title" id="modalTitle">${data.title}</h2>

        <div class="modal-sections-grid">
          <div class="modal-left-details">
            <div class="modal-text-block">
              <h4 class="modal-block-heading">PROJECT OVERVIEW</h4>
              <p class="modal-text-content">${data.overview}</p>
            </div>

            <div class="modal-text-block">
              <h4 class="modal-block-heading">OBJECTIVE &amp; GOALS</h4>
              <p class="modal-text-content">${data.objective}</p>
            </div>

            <div class="modal-text-block">
              <h4 class="modal-block-heading">CREATIVE &amp; STRATEGIC PROCESS</h4>
              <p class="modal-text-content">${data.process}</p>
            </div>

            <div class="modal-text-block">
              <h4 class="modal-block-heading">FINAL OUTPUT &amp; LEARNINGS</h4>
              <p class="modal-text-content">${data.result}</p>
            </div>
          </div>

          <div class="modal-right-meta">
            <div class="modal-meta-box">
              <div class="modal-meta-item">
                <h5>MY ROLE</h5>
                <p>${data.role}</p>
              </div>

              <div class="modal-meta-item">
                <h5>TOOLS &amp; PLATFORMS</h5>
                <div class="modal-tool-chips">
                  ${toolChips}
                </div>
              </div>

              <div class="modal-meta-item">
                <h5>STATUS</h5>
                <p class="text-lime">100% Practical Work</p>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-nav-footer">
          <button class="btn btn-outline" id="prevProjectBtn">
            ← Previous Project
          </button>
          <button class="btn btn-primary" id="nextProjectBtn">
            Next Project →
          </button>
        </div>
      </div>
    `;

    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';

    // Hook up Prev/Next buttons
    const prevBtn = document.getElementById('prevProjectBtn');
    const nextBtn = document.getElementById('nextProjectBtn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const prevId = currentProjectId > 1 ? currentProjectId - 1 : 5;
        openProjectModal(prevId);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const nextId = currentProjectId < 5 ? currentProjectId + 1 : 1;
        openProjectModal(nextId);
      });
    }
  }

  function closeModal() {
    // Stop any playing video
    const video = modal.querySelector('video');
    if (video) video.pause();

    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  // Trigger from project cards or "VIEW PROJECT" buttons
  document.querySelectorAll('[data-project-id]').forEach((el) => {
    el.addEventListener('click', (e) => {
      // Avoid firing twice if clicking inside child button
      const id = el.getAttribute('data-project-id');
      if (id) {
        e.stopPropagation();
        openProjectModal(id);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   8. ONE-CLICK COPY & QUICK INQUIRY FORM
   ========================================================================== */
function initClipboardAndForm() {
  const toast = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');

  function showToast(message) {
    if (!toast) return;
    toastMsg.textContent = message;
    toast.classList.add('active');
    setTimeout(() => {
      toast.classList.remove('active');
    }, 2800);
  }

  // Copy Buttons
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied ${textToCopy} to clipboard!`);
        }).catch(() => {
          fallbackCopyText(textToCopy);
        });
      } else {
        fallbackCopyText(textToCopy);
      }
    });
  });

  function fallbackCopyText(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToast(`Copied to clipboard!`);
    } catch (err) {
      showToast(`Please copy manually: ${text}`);
    }
    document.body.removeChild(textarea);
  }

  // Quick Message Form Handling
  const form = document.getElementById('quickInquiryForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('senderName').value.trim();
      const email = document.getElementById('senderEmail').value.trim();
      const topic = document.getElementById('inquiryType').value;
      const message = document.getElementById('senderMessage').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill out all required fields.');
        return;
      }

      // Generate mailto link
      const subject = encodeURIComponent(`Portfolio Inquiry: ${topic} from ${name}`);
      const body = encodeURIComponent(
        `Hi Adithyan,\n\nName: ${name}\nEmail: ${email}\nTopic: ${topic}\n\nMessage:\n${message}\n\n---\nSent from Portfolio Website`
      );

      const mailtoUrl = `mailto:adithyandm21@gmail.com?subject=${subject}&body=${body}`;

      showToast('Opening your email client to send message...');
      window.location.href = mailtoUrl;

      form.reset();
    });
  }
}

/* ==========================================================================
   9. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.about-grid, .skills-grid, .tools-grid, .projects-grid, .experience-timeline, .education-grid, .why-grid, .contact-banner, .contact-details-grid'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animatedElements.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });
}
