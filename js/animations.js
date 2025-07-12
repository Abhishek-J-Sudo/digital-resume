/**
 * GSAP Animations & Scroll Triggers
 * Advanced animations using GSAP library with ScrollTrigger plugin
 */

// Animation configuration
const ANIMATION_CONFIG = {
  // Default durations
  fast: 0.3,
  normal: 0.6,
  slow: 1.2,

  // Easing functions
  ease: {
    smooth: 'power2.out',
    bounce: 'back.out(1.7)',
    elastic: 'elastic.out(1, 0.3)',
    spring: 'power3.inOut',
  },

  // Stagger timing
  stagger: {
    fast: 0.1,
    normal: 0.2,
    slow: 0.3,
  },

  // Scroll trigger settings
  scrollTrigger: {
    start: 'top 80%',
    end: 'bottom 20%',
    toggleActions: 'play none none reverse',
  },
};

// GSAP timeline instances
const timelines = {
  hero: null,
  loading: null,
  sections: new Map(),
};

/**
 * Initialize GSAP animations when page loads
 */
document.addEventListener('DOMContentLoaded', () => {
  // Wait for GSAP to load
  if (typeof gsap === 'undefined') {
    console.warn('⚠️ GSAP not loaded, falling back to CSS animations');
    return;
  }

  // Register ScrollTrigger plugin
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    console.log('✅ GSAP and ScrollTrigger initialized');
  }

  // Set default GSAP settings
  gsap.defaults({
    duration: ANIMATION_CONFIG.normal,
    ease: ANIMATION_CONFIG.ease.smooth,
  });

  // Initialize when app is loaded
  if (window.App && window.App.isLoaded) {
    initializeGSAPAnimations();
  } else {
    // Wait for app to load
    const checkAppLoaded = setInterval(() => {
      if (window.App && window.App.isLoaded) {
        clearInterval(checkAppLoaded);
        initializeGSAPAnimations();
      }
    }, 100);
  }
});

/**
 * Initialize all GSAP animations
 */
function initializeGSAPAnimations() {
  try {
    // Create loading screen animations
    createLoadingAnimations();

    // Create hero section animations
    createHeroAnimations();

    // Create scroll-triggered section animations
    createScrollAnimations();

    // Create hover and interaction animations
    createInteractionAnimations();

    // Create parallax effects
    createParallaxEffects();

    // Refresh ScrollTrigger
    ScrollTrigger.refresh();

    console.log('🎬 GSAP animations initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing GSAP animations:', error);
  }
}

/**
 * Create loading screen animations
 */
function createLoadingAnimations() {
  const loadingScreen = document.getElementById('loading-screen');
  const loadingSpinner = document.querySelector('.loading-spinner');
  const loadingText = document.querySelector('.loading-content p');

  if (!loadingScreen) return;

  timelines.loading = gsap.timeline();

  // Animate loading elements
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

  // Hide loading screen animation
  timelines.loading.to(loadingScreen, {
    opacity: 0,
    duration: 0.5,
    ease: ANIMATION_CONFIG.ease.smooth,
    delay: 1,
    onComplete: () => {
      loadingScreen.style.display = 'none';
    },
  });
}

/**
 * Create hero section animations
 */
