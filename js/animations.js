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
    .about-stat,
    .fun-facts,
    .about-values,
    .about-actions,
    .certification-item,
    .skill-category,
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
    opacity: 0,
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
    createCertificationsAnimations();
    createAchievementsSummaryAnimations();
    createProjectsAnimations();
    createSummaryContentAnimations();
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

  // MOBILE OPTIMIZATION: Different approach for mobile vs desktop
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    // MOBILE: Create separate ScrollTriggers for each major row
    console.log('📱 Using mobile per-row about animation');

    // ROW 1: Text and Image (separate triggers)
    if (aboutText) {
      gsap.to(aboutText, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: aboutText,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    }

    if (aboutImage) {
      gsap.to(aboutImage, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: aboutImage,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    }

    // ROW 2: Stats (separate trigger)
    if (aboutStats.length > 0) {
      gsap.to(aboutStats, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'back.out(1.7)',
        stagger: 0.1,
        scrollTrigger: {
          trigger: aboutStats[0].closest('.about-stats') || aboutStats[0],
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    }

    // ROW 2: Fun Facts (separate trigger)
    if (funFacts) {
      const funFactTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: funFacts,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });

      funFactTimeline
        .to(funFacts, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
        })
        .to(
          funFactItems,
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            ease: 'power2.out',
            stagger: 0.08,
          },
          '-=0.3'
        );
    }

    // ROW 3: Values (separate trigger)
    if (aboutValues) {
      const valuesTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: aboutValues,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });

      valuesTimeline
        .to(aboutValues, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power1.out',
        })
        .to(
          valueItems,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power1.out',
            stagger: 0.06,
          },
          '-=0.4'
        );
    }

    // ROW 3: Actions (separate trigger)
    if (aboutActions) {
      gsap.to(aboutActions, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: aboutActions,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    }

    // Store mobile timelines
    timelines.sections.set('about-mobile', true);
  } else {
    // DESKTOP: Use unified timeline approach (fixed)
    console.log('🖥️ Using desktop unified about animation');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: aboutSection,
        start: 'top 60%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
        scrub: false,
      },
    });

    // ROW 1 ANIMATIONS (Desktop)
    if (aboutText) {
      tl.to(aboutText, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      });
    }

    // FIXED: Remove nested ScrollTrigger from aboutImage
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

    // ROW 2 ANIMATIONS (Desktop)
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

    if (funFacts) {
      tl.to(
        funFacts,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
        },
        '-=0.3'
      );
    }

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

    // ROW 3 ANIMATIONS (Desktop)
    if (aboutValues) {
      tl.to(
        aboutValues,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power1.out',
        },
        '-=0.2'
      );
    }

    if (valueItems.length > 0) {
      tl.to(
        valueItems,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power1.out',
          stagger: 0.08,
        },
        '-=0.6'
      );
    }

    if (aboutActions) {
      tl.to(
        aboutActions,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power1.out',
        },
        '-=0.5'
      );
    }

    // Store desktop timeline
    timelines.sections.set('about', tl);
  }

  // BONUS: Animated stat counters (separate trigger)
  animateStatCounters();
}

