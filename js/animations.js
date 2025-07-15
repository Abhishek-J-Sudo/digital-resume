/**
 * PURE GSAP ANIMATIONS - NO CSS CONFLICTS
 * File: js/animations.js (~600 lines)
 * Purpose: Replace animations.css entirely with GSAP-controlled animations
 * Dependencies: GSAP, ScrollTrigger, components.js, sections.css (NO animations.css)
 *
 * PURE GSAP APPROACH:
 * ✅ GSAP sets ALL initial states (no CSS opacity: 0 conflicts)
 * ✅ GSAP handles ALL animations (no CSS keyframes)
 * ✅ No timing conflicts between CSS and GSAP
 * ✅ Better performance and control
 * ✅ Remove animations.css dependency entirely
 */

// ===================================
// ANIMATION CONFIGURATION
// ===================================

const ANIMATION_CONFIG = {
  // Durations - optimized for pure GSAP
  fast: 0.3,
  normal: 0.6,
  slow: 1.2,
  typing: 0.05, // Faster typing for better UX

  // GSAP-optimized easing functions
  ease: {
    smooth: 'power2.out',
    bounce: 'back.out(1.2)', // Subtle bounce for professionalism
    elastic: 'elastic.out(1, 0.3)',
    spring: 'power3.inOut',
    typing: 'none',
    hero: 'power2.inOut', // Special easing for hero
  },

  // Stagger timing for sequential animations
  stagger: {
    fast: 0.08,
    normal: 0.12, // Optimized for smooth flow
    slow: 0.2,
  },

  // Scroll trigger settings - pure GSAP approach
  scrollTrigger: {
    start: 'top 60%', // Animation starts when 20% visible
    end: 'bottom 40%',
    toggleActions: 'play none none reverse',
    fastScrollEnd: 'top 70%',
  },
};

// ===================================
// TIMELINE MANAGEMENT
// ===================================

const timelines = {
  hero: null,
  loading: null,
  sections: new Map(),
  interactions: new Map(),
};

// Track animation states
const animationStates = {
  heroCompleted: false,
  sectionsInitialized: false,
  reducedMotion: false,
};

// ===================================
// INITIALIZATION
// ===================================

const IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

/**
 * Initialize Pure GSAP animations
 */
document.addEventListener('DOMContentLoaded', () => {
  // Check GSAP availability first
  if (typeof gsap === 'undefined') {
    console.warn('⚠️ GSAP not loaded, falling back to minimal animations');
    initializeFallbackAnimations();
    return;
  }

  // Register ScrollTrigger plugin
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    if (IS_IOS) {
      // iOS: use normalize scroll
      ScrollTrigger.normalizeScroll(true);
      console.log('✅ Pure GSAP system initialized with normalizeScroll');
    }
  }

  // Set global GSAP defaults
  gsap.defaults({
    duration: ANIMATION_CONFIG.normal,
    ease: ANIMATION_CONFIG.ease.smooth,
  });

  // Handle reduced motion preference
  animationStates.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (animationStates.reducedMotion) {
    initializeReducedMotionMode();
    return;
  }

  // Wait for components then initialize
  waitForComponents().then(() => {
    initializePureGSAPAnimations();
  });
});

/**
 * Wait for components to load
 */

async function waitForComponents() {
  return new Promise((resolve) => {
    const checkComponents = () => {
      const heroExists = document.querySelector('#hero, .hero');
      const aboutExists = document.querySelector('#about, .about-section');
      const skillsExists = document.querySelector('#skills, .skills-section');
      const experienceExists = document.querySelector('#experience, .experience-section');
      const projectsExists = document.querySelector('#projects, .projects-section');
      const contactExists = document.querySelector('#contact, .contact-section');

      // Check if all main sections exist and have content
      const allSectionsExist =
        heroExists &&
        aboutExists &&
        skillsExists &&
        experienceExists &&
        projectsExists &&
        contactExists;

      if (allSectionsExist) {
        console.log('✅ All components loaded and ready');
        resolve();
      } else {
        console.log('⏳ Waiting for components to load...', {
          hero: !!heroExists,
          about: !!aboutExists,
          skills: !!skillsExists,
          experience: !!experienceExists,
          projects: !!projectsExists,
          contact: !!contactExists,
        });
        setTimeout(checkComponents, 100);
      }
    };
    checkComponents();
  });
}

// ===================================
// MAIN PURE GSAP INITIALIZATION
// ===================================

/**
 * Initialize all Pure GSAP animations
 */
