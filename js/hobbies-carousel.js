/**
 * PHOTO CAROUSEL SYSTEM - COMPLETE FIXED VERSION
 * File: js/hobbies-carousel.js
 * All missing functions included and network errors fixed
 */

// Carousel state management
const CarouselState = {
  currentIndex: 0,
  totalPhotos: 0,
  isPlaying: false,
  autoPlayInterval: null,
  photos: [],
  touchStartX: 0,
  touchEndX: 0,
  initialized: false,
};

/**
 * Initialize carousel
 */
function initializePhotoCarousel() {
  try {
    console.log('📸 Starting photo carousel initialization...');

    // Check if photo gallery exists
    const photoGallery = document.querySelector('.photo-gallery');
    if (!photoGallery) {
      console.log('📸 No photo gallery found - carousel not needed');
      return;
    }

    console.log('📸 Photo gallery found, initializing carousel...');

    // Load photo data first
    loadPhotoData();

    // Check if we have photos to display
    if (CarouselState.photos.length === 0) {
      console.warn('⚠️ No photos loaded, showing fallback');
      showCarouselFallback();
      return;
    }

    console.log(`📷 Loaded ${CarouselState.photos.length} photos`);

    // Render photos and setup controls
    renderPhotos();
    setupCarouselControls();
    setupTouchGestures();
    setupKeyboardNavigation();

    // Mark as initialized
    CarouselState.initialized = true;

    console.log('✅ Photo carousel initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing photo carousel:', error);
    showCarouselFallback();
  }
}

/**
 * Load photo data with working placeholder URLs
 */
function loadPhotoData() {
  console.log('📸 Loading photo data...');

  const dataScript = document.getElementById('instagram-photos-data');
  if (!dataScript) {
    console.warn('⚠️ No instagram-photos-data script found');
    CarouselState.photos = getDefaultPhotos();
    return;
  }

  try {
    const jsonData = dataScript.textContent.trim();
    console.log('📸 Found JSON data:', jsonData.substring(0, 100) + '...');

    CarouselState.photos = JSON.parse(jsonData);
    CarouselState.totalPhotos = CarouselState.photos.length;

    // Fix placeholder URLs that don't work
    CarouselState.photos.forEach((photo, index) => {
      if (photo.image.includes('via.placeholder.com')) {
        // Use working placeholder service
        photo.image = `https://picsum.photos/600/600?random=${index + 1}`;
        console.log(`📷 Fixed placeholder URL for photo ${index + 1}`);
      }
    });

    console.log(`📷 Successfully loaded ${CarouselState.totalPhotos} photos`);
  } catch (error) {
    console.error('❌ Error parsing photo JSON data:', error);
    console.log('📸 Using default photos instead');
    CarouselState.photos = getDefaultPhotos();
    CarouselState.totalPhotos = CarouselState.photos.length;
  }
}

/**
 * Get default photos with working URLs
 */
function getDefaultPhotos() {
  return [
    {
      url: '#',
      image: 'https://picsum.photos/600/600?random=1',
      location: 'Sample Location 1',
      caption: 'Beautiful landscape photography',
      alt: 'Travel photo 1',
    },
    {
      url: '#',
      image: 'https://picsum.photos/600/600?random=2',
      location: 'Sample Location 2',
      caption: 'Amazing architecture and culture',
      alt: 'Travel photo 2',
    },
    {
      url: '#',
      image: 'https://picsum.photos/600/600?random=3',
      location: 'Sample Location 3',
      caption: 'Street photography at its finest',
      alt: 'Travel photo 3',
    },
  ];
}

/**
 * Render photos
 */
