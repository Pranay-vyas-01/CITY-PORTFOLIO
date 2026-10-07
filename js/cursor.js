/**
 * CINEMATIC CURSOR — DESKTOP ONLY
 * Dot + Soft Violet Aura Ring + Contextual Typography Label
 */

export class CinematicCursor {
  constructor() {
    this.cursorEl = null;
    this.dotEl = null;
    this.ringEl = null;
    this.labelEl = null;

    this.mouse = { x: -100, y: -100 };
    this.ring = { x: -100, y: -100 };
    this.isHovering = false;
    this.isClicking = false;
    this.currentLabel = "";
    this.isTouch = false;

    this.init();
  }

  init() {
    // Check for touch device or coarse pointer
    if (window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window) {
      this.isTouch = true;
      return;
    }

    this.createElements();
    this.bindEvents();
    this.animate();
  }

  createElements() {
    this.cursorEl = document.createElement("div");
    this.cursorEl.id = "cinematic-cursor";
    this.cursorEl.setAttribute("aria-hidden", "true");

    this.cursorEl.innerHTML = `
      <div class="cursor-dot"></div>
      <div class="cursor-ring"></div>
      <div class="cursor-label"></div>
    `;

    document.body.appendChild(this.cursorEl);
    this.dotEl = this.cursorEl.querySelector(".cursor-dot");
    this.ringEl = this.cursorEl.querySelector(".cursor-ring");
    this.labelEl = this.cursorEl.querySelector(".cursor-label");
  }

  bindEvents() {
    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      if (!this.cursorEl.classList.contains("visible")) {
        this.cursorEl.classList.add("visible");
      }
    });

    document.addEventListener("mouseleave", () => {
      this.cursorEl.classList.remove("visible");
    });

    document.addEventListener("mousedown", () => {
      this.cursorEl.classList.add("clicking");
    });

    document.addEventListener("mouseup", () => {
      this.cursorEl.classList.remove("clicking");
    });

    // Hover detection delegation for interactive elements
    document.addEventListener("mouseover", (e) => {
      const target = e.target.closest("button, a, input, textarea, select, [data-interactive], .building-hud, .dock-btn, .skill-node, .nav-item");
      if (target) {
        this.cursorEl.classList.add("hovering");
        const customLabel = target.getAttribute("data-cursor");
        if (customLabel) {
          this.setLabel(customLabel);
        } else if (target.tagName === "A" && target.target === "_blank") {
          this.setLabel("EXTERNAL");
        } else if (target.tagName === "BUTTON" || target.closest("button")) {
          this.setLabel("SELECT");
        }
      }
    });

    document.addEventListener("mouseout", (e) => {
      const target = e.target.closest("button, a, input, textarea, select, [data-interactive], .building-hud, .dock-btn, .skill-node, .nav-item");
      if (target) {
        this.cursorEl.classList.remove("hovering");
        this.clearLabel();
      }
    });
  }

  setLabel(text) {
    if (this.labelEl && text) {
      this.labelEl.textContent = text;
      this.cursorEl.classList.add("has-label");
    }
  }

  clearLabel() {
    if (this.labelEl) {
      this.labelEl.textContent = "";
      this.cursorEl.classList.remove("has-label");
    }
  }

  animate() {
    if (this.isTouch) return;

    // Smooth lerp for ring lag
    const ease = 0.22;
    this.ring.x += (this.mouse.x - this.ring.x) * ease;
    this.ring.y += (this.mouse.y - this.ring.y) * ease;

    if (this.dotEl) {
      this.dotEl.style.transform = `translate3d(${this.mouse.x}px, ${this.mouse.y}px, 0)`;
    }

    if (this.ringEl) {
      this.ringEl.style.transform = `translate3d(${this.ring.x}px, ${this.ring.y}px, 0)`;
    }

    if (this.labelEl) {
      this.labelEl.style.transform = `translate3d(${this.ring.x + 14}px, ${this.ring.y - 12}px, 0)`;
    }

    requestAnimationFrame(() => this.animate());
  }
}