function initializePureGSAPAnimations() {
  try {
    console.log('🎬 Initializing Pure GSAP animations...');

    // Step 1: Set ALL initial states immediately (prevent FOUC)
    setInitialStates();

    // Step 2: Create all animations (but don't start them yet)
    createHeroAnimations();
    createScrollAnimations();
    createInteractionAnimations();
    createUtilityAnimations();

    // Step 3: Setup responsive handlers
    setupResponsiveHandlers();

    // Step 4: Refresh ScrollTrigger
    ScrollTrigger.refresh();

    // Step 5: Start hero sequence immediately
    setTimeout(() => {
      startHeroSequence();
    }, 50); // Minimal delay

    console.log('✅ Pure GSAP animations ready');
  } catch (error) {
    console.error('❌ Error initializing Pure GSAP:', error);
    initializeFallbackAnimations();
  }
}

// ===================================
// INITIAL STATES - PURE GSAP CONTROL
// ===================================

/**
 * Set all initial states with GSAP (replaces CSS opacity: 0)
 */
function setInitialStates() {
  console.log('🎯 Setting initial states with GSAP...');

  // Hero elements - immediate control
  const heroElements = document.querySelectorAll(`
    .hero-greeting,
    .hero-name,
    .hero-title,
    .hero-subtitle,
    .hero-actions,
    .hero-social
  `);

  gsap.set(heroElements, {
    opacity: 0,
    y: 20,
  });

  // Section elements - will be animated on scroll
  const sectionElements = document.querySelectorAll(`
    .about-text,
    .about-image,
    .about-photo,
    .about-stat,
    .skill-category,
    .skill-progress-bar,
    .experience-item,
    .timeline-dot,
    .project-card,
    .hobby-item,
    .contact-item
  `);

  gsap.set(sectionElements, {
    opacity: 0,
    y: 30,
  });

  // Special cases for specific elements
  const skillBars = document.querySelectorAll('.skill-progress-bar');
  gsap.set(skillBars, {
    width: '0%',
  });

  const timelineLine = document.querySelector('.timeline-line');
  if (timelineLine) {
    gsap.set(timelineLine, {
      height: '0%',
    });
  }

  const timelineDots = document.querySelectorAll('.timeline-dot');
  gsap.set(timelineDots, {
    scale: 0,
    opacity: 0,
  });

  console.log('✅ Initial states set - ready for animation');
}

// ===================================
// HERO ANIMATIONS - PURE GSAP
// ===================================

/**
 * Create hero animation timeline
 */
function createHeroAnimations() {
  const heroSection = document.querySelector('.hero, #hero');
  if (!heroSection) return;

  // Get hero elements
  const heroGreeting = heroSection.querySelector('.hero-greeting');
  const heroName = heroSection.querySelector('.hero-name-text, .hero-name');
  const heroTitle = heroSection.querySelector('.hero-title');
  const heroSubtitle = heroSection.querySelector('.hero-subtitle');
  const heroActions = heroSection.querySelector('.hero-actions');
  const heroSocial = heroSection.querySelector('.hero-social');

  // Create hero timeline (paused initially)
  timelines.hero = gsap.timeline({ paused: true });

  console.log('🎭 Hero timeline created');
}

/**
 * Start hero animation sequence
 */
function startHeroSequence() {
  if (!timelines.hero) return;

  const heroSection = document.querySelector('.hero, #hero');
  if (!heroSection) return;

  console.log('🚀 Starting Pure GSAP hero sequence');

  // Get elements
  const heroGreeting = heroSection.querySelector('.hero-greeting');
  const heroName = heroSection.querySelector('.hero-name-text, .hero-name');
  const heroTitle = heroSection.querySelector('.hero-title');
  const heroSubtitle = heroSection.querySelector('.hero-subtitle');
  const heroActions = heroSection.querySelector('.hero-actions');
  const heroSocial = heroSection.querySelector('.hero-social');

  // Build sequence with overlapping animations
  let tl = timelines.hero;

  // 1. Greeting appears
  if (heroGreeting) {
    tl.to(heroGreeting, {
      opacity: 1,
      y: 0,
      duration: ANIMATION_CONFIG.fast,
      ease: ANIMATION_CONFIG.ease.hero,
    });
  }

  // 2. Name with typing effect
  if (heroName) {
    tl.to(
      heroName,
      {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.normal,
        ease: ANIMATION_CONFIG.ease.hero,
      },
      '-=0.1'
    );
  }

  // 3. Title
  if (heroTitle) {
    tl.to(
      heroTitle,
      {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.fast,
        ease: ANIMATION_CONFIG.ease.hero,
      },
      '-=0.2'
    );
  }

  // 4. Subtitle
  if (heroSubtitle) {
    tl.to(
      heroSubtitle,
      {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.fast,
        ease: ANIMATION_CONFIG.ease.hero,
      },
      '-=0.1'
    );
  }

  // 5. Actions with bounce
  if (heroActions) {
    tl.to(
      heroActions,
      {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.normal,
        ease: ANIMATION_CONFIG.ease.bounce,
      },
      '-=0.1'
    );
  }

  // 6. Social links
  if (heroSocial) {
    tl.to(
      heroSocial,
      {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.fast,
        ease: ANIMATION_CONFIG.ease.smooth,
      },
      '-=0.2'
    );
  }

  // Play the timeline
  tl.play();

  // Mark hero as completed
  tl.call(() => {
    animationStates.heroCompleted = true;
    console.log('✅ Hero sequence completed');
  });
}

