/* ==========================================================================
   1. SLIDING MENU INDICATOR & ACTIVE SECTION TRACKING
   ========================================================================== */
const navLinksContainer = document.getElementById("nav-links");
const navSlider = document.getElementById("nav-slider");
const navLinks = Array.from(document.querySelectorAll(".nav-link"));
let isHoveringNav = false;

function moveSliderTo(targetEl) {
  if (!targetEl || !navSlider) return;
  navSlider.style.width = targetEl.offsetWidth + "px";
  navSlider.style.transform = "translateX(" + targetEl.offsetLeft + "px)";
  navSlider.style.opacity = "1";
}

function getActiveLink() {
  return document.querySelector(".nav-link.active") || navLinks[0];
}

navLinks.forEach((link) => {
  link.addEventListener("mouseenter", () => {
    isHoveringNav = true;
    moveSliderTo(link);
  });

  link.addEventListener("click", () => {
    navLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
    moveSliderTo(link);
  });
});

if (navLinksContainer) {
  navLinksContainer.addEventListener("mouseleave", () => {
    isHoveringNav = false;
    moveSliderTo(getActiveLink());
  });
}

// Keep sliding pill aligned after font loads and on window resize
window.addEventListener("load", () => moveSliderTo(getActiveLink()));
window.addEventListener("resize", () => moveSliderTo(getActiveLink()));
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => moveSliderTo(getActiveLink()));
}

// Sync active pill with scroll position
if ("IntersectionObserver" in window) {
  const sectionIds = ["home", "project", "skills", "about", "social"];
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const matchingLink = document.querySelector(
            '.nav-link[href="#' + entry.target.id + '"]'
          );
          if (matchingLink) {
            navLinks.forEach((l) => l.classList.remove("active"));
            matchingLink.classList.add("active");
            if (!isHoveringNav) {
              moveSliderTo(matchingLink);
            }
          }
        }
      });
    },
    { rootMargin: "-40% 0px -45% 0px", threshold: 0 }
  );

  sectionIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  });
}


/* ==========================================================================
   2. MULTI-LANGUAGE TOGGLE (EN / MY)
   ========================================================================== */
const translations = {
  en: {
    "nav.home": "home",
    "nav.project": "project",
    "nav.skills": "skills",
    "nav.about": "about",
    "nav.social": "social media",
    "hero.title": "welcome to my portfolio",
    "hero.subtitle": "Creative frontend developer building ultra-light, tactile web experiences.",
    "hero.hint": "Drag the 3D spear to rotate 360°",
    "project.kicker": "01 / selected works",
    "project.title": "project",
    "project.p1.title": "Unit-02 Telemetry UI",
    "project.p2.title": "Crimson Glass System",
    "project.p3.title": "Longinus 3D Viewer",
    "skills.kicker": "02 / capabilities",
    "skills.title": "skills",
    "skills.g1.title": "Frontend & Motion",
    "skills.g2.title": "3D & Creative Code",
    "skills.g3.title": "Performance & Craft",
    "about.kicker": "03 / profile",
    "about.title": "about",
    "about.lead": "I build clean, fast interfaces where sharp minimalist typography meets expressive 3D geometry.",
    "about.body": "Every project is crafted directly with lightweight HTML, CSS, and Three.js—eliminating heavy toolchains so the experience stays crisp, responsive, and effortless on any laptop.",
    "social.kicker": "04 / connect",
    "social.title": "social media",
    "social.email": "Email",
    "footer.copy": "© 2026 Minimalist Portfolio. Vanilla JS & Three.js.",
    "footer.top": "back to top ↑"
  },
  my: {
    "nav.home": "utama",
    "nav.project": "projek",
    "nav.skills": "kemahiran",
    "nav.about": "tentang",
    "nav.social": "media sosial",
    "hero.title": "selamat datang ke portfolio saya",
    "hero.subtitle": "Pembangun frontend kreatif yang membina pengalaman web ultra-ringan dan interaktif.",
    "hero.hint": "Seret lembing 3D untuk putar 360°",
    "project.kicker": "01 / karya pilihan",
    "project.title": "projek",
    "project.p1.title": "Antara Muka Telemetri Unit-02",
    "project.p2.title": "Sistem Kaca Crimson",
    "project.p3.title": "Pemapar 3D Longinus",
    "skills.kicker": "02 / keupayaan",
    "skills.title": "kemahiran",
    "skills.g1.title": "Frontend & Animasi",
    "skills.g2.title": "3D & Kod Kreatif",
    "skills.g3.title": "Prestasi & Kraf",
    "about.kicker": "03 / profil",
    "about.title": "tentang",
    "about.lead": "Saya membina antara muka yang kemas dan pantas di mana tipografi minimalis bertemu geometri 3D.",
    "about.body": "Setiap projek dihasilkan terus menggunakan HTML, CSS, dan Three.js yang ringan—memastikan pengalaman kekal lancar dan responsif pada mana-mana komputer riba.",
    "social.kicker": "04 / berhubung",
    "social.title": "media sosial",
    "social.email": "E-mel",
    "footer.copy": "© 2026 Portfolio Minimalis. Vanilla JS & Three.js.",
    "footer.top": "kembali ke atas ↑"
  }
};

