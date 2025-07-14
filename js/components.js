/**
 * COMPONENT LOADING SYSTEM
 * File: js/components.js (~400 lines)
 * Purpose: Load HTML components dynamically, handle errors, manage app state
 * Dependencies: None (loads first)
 */

// Global application state
window.App = {
  isLoaded: false,
  isMobile: false,
  scrollPosition: 0,
  components: new Map(),
  observers: {
    intersection: null,
    scroll: null,
  },
  config: {
    showHobbies: true,
    showPhoto: true,
    companyTheme: '',
  },

  carouselInitialized: false,
  coreInitialized: false,
};

/**
 * Component paths configuration
 */
const COMPONENT_PATHS = {
  hero: 'components/hero.html',
  about: 'components/about.html',
  skills: 'components/skills.html',
  experience: 'components/experience.html',
  projects: 'components/projects.html',
  hobbies: 'components/hobbies.html',
  contact: 'components/contact.html',
};

/**
 * Initialize the application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('🚀 Starting resume website initialization...');

    // Show loading screen
    showLoadingScreen();

    // Detect mobile device
    detectMobile();

    // Load user preferences
    loadUserPreferences();

    // Load all components
    await loadAllComponents();

    // Initialize core functionality
    initializeApp();

    // Hide loading screen and show content
    hideLoadingScreen();

    // Mark app as loaded
    window.App.isLoaded = true;

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
  window.App.isMobile =
    window.innerWidth <= 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  document.body.classList.toggle('mobile', window.App.isMobile);

  console.log(`📱 Device detected: ${window.App.isMobile ? 'Mobile' : 'Desktop'}`);
}

/**
 * Load user preferences from localStorage
 */
function loadUserPreferences() {
  try {
    // Load theme preferences (already handled in index.html)
    const savedTheme = localStorage.getItem('theme');
    const companyTheme = localStorage.getItem('company-theme');

    // Load content preferences
    const showHobbies = localStorage.getItem('show-hobbies');
    const showPhoto = localStorage.getItem('show-photo');

    // Apply preferences
    window.App.config.showHobbies = showHobbies !== 'false'; // Default true
    window.App.config.showPhoto = showPhoto !== 'false'; // Default true
    window.App.config.companyTheme = companyTheme || '';

    // Apply CSS custom properties
    document.documentElement.style.setProperty(
      '--show-hobbies',
      window.App.config.showHobbies ? 'block' : 'none'
    );
    document.documentElement.style.setProperty(
      '--show-photo',
      window.App.config.showPhoto ? 'block' : 'none'
    );

    console.log('⚙️ User preferences loaded:', window.App.config);
  } catch (error) {
    console.warn('⚠️ Error loading user preferences:', error);
  }
}

/**
 * Show loading screen
 */
function showLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.classList.remove('hidden');
    loadingScreen.style.opacity = '1';
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
      }, 300);
    }, 800); // Show loading for at least 800ms for smooth UX
  }
}

/**
 * Load a single component
 */