// ===================================
// SCROLL ANIMATIONS - PURE GSAP
// ===================================

function waitForLayout(callback, maxWait = 3000) {
  const startTime = Date.now();

  function checkLayout() {
    const aboutSection = document.querySelector('#about');

    if (aboutSection && aboutSection.getBoundingClientRect().height > 0) {
      console.log('✅ Layout ready, creating animations');
      callback();
    } else if (Date.now() - startTime < maxWait) {
      setTimeout(checkLayout, 100);
    } else {
      console.log('⚠️ Layout timeout, creating animations anyway');
      callback();
    }
  }

  checkLayout();
}

/**
 * Create all scroll-triggered animations
 */
function createScrollAnimations() {
  waitForLayout(() => {
    createAboutAnimations();
    createSkillsAnimations();
    createExperienceAnimations();
    createProjectsAnimations();
    createHobbiesAnimations();
    createContactAnimations();

    animationStates.sectionsInitialized = true;
    console.log('📜 All scroll animations created with Pure GSAP');
  });
}

/**
 * About section - Pure GSAP
 */

function createAboutAnimations() {
  const aboutSection = document.querySelector('#about, .about-section');
  if (!aboutSection) return;

  // ROW 1: Introduction + Photo
  const aboutText = aboutSection.querySelector('.about-text');
  const aboutImage = aboutSection.querySelector('.about-image');

  // ROW 2: Stats + Fun Facts
  const aboutStats = aboutSection.querySelectorAll('.stat-item');
  const funFacts = aboutSection.querySelector('.fun-facts');
  const funFactItems = aboutSection.querySelectorAll('.fun-fact-item');

  // ROW 3: Values + Actions
  const aboutValues = aboutSection.querySelector('.about-values');
  const valueItems = aboutSection.querySelectorAll('.value-item');
  const aboutActions = aboutSection.querySelector('.about-actions');

  // CRITICAL FIX: Clear CSS transitions that conflict with GSAP
  gsap.set([funFacts, aboutValues, aboutActions, ...valueItems], {
    clearProps: 'transition,transform',
    willChange: 'transform, opacity',
  });

  // Set initial states (hidden)
  gsap.set([aboutText, aboutImage], { opacity: 0, y: 50 });
  gsap.set(aboutStats, { opacity: 0, y: 30, scale: 0.9 });
  gsap.set([funFacts, aboutValues, aboutActions], { opacity: 0, y: 40 });
  gsap.set(funFactItems, { opacity: 0, x: -20 });
  gsap.set(valueItems, { opacity: 0, y: 20 });

  // Create main timeline with proper ScrollTrigger
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: aboutSection,
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
      scrub: false,
    },
  });

  // ROW 1 ANIMATIONS
  // Text from bottom
  if (aboutText) {
    tl.to(aboutText, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
    });
  }

  // Image from bottom with slight delay
  if (aboutImage) {
    tl.to(
      aboutImage,
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      },
      '-=0.4'
    );
  }

  // ROW 2 ANIMATIONS
  // Stats stagger animation
  if (aboutStats.length > 0) {
    tl.to(
      aboutStats,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: 'back.out(1.7)',
        stagger: 0.1,
      },
      '-=0.2'
    );
  }

  // Fun Facts fade in with smoother easing
  if (funFacts) {
    tl.to(
      funFacts,
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out', // Changed from power2.out for smoother animation
      },
      '-=0.3'
    );
  }

  // Fun Fact items stagger
  if (funFactItems.length > 0) {
    tl.to(
      funFactItems,
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.1,
      },
      '-=0.4'
    );
  }

  // ROW 3 ANIMATIONS - FIXED EASING
  // Values section fade in with gentler easing
  if (aboutValues) {
    tl.to(
      aboutValues,
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power1.out', // Gentler easing to prevent snap effect
      },
      '-=0.2'
    );
  }

  // Value items stagger with smoother transition
  if (valueItems.length > 0) {
    tl.to(
      valueItems,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power1.out', // Gentler easing
        stagger: 0.08,
      },
      '-=0.6' // More overlap with parent container
    );
  }

  // Actions/CTA section with gentle easing
  if (aboutActions) {
    tl.to(
      aboutActions,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power1.out', // Gentler easing to prevent snap
      },
      '-=0.5' // More overlap to feel connected
    );
  }

  // Store timeline
  timelines.sections.set('about', tl);

  // BONUS: Animated stat counters (separate trigger)
  animateStatCounters();
}
function animateStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');

  statNumbers.forEach((stat) => {
    const targetValue = stat.getAttribute('data-count');
    const isDecimal = targetValue.includes('.');

    gsap.fromTo(
      stat,
      {
        innerHTML: 0,
      },
      {
        innerHTML: targetValue,
        duration: 2,
        ease: 'power2.out',
        snap: isDecimal ? { innerHTML: 0.1 } : { innerHTML: 1 },
        scrollTrigger: {
          trigger: stat,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        onUpdate: function () {
          const value = parseFloat(this.targets()[0].innerHTML);
          if (isDecimal) {
            stat.innerHTML = value.toFixed(1);
          } else if (value >= 1000) {
            stat.innerHTML = Math.round(value).toLocaleString();
          } else {
            stat.innerHTML = Math.round(value);
          }
        },
      }
    );
  });
}