function renderPhotos() {
  console.log('📸 Rendering photos...');

  const photoContainer = document.querySelector('.photo-container');
  if (!photoContainer) {
    console.error('❌ No .photo-container found');
    return;
  }

  // Clear existing content
  photoContainer.innerHTML = '';

  CarouselState.photos.forEach((photo, index) => {
    console.log(`📷 Rendering photo ${index + 1}: ${photo.image}`);

    const photoElement = document.createElement('div');
    photoElement.className = `gallery-photo ${index === 0 ? 'active' : ''}`;
    photoElement.setAttribute('data-photo-index', index);

    photoElement.innerHTML = `
      <img 
        src="${photo.image}" 
        alt="${photo.alt || `Travel photo ${index + 1}`}"
        loading="${index === 0 ? 'eager' : 'lazy'}"
        style="width: 100%; height: 100%; object-fit: cover;"
        onload="console.log('✅ Photo ${index + 1} loaded successfully')"
        onerror="console.error('❌ Photo ${index + 1} failed to load: ${photo.image}')"
      />
    `;

    photoContainer.appendChild(photoElement);
  });

  // Setup indicators and update info
  setupIndicatorDots();
  updatePhotoInfo();

  console.log('✅ Photos rendered successfully');
}

/**
 * MISSING FUNCTION: Setup indicator dots navigation
 */
function setupIndicatorDots() {
  console.log('📸 Setting up indicator dots...');

  const indicatorsContainer = document.querySelector('.gallery-indicators');
  if (!indicatorsContainer) {
    console.warn('⚠️ No gallery indicators container found');
    return;
  }

  // Clear existing dots
  indicatorsContainer.innerHTML = '';

  // Create dots for each photo
  CarouselState.photos.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = `indicator-dot ${index === 0 ? 'active' : ''}`;
    dot.setAttribute('data-photo-index', index);
    dot.setAttribute('aria-label', `Go to photo ${index + 1}`);

    dot.addEventListener('click', (e) => {
      e.preventDefault();
      console.log(`📸 Indicator dot ${index + 1} clicked`);
      navigateToPhoto(index);
      pauseAutoPlay();
    });

    indicatorsContainer.appendChild(dot);
  });

  console.log(`📸 Created ${CarouselState.photos.length} indicator dots`);
}

/**
 * Setup carousel controls
 */
function setupCarouselControls() {
  console.log('📸 Setting up carousel controls...');

  // Previous/Next buttons
  const prevBtn = document.querySelector('[data-gallery-nav="prev"]');
  const nextBtn = document.querySelector('[data-gallery-nav="next"]');
  const playPauseBtn = document.querySelector('[data-gallery-control="toggle"]');

  if (prevBtn) {
    console.log('📸 Setting up previous button');
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('📸 Previous button clicked');
      navigateToPhoto(CarouselState.currentIndex - 1);
      pauseAutoPlay();
    });
  } else {
    console.warn('⚠️ Previous button not found');
  }

  if (nextBtn) {
    console.log('📸 Setting up next button');
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('📸 Next button clicked');
      navigateToPhoto(CarouselState.currentIndex + 1);
      pauseAutoPlay();
    });
  } else {
    console.warn('⚠️ Next button not found');
  }

  if (playPauseBtn) {
    console.log('📸 Setting up play/pause button');
    playPauseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('📸 Play/pause button clicked');
      toggleAutoPlay();
    });
  } else {
    console.warn('⚠️ Play/pause button not found');
  }
}

/**
 * MISSING FUNCTION: Setup touch gestures
 */
function setupTouchGestures() {
  console.log('📸 Setting up touch gestures...');

  const galleryDisplay = document.querySelector('.gallery-display');
  if (!galleryDisplay) {
    console.warn('⚠️ Gallery display not found for touch gestures');
    return;
  }

  galleryDisplay.addEventListener(
    'touchstart',
    (e) => {
      CarouselState.touchStartX = e.touches[0].clientX;
    },
    { passive: true }
  );

  galleryDisplay.addEventListener(
    'touchend',
    (e) => {
      CarouselState.touchEndX = e.changedTouches[0].clientX;
      handleSwipe();
    },
    { passive: true }
  );

  console.log('📸 Touch gestures setup complete');
}

/**
 * MISSING FUNCTION: Handle swipe gestures
 */