async function loadComponent(name, path, containerId) {
  try {
    console.log(`📦 Loading component: ${name}`);

    const response = await fetch(path);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const container = document.getElementById(containerId);

    if (!container) {
      throw new Error(`Container ${containerId} not found in DOM`);
    }

    // Insert the HTML content
    container.innerHTML = html;

    // Store component reference
    window.App.components.set(name, {
      container: container,
      loaded: true,
      error: null,
    });

    console.log(`✅ Component loaded: ${name}`);
    return true;
  } catch (error) {
    console.error(`❌ Error loading ${name}:`, error);

    // Store error reference
    window.App.components.set(name, {
      container: document.getElementById(containerId),
      loaded: false,
      error: error.message,
    });

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
    about: `
      <section class="section about-section" id="about" data-section="about">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">About Me</h2>
            <p class="section-subtitle">Passionate marketing operations professional with a drive for growth and innovation</p>
          </div>
          <div class="about-grid">
            <div class="about-text">
              <p><strong>Hi there! I'm Alex Johnson</strong>, a results-driven Marketing Operations Lead with over 5 years of experience transforming marketing strategies through data-driven insights, automation, and cross-functional collaboration.</p>
              <p>I specialize in building scalable marketing systems that drive measurable growth. When I'm not optimizing conversion funnels, you'll find me exploring new marketing technologies or collaborating with sales and product teams.</p>
            </div>
          </div>
        </div>
      </section>
    `,
    skills: `
      <section class="section skills-section" id="skills" data-section="skills">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Skills & Expertise</h2>
            <p class="section-subtitle">A comprehensive toolkit built through years of hands-on experience</p>
          </div>
          <div class="skills-grid">
            <div class="skill-category">
              <div class="skill-icon">⚙️</div>
              <h3 class="skill-category-title">Technical Skills</h3>
              <p class="skill-category-description">Modern marketing technology stack and data analysis tools</p>
            </div>
          </div>
        </div>
      </section>
    `,
    experience: `
      <section class="section experience-section" id="experience" data-section="experience">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Professional Experience</h2>
            <p class="section-subtitle">My journey in marketing operations and growth strategy</p>
          </div>
          <div class="experience-timeline">
            <div class="timeline-line"></div>
            <div class="experience-item">
              <div class="timeline-dot"></div>
              <div class="company-header">
                <h3 class="company-name">Current Company</h3>
                <p class="job-title">Marketing Operations Lead</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    `,
    projects: `
      <section class="section projects-section" id="projects" data-section="projects">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Featured Projects</h2>
            <p class="section-subtitle">Key initiatives that drove measurable business impact</p>
          </div>
          <div class="projects-grid">
            <div class="project-card">
              <div class="project-content">
                <h3 class="project-title">Marketing Automation Platform</h3>
                <p class="project-description">Implemented comprehensive automation system that increased lead conversion by 40%.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    `,
    hobbies: `
      <section class="section hobbies-section" id="hobbies" data-section="hobbies">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Hobbies & Interests</h2>
            <p class="section-subtitle">What I enjoy outside of work</p>
          </div>
          <div class="hobbies-grid">
            <div class="hobby-item">
              <div class="hobby-icon">📸</div>
              <div class="hobby-name">Photography</div>
            </div>
          </div>
        </div>
      </section>
    `,
    contact: `
      <section class="section contact-section" id="contact" data-section="contact">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Let's Connect</h2>
            <p class="section-subtitle">Ready to discuss your next marketing operations challenge?</p>
          </div>
          <div class="contact-info">
            <a href="mailto:alex@example.com" class="contact-item">
              <div class="contact-icon">📧</div>
              <div class="contact-label">Email</div>
              <div class="contact-value">alex@example.com</div>
            </a>
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
        <h2>Section Loading Error</h2>
        <p>Unable to load ${name} section. Please refresh the page.</p>
      </div>
    </section>
  `;

  console.log(`🔄 Fallback content loaded for: ${name}`);
}

/**
 * Load all components asynchronously
 */
async function loadAllComponents() {
  const startTime = performance.now();

  // Create loading promises for all components
  const loadPromises = Object.entries(COMPONENT_PATHS).map(([name, path]) => {
    const containerId = `${name}-container`;
    return loadComponent(name, path, containerId);
  });

  // Wait for all components to load (or fail)
  const results = await Promise.allSettled(loadPromises);

  await loadCarouselIfNeeded();

  // Calculate loading stats
  const successCount = results.filter(
    (result) => result.status === 'fulfilled' && result.value === true
  ).length;
  const totalComponents = results.length;
  const loadTime = Math.round(performance.now() - startTime);

  console.log(
    `📊 Component loading complete: ${successCount}/${totalComponents} successful in ${loadTime}ms`
  );

  if (successCount < totalComponents) {
    console.warn(`⚠️ ${totalComponents - successCount} components failed to load`);
  }

  setTimeout(() => {
    if (typeof initializeNavigation === 'function') {
      initializeNavigation();
    } else {
      console.error('❌ initializeNavigation function not found');
    }
  }, 100);

  return { successCount, totalComponents, loadTime };
}

/**
 * Initialize core application functionality
 */
function initializeApp() {
  // PREVENT MULTIPLE INITIALIZATIONS
  if (window.App.coreInitialized) {
    console.log('⚠️ Core functionality already initialized, skipping...');
    return;
  }

  console.log('🔧 Initializing core functionality...');
  window.App.coreInitialized = true; // Set flag immediately

  // Initialize theme system if available
  if (typeof initializeThemeSystem === 'function') {
    initializeThemeSystem();
  }

  // Initialize intersection observer for animations
  initializeIntersectionObserver();

  // Initialize resize handling
  initializeResizeHandling();

  // Initialize keyboard navigation support
  initializeKeyboardNavigation();

  // Initialize error handling
  initializeErrorHandling();

  setTimeout(() => {
    console.log('🔗 Initializing navigation after components loaded...');
    if (typeof initializeNavigation === 'function') {
      initializeNavigation();
    }
  }, 2000);

  // Initialize carousel ONLY ONCE
  setTimeout(() => {
    if (window.App.carouselInitialized) {
      console.log('⚠️ Carousel already initialized, skipping...');
      return;
    }

    console.log('📸 Initializing carousel after components loaded...');

    // Check if hobbies section and carousel elements exist
    const hobbiesSection = document.querySelector('.hobbies-section');
    const photoGallery = document.querySelector('.photo-gallery');

    if (hobbiesSection && photoGallery) {
      console.log('📸 Hobbies section found, initializing carousel...');
      window.App.carouselInitialized = true; // Set flag before initializing

      // Check if carousel script is loaded
      if (window.PhotoCarousel && typeof window.PhotoCarousel.initialize === 'function') {
        window.PhotoCarousel.initialize();
      } else {
        console.warn('⚠️ PhotoCarousel script not loaded yet, retrying...');
        // Retry after carousel script loads
        setTimeout(() => {
          if (window.PhotoCarousel && typeof window.PhotoCarousel.initialize === 'function') {
            window.PhotoCarousel.initialize();
          } else {
            console.error('❌ PhotoCarousel failed to load');
            window.App.carouselInitialized = false; // Reset flag on failure
          }
        }, 1000);
      }
    } else {
      console.log('📸 No hobbies section found, skipping carousel initialization');
    }

    // Also initialize interactions after components load
    if (typeof initializeAllInteractions === 'function') {
      console.log('🎯 Initializing interactions...');
      initializeAllInteractions();
    }
  }, 2500);

  console.log('✅ Core functionality initialized');
}

/**
 * Initialize intersection observer for scroll animations
 */
function initializeIntersectionObserver() {
  const options = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.1,
  };

  window.App.observers.intersection = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Add animation class
        entry.target.classList.add('animated');

        // Update active navigation if navigation system is loaded
        const sectionId = entry.target.id || entry.target.dataset.section;
        if (sectionId && typeof updateActiveNavigation === 'function') {
          updateActiveNavigation(sectionId);
        }
      }
    });
  }, options);

  // Observe all sections
  const sections = document.querySelectorAll('section, [data-section]');
  sections.forEach((section) => {
    window.App.observers.intersection.observe(section);
  });

  console.log(`👁️ Intersection Observer initialized for ${sections.length} sections`);
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
      const wasMobile = window.App.isMobile;
      detectMobile();

      // Refresh layout if device type changed
      if (wasMobile !== window.App.isMobile) {
        console.log('📱 Device type changed, refreshing layout');

        // Close mobile menu if now desktop
        if (!window.App.isMobile && typeof closeMobileMenu === 'function') {
          closeMobileMenu();
        }
      }
    }, 250);
  });
}

