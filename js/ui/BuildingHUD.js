/**
 * BUILDING HUD & 3D LABELS
 * Projected screen-space monospace tags for all 9 buildings and elegant hover cards.
 */

export class BuildingHUD {
  constructor(container, buildingsConfig, camera, onBuildingSelect) {
    this.container = container;
    this.buildings = buildingsConfig;
    this.camera = camera;
    this.onBuildingSelect = onBuildingSelect;

    this.labelsGroup = null;
    this.previewCard = null;
    this.labelElements = new Map();
    this.visible = false;
    this.activeId = null;

    this.init();
  }

  init() {
    this.labelsGroup = document.createElement("div");
    this.labelsGroup.id = "building-labels-layer";
    this.labelsGroup.className = "building-labels-layer";
    this.container.appendChild(this.labelsGroup);

    // Build label pills for each building
    this.buildings.forEach((b) => {
      const el = document.createElement("button");
      el.className = "building-tag";
      el.id = `tag-${b.id}`;
      el.setAttribute("data-id", b.id);
      el.setAttribute("data-cursor", "ENTER");
      el.innerHTML = `
        <span class="tag-num">${b.number}</span>
        <span class="tag-sep">/</span>
        <span class="tag-name">${b.label}</span>
      `;

      el.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.onBuildingSelect?.(b);
      });

      this.labelsGroup.appendChild(el);
      this.labelElements.set(b.id, {
        element: el,
        pos3D: new THREE.Vector3(b.pos.x, b.size.h + 2.5, b.pos.z)
      });
    });

    // Elegant Hover Preview Card
    this.previewCard = document.createElement("div");
    this.previewCard.id = "building-preview-card";
    this.previewCard.className = "building-preview-card";
    this.previewCard.innerHTML = `
      <div class="preview-header">
        <span class="preview-num">01</span>
        <span class="preview-title">SECTOR PREVIEW</span>
      </div>
      <div class="preview-body">
        <div class="preview-subtitle">BUILDING NAME</div>
        <p class="preview-desc">Description of sector</p>
      </div>
      <div class="preview-hint">CLICK TO ENTER SECTOR [ENTER]</div>
    `;

    this.previewCard.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (this.currentHovered) {
        this.onBuildingSelect?.(this.currentHovered);
      }
    });
    this.container.appendChild(this.previewCard);
  }

  updatePositions() {
    if (!this.visible || !this.camera) return;

    const widthHalf = window.innerWidth / 2;
    const heightHalf = window.innerHeight / 2;
    const tempVec = new THREE.Vector3();

    this.labelElements.forEach(({ element, pos3D }, id) => {
      tempVec.copy(pos3D);
      tempVec.project(this.camera);

      // Check if building is in front of camera
      if (tempVec.z < 1) {
        const x = tempVec.x * widthHalf + widthHalf;
        const y = -(tempVec.y * heightHalf) + heightHalf;
        element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        element.style.display = "flex";
      } else {
        element.style.display = "none";
      }
    });
  }

  showHover(bData) {
    this.currentHovered = bData;
    if (!bData) {
      this.previewCard.classList.remove("visible");
      this.labelElements.forEach(({ element }) => element.classList.remove("hovered"));
      return;
    }

    const elObj = this.labelElements.get(bData.id);
    if (elObj) {
      elObj.element.classList.add("hovered");
    }

    this.previewCard.querySelector(".preview-num").textContent = `${bData.number} / ${bData.label}`;
    this.previewCard.querySelector(".preview-title").textContent = "SECTOR " + bData.number;
    this.previewCard.querySelector(".preview-subtitle").textContent = bData.title;
    this.previewCard.querySelector(".preview-desc").textContent = bData.desc;
    this.previewCard.classList.add("visible");
  }

  show() {
    this.visible = true;
    this.labelsGroup.classList.add("visible");
  }

  hide() {
    this.visible = false;
    this.labelsGroup.classList.remove("visible");
    this.previewCard.classList.remove("visible");
  }
}
