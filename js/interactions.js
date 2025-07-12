/**
 * User Interactions JavaScript
 * Handles mobile menu, expand/collapse, form interactions, and other user interactions
 */

// Interaction state management
const InteractionState = {
  mobileMenuOpen: false,
  expandedItems: new Set(),
  activeModal: null,
  touchStartY: 0,
  isScrolling: false,
};

/**
 * Initialize all interactions when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  // Wait for app to be ready
  if (window.App && window.App.isLoaded) {
    initializeInteractions();
  } else {
    const checkAppLoaded = setInterval(() => {
      if (window.App && window.App.isLoaded) {
        clearInterval(checkAppLoaded);
        initializeInteractions();
      }
    }, 100);
  }
});

/**
 * Initialize all interaction handlers
 */
function initializeInteractions() {
  try {
    // Mobile menu interactions
    initializeMobileMenu();

    // Experience expand/collapse interactions
    initializeExpandCollapse();

    // Form interactions
    initializeFormHandling();

    // Touch interactions for mobile
    initializeTouchInteractions();

    // Keyboard shortcuts
    initializeKeyboardShortcuts();

    // Copy to clipboard interactions
    initializeCopyToClipboard();

    // Theme switcher (if implemented)
    initializeThemeSwitcher();

    // External link handling
    initializeExternalLinks();

    console.log('🎯 User interactions initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing interactions:', error);
  }
}

/**
 * Mobile menu interactions
 */
function initializeMobileMenu() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (!mobileMenuToggle || !mobileMenuOverlay) return;

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

  // Close menu when clicking overlay
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

  // Close menu on swipe gesture
  let startY = 0;
  mobileMenuOverlay.addEventListener(
    'touchstart',
    (e) => {
      startY = e.touches[0].clientY;
    },
    { passive: true }
  );

  mobileMenuOverlay.addEventListener(
    'touchmove',
    (e) => {
      const currentY = e.touches[0].clientY;
      const diffY = startY - currentY;

      // Close menu on upward swipe
      if (diffY > 50) {
        closeMobileMenu();
      }
    },
    { passive: true }
  );
}

/**
 * Toggle mobile menu state
 */
function toggleMobileMenu() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

  if (InteractionState.mobileMenuOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

/**
 * Open mobile menu
 */
function openMobileMenu() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

  if (!mobileMenuToggle || !mobileMenuOverlay) return;

  InteractionState.mobileMenuOpen = true;

  // Add active classes
  mobileMenuToggle.classList.add('active');
  mobileMenuOverlay.classList.add('active');

  // Prevent body scroll
  document.body.style.overflow = 'hidden';

  // Animate menu items
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

  // Announce to screen readers
  mobileMenuOverlay.setAttribute('aria-hidden', 'false');
  mobileMenuToggle.setAttribute('aria-expanded', 'true');
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

  if (!mobileMenuToggle || !mobileMenuOverlay) return;

  InteractionState.mobileMenuOpen = false;

  // Remove active classes
  mobileMenuToggle.classList.remove('active');
  mobileMenuOverlay.classList.remove('active');

  // Re-enable body scroll
  document.body.style.overflow = '';

  // Announce to screen readers
  mobileMenuOverlay.setAttribute('aria-hidden', 'true');
  mobileMenuToggle.setAttribute('aria-expanded', 'false');

  // Reset nav link styles
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  mobileNavLinks.forEach((link) => {
    link.style.transition = '';
    link.style.opacity = '';
    link.style.transform = '';
  });
}

/**
 * Experience expand/collapse interactions
 */
function initializeExpandCollapse() {
  const expandButtons = document.querySelectorAll('.expand-btn');

  expandButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      toggleExperienceItem(button);
    });
  });
}

/**
 * Toggle experience item expanded state
 */
function toggleExperienceItem(button) {
  const experienceItem = button.closest('.experience-item');
  if (!experienceItem) return;

  const itemId =
    experienceItem.dataset.id ||
    experienceItem.querySelector('.company-name')?.textContent ||
    'unknown';
  const hiddenResponsibilities = experienceItem.querySelector('.responsibilities-hidden');
  const isExpanded = InteractionState.expandedItems.has(itemId);

  if (!hiddenResponsibilities) return;

  if (isExpanded) {
    // Collapse
    collapseExperienceItem(experienceItem, hiddenResponsibilities, button, itemId);
  } else {
    // Expand
    expandExperienceItem(experienceItem, hiddenResponsibilities, button, itemId);
  }
}

/**
 * Expand experience item
 */
