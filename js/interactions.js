/**
 * USER INTERACTIONS SYSTEM
 * File: js/interactions.js (~300 lines)
 * Purpose: Handle essential user interactions for resume website
 * Dependencies: js/utils.js, js/components.js, js/navigation.js
 */

// Global interaction state
const InteractionState = {
  expandedItems: new Set(),
  touchStartY: 0,
  touchStartX: 0,
};

/**
 * Initialize all interactions when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  // Wait for app and utils to be ready
  const initWhenReady = () => {
    if (window.App && window.App.isLoaded && window.Utils) {
      initializeAllInteractions();
    } else {
      setTimeout(initWhenReady, 50);
    }
  };
  initWhenReady();
});

/**
 * Main initialization function
 */
function initializeAllInteractions() {
  try {
    console.log('🎯 Initializing user interactions...');

    // Core interactions
    initializeExpandCollapse();
    initializeTouchInteractions();
    initializeKeyboardShortcuts();

    // UI enhancements
    initializeButtonEffects();
    initializeCopyToClipboard();
    initializeScrollEffects();

    // External links only (theme handled by theme.js)
    initializeExternalLinks();

    console.log('✅ All user interactions initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing interactions:', error);
  }
}

/* ===================================
   EXPAND/COLLAPSE INTERACTIONS
   =================================== */

/**
 * Initialize expand/collapse functionality for experience items
 */
function initializeExpandCollapse() {
  console.log('📖 Initializing expand/collapse interactions...');

  const expandButtons = document.querySelectorAll('.expand-btn, [data-expand-target]');

  expandButtons.forEach((button, index) => {
    // Add unique ID if not present
    if (!button.id) {
      button.id = `expand-btn-${index}`;
    }

    // Set up click handler with debouncing
    const debouncedToggle = Utils.performance.debounce(() => toggleExpandableItem(button), 200);

    button.addEventListener('click', (e) => {
      e.preventDefault();
      debouncedToggle();
    });

    // Keyboard support
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleExpandableItem(button);
      }
    });

    // Set initial ARIA attributes
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('role', 'button');
    button.setAttribute('tabindex', '0');
  });

  console.log(`📖 Initialized ${expandButtons.length} expand/collapse controls`);
}

/**
 * Toggle expandable item (experience, project details, etc.)
 */
function toggleExpandableItem(button) {
  const experienceItem = button.closest('.experience-item') || button.closest('[data-expandable]');
  if (!experienceItem) {
    console.warn('⚠️ No expandable container found for button:', button);
    return;
  }

  // Get unique identifier
  const itemId =
    experienceItem.querySelector('.company-name, .project-title')?.textContent?.trim() ||
    `item-${Date.now()}`;

  const isExpanded = InteractionState.expandedItems.has(itemId);
  const hiddenContent = experienceItem.querySelector(
    '.responsibilities-hidden, .details-hidden, [data-expandable-content]'
  );

  if (!hiddenContent) {
    console.warn('⚠️ No expandable content found in:', experienceItem);
    return;
  }

  if (isExpanded) {
    collapseItem(experienceItem, hiddenContent, button, itemId);
  } else {
    expandItem(experienceItem, hiddenContent, button, itemId);
  }

  // Track interaction
  Utils.analytics.trackEvent('expand_collapse_toggled', {
    itemId,
    action: isExpanded ? 'collapse' : 'expand',
    section: experienceItem.closest('section')?.id || 'unknown',
  });
}

/**
 * Expand an item with smooth animation
 */
function expandItem(container, content, button, itemId) {
  InteractionState.expandedItems.add(itemId);

  // Update button state
  updateExpandButton(button, true);

  // Show content with animation
  content.style.display = 'block';
  content.style.opacity = '0';
  content.style.maxHeight = '0px';
  content.style.overflow = 'hidden';
  content.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';

  // Force reflow
  content.offsetHeight;

  // Animate to full height
  const fullHeight = content.scrollHeight;
  content.style.maxHeight = fullHeight + 'px';
  content.style.opacity = '1';

  // Clean up after animation
  setTimeout(() => {
    content.style.maxHeight = '';
    content.style.overflow = '';
    content.setAttribute('aria-hidden', 'false');
  }, 400);

  // Add expanded class to container
  container.classList.add('expanded');
}

/**
 * Collapse an item with smooth animation
 */
function collapseItem(container, content, button, itemId) {
  InteractionState.expandedItems.delete(itemId);

  // Update button state
  updateExpandButton(button, false);

  // Animate to collapsed state
  const currentHeight = content.scrollHeight;
  content.style.maxHeight = currentHeight + 'px';
  content.style.overflow = 'hidden';
  content.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';

  // Force reflow
  content.offsetHeight;

  // Animate to zero height
  content.style.maxHeight = '0px';
  content.style.opacity = '0';

  // Hide after animation
  setTimeout(() => {
    content.style.display = 'none';
    content.style.maxHeight = '';
    content.style.overflow = '';
    content.style.transition = '';
    content.setAttribute('aria-hidden', 'true');
  }, 400);

  // Remove expanded class from container
  container.classList.remove('expanded');
}

