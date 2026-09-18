/* =====================================================================
   GETIT MEDIA SOLUTIONS — ANTIGRAVITY HERO
   Companion to css/hero-antigravity.css.

     1. boot       load sequence
     2. field      the Three.js antigravity particle system

   The particle field is entirely optional: if Three.js fails to load,
   WebGL is unavailable, or the visitor has asked for reduced motion, the
   module returns and the hero renders as a complete static composition.

   THE ANTIGRAVITY BEHAVIOUR
   A direct port of the React-Three-Fiber <Antigravity> component, same
   maths, no framework. A magnet point moves through the field, following
   the pointer or driving itself when the pointer has been still.

   Particles whose home lies inside magnetRadius are driven OUT onto a
   ring around the magnet rather than pulled into it — that is the
   antigravity. The ring breathes on a wave and rotates slowly.

   Crucially, visibility is a function of scale, not position: a particle
   further than 10 units from the ring scales to zero and is not drawn.
   So the effect is a glowing band around the magnet with nothing outside
   it, rather than a permanent full-screen scatter.

   PERFORMANCE
   One InstancedMesh, one geometry, one material. Every vector, matrix
   and quaternion used per frame is allocated once up front — the render
   loop allocates nothing. Particle count scales with screen size, the
   device pixel ratio is capped, and the loop stops entirely when the tab
   is hidden or the hero scrolls out of view.
   ===================================================================== */
