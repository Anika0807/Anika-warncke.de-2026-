// Lazy Loading Implementation
class LazyLoader {
  constructor() {
    this.imageObserver = null;
    this.init();
  }

  init() {
    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
      this.imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            this.loadImage(img);
            observer.unobserve(img);
          }
        });
      }, {
        // Load images 50px before they enter viewport
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      this.observeImages();
    } else {
      // Fallback for older browsers
      this.loadAllImages();
    }
  }

  observeImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      this.imageObserver.observe(img);
    });
  }

  loadImage(img) {
    // Show loading placeholder
    img.classList.add('loading');
    
    const actualImage = new Image();
    actualImage.onload = () => {
      img.src = actualImage.src;
      img.classList.remove('loading');
      img.classList.add('loaded');
    };
    
    actualImage.onerror = () => {
      img.classList.remove('loading');
      img.classList.add('error');
    };
    
    // Load the actual image
    actualImage.src = img.dataset.src;
    
    // Remove data-src after loading
    img.removeAttribute('data-src');
  }

  loadAllImages() {
    // Fallback: load all images immediately
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new LazyLoader();
});

// Re-initialize for dynamically added content
window.reinitializeLazyLoading = () => {
  new LazyLoader();
};