/**
 * SIMPLE MODE — 2D SCHEMATIC CITY FALLBACK
 * High-end architectural 2D schematic grid of the digital city.
 * Used if WebGL is unsupported, performance is constrained, or user selects Simple Mode.
 */

export class SimpleModeView {
  constructor(container, config, onSectorSelect, onSwitchTo3D) {
    this.container = container;
    this.config = config;
    this.onSectorSelect = onSectorSelect;
    this.onSwitchTo3D = onSwitchTo3D;

    this.simpleEl = null;
    this.init();
  }

  init() {
    this.simpleEl = document.createElement("div");
    this.simpleEl.id = "simple-mode-view";
    this.simpleEl.className = "simple-mode-view";

    this.simpleEl.innerHTML = `
      <div class="simple-inner">
        <!-- Blueprint Header -->
        <div class="simple-header">
          <div class="simple-badge">
            <span class="live-dot"></span>
            <span>2D SCHEMATIC DIGITAL CITY // HIGH-PRECISION MODE</span>
          </div>
          <h2 class="simple-title">PRANAY VYAS — DIGITAL CITY MAP</h2>
          <p class="simple-desc">Architectural 2D overview of all 9 sectors. Select any sector to inspect its engineering records.</p>
          <button id="btn-return-3d" class="btn btn-secondary btn-sm" data-cursor="SWITCH">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 2 7 12 12 22 7 12 2"/>
              <polyline points="2 17 12 22 22 17"/>
              <polyline points="2 12 12 17 22 12"/>
            </svg>
            <span>SWITCH TO 3D EXPERIENCE</span>
          </button>
        </div>

        <!-- Schematic City Grid -->
        <div class="schematic-grid">
          ${this.config.buildings
            .map(
              (b) => `
            <div class="schematic-node" data-id="${b.id}" data-cursor="ENTER">
              <div class="node-header">
                <span class="node-code">${b.number} / SECTOR</span>
                <span class="node-coords">POS: [${b.pos.x}, ${b.pos.z}]</span>
              </div>
              <h3 class="node-title">${b.title}</h3>
              <div class="node-sub">${b.label} • ${b.subtitle}</div>
              <p class="node-desc">${b.desc}</p>
              <div class="node-footer">
                <span class="node-action">CLICK TO ENTER &rarr;</span>
                <span class="node-pill" style="border-color: ${b.color}; color: ${b.color};">ONLINE</span>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;

    this.container.appendChild(this.simpleEl);
    this.bindEvents();
  }

  bindEvents() {
    const returnBtn = this.simpleEl.querySelector("#btn-return-3d");
    returnBtn?.addEventListener("click", () => {
      this.hide();
      this.onSwitchTo3D?.();
    });

    this.simpleEl.querySelectorAll(".schematic-node").forEach((node) => {
      node.addEventListener("click", () => {
        const id = node.getAttribute("data-id");
        this.onSectorSelect?.(id);
      });
    });
  }

  show() {
    this.simpleEl.classList.add("active");
  }

  hide() {
    this.simpleEl.classList.remove("active");
  }

  isActive() {
    return this.simpleEl.classList.contains("active");
  }
}