/**
 * Update expand button appearance and accessibility
 */
function updateExpandButton(button, isExpanded) {
  // Update ARIA state
  button.setAttribute('aria-expanded', isExpanded.toString());

  // Update button text and icon
  const buttonText = isExpanded ? 'Show Less' : 'Show More';
  const iconDirection = isExpanded ? 'up' : 'down';

  button.innerHTML = `
    <span>${buttonText}</span>
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
      <path d="${iconDirection === 'up' ? 'M6 3L2 7h8L6 3z' : 'M6 9L2 5h8L6 9z'}"/>
    </svg>
  `;

  // Update aria-label
  button.setAttribute('aria-label', `${buttonText} details`);
}

/* ===================================
   TOUCH INTERACTIONS
   =================================== */

function initializeTouchInteractions() {
  if (!Utils.device.isMobile()) {
    console.log('📱 Skipping touch interactions on desktop');
    return;
  }

  console.log('📱 Initializing touch interactions...');

  // Add touch feedback to interactive elements
  const touchElements = document.querySelectorAll(
    'button, .btn, a, .card, .nav-link, .mobile-nav-link, .skill-category, .project-card, .contact-item'
  );

  touchElements.forEach((element) => {
    element.addEventListener(
      'touchstart',
      () => {
        element.classList.add('touch-active');
      },
      { passive: true }
    );

    element.addEventListener(
      'touchend',
      () => {
        setTimeout(() => {
          element.classList.remove('touch-active');
        }, 150);
      },
      { passive: true }
    );

    element.addEventListener(
      'touchcancel',
      () => {
        element.classList.remove('touch-active');
      },
      { passive: true }
    );
  });

  // Initialize swipe gestures for mobile menu
  initializeSwipeGestures();

  // Initialize tap-to-expand for project cards on mobile
  initializeProjectCardInteractions();

  console.log('📱 Touch interactions initialized');
}

/**
 * Initialize swipe gestures (primarily for closing mobile menu)
 */
function initializeSwipeGestures() {
  let startX, startY;

  document.addEventListener(
    'touchstart',
    (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    },
    { passive: true }
  );

  document.addEventListener(
    'touchend',
    (e) => {
      if (!startX || !startY) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;

      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // Minimum swipe distance
      if (absDeltaX < 50 && absDeltaY < 50) return;

      // Close mobile menu on left swipe or upward swipe
      if ((absDeltaX > absDeltaY && deltaX < 0) || (absDeltaY > absDeltaX && deltaY < 0)) {
        if (window.Navigation && window.Navigation.state.mobileMenuOpen) {
          window.Navigation.closeMobileMenu();
        }
      }

      // Reset values
      startX = startY = null;
    },
    { passive: true }
  );
}

/**
 * Initialize project card interactions (tap to expand on mobile)
 */
function initializeProjectCardInteractions() {
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach((card) => {
    // Check if card has expandable content
    const expandableContent = card.querySelector('.project-details-hidden, [data-project-details]');
    if (!expandableContent) return;

    // Add tap handler for mobile
    if (Utils.device.isMobile()) {
      card.addEventListener('click', (e) => {
        // Don't expand if clicking on a link
        if (e.target.closest('a')) return;

        e.preventDefault();
        toggleProjectCard(card, expandableContent);
      });

      // Add visual indicator that card is tappable
      card.style.cursor = 'pointer';
      card.setAttribute('aria-expanded', 'false');
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
    }
  });
}

/**
 * Toggle project card expanded state
 */
function toggleProjectCard(card, content) {
  const isExpanded = card.getAttribute('aria-expanded') === 'true';

  if (isExpanded) {
    // Collapse
    content.style.maxHeight = '0';
    content.style.opacity = '0';
    card.setAttribute('aria-expanded', 'false');

    setTimeout(() => {
      content.style.display = 'none';
    }, 300);
  } else {
    // Expand
    content.style.display = 'block';
    content.style.maxHeight = content.scrollHeight + 'px';
    content.style.opacity = '1';
    card.setAttribute('aria-expanded', 'true');
  }

  // Track interaction
  Utils.analytics.trackEvent('project_card_toggled', {
    action: isExpanded ? 'collapse' : 'expand',
    projectTitle: card.querySelector('.project-title')?.textContent?.trim() || 'unknown',
  });
}

