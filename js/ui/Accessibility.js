/**
 * ACCESSIBILITY & DISPLAY SETTINGS PANEL
 * Toggles for reduced motion, rain effects, audio, simple 2D mode,
 * and high-contrast accessibility.
 */

export class AccessibilityPanel {
  constructor(options) {
    this.options = options || {};
    this.panelEl = null;
    this.isOpen = false;

    this.state = {
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      rain: true,
      audio: false,
      highContrast: false,
      simpleMode: false
    };

    this.init();
  }

  init() {
    this.panelEl = document.createElement("div");
    this.panelEl.id = "accessibility-panel";
    this.panelEl.className = "accessibility-modal";
    this.panelEl.setAttribute("role", "dialog");
    this.panelEl.setAttribute("aria-label", "Accessibility and Settings");

    this.panelEl.innerHTML = `
      <div class="panel-backdrop" id="settings-backdrop"></div>
      <div class="panel-window">
        <div class="panel-header">
          <div class="panel-title-block">
            <span class="panel-tag">SYSTEM / ACCESSIBILITY</span>
            <h3 class="panel-title">PREFERENCES &amp; CONTROLS</h3>
          </div>
          <button class="panel-close-btn" id="btn-close-settings" aria-label="Close Settings" data-cursor="CLOSE">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="panel-body">
          <!-- Toggles -->
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-name">REDUCED MOTION</span>
              <span class="setting-desc">Disables cinematic fly-throughs and simplifies transitions.</span>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="toggle-motion" ${this.state.reducedMotion ? "checked" : ""}>
              <span class="slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-name">CINEMATIC RAIN &amp; DROPLETS</span>
              <span class="setting-desc">Toggles rain streaks and camera droplets for performance.</span>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="toggle-rain" checked>
              <span class="slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-name">HIGH CONTRAST TEXT</span>
              <span class="setting-desc">Increases border and typography contrast across UI.</span>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="toggle-contrast">
              <span class="slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-name">2D SCHEMATIC MODE</span>
              <span class="setting-desc">Switch from 3D city to lightweight 2D architectural blueprint.</span>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="toggle-simple">
              <span class="slider"></span>
            </label>
          </div>

          <!-- Keyboard Shortcuts Reference -->
          <div class="shortcuts-box">
            <div class="shortcuts-title">KEYBOARD SHORTCUTS</div>
            <div class="shortcuts-grid">
              <div class="shortcut-row"><kbd>ESC</kbd> <span>Return to City / Close Modal</span></div>
              <div class="shortcut-row"><kbd>1</kbd> - <kbd>9</kbd> <span>Jump to Specific Sector (01-09)</span></div>
              <div class="shortcut-row"><kbd>Tab</kbd> <span>Navigate Accessible Controls</span></div>
              <div class="shortcut-row"><kbd>Space</kbd> / <kbd>Enter</kbd> <span>Select / Confirm</span></div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.panelEl);
    this.bindEvents();
  }

  bindEvents() {
    const closeBtn = this.panelEl.querySelector("#btn-close-settings");
    const backdrop = this.panelEl.querySelector("#settings-backdrop");

    closeBtn?.addEventListener("click", () => this.close());
    backdrop?.addEventListener("click", () => this.close());

    const motionToggle = this.panelEl.querySelector("#toggle-motion");
    motionToggle?.addEventListener("change", (e) => {
      this.state.reducedMotion = e.target.checked;
      this.options.onMotionChange?.(this.state.reducedMotion);
    });

    const rainToggle = this.panelEl.querySelector("#toggle-rain");
    rainToggle?.addEventListener("change", (e) => {
      this.state.rain = e.target.checked;
      this.options.onRainChange?.(this.state.rain);
    });

    const contrastToggle = this.panelEl.querySelector("#toggle-contrast");
    contrastToggle?.addEventListener("change", (e) => {
      this.state.highContrast = e.target.checked;
      document.body.classList.toggle("high-contrast", this.state.highContrast);
    });

    const simpleToggle = this.panelEl.querySelector("#toggle-simple");
    simpleToggle?.addEventListener("change", (e) => {
      this.state.simpleMode = e.target.checked;
      this.options.onSimpleModeChange?.(this.state.simpleMode);
      this.close();
    });
  }

  open() {
    this.isOpen = true;
    this.panelEl.classList.add("active");
  }

  close() {
    this.isOpen = false;
    this.panelEl.classList.remove("active");
  }
}
