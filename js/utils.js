/**
 * UTILITY FUNCTIONS
 * File: js/utils.js (~200 lines)
 * Purpose: Common utility functions used throughout the application
 * Dependencies: None (pure utility functions)
 */

// Utility namespace
const Utils = {
  // Performance utilities
  debounce,
  throttle,

  // DOM utilities
  createElement,
  getElement,
  getElements,
  addClass,
  removeClass,
  toggleClass,
  hasClass,

  // Event utilities
  addEvent,
  removeEvent,
  triggerEvent,

  // Validation utilities
  isEmail,
  isPhone,
  isURL,
  isEmpty,
  sanitizeString,

  // Device utilities
  isMobile,
  isTablet,
  isDesktop,
  getTouchDevice,

  // Storage utilities
  setStorage,
  getStorage,
  removeStorage,
  clearStorage,

  // String utilities
  capitalize,
  slugify,
  truncate,
  stripHtml,

  // Number utilities
  formatNumber,
  randomInt,
  clamp,

  // Date utilities
  formatDate,
  timeAgo,

  // Animation utilities
  easeInOut,
  animate,

  // General utilities
  generateId,
  deepClone,
  getQueryParam,
  scrollToElement,
};

/**
 * PERFORMANCE UTILITIES
 */

/**
 * Debounce function - delays execution until after wait period
 */
function debounce(func, wait, immediate = false) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };

    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func.apply(this, args);
  };
}

/**
 * Throttle function - limits execution to once per wait period
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

/**
 * DOM UTILITIES
 */

/**
 * Create element with attributes and content
 */
function createElement(tag, attributes = {}, content = '') {
  const element = document.createElement(tag);

  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'innerHTML') {
      element.innerHTML = value;
    } else {
      element.setAttribute(key, value);
    }
  });

  if (content) {
    element.textContent = content;
  }

  return element;
}

/**
 * Safe element selector
 */
function getElement(selector, context = document) {
  try {
    return context.querySelector(selector);
  } catch (error) {
    console.warn('Invalid selector:', selector);
    return null;
  }
}

/**
 * Safe elements selector
 */
function getElements(selector, context = document) {
  try {
    return Array.from(context.querySelectorAll(selector));
  } catch (error) {
    console.warn('Invalid selector:', selector);
    return [];
  }
}

/**
 * Add class to element
 */
function addClass(element, className) {
  if (element && className) {
    element.classList.add(className);
  }
}

/**
 * Remove class from element
 */
function removeClass(element, className) {
  if (element && className) {
    element.classList.remove(className);
  }
}

/**
 * Toggle class on element
 */
function toggleClass(element, className) {
  if (element && className) {
    element.classList.toggle(className);
  }
}

/**
 * Check if element has class
 */
function hasClass(element, className) {
  return element && className ? element.classList.contains(className) : false;
}

/**
 * EVENT UTILITIES
 */

/**
 * Add event listener with options
 */
function addEvent(element, event, handler, options = {}) {
  if (element && event && handler) {
    element.addEventListener(event, handler, options);
  }
}

/**
 * Remove event listener
 */
function removeEvent(element, event, handler) {
  if (element && event && handler) {
    element.removeEventListener(event, handler);
  }
}

/**
 * Trigger custom event
 */
function triggerEvent(element, eventName, data = {}) {
  if (element && eventName) {
    const event = new CustomEvent(eventName, { detail: data });
    element.dispatchEvent(event);
  }
}

/**
 * VALIDATION UTILITIES
 */

/**
 * Validate email address
 */
function isEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number
 */