/* ===================================
   BUTTON EFFECTS & INTERACTIONS
   =================================== */

function initializeButtonEffects() {
  console.log('🔘 Initializing button effects...');

  const rippleButtons = document.querySelectorAll('.btn, .hero-cta, .expand-btn, button');

  rippleButtons.forEach((button) => {
    button.addEventListener('click', createRippleEffect);
  });

  // Initialize hover effects for cards and interactive elements
  initializeHoverEffects();

  console.log('🔘 Button effects initialized');
}

/**
 * Initialize hover effects for cards and interactive elements
 */
function initializeHoverEffects() {
  // Project cards - lift + shadow on hover
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px)';
      card.style.boxShadow = 'var(--shadow-xl)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = '';
    });
  });

  // Skill bars - pulse animation on hover
  const skillItems = document.querySelectorAll('.skill-item');
  skillItems.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      const progressBar = item.querySelector('.skill-progress-bar');
      if (progressBar) {
        progressBar.style.animation = 'pulse 0.6s ease-in-out';
        progressBar.style.boxShadow = '0 0 10px var(--brand-primary)';
      }
    });

    item.addEventListener('mouseleave', () => {
      const progressBar = item.querySelector('.skill-progress-bar');
      if (progressBar) {
        progressBar.style.animation = '';
        progressBar.style.boxShadow = '';
      }
    });
  });

  // General card hover effects
  const cards = document.querySelectorAll('.card, .skill-category, .contact-item');
  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-4px)';
      card.style.boxShadow = 'var(--shadow-lg)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = '';
    });
  });

  console.log('✨ Hover effects initialized');
}

function createRippleEffect(e) {
  const button = e.currentTarget;
  const ripple = document.createElement('div');
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;

  ripple.style.cssText = `
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
  `;

  // Ensure button has relative positioning for ripple
  if (getComputedStyle(button).position === 'static') {
    button.style.position = 'relative';
  }

  button.appendChild(ripple);

  // Clean up after animation
  setTimeout(() => {
    if (ripple.parentElement) {
      ripple.remove();
    }
  }, 600);
}

/* ===================================
   THEME INTERACTIONS
   =================================== */

function initializeThemeInteractions() {
  console.log('🎨 Initializing theme interactions...');

  const themeSwitchers = document.querySelectorAll('.theme-switcher, .mobile-theme-toggle');

  themeSwitchers.forEach((switcher) => {
    const clickHandler = Utils.performance.debounce(() => {
      toggleTheme();
    }, 200);

    switcher.addEventListener('click', clickHandler);

    // Keyboard support
    switcher.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleTheme();
      }
    });
  });

  console.log('🎨 Theme interactions initialized');
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);

  // Update mobile theme toggle visual state
  updateMobileThemeToggle(newTheme);

  Utils.analytics.trackEvent('theme_changed', { theme: newTheme });
}

function updateMobileThemeToggle(theme) {
  const themeText = document.querySelector('.theme-text');
  const themeSlider = document.querySelector('.theme-toggle-slider');

  if (themeText) {
    themeText.textContent = theme === 'dark' ? 'Dark Mode' : 'Light Mode';
  }

  if (themeSlider) {
    themeSlider.style.transform = theme === 'dark' ? 'translateX(24px)' : 'translateX(0)';
  }
}

/* ===================================
   COPY TO CLIPBOARD
   =================================== */

function initializeCopyToClipboard() {
  console.log('📋 Initializing copy to clipboard...');

  const copyButtons = document.querySelectorAll('[data-copy]');

  copyButtons.forEach((button) => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();

      const textToCopy = button.dataset.copy || button.textContent.trim();

      try {
        await navigator.clipboard.writeText(textToCopy);
        showCopyFeedback(button, 'Copied!');
        Utils.analytics.trackEvent('text_copied', { source: button.className });
      } catch (error) {
        // Fallback for older browsers
        fallbackCopyToClipboard(textToCopy);
        showCopyFeedback(button, 'Copied!');
      }
    });
  });

  console.log(`📋 Initialized ${copyButtons.length} copy buttons`);
}

function fallbackCopyToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Fallback copy failed:', err);
  }

  document.body.removeChild(textArea);
}

function showCopyFeedback(button, message) {
  const originalText = button.textContent;

  button.textContent = message;
  button.style.background = 'var(--color-success)';

  setTimeout(() => {
    button.textContent = originalText;
    button.style.background = '';
  }, 2000);
}

/* ===================================
   EXTERNAL LINKS
   =================================== */

