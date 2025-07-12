/**
 * Main JavaScript File
 * Handles component loading, initialization, and core functionality
 */

// Global application state
const App = {
  isLoaded: false,
  isMobile: false,
  scrollPosition: 0,
  components: {
    header: null,
    hero: null,
    about: null,
    skills: null,
    experience: null,
    projects: null,
    hobbies: null,
    contact: null,
  },
  observers: {
    intersection: null,
    scroll: null,
  },
};

/**
 * Component paths configuration
 */
const COMPONENT_PATHS = {
  header: 'components/header.html',
  hero: 'components/hero.html',
  about: 'components/about.html',
  skills: 'components/skills.html',
  experience: 'components/experience.html',
  projects: 'components/projects.html',
  hobbies: 'components/hobbies.html',
  contact: 'components/contact.html',
};

/**
 * Initialize the application
 */
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Show loading screen
    showLoadingScreen();

    // Detect mobile device
    detectMobile();

    // Load all components
    await loadAllComponents();

    // Initialize core functionality
    initializeApp();

    // Hide loading screen and show content
    hideLoadingScreen();

    App.isLoaded = true;

    console.log('✅ Resume website loaded successfully');
  } catch (error) {
    console.error('❌ Error loading resume website:', error);
    handleLoadError(error);
  }
});

/**
 * Detect if user is on mobile device
 */
function detectMobile() {
  App.isMobile =
    window.innerWidth <= 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  document.body.classList.toggle('mobile', App.isMobile);
}

/**
 * Show loading screen
 */
function showLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.classList.remove('hidden');
  }
}

/**
 * Hide loading screen and show main content
 */
function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  const mainContent = document.getElementById('main-content');

  if (loadingScreen && mainContent) {
    setTimeout(() => {
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        mainContent.classList.remove('hidden');

        // Trigger initial animations
        triggerInitialAnimations();
      }, 500);
    }, 1000); // Show loading for at least 1 second
  }
}

/**
 * Load a single component
 */
