import { injectSpeedInsights } from "https://cdn.jsdelivr.net/npm/@vercel/speed-insights@latest/dist/index.mjs";

injectSpeedInsights();

//  the mobile hamburger menu

var hamburgerBtn = document.getElementById("hamburger");
var navMenu = document.getElementById("navLinks");

if (hamburgerBtn && navMenu) {
  hamburgerBtn.addEventListener("click", function () {
    var isOpen = navMenu.classList.toggle("is-open");
    hamburgerBtn.classList.toggle("is-open", isOpen);
    hamburgerBtn.setAttribute("aria-expanded", String(isOpen));
  });

  // close menu when a nav link is clicked
  var navLinks = navMenu.querySelectorAll(".nav-link");
  for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", function () {
      navMenu.classList.remove("is-open");
      hamburgerBtn.classList.remove("is-open");
      hamburgerBtn.setAttribute("aria-expanded", "false");
    });
  }

  // close menu when clicking outside of it
  document.addEventListener("click", function (e) {
    var clickedInsideMenu = navMenu.contains(e.target);
    var clickedBtn = hamburgerBtn.contains(e.target);
    if (!clickedInsideMenu && !clickedBtn) {
      navMenu.classList.remove("is-open");
      hamburgerBtn.classList.remove("is-open");
      hamburgerBtn.setAttribute("aria-expanded", "false");
    }
  });
}

// contact form - formspree is whats handling the submissions

var contactForm = document.getElementById("contactForm");
var successMsg = document.getElementById("formSuccess");
var errorMsg = document.getElementById("formError");

if (contactForm) {
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFieldError(fieldId, message) {
    var field = document.getElementById(fieldId);
    var errorSpan = document.getElementById(fieldId + "-error");
    if (field) field.classList.add("error");
    if (errorSpan) errorSpan.textContent = message;
  }

  function clearFieldError(fieldId) {
    var field = document.getElementById(fieldId);
    var errorSpan = document.getElementById(fieldId + "-error");
    if (field) field.classList.remove("error");
    if (errorSpan) errorSpan.textContent = "";
  }

  // show error on blur if field is empty
  var nameField = document.getElementById("name");
  var emailField = document.getElementById("email");
  var messageField = document.getElementById("message");

  nameField.addEventListener("blur", function () {
    if (!nameField.value.trim()) {
      showFieldError("name", "This field is required.");
    } else {
      clearFieldError("name");
    }
  });

  emailField.addEventListener("blur", function () {
    if (!emailField.value.trim()) {
      showFieldError("email", "This field is required.");
    } else if (!isValidEmail(emailField.value.trim())) {
      showFieldError("email", "Please enter a valid email address.");
    } else {
      clearFieldError("email");
    }
  });

  messageField.addEventListener("blur", function () {
    if (!messageField.value.trim()) {
      showFieldError("message", "This field is required.");
    } else {
      clearFieldError("message");
    }
  });

  // clear error while user is typing
  nameField.addEventListener("input", function () {
    if (nameField.value.trim()) clearFieldError("name");
  });

  emailField.addEventListener("input", function () {
    if (emailField.value.trim()) clearFieldError("email");
  });

  messageField.addEventListener("input", function () {
    if (messageField.value.trim()) clearFieldError("message");
  });

  // handle form submission validation
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    var isValid = true;

    if (errorMsg) {
      errorMsg.hidden = true;
      errorMsg.textContent = "";
    }

    clearFieldError("name");
    clearFieldError("email");
    clearFieldError("message");

    var nameVal = nameField.value.trim();
    var emailVal = emailField.value.trim();
    var messageVal = messageField.value.trim();

    if (!nameVal) {
      showFieldError("name", "Please enter your full name.");
      isValid = false;
    }

    if (!emailVal) {
      showFieldError("email", "Please enter your email.");
      isValid = false;
    } else if (!isValidEmail(emailVal)) {
      showFieldError("email", "Please enter a valid email.");
      isValid = false;
    }

    if (!messageVal) {
      showFieldError("message", "Please enter a message.");
      isValid = false;
    }

    if (!isValid) {
      if (errorMsg) {
        errorMsg.textContent =
          "Please fill out the required fields marked with a red asterisk.";
        errorMsg.hidden = false;
      }
      return;
    }

    // send form data to formspree
    fetch("https://formspree.io/f/mnjoagqd", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(contactForm),
    }).then(function (response) {
      if (response.ok) {
        contactForm.reset();
        if (successMsg) {
          successMsg.hidden = false;
          successMsg.focus();
          setTimeout(function () {
            successMsg.hidden = true;
          }, 6000);
        }
      } else {
        if (errorMsg) {
          errorMsg.textContent = "Something went wrong. Please try again.";
          errorMsg.hidden = false;
        }
      }
    });
  });
}

// image slider on about page

var sliders = document.querySelectorAll(".image-slider");

for (var s = 0; s < sliders.length; s++) {
  var slider = sliders[s];
  var track = slider.querySelector(".slider-track");
  var slides = slider.querySelectorAll(".slide");
  var prevBtn = slider.querySelector(".slider-btn.prev");
  var nextBtn = slider.querySelector(".slider-btn.next");

  if (!track || !slides.length) continue;

  // I used a function to create scoped event listeners for each slider
  function setupSlider(track, slides, prevBtn, nextBtn, slider) {
    var index = 0;
    var timer = null;

    function update() {
      track.style.transform = "translateX(" + -index * 100 + "%)";
      for (var i = 0; i < slides.length; i++) {
        slides[i].setAttribute("aria-hidden", i !== index);
      }
    }
    // I made a function that auto plays the slider with my certifacates and
    // set a time interval for how fast it will go through the images
    function startAutoPlay() {
      stopAutoPlay();
      timer = setInterval(function () {
        // used the modulo operator to get the remainder, which is 1, and
        // causes a never ending loop
        index = (index + 1) % slides.length;
        update();
      }, 2500);
    }
    // this is an extra function i added that causes the slider to stop
    // moving when user hovers over image
    function stopAutoPlay() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        index = (index - 1 + slides.length) % slides.length;
        update();
        startAutoPlay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        index = (index + 1) % slides.length;
        update();
        startAutoPlay();
      });
    }

    // this code causes the images to stop/contine when mouse moves on top
    // of them then when it moves away
    slider.addEventListener("mouseenter", stopAutoPlay);
    slider.addEventListener("mouseleave", startAutoPlay);

    update();
    startAutoPlay();
  }

  setupSlider(track, slides, prevBtn, nextBtn, slider);
}

