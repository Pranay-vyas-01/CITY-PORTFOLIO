/**
 * ADAPTIVE HUD NAVIGATION BAR
 * Minimalist, frosted glass, blending into the 3D environment.
 * Fast recruiter access to core sections, audio toggle, theme toggle, settings.
 */

export class NavigationBar {
  constructor(config, onNavSelect, onThemeToggle, onSoundToggle, onSettingsOpen, onSimpleToggle) {
    this.config = config;
    this.onNavSelect = onNavSelect;
    this.onThemeToggle = onThemeToggle;
    this.onSoundToggle = onSoundToggle;
    this.onSettingsOpen = onSettingsOpen;
    this.onSimpleToggle = onSimpleToggle;

    this.navEl = null;
    this.isDark = true;
    this.isMuted = true;
    this.activeId = "map";

    this.init();
  }

  init() {
    this.navEl = document.createElement("header");
    this.navEl.id = "app-navbar";
    this.navEl.className = "app-navbar";

    this.navEl.innerHTML = `
      <div class="nav-container">
        <!-- Brand Identity -->
        <div class="nav-brand" id="nav-brand" data-cursor="HOME" role="button" tabindex="0">
          <span class="brand-monogram">PV</span>
          <div class="brand-meta">
            <span class="brand-name">PRANAY VYAS</span>
            <span class="brand-status">DIGITAL CITY // 2026</span>
          </div>
        </div>

        <!-- Recruiter Fast-Access Navigation -->
        <nav class="nav-links" aria-label="Main Navigation">
          <button class="nav-btn" data-target="about" data-cursor="INSPECT">
            <span class="nav-num">01</span>
            <span class="nav-label">HOME</span>
          </button>
          <button class="nav-btn" data-target="education" data-cursor="INSPECT">
            <span class="nav-num">02</span>
            <span class="nav-label">EDUCATION</span>
          </button>
          <button class="nav-btn" data-target="skills" data-cursor="INSPECT">
            <span class="nav-num">03</span>
            <span class="nav-label">SKILLS</span>
          </button>
          <button class="nav-btn" data-target="projects" data-cursor="INSPECT">
            <span class="nav-num">04</span>
            <span class="nav-label">PROJECTS</span>
          </button>
          <button class="nav-btn" data-target="github" data-cursor="INSPECT">
            <span class="nav-num">05</span>
            <span class="nav-label">GITHUB</span>
          </button>
          <button class="nav-btn" data-target="goals" data-cursor="INSPECT">
            <span class="nav-num">06</span>
            <span class="nav-label">GOALS</span>
          </button>
          <button class="nav-btn" data-target="resume" data-cursor="VIEW">
            <span class="nav-num">07</span>
            <span class="nav-label">RESUME</span>
          </button>
          <button class="nav-btn" data-target="contact" data-cursor="OPEN">
            <span class="nav-num">08</span>
            <span class="nav-label">CONTACT</span>
          </button>
          <button class="nav-btn" data-target="innovation" data-cursor="INSPECT">
            <span class="nav-num">09</span>
            <span class="nav-label">INNOVATION</span>
          </button>
        </nav>

        <!-- Right Quick Actions -->
        <div class="nav-actions">
          <!-- Audio Toggle (strictly OFF by default) -->
          <button id="nav-audio-btn" class="nav-action-btn" title="Toggle Atmospheric Sound" aria-label="Toggle Sound" data-cursor="AUDIO">
            <svg class="icon-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="1" y1="1" x2="23" y2="23"/>
              <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/>
              <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
            <svg class="icon-active" style="display: none;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 5L6 9H2v6h4l5 4V5z"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>
            <span class="action-text">SOUND: OFF</span>
          </button>

          <!-- Day / Night Theme Toggle -->
          <button id="nav-theme-btn" class="nav-action-btn" title="Toggle Day / Night Sky" aria-label="Toggle Theme" data-cursor="THEME">
            <svg class="icon-night" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
            <svg class="icon-day" style="display: none;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <span class="action-text">NIGHT</span>
          </button>

          <!-- Accessibility & Settings -->
          <button id="nav-settings-btn" class="nav-action-btn" title="Accessibility & Display Settings" aria-label="Settings" data-cursor="CONFIG">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(this.navEl);
    this.bindEvents();
  }

  bindEvents() {
    // Brand click: return to elevated city overview
    const brand = this.navEl.querySelector("#nav-brand");
    brand?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.setActive(null);
      this.onNavSelect?.(null);
    });

    // Fast-access building links
    this.navEl.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const targetId = btn.getAttribute("data-target");
        this.setActive(targetId);
        this.onNavSelect?.(targetId);
      });
    });

    // Audio toggle
    const audioBtn = this.navEl.querySelector("#nav-audio-btn");
    audioBtn?.addEventListener("click", () => {
      this.isMuted = !this.isMuted;
      const isSoundOn = this.onSoundToggle?.();
      this.updateAudioState(isSoundOn);
    });

    // Theme toggle
    const themeBtn = this.navEl.querySelector("#nav-theme-btn");
    themeBtn?.addEventListener("click", () => {
      this.isDark = !this.isDark;
      this.updateThemeState(this.isDark);
      this.onThemeToggle?.(this.isDark);
    });

    // Settings
    const settingsBtn = this.navEl.querySelector("#nav-settings-btn");
    settingsBtn?.addEventListener("click", () => {
      this.onSettingsOpen?.();
    });
  }

  updateAudioState(isOn) {
    const btn = this.navEl.querySelector("#nav-audio-btn");
    const mutedIcon = btn?.querySelector(".icon-muted");
    const activeIcon = btn?.querySelector(".icon-active");
    const text = btn?.querySelector(".action-text");

    if (isOn) {
      if (mutedIcon) mutedIcon.style.display = "none";
      if (activeIcon) activeIcon.style.display = "block";
      if (text) text.textContent = "SOUND: ON";
      btn?.classList.add("active");
    } else {
      if (mutedIcon) mutedIcon.style.display = "block";
      if (activeIcon) activeIcon.style.display = "none";
      if (text) text.textContent = "SOUND: OFF";
      btn?.classList.remove("active");
    }
  }

  updateThemeState(isDark) {
    const btn = this.navEl.querySelector("#nav-theme-btn");
    const nightIcon = btn?.querySelector(".icon-night");
    const dayIcon = btn?.querySelector(".icon-day");
    const text = btn?.querySelector(".action-text");

    if (isDark) {
      if (nightIcon) nightIcon.style.display = "block";
      if (dayIcon) dayIcon.style.display = "none";
      if (text) text.textContent = "NIGHT";
      document.body.classList.remove("light-mode");
    } else {
      if (nightIcon) nightIcon.style.display = "none";
      if (dayIcon) dayIcon.style.display = "block";
      if (text) text.textContent = "DAWN";
      document.body.classList.add("light-mode");
    }
  }

  setActive(id) {
    this.activeId = id;
    this.navEl.querySelectorAll(".nav-btn").forEach((btn) => {
      if (btn.getAttribute("data-target") === id) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  show() {
    this.navEl.classList.add("visible");
  }
}
