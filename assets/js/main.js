var GTM_ID = "GTM-TX6X2DXD";

var PIXEL_ID = "";

var WHATSAPP_URL = "";

(function () {
  "use strict";

  if (WHATSAPP_URL) {
    document.querySelectorAll(".js-whatsapp").forEach(function (a) { a.href = WHATSAPP_URL; });
  }

  document.querySelectorAll(".yt").forEach(function (box) {
    var btn = box.querySelector(".yt__play");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + box.dataset.id + "?autoplay=1&rel=0";
      f.title = "Vídeo institucional do CEDIM";
      f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      f.allowFullscreen = true;
      box.replaceChildren(f);
    });
  });

  document.querySelectorAll(".map").forEach(function (box) {
    var btn = box.querySelector(".map__load");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var f = document.createElement("iframe");
      f.src = box.dataset.src;
      f.title = "Mapa da localização do CEDIM";
      f.loading = "lazy";
      f.referrerPolicy = "no-referrer-when-downgrade";
      box.replaceChildren(f);
    });
  });

  document.querySelectorAll(".arrows").forEach(function (wrap) {
    var list = document.getElementById(wrap.dataset.target);
    if (!list) return;
    wrap.querySelectorAll(".arrow").forEach(function (b) {
      b.addEventListener("click", function () {
        var card = list.querySelector("li");
        var step = card ? card.getBoundingClientRect().width + 16 : 300;
        list.scrollBy({ left: step * Number(b.dataset.dir), behavior: "smooth" });
      });
    });
  });

  document.querySelectorAll(".js-auto").forEach(function (list) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var items = Array.prototype.slice.call(list.children);
    items.forEach(function (li) {
      var c = li.cloneNode(true);
      c.setAttribute("aria-hidden", "true");
      c.querySelectorAll("img").forEach(function (i) { i.alt = ""; });
      list.appendChild(c);
    });
    list.classList.add("is-auto");
    var SPEED = 28;
    var hold = 0, hover = false, visible = true, last = 0, pos = list.scrollLeft;
    function pause(ms) { hold = Math.max(hold, performance.now() + ms); }
    list.addEventListener("mouseenter", function () { hover = true; });
    list.addEventListener("mouseleave", function () { hover = false; pos = list.scrollLeft; });
    list.addEventListener("focusin", function () { hover = true; });
    list.addEventListener("focusout", function () { hover = false; pos = list.scrollLeft; });
    list.addEventListener("pointerdown", function () { pause(4000); });

    var drag = null;
    list.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      drag = { x: e.clientX, left: list.scrollLeft };
      list.classList.add("is-drag");
      e.preventDefault();
    });
    window.addEventListener("pointermove", function (e) {
      if (!drag) return;
      list.scrollLeft = drag.left - (e.clientX - drag.x);
      pause(3000);
    });
    window.addEventListener("pointerup", function () {
      if (!drag) return;
      drag = null; list.classList.remove("is-drag"); pos = list.scrollLeft; pause(3000);
    });
    list.addEventListener("wheel", function () { pause(4000); }, { passive: true });
    list.addEventListener("touchstart", function () { pause(4000); }, { passive: true });
    document.querySelectorAll('.arrows[data-target="' + list.id + '"] .arrow').forEach(function (b) {
      b.addEventListener("click", function () { pause(3000); });
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(list);
    }
    function tick(t) {
      var dt = last ? Math.min(t - last, 100) : 0;
      last = t;
      var half = list.scrollWidth / 2;
      if (hover || !visible || t < hold) {
        pos = list.scrollLeft;
      } else {
        pos += SPEED * dt / 1000;
        if (pos >= half) pos -= half;
        list.scrollLeft = pos;
      }
      if (list.scrollLeft >= half && !(hover || t < hold)) { pos = list.scrollLeft - half; list.scrollLeft = pos; }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });

  (function () {
    var root = document.documentElement;
    if (!root.classList.contains("anim")) return;
    window.__animOk = true;

    function splitWords(el, startDelay) {
      var n = 0;
      (function walk(node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (c) {
          if (c.nodeType === 3) {
            var parts = c.textContent.split(/(\s+)/);
            var frag = document.createDocumentFragment();
            parts.forEach(function (t) {
              if (!t) return;
              if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(t)); return; }
              var s = document.createElement("span");
              s.className = "w"; s.textContent = t;
              s.style.setProperty("--w", n++);
              if (startDelay) s.style.setProperty("--wd", startDelay);
              frag.appendChild(s);
            });
            c.parentNode.replaceChild(frag, c);
          } else if (c.nodeType === 1) { walk(c); }
        });
      })(el);
      return n;
    }

    function mark(el, kind, i) {
      if (!el || el.hasAttribute("data-r")) return;
      el.setAttribute("data-r", kind || "");
      if (i) el.style.setProperty("--i", i);
    }
    function group(sel, kind, max) {
      document.querySelectorAll(sel).forEach(function (el) {
        var i = Array.prototype.indexOf.call(el.parentNode.children, el);
        mark(el, kind, Math.min(i, max || 6));
      });
    }

    var lit = document.querySelector(".story h2");
    document.querySelectorAll("main h1, main h2").forEach(function (h) {
      splitWords(h, h.tagName === "H1" ? "150ms" : 0);
      if (h === lit) h.classList.add("lit"); else h.setAttribute("data-words", "");
    });

    mark(document.querySelector(".hero__logo"), "fade");
    mark(document.querySelector(".hero__sign"), "", 5);
    mark(document.querySelector(".hero__btns"), "", 6);
    mark(document.querySelector(".hero__model"), "right", 2);

    group(".head p, .process__head p, .story__text p, .guide__text p", "", 3);
    group(".head--row > .btn, .arrows", "", 2);

    group(".exam", "", 4);
    mark(document.querySelector(".advanced"), "", 1);
    group(".step", "", 4);
    mark(document.querySelector(".forwho__media"), "left");
    group(".checks li", "right", 7);
    mark(document.querySelector("#medicos"), "");
    group(".quote", "", 6);
    mark(document.querySelector(".story .video"), "left", 1);
    mark(document.querySelector(".guide__card"), "right", 1);
    group(".panels li", "zoom", 8);
    mark(document.querySelector("#convenios"), "fade");
    group(".faq details", "", 8);
    group(".visit__info > *:not(h2)", "", 5);
    mark(document.querySelector(".map"), "right", 1);
    document.querySelectorAll("main .center").forEach(function (c) { mark(c, "", 1); });

    var targets = document.querySelectorAll("[data-r], [data-words]");
    function show(el) {
      el.classList.add("in");

      if (el.hasAttribute("data-r")) {
        var delay = parseInt(getComputedStyle(el).getPropertyValue("--i") || "0", 10) * 110 + 1100;
        setTimeout(function () { el.removeAttribute("data-r"); }, delay);
      }
    }
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
      targets.forEach(function (el) { io.observe(el); });
    } else {
      targets.forEach(show);
    }

    var pending = Array.prototype.slice.call(targets), sweepQueued = false;
    function sweep() {
      sweepQueued = false;
      var vh = window.innerHeight;
      pending = pending.filter(function (el) {
        if (el.classList.contains("in")) return false;
        if (el.getBoundingClientRect().top < vh * 0.92) { show(el); if (io) io.unobserve(el); return false; }
        return true;
      });
    }
    window.addEventListener("scroll", function () { if (!sweepQueued) { sweepQueued = true; setTimeout(sweep, 150); } }, { passive: true });

    if (lit) {
      var words = lit.querySelectorAll(".w"), ticking = false;
      function paint() {
        ticking = false;
        var r = lit.getBoundingClientRect(), vh = window.innerHeight;
        var p = (vh * 0.85 - r.top) / (vh * 0.45 + r.height);
        var on = Math.round(Math.max(0, Math.min(1, p)) * words.length);
        words.forEach(function (w, i) { w.classList.toggle("on", i < on); });
      }
      window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(paint); } }, { passive: true });
      window.addEventListener("resize", paint);
      paint();
    }
  })();

  var KEY = "cedim_cookies";
  function getChoice() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setChoice(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function loadTracking() {

    if (location.hostname !== "lp.cedim.med.br") return;
    if (GTM_ID) {
      (function (w, d, s, l, i) {
        w[l] = w[l] || []; w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
        var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != "dataLayer" ? "&l=" + l : "";
        j.async = true; j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl; f.parentNode.insertBefore(j, f);
      })(window, document, "script", "dataLayer", GTM_ID);
    }
    if (PIXEL_ID) {
      !function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
        t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
      }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
      window.fbq("init", PIXEL_ID);
      window.fbq("track", "PageView");
    }
  }

  document.querySelectorAll(".js-whatsapp").forEach(function (a) {
    a.addEventListener("click", function () {
      if (PIXEL_ID && window.fbq) window.fbq("track", "Contact");

      var sec = a.closest("section, footer");
      var card = a.closest(".exam");
      var h3 = card && card.querySelector("h3");
      if (window.dataLayer) window.dataLayer.push({
        event: "whatsapp_click",
        botao_local: a.classList.contains("float-whats") ? "flutuante" : (sec && sec.id) || "rodape",
        exame: h3 ? h3.textContent.trim() : ""
      });
    });
  });

  (function () {
    var id = new URLSearchParams(location.search).get("secao") || decodeURIComponent(location.hash.slice(1));
    var el = id && document.getElementById(id);
    if (!el) return;
    function go() { el.scrollIntoView({ behavior: "instant", block: "start" }); }
    if (document.readyState === "complete") go(); else window.addEventListener("load", go);
  })();

  document.querySelectorAll(".js-results").forEach(function (a) {
    a.addEventListener("click", function () {
      var sec = a.closest("section, footer");
      if (window.dataLayer) window.dataLayer.push({ event: "resultados_click", botao_local: (sec && sec.id) || "rodape" });
    });
  });

  document.querySelectorAll(".js-saida").forEach(function (a) {
    a.addEventListener("click", function () {
      var sec = a.closest("section, footer");
      if (window.dataLayer) window.dataLayer.push({ event: "saida_click", destino: a.dataset.saida, botao_local: (sec && sec.id) || "rodape" });
    });
  });

  var bar = document.getElementById("cookies");
  var choice = getChoice();
  if (choice === "yes") {
    loadTracking();
  } else if (!choice && bar) {
    bar.hidden = false;
    document.body.classList.add("has-cookies");
  }
  if (bar) {
    bar.querySelectorAll("[data-consent]").forEach(function (b) {
      b.addEventListener("click", function () {
        var v = b.dataset.consent;
        setChoice(v);
        bar.hidden = true;
        document.body.classList.remove("has-cookies");
        if (v === "yes") loadTracking();
      });
    });
  }
})();
