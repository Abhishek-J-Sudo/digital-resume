/**
 * THEME SWITCHING SYSTEM
 * File: js/theme.js (~200 lines)
 * Purpose: Handle light/dark mode switching and company theme management
 * Dependencies: css/variables.css (for theme tokens)
 */

// Prevent multiple initializations
if (window.ThemeSystemInitialized) {
  console.log('⚠️ Theme system already initialized, skipping...');
  // Don't exit completely, just don't reinitialize
} else {
  window.ThemeSystemInitialized = true;

  // Theme system state
  const ThemeSystem = {
    currentTheme: 'light',
    currentCompanyTheme: '',
    isInitialized: false,
    observers: [],
    storageKeys: {
      theme: 'theme',
      companyTheme: 'company-theme',
    },
  };

  /**
   * Initialize theme system when DOM is loaded
   */
  document.addEventListener('DOMContentLoaded', () => {
    if (!window.ThemeSystemInitialized || !ThemeSystem.isInitialized) {
      // Small delay to ensure all elements are rendered
      setTimeout(initializeThemeSystem, 100);
    }
  });

  /**
   * Main theme system initialization
   */
  function initializeThemeSystem() {
    // Prevent multiple initializations
    if (ThemeSystem.isInitialized) {
      console.log('⚠️ Theme system already initialized, skipping...');
      return;
    }

    try {
      console.log('🎨 Initializing theme system...');

      // Load saved preferences (but don't apply yet to avoid conflicts)
      loadThemePreferences();

      // Setup theme switchers
      setupThemeSwitchers();

      // Setup company theme selector
      setupCompanyThemeSelector();

      // Listen for system theme changes
      setupSystemThemeListener();

      // Mark as initialized
      ThemeSystem.isInitialized = true;

      console.log('✅ Theme system initialized successfully');
      console.log(`Current theme: ${ThemeSystem.currentTheme}`);
      console.log(`Company theme: ${ThemeSystem.currentCompanyTheme || 'default'}`);
    } catch (error) {
      console.error('❌ Error initializing theme system:', error);
    }
  }

  /**
   * Load theme preferences from localStorage and system
   */
  function loadThemePreferences() {
    // Get current theme from DOM (set by inline script) or default to system
    const currentDataTheme = document.documentElement.getAttribute('data-theme');
    const savedTheme = localStorage.getItem(ThemeSystem.storageKeys.theme);
    const systemTheme = getSystemTheme();

    // Use current DOM theme if it exists, otherwise saved or system theme
    const theme = currentDataTheme || savedTheme || systemTheme;

    // Get saved company theme
    const savedCompanyTheme = localStorage.getItem(ThemeSystem.storageKeys.companyTheme) || 'pgd';

    // Update internal state without re-applying (to avoid conflicts)
    ThemeSystem.currentTheme = theme;
    ThemeSystem.currentCompanyTheme = savedCompanyTheme;

    // Apply company theme if needed
    if (savedCompanyTheme) {
      document.documentElement.setAttribute('data-company-theme', savedCompanyTheme);
    }

    console.log(
      `📱 Synced with existing themes - Main: ${theme}, Company: ${savedCompanyTheme || 'default'}`
    );
  }

  /**
   * Get system theme preference
   */
  function getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  /**
   * Setup theme switcher buttons
   */
  function setupThemeSwitchers() {
    // Remove any existing listeners first
    const desktopSwitcher = document.querySelector('.theme-switcher');
    const mobileToggle = document.querySelector('.mobile-theme-toggle');

    // Clone and replace elements to remove all event listeners
    if (desktopSwitcher) {
      const newDesktopSwitcher = desktopSwitcher.cloneNode(true);
      desktopSwitcher.parentNode.replaceChild(newDesktopSwitcher, desktopSwitcher);

      console.log('🖥️ Found desktop theme switcher');
      newDesktopSwitcher.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('🔘 Desktop theme switcher clicked');
        toggleTheme();
      });
      updateThemeSwitcherIcon(newDesktopSwitcher);
    } else {
      console.log('⚠️ Desktop theme switcher not found');
    }

    if (mobileToggle) {
      const newMobileToggle = mobileToggle.cloneNode(true);
      mobileToggle.parentNode.replaceChild(newMobileToggle, mobileToggle);

      console.log('📱 Found mobile theme toggle');
      newMobileToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('🔘 Mobile theme toggle clicked');
        toggleTheme();
      });
      updateMobileThemeToggle(newMobileToggle);
    } else {
      console.log('⚠️ Mobile theme toggle not found');
    }

    console.log('🔘 Theme switchers configured');
  }

  /**
   * Setup company theme selector
   */
  function setupCompanyThemeSelector() {
    const companySelect = document.querySelector('.company-theme-select');
    if (companySelect) {
      // Set current value
      companySelect.value = ThemeSystem.currentCompanyTheme;

      // Listen for changes
      companySelect.addEventListener('change', (e) => {
        setCompanyTheme(e.target.value);
      });

      console.log('🏢 Company theme selector configured');
    }
  }

  /**
   * Setup system theme change listener
   */
  function setupSystemThemeListener() {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      mediaQuery.addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a theme
        if (!localStorage.getItem(ThemeSystem.storageKeys.theme)) {
          const newTheme = e.matches ? 'dark' : 'light';
          setTheme(newTheme, false); // Don't save system preference
          updateAllThemeSwitchers();
          notifyThemeObservers('system-change', newTheme);
        }
      });

      console.log('🖥️ System theme listener configured');
    }
  }

  /**
   * Toggle between light and dark theme
   */
  function toggleTheme() {
    const newTheme = ThemeSystem.currentTheme === 'light' ? 'dark' : 'light';
    console.log(`🔄 Toggling theme from ${ThemeSystem.currentTheme} to ${newTheme}`);
    setTheme(newTheme);

    // Analytics tracking
    trackThemeEvent('theme_toggled', {
      from: ThemeSystem.currentTheme === 'light' ? 'dark' : 'light', // Use old value
      to: newTheme,
      method: 'manual',
    });
  }

  /**
   * Set the main theme (light/dark)
   */
  function setTheme(theme, save = true) {
    if (!['light', 'dark'].includes(theme)) {
      console.warn(`⚠️ Invalid theme: ${theme}. Using 'light' as fallback.`);
      theme = 'light';
    }

    console.log(`🎨 Setting theme to: ${theme}`);

    // Update state
    ThemeSystem.currentTheme = theme;

    // Apply to DOM
    document.documentElement.setAttribute('data-theme', theme);

    // Also set on body for compatibility
    document.body.setAttribute('data-theme', theme);

    // Save to localStorage if requested
    if (save) {
      localStorage.setItem(ThemeSystem.storageKeys.theme, theme);
      console.log(`💾 Theme saved to localStorage: ${theme}`);
    }

    // Update UI elements
    updateAllThemeSwitchers();

    // Notify observers
    notifyThemeObservers('theme-change', theme);

    console.log(`✅ Theme successfully set to: ${theme}`);
  }

  /**
   * Set company theme
   */
  function setCompanyTheme(companyTheme, save = true) {
    // Update state
    ThemeSystem.currentCompanyTheme = companyTheme;

    // Apply to DOM
    if (companyTheme) {
      document.documentElement.setAttribute('data-company-theme', companyTheme);
    } else {
      document.documentElement.removeAttribute('data-company-theme');
    }

    // Save to localStorage if requested
    if (save) {
      localStorage.setItem(ThemeSystem.storageKeys.companyTheme, companyTheme);
    }

    // Update company theme selector
    const companySelect = document.querySelector('.company-theme-select');
    if (companySelect) {
      companySelect.value = companyTheme;
    }

    // Notify observers
    notifyThemeObservers('company-theme-change', companyTheme);

    console.log(`🏢 Company theme set to: ${companyTheme || 'default'}`);

    // Analytics tracking
    if (save) {
      trackThemeEvent('company_theme_changed', {
        theme: companyTheme || 'default',
      });
    }
  }

  /**
   * Update all theme switcher UI elements
   */
  function updateAllThemeSwitchers() {
    // Desktop theme switcher
    const desktopSwitcher = document.querySelector('.theme-switcher');
    if (desktopSwitcher) {
      updateThemeSwitcherIcon(desktopSwitcher);
    }

    // Mobile theme toggle
    const mobileToggle = document.querySelector('.mobile-theme-toggle');
    if (mobileToggle) {
      updateMobileThemeToggle(mobileToggle);
    }
  }

  /**
   * Update desktop theme switcher icon
   */
  function updateThemeSwitcherIcon(switcher) {
    const sunIcon = switcher.querySelector('.sun-icon');
    const moonIcon = switcher.querySelector('.moon-icon');

    if (sunIcon && moonIcon) {
      if (ThemeSystem.currentTheme === 'dark') {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      }
    }

    // Update ARIA label
    const label =
      ThemeSystem.currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    switcher.setAttribute('aria-label', label);
  }

  /**
   * Update mobile theme toggle switch
   */
  function updateMobileThemeToggle(toggle) {
    const themeText = toggle.querySelector('.theme-text');
    const slider = toggle.querySelector('.theme-toggle-slider');

    if (themeText) {
      themeText.textContent = ThemeSystem.currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
    }

    // CSS handles the slider position via [data-theme] selectors
    // But we can add a class for additional styling if needed
    toggle.classList.toggle('dark-active', ThemeSystem.currentTheme === 'dark');
  }

  /**
   * Add theme change observer
   */
  function addThemeObserver(callback) {
    if (typeof callback === 'function') {
      ThemeSystem.observers.push(callback);
    }
  }

  /**
   * Remove theme change observer
   */
  function removeThemeObserver(callback) {
    const index = ThemeSystem.observers.indexOf(callback);
    if (index > -1) {
      ThemeSystem.observers.splice(index, 1);
    }
  }

  /**
   * Notify all theme observers
   */
  function notifyThemeObservers(event, data) {
    ThemeSystem.observers.forEach((callback) => {
      try {
        callback({
          event,
          data,
          theme: ThemeSystem.currentTheme,
          companyTheme: ThemeSystem.currentCompanyTheme,
        });
      } catch (error) {
        console.error('Error in theme observer:', error);
      }
    });
  }

  /**
   * Get current theme info
   */
  function getCurrentTheme() {
    return {
      theme: ThemeSystem.currentTheme,
      companyTheme: ThemeSystem.currentCompanyTheme,
      systemTheme: getSystemTheme(),
      isSystemDefault: !localStorage.getItem(ThemeSystem.storageKeys.theme),
    };
  }

  /**
   * Reset themes to system defaults
   */
  function resetThemes() {
    // Clear saved preferences
    localStorage.removeItem(ThemeSystem.storageKeys.theme);
    localStorage.removeItem(ThemeSystem.storageKeys.companyTheme);

    // Apply system theme
    const systemTheme = getSystemTheme();
    setTheme(systemTheme, false);
    setCompanyTheme('', false);

    console.log('🔄 Themes reset to system defaults');

    // Analytics tracking
    trackThemeEvent('themes_reset');
  }

  /**
   * Preload theme-specific assets
   */
  function preloadThemeAssets(theme) {
    // Preload theme-specific images or assets if needed
    if (theme === 'dark') {
      // Preload dark theme assets
      const darkAssets = [
        // Add paths to dark theme specific images
      ];

      darkAssets.forEach((asset) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = asset;
        document.head.appendChild(link);
      });
    }
  }

  /**
   * Analytics tracking helper
   */
  function trackThemeEvent(eventName, properties = {}) {
    // Placeholder for analytics tracking
    // Replace with actual analytics implementation
    console.log(`📊 Theme Event: ${eventName}`, {
      ...properties,
      currentTheme: ThemeSystem.currentTheme,
      companyTheme: ThemeSystem.currentCompanyTheme,
      timestamp: new Date().toISOString(),
    });

    // Example: Google Analytics 4
    // if (typeof gtag !== 'undefined') {
    //   gtag('event', eventName, {
    //     theme: ThemeSystem.currentTheme,
    //     company_theme: ThemeSystem.currentCompanyTheme,
    //     ...properties
    //   });
    // }
  }

  /**
   * Handle theme transitions for smooth switching
   */
  function enableThemeTransitions() {
    // Add transition class to body for smooth theme switching
    document.body.classList.add('theme-transitioning');

    // Remove transition class after animation completes
    setTimeout(() => {
      document.body.classList.remove('theme-transitioning');
    }, 300);
  }

  /**
   * Auto-detect appropriate theme based on time
   */
  function getTimeBasedTheme() {
    const hour = new Date().getHours();
    // Use dark theme between 7 PM and 7 AM
    return hour >= 19 || hour <= 7 ? 'dark' : 'light';
  }

  /**
   * Public API - Export functions for external use
   */
  window.ThemeSystem = {
    // Core functions
    setTheme,
    setCompanyTheme,
    toggleTheme,
    getCurrentTheme,
    resetThemes,

    // Observers
    addObserver: addThemeObserver,
    removeObserver: removeThemeObserver,

    // Utilities
    getSystemTheme,
    getTimeBasedTheme,
    enableTransitions: enableThemeTransitions,

    // State (read-only)
    get isInitialized() {
      return ThemeSystem.isInitialized;
    },
    get currentTheme() {
      return ThemeSystem.currentTheme;
    },
    get currentCompanyTheme() {
      return ThemeSystem.currentCompanyTheme;
    },
  };

  /**
   * Initialize immediately if DOM is already ready
   */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (!window.ThemeSystemInitialized || !ThemeSystem.isInitialized) {
        setTimeout(initializeThemeSystem, 100);
      }
    });
  } else if (!window.ThemeSystemInitialized) {
    // DOM is already ready and theme system not initialized
    setTimeout(initializeThemeSystem, 100);
  }

  // Also try to initialize on window load as backup (only if not already initialized)
  window.addEventListener('load', () => {
    if (!ThemeSystem.isInitialized) {
      console.log('🔄 Backup initialization on window load');
      initializeThemeSystem();
    }
  });

  console.log('🎨 Theme system module loaded');
} // Close the if block for preventing multiple initializations
