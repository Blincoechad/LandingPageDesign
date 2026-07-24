const certCarousel = document.querySelector("[data-cert-carousel]");

if (certCarousel) {
  const track = certCarousel.querySelector("#certTrack");
  const slides = track
    ? Array.from(track.querySelectorAll(".carousel-item"))
    : [];
  const prevButton = certCarousel.querySelector(".cert-nav-prev");
  const nextButton = certCarousel.querySelector(".cert-nav-next");
  const dotsContainer = certCarousel.querySelector("#certDots");
  const scene = certCarousel.querySelector("#certScene");
  const lightbox = document.getElementById("certLightbox");
  const lightboxImage = document.getElementById("certLightboxImage");

  let currentIndex = 0;
  let autoAdvanceTimer = null;
  let theta = 0;
  let radius = 0;
  let currentRotation = 0;

  function normalizeIndex(index) {
    if (slides.length === 0) return 0;
    return (index + slides.length) % slides.length;
  }

  function updateActiveState() {
    slides.forEach((slide, index) => {
      const isActive = index === currentIndex;
      slide.classList.toggle("is-active", isActive);
      slide.style.opacity = isActive ? "1" : "0.78";
      slide.style.filter = isActive
        ? "brightness(1) saturate(1)"
        : "brightness(0.78) saturate(0.8)";
      slide.style.pointerEvents = isActive ? "auto" : "none";
    });

    dotsContainer?.querySelectorAll(".cert-dot").forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === currentIndex);
    });
  }

  function rotateTo(index) {
    if (!track || slides.length === 0) return;

    currentIndex = normalizeIndex(index);
    currentRotation = -theta * currentIndex;
    track.style.transform = `rotateY(${currentRotation}deg)`;
    updateActiveState();
  }

  function updateGeometry() {
    if (!scene || !track || slides.length === 0) return;

    const itemWidth = track.clientWidth;
    theta = 360 / slides.length;

    // Classic radius formula for equal angular spacing around the ring.
    const baseRadius = Math.round(
      itemWidth / 2 / Math.tan(Math.PI / slides.length),
    );
    radius = Math.max(120, baseRadius + 45);

    slides.forEach((slide, index) => {
      const angle = theta * index;
      slide.style.transform = `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${radius}px)`;
    });

    rotateTo(currentIndex);
  }

  function nextSlide() {
    rotateTo(currentIndex + 1);
  }

  function buildDots() {
    if (!dotsContainer || slides.length === 0) return;

    dotsContainer.innerHTML = "";

    slides.forEach((slide, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "cert-dot";
      dot.setAttribute("aria-label", `Go to certification ${index + 1}`);
      dot.addEventListener("click", () => {
        rotateTo(index);
        restartAutoAdvance();
      });
      dotsContainer.appendChild(dot);
    });
  }

  function previousSlide() {
    rotateTo(currentIndex - 1);
  }

  function startAutoAdvance() {
    if (slides.length < 2) return;

    autoAdvanceTimer = window.setInterval(() => {
      nextSlide();
    }, 5200);
  }

  function stopAutoAdvance() {
    if (!autoAdvanceTimer) return;

    window.clearInterval(autoAdvanceTimer);
    autoAdvanceTimer = null;
  }

  function restartAutoAdvance() {
    stopAutoAdvance();
    startAutoAdvance();
  }

  function openLightbox(imageSrc, imageAlt) {
    if (!lightbox || !lightboxImage || !imageSrc) return;

    lightboxImage.src = imageSrc;
    lightboxImage.alt = imageAlt || "Certification preview";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    stopAutoAdvance();
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImage) return;

    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.removeAttribute("src");
    document.body.classList.remove("modal-open");
    startAutoAdvance();
  }

  prevButton?.addEventListener("click", () => {
    previousSlide();
    restartAutoAdvance();
  });

  nextButton?.addEventListener("click", () => {
    nextSlide();
    restartAutoAdvance();
  });

  slides.forEach((slide) => {
    const image = slide.querySelector("img");
    image?.addEventListener("click", () => {
      openLightbox(image.currentSrc || image.src, image.alt);
    });
  });

  document.querySelectorAll("[data-close-cert-lightbox]").forEach((element) => {
    element.addEventListener("click", closeLightbox);
  });

  lightbox
    ?.querySelector(".cert-lightbox__dialog")
    ?.addEventListener("click", (event) => {
      event.stopPropagation();
    });

  certCarousel.addEventListener("mouseenter", stopAutoAdvance);
  certCarousel.addEventListener("mouseleave", startAutoAdvance);

  scene?.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      if (event.deltaY > 0) {
        nextSlide();
      } else {
        previousSlide();
      }
      restartAutoAdvance();
    },
    { passive: false },
  );

  window.addEventListener("resize", () => {
    updateGeometry();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox?.classList.contains("is-open")) {
      closeLightbox();
      return;
    }

    if (lightbox?.classList.contains("is-open")) {
      return;
    }

    if (event.key === "ArrowLeft") {
      previousSlide();
      restartAutoAdvance();
    }
    if (event.key === "ArrowRight") {
      nextSlide();
      restartAutoAdvance();
    }
  });

  buildDots();
  updateGeometry();
  rotateTo(0);
  startAutoAdvance();
}