(function () {
  'use strict';

  /* The field runs in two places: its own .ag-hero page, and dropped into
     any other hero as a background. All it truly needs is the mount point
     — it takes that element's section as the "am I on screen" reference,
     so it still parks itself when scrolled away on a host page. */
  var mountEl = document.getElementById('antigravity-container');
  var stage = document.querySelector('.ag-hero');
  var hero = stage || (mountEl && (mountEl.closest('section') || mountEl.parentElement));
  if (!hero) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===================================================================
     1. BOOT — only the .ag-hero page has a load sequence to release
     =================================================================== */
  if (stage) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { stage.classList.add('is-ready'); });
    });
  }

  /* ===================================================================
     2. THE FIELD
     A faithful port of the React-Three-Fiber <Antigravity> component to
     plain Three.js. The maths below is the component's, line for line —
     only the plumbing changed (an explicit renderer and render loop in
     place of <Canvas> and useFrame, typed arrays in place of the object
     array, and an InstancedMesh driven by hand).

     THE PART THAT MAKES IT WORK
     Visibility is driven by scale, not by position:

         distFromRing = |distanceToMagnet - ringRadius|
         scaleFactor  = clamp(1 - distFromRing / 10, 0, 1)

     A particle more than 10 units from the ring scales to zero and is not
     drawn at all. So the field is never a full-screen scatter — it is a
     soft glowing band around the magnet, and everything outside that band
     is simply absent. That is the whole look.

     Two behaviours feed it: particles whose HOME lies within magnetRadius
     are driven out onto the ring, and particles already sitting near ring
     distance are visible where they are. Everything else stays home and
     invisible.

     PERFORMANCE
     One InstancedMesh, one geometry, one material, one reused Object3D.
     The render loop allocates nothing. DPR capped, count scaled by screen,
     loop stopped when the tab is hidden or the hero is off screen.
     =================================================================== */
  (function field() {
    var mount = mountEl;
    if (!mount || reduced) return;
    if (typeof THREE === 'undefined') return;          /* CDN blocked */

    /* --- settings, as specified for GetIt ------------------------- */
    var S = {
      /* INTERACTION vs AMBIENT — these are separate dials.
         Interaction (below) is how strongly the field answers the cursor:
           magnetRadius  how much of the field the cursor commands
           followSpeed   how tightly the ring tracks it
           lerpSpeed     how promptly the ring forms
         Ambient is the motion that runs with no cursor at all, and is
         deliberately kept low: waveSpeed, waveAmplitude, pulseSpeed,
         rotationSpeed, autoSpeed. Raising interaction does not make the
         hero busier when nobody is pointing at it. */
      count: 1600,
      /* Authored against a 56-unit-wide viewport (what fov 35 at z 50
         gives on a typical desktop) and scaled from there each frame, so
         the ring stays the same PROPORTION of the hero at any screen size.
         The original 6 / 8 came out at roughly a seventh of the width,
         which read as a small blob off to one side rather than a field. */
      magnetRadius: 15,
      ringRadius: 13,
      /* how far either side of the ring a particle is still drawn — this
         is the thickness of the visible band, and it is what decides how
         much of the hero the effect occupies */
      bandWidth: 14,
      waveSpeed: 0.2,
      waveAmplitude: 0.55,
      particleSize: 0.58,
      /* TWO SPEED KNOBS. Lower = slower, but there is a floor: below
         about 0.02 the magnet can no longer keep up with an ordinary
         mouse movement, so the ring stops tracking the cursor and just
         wanders. Useful range is roughly 0.02 (heavy) to 0.08 (snappy);
         the reference component uses 0.05.

         followSpeed  how fast the magnet point chases the pointer.
                      This is the one that reads as "cursor speed".
         lerpSpeed    how fast each particle eases toward its own target,
                      i.e. how quickly the ring forms and dissolves. */
      followSpeed: 0.055,
      lerpSpeed: 0.055,
      /* how fast the magnet drifts on its own once the pointer is still */
      autoSpeed: 0.14,
      color: '#F97316',
      autoAnimate: true,
      particleVariance: 1,
      rotationSpeed: 0.03,
      depthFactor: 1,
      pulseSpeed: 1.6,
      fieldStrength: 10
    };

    /* fewer particles on small screens */
    var vw = window.innerWidth;
    if (vw <= 560) S.count = 700;
    else if (vw <= 980) S.count = 1100;

    /* --- renderer ------------------------------------------------- */
    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (e) {
      return;                                          /* no WebGL */
    }
    if (!renderer || !renderer.getContext()) return;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(mount.clientWidth || window.innerWidth,
                     mount.clientHeight || window.innerHeight);
    mount.appendChild(renderer.domElement);

    var scene = new THREE.Scene();

    /* the component's camera exactly: every radius above is in the space
       this camera defines, so changing it rescales the whole effect */
    var camera = new THREE.PerspectiveCamera(
      35,
      (mount.clientWidth || window.innerWidth) / (mount.clientHeight || window.innerHeight),
      0.1,
      500
    );
    camera.position.set(0, 0, 50);

    /* --- geometry & material, as in the component ----------------- */
    var geo = new THREE.CapsuleGeometry(0.1, 0.4, 4, 8);
    var mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(S.color),
      /* the reference material is fully opaque; at hero scale that is the
         loudest thing left once the motion is calmed, so it is dialled
         back here. Raise toward 1 for the original intensity. */
      transparent: true,
      opacity: 0.72,
      depthWrite: false
    });

    var mesh = new THREE.InstancedMesh(geo, mat, S.count);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.frustumCulled = false;
    scene.add(mesh);

    /* --- viewport at z = 0 ----------------------------------------
       R3F's `viewport` is the visible extent on the z = 0 plane. The
       camera looks straight down -Z at the origin, so it is trigonometry.
       -------------------------------------------------------------- */
    var vWidth = 0;
    var vHeight = 0;

    var unit = 1;          /* viewport width relative to the authoring size */

    function measureViewport() {
      vHeight = 2 * Math.tan((camera.fov * Math.PI / 180) / 2) * camera.position.z;
      vWidth = vHeight * camera.aspect;
      unit = Math.max(vWidth, 30) / 56;
    }

    /* --- particles -------------------------------------------------
       Flat typed arrays rather than an array of objects: same fields,
       no per-particle allocation, and far friendlier to the cache.
       -------------------------------------------------------------- */
    var pT = new Float32Array(S.count);      /* per-particle clock      */
    var pSpeed = new Float32Array(S.count);  /* how fast that clock runs */
    var pM = new Float32Array(S.count * 3);  /* home  (mx, my, mz)      */
    var pC = new Float32Array(S.count * 3);  /* live  (cx, cy, cz)      */
    var pOff = new Float32Array(S.count);    /* randomRadiusOffset      */

    function seedParticles() {
      var width = vWidth || 100;
      var height = vHeight || 100;

      for (var i = 0; i < S.count; i++) {
        var k = i * 3;

        var x = (Math.random() - 0.5) * width;
        var y = (Math.random() - 0.5) * height;
        var z = (Math.random() - 0.5) * 20;

        pT[i] = Math.random() * 100;
        pSpeed[i] = 0.01 + Math.random() / 200;
        pOff[i] = (Math.random() - 0.5) * 2;

        pM[k] = x;  pM[k + 1] = y;  pM[k + 2] = z;
        pC[k] = x;  pC[k + 1] = y;  pC[k + 2] = z;
      }
    }

    measureViewport();
    seedParticles();

    /* --- pointer ---------------------------------------------------
       R3F's `pointer` is normalised device coordinates, -1..1 with y up.
       -------------------------------------------------------------- */
    var pointer = { x: 0, y: 0 };
    var lastMouse = { x: 0, y: 0 };
    var lastMoveTime = 0;
    var virtualMouse = { x: 0, y: 0 };

    function handlePointerMove(e) {
      var r = mount.getBoundingClientRect();
      if (!r.width || !r.height) return;
      pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
    }

    function handlePointerLeave() {
      /* hand straight back to the automatic path */
      lastMoveTime = 0;
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    /* --- resize ----------------------------------------------------- */
    function resize() {
      var cw = mount.clientWidth;
      var ch = mount.clientHeight;
      if (!cw || !ch) return;
      camera.aspect = cw / ch;
      camera.updateProjectionMatrix();
      renderer.setSize(cw, ch);
      measureViewport();
      seedParticles();          /* homes are viewport-relative, as in useMemo */
    }

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('load', resize);
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(mount);

    /* --- the one reusable transform --------------------------------- */
    var dummy = new THREE.Object3D();

    /* --- the loop ----------------------------------------------------- */
    var running = true;
    var onScreen = true;
    var raf = null;
    var t0 = performance.now();

    function frame(now) {
      raf = requestAnimationFrame(frame);
      if (!running || !onScreen) return;

      var elapsed = (now - t0) * 0.001;

      /* has the pointer actually moved? */
      var mdx = pointer.x - lastMouse.x;
      var mdy = pointer.y - lastMouse.y;
      if (Math.sqrt(mdx * mdx + mdy * mdy) > 0.001) {
        lastMoveTime = now;
        lastMouse.x = pointer.x;
        lastMouse.y = pointer.y;
      }

      var destX = (pointer.x * vWidth) / 2;
      var destY = (pointer.y * vHeight) / 2;

      /* after 2s of stillness the magnet drives itself */
      if (S.autoAnimate && (now - lastMoveTime) > 2000) {
        destX = Math.sin(elapsed * S.autoSpeed) * (vWidth / 4);
        destY = Math.cos(elapsed * S.autoSpeed * 2) * (vHeight / 4);
      }

      /* one easing for both sources, so the handover is seamless */
      virtualMouse.x += (destX - virtualMouse.x) * S.followSpeed;
      virtualMouse.y += (destY - virtualMouse.y) * S.followSpeed;

      var targetX = virtualMouse.x;
      var targetY = virtualMouse.y;
      var globalRotation = elapsed * S.rotationSpeed;

      /* scaled once per frame rather than once per particle */
      var magnetR = S.magnetRadius * unit;
      var ringR0 = S.ringRadius * unit;
      var bandW = S.bandWidth * unit;

      for (var i = 0; i < S.count; i++) {
        var k = i * 3;

        var t = (pT[i] += pSpeed[i] / 2);

        var mx = pM[k];
        var my = pM[k + 1];
        var mz = pM[k + 2];

        var cx = pC[k];
        var cy = pC[k + 1];
        var cz = pC[k + 2];

        /* depth parallax: deeper particles track the magnet less */
        var projectionFactor = 1 - cz / 50;
        var ptx = targetX * projectionFactor;
        var pty = targetY * projectionFactor;

        var dx = mx - ptx;
        var dy = my - pty;
        var dist = Math.sqrt(dx * dx + dy * dy);

        var tX = mx;
        var tY = my;
        var tZ = mz * S.depthFactor;

        /* inside the magnet's reach, a particle is driven out onto the
           ring rather than pulled in — this is the antigravity */
        if (dist < magnetR) {
          var angle = Math.atan2(dy, dx) + globalRotation;

          var wave = Math.sin(t * S.waveSpeed + angle) * (0.5 * S.waveAmplitude);
          var deviation = pOff[i] * (5 / (S.fieldStrength + 0.1));
          var ringR = ringR0 + wave + deviation;

          tX = ptx + ringR * Math.cos(angle);
          tY = pty + ringR * Math.sin(angle);
          tZ = mz * S.depthFactor + Math.sin(t) * (S.waveAmplitude * S.depthFactor);
        }

        /* the same easing carries it out AND brings it home */
        cx += (tX - cx) * S.lerpSpeed;
        cy += (tY - cy) * S.lerpSpeed;
        cz += (tZ - cz) * S.lerpSpeed;

        pC[k] = cx;
        pC[k + 1] = cy;
        pC[k + 2] = cz;

        dummy.position.set(cx, cy, cz);

        /* face the magnet, then tip the capsule so its long axis lies
           tangent to the ring — this is what makes the band read as
           brushed strokes instead of scattered pills */
        dummy.lookAt(ptx, pty, cz);
        dummy.rotateX(Math.PI / 2);

        /* VISIBILITY: only the band around ringRadius is drawn at all */
        var ddx = cx - ptx;
        var ddy = cy - pty;
        var distToMouse = Math.sqrt(ddx * ddx + ddy * ddy);
        var distFromRing = Math.abs(distToMouse - ringR0);

        var scaleFactor = 1 - distFromRing / bandW;
        if (scaleFactor < 0) scaleFactor = 0;
        else if (scaleFactor > 1) scaleFactor = 1;

        var finalScale = scaleFactor *
                         (0.8 + Math.sin(t * S.pulseSpeed) * 0.2 * S.particleVariance) *
                         S.particleSize;

        dummy.scale.set(finalScale, finalScale, finalScale);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }

      mesh.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
    }

    raf = requestAnimationFrame(frame);

    /* --- stop doing work nobody can see ----------------------------- */
    document.addEventListener('visibilitychange', function () {
      running = !document.hidden;
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        onScreen = entries[0].isIntersecting;
      }, { threshold: 0 }).observe(hero);
    }

    /* --- tidy up ---------------------------------------------------- */
    window.addEventListener('pagehide', function () {
      if (raf) cancelAnimationFrame(raf);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    });
  })();
})();
