(function () {
  const defaults = {
    reservationUrl: "https://reserve.quick-reserve.com/lien?view=eyJ2ZXJzaW9uIjoyLCJzdG9yZXMiOlt7ImlkIjoyMDV9XX0%3D",
    lineUrl: "https://lin.ee/REPLACE_ME",
    phoneUrl: "tel:0000000000",
    thanksUrl: "thanks.html",
    googleMapUrl: "",
    videoEmbedUrl: "",
    ga4Id: "",
    metaPixelId: ""
  };

  const config = Object.assign({}, defaults, window.LIEN_LP_CONFIG || {});

  function loadTracking() {
    if (config.ga4Id) {
      const ga = document.createElement("script");
      ga.async = true;
      ga.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(config.ga4Id);
      document.head.appendChild(ga);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date());
      window.gtag("config", config.ga4Id);
    }

    if (config.metaPixelId) {
      /* eslint-disable */
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
      (window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
      /* eslint-enable */
      window.fbq("init", config.metaPixelId);
      window.fbq("track", "PageView");
    }
  }

  loadTracking();

  function withParams(url) {
    if (!url || url.startsWith("#") || url.startsWith("tel:") || url.startsWith("mailto:")) return url;
    const current = new URLSearchParams(window.location.search);
    const keep = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"];
    const target = new URL(url, window.location.href);
    keep.forEach((key) => {
      if (current.has(key) && !target.searchParams.has(key)) target.searchParams.set(key, current.get(key));
    });
    return target.toString();
  }

  function track(name, params) {
    if (typeof window.gtag === "function") window.gtag("event", name, params || {});
    if (typeof window.fbq === "function") window.fbq("trackCustom", name, params || {});
  }

  function setHref(selector, url, label) {
    document.querySelectorAll(selector).forEach((el) => {
      el.href = withParams(url);
      el.addEventListener("click", () => track("lp_click", { label }));
    });
  }

  setHref("[data-link='reservation']", config.reservationUrl, "reservation");
  setHref("[data-link='line']", config.lineUrl, "line");
  setHref("[data-link='phone']", config.phoneUrl, "phone");
  setHref("[data-link='map']", config.googleMapUrl || "#access", "map");

  function mountEmbed(selector, url, title) {
    if (!url) return;
    const slot = document.querySelector(selector);
    if (!slot) return;
    const iframe = document.createElement("iframe");
    iframe.src = url;
    iframe.title = title;
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    slot.appendChild(iframe);
    slot.style.display = "block";
  }

  mountEmbed("[data-video-slot]", config.videoEmbedUrl, "整体Lien 紹介動画");
  mountEmbed("[data-map-slot]", config.googleMapUrl, "整体Lien Google Map");

  function initRevealAnimation() {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = document.querySelectorAll([
      ".intro-photo",
      ".section-pad:not(.intro-photo)",
      ".reviews-section",
      ".faq-section",
      ".top-cards .mini-card",
      ".hero-proof > p",
      ".photo-card",
      ".trust-grid > div",
      ".assurance-grid > div",
      ".campaign-card",
      ".price-card",
      ".cta-block",
      ".worry-list > p",
      ".logic-list > div",
      ".method-steps > div",
      ".feature-list article",
      ".recommend-card",
      ".flow-list > div",
      ".review-card",
      ".faq-item",
      ".access-card",
      ".access-note",
      ".button"
    ].join(","));

    if (!targets.length) return;

    const revealTargets = Array.from(targets).filter((el) => !el.closest(".hero"));
    if (!revealTargets.length) return;

    revealTargets.forEach((el) => el.classList.add("reveal"));

    if (prefersReduced || !("IntersectionObserver" in window)) {
      revealTargets.forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.12
    });

    revealTargets.forEach((el) => observer.observe(el));
  }

  initRevealAnimation();

  document.querySelectorAll("[data-faq-item]").forEach((item) => {
    const button = item.querySelector("[data-faq-button]");
    const answer = item.querySelector(".faq-answer");
    const icon = item.querySelector("[data-faq-icon]");
    if (!button || !answer) return;

    button.addEventListener("click", () => {
      const isOpen = item.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
      answer.setAttribute("aria-hidden", String(!isOpen));
      if (icon) icon.textContent = isOpen ? "−" : "＋";
    });
  });

  const sticky = document.querySelector("[data-sticky-cta]");
  const footer = document.querySelector("#final-cta");
  if (sticky) {
    let footerVisible = false;
    const updateSticky = () => {
      const pastFirstView = window.scrollY > Math.min(760, window.innerHeight * 0.86);
      sticky.classList.toggle("is-visible", pastFirstView && !footerVisible);
      sticky.classList.toggle("is-hidden", footerVisible);
    };

    window.addEventListener("scroll", updateSticky, { passive: true });
    window.addEventListener("resize", updateSticky);
    updateSticky();

    if (footer && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        footerVisible = entries.some((entry) => entry.isIntersecting);
        updateSticky();
      }, { threshold: 0.2 });
      observer.observe(footer);
    }
  }
})();
