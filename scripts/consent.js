/* Consent Banner + conditional analytics loader */
(function(){
  'use strict';

  const CONSENT_KEY = 'anika_consent_preferences';
  const ANALYTICS_SRC = '/src/scripts/analytics.js';

  function readPrefs(){
    try{
      const raw = localStorage.getItem(CONSENT_KEY);
      return raw ? JSON.parse(raw) : null;
    }catch(e){ return null; }
  }

  function savePrefs(prefObj){
    try{ localStorage.setItem(CONSENT_KEY, JSON.stringify(prefObj)); }catch(e){}
  }

  function loadAnalyticsWithPrefs(prefs){
    if (!prefs) return;
    if (window.__analytics_loaded) return;
    const s = document.createElement('script');
    s.src = ANALYTICS_SRC;
    s.defer = true;
    s.onload = function(){
      try{ if (typeof window.initAnalyticsManager === 'function') window.initAnalyticsManager({ ga: !!prefs.ga, hotjar: !!prefs.hotjar }); }catch(e){ console.warn(e); }
    };
    document.head.appendChild(s);
    window.__analytics_loaded = true;
  }

  function createBanner(){
    if (document.getElementById('consent-banner')) return;
    const banner = document.createElement('div');
    banner.id = 'consent-banner';
    banner.style.position = 'fixed'; banner.style.left='1rem'; banner.style.right='1rem'; banner.style.bottom='1rem';
    banner.style.zIndex='99999'; banner.style.background='#fff'; banner.style.padding='1rem'; banner.style.borderRadius='10px';
    banner.style.boxShadow='0 8px 32px rgba(0,0,0,0.12)'; banner.style.display='flex'; banner.style.alignItems='center'; banner.style.gap='1rem';

    const text = document.createElement('div'); text.style.flex='1 1 auto'; text.innerHTML='<strong>Cookies & Tracking</strong><div style="margin-top:6px">Diese Seite verwendet Analytics (Google Analytics & Hotjar). Du kannst flexibel zustimmen.</div>';

    const buttons = document.createElement('div'); buttons.style.display='flex'; buttons.style.gap='0.5rem';

    const settingsBtn = document.createElement('button'); settingsBtn.textContent='Einstellungen'; settingsBtn.style.padding='0.5rem 0.8rem';
    const acceptAll = document.createElement('button'); acceptAll.textContent='Alle akzeptieren'; acceptAll.style.background='#ffb800'; acceptAll.style.border='none'; acceptAll.style.padding='0.5rem 0.8rem';
    const rejectAll = document.createElement('button'); rejectAll.textContent='Ablehnen'; rejectAll.style.padding='0.5rem 0.8rem';

    settingsBtn.addEventListener('click', showSettingsModal);
    acceptAll.addEventListener('click', function(){ const pref={ga:true,hotjar:true}; savePrefs(pref); loadAnalyticsWithPrefs(pref); removeBanner(); });
    rejectAll.addEventListener('click', function(){ const pref={ga:false,hotjar:false}; savePrefs(pref); removeBanner(); });

    buttons.appendChild(rejectAll); buttons.appendChild(settingsBtn); buttons.appendChild(acceptAll);
    banner.appendChild(text); banner.appendChild(buttons); document.body.appendChild(banner);
  }

  function removeBanner(){ const b=document.getElementById('consent-banner'); if(b) b.remove(); }

  function showSettingsModal(){
    if (document.getElementById('consent-modal')) return;
    const existing = readPrefs() || {ga:false,hotjar:false};
    const modal = document.createElement('div'); modal.id='consent-modal';
    modal.style.position='fixed'; modal.style.left='50%'; modal.style.top='50%'; modal.style.transform='translate(-50%,-50%)';
    modal.style.zIndex='100000'; modal.style.background='#fff'; modal.style.padding='1.2rem'; modal.style.borderRadius='10px'; modal.style.boxShadow='0 12px 48px rgba(0,0,0,0.18)'; modal.style.minWidth='320px';

    modal.innerHTML = `
      <h3>Tracking-Einstellungen</h3>
      <div style="margin-top:0.6rem">
        <label style="display:flex;align-items:center;gap:10px"><input type="checkbox" id="consent-ga"> Google Analytics (anonymisiert)</label>
      </div>
      <div style="margin-top:0.6rem">
        <label style="display:flex;align-items:center;gap:10px"><input type="checkbox" id="consent-hj"> Hotjar (Heatmaps)</label>
      </div>
      <div style="margin-top:1rem;display:flex;gap:0.5rem;justify-content:flex-end">
        <button id="consent-cancel" style="padding:0.5rem 0.8rem">Abbrechen</button>
        <button id="consent-save" style="padding:0.5rem 0.8rem;background:#ffb800;border:none">Speichern</button>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('consent-ga').checked = !!existing.ga;
    document.getElementById('consent-hj').checked = !!existing.hotjar;

    document.getElementById('consent-cancel').addEventListener('click', function(){ modal.remove(); });
    document.getElementById('consent-save').addEventListener('click', function(){
      const prefs = { ga: !!document.getElementById('consent-ga').checked, hotjar: !!document.getElementById('consent-hj').checked };
      savePrefs(prefs);
      if (prefs.ga || prefs.hotjar) loadAnalyticsWithPrefs(prefs);
      modal.remove(); removeBanner();
    });
  }

  // opt-out helper used by opt-out.html too
  window.__anika_set_consent = function(prefs){ try{ savePrefs(prefs); }catch(e){} };

  // init
  document.addEventListener('DOMContentLoaded', function(){
    const prefs = readPrefs();
    if (prefs) {
      if (prefs.ga || prefs.hotjar) loadAnalyticsWithPrefs(prefs);
      return;
    }
    createBanner();
  });

})();