function expandExperienceItem(experienceItem, hiddenResponsibilities, button, itemId) {
  // Add to expanded set
  InteractionState.expandedItems.add(itemId);

  // Update button text
  button.innerHTML = `
        <span>Show Less</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 3L2 7h8L6 3z"/>
        </svg>
    `;

  // Show hidden content with animation
  hiddenResponsibilities.style.display = 'block';
  hiddenResponsibilities.style.opacity = '0';
  hiddenResponsibilities.style.maxHeight = '0px';
  hiddenResponsibilities.style.overflow = 'hidden';
  hiddenResponsibilities.style.transition = 'all 0.3s ease';

  // Force reflow
  hiddenResponsibilities.offsetHeight;

  // Animate to full height
  const fullHeight = hiddenResponsibilities.scrollHeight;
  hiddenResponsibilities.style.maxHeight = fullHeight + 'px';
  hiddenResponsibilities.style.opacity = '1';

  // Clean up after animation
  setTimeout(() => {
    hiddenResponsibilities.style.maxHeight = '';
    hiddenResponsibilities.style.overflow = '';
  }, 300);

  // Update ARIA attributes
  button.setAttribute('aria-expanded', 'true');
  hiddenResponsibilities.setAttribute('aria-hidden', 'false');

  // Analytics tracking (if implemented)
  trackEvent('experience_expanded', { company: itemId });
}

/**
 * Collapse experience item
 */
function collapseExperienceItem(experienceItem, hiddenResponsibilities, button, itemId) {
  // Remove from expanded set
  InteractionState.expandedItems.delete(itemId);

  // Update button text
  button.innerHTML = `
        <span>Show More</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 9L2 5h8L6 9z"/>
        </svg>
    `;

  // Animate to collapsed
  const currentHeight = hiddenResponsibilities.scrollHeight;
  hiddenResponsibilities.style.maxHeight = currentHeight + 'px';
  hiddenResponsibilities.style.overflow = 'hidden';
  hiddenResponsibilities.style.transition = 'all 0.3s ease';

  // Force reflow
  hiddenResponsibilities.offsetHeight;

  // Animate to zero height
  hiddenResponsibilities.style.maxHeight = '0px';
  hiddenResponsibilities.style.opacity = '0';

  // Hide after animation
  setTimeout(() => {
    hiddenResponsibilities.style.display = 'none';
    hiddenResponsibilities.style.maxHeight = '';
    hiddenResponsibilities.style.overflow = '';
    hiddenResponsibilities.style.transition = '';
  }, 300);

  // Update ARIA attributes
  button.setAttribute('aria-expanded', 'false');
  hiddenResponsibilities.setAttribute('aria-hidden', 'true');

  // Analytics tracking (if implemented)
  trackEvent('experience_collapsed', { company: itemId });
}

/**
 * Form handling interactions
 */
function initializeFormHandling() {
  const forms = document.querySelectorAll('form');
  const inputs = document.querySelectorAll('input, textarea');

  // Form submission handling
  forms.forEach((form) => {
    form.addEventListener('submit', handleFormSubmission);
  });

  // Input validation and styling
  inputs.forEach((input) => {
    input.addEventListener('focus', handleInputFocus);
    input.addEventListener('blur', handleInputBlur);
    input.addEventListener('input', handleInputChange);
  });
}

/**
 * Handle form submission
 */
function handleFormSubmission(e) {
  e.preventDefault();

  const form = e.target;
  const submitButton = form.querySelector('button[type="submit"]');
  const formData = new FormData(form);

  // Show loading state
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
  }

  // Simulate form submission (replace with actual submission logic)
  setTimeout(() => {
    showNotification('Message sent successfully!', 'success');
    form.reset();

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Send Message';
    }
  }, 2000);

  // Analytics tracking
  trackEvent('form_submitted', { form_id: form.id });
}

/**
 * Handle input focus
 */
function handleInputFocus(e) {
  const input = e.target;
  const label = input.previousElementSibling;

  input.classList.add('focused');
  if (label) {
    label.classList.add('focused');
  }
}

/**
 * Handle input blur
 */
function handleInputBlur(e) {
  const input = e.target;
  const label = input.previousElementSibling;

  input.classList.remove('focused');
  if (label) {
    label.classList.remove('focused');
  }

  // Validate input
  validateInput(input);
}

/**
 * Handle input change
 */
function handleInputChange(e) {
  const input = e.target;

  // Real-time validation
  if (input.value.length > 0) {
    input.classList.add('has-value');
  } else {
    input.classList.remove('has-value');
  }

  // Clear previous validation errors
  input.classList.remove('error');
  const errorMessage = input.parentElement.querySelector('.error-message');
  if (errorMessage) {
    errorMessage.remove();
  }
}

/**
 * Validate input field
 */
function validateInput(input) {
  const value = input.value.trim();
  const type = input.type;
  const required = input.hasAttribute('required');

  let isValid = true;
  let errorMessage = '';

  // Required field validation
  if (required && !value) {
    isValid = false;
    errorMessage = 'This field is required';
  }

  // Email validation
  if (type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid email address';
    }
  }

  // Phone validation
  if (type === 'tel' && value) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
      isValid = false;
      errorMessage = 'Please enter a valid phone number';
    }
  }

  // Show validation result
  if (!isValid) {
    showInputError(input, errorMessage);
  } else {
    clearInputError(input);
  }

  return isValid;
}

/**
 * Show input error
 */
function showInputError(input, message) {
  input.classList.add('error');

  // Remove existing error message
  const existingError = input.parentElement.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }

  // Add new error message
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.textContent = message;
  input.parentElement.appendChild(errorElement);
}

/**
 * Clear input error
 */
