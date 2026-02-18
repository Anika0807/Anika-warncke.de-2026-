/**
 * Mobile Navigation Enhancement
 * Provides responsive hamburger menu for mobile devices
 */

(function() {
  'use strict';
  
  // Constants
  const MOBILE_BREAKPOINT = 768;
  
  // Create hamburger menu button
  function createHamburgerButton() {
    const button = document.createElement('button');
    button.className = 'mobile-nav-toggle';
    button.setAttribute('aria-label', 'Toggle navigation menu');
    button.setAttribute('aria-expanded', 'false');
    button.innerHTML = `
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    `;
    return button;
  }

  // Initialize mobile navigation
  function initMobileNav() {
    const nav = document.querySelector('nav');
    const navList = document.querySelector('nav ul');
    
    console.log('Mobile nav init:', {nav, navList});
    
    if (!nav || !navList) {
      console.error('Nav or navList not found!');
      return;
    }
    
    // Check if hamburger already exists
    let hamburger = document.querySelector('.mobile-nav-toggle');
    if (!hamburger) {
      console.log('Creating hamburger button');
      // Create and insert hamburger button
      hamburger = createHamburgerButton();
      nav.insertBefore(hamburger, navList);
      console.log('Hamburger button added');
    } else {
      console.log('Hamburger already exists, using existing one');
    }
    
    // Toggle menu
    function openMenuUI() {
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.classList.add('active');
      navList.classList.add('mobile-menu-open');
      document.body.classList.add('mobile-menu-active');
    }

    function closeMenuUI() {
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.classList.remove('active');
      navList.classList.remove('mobile-menu-open');
      document.body.classList.remove('mobile-menu-active');
    }

    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      console.log('Hamburger clicked, expanding:', !isExpanded);
      if (isExpanded) {
        closeMenuUI();
      } else {
        openMenuUI();
      }
    });

    // Close menu when clicking outside (but not on menu items)
    document.addEventListener('click', function(e) {
      const isMenuLink = e.target.closest('nav ul a');
      if (!isMenuLink && !nav.contains(e.target) && navList.classList.contains('mobile-menu-open')) {
        closeMenuUI();
      }
    });
    
    // Close menu when clicking on a link (but allow navigation)
    const navLinks = navList.querySelectorAll('a');
    console.log('Found nav links:', navLinks.length);
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        console.log('Link clicked:', this.href);
        // Don't prevent default - let the link work
        // Just close the menu
        setTimeout(() => {
          closeMenuUI();
        }, 100);
      });
    });
    
    // Handle resize
    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        if (window.innerWidth > MOBILE_BREAKPOINT) {
          closeMenuUI();
        }
      }, 250);
    });
  }
  
  // Export function to global scope for use by header-loader
  window.initMobileNav = initMobileNav;
  
  // Initialize when DOM is ready (for backwards compatibility)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileNav);
  } else {
    initMobileNav();
  }
})();
