// script.js - single file powering all pages
document.addEventListener('DOMContentLoaded', function () {
  /* ---------- Floating hearts ---------- */
  const heartColors = ['#ff8fb1','#ffb6c1','#ffd1e3','#ff6b8a','#ff94b7'];
  const heartsContainer = document.getElementById('hearts-container');
  function createHeart() {
    const h = document.createElement('div');
    h.className = 'heart';
    const size = (Math.random() * 16) + 12; // 12-28px
    h.style.width = `${size}px`;
    h.style.height = `${size}px`;
    h.style.left = (Math.random() * 100) + 'vw';
    const color = heartColors[Math.floor(Math.random()*heartColors.length)];
    h.style.background = color;
    h.style.animationDuration = (5 + Math.random() * 3) + 's';
    h.style.opacity = (0.6 + Math.random()*0.4);
    h.style.transform = `rotate(${Math.random() * 60 - 20}deg)`;
    h.style.bottom = '-30px';
    h.style.zIndex = 10000; // Make hearts float above everything, including the lightbox
    if (heartsContainer) heartsContainer.appendChild(h);
    // animate via CSS keyframes
    h.style.animationName = 'rise';
    h.style.animationTimingFunction = 'linear';
    h.style.animationFillMode = 'forwards';
    // remove after animation
    setTimeout(() => { h.remove(); }, 9000);
  }
  // create hearts every 600ms
  const heartInterval = setInterval(createHeart, 600);

  /* ---------- Background music toggle ---------- */
  // --- Simplified Music Logic: Always On ---
  const bgAudio = document.getElementById('bg-music');
  if (bgAudio) {
    // Try to play on load. It will be muted initially.
    bgAudio.play().catch(() => {
      // Autoplay was blocked. We'll wait for a user click.
      console.log("Autoplay was blocked. Waiting for user interaction.");
    });

    // A function to unmute and play the audio
    const unmuteAndPlay = () => {
      if (bgAudio.paused) bgAudio.play().catch(()=>{});
      bgAudio.muted = false;
      sessionStorage.setItem('userInteracted', 'true');
    };

    // If the user has already interacted in this session, unmute immediately.
    if (sessionStorage.getItem('userInteracted') === 'true') {
      unmuteAndPlay();
    } else {
      // Otherwise, wait for the first click to unmute. This listener runs only once.
      document.body.addEventListener('click', unmuteAndPlay, { once: true });
    }
  }

  /* ---------- Lightbox for scrapbook ---------- */
  const lightbox = document.getElementById("lightbox");
  if (lightbox) { // This check prevents errors on other pages
    const photos = document.querySelectorAll(".photo");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxNote = document.getElementById("lightbox-note");
    const closeBtn = document.getElementById("closeBtn");

    console.log("Number of photo elements found:", photos.length); // ADDED

    photos.forEach(photo => {
      photo.addEventListener("click", () => {
        console.log("Photo clicked!");
        const imgElement = photo.querySelector("img");
        const img = imgElement ? imgElement.src : '';
        if (!img) {
          console.warn("No image found in this photo element!");
        }
        const note = photo.getAttribute("data-note");
        lightboxImg.src = img;
        lightboxNote.textContent = note;
        lightbox.classList.add('active');

        //lightbox.style.display = "flex";
        console.log("Lightbox display set to flex"); // ADDED
      });
    });

    closeBtn.addEventListener("click", () => {
      lightbox.classList.remove('active');
      //lightbox.style.display = "none"; console.log("Close button clicked"); // ADDED
    });

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
      }
      //lightbox.style.display = "none";
    });
  }


  /* ---------- Typewriter effect for Bengali letter ---------- */
  function typeWriterEffect(text, el, speed = 60) {
    if (!el) return;
    el.innerHTML = '';
    let i = 0;
    function step() {
      if (i >= text.length) return;
      const ch = text[i];
      if (ch === '\n') {
        el.innerHTML += '<br>';
      } else {
        // escape HTML special characters
        const toAppend = (ch === '<') ? '&lt;' : (ch === '&') ? '&amp;' : ch;
        el.innerHTML += toAppend;
      }
      i++;
      setTimeout(step, speed);
    }
    step();
  }

  // if on letter page: run effect using window._bengaliLetter (set in love-letter.html)
  const letterEl = document.getElementById('letterText')
  if (letterEl) {
    const text = window._bengaliLetter || letterEl.textContent || '';
    typeWriterEffect(text, letterEl, 55);

    const replay = document.getElementById('replayLetter');
    if (replay) replay.addEventListener('click', () => {
      typeWriterEffect(text, letterEl, 55);
    });

    // print/save
    const downloadBtn = document.getElementById('downloadLetter');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }

  /* ---------- cleanup when navigating away (optional) ---------- */
  window.addEventListener('beforeunload', function () {
    clearInterval(heartInterval);
  });
});