async function loadComponent(name, path, containerId) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load ${name}: ${response.status}`);
    }

    const html = await response.text();
    const container = document.getElementById(containerId);

    if (!container) {
      throw new Error(`Container ${containerId} not found`);
    }

    container.innerHTML = html;
    App.components[name] = container;

    console.log(`✅ Loaded component: ${name}`);
    return true;
  } catch (error) {
    console.error(`❌ Error loading ${name}:`, error);

    // Load fallback content
    loadFallbackComponent(name, containerId);
    return false;
  }
}

/**
 * Load fallback content for failed components
 */
function loadFallbackComponent(name, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const fallbackContent = {
    header: `
            <header class="header">
                <nav class="nav">
                    <a href="#" class="logo">Your Name</a>
                    <ul class="nav-links">
                        <li><a href="#about">About</a></li>
                        <li><a href="#skills">Skills</a></li>
                        <li><a href="#experience">Experience</a></li>
                        <li><a href="#projects">Projects</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                    <button class="mobile-menu-toggle">
                        <span></span><span></span><span></span>
                    </button>
                </nav>
            </header>
        `,
    hero: `
            <section class="hero">
                <div class="hero-content">
                    <h1 class="hero-name">Your Name</h1>
                    <p class="hero-title">Your Job Title</p>
                    <a href="#about" class="hero-cta">Learn More</a>
                </div>
            </section>
        `,
    about: `
            <section class="section">
                <div class="container">
                    <div class="section-header">
                        <h2 class="section-title">About Me</h2>
                    </div>
                    <div class="about-grid">
                        <div class="about-text">
                            <p>Content loading failed. Please refresh the page.</p>
                        </div>
                    </div>
                </div>
            </section>
        `,
  };

  container.innerHTML =
    fallbackContent[name] ||
    `
        <section class="section">
            <div class="container">
                <p>Error loading ${name} section. Please refresh the page.</p>
            </div>
        </section>
    `;
}

/**
 * Load all components asynchronously
 */
async function loadAllComponents() {
  const loadPromises = Object.entries(COMPONENT_PATHS).map(([name, path]) => {
    const containerId = `${name}-container`;
    return loadComponent(name, path, containerId);
  });

  // Wait for all components to load (or fail)
  const results = await Promise.allSettled(loadPromises);

  // Log results
  const successCount = results.filter(
    (result) => result.status === 'fulfilled' && result.value
  ).length;
  const failCount = results.length - successCount;

  console.log(`📊 Component loading complete: ${successCount}/${results.length} successful`);

  if (failCount > 0) {
    console.warn(`⚠️ ${failCount} components failed to load`);
  }
}

/**
 * Initialize core application functionality
 */
function initializeApp() {
  // Initialize scroll tracking
  initializeScrollTracking();

  // Initialize smooth scrolling
  initializeSmoothScrolling();

  // Initialize intersection observer for animations
  initializeIntersectionObserver();

  // Initialize header scroll effects
  initializeHeaderEffects();

  // Initialize resize handling
  initializeResizeHandling();

  // Initialize keyboard navigation
  initializeKeyboardNavigation();

  // Initialize error handling
  initializeErrorHandling();

  console.log('🚀 Core functionality initialized');
}

/**
 * Initialize scroll position tracking
 */
function initializeScrollTracking() {
  let ticking = false;

  function updateScrollPosition() {
    App.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    ticking = false;
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollPosition);
        ticking = true;
      }
    },
    { passive: true }
  );
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initializeSmoothScrolling() {
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a[href^="#"]');
    if (!target) return;

    e.preventDefault();

    const targetId = target.getAttribute('href').substring(1);
    const targetElement =
      document.getElementById(targetId) || document.querySelector(`[data-section="${targetId}"]`);

    if (targetElement) {
      const headerHeight = 60; // Fixed header height
      const targetPosition =
        targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });

      // Update active nav link
      updateActiveNavLink(targetId);

      // Close mobile menu if open
      closeMobileMenu();
    }
  });
}

/**
 * Initialize intersection observer for scroll animations
 */
function initializeIntersectionObserver() {
  const options = {
    root: null,
    rootMargin: '0px 0px -20% 0px', // Trigger when 80% visible
    threshold: 0.1,
  };

  App.observers.intersection = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Add animation class
        entry.target.classList.add('animated');

        // Update active navigation
        const sectionId = entry.target.id || entry.target.dataset.section;
        if (sectionId) {
          updateActiveNavLink(sectionId);
        }

        // Trigger section-specific animations
        triggerSectionAnimations(entry.target);
      }
    });
  }, options);

  // Observe all sections
  const sections = document.querySelectorAll('section, [data-section]');
  sections.forEach((section) => {
    App.observers.intersection.observe(section);
  });
}

/**
 * Initialize header scroll effects
 */
function initializeHeaderEffects() {
  let lastScrollTop = 0;

  window.addEventListener(
    'scroll',
    () => {
      const header = document.querySelector('.header');
      if (!header) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // Add scrolled class when not at top
      if (scrollTop > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Hide/show header on scroll direction (optional)
      if (Math.abs(lastScrollTop - scrollTop) <= 5) return;

      if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down
        header.style.transform = 'translateY(-100%)';
      } else {
        // Scrolling up
        header.style.transform = 'translateY(0)';
      }

      lastScrollTop = scrollTop;
    },
    { passive: true }
  );
}

/**
 * Initialize window resize handling
 */
function initializeResizeHandling() {
  let resizeTimeout;

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Update mobile detection
      const wasMobile = App.isMobile;
      detectMobile();

      // Refresh layout if device type changed
      if (wasMobile !== App.isMobile) {
        refreshLayout();
      }

      // Close mobile menu if window is resized to desktop
      if (!App.isMobile) {
        closeMobileMenu();
      }
    }, 250);
  });
}

/**
 * Initialize keyboard navigation
 */
function initializeKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
      closeMobileMenu();
    }

    // Tab navigation improvements
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });

  // Remove keyboard navigation class on mouse use
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });
}

/**
 * Initialize global error handling
 */
function initializeErrorHandling() {
  window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // Could send to analytics or error reporting service
  });

  window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // Could send to analytics or error reporting service
  });
}

/**
 * Update active navigation link
 */
function updateActiveNavLink(sectionId) {
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-link');

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === `#${sectionId}`) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
  const overlay = document.getElementById('mobile-menu-overlay');
  const toggle = document.querySelector('.mobile-menu-toggle');

  if (overlay) {
    overlay.classList.remove('active');
  }

  if (toggle) {
    toggle.classList.remove('active');
  }

  // Re-enable body scroll
  document.body.style.overflow = '';
}

