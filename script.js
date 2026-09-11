(function () {
  "use strict";

  // mobile nav toggle
  var navToggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // gallery lightbox
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxCaption = document.getElementById("lightboxCaption");
  var lightboxClose = document.getElementById("lightboxClose");
  var tiles = document.querySelectorAll(".tile");

  function openLightbox(tile) {
    var img = tile.querySelector("img");
    if (!img) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || "";
    lightboxCaption.textContent = tile.getAttribute("data-caption") || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.style.overflow = "";
  }

  tiles.forEach(function (tile) {
    tile.addEventListener("click", function () {
      openLightbox(tile);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightbox && !lightbox.hidden) closeLightbox();
  });

  // header shadow on scroll
  var header = document.getElementById("site-header");
  if (header) {
    var onScroll = function () {
      header.style.boxShadow = window.scrollY > 8
        ? "0 6px 18px rgba(33,27,23,0.08)"
        : "none";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // scroll-expand intro hero
  var scrollHero = document.getElementById("scrollHero");
  var reducedMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (scrollHero && !reducedMotion) {
    var bg = document.getElementById("scrollHeroBg");
    var media = document.getElementById("scrollHeroMedia");
    var dateEl = document.getElementById("scrollHeroDate");
    var promptEl = document.getElementById("scrollHeroPrompt");
    var title = document.getElementById("scrollHeroTitle");
    var leftWord = title ? title.querySelector(".scroll-hero-word-left") : null;
    var rightWord = title ? title.querySelector(".scroll-hero-word-right") : null;

    var progress = 0;
    var mediaFullyExpanded = false;
    var touchStartY = 0;
    var isMobile = window.innerWidth < 768;

    function render() {
      var mediaWidth = 300 + progress * (isMobile ? 650 : 1250);
      var mediaHeight = 400 + progress * (isMobile ? 200 : 400);
      var translateX = progress * (isMobile ? 180 : 150);

      media.style.width = mediaWidth + "px";
      media.style.height = mediaHeight + "px";
      bg.style.opacity = String(1 - progress);

      if (leftWord) leftWord.style.transform = "translateX(-" + translateX + "vw)";
      if (rightWord) rightWord.style.transform = "translateX(" + translateX + "vw)";
      if (dateEl) dateEl.style.transform = "translateX(-" + translateX + "vw)";
      if (promptEl) promptEl.style.transform = "translateX(" + translateX + "vw)";
    }

    function clamp01(n) {
      return Math.min(Math.max(n, 0), 1);
    }

    function onWheel(e) {
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        mediaFullyExpanded = false;
        e.preventDefault();
        return;
      }
      if (!mediaFullyExpanded) {
        e.preventDefault();
        progress = clamp01(progress + e.deltaY * 0.0009);
        if (progress >= 1) mediaFullyExpanded = true;
        render();
      }
    }

    function onTouchStart(e) {
      touchStartY = e.touches[0].clientY;
    }

    function onTouchMove(e) {
      if (!touchStartY) return;
      var touchY = e.touches[0].clientY;
      var deltaY = touchStartY - touchY;

      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        mediaFullyExpanded = false;
        e.preventDefault();
        return;
      }
      if (!mediaFullyExpanded) {
        e.preventDefault();
        var factor = deltaY < 0 ? 0.008 : 0.005;
        progress = clamp01(progress + deltaY * factor);
        if (progress >= 1) mediaFullyExpanded = true;
        render();
        touchStartY = touchY;
      }
    }

    function onTouchEnd() {
      touchStartY = 0;
    }

    function onScrollLock() {
      if (!mediaFullyExpanded) window.scrollTo(0, 0);
    }

    function onResize() {
      isMobile = window.innerWidth < 768;
      render();
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("scroll", onScrollLock, { passive: true });
    window.addEventListener("resize", onResize);

    render();
  }
})();
