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

/* ===================================
   TOAST NOTIFICATION SYSTEM
   =================================== */

class ToastManager {
  constructor() {
    this.container = null;
    this.toasts = new Map();
    this.toastCounter = 0;
    this.init();
  }

  init() {
    // Create toast container if it doesn't exist
    this.container = document.querySelector('.toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  }

  show(options = {}) {
    const {
      type = 'success',
      title = 'Success',
      message = '',
      duration = 3000,
      closable = true,
    } = options;

    const toastId = `toast-${++this.toastCounter}`;

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');

    // Create toast content
    toast.innerHTML = `
      <div class="toast-icon">
        ${this.getIconSVG(type)}
      </div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        ${message ? `<div class="toast-message">${message}</div>` : ''}
      </div>
      ${
        closable
          ? `
        <button class="toast-close" aria-label="Close notification">
          <svg viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 4.586L2.707 1.293a1 1 0 0 0-1.414 1.414L4.586 6l-3.293 3.293a1 1 0 1 0 1.414 1.414L6 7.414l3.293 3.293a1 1 0 0 0 1.414-1.414L7.414 6l3.293-3.293a1 1 0 0 0-1.414-1.414L6 4.586z"/>
          </svg>
        </button>
      `
          : ''
      }
      ${duration > 0 ? '<div class="toast-progress"></div>' : ''}
    `;

    // Add to container
    this.container.appendChild(toast);
    this.toasts.set(toastId, toast);

    // Trigger show animation
    setTimeout(
      () =>
        requestAnimationFrame(() => {
          toast.classList.add('show');
        }),
      10
    );

    // Add close button functionality
    if (closable) {
      const closeBtn = toast.querySelector('.toast-close');
      closeBtn?.addEventListener('click', () => this.hide(toastId));
    }

    // Auto-hide after duration
    if (duration > 0) {
      setTimeout(() => {
        this.hide(toastId);
      }, duration);
    }

    return toastId;
  }

  hide(toastId) {
    const toast = this.toasts.get(toastId);
    if (!toast) return;

    toast.classList.remove('show');
    toast.classList.add('hide');

    // Remove from DOM after animation
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
      this.toasts.delete(toastId);
    }, 300);
  }

  hideAll() {
    this.toasts.forEach((_, toastId) => {
      this.hide(toastId);
    });
  }

  getIconSVG(type) {
    const icons = {
      success: `
        <svg viewBox="0 0 12 12" fill="currentColor">
          <path d="M10.293 3.293a1 1 0 0 1 1.414 1.414l-6 6a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414L5 8.586l5.293-5.293z"/>
        </svg>
      `,
      error: `
        <svg viewBox="0 0 12 12" fill="currentColor">
          <path d="M6 4.586L2.707 1.293a1 1 0 0 0-1.414 1.414L4.586 6l-3.293 3.293a1 1 0 1 0 1.414 1.414L6 7.414l3.293 3.293a1 1 0 0 0 1.414-1.414L7.414 6l3.293-3.293a1 1 0 0 0-1.414-1.414L6 4.586z"/>
        </svg>
      `,
      warning: `
        <svg viewBox="0 0 12 12" fill="currentColor">
          <path d="M6 2a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zm0 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
        </svg>
      `,
      info: `
        <svg viewBox="0 0 12 12" fill="currentColor">
          <path d="M6 2a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zm0-1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
        </svg>
      `,
    };
    return icons[type] || icons.info;
  }
}

// Create global instance
window.toastManager = new ToastManager();

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
 * FIXED: Initialize expand/collapse functionality for experience items
 * Based on your actual utils.js structure
 */
