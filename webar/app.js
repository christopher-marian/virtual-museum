/**
 * AR MUSEUM GUIDE — INTERACTIVE APPLICATION SCRIPT
 * Manages 3D artifact switching, model-viewer controls, AR detection, and curatorial data.
 */

const EXHIBITS_DATA = [
  {
    id: 'ancient_coins',
    title: 'Ancient Greek & Roman Coinage',
    model: 'models/ancient_coins.glb',
    era: 'c. 450 BCE – 14 CE (Classical Antiquity)',
    eraBadge: '450 BCE – 14 CE',
    origin: 'Athens, Attica & Imperial Rome',
    medium: 'Struck Silver, Gold & Bronze Alloys',
    dimensions: '0.45m x 0.20m x 0.32m',
    scaleTag: 'Scale: 1:1 Tabletop Display',
    cameraOrbit: '0deg 65deg 0.85m',
    cameraTarget: '0m 0.08m 0m',
    description: 'This numismatic assembly features authentic minted currency of the ancient Mediterranean. The centerpiece is an Athenian Silver Tetradrachm, famously stamped with the owl of Athena holding an olive sprig and crescent moon—the international trade standard of the classical era. Flanking it are Roman gold Aurei of Emperor Augustus and Alexander the Great staters, illustrating the mastery of ancient relief die-engraving and economic power.'
  },
  {
    id: 'ancient_pottery',
    title: 'Attic Black-Figure Amphora',
    model: 'models/ancient_pottery.glb',
    era: 'c. 530 BCE (Archaic Greece)',
    eraBadge: 'c. 530 BCE',
    origin: 'Attica, Greece (Excavated Dipylon Necropolis)',
    medium: 'Wheel-thrown Terracotta & Iron-oxide Glaze',
    dimensions: '0.55m x 0.65m x 0.53m',
    scaleTag: 'Scale: 1:1 Ceramic Vessel',
    cameraOrbit: '45deg 75deg 1.35m',
    cameraTarget: '0m 0.32m 0m',
    description: 'A magnificent specimen of Attic black-figure pottery used for storing sacred olive oil presented at the Panathenaic Games. The vessel displays quintessential Greek geometric meander frets framing dynamic mythological scenes painted in black slip. Its elegant arched handles and fluted neck represent the pinnacle of ancient ceramic engineering and classical proportion.'
  },
  {
    id: 'dinosaur_fossil',
    title: 'Tyrannosaurus Rex Fossil Skull',
    model: 'models/dinosaur_fossil.glb',
    era: 'Late Cretaceous Period (~66 Million Years BCE)',
    eraBadge: 'Late Cretaceous',
    origin: 'Hell Creek Formation, Montana, USA',
    medium: 'Mineralized Fossilized Bone in Siliceous Matrix',
    dimensions: '1.89m x 1.43m x 1.10m',
    scaleTag: 'Scale: 1:1 Apex Predator Specimen',
    cameraOrbit: '35deg 70deg 3.2m',
    cameraTarget: '0m 0.65m 0m',
    description: 'Discovered in the fluvial sandstone deposits of Montana, this exceptionally preserved Tyrannosaurus rex skull displays serrated bone-crushing dentition up to 30 cm long. The large fenestrae (skull openings) reduced weight while accommodating massive jaw muscles capable of exerting bite forces exceeding 35,000 Newtons, making it one of terrestrial history\'s apex predators.'
  },
  {
    id: 'nefertiti',
    title: 'Bust of Queen Nefertiti',
    model: 'models/nefertiti.glb',
    era: 'c. 1345 BCE (18th Dynasty, New Kingdom Egypt)',
    eraBadge: 'c. 1345 BCE',
    origin: 'Amarna Workshop of Sculptor Thutmose, Egypt',
    medium: 'Polished Diorite & Stuccoed Limestone with Gold Leaf',
    dimensions: '0.24m x 0.50m x 0.37m',
    scaleTag: 'Scale: 1:1 Royal Portrait Plinth',
    cameraOrbit: '0deg 75deg 1.05m',
    cameraTarget: '0m 0.25m 0m',
    description: 'This iconic royal bust portrays Great Royal Wife Nefertiti, co-ruler during the reign of Pharaoh Akhenaten during Egypt\'s revolutionary Amarna period. Famous worldwide for its harmonious facial symmetry, royal blue tall crown (khepresh), and regal poise, it epitomizes the Amarna artistic renaissance celebrating naturalism and spiritual devotion to the Aten sun disc.'
  },
  {
    id: 'discus_thrower',
    title: 'The Discobolus of Myron',
    model: 'models/discus_thrower.glb',
    era: 'c. 460–450 BCE (High Classical Greek)',
    eraBadge: 'c. 460–450 BCE',
    origin: 'Esquiline Hill Discovery, Rome (Roman Imperial Copy)',
    medium: 'Pentelic Marble Sculpture on Architectural Plinth',
    dimensions: '1.37m x 1.80m x 1.34m',
    scaleTag: 'Scale: 1:1 Life-size Athletic Monument',
    cameraOrbit: '15deg 75deg 3.3m',
    cameraTarget: '0m 0.90m 0m',
    description: 'Sculpted by the master Myron of Eleutherae, the Discobolus (Discus Thrower) is celebrated as the paramount embodiment of Classical Greek rhythm (rhythmos) and athletic equilibrium. Depicting an Olympic athlete at the precise fraction of a second between backward windup and explosive forward throw, the coiled muscular tension and serene facial composure demonstrate the classical harmony between physical mastery and intellectual control.'
  }
];