function setLanguage(lang) {
  const dict = translations[lang] || translations.en;
  document.documentElement.lang = lang === "my" ? "ms" : "en";

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    const isActive = btn.getAttribute("data-lang") === lang;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });

  // Recalculate sliding highlight width after translated text changes
  requestAnimationFrame(() => moveSliderTo(getActiveLink()));
}

document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    setLanguage(btn.getAttribute("data-lang"));
  });
});


/* ==========================================================================
   3. CLEAN FALLBACK PLACEHOLDER FOR UNADDED PROJECT IMAGES
   ========================================================================== */
document.querySelectorAll(".project-img").forEach((img, index) => {
  img.addEventListener("error", function handleMissingImage() {
    if (img.dataset.fallbackApplied) return;
    img.dataset.fallbackApplied = "true";

    const num = "0" + (index + 1);
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">' +
      '<rect width="800" height="600" fill="#F3F3F3"/>' +
      '<circle cx="620" cy="140" r="180" fill="#D91E18" fill-opacity="0.08"/>' +
      '<line x1="70" y1="530" x2="730" y2="70" stroke="#C8102E" stroke-width="3" stroke-opacity="0.35"/>' +
      '<text x="64" y="510" fill="#111111" font-family="sans-serif" font-size="38" font-weight="600">PROJECT ' + num + '</text>' +
      '<text x="64" y="548" fill="#777777" font-family="sans-serif" font-size="18">Replace project-' + (index + 1) + '.jpg in index.html</text>' +
      '</svg>';
    img.src = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  });
});


/* ==========================================================================
   4. THREE.JS PROCEDURAL SPEAR OF LONGINUS (Reference-Matched & 4GB RAM Safe)
   ========================================================================== */