function createHeroAnimations() {
  const heroSection = document.querySelector('.hero');
  const heroName = document.querySelector('.hero-name');
  const heroTitle = document.querySelector('.hero-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const heroCta = document.querySelector('.hero-cta');

  if (!heroSection) return;

  timelines.hero = gsap.timeline({ delay: 1.5 });

  // Set initial states
  gsap.set([heroName, heroTitle, heroSubtitle, heroCta], {
    opacity: 0,
    y: 30,
  });

  // Typewriter effect for name
  if (heroName) {
    const nameText = heroName.textContent;
    heroName.textContent = '';
    heroName.style.opacity = '1';

    // Create typewriter animation
    let i = 0;
    const typeInterval = setInterval(() => {
      heroName.textContent += nameText[i];
      i++;
      if (i >= nameText.length) {
        clearInterval(typeInterval);
        // Continue with other animations
        animateHeroContent();
      }
    }, 100);
  } else {
    animateHeroContent();
  }

  function animateHeroContent() {
    timelines.hero
      .to(
        heroTitle,
        {
          opacity: 1,
          y: 0,
          duration: ANIMATION_CONFIG.normal,
          ease: ANIMATION_CONFIG.ease.smooth,
        },
        '-=0.3'
      )
      .to(
        heroSubtitle,
        {
          opacity: 1,
          y: 0,
          duration: ANIMATION_CONFIG.normal,
          ease: ANIMATION_CONFIG.ease.smooth,
        },
        '-=0.2'
      )
      .to(
        heroCta,
        {
          opacity: 1,
          y: 0,
          duration: ANIMATION_CONFIG.normal,
          ease: ANIMATION_CONFIG.ease.bounce,
        },
        '-=0.1'
      );
  }

  // Hero parallax background
  if (window.innerWidth > 768) {
    gsap.to(heroSection, {
      yPercent: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }
}

/**
 * Create scroll-triggered animations for all sections
 */
function createScrollAnimations() {
  // About section
  createAboutAnimations();

  // Skills section
  createSkillsAnimations();

  // Experience section
  createExperienceAnimations();

  // Projects section
  createProjectsAnimations();

  // Hobbies section
  createHobbiesAnimations();

  // Contact section
  createContactAnimations();
}

/**
 * About section animations
 */
function createAboutAnimations() {
  const aboutSection = document.querySelector('[data-section="about"], #about');
  const aboutText = document.querySelector('.about-text');
  const aboutImage = document.querySelector('.about-image');

  if (!aboutSection) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: aboutSection,
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
    },
  });

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

  if (aboutImage) {
    tl.fromTo(
      aboutImage,
      { opacity: 0, x: 50, scale: 0.8 },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: ANIMATION_CONFIG.normal,
        ease: ANIMATION_CONFIG.ease.bounce,
      },
      '-=0.3'
    );
  }

  timelines.sections.set('about', tl);
}

/**
 * Skills section animations
 */
function createSkillsAnimations() {
  const skillsSection = document.querySelector('[data-section="skills"], #skills');
  const skillCategories = document.querySelectorAll('.skill-category');
  const skillProgressBars = document.querySelectorAll('.skill-progress-bar');

  if (!skillsSection) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: skillsSection,
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
    },
  });

  // Animate skill categories
  if (skillCategories.length > 0) {
    tl.fromTo(
      skillCategories,
      {
        opacity: 0,
        y: 30,
        scale: 0.8,
      },
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

  // Animate progress bars
  if (skillProgressBars.length > 0) {
    skillProgressBars.forEach((bar, index) => {
      const percentage = bar.dataset.percentage || 75;

      tl.fromTo(
        bar,
        { width: '0%' },
        {
          width: `${percentage}%`,
          duration: ANIMATION_CONFIG.slow,
          ease: ANIMATION_CONFIG.ease.smooth,
          delay: index * 0.1,
        },
        '-=0.5'
      );
    });
  }

  timelines.sections.set('skills', tl);
}

/**
 * Experience section animations
 */
function createExperienceAnimations() {
  const experienceSection = document.querySelector('[data-section="experience"], #experience');
  const timelineDots = document.querySelectorAll('.timeline-dot');
  const experienceItems = document.querySelectorAll('.experience-item');

  if (!experienceSection) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: experienceSection,
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
    },
  });

  // Animate timeline line
  const timelineLine = document.querySelector('.timeline-line');
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
      '-=0.8'
    );
  }

  // Animate experience items
  if (experienceItems.length > 0) {
    experienceItems.forEach((item, index) => {
      const isEven = index % 2 === 0;
      const xOffset = window.innerWidth > 768 ? (isEven ? -50 : 50) : -30;

      tl.fromTo(
        item,
        {
          opacity: 0,
          x: xOffset,
          y: 20,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: ANIMATION_CONFIG.normal,
          ease: ANIMATION_CONFIG.ease.smooth,
        },
        '-=0.7'
      );
    });
  }

  timelines.sections.set('experience', tl);
}

