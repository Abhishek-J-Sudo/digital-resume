/**
 * NAVIGATION & MOBILE MENU SYSTEM
 * File: js/navigation.js (~300 lines)
 * Purpose: Mobile menu, smooth scrolling, active nav states, scroll progress
 * Dependencies: css/header.css, css/animations.css
 */

// Navigation state management
const NavigationState = {
  mobileMenuOpen: false,
  activeSection: '',
  scrollPosition: 0,
  isScrolling: false,
  headerHeight: 60,
  sections: [],
};

/**
 * Initialize navigation system when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  initializeNavigation();
});

/**
 * Main navigation initialization
 */
function initializeNavigation() {
  try {
    // Initialize all navigation components
    initializeMobileMenu();
    initializeSmoothScrolling();
    initializeActiveNavigation();
    initializeScrollProgress();
    initializeHeaderEffects();
    initializeKeyboardNavigation();

    console.log('✅ Navigation system initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing navigation:', error);
  }
}

/**
 * Mobile menu functionality
 */
function initializeMobileMenu() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (!mobileMenuToggle || !mobileMenuOverlay) {
    console.warn('⚠️ Mobile menu elements not found');
    return;
  }

  // Toggle mobile menu
  mobileMenuToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMobileMenu();
  });

  // Close mobile menu
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileMenu();
    });
  }

  // Close menu when clicking overlay background
  mobileMenuOverlay.addEventListener('click', (e) => {
    if (e.target === mobileMenuOverlay) {
      closeMobileMenu();
    }
  });

  // Close menu when clicking nav links
  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Close menu on swipe up gesture
  initializeTouchGestures(mobileMenuOverlay);

  console.log('📱 Mobile menu initialized');
}

/**
 * Toggle mobile menu state
 */
function toggleMobileMenu() {
  if (NavigationState.mobileMenuOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

/**
 * Open mobile menu with animations
 */
function openMobileMenu() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

  if (!mobileMenuToggle || !mobileMenuOverlay) return;

  NavigationState.mobileMenuOpen = true;

  // Add active classes
  mobileMenuToggle.classList.add('active');
  mobileMenuOverlay.classList.add('active');

  // Prevent body scroll
  document.body.style.overflow = 'hidden';

  // Animate menu items with stagger effect
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  mobileNavLinks.forEach((link, index) => {
    link.style.opacity = '0';
    link.style.transform = 'translateY(20px)';

    setTimeout(() => {
      link.style.transition = 'all 0.3s ease';
      link.style.opacity = '1';
      link.style.transform = 'translateY(0)';
    }, 200 + index * 50);
  });

  // Update ARIA attributes
  mobileMenuOverlay.setAttribute('aria-hidden', 'false');
  mobileMenuToggle.setAttribute('aria-expanded', 'true');

  // Focus management
  setTimeout(() => {
    const firstNavLink = document.querySelector('.mobile-nav-link');
    if (firstNavLink) firstNavLink.focus();
  }, 300);

  // Track analytics
  trackEvent('mobile_menu_opened');
}

/**
 * Close mobile menu with animations
 */
function closeMobileMenu() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

  if (!mobileMenuToggle || !mobileMenuOverlay) return;

  NavigationState.mobileMenuOpen = false;

  // Remove active classes
  mobileMenuToggle.classList.remove('active');
  mobileMenuOverlay.classList.remove('active');

  // Re-enable body scroll
  document.body.style.overflow = '';

  // Update ARIA attributes
  mobileMenuOverlay.setAttribute('aria-hidden', 'true');
  mobileMenuToggle.setAttribute('aria-expanded', 'false');

  // Reset nav link styles
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  mobileNavLinks.forEach((link) => {
    link.style.transition = '';
    link.style.opacity = '';
    link.style.transform = '';
  });

  // Return focus to toggle button
  mobileMenuToggle.focus();

  // Track analytics
  trackEvent('mobile_menu_closed');
}

/**
 * Initialize touch gestures for mobile menu
 */
