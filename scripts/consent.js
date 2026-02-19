/* Consent Banner + conditional analytics loader */
(function(){
  'use strict';

  const CONSENT_KEY = 'anika_consent_analytics';
  const ANALYTICS_SRC = '/src/scripts/analytics.js';

  function hasConsent(){
    return localStorage.getItem(CONSENT_KEY) === 'granted';
  }

  function setConsent(value){
    localStorage.setItem(CONSENT_KEY, value ? 'granted' : 'denied');
  }

  function loadAnalytics(){
    if (window.__analytics_loaded) return;
    const s = document.createElement('script');
    s.src = ANALYTICS_SRC;
    s.defer = true;
    document.head.appendChild(s);
    window.__analytics_loaded = true;
  }

  function createBanner(){
    if (document.getElementById('consent-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'consent-banner';
    banner.style.position = 'fixed';
    banner.style.left = '1rem';
    banner.style.right = '1rem';
    banner.style.bottom = '1rem';
    banner.style.zIndex = '99999';
    banner.style.background = '#fff';
    banner.style.border = '1px solid rgba(0,0,0,0.08)';
    banner.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)';
    banner.style.padding = '1rem 1rem';
    banner.style.borderRadius = '10px';
    banner.style.display = 'flex';
    banner.style.alignItems = 'center';
    banner.style.gap = '1rem';

    const text = document.createElement('div');
    text.style.flex = '1 1 auto';
    text.style.fontSize = '0.95rem';
    text.innerHTML = '<strong>Cookies & Tracking</strong><div style="margin-top:6px">Diese Website verwendet Analytics, um Nutzung zu verbessern. Du kannst zustimmen oder ablehnen.</div>';

    const buttons = document.createElement('div');
    buttons.style.display = 'flex';
    buttons.style.gap = '0.5rem';

    const accept = document.createElement('button');
    accept.textContent = 'Alle akzeptieren';
    accept.style.background = '#ffb800';
    accept.style.border = 'none';
    accept.style.padding = '0.6rem 0.9rem';
    accept.style.borderRadius = '6px';
    accept.style.cursor = 'pointer';

    const reject = document.createElement('button');
    reject.textContent = 'Ablehnen';
    reject.style.background = '#f1f1f1';
    reject.style.border = '1px solid rgba(0,0,0,0.06)';
    reject.style.padding = '0.6rem 0.9rem';
    reject.style.borderRadius = '6px';
    reject.style.cursor = 'pointer';

    accept.addEventListener('click', function(){
      setConsent(true);
      loadAnalytics();
      removeBanner();
    });

    reject.addEventListener('click', function(){
      setConsent(false);
      removeBanner();
    });

    buttons.appendChild(reject);
    buttons.appendChild(accept);
    banner.appendChild(text);
    banner.appendChild(buttons);

    document.body.appendChild(banner);
  }

  function removeBanner(){
    const b = document.getElementById('consent-banner');
    if (b) b.parentNode.removeChild(b);
  }

  // initialize
  document.addEventListener('DOMContentLoaded', () => {
    try{
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored === 'granted'){
        loadAnalytics();
        return;
      }
      if (stored === 'denied'){
        // do nothing
        return;
      }
      // ask user
      createBanner();
    }catch(e){
      console.warn('Consent init failed', e);
    }
  });

})();