/**
 * Skills section - Pure GSAP with progress bars
 */
function createSkillsAnimations() {
  const skillsSection = document.querySelector('#skills, .skills-section');
  if (!skillsSection) return;

  const skillCategories = skillsSection.querySelectorAll('.skill-category');
  const skillProgressBars = skillsSection.querySelectorAll('.skill-progress-bar');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: skillsSection,
      start: ANIMATION_CONFIG.scrollTrigger.start,
      end: ANIMATION_CONFIG.scrollTrigger.end,
      toggleActions: ANIMATION_CONFIG.scrollTrigger.toggleActions,
    },
  });

  // Skill categories
  if (skillCategories.length > 0) {
    tl.to(skillCategories, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: ANIMATION_CONFIG.normal,
      ease: ANIMATION_CONFIG.ease.bounce,
      stagger: ANIMATION_CONFIG.stagger.normal,
    });
  }

  // Progress bars animate to their percentage
  if (skillProgressBars.length > 0) {
    skillProgressBars.forEach((bar, index) => {
      const percentage = parseInt(bar.getAttribute('data-percentage')) || 75;

      tl.to(
        bar,
        {
          width: `${percentage}%`,
          duration: ANIMATION_CONFIG.slow,
          ease: ANIMATION_CONFIG.ease.smooth,
          delay: index * 0.1,
        },
        '-=0.8'
      );
    });
  }

  timelines.sections.set('skills', tl);
}

/**
 * Experience section - Pure GSAP timeline
 */
function createExperienceAnimations() {
  const experienceSection = document.querySelector('#experience, .experience-section');
  if (!experienceSection) return;

  const timelineLine = experienceSection.querySelector('.timeline-line');
  const timelineDots = experienceSection.querySelectorAll('.timeline-dot');
  const experienceItems = experienceSection.querySelectorAll('.experience-item');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: experienceSection,
      start: ANIMATION_CONFIG.scrollTrigger.start,
      end: ANIMATION_CONFIG.scrollTrigger.end,
      toggleActions: ANIMATION_CONFIG.scrollTrigger.toggleActions,
    },
  });

  // Timeline line grows
  if (timelineLine) {
    tl.to(timelineLine, {
      height: '100%',
      duration: ANIMATION_CONFIG.slow,
      ease: ANIMATION_CONFIG.ease.smooth,
    });
  }

  // Timeline dots appear
  if (timelineDots.length > 0) {
    tl.to(
      timelineDots,
      {
        scale: 1,
        opacity: 1,
        duration: ANIMATION_CONFIG.fast,
        ease: ANIMATION_CONFIG.ease.bounce,
        stagger: ANIMATION_CONFIG.stagger.fast,
      },
      '-=0.6'
    );
  }

  // Experience items - alternating sides
  if (experienceItems.length > 0) {
    experienceItems.forEach((item, index) => {
      const isEven = index % 2 === 0;
      const xOffset = window.innerWidth > 768 ? (isEven ? -50 : 50) : -30;

      // Set initial position
      gsap.set(item, { x: xOffset });

      tl.to(
        item,
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: ANIMATION_CONFIG.normal,
          ease: ANIMATION_CONFIG.ease.smooth,
        },
        '-=0.5'
      );
    });
  }

  timelines.sections.set('experience', tl);
}

/**
 * Projects section - Pure GSAP cards
 */
function createProjectsAnimations() {
  const projectsSection = document.querySelector('#projects, .projects-section');
  if (!projectsSection) return;

  const projectCards = projectsSection.querySelectorAll('.project-card');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: projectsSection,
      start: ANIMATION_CONFIG.scrollTrigger.start,
      end: ANIMATION_CONFIG.scrollTrigger.end,
      toggleActions: ANIMATION_CONFIG.scrollTrigger.toggleActions,
    },
  });

  if (projectCards.length > 0) {
    // Set initial 3D rotation
    gsap.set(projectCards, { rotationY: 15, scale: 0.8 });

    tl.to(projectCards, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotationY: 0,
      duration: ANIMATION_CONFIG.normal,
      ease: ANIMATION_CONFIG.ease.bounce,
      stagger: ANIMATION_CONFIG.stagger.normal,
    });
  }

  timelines.sections.set('projects', tl);
}

/**
 * Hobbies section - Pure GSAP rotation
 */