/**
 * Initialize keyboard navigation
 */
function initializeKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    // Escape key handling
    if (e.key === 'Escape') {
      // Close mobile menu if open
      if (typeof closeMobileMenu === 'function') {
        closeMobileMenu();
      }
    }

    // Tab navigation indicator
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
    console.error('🚨 Global error:', e.error);
    // Could send to analytics or error reporting service
  });

  window.addEventListener('unhandledrejection', (e) => {
    console.error('🚨 Unhandled promise rejection:', e.reason);
    // Could send to analytics or error reporting service
  });
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

  // Trigger hero animations if hero exists
  setTimeout(() => {
    const heroTitle = document.querySelector('.hero-title');
    const heroActions = document.querySelector('.hero-actions');

    if (heroTitle) heroTitle.classList.add('animated');
    if (heroActions) heroActions.classList.add('animated');
  }, 500);

  console.log('🎬 Initial animations triggered');
}

/**
 * Handle loading errors
 */
function handleLoadError(error) {
  const loadingScreen = document.getElementById('loading-screen');
  const mainContent = document.getElementById('main-content');

  if (loadingScreen) {
    loadingScreen.innerHTML = `
      <div class="loading-content" style="text-align: center; padding: 2rem;">
        <h2 style="color: var(--color-error); margin-bottom: 1rem;">⚠️ Loading Error</h2>
        <p style="margin-bottom: 2rem; color: var(--color-text-secondary);">
          Some components failed to load. Please check your connection and try again.
        </p>
        <button onclick="window.location.reload()" style="
          background: var(--brand-primary);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 25px;
          cursor: pointer;
          font-size: 1rem;
          transition: background 0.3s ease;
        " onmouseover="this.style.background='var(--brand-secondary)'" 
           onmouseout="this.style.background='var(--brand-primary)'">
          Refresh Page
        </button>
      </div>
    `;
  }

  console.error('💥 Application failed to load:', error);
}

