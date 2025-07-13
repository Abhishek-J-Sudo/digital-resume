/**
 * GSAP ANIMATIONS & SCROLL TRIGGERS
 * File: js/animations.js (~600 lines)
 * Purpose: Advanced animations aligned with Updated Final Section & Animation Plan
 * Dependencies: GSAP, ScrollTrigger, components.js, sections.css, animations.css
 *
 * ANIMATION STRATEGY:
 * 1. Hero: Letter-by-letter typing, sequential fade-ins, parallax background
 * 2. Sections: Scroll-triggered (20% visible), staggered elements, bottom-up slide
 * 3. Interactive: Hover scales, expand animations, skill bar progression
 * 4. Mobile: Reduced motion, touch-optimized, performance-focused
 */

// ===================================
// ANIMATION CONFIGURATION
// ===================================

const ANIMATION_CONFIG = {
  // Durations aligned with CSS animations
  fast: 0.3,
  normal: 0.6,
  slow: 1.2,
  typing: 0.08, // Per character for typewriter effect

  // Easing functions - smooth and professional
  ease: {
    smooth: 'power2.out',
    bounce: 'back.out(1.4)', // Reduced bounce for professionalism
    elastic: 'elastic.out(1, 0.3)',
    spring: 'power3.inOut',
    typing: 'none', // Linear for typewriter
  },

  // Stagger timing for sequential animations
  stagger: {
    fast: 0.1,
    normal: 0.15, // Slightly faster for better flow
    slow: 0.25,
  },

  // Scroll trigger settings - 20% visibility rule
  scrollTrigger: {
    start: 'top 80%', // Animation starts when 20% visible
    end: 'bottom 20%',
    toggleActions: 'play none none reverse',
  },

  // Mobile optimizations
  mobile: {
    reduceMotion: window.innerWidth <= 768,
    skipParallax: window.innerWidth <= 768,
    fasterAnimations: 0.4, // Faster on mobile
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

// ===================================
// INITIALIZATION
// ===================================

/**
 * Initialize GSAP animations when page loads
 * Waits for both GSAP and components to be ready
 */
document.addEventListener('DOMContentLoaded', () => {
  // Check GSAP availability
  if (typeof gsap === 'undefined') {
    console.warn('⚠️ GSAP not loaded, falling back to CSS animations');
    initializeFallbackAnimations();
    return;
  }

  // Register ScrollTrigger plugin
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    console.log('✅ GSAP and ScrollTrigger initialized');
  }

  // Set global GSAP defaults
  gsap.defaults({
    duration: ANIMATION_CONFIG.normal,
    ease: ANIMATION_CONFIG.ease.smooth,
  });

  // Wait for components to load before initializing animations
  waitForComponents().then(() => {
    initializeGSAPAnimations();
  });
});

/**
 * Wait for all components to be loaded
 */
async function waitForComponents() {
  return new Promise((resolve) => {
    const checkComponents = () => {
      if (window.App && window.App.isLoaded) {
        // Additional check for key elements
        const heroExists = document.querySelector('#hero, .hero');
        const sectionsExist = document.querySelectorAll('[data-section]').length > 0;

        if (heroExists && sectionsExist) {
          resolve();
        } else {
          setTimeout(checkComponents, 100);
        }
      } else {
        setTimeout(checkComponents, 100);
      }
    };
    checkComponents();
  });
}

// ===================================
// MAIN ANIMATION INITIALIZATION
// ===================================

/**
 * Initialize all GSAP animations
 */
function initializeGSAPAnimations() {
  try {
    // Handle reduced motion preferences first
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      initializeReducedMotionMode();
      return;
    }

    console.log('🎬 Initializing GSAP animations...');

    // Initialize animations in sequence
    createLoadingAnimations();
    createHeroAnimations();
    createScrollAnimations();
    createInteractionAnimations();
    createParallaxEffects();

    // Setup responsive handlers
    setupResponsiveAnimations();

    // Refresh ScrollTrigger to ensure proper sizing
    ScrollTrigger.refresh();

    console.log('✅ GSAP animations initialized successfully');

    // Trigger initial hero animation after short delay
    setTimeout(() => {
      startHeroSequence();
    }, 500);
  } catch (error) {
    console.error('❌ Error initializing GSAP animations:', error);
    initializeFallbackAnimations();
  }
}

// ===================================
// HERO SECTION ANIMATIONS
// ===================================