// animate stat counters
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
// Add this debug logging to your createSkillsAnimations function in animations.js:
function createSkillsAnimations() {
  const skillsSection = document.querySelector('#skills, .skills-section');
  if (!skillsSection) return;

  const skillCategories = skillsSection.querySelectorAll('.skill-category');
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    // MOBILE: Create separate ScrollTrigger for each card
    console.log('📱 Using mobile per-card skills animation');

    skillCategories.forEach((card, cardIndex) => {
      const cardBars = card.querySelectorAll('.skill-progress-bar');

      // Create timeline for this specific card
      const cardTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: card, // Each card triggers its own animation
          start: 'top 80%', // When this card is 20% visible
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      });

      // Animate the card container first
      cardTimeline.to(card, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: ANIMATION_CONFIG.normal,
        ease: ANIMATION_CONFIG.ease.bounce,
      });

      // Then animate skill bars row-wise within this card
      cardBars.forEach((bar, rowIndex) => {
        const percentage = parseInt(bar.getAttribute('data-percentage')) || 75;

        cardTimeline.to(
          bar,
          {
            opacity: 1,
            width: `${percentage}%`,
            duration: ANIMATION_CONFIG.fast,
            ease: ANIMATION_CONFIG.ease.smooth,
          },
          `-=${rowIndex === 0 ? 0.3 : 0.0}` // First row starts earlier, others overlap
        );
      });

      // Store timeline for cleanup
      timelines.sections.set(`skills-card-${cardIndex}`, cardTimeline);
    });
  } else {
    // DESKTOP: Single ScrollTrigger, row-wise across all cards
    console.log('🖥️ Using desktop cross-card skills animation');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: skillsSection,
        start: ANIMATION_CONFIG.scrollTrigger.start,
        end: ANIMATION_CONFIG.scrollTrigger.end,
        toggleActions: ANIMATION_CONFIG.scrollTrigger.toggleActions,
      },
    });

    // Animate all skill categories first
    tl.to(skillCategories, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: ANIMATION_CONFIG.normal,
      ease: ANIMATION_CONFIG.ease.bounce,
      stagger: ANIMATION_CONFIG.stagger.normal,
    });

    // Group skill bars by row position across all cards
    const skillsByRow = {};

    skillCategories.forEach((category) => {
      const barsInCategory = category.querySelectorAll('.skill-progress-bar');
      barsInCategory.forEach((bar, index) => {
        if (!skillsByRow[index]) {
          skillsByRow[index] = [];
        }
        skillsByRow[index].push(bar);
      });
    });

    // Animate each row across all cards simultaneously
    Object.keys(skillsByRow).forEach((rowIndex, timelineIndex) => {
      const barsInRow = skillsByRow[rowIndex];

      barsInRow.forEach((bar) => {
        const percentage = parseInt(bar.getAttribute('data-percentage')) || 75;

        tl.to(
          bar,
          {
            opacity: 1,
            width: `${percentage}%`,
            duration: ANIMATION_CONFIG.slow,
            ease: ANIMATION_CONFIG.ease.smooth,
          },
          timelineIndex === 0 ? '-=0.9' : '-=1'
        );
      });
    });

    timelines.sections.set('skills', tl);
  }
}

/**
 * Fixed Certifications section animation
 */
function createCertificationsAnimations() {
  const certificationsSection = document.querySelector('.certifications-section');
  if (!certificationsSection) return;

  // Get certification items/cards
  const certificationItems = certificationsSection.querySelectorAll(
    '.certification-item, .certification-card'
  );

  // Create timeline for certifications section
  const certificationTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: certificationsSection,
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
    },
  });

  // Set initial states for certification items
  if (certificationItems.length > 0) {
    gsap.set(certificationItems, {
      opacity: 0,
      y: 30,
      scale: 0.9,
    });

    // Animate certification items with stagger
    certificationTimeline.to(certificationItems, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: ANIMATION_CONFIG.normal,
      ease: ANIMATION_CONFIG.ease.bounce,
      stagger: ANIMATION_CONFIG.stagger.normal, // Animate items one after another
    });
  } else {
    // Fallback: animate the entire section if no items found
    gsap.set(certificationsSection, {
      opacity: 0,
      y: 30,
    });

    certificationTimeline.to(certificationsSection, {
      opacity: 1,
      y: 0,
      duration: ANIMATION_CONFIG.normal,
      ease: ANIMATION_CONFIG.ease.bounce,
    });
  }

  // Store timeline for cleanup
  timelines.sections.set('certifications', certificationTimeline);

  console.log('📜 Certifications animations created');
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
 * Achievements Summary section animation
 */
