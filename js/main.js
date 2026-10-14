/* CENTAUR PRODUCTIONS — navigation and language preference */
document.addEventListener("DOMContentLoaded", function () {
  const menu = document.querySelector(".menu");
  const logo = document.querySelector(".nav-logo");
  if (menu && logo) window.addEventListener("scroll", function () {
    if (window.scrollY > 80) menu.classList.add("visible"); else menu.classList.remove("visible");
    if (window.scrollY > 350) logo.classList.add("hidden"); else logo.classList.remove("hidden");
  });

  const params = new URLSearchParams(window.location.search);
  const chosen = params.get("lang");

  // Restore the scroll position passed in the language-switch URL.
  const scrollParam = params.get("scroll");
  let targetScroll = scrollParam !== null ? Number(scrollParam) : null;
  if (targetScroll === null || !Number.isFinite(targetScroll)) {
    try {
      const saved = sessionStorage.getItem("centaurLanguageScrollY");
      if (saved !== null) targetScroll = Number(saved);
    } catch (e) {}
  }
  if (targetScroll !== null && Number.isFinite(targetScroll) && targetScroll >= 0) {
    const restore = function () {
      window.scrollTo({ top: targetScroll, left: 0, behavior: "instant" });
    };
    // Retry after layout and images/fonts have had time to settle.
    requestAnimationFrame(restore);
    window.addEventListener("load", restore, { once: true });
    window.addEventListener("pageshow", restore, { once: true });
    setTimeout(restore, 150);
    setTimeout(restore, 500);
    setTimeout(restore, 1000);
    try { sessionStorage.removeItem("centaurLanguageScrollY"); } catch (e) {}
    params.delete("scroll");
    const cleanUrl = window.location.pathname + (params.toString() ? "?" + params.toString() : "") + window.location.hash;
    window.history.replaceState(null, "", cleanUrl);
  }

  if (chosen && ["en","el","de"].includes(chosen)) {
    try { localStorage.setItem("centaurLanguage", chosen); } catch(e) {}
  }

  document.querySelectorAll(".language-switch a").forEach(function(link) {
    link.addEventListener("click", function() {
      const h = link.getAttribute("href") || "";
      const label = (link.textContent || "").trim();
      const lang = label === "DE" || h.includes("lang=de") || h.includes("/de/") ? "de" : label === "ΕΛ" || h.includes("lang=el") || h.includes("/gr/") ? "el" : "en";
      try {
        localStorage.setItem("centaurLanguage", lang);
        sessionStorage.setItem("centaurLanguageScrollY", String(window.scrollY));
      } catch(e) {}
      // Put the scroll position in the destination URL as a reliable fallback.
      try {
        const destination = new URL(link.href, window.location.href);
        destination.searchParams.set("scroll", String(window.scrollY));
        link.href = destination.pathname + destination.search + destination.hash;
      } catch(e) {}
    });
  });

  if ((window.location.pathname === "/" || window.location.pathname === "/index.html") && !chosen) {
    let preferred = ""; try { preferred = localStorage.getItem("centaurLanguage") || ""; } catch(e) {}
    if (preferred === "de") { window.location.replace("/de/"); return; }
    if (preferred === "el") { window.location.replace("/gr/"); return; }
    if (!preferred) {
      const browserLang = (navigator.languages && navigator.languages[0]) || navigator.language || "";
      if (/^de(?:-|$)/i.test(browserLang)) { window.location.replace("/de/"); return; }
      if (/^el(?:-|$)/i.test(browserLang)) { window.location.replace("/gr/"); return; }
    }
  }
});