/**
 * Create hero section animations with typing effect
 * Implements: Page fade-in → Name types letter-by-letter → Title fades → CTA appears
 */
function createHeroAnimations() {
  const heroSection = document.querySelector('.hero, #hero');
  if (!heroSection) return;

  // Get hero elements with fallbacks
  const heroGreeting = heroSection.querySelector('.hero-greeting');
  const heroName = heroSection.querySelector('.hero-name-text, .hero-name');
  const heroTitle = heroSection.querySelector('.hero-title');
  const heroSubtitle = heroSection.querySelector('.hero-subtitle');
  const heroActions = heroSection.querySelector('.hero-actions');
  const heroSocial = heroSection.querySelector('.hero-social');

  // Create main hero timeline
  timelines.hero = gsap.timeline({ paused: true });

  // Set initial states - everything hidden
  const heroElements = [
    heroGreeting,
    heroName,
    heroTitle,
    heroSubtitle,
    heroActions,
    heroSocial,
  ].filter(Boolean);
  gsap.set(heroElements, { opacity: 0, y: 30 });

  // Store original text for typing effect
  if (heroName) {
    const originalText = heroName.textContent || heroName.innerText;
    heroName.setAttribute('data-original-text', originalText);
    heroName.textContent = '';
    gsap.set(heroName, { opacity: 1 }); // Name container visible for typing
  }

  console.log('🎭 Hero animations created');
}

/**
 * Start the hero animation sequence
 */
function startHeroSequence() {
  if (!timelines.hero) return;

  const heroSection = document.querySelector('.hero, #hero');
  if (!heroSection) return;

  const heroGreeting = heroSection.querySelector('.hero-greeting');
  const heroName = heroSection.querySelector('.hero-name-text, .hero-name');
  const heroTitle = heroSection.querySelector('.hero-title');
  const heroSubtitle = heroSection.querySelector('.hero-subtitle');
  const heroActions = heroSection.querySelector('.hero-actions');
  const heroSocial = heroSection.querySelector('.hero-social');

  console.log('🚀 Starting hero sequence');

  // Step 1: Fade in greeting
  if (heroGreeting) {
    timelines.hero.to(heroGreeting, {
      opacity: 1,
      y: 0,
      duration: ANIMATION_CONFIG.fast,
      ease: ANIMATION_CONFIG.ease.smooth,
    });
  }

  // Step 2: Typing effect for name
  if (heroName) {
    const originalText = heroName.getAttribute('data-original-text') || 'Alex Johnson';
    createTypingEffect(heroName, originalText, () => {
      // Step 3: Continue with other elements after typing
      continueHeroSequence();
    });
  } else {
    continueHeroSequence();
  }

  function continueHeroSequence() {
    // Step 4: Fade in title
    if (heroTitle) {
      timelines.hero.to(
        heroTitle,
        {
          opacity: 1,
          y: 0,
          duration: ANIMATION_CONFIG.normal,
          ease: ANIMATION_CONFIG.ease.smooth,
        },
        '-=0.2'
      );
    }

    // Step 5: Fade in subtitle
    if (heroSubtitle) {
      timelines.hero.to(
        heroSubtitle,
        {
          opacity: 1,
          y: 0,
          duration: ANIMATION_CONFIG.normal,
          ease: ANIMATION_CONFIG.ease.smooth,
        },
        '-=0.3'
      );
    }

    // Step 6: Fade in actions
    if (heroActions) {
      timelines.hero.to(
        heroActions,
        {
          opacity: 1,
          y: 0,
          duration: ANIMATION_CONFIG.normal,
          ease: ANIMATION_CONFIG.ease.bounce,
        },
        '-=0.2'
      );
    }

    // Step 7: Fade in social
    if (heroSocial) {
      timelines.hero.to(
        heroSocial,
        {
          opacity: 1,
          y: 0,
          duration: ANIMATION_CONFIG.normal,
          ease: ANIMATION_CONFIG.ease.smooth,
        },
        '-=0.1'
      );
    }
  }

  // Play the timeline
  timelines.hero.play();
}

/**
 * Create typing effect for hero name
 */
function createTypingEffect(element, text, onComplete) {
  let currentText = '';
  let index = 0;

  const typeInterval = setInterval(() => {
    currentText += text[index];
    element.textContent = currentText;
    index++;

    if (index >= text.length) {
      clearInterval(typeInterval);
      if (onComplete) onComplete();
    }
  }, ANIMATION_CONFIG.typing * 1000);
}