/**
 * Trigger initial page load animations
 */
function triggerInitialAnimations() {
  // Add initial animation classes to elements
  const animatedElements = document.querySelectorAll(
    '.fade-in-up, .fade-in-down, .fade-in-left, .fade-in-right, .scale-in'
  );

  animatedElements.forEach((element, index) => {
    // Add stagger delay
    element.style.transitionDelay = `${index * 0.1}s`;
  });

  // Trigger hero animations after a short delay
  setTimeout(() => {
    const heroTitle = document.querySelector('.hero-title');
    const heroCta = document.querySelector('.hero-cta');

    if (heroTitle) heroTitle.classList.add('animated');
    if (heroCta) heroCta.classList.add('animated');
  }, 500);
}

/**
 * Trigger section-specific animations
 */
function triggerSectionAnimations(section) {
  const sectionClass = section.className;

  // Skills section - animate progress bars
  if (sectionClass.includes('skills')) {
    const progressBars = section.querySelectorAll('.skill-progress-bar');
    progressBars.forEach((bar, index) => {
      setTimeout(() => {
        bar.classList.add('animated');
      }, index * 200);
    });
  }

  // Experience section - animate timeline items
  if (sectionClass.includes('experience')) {
    const timelineItems = section.querySelectorAll('.experience-item');
    timelineItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('animated');
        const dot = item.querySelector('.timeline-dot');
        if (dot) dot.classList.add('animated');
      }, index * 300);
    });
  }

  // Projects section - stagger card animations
  if (sectionClass.includes('projects')) {
    const projectCards = section.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animated');
      }, index * 150);
    });
  }

  // Contact section - animate contact items
  if (sectionClass.includes('contact')) {
    const contactItems = section.querySelectorAll('.contact-item');
    contactItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('animated');
      }, index * 200);
    });
  }
}

/**
 * Refresh layout after resize
 */
function refreshLayout() {
  // Recalculate any layout-dependent elements
  console.log('🔄 Layout refreshed for device change');
}

/**
 * Handle loading errors
 */
function handleLoadError(error) {
  const loadingScreen = document.getElementById('loading-screen');
  const mainContent = document.getElementById('main-content');

  if (loadingScreen) {
    loadingScreen.innerHTML = `
            <div class="loading-content">
                <h2>⚠️ Loading Error</h2>
                <p>Some components failed to load. Please refresh the page.</p>
                <button onclick="window.location.reload()" style="
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 25px;
                    cursor: pointer;
                    margin-top: 1rem;
                ">Refresh Page</button>
            </div>
        `;
  }
}

/**
 * Utility function to get scroll progress
 */
function getScrollProgress() {
  const winHeight = window.innerHeight;
  const docHeight = document.documentElement.scrollHeight - winHeight;
  const scrollTop = window.pageYOffset;

  return Math.min(scrollTop / docHeight, 1);
}

/**
 * Utility function to check if element is in viewport
 */
function isInViewport(element, offset = 0) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;

  return rect.top <= windowHeight - offset && rect.bottom >= offset;
}

/**
 * Debounce function for performance optimization
 */
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

/**
 * Throttle function for performance optimization
 */
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Export functions for use in other modules
window.App = App;
window.closeMobileMenu = closeMobileMenu;
window.updateActiveNavLink = updateActiveNavLink;
window.isInViewport = isInViewport;
window.getScrollProgress = getScrollProgress;
window.debounce = debounce;
window.throttle = throttle;
