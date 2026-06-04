/* ============================================================
   One Stop Immigration Station — homepage interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Visa categories (12) ---------- */
  var VISAS = [
    { tag: "H-1B", en: "Specialty Occupation", es: "Ocupación Especializada", grp: "Work" },
    { tag: "L-1",  en: "Intra-Company Transfer", es: "Transferencia Intra-Empresa", grp: "Work" },
    { tag: "O-1",  en: "Extraordinary Ability", es: "Habilidad Extraordinaria", grp: "Work" },
    { tag: "E-2",  en: "Treaty Investor", es: "Inversionista de Tratado", grp: "Work" },
    { tag: "TN",   en: "NAFTA Professional", es: "Profesional TLCAN", grp: "Work" },
    { tag: "F-1",  en: "Academic Student", es: "Estudiante Académico", grp: "Study" },
    { tag: "J-1",  en: "Exchange Visitor", es: "Visitante de Intercambio", grp: "Study" },
    { tag: "K-1",  en: "Fiancé Visa", es: "Visa de Prometido(a)", grp: "Family" },
    { tag: "K-3",  en: "Spousal Visa", es: "Visa de Cónyuge", grp: "Family" },
    { tag: "U",    en: "Crime Victims", es: "Víctimas de Delitos", grp: "Humanitarian" },
    { tag: "DACA", en: "Childhood Arrivals", es: "Llegados en la Infancia", grp: "Humanitarian" },
    { tag: "SIJ",  en: "Special Juvenile", es: "Juvenil Especial", grp: "Humanitarian" }
  ];

  var grid = document.getElementById("visaGrid");
  if (grid) {
    VISAS.forEach(function (v) {
      var a = document.createElement("a");
      a.href = "#";
      a.className = "visa-card reveal";
      a.setAttribute("data-grp", v.grp);
      a.innerHTML =
        '<span class="visa-tag">' + v.tag + '</span>' +
        '<span class="visa-info">' +
          '<span class="v-name"><span class="v-grp-dot grp-' + v.grp.toLowerCase() + '"></span>' + v.tag + ' Visa</span>' +
          '<span class="v-desc" data-en="' + v.en + '" data-es="' + v.es + '">' + v.en + '</span>' +
        '</span>';
      grid.appendChild(a);
    });
  }

  /* ---------- #6 Visa filtering ---------- */
  var vfilters = document.getElementById("vfilters");
  if (vfilters) {
    vfilters.addEventListener("click", function (e) {
      var btn = e.target.closest(".vfilter");
      if (!btn) return;
      vfilters.querySelectorAll(".vfilter").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var f = btn.getAttribute("data-filter");
      grid.querySelectorAll(".visa-card").forEach(function (card) {
        var show = (f === "all" || card.getAttribute("data-grp") === f);
        card.classList.toggle("v-hide", !show);
      });
    });
  }

  /* ---------- Language toggle ---------- */
  var langButtons = document.querySelectorAll(".lang-toggle button");
  var currentLang = localStorage.getItem("osis_lang") || "en";

  function applyLang(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    localStorage.setItem("osis_lang", lang);

    document.querySelectorAll("[data-en]").forEach(function (el) {
      var val = el.getAttribute("data-" + lang);
      if (val != null) el.innerHTML = val;
    });
    document.querySelectorAll("[data-ph-en]").forEach(function (el) {
      var ph = el.getAttribute("data-ph-" + lang);
      if (ph != null) el.setAttribute("placeholder", ph);
    });
    langButtons.forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-lang") === lang);
    });

    // keep the situation-selector result message in sync with language
    var activeChip = document.querySelector(".sit-chip.active");
    var sr = document.getElementById("sitResult");
    if (activeChip && sr) {
      var m = activeChip.getAttribute("data-" + lang + "-msg") || activeChip.getAttribute("data-en-msg");
      sr.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span>' + m + '</span>';
    }
  }

  langButtons.forEach(function (b) {
    b.addEventListener("click", function () {
      applyLang(b.getAttribute("data-lang"));
    });
  });
  applyLang(currentLang);

  /* ---------- Header shadow on scroll ---------- */
  var header = document.getElementById("header");
  function onScroll() {
    if (window.scrollY > 8) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var hamburger = document.getElementById("hamburger");
  var panel = document.getElementById("mobilePanel");
  var overlay = document.getElementById("mobileOverlay");
  var closeBtn = document.getElementById("mobileClose");

  function openMenu() {
    panel.classList.add("open");
    overlay.classList.add("open");
    hamburger.classList.add("open");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    panel.classList.remove("open");
    overlay.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  hamburger.addEventListener("click", openMenu);
  closeBtn.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);
  panel.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------- Mobile services accordion ---------- */
  var acc = panel.querySelector(".m-acc");
  if (acc) {
    var trigger = acc.querySelector(".m-acc-trigger");
    trigger.addEventListener("click", function (e) {
      e.preventDefault();
      acc.classList.toggle("open");
    });
  }

  /* ---------- #4 Mega dropdown: click + keyboard + ESC ---------- */
  var svcToggle = document.getElementById("servicesToggle");
  if (svcToggle) {
    var svcItem = svcToggle.closest(".nav-item");
    function closeMega() {
      svcItem.classList.remove("mega-open");
      svcToggle.setAttribute("aria-expanded", "false");
    }
    function toggleMega() {
      var open = svcItem.classList.toggle("mega-open");
      svcToggle.setAttribute("aria-expanded", open ? "true" : "false");
    }
    svcToggle.addEventListener("click", function (e) {
      // allow real navigation only via keyboard Enter when closed? keep as toggle
      e.preventDefault();
      toggleMega();
    });
    svcToggle.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (!svcItem.classList.contains("mega-open")) toggleMega();
        var first = svcItem.querySelector(".mega a");
        if (first) first.focus();
      } else if (e.key === "Escape") {
        closeMega();
      }
    });
    document.addEventListener("click", function (e) {
      if (!svcItem.contains(e.target)) closeMega();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMega();
    });
    svcItem.querySelectorAll(".mega a").forEach(function (a) {
      a.addEventListener("click", closeMega);
    });
  }

  /* ---------- #2 Situation selector ---------- */
  var sitGrid = document.getElementById("sitGrid");
  var sitResult = document.getElementById("sitResult");
  if (sitGrid) {
    sitGrid.addEventListener("click", function (e) {
      var chip = e.target.closest(".sit-chip");
      if (!chip) return;
      sitGrid.querySelectorAll(".sit-chip").forEach(function (c) {
        c.classList.remove("active");
        c.setAttribute("aria-pressed", "false");
      });
      chip.classList.add("active");
      chip.setAttribute("aria-pressed", "true");
      var msg = chip.getAttribute("data-" + currentLang + "-msg") || chip.getAttribute("data-en-msg");
      sitResult.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span>' + msg + '</span>';
    });
  }

  /* ---------- Stat counters ---------- */
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.round(eased * target);
      el.childNodes[0].nodeValue = val;
      var plus = el.querySelector(".plus");
      if (plus) plus.textContent = suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Reveal + counters via IntersectionObserver ---------- */
  var counted = new WeakSet();
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          if (entry.target.hasAttribute("data-count") && !counted.has(entry.target)) {
            counted.add(entry.target);
            animateCount(entry.target);
          }
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -40px 0px" });

    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
    document.querySelectorAll("[data-count]").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
    document.querySelectorAll("[data-count]").forEach(function (el) {
      el.childNodes[0].nodeValue = el.getAttribute("data-count");
      var plus = el.querySelector(".plus");
      if (plus) plus.textContent = el.getAttribute("data-suffix") || "";
    });
  }

  /* ---------- Newsletter (demo) — all .news-form on any page ---------- */
  document.querySelectorAll(".news-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector("button");
      var original = btn.textContent;
      btn.textContent = currentLang === "es" ? "¡Listo! ✓" : "Done! ✓";
      btn.disabled = true;
      var input = form.querySelector("input");
      if (input) input.value = "";
      setTimeout(function () {
        btn.disabled = false;
        btn.textContent = original;
      }, 2600);
    });
  });

  /* ---------- Contact form validation ---------- */
  var cform = document.getElementById("contactForm");
  if (cform) {
    var icoCheck = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
    var icoX = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';
    var inputs = cform.querySelectorAll("[data-validate]");

    function validateField(input) {
      var field = input.closest(".field");
      var type = input.getAttribute("data-validate");
      var val = (input.value || "").trim();
      var required = input.hasAttribute("required");
      var ok = true, msg = "";
      var es = currentLang === "es";
      if (required && !val) {
        ok = false;
        msg = type === "select"
          ? (es ? "Seleccione una opción." : "Please select an option.")
          : (es ? "Este campo es obligatorio." : "This field is required.");
      } else if (type === "email" && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        ok = false; msg = es ? "Ingrese un correo electrónico válido." : "Please enter a valid email address.";
      } else if (type === "phone" && val && val.replace(/\D/g, "").length < 10) {
        ok = false; msg = es ? "Ingrese un número de teléfono válido." : "Please enter a valid phone number.";
      }
      field.classList.toggle("error", !ok);
      field.classList.toggle("valid", ok && !!val);
      var m = field.querySelector(".field-msg");
      if (m) {
        if (!ok) m.innerHTML = icoX + "<span>" + msg + "</span>";
        else if (val) m.innerHTML = icoCheck + "<span>" + (es ? "Perfecto." : "Looks good.") + "</span>";
        else m.innerHTML = "";
      }
      return ok;
    }

    inputs.forEach(function (input) {
      var ev = (input.tagName === "SELECT") ? "change" : "blur";
      input.addEventListener(ev, function () { validateField(input); });
      input.addEventListener("input", function () {
        if (input.closest(".field").classList.contains("error")) validateField(input);
      });
    });

    cform.addEventListener("submit", function (e) {
      e.preventDefault();
      var allOk = true;
      inputs.forEach(function (input) { if (!validateField(input)) allOk = false; });
      if (allOk) {
        var success = document.getElementById("formSuccess");
        if (success) success.classList.add("show");
        cform.reset();
        inputs.forEach(function (input) {
          var f = input.closest(".field");
          f.classList.remove("valid", "error");
          var m = f.querySelector(".field-msg");
          if (m) m.innerHTML = "";
        });
      } else {
        var firstErr = cform.querySelector(".field.error input, .field.error select, .field.error textarea");
        if (firstErr) firstErr.focus();
      }
    });
  }
  /* ---------- Statue of Liberty banner motif ---------- */
  (function () {
    var host = document.querySelector(".page-hero .container") || document.querySelector(".hero .container");
    if (host) {
      var img = document.createElement("img");
      img.className = "liberty-motif";
      img.src = "/liberty.png";
      img.alt = "";
      img.setAttribute("aria-hidden", "true");
      host.insertBefore(img, host.firstChild);
    }
  })();
})();