// ===================================
// SCROLL-TRIGGERED SECTION ANIMATIONS
// ===================================

/**
 * Create scroll-triggered animations for all sections
 * Implements stagger animations with 20% visibility trigger
 */
function createScrollAnimations() {
  // About section - text slides from left, image from right
  createAboutAnimations();

  // Skills section - cards appear with progress bar animations
  createSkillsAnimations();

  // Experience section - timeline dots appear, then content
  createExperienceAnimations();

  // Projects section - cards flip/scale in with stagger
  createProjectsAnimations();

  // Hobbies section - icon grid with rotation
  createHobbiesAnimations();

  // Contact section - simple fade-in
  createContactAnimations();

  console.log('📜 Scroll animations created for all sections');
}

/**
 * About section animations - text from left, image from right
 */
function createAboutAnimations() {
  const aboutSection = document.querySelector('[data-section="about"], #about, .about-section');
  if (!aboutSection) return;

  const aboutText = aboutSection.querySelector('.about-text');
  const aboutImage = aboutSection.querySelector('.about-image, .about-photo');
  const aboutStats = aboutSection.querySelectorAll('.about-stat');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: aboutSection,
      start: ANIMATION_CONFIG.scrollTrigger.start,
      end: ANIMATION_CONFIG.scrollTrigger.end,
      toggleActions: ANIMATION_CONFIG.scrollTrigger.toggleActions,
    },
  });

  // Text slides from left
  if (aboutText) {
    tl.fromTo(
      aboutText,
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: ANIMATION_CONFIG.normal,
        ease: ANIMATION_CONFIG.ease.smooth,
      }
    );
  }

  // Image slides from right
  if (aboutImage) {
    tl.fromTo(
      aboutImage,
      { opacity: 0, x: 50, scale: 0.9 },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: ANIMATION_CONFIG.normal,
        ease: ANIMATION_CONFIG.ease.bounce,
      },
      '-=0.4'
    );
  }

  // Stats animate with stagger
  if (aboutStats.length > 0) {
    tl.fromTo(
      aboutStats,
      { opacity: 0, y: 20, scale: 0.8 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: ANIMATION_CONFIG.fast,
        ease: ANIMATION_CONFIG.ease.bounce,
        stagger: ANIMATION_CONFIG.stagger.fast,
      },
      '-=0.2'
    );
  }

  timelines.sections.set('about', tl);
}

/**
 * Skills section animations - progress bars animate to percentage
 */