/**
 * CAROUSEL INTEGRATION: Load carousel module if photo gallery exists
 */
async function loadCarouselIfNeeded() {
  try {
    // Check if hobbies section is enabled and has photo gallery
    const hobbiesEnabled = window.App.config.showHobbies;
    const photoGallery = document.querySelector('.photo-gallery');

    if (!hobbiesEnabled || !photoGallery) {
      console.log('📸 Photo gallery not found, skipping carousel');
      return;
    }

    console.log('📸 Photo gallery detected, loading carousel module...');
    await loadCarouselModule();
  } catch (error) {
    console.warn('⚠️ Error checking for carousel:', error);
  }
}

/**
 * CAROUSEL INTEGRATION: Dynamically load carousel JavaScript
 */
async function loadCarouselModule() {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.PhotoCarousel) {
      console.log('📸 Carousel already loaded');
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'js/hobbies-carousel.js';
    script.async = true;

    script.onload = () => {
      console.log('✅ Carousel module loaded successfully');

      // Store carousel reference in App components
      window.App.components.set('carousel', {
        loaded: true,
        error: null,
        module: window.PhotoCarousel,
      });

      resolve();
    };

    script.onerror = () => {
      console.warn('⚠️ Failed to load carousel module');

      // Store error in App components
      window.App.components.set('carousel', {
        loaded: false,
        error: 'Failed to load carousel script',
      });

      // Show fallback instead of rejecting
      showCarouselFallback();
      resolve(); // Resolve anyway to not break the app
    };

    document.head.appendChild(script);
  });
}

/**
 * CAROUSEL INTEGRATION: Show fallback if carousel fails to load
 */
function showCarouselFallback() {
  const gallery = document.querySelector('.photo-gallery');
  if (!gallery) return;

  gallery.innerHTML = `
    <div class="carousel-fallback" style="
      text-align: center;
      padding: var(--space-2xl);
      background: var(--color-surface);
      border-radius: var(--radius-xl);
      border: 1px solid rgba(0, 0, 0, var(--theme-border-opacity));
    ">
      <div class="fallback-icon" style="font-size: 3rem; margin-bottom: 1rem;">📸</div>
      <h3 style="margin-bottom: 1rem; color: var(--color-text);">Photo Gallery</h3>
      <p style="margin-bottom: 2rem; color: var(--color-text-secondary);">
        Photos will be displayed here when configured.
      </p>
      <a href="https://instagram.com/yourusername" 
         target="_blank" 
         rel="noopener noreferrer" 
         class="btn btn-secondary">
        View on Instagram
      </a>
    </div>
  `;

  console.log('🔄 Carousel fallback content displayed');
}

/**
 * Utility functions for external access
 */
window.App.utils = {
  reloadComponent: async (componentName) => {
    const path = COMPONENT_PATHS[componentName];
    const containerId = `${componentName}-container`;

    if (path && containerId) {
      return await loadComponent(componentName, path, containerId);
    }
    return false;
  },

  getComponentStatus: (componentName) => {
    return window.App.components.get(componentName) || null;
  },

  getAllComponentsStatus: () => {
    const status = {};
    window.App.components.forEach((value, key) => {
      status[key] = value;
    });
    return status;
  },

  // CAROUSEL INTEGRATION: New utility functions
  refreshCarousel: () => {
    if (window.PhotoCarousel && window.PhotoCarousel.refresh) {
      window.PhotoCarousel.refresh();
      console.log('🔄 Carousel refreshed');
    }
  },

  getCarouselStatus: () => {
    return window.App.components.get('carousel') || null;
  },
};

// Export for external use
window.initializeApp = initializeApp;
window.loadComponent = loadComponent;
window.triggerInitialAnimations = triggerInitialAnimations;

console.log('📦 Component loading system ready');