function handleSwipe() {
  const swipeThreshold = 50;
  const swipeDistance = CarouselState.touchStartX - CarouselState.touchEndX;

  if (Math.abs(swipeDistance) > swipeThreshold) {
    if (swipeDistance > 0) {
      // Swipe left - next photo
      console.log('📸 Swipe left detected - next photo');
      navigateToPhoto(CarouselState.currentIndex + 1);
    } else {
      // Swipe right - previous photo
      console.log('📸 Swipe right detected - previous photo');
      navigateToPhoto(CarouselState.currentIndex - 1);
    }
    pauseAutoPlay();
  }
}

/**
 * MISSING FUNCTION: Setup keyboard navigation
 */
function setupKeyboardNavigation() {
  console.log('📸 Setting up keyboard navigation...');

  document.addEventListener('keydown', (e) => {
    const carousel = document.querySelector('.photo-gallery');
    if (!carousel || !isElementInViewport(carousel)) return;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        console.log('📸 Left arrow pressed');
        navigateToPhoto(CarouselState.currentIndex - 1);
        pauseAutoPlay();
        break;
      case 'ArrowRight':
        e.preventDefault();
        console.log('📸 Right arrow pressed');
        navigateToPhoto(CarouselState.currentIndex + 1);
        pauseAutoPlay();
        break;
      case ' ': // Spacebar
        e.preventDefault();
        console.log('📸 Spacebar pressed');
        toggleAutoPlay();
        break;
    }
  });
}

/**
 * Navigate to specific photo
 */
function navigateToPhoto(index) {
  console.log(`📸 Navigating to photo ${index + 1}`);

  // Handle wrap-around
  if (index < 0) {
    index = CarouselState.totalPhotos - 1;
  } else if (index >= CarouselState.totalPhotos) {
    index = 0;
  }

  CarouselState.currentIndex = index;
  console.log(`📸 Current index: ${CarouselState.currentIndex}`);

  updatePhotoDisplay();
  updateIndicators();
  updatePhotoInfo();
}

/**
 * Update photo display
 */
function updatePhotoDisplay() {
  const photos = document.querySelectorAll('.gallery-photo');
  console.log(`📸 Updating display for ${photos.length} photos`);

  photos.forEach((photo, index) => {
    const isActive = index === CarouselState.currentIndex;
    photo.classList.toggle('active', isActive);
  });
}

/**
 * MISSING FUNCTION: Update indicators
 */
function updateIndicators() {
  const dots = document.querySelectorAll('.indicator-dot');

  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === CarouselState.currentIndex);
  });
}

/**
 * MISSING FUNCTION: Update photo information overlay
 */
function updatePhotoInfo() {
  const currentPhoto = CarouselState.photos[CarouselState.currentIndex];
  if (!currentPhoto) return;

  // Update location
  const locationText = document.querySelector('.location-text');
  if (locationText) {
    locationText.textContent = currentPhoto.location || 'Location';
  }

  // Update caption
  const captionText = document.querySelector('.photo-caption p');
  if (captionText) {
    captionText.textContent = currentPhoto.caption || 'Photo caption...';
  }

  // Update counter
  const counter = document.querySelector('.photo-counter');
  if (counter) {
    counter.textContent = `${CarouselState.currentIndex + 1} / ${CarouselState.totalPhotos}`;
  }

  // Update Instagram link
  const instagramLink = document.querySelector('.instagram-link');
  if (instagramLink && currentPhoto.url !== '#') {
    instagramLink.href = currentPhoto.url;
    instagramLink.style.display = 'flex';
  } else if (instagramLink) {
    instagramLink.style.display = 'none';
  }
}

/**
 * MISSING FUNCTION: Toggle auto-play
 */
function toggleAutoPlay() {
  if (CarouselState.isPlaying) {
    pauseAutoPlay();
  } else {
    startAutoPlay();
  }
}

/**
 * MISSING FUNCTION: Start auto-play
 */