function createHobbiesAnimations() {
  const hobbiesSection = document.querySelector('#hobbies, .hobbies-section');
  if (!hobbiesSection) return;

  const hobbyItems = hobbiesSection.querySelectorAll('.hobby-item');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: hobbiesSection,
      start: ANIMATION_CONFIG.scrollTrigger.start,
      end: ANIMATION_CONFIG.scrollTrigger.end,
      toggleActions: ANIMATION_CONFIG.scrollTrigger.toggleActions,
    },
  });

  if (hobbyItems.length > 0) {
    // Set initial rotation
    gsap.set(hobbyItems, { rotation: -180, scale: 0 });

    tl.to(hobbyItems, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: ANIMATION_CONFIG.normal,
      ease: ANIMATION_CONFIG.ease.elastic,
      stagger: ANIMATION_CONFIG.stagger.fast,
    });
  }

  timelines.sections.set('hobbies', tl);
}

/**
 * Contact section - Pure GSAP simple fade
 */
function createContactAnimations() {
  const contactSection = document.querySelector('#contact, .contact-section');
  if (!contactSection) return;

  const contactItems = contactSection.querySelectorAll('.contact-item');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: contactSection,
      start: ANIMATION_CONFIG.scrollTrigger.start,
      end: ANIMATION_CONFIG.scrollTrigger.end,
      toggleActions: ANIMATION_CONFIG.scrollTrigger.toggleActions,
    },
  });

  if (contactItems.length > 0) {
    tl.to(contactItems, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: ANIMATION_CONFIG.normal,
      ease: ANIMATION_CONFIG.ease.bounce,
      stagger: ANIMATION_CONFIG.stagger.normal,
    });
  }

  timelines.sections.set('contact', tl);
}

// ===================================
// INTERACTION ANIMATIONS - PURE GSAP
// ===================================

/**
 * Create hover and interaction effects
 */
function createInteractionAnimations() {
  // Skip on mobile or reduced motion
  if (window.innerWidth <= 768 || animationStates.reducedMotion) return;

  createHoverEffects();
  createClickEffects();
  createExpandAnimations();

  console.log('🎯 Pure GSAP interactions created');
}

/**
 * Hover effects - Pure GSAP
 */
function createHoverEffects() {
  // Navigation links
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-link');
  navLinks.forEach((link) => {
    link.addEventListener('mouseenter', () => {
      gsap.to(link, {
        scale: 1.05,
        duration: ANIMATION_CONFIG.fast,
        ease: ANIMATION_CONFIG.ease.smooth,
      });
    });

    link.addEventListener('mouseleave', () => {
      gsap.to(link, {
        scale: 1,
        duration: ANIMATION_CONFIG.fast,
        ease: ANIMATION_CONFIG.ease.smooth,
      });
    });
  });

  // Buttons
  const buttons = document.querySelectorAll('.btn, .hero-cta, .project-link');
  buttons.forEach((button) => {
    button.addEventListener('mouseenter', () => {
      gsap.to(button, {
        scale: 1.05,
        y: -2,
        duration: ANIMATION_CONFIG.fast,
        ease: ANIMATION_CONFIG.ease.smooth,
      });
    });

    button.addEventListener('mouseleave', () => {
      gsap.to(button, {
        scale: 1,
        y: 0,
        duration: ANIMATION_CONFIG.fast,
        ease: ANIMATION_CONFIG.ease.smooth,
      });
    });
  });

  // Cards
  const cards = document.querySelectorAll('.project-card, .skill-category, .experience-item');
  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        y: -8,
        scale: 1.02,
        duration: ANIMATION_CONFIG.fast,
        ease: ANIMATION_CONFIG.ease.smooth,
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: ANIMATION_CONFIG.fast,
        ease: ANIMATION_CONFIG.ease.smooth,
      });
    });
  });
}

/**
 * Click effects - Pure GSAP
 */
function createClickEffects() {
  const clickableElements = document.querySelectorAll('.btn, .project-link, .hero-cta');

  clickableElements.forEach((element) => {
    element.addEventListener('click', () => {
      gsap.to(element, {
        scale: 0.95,
        duration: 0.1,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1,
      });
    });
  });
}

/**
 * Expand animations for experience section
 */