function initializeTouchGestures(element) {
  let startY = 0;
  let currentY = 0;
  let isDragging = false;

  element.addEventListener(
    'touchstart',
    (e) => {
      startY = e.touches[0].clientY;
      isDragging = true;
    },
    { passive: true }
  );

  element.addEventListener(
    'touchmove',
    (e) => {
      if (!isDragging) return;

      currentY = e.touches[0].clientY;
      const diffY = startY - currentY;

      // Close menu on upward swipe (threshold: 50px)
      if (diffY > 50) {
        closeMobileMenu();
        isDragging = false;
      }
    },
    { passive: true }
  );

  element.addEventListener(
    'touchend',
    () => {
      isDragging = false;
    },
    { passive: true }
  );
}

/**
 * Smooth scrolling for anchor links
 */
function initializeSmoothScrolling() {
  // Get header height dynamically
  const header = document.querySelector('.header');
  NavigationState.headerHeight = header ? header.offsetHeight : 60;

  // Handle all anchor link clicks
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a[href^="#"]');
    if (!target) return;

    const href = target.getAttribute('href');
    if (href === '#' || href === '#top') {
      e.preventDefault();
      scrollToTop();
      return;
    }

    const targetId = href.substring(1);
    const targetElement =
      document.getElementById(targetId) || document.querySelector(`[data-section="${targetId}"]`);

    if (targetElement) {
      e.preventDefault();
      scrollToElement(targetElement, targetId);
    }
  });

  console.log('🔗 Smooth scrolling initialized');
}

/**
 * Scroll to specific element with offset
 */
function scrollToElement(element, sectionId) {
  const targetPosition =
    element.getBoundingClientRect().top + window.pageYOffset - NavigationState.headerHeight - 20;

  // Smooth scroll
  window.scrollTo({
    top: Math.max(0, targetPosition),
    behavior: 'smooth',
  });

  // Update active nav state
  updateActiveNavigation(sectionId);

  // Close mobile menu if open
  if (NavigationState.mobileMenuOpen) {
    closeMobileMenu();
  }

  // Track analytics
  trackEvent('section_navigated', { section: sectionId });
}

/**
 * Scroll to top of page
 */
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });

  updateActiveNavigation('');

  if (NavigationState.mobileMenuOpen) {
    closeMobileMenu();
  }

  trackEvent('scroll_to_top');
}

/**
 * Initialize active navigation state management
 */
function initializeActiveNavigation() {
  // Find all sections with IDs or data-section attributes
  NavigationState.sections = Array.from(document.querySelectorAll('[id], [data-section]'))
    .map((el) => ({
      id: el.id || el.dataset.section,
      element: el,
      offset: 0,
    }))
    .filter(
      (section) => section.id && section.id !== 'loading-screen' && section.id !== 'main-content'
    );

  // Update section offsets
  updateSectionOffsets();

  // Initialize scroll listener with throttling
  let scrollTimeout;
  window.addEventListener(
    'scroll',
    () => {
      if (scrollTimeout) return;

      scrollTimeout = setTimeout(() => {
        updateActiveNavOnScroll();
        scrollTimeout = null;
      }, 16); // ~60fps
    },
    { passive: true }
  );

  // Update offsets on resize
  window.addEventListener('resize', debounce(updateSectionOffsets, 250));

  console.log(`🎯 Active navigation initialized with ${NavigationState.sections.length} sections`);
}

/**
 * Update section offsets for accurate navigation
 */
function updateSectionOffsets() {
  NavigationState.sections.forEach((section) => {
    if (section.element) {
      section.offset = section.element.offsetTop;
    }
  });
}

/**
 * Update active navigation based on scroll position
 */
function updateActiveNavOnScroll() {
  const scrollPosition = window.pageYOffset + NavigationState.headerHeight + 100;
  let activeSection = '';

  // Find the current section
  for (let i = NavigationState.sections.length - 1; i >= 0; i--) {
    const section = NavigationState.sections[i];
    if (section.offset <= scrollPosition) {
      activeSection = section.id;
      break;
    }
  }

  // Update if section changed
  if (activeSection !== NavigationState.activeSection) {
    updateActiveNavigation(activeSection);
  }
}

/**
 * Update active navigation visual state
 */
