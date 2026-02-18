// Analytics & Tracking Configuration
class AnalyticsManager {
  constructor() {
    this.gaId = 'G-XXXXXXXXXX'; // Replace with actual Google Analytics ID
    this.hotjarId = 'XXXXXXX'; // Replace with actual Hotjar ID
    this.init();
  }

  init() {
    this.initGoogleAnalytics();
    this.initHotjar();
    this.setupContactFormTracking();
    this.setupPortfolioTracking();
  }

  // Google Analytics 4 Implementation
  initGoogleAnalytics() {
    // Load gtag script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', this.gaId, {
      page_title: document.title,
      page_location: window.location.href
    });

    // Make gtag available globally
    window.gtag = gtag;
  }

  // Hotjar Implementation
  initHotjar() {
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:this.hotjarId,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    }.bind(this))(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
  }

  // Contact Form Tracking
  setupContactFormTracking() {
    const contactForms = document.querySelectorAll('form[data-track="contact"]');
    contactForms.forEach(form => {
      form.addEventListener('submit', (e) => {
        this.trackEvent('contact_form_submit', {
          form_id: form.id || 'contact_form',
          page_title: document.title
        });
      });
    });

    // Track contact button clicks
    const contactButtons = document.querySelectorAll('a[href*="contact"], .btn-contact');
    contactButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.trackEvent('contact_button_click', {
          button_text: btn.textContent.trim(),
          page_title: document.title
        });
      });
    });
  }

  // Portfolio Interaction Tracking
  setupPortfolioTracking() {
    // Track project clicks
    const projectLinks = document.querySelectorAll('.portfolio-item a, .project-link');
    projectLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const projectName = this.getProjectName(link);
        this.trackEvent('project_view', {
          project_name: projectName,
          project_url: link.href
        });
      });
    });

    // Track carousel interactions
    const carouselButtons = document.querySelectorAll('.carousel-btn');
    carouselButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.trackEvent('carousel_interaction', {
          direction: btn.classList.contains('next') ? 'next' : 'prev',
          page_title: document.title
        });
      });
    });
  }

  // Utility Functions
  trackEvent(eventName, parameters = {}) {
    // Google Analytics tracking
    if (window.gtag) {
      gtag('event', eventName, parameters);
    }

    // Console log for debugging
    console.log('Analytics Event:', eventName, parameters);
  }

  getProjectName(element) {
    // Try to extract project name from various sources
    const img = element.querySelector('img');
    if (img && img.alt) return img.alt;
    
    const title = element.getAttribute('title');
    if (title) return title;
    
    const text = element.textContent.trim();
    if (text) return text;
    
    return 'Unknown Project';
  }

  // Page View Tracking
  trackPageView(page_title = document.title, page_location = window.location.href) {
    if (window.gtag) {
      gtag('config', this.gaId, {
        page_title: page_title,
        page_location: page_location
      });
    }
  }
}

// Initialize Analytics when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.analyticsManager = new AnalyticsManager();
});

// Function to manually track events
window.trackAnalyticsEvent = (eventName, parameters) => {
  if (window.analyticsManager) {
    window.analyticsManager.trackEvent(eventName, parameters);
  }
};