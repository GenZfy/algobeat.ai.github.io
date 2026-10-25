(() => {
  "use strict";

  const measurementId = document.currentScript?.dataset.measurementId || "";
  if (!/^G-[A-Z0-9]+$/.test(measurementId) || window.__algobeatAnalyticsConsent) return;
  window.__algobeatAnalyticsConsent = true;

  const storageKey = "algobeat.analytics-consent.v1";
  const disableKey = `ga-disable-${measurementId}`;
  const productionHost = location.protocol === "https:" && ["algobeat.ai", "www.algobeat.ai"].includes(location.hostname);
  const denied = {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  };
  const granted = { ...denied, analytics_storage: "granted" };
  let started = false;
  let mounted = false;
  let panel;
  let settings;

  function readChoice() {
    try {
      const value = localStorage.getItem(storageKey);
      return value === "accepted" || value === "declined" ? value : null;
    } catch {
      return null;
    }
  }

  let choice = readChoice();
  window[disableKey] = true;

  function startAnalytics() {
    // Local previews and GitHub preview hostnames never send production traffic.
    if (!productionHost) return;
    window[disableKey] = false;
    if (started) {
      window.gtag("consent", "update", granted);
      return;
    }
    started = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "default", denied);
    window.gtag("set", {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      ads_data_redaction: true,
      url_passthrough: false,
    });
    window.gtag("consent", "update", granted);
    window.gtag("js", new Date());
    let referrer = "";
    try { referrer = document.referrer ? new URL(document.referrer).origin : ""; } catch {}
    window.gtag("config", measurementId, {
      send_page_view: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_domain: "none",
      cookie_flags: "SameSite=Lax;Secure",
      page_location: location.origin + location.pathname,
      page_referrer: referrer,
      page_title: "AlgoBeat",
    });
    const tag = document.createElement("script");
    tag.async = true;
    tag.referrerPolicy = "origin";
    tag.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(tag);
  }

  function stopAnalytics() {
    // Set the opt-out flag before updating consent, including while gtag is loading.
    window[disableKey] = true;
    if (!started) return;
    window.gtag("consent", "update", denied);
    // This installation uses host-only cookies, scoped to the root path.
    for (const name of ["_ga", `_ga_${measurementId.slice(2)}`]) {
      try { document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax; Secure`; } catch {}
    }
  }

  function applyChoice() {
    if (!mounted) return;
    if (choice === "accepted") startAnalytics();
    else stopAnalytics();
    panel.hidden = choice !== null;
    settings.hidden = choice === null;
    settings.setAttribute("aria-expanded", String(!panel.hidden));
  }

  function choose(value) {
    choice = value;
    try { localStorage.removeItem(storageKey); } catch {}
    try { localStorage.setItem(storageKey, value); } catch {}
    applyChoice();
    settings.focus();
  }

  function mount() {
    if (mounted) return;
    mounted = true;
    const style = document.createElement("style");
    style.textContent = `
      #ab-analytics-consent,#ab-analytics-settings{box-sizing:border-box;position:fixed;z-index:10001;font:14px/1.5 system-ui,sans-serif;color:#e8f1f5;background:#0d1420;border:1px solid #536475;border-radius:12px;box-shadow:0 6px 28px #0005}
      #ab-analytics-consent{right:16px;bottom:16px;width:min(420px,calc(100vw - 32px));padding:20px}
      #ab-analytics-consent h2{font-size:17px;margin:0 0 8px;color:inherit}
      #ab-analytics-consent p{margin:0 0 14px}
      #ab-analytics-consent .ab-consent-actions{display:flex;gap:12px}
      #ab-analytics-consent button,#ab-analytics-settings{padding:10px 16px;font:inherit;cursor:pointer}
      #ab-analytics-consent button{flex:1;color:inherit;background:#17283a;border:1px solid #7993a8;border-radius:6px}
      #ab-analytics-settings{left:16px;bottom:16px}
      #ab-analytics-consent button:focus-visible,#ab-analytics-settings:focus-visible{outline:3px solid #4fd8e8;outline-offset:3px}
      #ab-analytics-consent[hidden],#ab-analytics-settings[hidden]{display:none}
    `;
    document.head.appendChild(style);
    panel = document.createElement("section");
    panel.id = "ab-analytics-consent";
    panel.setAttribute("aria-labelledby", "ab-analytics-title");
    const heading = document.createElement("h2");
    heading.id = "ab-analytics-title";
    heading.textContent = "Allow visit analytics?";
    const description = document.createElement("p");
    description.textContent = "With your permission, Google Analytics uses cookies to measure visits and device/browser information. Advertising features are off. We remember your choice in this browser when storage is available. You can change it using Analytics settings.";
    const actions = document.createElement("div");
    actions.className = "ab-consent-actions";
    for (const [label, value] of [["Accept", "accepted"], ["Decline", "declined"]]) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.addEventListener("click", () => choose(value));
      actions.appendChild(button);
    }
    panel.append(heading, description, actions);
    settings = document.createElement("button");
    settings.id = "ab-analytics-settings";
    settings.type = "button";
    settings.textContent = "Analytics settings";
    settings.setAttribute("aria-controls", panel.id);
    settings.addEventListener("click", () => {
      panel.hidden = false;
      settings.hidden = true;
      settings.setAttribute("aria-expanded", "true");
      panel.querySelector("button").focus();
    });
    document.body.append(panel, settings);
    applyChoice();
  }

  // The bundled landing page replaces documentElement before this event.
  window.addEventListener("algobeat:splash-complete", mount, { once: true });
  if (window.__algobeatSplashComplete) mount();
  window.addEventListener("storage", (event) => {
    if (event.key !== storageKey && event.key !== null) return;
    choice = readChoice();
    applyChoice();
  });
})();
