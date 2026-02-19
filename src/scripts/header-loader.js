/**
 * Header Component Loader
 * Loads the shared project header navigation into pages
 */
(function() {
  'use strict';
  
  /**
   * Load header component from external file
   */
  function loadHeader() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (!headerPlaceholder) {
      console.warn('Header placeholder not found');
      return;
    }
    
    fetch('/src/components/project-header.html')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(html => {
        headerPlaceholder.innerHTML = html;
        
        // Initialize mobile navigation after header is loaded
        if (typeof window.initMobileNav === 'function') {
          window.initMobileNav();
        }
        
        // Initialize header scroll behavior
        initHeaderScroll();

        // Ensure consent script is loaded on pages that use the header
        try {
          if (!document.querySelector('script[src="/scripts/consent.js"]')) {
            const cs = document.createElement('script');
            cs.src = '/scripts/consent.js';
            cs.defer = true;
            document.head.appendChild(cs);
          }
        } catch (e) {
          console.warn('Could not inject consent script', e);
        }
      })
      .catch(error => {
        console.error('Error loading header:', error);
      });
  }
  
  /**
   * Initialize header scroll behavior (transparent to white)
   */
  function initHeaderScroll() {
    const header = document.querySelector('.main-header');
    const hero = document.querySelector('.hero');
    
    if (!header || !hero) return;
    
    function handleScroll() {
      const heroHeight = hero.offsetHeight;
      if (window.scrollY > heroHeight - 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
  }
  
  // Load header when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadHeader);
  } else {
    loadHeader();
  }
})();