function createAchievementsSummaryAnimations() {
  const achievementsSection = document.querySelector('.achievements-summary');
  if (!achievementsSection) return;

  // Get achievement elements
  const achievementsTitle = achievementsSection.querySelector('.achievements-title');
  const achievementItems = achievementsSection.querySelectorAll('.achievement-item');
  const achievementNumbers = achievementsSection.querySelectorAll('.achievement-number');

  // Set initial states
  if (achievementsTitle) {
    gsap.set(achievementsTitle, {
      opacity: 0,
      y: 30,
    });
  }

  if (achievementItems.length > 0) {
    gsap.set(achievementItems, {
      opacity: 0,
      y: 50,
      scale: 0.8,
    });
  }

  // Create timeline for achievements section
  const achievementsTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: achievementsSection,
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
    },
  });

  // Animate title first
  if (achievementsTitle) {
    achievementsTimeline.to(achievementsTitle, {
      opacity: 1,
      y: 0,
      duration: ANIMATION_CONFIG.normal,
      ease: ANIMATION_CONFIG.ease.smooth,
    });
  }

  // Animate achievement items with stagger and bounce
  if (achievementItems.length > 0) {
    achievementsTimeline.to(
      achievementItems,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: ANIMATION_CONFIG.normal,
        ease: ANIMATION_CONFIG.ease.bounce,
        stagger: ANIMATION_CONFIG.stagger.normal, // 0.12s between each item
      },
      '-=0.3' // Start 0.3s before title animation completes
    );
  }

  // Animate numbers counting up (separate trigger for better effect)
  if (achievementNumbers.length > 0) {
    achievementNumbers.forEach((numberEl) => {
      const targetText = numberEl.textContent;
      const targetValue = parseFloat(targetText.replace(/[^0-9.]/g, '')) || 0;
      const suffix = targetText.replace(/[0-9.]/g, ''); // Get +, %, etc.

      // Set initial value to 0
      numberEl.textContent = '0' + suffix;

      // Create counting animation
      gsap.to(numberEl, {
        innerHTML: targetValue,
        duration: ANIMATION_CONFIG.slow * 1.5, // Slower counting for effect
        ease: 'power2.out',
        snap: { innerHTML: targetValue >= 1000 ? 50 : 1 }, // Snap to whole numbers
        scrollTrigger: {
          trigger: numberEl,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        onUpdate: function () {
          const currentValue = Math.round(this.targets()[0].innerHTML);

          // Format the number properly
          if (targetText.includes('+')) {
            numberEl.textContent = currentValue.toLocaleString() + '+';
          } else if (targetText.includes('%')) {
            numberEl.textContent = currentValue + '%';
          } else {
            numberEl.textContent = currentValue.toLocaleString() + suffix;
          }
        },
        onComplete: function () {
          // Ensure final value is exactly what was intended
          numberEl.textContent = targetText;
        },
      });
    });
  }

  // Store timeline for cleanup
  timelines.sections.set('achievements-summary', achievementsTimeline);

  console.log('🏆 Achievements Summary animations created');
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
 * Create animations for summary content sections
 * Following the exact same pattern as working hobbies/about sections
 */
function createSummaryContentAnimations() {
  console.log('📝 Creating summary content animations...');

  // SKILLS SUMMARY - following hobbies pattern exactly
  const skillsSection = document.querySelector('#skills, .skills-section');
  if (skillsSection) {
    const skillsSummary = skillsSection.querySelector('.skills-summary');
    const skillsSummaryContent = skillsSection.querySelector('.skills-summary .summary-content');
    const learningTags = skillsSection.querySelectorAll('.learning-tag');
    if (skillsSummary || skillsSummaryContent) {
      const targetElement = skillsSummaryContent || skillsSummary;

      console.log('📊 Creating skills summary animation');

      // Set initial state - exactly like hobbiesSummaryContent
      gsap.set(targetElement, { opacity: 0, x: 50 });
      if (learningTags.length > 0) {
        gsap.set(learningTags, { opacity: 0, scale: 0.8 });
      }

      // Create timeline - exactly like hobbies
      const skillsTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: targetElement,
          start: ANIMATION_CONFIG.scrollTrigger.start,
          end: ANIMATION_CONFIG.scrollTrigger.end,
          toggleActions: ANIMATION_CONFIG.scrollTrigger.toggleActions,
        },
      });

      // Animate summary content - exactly like hobbies
      skillsTimeline.to(targetElement, {
        opacity: 1,
        x: 0,
        duration: ANIMATION_CONFIG.normal,
        ease: ANIMATION_CONFIG.ease.smooth,
      });

      // Animate tags with stagger - like hobby items
      if (learningTags.length > 0) {
        skillsTimeline.to(
          learningTags,
          {
            opacity: 1,
            scale: 1,
            duration: ANIMATION_CONFIG.fast,
            ease: ANIMATION_CONFIG.ease.bounce,
            stagger: ANIMATION_CONFIG.stagger.fast, // 0.08s like hobbies
          },
          '-=0.3'
        );
      }

      timelines.sections.set('skills-summary', skillsTimeline);
      console.log('✅ Skills summary animation created');
    }
  }

  // PROJECTS SUMMARY - following hobbies pattern exactly
  const projectsSection = document.querySelector('.projects-section');
  if (projectsSection) {
    const projectsSummary = projectsSection.querySelector('.summary-content-projects');

    if (projectsSummary) {
      console.log('🎯 Creating projects summary animation');

      // Set initial state - exactly like hobbiesSummaryContent
      gsap.set(projectsSummary, { opacity: 0, x: 50 });

      // Create timeline - exactly like hobbies
      const projectsTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: projectsSummary,
          start: ANIMATION_CONFIG.scrollTrigger.start,
          end: ANIMATION_CONFIG.scrollTrigger.end,
          toggleActions: ANIMATION_CONFIG.scrollTrigger.toggleActions,
        },
      });

      // Animate summary - exactly like hobbies
      projectsTimeline.to(projectsSummary, {
        opacity: 1,
        x: 0,
        duration: ANIMATION_CONFIG.normal,
        ease: ANIMATION_CONFIG.ease.smooth,
      });

      timelines.sections.set('projects-summary', projectsTimeline);
      console.log('✅ Projects summary animation created');
    }
  }

  console.log('📝 Summary content animations completed');
}