function initializeExpandCollapse() {
  console.log('📖 Initializing expand/collapse interactions...');

  const expandButtons = document.querySelectorAll('.expand-btn, [data-expand-target]');

  expandButtons.forEach((button, index) => {
    // Add unique ID if not present
    if (!button.id) {
      button.id = `expand-btn-${index}`;
    }

    // FIXED: Use Utils.debounce (not Utils.performance.debounce)
    const debouncedToggle = Utils.debounce(() => toggleExpandableItem(button), 200);

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
}

/**
 * Expand an item with smooth animation
 */
function expandItem(container, content, button, itemId) {
  InteractionState.expandedItems.add(itemId);

  // Update button state
  updateExpandButton(button, true);

  // CRITICAL FIX: Force display override and clear inline styles
  content.style.display = 'block';
  content.style.visibility = 'visible';
  content.style.opacity = '0';
  content.style.maxHeight = '0px';
  content.style.overflow = 'hidden';
  content.style.transition = 'all 0.4s ease';

  // Force reflow
  content.offsetHeight;

  // Add expanded class for CSS targeting
  content.classList.add('expanded');

  // Animate to full height
  const fullHeight = content.scrollHeight;
  content.style.maxHeight = fullHeight + 'px';
  content.style.opacity = '1';

  // Clean up after animation
  setTimeout(() => {
    content.style.maxHeight = '';
    content.style.overflow = 'visible';
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

  // Set explicit height before animating
  const currentHeight = content.scrollHeight;
  content.style.maxHeight = currentHeight + 'px';
  content.style.overflow = 'hidden';
  content.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';

  // Force reflow
  content.offsetHeight;

  // Animate to zero height
  content.style.maxHeight = '0px';
  content.style.opacity = '0';

  // Hide after animation and restore inline style
  setTimeout(() => {
    content.style.display = 'none'; // Restore hidden state
    content.style.maxHeight = '';
    content.style.overflow = '';
    content.style.transition = '';
    content.style.visibility = '';
    content.classList.remove('expanded');
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
  if (!Utils.isMobile()) {
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

      // FIXED: Only close mobile menu on LEFT swipe, removed upward swipe
      if (absDeltaX > absDeltaY && deltaX < 0) {
        // Only left swipe
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
    if (Utils.isMobile()) {
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
      e.stopPropagation();

      // Prevent duplicate triggers
      if (button.dataset.copying === 'true') return;
      button.dataset.copying = 'true';

      const textToCopy = button.dataset.copy || button.textContent.trim();

      try {
        await navigator.clipboard.writeText(textToCopy);
        showCopySuccess(textToCopy, button);
        if (Utils.analytics && Utils.analytics.trackEvent) {
          if (Utils.analytics && Utils.analytics.trackEvent) {
            Utils.analytics.trackEvent('text_copied', { source: button.className });
          }
        }
      } catch (error) {
        // Fallback for older browsers
        try {
          fallbackCopyToClipboard(textToCopy);
          showCopySuccess(textToCopy, button);
          if (Utils.analytics && Utils.analytics.trackEvent) {
            if (Utils.analytics && Utils.analytics.trackEvent) {
              Utils.analytics.trackEvent('text_copied', { source: button.className });
            }
          }
        } catch (fallbackError) {
          showCopyError();
          console.error('Copy failed:', fallbackError);
        }
      }

      // Reset the copying flag after a short delay
      setTimeout(() => {
        button.dataset.copying = 'false';
      }, 500);
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
    const successful = document.execCommand('copy');
    if (!successful) {
      throw new Error('Copy command failed');
    }
  } catch (err) {
    throw new Error('Fallback copy failed: ' + err.message);
  } finally {
    document.body.removeChild(textArea);
  }
}

function showCopySuccess(copiedText, sourceElement) {
  // Determine what was copied for better messaging
  let title = 'Copied!';
  let message = '';

  if (copiedText.includes('@')) {
    title = 'Email Copied!';
    message = 'Ready to paste into your email client';
  } else if (copiedText.includes('+') || copiedText.match(/\d{3}.*\d{3}.*\d{4}/)) {
    title = 'Phone Copied!';
    message = 'Ready to paste or dial';
  } else if (copiedText.length > 50) {
    title = 'Text Copied!';
    message = `${copiedText.length} characters copied`;
  } else {
    title = 'Copied!';
    message = copiedText.length < 30 ? copiedText : copiedText.substring(0, 27) + '...';
  }

  // Show toast notification
  window.toastManager.show({
    type: 'success',
    title,
    message,
    duration: 2500,
  });

  // Add brief visual feedback to the clicked element
  if (sourceElement) {
    sourceElement.style.transform = 'scale(0.95)';
    setTimeout(() => {
      sourceElement.style.transform = '';
    }, 150);
  }
}

function showCopyError() {
  window.toastManager.show({
    type: 'error',
    title: 'Copy Failed',
    message: 'Please try selecting and copying manually',
    duration: 4000,
  });
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

/**
 * FIXED: Initialize scroll effects
 */
function initializeScrollEffects() {
  console.log('📜 Initializing scroll effects...');

  // Scroll to top button
  const scrollToTopBtn = document.createElement('button');
  scrollToTopBtn.innerHTML = '↑';
  scrollToTopBtn.title = 'Scroll to top';
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

  // FIXED: Use Utils.throttle (not Utils.performance.throttle)
  const toggleScrollButton = Utils.throttle(() => {
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
    console.log('📊 Scroll to top clicked');
  });
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