(function initSpearScene() {
  if (typeof THREE === "undefined") return;

  const container = document.getElementById("spear-container");
  const canvas = document.getElementById("spear-canvas");
  if (!container || !canvas) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: "default"
    });
  } catch (err) {
    return;
  }

  // Low-spec PC optimization: cap DPR at 1.5, no shadows, no post-processing shaders
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setSize(container.clientWidth, container.clientHeight, false);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    36,
    container.clientWidth / Math.max(container.clientHeight, 1),
    0.1,
    100
  );
  camera.position.set(0, 0, 15.2);

  // Studio directional lighting + subtle EVA-02 warm orange-red rim highlight
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.72);
  scene.add(ambientLight);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x3a060a, 0.65);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0xfff6f6, 2.35);
  keyLight.position.set(6, 9, 8);
  scene.add(keyLight);

  const rimOrangeLight = new THREE.DirectionalLight(0xff4500, 1.15);
  rimOrangeLight.position.set(-7, -3, -6);
  scene.add(rimOrangeLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.9);
  fillLight.position.set(-5, 4, 7);
  scene.add(fillLight);

  // Signature EVA-02 metallic crimson material
  const spearMaterial = new THREE.MeshStandardMaterial({
    color: 0xc8102e,
    metalness: 0.76,
    roughness: 0.24
  });

  /**
   * Builds a sculpted, tapered metallic mesh along a 3D spline curve.
   */
  function createSculptedStrand(curve, tubularSegments, radialSegments, radiusFn, flattenFn, material) {
    const frames = curve.computeFrenetFrames(tubularSegments, false);
    const positions = [];
    const indices = [];

    for (let i = 0; i <= tubularSegments; i++) {
      const t = i / tubularSegments;
      const P = curve.getPointAt(t);
      const N = frames.normals[i];
      const B = frames.binormals[i];
      const r = radiusFn(t);
      const flatten = flattenFn(t);

      for (let j = 0; j <= radialSegments; j++) {
        const v = (j / radialSegments) * Math.PI * 2;
        const sin = Math.sin(v);
        const cos = -Math.cos(v);

        const vx = P.x + r * (cos * N.x + sin * flatten * B.x);
        const vy = P.y + r * (cos * N.y + sin * flatten * B.y);
        const vz = P.z + r * (cos * N.z + sin * flatten * B.z);
        positions.push(vx, vy, vz);
      }
    }

    for (let i = 0; i < tubularSegments; i++) {
      for (let j = 0; j < radialSegments; j++) {
        const a = i * (radialSegments + 1) + j;
        const b = (i + 1) * (radialSegments + 1) + j;
        const c = (i + 1) * (radialSegments + 1) + (j + 1);
        const d = i * (radialSegments + 1) + (j + 1);
        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    return new THREE.Mesh(geometry, material);
  }

  /**
   * Builds one continuous strand matching the reference image anatomy:
   * 1) Long, slender tightly twisted lower shaft (y = -4.55 to +0.15)
   * 2) Tight double-helix coil with open gaps in the middle (y = +0.15 to +1.15)
   * 3) Wide diamond fork shoulder -> long, straight, parallel sharp prongs (y = +1.15 to +4.55)
   */
  function buildLonginusStrand(phaseOffset, sideSign) {
    const points = [];

    // 1. Long, slender tightly twisted shaft (12 full tight twists)
    const shaftSteps = 84;
    const yBottom = -4.55;
    const yMidStart = 0.15;
    for (let i = 0; i <= shaftSteps; i++) {
      const u = i / shaftSteps;
      const y = THREE.MathUtils.lerp(yBottom, yMidStart, u);
      const orbitR = THREE.MathUtils.lerp(0.008, 0.044, Math.pow(u, 0.75));
      const theta = u * Math.PI * 24 + phaseOffset;
      points.push(new THREE.Vector3(Math.cos(theta) * orbitR, y, Math.sin(theta) * orbitR));
    }

    // 2. Middle open double-helix coil with visible gaps (2.5 open loops)
    const coilSteps = 34;
    const yMidEnd = 1.15;
    for (let i = 1; i <= coilSteps; i++) {
      const v = i / coilSteps;
      const y = THREE.MathUtils.lerp(yMidStart, yMidEnd, v);
      // Expand smoothly into open loops, keeping clean open space inside the helix
      const openBell = Math.sin(Math.pow(v, 0.85) * Math.PI);
      const orbitR = 0.044 + openBell * 0.145 + (v > 0.75 ? (v - 0.75) * 0.45 : 0);
      const theta = Math.PI * 24 + v * Math.PI * 5.0 + phaseOffset;
      const zDamp = v > 0.82 ? 1.0 - (v - 0.82) / 0.18 : 1.0;

      points.push(
        new THREE.Vector3(
          Math.cos(theta) * orbitR,
          y,
          Math.sin(theta) * orbitR * zDamp
        )
      );
    }

    // 3. Angular diamond shoulder -> two long, straight, nearly parallel sharp prongs
    points.push(
      new THREE.Vector3(sideSign * 0.34, 1.38, 0.0),
      new THREE.Vector3(sideSign * 0.44, 1.62, 0.0),
      new THREE.Vector3(sideSign * 0.38, 2.05, 0.0),
      new THREE.Vector3(sideSign * 0.31, 2.75, 0.0),
      new THREE.Vector3(sideSign * 0.24, 3.60, 0.0),
      new THREE.Vector3(sideSign * 0.17, 4.55, 0.0)
    );

    const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.35);

    // Radius profile along the total length
    const radiusFn = (t) => {
      // Slender tapering base shaft (t: 0 -> 0.52)
      if (t < 0.52) {
        return THREE.MathUtils.lerp(0.013, 0.056, Math.pow(t / 0.52, 0.8));
      }
      // Open double-helix coil (t: 0.52 -> 0.64)
      if (t < 0.64) {
        return THREE.MathUtils.lerp(0.056, 0.066, (t - 0.52) / 0.12);
      }
      // Fork shoulder flare (t: 0.64 -> 0.70)
      if (t < 0.70) {
        return THREE.MathUtils.lerp(0.066, 0.09, (t - 0.64) / 0.06);
      }
      // Long parallel prongs tapering to razor-sharp tips (t: 0.70 -> 1.0)
      return THREE.MathUtils.lerp(0.09, 0.002, Math.pow((t - 0.70) / 0.30, 1.05));
    };

    // Slight blade flattening in the middle coil & upper prongs
    const flattenFn = (t) => {
      if (t < 0.52) return 0.92;
      if (t < 0.64) return 0.62;
      return 0.55;
    };

    return createSculptedStrand(curve, 220, 8, radiusFn, flattenFn, spearMaterial);
  }

  // Build both intertwined strands
  const spearModel = new THREE.Group();
  spearModel.add(buildLonginusStrand(0, -1));
  spearModel.add(buildLonginusStrand(Math.PI, 1));

  // Diagonal orientation matching the reference image (bottom-left shaft -> top-right twin prongs)
  const spearPivot = new THREE.Group();
  spearPivot.add(spearModel);
  spearPivot.rotation.set(0.16, 0.28, -Math.PI / 4);
  scene.add(spearPivot);

  // Smooth 360-degree OrbitControls (zoom & pan off so page scroll stays uninterrupted)
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.minPolarAngle = 0;
  controls.maxPolarAngle = Math.PI;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.95;

  // Pause WebGL render loop when off-screen or tab is hidden to save RAM/CPU
  let isPageVisible = !document.hidden;
  let isCanvasInView = true;
  let rafId = null;

  document.addEventListener("visibilitychange", () => {
    isPageVisible = !document.hidden;
    if (isPageVisible && isCanvasInView && !rafId) {
      animate();
    }
  });

  if ("IntersectionObserver" in window) {
    const canvasObserver = new IntersectionObserver(
      (entries) => {
        isCanvasInView = entries[0].isIntersecting;
        if (isPageVisible && isCanvasInView && !rafId) {
          animate();
        }
      },
      { threshold: 0.05 }
    );
    canvasObserver.observe(container);
  }

  window.addEventListener("resize", () => {
    const width = container.clientWidth;
    const height = Math.max(container.clientHeight, 1);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  });

  const clock = new THREE.Clock();

  function animate() {
    if (!isPageVisible || !isCanvasInView) {
      rafId = null;
      return;
    }

    rafId = requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // Gentle vertical float
    spearPivot.position.y = Math.sin(elapsed * 1.15) * 0.09;

    controls.update();
    renderer.render(scene, camera);
  }

  animate();
})();