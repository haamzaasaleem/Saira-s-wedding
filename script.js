/* Saira & Asad — invitation interactions */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var body = document.body;

  /* ---------- Envelope intro ---------- */
  var intro = document.getElementById("intro");
  var envelope = document.getElementById("envelope");

  function openInvitation() {
    if (intro.classList.contains("is-open")) return;
    intro.classList.add("is-open");
    setTimeout(function () {
      body.classList.remove("is-locked");
      body.classList.add("is-ready");
      startPetals();
    }, reduceMotion ? 0 : 1900);
    setTimeout(function () { intro.setAttribute("hidden", ""); }, reduceMotion ? 50 : 2900);
  }

  envelope.addEventListener("click", openInvitation);

  /* ---------- Falling petals ---------- */
  function startPetals() {
    if (reduceMotion) return;
    var layer = document.getElementById("petals");
    var count = window.innerWidth < 600 ? 18 : 32;
    var colors = [["#e8607d", "#a3173d"], ["#ff8fa3", "#c9184a"], ["#ffb703", "#fb8500"]];
    for (var i = 0; i < count; i++) {
      var p = document.createElement("span");
      var gold = i % 4 === 0;
      var c = colors[i % colors.length];
      p.className = "petal" + (gold ? " petal--gold" : "");
      p.style.left = Math.random() * 100 + "%";
      p.style.setProperty("--size", 10 + Math.random() * 12 + "px");
      p.style.setProperty("--dur", 9 + Math.random() * 10 + "s");
      p.style.setProperty("--spin", 3 + Math.random() * 4 + "s");
      p.style.setProperty("--delay", -Math.random() * 18 + "s");
      p.style.setProperty("--sway", (Math.random() * 120 - 60) + "px");
      if (!gold) { p.style.setProperty("--c1", c[0]); p.style.setProperty("--c2", c[1]); }
      layer.appendChild(p);
    }
  }

  /* ---------- 3D tilt on hero card (pointer + device motion) ---------- */
  var card = document.getElementById("heroCard");
  var max = 14;

  function setTilt(x, y) {
    // x, y in range -1..1
    card.style.setProperty("--ry", (x * max).toFixed(2) + "deg");
    card.style.setProperty("--rx", (-y * max).toFixed(2) + "deg");
  }

  if (!reduceMotion) {
    window.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      setTilt(e.clientX / window.innerWidth * 2 - 1, e.clientY / window.innerHeight * 2 - 1);
    });

    window.addEventListener("deviceorientation", function (e) {
      if (e.gamma == null || e.beta == null) return;
      var x = Math.max(-1, Math.min(1, e.gamma / 30));
      var y = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
      setTilt(x, y);
    });

    // Gentle idle sway on touch devices without motion events
    if (window.matchMedia("(hover: none)").matches) {
      var t = 0;
      (function idle() {
        t += 0.012;
        if (!card.dataset.motion) setTilt(Math.sin(t) * 0.6, Math.cos(t * 0.8) * 0.35);
        requestAnimationFrame(idle);
      })();
      window.addEventListener("deviceorientation", function () { card.dataset.motion = "1"; }, { once: true });
    }
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Event flip cards ---------- */
  document.querySelectorAll(".event").forEach(function (el) {
    function toggle() {
      var flipped = el.classList.toggle("is-flipped");
      el.setAttribute("aria-pressed", flipped ? "true" : "false");
    }
    el.addEventListener("click", toggle);
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
    });
  });
})();