// the gallery lighthouse effect on my images thought site

var galleryImages = document.querySelectorAll(
  ".gallery-grid img, .gallery-grid video, .card img, .redesign-preview img, .split-image img",
);

if (galleryImages.length > 0) {
  // the lightbox elements
  var overlay = document.createElement("div");
  overlay.className = "lightbox-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Image viewer");

  var lightboxContent = document.createElement("div");
  lightboxContent.className = "lightbox-content";

  var closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "lightbox-close";
  closeBtn.setAttribute("aria-label", "Close image viewer");
  closeBtn.textContent = "×";

  var largeImage = document.createElement("img");
  largeImage.alt = "";

  var largeVideo = document.createElement("video");
  largeVideo.loop = true;
  largeVideo.playsInline = true;
  largeVideo.controls = true;
  largeVideo.style.display = "none";
  // makes the sound play automatically when it gets opened
  largeVideo.muted = false;
  // volume was opening @ 100% so this line makes it open at 50%
  largeVideo.volume = 0.5;

  var splitContainer = document.createElement("div");
  splitContainer.className = "lightbox-split";
  splitContainer.style.display = "none";

  var splitImageA = document.createElement("img");
  splitImageA.alt = "Before image";
  var splitImageB = document.createElement("img");
  splitImageB.alt = "After image";
  splitContainer.appendChild(splitImageA);
  splitContainer.appendChild(splitImageB);

  var captionElem = document.createElement("p");
  captionElem.className = "lightbox-caption";

  lightboxContent.appendChild(closeBtn);
  lightboxContent.appendChild(largeImage);
  lightboxContent.appendChild(largeVideo);
  lightboxContent.appendChild(splitContainer);
  lightboxContent.appendChild(captionElem);
  overlay.appendChild(lightboxContent);
  document.body.appendChild(overlay);

  function openLightbox(src, alt, caption) {
    largeImage.src = src;
    largeImage.alt = alt || "";
    largeImage.style.display = "";
    largeVideo.style.display = "none";
    largeVideo.pause();
    splitContainer.style.display = "none";
    captionElem.textContent = caption || "";
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function openVideoLightbox(src, caption) {
    largeVideo.src = src;
    largeVideo.style.display = "";
    largeVideo.muted = false;
    largeVideo.volume = 0.5;
    largeVideo.load();
    largeVideo.play();
    largeImage.style.display = "none";
    largeImage.src = "";
    splitContainer.style.display = "none";
    captionElem.textContent = caption || "";
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function openSplitLightbox(srcA, srcB, altA, altB, caption) {
    splitImageA.src = srcA;
    splitImageB.src = srcB;
    splitImageA.alt = altA || "Before image";
    splitImageB.alt = altB || "After image";
    largeImage.src = "";
    largeImage.style.display = "none";
    largeVideo.style.display = "none";
    largeVideo.pause();
    splitContainer.style.display = "flex";
    captionElem.textContent = caption || "";
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closeLightbox() {
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
    largeImage.src = "";
    largeVideo.pause();
    // starts the video with sound
    largeVideo.muted = true;
    largeVideo.src = "";
    splitImageA.src = "";
    splitImageB.src = "";
  }

  // add click events to each gallery image
  for (var i = 0; i < galleryImages.length; i++) {
    var el = galleryImages[i];
    var splitImageParent = el.closest(".split-image");
    var figure = el.closest("figure");
    var caption = "";

    if (figure && figure.querySelector("figcaption")) {
      caption = figure.querySelector("figcaption").textContent;
    }

    el.setAttribute("tabindex", "0");
    el.style.cursor = "pointer";

    // split image handling
    if (splitImageParent) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var parentFigure = this.closest("figure");
        var imgs = parentFigure.querySelectorAll(".split-image__item img");
        if (imgs.length >= 2) {
          openSplitLightbox(imgs[0].src, imgs[1].src, caption);
        }
      });

      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          var parentFigure = this.closest("figure");
          var imgs = parentFigure.querySelectorAll(".split-image__item img");
          if (imgs.length >= 2) {
            openSplitLightbox(imgs[0].src, imgs[1].src, caption);
          }
        }
      });
      continue;
    }

    // video handling
    if (el.tagName === "VIDEO") {
      el.addEventListener("click", function () {
        var src = this.querySelector("source")
          ? this.querySelector("source").src
          : this.src;
        openVideoLightbox(src, caption);
      });

      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          var src = this.querySelector("source")
            ? this.querySelector("source").src
            : this.src;
          openVideoLightbox(src, caption);
        }
      });
      continue;
    }

    // regular image handling
    el.addEventListener("click", function () {
      openLightbox(this.src, this.alt, caption);
    });

    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(this.src, this.alt, caption);
      }
    });
  }

  // close lightbox on button click
  closeBtn.addEventListener("click", closeLightbox);

  // close lightbox when clicking the dark background
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) {
      closeLightbox();
    }
  });

  // close lightbox with escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) {
      closeLightbox();
    }
  });
}