function createSkillsAnimations() {
  const skillsSection = document.querySelector('[data-section="skills"], #skills, .skills-section');
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

  // Animate skill categories with stagger
  if (skillCategories.length > 0) {
    tl.fromTo(
      skillCategories,
      { opacity: 0, y: 30, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: ANIMATION_CONFIG.normal,
        ease: ANIMATION_CONFIG.ease.bounce,
        stagger: ANIMATION_CONFIG.stagger.normal,
      }
    );
  }

  // Animate progress bars to their data-percentage
  if (skillProgressBars.length > 0) {
    skillProgressBars.forEach((bar, index) => {
      const percentage = parseInt(bar.getAttribute('data-percentage')) || 75;

      tl.fromTo(
        bar,
        { width: '0%' },
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
 * Experience section animations - timeline dots appear, then content
 */
function createExperienceAnimations() {
  const experienceSection = document.querySelector(
    '[data-section="experience"], #experience, .experience-section'
  );
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

  // Animate timeline line
  if (timelineLine) {
    tl.fromTo(
      timelineLine,
      { height: '0%' },
      {
        height: '100%',
        duration: ANIMATION_CONFIG.slow,
        ease: ANIMATION_CONFIG.ease.smooth,
      }
    );
  }

  // Animate timeline dots
  if (timelineDots.length > 0) {
    tl.fromTo(
      timelineDots,
      { scale: 0, opacity: 0 },
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

  // Animate experience items - alternating sides on desktop
  if (experienceItems.length > 0) {
    experienceItems.forEach((item, index) => {
      const isEven = index % 2 === 0;
      const xOffset = window.innerWidth > 768 ? (isEven ? -50 : 50) : -30;

      tl.fromTo(
        item,
        { opacity: 0, x: xOffset, y: 20 },
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
 * Projects section animations - cards flip/scale in with stagger
 */
function createProjectsAnimations() {
  const projectsSection = document.querySelector(
    '[data-section="projects"], #projects, .projects-section'
  );
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
    tl.fromTo(
      projectCards,
      {
        opacity: 0,
        y: 50,
        scale: 0.8,
        rotationY: 15,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationY: 0,
        duration: ANIMATION_CONFIG.normal,
        ease: ANIMATION_CONFIG.ease.bounce,
        stagger: ANIMATION_CONFIG.stagger.normal,
      }
    );
  }

  timelines.sections.set('projects', tl);
}

/**
 * Hobbies section animations - icon grid with rotation
 */
function createHobbiesAnimations() {
  const hobbiesSection = document.querySelector(
    '[data-section="hobbies"], #hobbies, .hobbies-section'
  );
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
    tl.fromTo(
      hobbyItems,
      {
        opacity: 0,
        scale: 0,
        rotation: -180,
      },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: ANIMATION_CONFIG.normal,
        ease: ANIMATION_CONFIG.ease.elastic,
        stagger: ANIMATION_CONFIG.stagger.fast,
      }
    );
  }

  timelines.sections.set('hobbies', tl);
}

/**
 * Contact section animations - simple fade-in
 */
function createContactAnimations() {
  const contactSection = document.querySelector(
    '[data-section="contact"], #contact, .contact-section'
  );
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
    tl.fromTo(
      contactItems,
      { opacity: 0, y: 30, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: ANIMATION_CONFIG.normal,
        ease: ANIMATION_CONFIG.ease.bounce,
        stagger: ANIMATION_CONFIG.stagger.normal,
      }
    );
  }

  timelines.sections.set('contact', tl);
}

// ===================================
// INTERACTIVE ANIMATIONS
// ===================================

/**
 * Create hover and interaction animations
 */
function createInteractionAnimations() {
  // Skip hover effects on mobile
  if (ANIMATION_CONFIG.mobile.reduceMotion) return;

  // Navigation link hover effects
  createNavigationHovers();

  // Button hover effects
  createButtonHovers();

  // Card hover effects
  createCardHovers();

  // Skill bar hover effects
  createSkillBarHovers();

  console.log('🎯 Interactive animations created');
}

/**
 * Navigation hover effects
 */
function createNavigationHovers() {
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
}

/**
 * Button hover effects - scale + glow
 */
function createButtonHovers() {
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
}

/**
 * Card hover effects - lift + shadow
 */
function createCardHovers() {
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
 * Skill bar hover effects - pulse animation
 */
function createSkillBarHovers() {
  const skillBars = document.querySelectorAll('.skill-progress-bar');

  skillBars.forEach((bar) => {
    bar.addEventListener('mouseenter', () => {
      gsap.to(bar, {
        scaleY: 1.2,
        duration: ANIMATION_CONFIG.fast,
        ease: ANIMATION_CONFIG.ease.bounce,
      });
    });

    bar.addEventListener('mouseleave', () => {
      gsap.to(bar, {
        scaleY: 1,
        duration: ANIMATION_CONFIG.fast,
        ease: ANIMATION_CONFIG.ease.bounce,
      });
    });
  });
}

// ===================================
// PARALLAX EFFECTS
// ===================================

/**
 * Create parallax effects for hero and backgrounds
 */
function createParallaxEffects() {
  // Skip parallax on mobile for performance
  if (ANIMATION_CONFIG.mobile.skipParallax) return;

  const heroSection = document.querySelector('.hero, #hero');
  if (heroSection) {
    // Hero parallax background
    gsap.to(heroSection, {
      yPercent: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }

  // Floating elements
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

  console.log('🌊 Parallax effects created');
}

// ===================================
// LOADING ANIMATIONS
// ===================================

/**
 * Create loading screen animations
 */
function createLoadingAnimations() {
  const loadingScreen = document.getElementById('loading-screen');
  if (!loadingScreen) return;

  const loadingSpinner = loadingScreen.querySelector('.loading-spinner');
  const loadingText = loadingScreen.querySelector('.loading-content p');

  timelines.loading = gsap.timeline();

  // Spinner rotation
  if (loadingSpinner) {
    gsap.to(loadingSpinner, {
      rotation: 360,
      duration: 1,
      ease: 'none',
      repeat: -1,
    });
  }

  // Text pulse
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

  console.log('⏳ Loading animations created');
}

// ===================================
// RESPONSIVE & ACCESSIBILITY
// ===================================

/**
 * Setup responsive animation handlers
 */
function setupResponsiveAnimations() {
  // Handle window resize
  window.addEventListener(
    'resize',
    debounce(() => {
      ScrollTrigger.refresh();
      console.log('📱 Animations refreshed for resize');
    }, 250)
  );

  // Handle orientation change
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      ScrollTrigger.refresh();
      console.log('🔄 Animations refreshed for orientation change');
    }, 500);
  });
}

/**
 * Initialize reduced motion mode for accessibility
 */
function initializeReducedMotionMode() {
  console.log('♿ Reduced motion mode enabled - disabling complex animations');

  // Kill any existing animations
  gsap.globalTimeline.clear();
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }

  // Set immediate states for all elements
  gsap.set('[data-section] *', { clearProps: 'all' });

  // Initialize fallback animations
  initializeFallbackAnimations();
}

/**
 * Fallback to CSS animations when GSAP is not available
 */
function initializeFallbackAnimations() {
  console.log('🎨 Initializing CSS fallback animations');

  // Use intersection observer for basic animations
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
          }
        });
      },
      { threshold: 0.2 }
    );

    // Observe all animated elements
    document
      .querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right, .stagger-item')
      .forEach((el) => {
        observer.observe(el);
      });
  }
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

/**
 * Debounce utility for performance
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
    console.log('🔄 ScrollTriggers manually refreshed');
  }
}

/**
 * Kill all animations for cleanup
 */
function killAllAnimations() {
  // Kill timelines
  Object.values(timelines).forEach((timeline) => {
    if (timeline && timeline.kill) {
      timeline.kill();
    }
  });

  // Kill scroll triggers
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }

  console.log('🛑 All animations killed for cleanup');
}

