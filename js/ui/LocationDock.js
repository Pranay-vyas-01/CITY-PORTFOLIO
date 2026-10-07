/**
 * BOTTOM LOCATION DOCK
 * Fast geographic jumping across all 9 buildings for desktop & mobile.
 */

export class LocationDock {
  constructor(buildingsConfig, onSelect) {
    this.buildings = buildingsConfig;
    this.onSelect = onSelect;
    this.dockEl = null;
    this.activeId = null;

    this.init();
  }

  init() {
    this.dockEl = document.createElement("nav");
    this.dockEl.id = "location-dock";
    this.dockEl.className = "location-dock";
    this.dockEl.setAttribute("aria-label", "City Geography Dock");

    let itemsHtml = "";
    this.buildings.forEach((b) => {
      itemsHtml += `
        <button class="dock-btn" data-id="${b.id}" data-cursor="${b.label}" title="${b.number} / ${b.title}">
          <span class="dock-num">${b.number}</span>
          <span class="dock-label">${b.label}</span>
        </button>
      `;
    });

    this.dockEl.innerHTML = `
      <div class="dock-wrapper">
        <span class="dock-tag">CITY SECTORS</span>
        <div class="dock-items">
          ${itemsHtml}
        </div>
      </div>
    `;

    document.body.appendChild(this.dockEl);
    this.bindEvents();
  }

  bindEvents() {
    this.dockEl.querySelectorAll(".dock-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.getAttribute("data-id");
        if (id) {
          this.setActive(id);
          this.onSelect?.(id);
        }
      });
    });
  }

  setActive(id) {
    this.activeId = id;
    this.dockEl.querySelectorAll(".dock-btn").forEach((btn) => {
      if (btn.getAttribute("data-id") === id) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  show() {
    this.dockEl.classList.add("visible");
  }

  hide() {
    this.dockEl.classList.remove("visible");
  }
}
