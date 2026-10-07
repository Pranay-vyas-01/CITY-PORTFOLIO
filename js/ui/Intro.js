/**
 * CINEMATIC OPENING EXPERIENCE
 * System diagnostics -> Skyline appearance -> Hero presentation -> ENTER MY WORLD
 */

export class IntroExperience {
  constructor(config, onEnterWorld, onViewResume, soundEngine) {
    this.config = config;
    this.onEnterWorld = onEnterWorld;
    this.onViewResume = onViewResume;
    this.sound = soundEngine;

    this.container = null;
    this.hasEntered = false;

    this.init();
  }

  init() {
    this.container = document.createElement("div");
    this.container.id = "cinematic-intro";
    this.container.innerHTML = `
      <div class="intro-backdrop"></div>
      
      <!-- System Diagnostic Log -->
      <div class="intro-diagnostics" id="intro-diagnostics" aria-live="polite">
        <div class="diag-line title-line">PRANAY VYAS / INITIALIZING...</div>
        <div class="diag-line" id="diag-1">&gt; [CORE_KERNEL] ARCHITECTURE VERIFIED</div>
        <div class="diag-line" id="diag-2">&gt; [GEO_MATRIX] 9 INTERACTIVE TOWERS ALLOCATED</div>
        <div class="diag-line" id="diag-3">&gt; [ATMOSPHERE] MIDNIGHT VIOLET MATRIX LOADED</div>
        <div class="diag-line" id="diag-4">&gt; [STATUS] DIGITAL CITY ONLINE</div>
      </div>

      <!-- Hero Presentation -->
      <div class="intro-hero" id="intro-hero" style="opacity: 0; pointer-events: none;">
        <div class="hero-badge">
          <span class="pulsing-beacon"></span>
          <span>B.Tech CSE (Core) • JECRC University</span>
        </div>

        <h1 class="hero-title">${this.config.personal.name}</h1>
        
        <p class="hero-tagline">${this.config.personal.tagline}</p>
        
        <p class="hero-desc">${this.config.personal.shortBio}</p>

        <div class="hero-actions">
          <button id="btn-enter-world" class="btn btn-primary" data-cursor="ENTER">
            <span class="btn-glow"></span>
            <span class="btn-text">ENTER MY WORLD</span>
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>

          <button id="btn-view-resume-hero" class="btn btn-secondary" data-cursor="VIEW">
            <span class="btn-text">VIEW RESUME</span>
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </button>
        </div>

        <div class="hero-tech-strip">
          <span>C</span>
          <span class="sep">•</span>
          <span>C++</span>
          <span class="sep">•</span>
          <span>DSA</span>
          <span class="sep">•</span>
          <span>GitHub</span>
          <span class="sep">•</span>
          <span>VS Code</span>
        </div>
      </div>

      <button id="btn-skip-intro" class="skip-intro-btn" title="Skip to interactive city">
        SKIP INTRO [ESC]
      </button>
    `;

    document.body.appendChild(this.container);
    this.bindEvents();
    this.startSequence();
  }

  startSequence() {
    const d1 = document.getElementById("diag-1");
    const d2 = document.getElementById("diag-2");
    const d3 = document.getElementById("diag-3");
    const d4 = document.getElementById("diag-4");
    const hero = document.getElementById("intro-hero");
    const diag = document.getElementById("intro-diagnostics");

    setTimeout(() => d1?.classList.add("visible"), 500);
    setTimeout(() => d2?.classList.add("visible"), 1000);
    setTimeout(() => d3?.classList.add("visible"), 1500);
    setTimeout(() => d4?.classList.add("visible"), 2000);

    setTimeout(() => {
      // Fade out diagnostics and fade in hero
      if (diag) {
        diag.style.transition = "opacity 0.8s ease";
        diag.style.opacity = "0";
      }

      setTimeout(() => {
        if (hero) {
          hero.style.transition = "opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)";
          hero.style.opacity = "1";
          hero.style.transform = "translateY(0)";
          hero.style.pointerEvents = "auto";
        }
      }, 300);
    }, 2500);
  }

  bindEvents() {
    const enterBtn = document.getElementById("btn-enter-world");
    const resumeBtn = document.getElementById("btn-view-resume-hero");
    const skipBtn = document.getElementById("btn-skip-intro");

    enterBtn?.addEventListener("click", () => {
      this.sound?.playClick();
      this.triggerEnter();
    });

    resumeBtn?.addEventListener("click", () => {
      this.sound?.playClick();
      this.triggerEnter(() => {
        this.onViewResume?.();
      });
    });

    skipBtn?.addEventListener("click", () => {
      this.triggerEnter();
    });

    window.addEventListener("keydown", (e) => {
      if (!this.hasEntered && (e.key === "Escape" || e.key === "Enter")) {
        this.triggerEnter();
      }
    });
  }

  triggerEnter(callback) {
    if (this.hasEntered) return;
    this.hasEntered = true;

    this.sound?.playTransition();

    // Fade out intro overlay smoothly
    this.container.classList.add("fade-out");

    setTimeout(() => {
      this.container.style.display = "none";
      if (this.onEnterWorld) {
        this.onEnterWorld();
      }
      if (callback) {
        callback();
      }
    }, 800);
  }
}