function startAutoPlay() {
  CarouselState.isPlaying = true;

  CarouselState.autoPlayInterval = setInterval(() => {
    navigateToPhoto(CarouselState.currentIndex + 1);
  }, 4000); // 4 seconds per photo

  updatePlayPauseButton();
  console.log('▶️ Auto-play started');
}

/**
 * MISSING FUNCTION: Pause auto-play
 */
function pauseAutoPlay() {
  CarouselState.isPlaying = false;

  if (CarouselState.autoPlayInterval) {
    clearInterval(CarouselState.autoPlayInterval);
    CarouselState.autoPlayInterval = null;
  }

  updatePlayPauseButton();
  console.log('⏸️ Auto-play paused');
}

/**
 * MISSING FUNCTION: Update play/pause button
 */
function updatePlayPauseButton() {
  const playIcon = document.querySelector('.play-icon');
  const pauseIcon = document.querySelector('.pause-icon');
  const controlLabel = document.querySelector('.control-label');

  if (playIcon && pauseIcon) {
    if (CarouselState.isPlaying) {
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';
    } else {
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
    }
  }

  if (controlLabel) {
    controlLabel.textContent = CarouselState.isPlaying ? 'Playing...' : 'Auto-play';
  }
}

/**
 * MISSING FUNCTION: Check if element is in viewport
 */
function isElementInViewport(element) {
  const rect = element.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

/**
 * Show fallback content
 */
function showCarouselFallback() {
  const gallery = document.querySelector('.photo-gallery');
  if (!gallery) return;

  gallery.innerHTML = `
    <div class="carousel-fallback" style="
      text-align: center;
      padding: 2rem;
      background: var(--color-surface);
      border-radius: var(--radius-xl);
      border: 1px solid rgba(0, 0, 0, 0.1);
      min-height: 400px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    ">
      <div style="font-size: 4rem; margin-bottom: 1rem;">📸</div>
      <h3 style="margin-bottom: 1rem; color: var(--color-text);">Photo Gallery</h3>
      <p style="margin-bottom: 2rem; color: var(--color-text-secondary);">
        Photos will be displayed here when configured.
      </p>
      <a href="https://instagram.com/yourusername" 
         target="_blank" 
         rel="noopener noreferrer" 
         class="btn btn-secondary"
         style="padding: 0.75rem 1.5rem; background: var(--brand-primary); color: white; text-decoration: none; border-radius: 25px;">
        View on Instagram
      </a>
    </div>
  `;

  console.log('🔄 Carousel fallback content displayed');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('📸 DOM loaded, checking for photo carousel...');

  // Wait a bit for components to load
  setTimeout(() => {
    const photoGallery = document.querySelector('.photo-gallery');
    if (photoGallery) {
      console.log('📸 Photo gallery detected after delay, initializing...');
      initializePhotoCarousel();
    } else {
      console.log('📸 No photo gallery found after delay');
    }
  }, 1000);
});

// Also try when window loads
window.addEventListener('load', () => {
  if (!CarouselState.initialized) {
    console.log('📸 Window loaded, trying to initialize carousel...');
    initializePhotoCarousel();
  }
});

// Export for debugging
window.PhotoCarousel = {
  state: CarouselState,
  initialize: initializePhotoCarousel,
  navigate: navigateToPhoto,
  debug: () => {
    console.log('📸 Carousel Debug Info:');
    console.log('- Initialized:', CarouselState.initialized);
    console.log('- Photos loaded:', CarouselState.photos.length);
    console.log('- Current index:', CarouselState.currentIndex);
    console.log('- Gallery element:', document.querySelector('.photo-gallery'));
    console.log('- Photo container:', document.querySelector('.photo-container'));
    console.log('- Navigation buttons:', {
      prev: document.querySelector('[data-gallery-nav="prev"]'),
      next: document.querySelector('[data-gallery-nav="next"]'),
    });
  },
};

console.log('📸 Photo carousel script loaded - use PhotoCarousel.debug() to check status');
