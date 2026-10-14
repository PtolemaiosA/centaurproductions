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
  if (chosen && ["en","el","de"].includes(chosen)) { try { localStorage.setItem("centaurLanguage", chosen); } catch(e) {} }
  document.querySelectorAll(".language-switch a").forEach(function(link) {
    link.addEventListener("click", function() {
      const h = link.getAttribute("href") || "";
      const label = (link.textContent || "").trim();
      const lang = label === "DE" || h.includes("lang=de") || h.includes("/de/") ? "de" : label === "ΕΛ" || h.includes("lang=el") || h.includes("/gr/") ? "el" : "en";
      try { localStorage.setItem("centaurLanguage", lang); } catch(e) {}
    });
  });
  const path = window.location.pathname;
  if ((path === "/" || path === "/index.html") && !chosen) {
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