/**
 * Projects section animations
 */
function createProjectsAnimations() {
  const projectsSection = document.querySelector('[data-section="projects"], #projects');
  const projectCards = document.querySelectorAll('.project-card');

  if (!projectsSection) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: projectsSection,
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
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

    // Add shimmer effect on hover
    projectCards.forEach((card) => {
      const projectImage = card.querySelector('.project-image');
      if (projectImage) {
        card.addEventListener('mouseenter', () => {
          gsap.to(projectImage, {
            backgroundPosition: '200% center',
            duration: 1,
            ease: 'power2.out',
          });
        });
      }
    });
  }

  timelines.sections.set('projects', tl);
}

/**
 * Hobbies section animations
 */
function createHobbiesAnimations() {
  const hobbiesSection = document.querySelector('[data-section="hobbies"], #hobbies');
  const hobbyItems = document.querySelectorAll('.hobby-item');

  if (!hobbiesSection) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: hobbiesSection,
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
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
 * Contact section animations
 */
function createContactAnimations() {
  const contactSection = document.querySelector('[data-section="contact"], #contact');
  const contactItems = document.querySelectorAll('.contact-item');

  if (!contactSection) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: contactSection,
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
    },
  });

  if (contactItems.length > 0) {
    tl.fromTo(
      contactItems,
      {
        opacity: 0,
        y: 30,
        scale: 0.8,
      },
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

/**
 * Create hover and interaction animations
 */
function createInteractionAnimations() {
  // Navigation link hover effects
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach((link) => {
    const underline = link.querySelector('::after');

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

  // Button hover effects
  const buttons = document.querySelectorAll('.hero-cta, .expand-btn, .project-link');
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

    button.addEventListener('click', () => {
      gsap.to(button, {
        scale: 0.95,
        duration: 0.1,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1,
      });
    });
  });

  // Card hover effects
  const cards = document.querySelectorAll(
    '.skill-category, .project-card, .contact-item, .hobby-item'
  );
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
 * Create parallax effects
 */
function createParallaxEffects() {
  // Only create parallax on desktop for performance
  if (window.innerWidth <= 768) return;

  // Background parallax elements
  const parallaxElements = document.querySelectorAll('.parallax-element');

  parallaxElements.forEach((element) => {
    const speed = element.dataset.parallaxSpeed || 0.5;

    gsap.to(element, {
      yPercent: -50 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });

  // Floating elements
  const floatingElements = document.querySelectorAll('.floating-element');
  floatingElements.forEach((element, index) => {
    gsap.to(element, {
      y: 'random(-20, 20)',
      x: 'random(-10, 10)',
      rotation: 'random(-5, 5)',
      duration: 'random(3, 6)',
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: index * 0.5,
    });
  });
}

/**
 * Refresh all scroll triggers (useful for dynamic content)
 */
function refreshScrollTriggers() {
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
    console.log('🔄 ScrollTriggers refreshed');
  }
}

/**
 * Kill all animations (cleanup)
 */
function killAllAnimations() {
  // Kill all timelines
  Object.values(timelines).forEach((timeline) => {
    if (timeline && timeline.kill) {
      timeline.kill();
    }
  });

  // Kill all scroll triggers
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }

  console.log('🛑 All GSAP animations killed');
}

/**
 * Handle reduced motion preferences
 */
function handleReducedMotion() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Disable all GSAP animations
    gsap.globalTimeline.clear();
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    // Set immediate states
    gsap.set('*', { clearProps: 'all' });

    console.log('♿ Reduced motion mode enabled');
  }
}

// Initialize reduced motion handling
window
  .matchMedia('(prefers-reduced-motion: reduce)')
  .addEventListener('change', handleReducedMotion);
handleReducedMotion();

// Cleanup on page unload
window.addEventListener('beforeunload', killAllAnimations);

// Export functions for external use
window.GSAPAnimations = {
  refresh: refreshScrollTriggers,
  kill: killAllAnimations,
  config: ANIMATION_CONFIG,
  timelines: timelines,
};