function initializeExternalLinks() {
  console.log('🔗 Initializing external link handling...');

  const externalLinks = document.querySelectorAll('a[href^="http"]');

  externalLinks.forEach((link) => {
    // Skip if it's an internal link
    if (link.hostname === window.location.hostname) return;

    // Add external link attributes
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');

    // Add external link indicator if not present
    if (!link.querySelector('.external-icon')) {
      const icon = document.createElement('span');
      icon.className = 'external-icon';
      icon.innerHTML = '↗';
      icon.setAttribute('aria-hidden', 'true');
      icon.style.marginLeft = '0.25rem';
      link.appendChild(icon);
    }

    // Track external link clicks
    link.addEventListener('click', () => {
      Utils.analytics.trackEvent('external_link_clicked', {
        url: link.href,
        text: link.textContent.trim(),
        section: link.closest('section')?.id || 'unknown',
      });
    });
  });

  console.log(`🔗 Processed ${externalLinks.length} external links`);
}

/* ===================================
   KEYBOARD SHORTCUTS
   =================================== */

function initializeKeyboardShortcuts() {
  console.log('⌨️ Initializing keyboard shortcuts...');

  document.addEventListener('keydown', handleGlobalKeyboard);
  initializeFocusManagement();

  console.log('⌨️ Keyboard shortcuts initialized');
}

function handleGlobalKeyboard(e) {
  // Don't interfere with form inputs
  if (e.target.matches('input, textarea, select, [contenteditable]')) {
    return;
  }

  switch (e.key) {
    case 'Escape':
      handleEscapeKey();
      break;
    case 'Tab':
      handleTabNavigation();
      break;
    case 't':
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        // Use theme system instead of local function
        if (window.ThemeSystem && window.ThemeSystem.toggleTheme) {
          window.ThemeSystem.toggleTheme();
        }
      }
      break;
  }

  // Number keys for quick navigation (1-6)
  if (e.key >= '1' && e.key <= '6' && !e.ctrlKey && !e.metaKey) {
    const sectionIndex = parseInt(e.key) - 1;
    navigateToSection(sectionIndex);
  }
}

function handleEscapeKey() {
  // Close mobile menu
  if (window.Navigation?.state.mobileMenuOpen) {
    window.Navigation.closeMobileMenu();
    return;
  }

  // Blur active element
  if (document.activeElement && document.activeElement !== document.body) {
    document.activeElement.blur();
  }
}

function handleTabNavigation() {
  document.body.classList.add('keyboard-navigation');

  // Remove keyboard navigation class after mouse use
  const removeKeyboardClass = () => {
    document.body.classList.remove('keyboard-navigation');
    document.removeEventListener('mousedown', removeKeyboardClass);
  };

  document.addEventListener('mousedown', removeKeyboardClass);
}

function navigateToSection(index) {
  const sections = ['hero', 'about', 'skills', 'experience', 'projects', 'contact'];
  const sectionId = sections[index];

  if (sectionId && window.Navigation?.scrollToElement) {
    window.Navigation.scrollToElement(sectionId);
  }
}

function initializeFocusManagement() {
  // Enhanced focus styles for keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('using-keyboard');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('using-keyboard');
  });
}

/* ===================================
   SCROLL EFFECTS
   =================================== */

function initializeScrollEffects() {
  console.log('📜 Initializing scroll effects...');

  initializeScrollToTop();

  console.log('📜 Scroll effects initialized');
}

function initializeScrollToTop() {
  // Create scroll to top button
  const scrollToTopBtn = document.createElement('button');
  scrollToTopBtn.className = 'scroll-to-top';
  scrollToTopBtn.innerHTML = '↑';
  scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
  scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--brand-primary);
    color: white;
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
    box-shadow: var(--shadow-lg);
    z-index: 1000;
    transform: scale(0);
    transition: transform 0.3s ease;
  `;

  document.body.appendChild(scrollToTopBtn);

  // Show/hide based on scroll position
  const toggleScrollButton = Utils.performance.throttle(() => {
    if (window.pageYOffset > 500) {
      scrollToTopBtn.style.transform = 'scale(1)';
    } else {
      scrollToTopBtn.style.transform = 'scale(0)';
    }
  }, 100);

  window.addEventListener('scroll', toggleScrollButton, { passive: true });

  // Handle click
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    Utils.analytics.trackEvent('scroll_to_top_clicked');
  });
}

/* ===================================
   PUBLIC API
   =================================== */

// Export public API
window.Interactions = {
  // State
  state: InteractionState,

  // Core functions
  toggleExpandableItem,

  // Utilities
  refresh: () => {
    console.log('🔄 Refreshing interactions...');
    initializeExpandCollapse();
    initializeButtonEffects();
    initializeExternalLinks();
  },

  cleanup: () => {
    console.log('🧹 Cleaning up interactions...');
    InteractionState.expandedItems.clear();
  },
};

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  InteractionState.expandedItems.clear();
});

console.log('🎯 Interactions system ready for initialization');