let currentIndex = 0;
let isAutoRotating = true;

// DOM Elements
const viewer = document.getElementById('artifact-viewer');
const loader = document.getElementById('viewer-loader');
const loadingText = document.getElementById('loading-text');
const errorBanner = document.getElementById('viewer-error-banner');
const arLaunchBtn = document.getElementById('ar-launch-btn');

// Info Panel Elements
const infoTitle = document.getElementById('info-title');
const infoEra = document.getElementById('info-era');
const infoEraBadge = document.getElementById('info-era-badge');
const infoScaleBadge = document.getElementById('info-scale-badge');
const infoOrigin = document.getElementById('info-origin');
const infoMedium = document.getElementById('info-medium');
const infoDimensions = document.getElementById('info-dimensions');
const infoDescription = document.getElementById('info-description');

// AR Status Card Elements
const arIndicator = document.getElementById('ar-status-indicator');
const arTitle = document.getElementById('ar-status-title');
const arDesc = document.getElementById('ar-status-desc');

// Controls
const btnResetView = document.getElementById('btn-reset-view');
const btnToggleRotate = document.getElementById('btn-toggle-rotate');
const btnFullscreen = document.getElementById('btn-fullscreen');
const exhibitCards = document.querySelectorAll('.exhibit-card');

/**
 * Selects an exhibit by index, updates viewer, info panel, and active card.
 */