function isPhone(phone) {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Validate URL
 */
function isURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if value is empty
 */
function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Sanitize string for safe HTML output
 */
function sanitizeString(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * DEVICE UTILITIES
 */

/**
 * Check if device is mobile
 */
function isMobile() {
  return (
    window.innerWidth <= 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  );
}

/**
 * Check if device is tablet
 */
function isTablet() {
  return window.innerWidth > 768 && window.innerWidth <= 1024;
}

/**
 * Check if device is desktop
 */
function isDesktop() {
  return window.innerWidth > 1024;
}

/**
 * Get touch device info
 */
function getTouchDevice() {
  return {
    hasTouch: 'ontouchstart' in window,
    hasPointer: window.PointerEvent,
    maxTouchPoints: navigator.maxTouchPoints || 0,
  };
}

/**
 * STORAGE UTILITIES
 */

/**
 * Set localStorage with error handling
 */
function setStorage(key, value, prefix = 'resume_') {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(prefix + key, serializedValue);
    return true;
  } catch (error) {
    console.warn('Storage set failed:', error);
    return false;
  }
}

/**
 * Get localStorage with error handling
 */
function getStorage(key, defaultValue = null, prefix = 'resume_') {
  try {
    const item = localStorage.getItem(prefix + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn('Storage get failed:', error);
    return defaultValue;
  }
}

/**
 * Remove localStorage item
 */
function removeStorage(key, prefix = 'resume_') {
  try {
    localStorage.removeItem(prefix + key);
    return true;
  } catch (error) {
    console.warn('Storage remove failed:', error);
    return false;
  }
}

/**
 * Clear all prefixed storage
 */
function clearStorage(prefix = 'resume_') {
  try {
    const keys = Object.keys(localStorage).filter((key) => key.startsWith(prefix));
    keys.forEach((key) => localStorage.removeItem(key));
    return true;
  } catch (error) {
    console.warn('Storage clear failed:', error);
    return false;
  }
}

/**
 * STRING UTILITIES
 */

/**
 * Capitalize first letter
 */
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convert string to URL-friendly slug
 */
function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Truncate string with ellipsis
 */
function truncate(str, length = 100, suffix = '...') {
  if (!str || str.length <= length) return str;
  return str.substring(0, length - suffix.length) + suffix;
}

/**
 * Strip HTML tags from string
 */
function stripHtml(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

/**
 * NUMBER UTILITIES
 */

/**
 * Format number with thousands separator
 */
function formatNumber(num, locale = 'en-US') {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * Generate random integer between min and max
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Clamp number between min and max
 */
function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

/**
 * DATE UTILITIES
 */

/**
 * Format date with options
 */
function formatDate(date, options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const formatOptions = { ...defaultOptions, ...options };
  return new Intl.DateTimeFormat('en-US', formatOptions).format(new Date(date));
}

/**
 * Get "time ago" string
 */
function timeAgo(date) {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}

/**
 * ANIMATION UTILITIES
 */

/**
 * Ease in-out function
 */
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

/**
 * Simple animation function
 */
function animate(element, property, from, to, duration = 300, callback = null) {
  const start = performance.now();
  const change = to - from;

  function step(timestamp) {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOut(progress);
    const current = from + change * eased;

    element.style[property] = current + (property.includes('opacity') ? '' : 'px');

    if (progress < 1) {
      requestAnimationFrame(step);
    } else if (callback) {
      callback();
    }
  }

  requestAnimationFrame(step);
}

/**
 * GENERAL UTILITIES
 */

/**
 * Generate unique ID
 */
function generateId(prefix = 'id') {
  return prefix + '_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

/**
 * Deep clone object
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map((item) => deepClone(item));
  if (typeof obj === 'object') {
    const cloned = {};
    Object.keys(obj).forEach((key) => {
      cloned[key] = deepClone(obj[key]);
    });
    return cloned;
  }
}

/**
 * Get URL query parameter
 */
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

/**
 * Smooth scroll to element
 */
function scrollToElement(element, offset = 0) {
  if (!element) return;

  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  });
}

/**
 * Export utilities to global scope
 */
window.Utils = Utils;

console.log('🛠️ Utility functions loaded:', Object.keys(Utils).length, 'functions available');