// ===================================
// EVENT LISTENERS & CLEANUP
// ===================================

// Handle reduced motion preference changes
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
  if (e.matches) {
    initializeReducedMotionMode();
  } else {
    // Re-initialize animations if motion is enabled
    location.reload();
  }
});

// Cleanup on page unload
window.addEventListener('beforeunload', killAllAnimations);

// ===================================
// GLOBAL EXPORTS
// ===================================

// Export animation controls for external use
window.GSAPAnimations = {
  refresh: refreshScrollTriggers,
  kill: killAllAnimations,
  config: ANIMATION_CONFIG,
  timelines: timelines,
  startHero: startHeroSequence,

  // Manual animation triggers
  animateElement: (element, animation = 'fade-in-up') => {
    if (!element) return;

    const animations = {
      'fade-in-up': { opacity: 0, y: 30 },
      'slide-in-left': { opacity: 0, x: -50 },
      'slide-in-right': { opacity: 0, x: 50 },
      'scale-in': { opacity: 0, scale: 0.8 },
    };

    const from = animations[animation] || animations['fade-in-up'];
    const to = { opacity: 1, x: 0, y: 0, scale: 1 };

    gsap.fromTo(element, from, {
      ...to,
      duration: ANIMATION_CONFIG.normal,
      ease: ANIMATION_CONFIG.ease.smooth,
    });
  },

  // Progress bar animation helper
  animateProgressBar: (bar, percentage, duration = ANIMATION_CONFIG.slow) => {
    if (!bar) return;
    gsap.fromTo(
      bar,
      { width: '0%' },
      {
        width: `${percentage}%`,
        duration,
        ease: ANIMATION_CONFIG.ease.smooth,
      }
    );
  },

  // Experience expand animation
  animateExpand: (element, isExpanding = true) => {
    if (!element) return;

    if (isExpanding) {
      gsap.fromTo(
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
      gsap.to(element, {
        height: 0,
        opacity: 0,
        duration: ANIMATION_CONFIG.fast,
        ease: ANIMATION_CONFIG.ease.smooth,
      });
    }
  },
};

// ===================================
// ENHANCED EXPERIENCE ANIMATIONS
// ===================================

/**
 * Enhanced expand/collapse animations for experience section
 * Called by interactions.js when expand buttons are clicked
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
        // Collapse animation
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
        // Expand animation
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

        // Animate individual items within the expanded content
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
// SCROLL PROGRESS ANIMATION
// ===================================

/**
 * Animate scroll progress bar in header
 */
function createScrollProgressAnimation() {
  const progressBar = document.querySelector('.scroll-progress-bar');
  if (!progressBar) return;

  gsap.to(progressBar, {
    scaleX: 1,
    transformOrigin: 'left center',
    ease: 'none',
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3,
      onUpdate: (self) => {
        // Update progress bar width based on scroll progress
        progressBar.style.transform = `scaleX(${self.progress})`;
      },
    },
  });
}