function selectExhibit(index, smoothScroll = false) {
  if (index < 0 || index >= EXHIBITS_DATA.length) return;
  currentIndex = index;
  const exhibit = EXHIBITS_DATA[index];

  // 1. Update Card States
  exhibitCards.forEach((card, idx) => {
    card.classList.toggle('active', idx === index);
  });

  // 2. Show loading indicator
  if (loader) {
    loader.style.display = 'flex';
    loader.style.opacity = '1';
    loadingText.textContent = `Loading ${exhibit.title}...`;
  }
  if (errorBanner) {
    errorBanner.style.display = 'none';
  }

  // 3. Update Model Viewer source & camera
  viewer.src = exhibit.model;
  viewer.setAttribute('src', exhibit.model);
  viewer.setAttribute('alt', exhibit.title);
  if (exhibit.cameraOrbit) {
    viewer.setAttribute('camera-orbit', exhibit.cameraOrbit);
  }
  if (exhibit.cameraTarget) {
    viewer.setAttribute('camera-target', exhibit.cameraTarget);
  }

  // 4. Update Info Panel
  infoTitle.textContent = exhibit.title;
  infoEra.textContent = exhibit.era;
  infoEraBadge.textContent = exhibit.eraBadge;
  infoScaleBadge.textContent = exhibit.scaleTag;
  infoOrigin.textContent = exhibit.origin;
  infoMedium.textContent = exhibit.medium;
  infoDimensions.textContent = exhibit.dimensions;
  infoDescription.textContent = exhibit.description;

  // 5. Smooth scroll if requested
  if (smoothScroll) {
    const viewerSection = document.getElementById('viewer-section');
    if (viewerSection) {
      viewerSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

/**
 * Sets up model-viewer event handlers
 */
function setupViewerEvents() {
  viewer.addEventListener('load', () => {
    console.log(`[ModelViewer] Model loaded successfully: ${viewer.src}`);
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => { loader.style.display = 'none'; }, 300);
    }
    if (errorBanner) {
      errorBanner.style.display = 'none';
    }
    checkARSupport();
  });

  viewer.addEventListener('error', (event) => {
    console.error('[ModelViewer] Error loading model:', event);
    if (loader) {
      loader.style.display = 'none';
    }
    if (errorBanner) {
      errorBanner.style.display = 'block';
      errorBanner.textContent = `Unable to load 3D artifact model: ${viewer.src}. Please ensure the GLB file is present.`;
    }
  });

  viewer.addEventListener('progress', (event) => {
    const percent = Math.round(event.detail.totalProgress * 100);
    if (loadingText && percent > 0 && percent < 100) {
      loadingText.textContent = `Loading ${EXHIBITS_DATA[currentIndex].title} (${percent}%)...`;
    }
  });

  viewer.addEventListener('ar-status', (event) => {
    console.log('[ModelViewer] AR status changed:', event.detail.status);
    if (event.detail.status === 'failed') {
      alert('Augmented Reality session could not be launched on this device. Please check your camera permissions.');
    }
    checkARSupport();
  });
}

/**
 * Detects device AR capabilities (WebXR, Scene Viewer, Quick Look, or Desktop)
 */
async function checkARSupport() {
  if (window.customElements) {
    try {
      await customElements.whenDefined('model-viewer');
    } catch (e) {
      console.warn('Error waiting for model-viewer custom element', e);
    }
  }

  const canAR = !!(viewer && viewer.canActivateAR);
  const ua = navigator.userAgent || '';
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);
  const isMobile = isIOS || isAndroid;
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);

  if (canAR) {
    // Verified AR-capable device & browser
    arIndicator.className = 'status-indicator ready';
    arTitle.textContent = isIOS ? 'Apple Quick Look AR Ready' : 'Google Scene Viewer / WebXR Ready';
    arDesc.innerHTML = `
      Your mobile device supports Augmented Reality! Tap the <strong>VIEW IN YOUR SPACE</strong> 
      button above to anchor this artifact onto your physical table or floor at true 1:1 scale.
    `;
    if (arLaunchBtn) {
      arLaunchBtn.style.display = 'flex';
      arLaunchBtn.classList.add('pulse');
      arLaunchBtn.title = 'Launch Augmented Reality in your space';
    }
  } else if (isMobile) {
    // Mobile device, but AR session cannot activate (e.g. Chrome on iOS, or Android without ARCore)
    arIndicator.className = 'status-indicator fallback';
    arTitle.textContent = 'Mobile AR Setup Required';
    if (isIOS && !isSafari) {
      arDesc.innerHTML = `
        Augmented Reality on iOS requires <strong>Apple Safari</strong>. Please copy this page URL and open it 
        in Safari to launch Apple Quick Look AR. You can still inspect the 3D model with touch rotation below.
      `;
    } else if (isAndroid) {
      arDesc.innerHTML = `
        WebAR on Android requires <strong>Google Chrome</strong> and <strong>Google Play Services for AR</strong> (ARCore). 
        If your device hardware does not support ARCore, you can still inspect this artifact in full 360° 3D touch mode.
      `;
    } else {
      arDesc.innerHTML = `
        Your mobile browser or hardware does not currently support WebXR/ARCore. 
        You can inspect this artifact using full 360° interactive touch rotation and zoom.
      `;
    }
    // AR launch button is hidden so it is never falsely advertised
    if (arLaunchBtn) {
      arLaunchBtn.style.display = 'none';
    }
  } else {
    // Desktop browser
    arIndicator.className = 'status-indicator desktop';
    arTitle.textContent = 'Desktop 3D Interactive Turntable Mode Active';
    arDesc.innerHTML = `
      Desktop browsers do not have spatial camera sensors. You can inspect this artifact with 
      <strong>full 360° mouse rotation and zoom</strong>. To project this artifact into your physical room, 
      open this webpage on a smartphone running Android (Google Chrome) or iOS (Safari).
    `;
    // AR launch button is hidden on desktop so it is not falsely presented as functional
    if (arLaunchBtn) {
      arLaunchBtn.style.display = 'none';
    }
  }
}

/**
 * Sets up toolbar controls (Reset View, Auto-Rotate, Fullscreen)
 */
function setupToolbarControls() {
  btnResetView.addEventListener('click', () => {
    const exhibit = EXHIBITS_DATA[currentIndex];
    viewer.cameraOrbit = exhibit.cameraOrbit;
    viewer.cameraTarget = exhibit.cameraTarget;
    viewer.fieldOfView = 'auto';
  });

  btnToggleRotate.addEventListener('click', () => {
    isAutoRotating = !isAutoRotating;
    viewer.autoRotate = isAutoRotating;
    btnToggleRotate.classList.toggle('active', isAutoRotating);
  });

  btnFullscreen.addEventListener('click', () => {
    const wrapper = document.querySelector('.viewer-wrapper');
    if (!document.fullscreenElement) {
      if (wrapper.requestFullscreen) {
        wrapper.requestFullscreen();
      } else if (wrapper.webkitRequestFullscreen) {
        wrapper.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  });
}

/**
 * Sets up card click interactions
 */
function setupGalleryCards() {
  exhibitCards.forEach((card) => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.getAttribute('data-index'), 10);
      selectExhibit(idx, true);
    });
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  setupViewerEvents();
  setupToolbarControls();
  setupGalleryCards();
  selectExhibit(0, false);
  checkARSupport();
});