/**
 * Hobbies section - Pure GSAP rotation
 */
/**
 * Updated Hobbies section animation - handles complex two-column layout
 */
function createHobbiesAnimations() {
  const hobbiesSection = document.querySelector('#hobbies, .hobbies-section');
  if (!hobbiesSection) return;

  // Get all the different elements in the hobbies section
  const sectionHeader = hobbiesSection.querySelector('.section-header');
  const sectionTitle = hobbiesSection.querySelector('.section-title');
  const sectionSubtitle = hobbiesSection.querySelector('.section-subtitle');

  // Photography column elements
  const photographyColumn = hobbiesSection.querySelector('.photography-column');
  const showcaseHeader = hobbiesSection.querySelector('.showcase-header');
  const photoGallery = hobbiesSection.querySelector('.photo-gallery');
  const galleryContainer = hobbiesSection.querySelector('.gallery-container');
  const galleryControls = hobbiesSection.querySelector('.gallery-controls');
  const galleryIndicators = hobbiesSection.querySelector('.gallery-indicators');

  // Other interests column elements
  const otherInterestsColumn = hobbiesSection.querySelector('.other-interests-column');
  const hobbiesSummary = hobbiesSection.querySelector('.hobbies-summary');
  const hobbiesSummaryContent = hobbiesSection.querySelector('.hobbies-summary-content');
  const hobbyItems = hobbiesSection.querySelectorAll('.hobby-item');
  const hobbiesGrid = hobbiesSection.querySelector('.hobbies-grid');

  // Set initial states for all elements
  if (sectionHeader) {
    gsap.set([sectionTitle, sectionSubtitle], { opacity: 0, y: 30 });
  }

  if (photographyColumn) {
    gsap.set(showcaseHeader, { opacity: 0, x: -50 });
    gsap.set(galleryContainer, { opacity: 0, scale: 0.9 });
    gsap.set([galleryControls, galleryIndicators], { opacity: 0, y: 20 });
  }

  if (otherInterestsColumn) {
    gsap.set(hobbiesSummaryContent, { opacity: 0, x: 50 });
    gsap.set(hobbyItems, { opacity: 0, rotation: -180, scale: 0 });
  }

  // Create main timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: hobbiesSection,
      start: ANIMATION_CONFIG.scrollTrigger.start,
      end: ANIMATION_CONFIG.scrollTrigger.end,
      toggleActions: ANIMATION_CONFIG.scrollTrigger.toggleActions,
    },
  });

  // SEQUENCE 1: Section Header
  if (sectionTitle) {
    tl.to(sectionTitle, {
      opacity: 1,
      y: 0,
      duration: ANIMATION_CONFIG.normal,
      ease: ANIMATION_CONFIG.ease.smooth,
    });
  }

  if (sectionSubtitle) {
    tl.to(
      sectionSubtitle,
      {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.normal,
        ease: ANIMATION_CONFIG.ease.smooth,
      },
      '-=0.3'
    );
  }

  // SEQUENCE 2: Photography Column (Left side)
  if (showcaseHeader) {
    tl.to(
      showcaseHeader,
      {
        opacity: 1,
        x: 0,
        duration: ANIMATION_CONFIG.normal,
        ease: ANIMATION_CONFIG.ease.smooth,
      },
      '-=0.2'
    );
  }

  if (galleryContainer) {
    tl.to(
      galleryContainer,
      {
        opacity: 1,
        scale: 1,
        duration: ANIMATION_CONFIG.normal,
        ease: ANIMATION_CONFIG.ease.bounce,
      },
      '-=0.1'
    );
  }

  // Gallery controls fade in
  if (galleryControls) {
    tl.to(
      galleryControls,
      {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.fast,
        ease: ANIMATION_CONFIG.ease.smooth,
      },
      '-=0.2'
    );
  }

  if (galleryIndicators) {
    tl.to(
      galleryIndicators,
      {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.fast,
        ease: ANIMATION_CONFIG.ease.smooth,
      },
      '-=0.4'
    );
  }

  // SEQUENCE 3: Other Interests Column (Right side)
  if (hobbiesSummaryContent) {
    tl.to(
      hobbiesSummaryContent,
      {
        opacity: 1,
        x: 0,
        duration: ANIMATION_CONFIG.normal,
        ease: ANIMATION_CONFIG.ease.smooth,
      },
      '-=0.6' // Start before gallery finishes
    );
  }

  // SEQUENCE 4: Hobby Items with rotation effect
  if (hobbyItems.length > 0) {
    tl.to(
      hobbyItems,
      {
        trigger: hobbyItems,
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: ANIMATION_CONFIG.normal,
        ease: ANIMATION_CONFIG.ease.elastic,
        stagger: ANIMATION_CONFIG.stagger.fast, // 0.08s between each item
      },
      '-=0.2'
    );
  }

  // Store timeline
  timelines.sections.set('hobbies', tl);

  // BONUS: Add gallery photo cycling animation (separate from scroll trigger)
  createGalleryAnimations();

  console.log('🎨 Hobbies animations created with photography showcase');
}