// ===================================
// THEME TRANSITION ANIMATIONS
// ===================================

/**
 * Animate theme transitions
 */
function createThemeTransitions() {
  // Listen for theme changes from theme.js
  document.addEventListener('themeChange', (e) => {
    const { newTheme } = e.detail;

    // Create a smooth transition overlay
    const overlay = document.createElement('div');
    overlay.className = 'theme-transition-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: ${newTheme === 'dark' ? '#000' : '#fff'};
      opacity: 0;
      z-index: 9999;
      pointer-events: none;
    `;

    document.body.appendChild(overlay);

    // Animate transition
    gsap
      .timeline()
      .to(overlay, {
        opacity: 0.3,
        duration: 0.15,
        ease: 'power2.out',
      })
      .to(overlay, {
        opacity: 0,
        duration: 0.15,
        ease: 'power2.out',
        onComplete: () => {
          document.body.removeChild(overlay);
        },
      });
  });
}

// ===================================
// MOBILE-SPECIFIC ANIMATIONS
// ===================================

/**
 * Create mobile-optimized animations
 */
function createMobileAnimations() {
  if (!ANIMATION_CONFIG.mobile.reduceMotion) return;

  // Simplified mobile hero animation
  const heroSection = document.querySelector('.hero, #hero');
  if (heroSection) {
    const heroElements = heroSection.querySelectorAll(
      '.hero-name, .hero-title, .hero-subtitle, .hero-actions'
    );

    gsap.fromTo(
      heroElements,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.mobile.fasterAnimations,
        ease: ANIMATION_CONFIG.ease.smooth,
        stagger: 0.1,
        delay: 0.5,
      }
    );
  }

  // Simplified section animations for mobile
  const sections = document.querySelectorAll('[data-section]');
  sections.forEach((section) => {
    const elements = section.querySelectorAll('.stagger-item, .fade-in-up');

    if (elements.length > 0) {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 90%',
        onEnter: () => {
          gsap.fromTo(
            elements,
            { opacity: 0, y: 15 },
            {
              opacity: 1,
              y: 0,
              duration: ANIMATION_CONFIG.mobile.fasterAnimations,
              ease: ANIMATION_CONFIG.ease.smooth,
              stagger: 0.05,
            }
          );
        },
      });
    }
  });

  console.log('📱 Mobile-optimized animations created');
}

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

      // If FPS drops below 30, reduce animation complexity
      if (fps < 30) {
        console.warn(`⚠️ Low FPS detected (${fps}), reducing animation complexity`);

        // Disable non-essential animations
        gsap.globalTimeline.timeScale(1.5); // Speed up animations

        // Disable parallax effects
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
// INITIALIZATION COMPLETION
// ===================================

// Initialize additional features when GSAP is ready
document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap !== 'undefined') {
    // Wait for main animations to initialize
    setTimeout(() => {
      createExpandAnimations();
      createScrollProgressAnimation();
      createThemeTransitions();

      // Initialize mobile animations if needed
      if (ANIMATION_CONFIG.mobile.reduceMotion) {
        createMobileAnimations();
      }

      // Start performance monitoring
      monitorPerformance();

      console.log('🎯 Enhanced animations initialized');
    }, 1000);
  }
});

console.log('🎬 animations.js loaded - Aligned with Updated Final Section & Animation Plan');

// ===================================
// CSS INTEGRATION NOTES
// ===================================

/*
 * This animations.js file is designed to work seamlessly with:
 *
 * 1. animations.css - Provides fallback CSS animations and base styles
 * 2. sections.css - Provides layout and styling for all animated elements
 * 3. components.css - Provides component-specific styles
 * 4. interactions.js - Handles expand/collapse and user interactions
 * 5. All component HTML files - Provides the DOM structure for animations
 *
 * Key Integration Points:
 * - Uses same class names as defined in CSS files
 * - Respects CSS custom properties and variables
 * - Enhances but doesn't override CSS animations
 * - Provides smooth fallbacks when GSAP isn't available
 * - Works with the component loading system in components.js
 *
 * Animation Strategy Implementation:
 * ✅ Hero: Letter-by-letter typing, sequential fade-ins
 * ✅ Sections: Scroll-triggered at 20% visibility, staggered elements
 * ✅ Interactive: Hover effects, expand animations, progress bars
 * ✅ Mobile: Reduced motion, performance optimized
 * ✅ Accessibility: Reduced motion support, keyboard navigation
 */