function createExpandAnimations() {
  const expandButtons = document.querySelectorAll('.expand-btn, .show-more-btn');

  expandButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();

      const targetId = button.getAttribute('data-target') || button.getAttribute('href');
      const targetElement = targetId
        ? document.querySelector(targetId)
        : button.closest('.experience-item').querySelector('.experience-details');

      if (!targetElement) return;

      const isExpanded = targetElement.classList.contains('expanded');

      if (isExpanded) {
        // Collapse
        gsap.to(targetElement, {
          height: 0,
          opacity: 0,
          duration: ANIMATION_CONFIG.fast,
          ease: ANIMATION_CONFIG.ease.smooth,
          onComplete: () => {
            targetElement.classList.remove('expanded');
            button.textContent = 'Show More';
            button.setAttribute('aria-expanded', 'false');
          },
        });
      } else {
        // Expand
        targetElement.classList.add('expanded');
        button.textContent = 'Show Less';
        button.setAttribute('aria-expanded', 'true');

        gsap.fromTo(
          targetElement,
          { height: 0, opacity: 0 },
          {
            height: 'auto',
            opacity: 1,
            duration: ANIMATION_CONFIG.normal,
            ease: ANIMATION_CONFIG.ease.smooth,
          }
        );

        // Animate items inside
        const items = targetElement.querySelectorAll('li, .detail-item');
        if (items.length > 0) {
          gsap.fromTo(
            items,
            { opacity: 0, x: -20 },
            {
              opacity: 1,
              x: 0,
              duration: ANIMATION_CONFIG.fast,
              ease: ANIMATION_CONFIG.ease.smooth,
              stagger: 0.05,
              delay: 0.2,
            }
          );
        }
      }
    });
  });
}

// ===================================
// UTILITY ANIMATIONS
// ===================================

/**
 * Create utility animations
 */
function createUtilityAnimations() {
  createScrollProgress();
  createFloatingElements();
  createLoadingAnimations();
}

/**
 * Scroll progress bar
 */
function createScrollProgress() {
  const progressBar = document.querySelector('.scroll-progress-bar');
  if (!progressBar) return;

  gsap.set(progressBar, { transformOrigin: 'left center' });

  gsap.to(progressBar, {
    ease: 'none',
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3,
    },
  });
}

/**
 * Floating elements
 */
function createFloatingElements() {
  const floatingElements = document.querySelectorAll('.floating-element');

  floatingElements.forEach((element, index) => {
    gsap.to(element, {
      y: 'random(-20, 20)',
      x: 'random(-10, 10)',
      rotation: 'random(-5, 5)',
      duration: 'random(4, 8)',
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: index * 0.5,
    });
  });
}

/**
 * Loading animations
 */
function createLoadingAnimations() {
  const loadingScreen = document.getElementById('loading-screen');
  if (!loadingScreen) return;

  const loadingSpinner = loadingScreen.querySelector('.loading-spinner');
  const loadingText = loadingScreen.querySelector('.loading-content p');

  if (loadingSpinner) {
    gsap.to(loadingSpinner, {
      rotation: 360,
      duration: 1,
      ease: 'none',
      repeat: -1,
    });
  }

  if (loadingText) {
    gsap.fromTo(
      loadingText,
      { opacity: 0.5 },
      {
        opacity: 1,
        duration: 1.5,
        ease: 'power2.inOut',
        repeat: -1,
        yoyo: true,
      }
    );
  }
}

// ===================================
// RESPONSIVE & ACCESSIBILITY
// ===================================

/**
 * Setup responsive handlers
 */
function setupResponsiveHandlers() {
  // Debounced resize handler
  window.addEventListener(
    'resize',
    debounce(() => {
      ScrollTrigger.refresh();
      console.log('📱 Pure GSAP refreshed for resize');
    }, 250)
  );

  // Orientation change
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      ScrollTrigger.refresh();
      console.log('🔄 Pure GSAP refreshed for orientation');
    }, 500);
  });
}

/**
 * Reduced motion mode
 */
function initializeReducedMotionMode() {
  console.log('♿ Reduced motion - using minimal Pure GSAP animations');

  // Set all elements to visible immediately
  gsap.set('*', {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
  });

  // Create simple fade-in observer
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(entry.target, {
              opacity: 1,
              duration: 0.3,
              ease: 'power2.out',
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll('[data-section]').forEach((el) => {
      observer.observe(el);
    });
  }
}

/**
 * Fallback animations when GSAP fails
 */
function initializeFallbackAnimations() {
  console.log('🎨 Using fallback animations (minimal CSS)');

  // Simple intersection observer for basic fades
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.transition = 'all 0.6s ease-out';
          }
        });
      },
      { threshold: 0.2 }
    );

    // Observe key elements
    document
      .querySelectorAll(
        `
      .hero-name, .hero-title, .hero-actions,
      .about-text, .skill-category, .project-card,
      .experience-item, .contact-item
    `
      )
      .forEach((el) => observer.observe(el));
  }
}

// ===================================
// UTILITIES
// ===================================

/**
 * Debounce utility
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Refresh all scroll triggers
 */
function refreshScrollTriggers() {
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
    console.log('🔄 Pure GSAP ScrollTriggers refreshed');
  }
}

/**
 * Kill all animations
 */
function killAllAnimations() {
  // Kill all timelines
  Object.values(timelines).forEach((timeline) => {
    if (timeline && timeline.kill) {
      timeline.kill();
    }
  });

  // Kill all ScrollTriggers
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }

  console.log('🛑 All Pure GSAP animations killed');
}

// ===================================
// EVENT LISTENERS & CLEANUP
// ===================================

