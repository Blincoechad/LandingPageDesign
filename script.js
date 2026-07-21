// ─── Cursor
const dot = document.getElementById("cursorDot");
const ring = document.getElementById("cursorRing");
let mx = 0,
  my = 0,
  rx = 0,
  ry = 0;
document.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
});
function animCursor() {
  dot.style.left = mx + "px";
  dot.style.top = my + "px";
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + "px";
  ring.style.top = ry + "px";
  requestAnimationFrame(animCursor);
}
animCursor();

// ─── Reveal on scroll
const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        const siblings = [
          ...e.target.parentElement.querySelectorAll(".reveal"),
        ];
        const idx = siblings.indexOf(e.target);
        setTimeout(() => e.target.classList.add("visible"), idx * 80);
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 },
);
reveals.forEach((r) => observer.observe(r));

// ─── Back to top button
const backToTop = document.getElementById("backToTop");

function updateBackToTop() {
  if (!backToTop) return;
  if (window.scrollY > 320) {
    backToTop.classList.add("visible");
  } else {
    backToTop.classList.remove("visible");
  }
}

window.addEventListener("scroll", updateBackToTop);
updateBackToTop();

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ─── Process modal
const processModal = document.getElementById("processModal");
const processModalTitle = document.getElementById("processModalTitle");
const processModalText = document.getElementById("processModalText");
const processSteps = document.querySelectorAll(".process-step");
const videoModal = document.getElementById("videoModal");
const videoModalPlayer = document.getElementById("videoModalPlayer");
const videoCards = document.querySelectorAll("[data-video-modal]");

function closeProcessModal() {
  if (!processModal) return;
  processModal.classList.remove("is-open");
  processModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function openProcessModal(step) {
  if (!processModal || !processModalTitle || !processModalText) return;

  const title =
    step.dataset.title ||
    step.querySelector(".step-title")?.textContent?.trim() ||
    "Process";
  const text =
    step.dataset.text ||
    step.querySelector(".step-desc")?.textContent?.trim() ||
    "";

  processModalTitle.textContent = title;
  processModalText.textContent = text;
  processModal.classList.add("is-open");
  processModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

processSteps.forEach((step) => {
  step.addEventListener("click", () => openProcessModal(step));
});

document.querySelectorAll("[data-close-modal]").forEach((element) => {
  element.addEventListener("click", closeProcessModal);
});

document
  .querySelector(".process-modal__dialog")
  ?.addEventListener("click", (event) => {
    event.stopPropagation();
  });

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && processModal?.classList.contains("is-open")) {
    closeProcessModal();
  }
});

function closeVideoModal() {
  if (!videoModal || !videoModalPlayer) return;
  videoModal.classList.remove("is-open");
  videoModal.setAttribute("aria-hidden", "true");
  videoModalPlayer.pause();
  videoModalPlayer.currentTime = 0;
  videoModalPlayer.removeAttribute("src");
  videoModalPlayer.load();
  document.body.classList.remove("modal-open");
}

async function openVideoModal(videoSrc) {
  if (!videoModal || !videoModalPlayer || !videoSrc) return;
  videoModalPlayer.src = videoSrc;
  videoModalPlayer.muted = false;
  videoModal.classList.add("is-open");
  videoModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  try {
    await videoModalPlayer.play();
  } catch (error) {
    // Ignore blocked autoplay errors; controls remain available for manual play.
  }
}

videoCards.forEach((card) => {
  const videoSrc = card.dataset.videoSrc;

  card.addEventListener("click", (event) => {
    const clickedLink = event.target.closest("a");
    if (clickedLink) {
      event.preventDefault();
    }
    openVideoModal(videoSrc);
  });
});

document.querySelectorAll("[data-close-video-modal]").forEach((element) => {
  element.addEventListener("click", closeVideoModal);
});

videoModal
  ?.querySelector(".video-modal__dialog")
  ?.addEventListener("click", (event) => {
    event.stopPropagation();
  });

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && videoModal?.classList.contains("is-open")) {
    closeVideoModal();
  }
});
