/* ==========================================================================
   Terranova hero (embedded) — liquid glass refraction + menu interaction
   ========================================================================== */

(function () {
  'use strict';

  const DUP_PIXEL_RATIO = 1;

  const heroSection = document.getElementById('tnHero');
  const video = document.getElementById('tnBgVideo');
  const card = document.getElementById('tnGlassCard');
  const container = document.getElementById('tnDupVideoContainer');
  const canvas = document.getElementById('tnDupImage');

  if (video) {
    const setRate = () => { video.playbackRate = 1.75; };
    setRate();
    video.addEventListener('loadedmetadata', setRate);
    video.addEventListener('play', setRate);
  }

  if (heroSection && video && card && container && canvas) {
    const ctx = canvas.getContext('2d', { alpha: false });

    let lastW = -1;
    let lastH = -1;

    function resizeIfNeeded() {
      const heroRect = heroSection.getBoundingClientRect();
      const w = Math.round(heroRect.width);
      const h = Math.round(heroRect.height);

      if (w !== lastW || h !== lastH) {
        lastW = w;
        lastH = h;

        container.style.width = w + 'px';
        container.style.height = h + 'px';

        canvas.width = w * DUP_PIXEL_RATIO;
        canvas.height = h * DUP_PIXEL_RATIO;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
      }
    }

    function positionContainer() {
      const heroRect = heroSection.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      container.style.left = (heroRect.left - cardRect.left) + 'px';
      container.style.top = (heroRect.top - cardRect.top) + 'px';
    }

    function drawFrame() {
      if (video.readyState >= 2 && video.videoWidth && video.videoHeight) {
        const w = canvas.width;
        const h = canvas.height;

        const cover = Math.max(w / video.videoWidth, h / video.videoHeight);
        const sw = w / cover;
        const sh = h / cover;
        const sx = (video.videoWidth - sw) / 2;
        const sy = (video.videoHeight - sh) / 2;

        try {
          ctx.drawImage(video, sx, sy, sw, sh, 0, 0, w, h);
        } catch (err) {
          /* frame not ready — ignore and retry next frame */
        }
      }
    }

    function tick() {
      resizeIfNeeded();
      positionContainer();
      drawFrame();
      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }
})();