// Handle reduced motion preference changes
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
  if (e.matches) {
    initializeReducedMotionMode();
  } else {
    location.reload(); // Restart with full animations
  }
});

// Cleanup on page unload
window.addEventListener('beforeunload', killAllAnimations);

// ===================================
// GLOBAL EXPORTS - PURE GSAP API
// ===================================

/**
 * Global Pure GSAP Animation API
 */
window.PureGSAPAnimations = {
  // Core controls
  refresh: refreshScrollTriggers,
  kill: killAllAnimations,
  config: ANIMATION_CONFIG,
  timelines: timelines,
  states: animationStates,

  // Manual triggers
  startHero: startHeroSequence,

  // Helper functions for external use
  animateElement: (element, options = {}) => {
    if (!element) return;

    const defaults = {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      duration: ANIMATION_CONFIG.normal,
      ease: ANIMATION_CONFIG.ease.smooth,
    };

    const settings = { ...defaults, ...options };

    return gsap.to(element, settings);
  },

  // Animate progress bar to percentage
  animateProgressBar: (bar, percentage, duration = ANIMATION_CONFIG.slow) => {
    if (!bar) return;

    return gsap.to(bar, {
      width: `${percentage}%`,
      duration,
      ease: ANIMATION_CONFIG.ease.smooth,
    });
  },

  // Expand/collapse animation
  animateExpand: (element, isExpanding = true) => {
    if (!element) return;

    if (isExpanding) {
      return gsap.fromTo(
        element,
        { height: 0, opacity: 0 },
        {
          height: 'auto',
          opacity: 1,
          duration: ANIMATION_CONFIG.normal,
          ease: ANIMATION_CONFIG.ease.smooth,
        }
      );
    } else {
      return gsap.to(element, {
        height: 0,
        opacity: 0,
        duration: ANIMATION_CONFIG.fast,
        ease: ANIMATION_CONFIG.ease.smooth,
      });
    }
  },

  // Stagger animation for multiple elements
  staggerElements: (elements, options = {}) => {
    if (!elements || elements.length === 0) return;

    const defaults = {
      opacity: 1,
      y: 0,
      duration: ANIMATION_CONFIG.normal,
      ease: ANIMATION_CONFIG.ease.smooth,
      stagger: ANIMATION_CONFIG.stagger.normal,
    };

    const settings = { ...defaults, ...options };

    return gsap.to(elements, settings);
  },

  // Quick fade animation
  fadeIn: (element, duration = ANIMATION_CONFIG.normal) => {
    if (!element) return;

    return gsap.to(element, {
      opacity: 1,
      duration,
      ease: ANIMATION_CONFIG.ease.smooth,
    });
  },

  fadeOut: (element, duration = ANIMATION_CONFIG.normal) => {
    if (!element) return;

    return gsap.to(element, {
      opacity: 0,
      duration,
      ease: ANIMATION_CONFIG.ease.smooth,
    });
  },

  // Scale animation
  scaleIn: (element, duration = ANIMATION_CONFIG.normal) => {
    if (!element) return;

    gsap.set(element, { scale: 0, opacity: 0 });
    return gsap.to(element, {
      scale: 1,
      opacity: 1,
      duration,
      ease: ANIMATION_CONFIG.ease.bounce,
    });
  },

  // Slide animations
  slideInFromLeft: (element, distance = 50) => {
    if (!element) return;

    gsap.set(element, { x: -distance, opacity: 0 });
    return gsap.to(element, {
      x: 0,
      opacity: 1,
      duration: ANIMATION_CONFIG.normal,
      ease: ANIMATION_CONFIG.ease.smooth,
    });
  },

  slideInFromRight: (element, distance = 50) => {
    if (!element) return;

    gsap.set(element, { x: distance, opacity: 0 });
    return gsap.to(element, {
      x: 0,
      opacity: 1,
      duration: ANIMATION_CONFIG.normal,
      ease: ANIMATION_CONFIG.ease.smooth,
    });
  },

  slideInFromBottom: (element, distance = 50) => {
    if (!element) return;

    gsap.set(element, { y: distance, opacity: 0 });
    return gsap.to(element, {
      y: 0,
      opacity: 1,
      duration: ANIMATION_CONFIG.normal,
      ease: ANIMATION_CONFIG.ease.smooth,
    });
  },

  // Theme transition
  animateThemeChange: (callback) => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: var(--color-background);
      opacity: 0;
      z-index: 9999;
      pointer-events: none;
    `;

    document.body.appendChild(overlay);

    return gsap
      .timeline()
      .to(overlay, {
        opacity: 0.8,
        duration: 0.15,
        ease: 'power2.out',
      })
      .call(() => {
        if (callback) callback();
      })
      .to(overlay, {
        opacity: 0,
        duration: 0.15,
        ease: 'power2.out',
        onComplete: () => {
          document.body.removeChild(overlay);
        },
      });
  },

  // Create scroll-triggered animation
  createScrollAnimation: (trigger, targets, options = {}) => {
    if (!trigger || !targets) return;

    const defaults = {
      opacity: 1,
      y: 0,
      duration: ANIMATION_CONFIG.normal,
      ease: ANIMATION_CONFIG.ease.smooth,
      scrollTrigger: {
        trigger: trigger,
        start: ANIMATION_CONFIG.scrollTrigger.start,
        end: ANIMATION_CONFIG.scrollTrigger.end,
        toggleActions: ANIMATION_CONFIG.scrollTrigger.toggleActions,
      },
    };

    const settings = { ...defaults, ...options };

    return gsap.to(targets, settings);
  },
};

// ===================================
// PERFORMANCE MONITORING
// ===================================

/**
 * Monitor animation performance
 */
function monitorPerformance() {
  if (typeof performance === 'undefined') return;

  let frameCount = 0;
  let lastTime = performance.now();

  function checkFrameRate() {
    frameCount++;
    const currentTime = performance.now();

    if (currentTime - lastTime >= 1000) {
      const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));

      // If FPS drops below 30, optimize
      if (fps < 30) {
        console.warn(`⚠️ Low FPS detected (${fps}), optimizing Pure GSAP animations`);

        // Speed up animations
        gsap.globalTimeline.timeScale(1.5);

        // Disable complex effects
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.vars.scrub) {
            trigger.kill();
          }
        });
      }

      frameCount = 0;
      lastTime = currentTime;
    }

    requestAnimationFrame(checkFrameRate);
  }

  requestAnimationFrame(checkFrameRate);
}

// ===================================
// MOBILE OPTIMIZATIONS
// ===================================

/**
 * Mobile-specific optimizations
 */
function optimizeForMobile() {
  if (window.innerWidth > 768) return;

  // Faster animations on mobile
  ANIMATION_CONFIG.fast = 0.2;
  ANIMATION_CONFIG.normal = 0.4;
  ANIMATION_CONFIG.slow = 0.8;

  // Reduced stagger
  ANIMATION_CONFIG.stagger.fast = 0.05;
  ANIMATION_CONFIG.stagger.normal = 0.08;
  ANIMATION_CONFIG.stagger.slow = 0.15;

  // Disable complex effects
  const complexSelectors = ['.floating-element', '.parallax-element', '.gradient-text'];

  complexSelectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      gsap.set(el, { clearProps: 'all' });
    });
  });

  console.log('📱 Mobile optimizations applied');
}

// ===================================
// INITIALIZATION COMPLETION
// ===================================

// Start performance monitoring after initialization
document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap !== 'undefined') {
    setTimeout(() => {
      optimizeForMobile();
      monitorPerformance();
      console.log('✅ Pure GSAP system fully initialized');
    }, 1000);
  }
});

console.log('🎬 Pure GSAP animations.js loaded - NO CSS conflicts!');

// ===================================
// MIGRATION NOTES
// ===================================

/*
 * MIGRATION FROM CSS+GSAP TO PURE GSAP:
 *
 * ✅ REMOVED DEPENDENCIES:
 * - animations.css is NO LONGER NEEDED
 * - All CSS keyframes replaced with GSAP
 * - All CSS transitions replaced with GSAP
 * - No more timing conflicts
 *
 * ✅ PURE GSAP BENEFITS:
 * - GSAP controls ALL initial states (no opacity: 0 in CSS)
 * - Better performance and smoothness
 * - More control over timing and easing
 * - No conflicts between CSS and JS animations
 * - Easier debugging and customization
 *
 * ✅ WHAT TO DO NEXT:
 * 1. Replace your current animations.js with this file
 * 2. Remove animations.css from your HTML
 * 3. Keep these CSS files:
 *    - variables.css ✅
 *    - base.css ✅
 *    - layout.css ✅
 *    - header.css ✅
 *    - sections.css ✅
 *    - components.css ✅
 * 4. Test all animations work correctly
 *
 * ✅ GLOBAL API USAGE:
 * // Manually trigger animations
 * window.PureGSAPAnimations.fadeIn(element);
 * window.PureGSAPAnimations.animateProgressBar(bar, 85);
 * window.PureGSAPAnimations.staggerElements(cards);
 *
 * // Access timelines and config
 * window.PureGSAPAnimations.timelines.hero.restart();
 * window.PureGSAPAnimations.config.fast; // 0.3s
 *
 * ✅ COMPATIBILITY:
 * - Works with existing HTML structure
 * - Works with existing CSS (except animations.css)
 * - Works with existing interactions.js
 * - Works with existing navigation.js
 * - Maintains all animation behaviors from your plan
 *
 * ✅ PERFORMANCE:
 * - Hardware accelerated transforms
 * - Automatic mobile optimizations
 * - FPS monitoring and adaptive quality
 * - Reduced motion support
 * - Memory efficient cleanup
 */