function clearInputError(input) {
  input.classList.remove('error');
  const errorMessage = input.parentElement.querySelector('.error-message');
  if (errorMessage) {
    errorMessage.remove();
  }
}

/**
 * Touch interactions for mobile
 */
function initializeTouchInteractions() {
  // Prevent zoom on double tap for iOS
  let lastTouchEnd = 0;
  document.addEventListener(
    'touchend',
    (e) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    },
    false
  );

  // Add touch feedback to buttons
  const touchElements = document.querySelectorAll('button, .btn, a, .card');

  touchElements.forEach((element) => {
    element.addEventListener(
      'touchstart',
      (e) => {
        element.classList.add('touch-active');
      },
      { passive: true }
    );

    element.addEventListener(
      'touchend',
      (e) => {
        setTimeout(() => {
          element.classList.remove('touch-active');
        }, 150);
      },
      { passive: true }
    );

    element.addEventListener(
      'touchcancel',
      (e) => {
        element.classList.remove('touch-active');
      },
      { passive: true }
    );
  });
}

/**
 * Keyboard shortcuts
 */
function initializeKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Escape key - close any open overlays
    if (e.key === 'Escape') {
      closeMobileMenu();
      closeModal();
    }

    // Enter key on buttons
    if (e.key === 'Enter' && e.target.tagName === 'BUTTON') {
      e.target.click();
    }

    // Arrow key navigation for menu items
    if (InteractionState.mobileMenuOpen && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault();
      navigateMenu(e.key === 'ArrowDown');
    }
  });
}

/**
 * Navigate mobile menu with arrow keys
 */
function navigateMenu(down) {
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

  menuItems[nextIndex].focus();
}

/**
 * Copy to clipboard functionality
 */
function initializeCopyToClipboard() {
  const copyButtons = document.querySelectorAll('[data-copy]');

  copyButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = button.dataset.copy || button.textContent;

      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            showNotification('Copied to clipboard!', 'success');
          })
          .catch((err) => {
            console.error('Failed to copy:', err);
            fallbackCopyToClipboard(textToCopy);
          });
      } else {
        fallbackCopyToClipboard(textToCopy);
      }
    });
  });
}

/**
 * Fallback copy to clipboard for older browsers
 */
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
    showNotification('Copied to clipboard!', 'success');
  } catch (err) {
    console.error('Fallback copy failed:', err);
    showNotification('Failed to copy to clipboard', 'error');
  }

  document.body.removeChild(textArea);
}

/**
 * Theme switcher initialization
 */
function initializeThemeSwitcher() {
  const themeSwitcher = document.querySelector('.theme-switcher');

  if (themeSwitcher) {
    themeSwitcher.addEventListener('click', () => {
      toggleTheme();
    });

    // Set initial theme based on user preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    }
  }
}

/**
 * Toggle between light and dark theme
 */
function toggleTheme() {
  const currentTheme = document.body.dataset.theme || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

/**
 * Set theme
 */
function setTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem('theme', theme);

  // Update theme switcher icon if present
  const themeSwitcher = document.querySelector('.theme-switcher');
  if (themeSwitcher) {
    themeSwitcher.textContent = theme === 'light' ? '🌙' : '☀️';
  }

  // Analytics tracking
  trackEvent('theme_changed', { theme });
}

/**
 * External link handling
 */
function initializeExternalLinks() {
  const externalLinks = document.querySelectorAll(
    'a[href^="http"]:not([href*="' + window.location.hostname + '"])'
  );

  externalLinks.forEach((link) => {
    // Add external link indicator
    if (!link.querySelector('.external-icon')) {
      const icon = document.createElement('span');
      icon.className = 'external-icon';
      icon.innerHTML = '↗';
      link.appendChild(icon);
    }

    // Add target="_blank" and security attributes
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');

    // Track external link clicks
    link.addEventListener('click', (e) => {
      trackEvent('external_link_clicked', {
        url: link.href,
        text: link.textContent,
      });
    });
  });
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Style the notification
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    color: 'white',
    fontWeight: '500',
    zIndex: '10000',
    transform: 'translateX(100%)',
    transition: 'transform 0.3s ease',
  });

  // Set background color based on type
  const colors = {
    success: '#30D158',
    error: '#FF453A',
    warning: '#FF9F0A',
    info: '#007AFF',
  };
  notification.style.backgroundColor = colors[type] || colors.info;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 10);

  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

/**
 * Close modal (if any)
 */
function closeModal() {
  const activeModal = document.querySelector('.modal.active');
  if (activeModal) {
    activeModal.classList.remove('active');
    InteractionState.activeModal = null;
  }
}

/**
 * Analytics event tracking (placeholder)
 */
function trackEvent(eventName, properties = {}) {
  // Placeholder for analytics tracking
  // Replace with actual analytics implementation (Google Analytics, etc.)
  console.log('📊 Event tracked:', eventName, properties);

  // Example: Google Analytics 4
  // if (typeof gtag !== 'undefined') {
  //     gtag('event', eventName, properties);
  // }
}

// Export functions for external use
window.InteractionHandlers = {
  toggleMobileMenu,
  closeMobileMenu,
  showNotification,
  toggleTheme,
  setTheme,
  trackEvent,
};