/**
 * Separate gallery animations for the photo slideshow
 */
function createGalleryAnimations() {
  const galleryPhotos = document.querySelectorAll('.gallery-photo');
  const indicatorDots = document.querySelectorAll('.indicator-dot');

  if (galleryPhotos.length === 0) return;

  // Set initial states for gallery photos
  gsap.set(galleryPhotos, { opacity: 0, scale: 0.95 });

  // Show first photo
  if (galleryPhotos[0]) {
    gsap.set(galleryPhotos[0], { opacity: 1, scale: 1 });
  }

  // Add subtle breathing animation to active photo
  if (galleryPhotos[0]) {
    gsap.to(galleryPhotos[0], {
      scale: 1.02,
      duration: 4,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
  }

  // Animate indicator dots on hover
  indicatorDots.forEach((dot, index) => {
    dot.addEventListener('mouseenter', () => {
      gsap.to(dot, {
        scale: 1.2,
        duration: 0.2,
        ease: 'power2.out',
      });
    });

    dot.addEventListener('mouseleave', () => {
      gsap.to(dot, {
        scale: 1,
        duration: 0.2,
        ease: 'power2.out',
      });
    });
  });

  console.log('📸 Gallery animations initialized');
}

/**
 * Helper function for photo transitions (can be called by gallery controls)
 */
function animatePhotoTransition(fromPhoto, toPhoto) {
  if (!fromPhoto || !toPhoto) return;

  const tl = gsap.timeline();

  // Fade out current photo
  tl.to(fromPhoto, {
    opacity: 0,
    scale: 0.95,
    duration: 0.3,
    ease: 'power2.out',
  });

  // Fade in new photo
  tl.to(
    toPhoto,
    {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: 'power2.out',
    },
    '-=0.1'
  );

  // Add subtle zoom effect to new photo
  tl.to(
    toPhoto,
    {
      scale: 1.02,
      duration: 4,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    },
    '+=0.2'
  );

  return tl;
}

// Export the photo transition function for use by gallery controls
if (typeof window !== 'undefined') {
  window.animatePhotoTransition = animatePhotoTransition;
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
  addSummaryInteractions();

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

/**
 * Enhanced learning tags hover effects (bonus)
 * Only add interactions, don't animate initial state
 */
function addSummaryInteractions() {
  const learningTags = document.querySelectorAll('.learning-tag, .tag, .skill-tag');

  if (learningTags.length === 0) return;

  learningTags.forEach((tag) => {
    // Hover effects only - don't mess with initial states
    tag.addEventListener('mouseenter', () => {
      gsap.to(tag, {
        scale: 1.05,
        y: -2,
        duration: 0.2,
        ease: 'power2.out',
      });
    });

    tag.addEventListener('mouseleave', () => {
      gsap.to(tag, {
        scale: 1,
        y: 0,
        duration: 0.2,
        ease: 'power2.out',
      });
    });

    // Click effect
    tag.addEventListener('click', () => {
      gsap.to(tag, {
        scale: 0.95,
        duration: 0.1,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1,
      });
    });
  });

  console.log(`🏷️ Added interactions to ${learningTags.length} learning tags`);
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
    }, 10)
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