function updateActiveNavigation(sectionId) {
  NavigationState.activeSection = sectionId;

  // Update desktop navigation
  const desktopNavLinks = document.querySelectorAll('.nav-link');
  desktopNavLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === `#${sectionId}`) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Update mobile navigation
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  mobileNavLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === `#${sectionId}`) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Initialize scroll progress indicator
 */
function initializeScrollProgress() {
  const progressBar = document.querySelector('.scroll-progress-bar');
  if (!progressBar) return;

  let progressTimeout;

  const updateScrollProgress = () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    progressBar.style.width = Math.min(100, Math.max(0, scrollPercent)) + '%';
  };

  // Throttled scroll listener
  window.addEventListener(
    'scroll',
    () => {
      if (progressTimeout) return;

      progressTimeout = setTimeout(() => {
        updateScrollProgress();
        progressTimeout = null;
      }, 16); // ~60fps
    },
    { passive: true }
  );

  // Initial call
  updateScrollProgress();

  console.log('📊 Scroll progress initialized');
}

/**
 * Initialize header scroll effects
 */
function initializeHeaderEffects() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScrollTop = 0;
  let scrollTimeout;

  const handleHeaderScroll = () => {
    const scrollTop = window.pageYOffset;

    // Add/remove scrolled class
    if (scrollTop > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Hide/show header based on scroll direction (optional)
    if (Math.abs(lastScrollTop - scrollTop) <= 5) return;

    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down - hide header
      header.classList.add('header-hidden');
      header.classList.remove('header-visible');
    } else {
      // Scrolling up - show header
      header.classList.remove('header-hidden');
      header.classList.add('header-visible');
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  };

  // Throttled scroll listener
  window.addEventListener(
    'scroll',
    () => {
      if (scrollTimeout) return;

      scrollTimeout = setTimeout(() => {
        handleHeaderScroll();
        scrollTimeout = null;
      }, 16);
    },
    { passive: true }
  );

  console.log('🎬 Header scroll effects initialized');
}

/**
 * Initialize keyboard navigation
 */
function initializeKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    // Escape key - close mobile menu
    if (e.key === 'Escape') {
      if (NavigationState.mobileMenuOpen) {
        closeMobileMenu();
      }
    }

    // Arrow key navigation in mobile menu
    if (NavigationState.mobileMenuOpen && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault();
      navigateMobileMenu(e.key === 'ArrowDown');
    }

    // Enter/Space on focusable elements
    if (
      (e.key === 'Enter' || e.key === ' ') &&
      e.target.matches('.mobile-menu-toggle, .nav-link, .mobile-nav-link')
    ) {
      e.preventDefault();
      e.target.click();
    }
  });

  // Add keyboard navigation indicator
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });

  console.log('⌨️ Keyboard navigation initialized');
}

/**
 * Navigate mobile menu with arrow keys
 */
function navigateMobileMenu(down) {
  const menuItems = document.querySelectorAll('.mobile-nav-link');
  const currentIndex = Array.from(menuItems).findIndex((item) => item === document.activeElement);

  let nextIndex;
  if (currentIndex === -1) {
    nextIndex = down ? 0 : menuItems.length - 1;
  } else {
    nextIndex = down
      ? (currentIndex + 1) % menuItems.length
      : (currentIndex - 1 + menuItems.length) % menuItems.length;
  }

  if (menuItems[nextIndex]) {
    menuItems[nextIndex].focus();
  }
}

/**
 * Utility function - debounce
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
 * Analytics tracking (placeholder)
 */
function trackEvent(eventName, properties = {}) {
  // Placeholder for analytics tracking
  console.log(`📊 Event: ${eventName}`, properties);

  // Example: Google Analytics 4
  // if (typeof gtag !== 'undefined') {
  //   gtag('event', eventName, properties);
  // }

  // Example: Custom analytics
  // if (window.analytics) {
  //   window.analytics.track(eventName, properties);
  // }
}

/**
 * Public API - Export functions for external use
 */
window.Navigation = {
  toggleMobileMenu,
  closeMobileMenu,
  scrollToElement: (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      scrollToElement(element, elementId);
    }
  },
  scrollToTop,
  updateActiveNavigation,
  state: NavigationState,
};

/**
 * Initialize on page load if DOM is already ready
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeNavigation);
} else {
  initializeNavigation();
}
