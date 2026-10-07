/**
 * CAMERA CONTROLLER
 * Elevated interactive city-map navigation, cinematic fly-through,
 * building focus transitions, parallax damping, and mobile touch gestures.
 */

export class CityCameraController {
  constructor(camera, domElement, onModeChange) {
    this.camera = camera;
    this.domElement = domElement;
    this.onModeChange = onModeChange;

    // View states: 'BOOT' -> 'INTRO_FLY' -> 'MAP' -> 'FOCUS'
    this.mode = "BOOT";
    this.reducedMotion = false;

    // Default elevated map camera pose
    this.mapPosition = new THREE.Vector3(0, 32, 40);
    this.mapTarget = new THREE.Vector3(0, 3, 0);

    // Boot camera pose (distant, cinematic angle looking at distant skyline)
    this.bootPosition = new THREE.Vector3(0, 16, 75);
    this.bootTarget = new THREE.Vector3(0, 8, -20);

    // Active interpolation vectors
    this.currentPos = this.bootPosition.clone();
    this.currentTarget = this.bootTarget.clone();
    this.targetPos = this.bootPosition.clone();
    this.targetLookAt = this.bootTarget.clone();

    // Interaction & Parallax
    this.parallax = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.orbit = { angle: 0, pitch: 0, targetAngle: 0, targetPitch: 0 };
    this.zoom = 1.0;
    this.isDragging = false;
    this.prevDrag = { x: 0, y: 0 };
    this.touchStartDist = 0;

    this.flyThroughProgress = 0;
    this.isFlying = false;

    this.camera.position.copy(this.bootPosition);
    this.camera.lookAt(this.bootTarget);

    this.checkReducedMotion();
    this.bindEvents();
  }

  checkReducedMotion() {
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  setReducedMotion(enabled) {
    this.reducedMotion = enabled;
  }

  bindEvents() {
    // Parallax mouse move
    window.addEventListener("mousemove", (e) => {
      if (this.mode !== "MAP") return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      this.parallax.targetX = nx * 3.5;
      this.parallax.targetY = -ny * 2.0;
    });

    // Orbit drag on canvas
    this.domElement.addEventListener("mousedown", (e) => {
      if (this.mode !== "MAP" || e.button !== 0) return;
      this.isDragging = true;
      this.prevDrag.x = e.clientX;
      this.prevDrag.y = e.clientY;
    });

    window.addEventListener("mouseup", () => {
      this.isDragging = false;
    });

    window.addEventListener("mousemove", (e) => {
      if (!this.isDragging || this.mode !== "MAP") return;
      const dx = e.clientX - this.prevDrag.x;
      const dy = e.clientY - this.prevDrag.y;
      this.orbit.targetAngle -= dx * 0.006;
      this.orbit.targetPitch = Math.max(-0.25, Math.min(0.35, this.orbit.targetPitch + dy * 0.005));
      this.prevDrag.x = e.clientX;
      this.prevDrag.y = e.clientY;
    });

    // Scroll wheel zoom
    this.domElement.addEventListener("wheel", (e) => {
      if (this.mode !== "MAP") return;
      e.preventDefault();
      const delta = e.deltaY * 0.001;
      this.zoom = Math.max(0.65, Math.min(1.45, this.zoom + delta));
    }, { passive: false });

    // Touch controls for mobile
    this.domElement.addEventListener("touchstart", (e) => {
      if (this.mode !== "MAP") return;
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.prevDrag.x = e.touches[0].clientX;
        this.prevDrag.y = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        this.isDragging = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        this.touchStartDist = Math.hypot(dx, dy);
      }
    }, { passive: true });

    this.domElement.addEventListener("touchmove", (e) => {
      if (this.mode !== "MAP") return;
      if (e.touches.length === 1 && this.isDragging) {
        const dx = e.touches[0].clientX - this.prevDrag.x;
        const dy = e.touches[0].clientY - this.prevDrag.y;
        this.orbit.targetAngle -= dx * 0.007;
        this.orbit.targetPitch = Math.max(-0.25, Math.min(0.35, this.orbit.targetPitch + dy * 0.006));
        this.prevDrag.x = e.touches[0].clientX;
        this.prevDrag.y = e.touches[0].clientY;
      } else if (e.touches.length === 2 && this.touchStartDist > 0) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const diff = (this.touchStartDist - dist) * 0.005;
        this.zoom = Math.max(0.65, Math.min(1.45, this.zoom + diff));
        this.touchStartDist = dist;
      }
    }, { passive: true });

    this.domElement.addEventListener("touchend", () => {
      this.isDragging = false;
      this.touchStartDist = 0;
    });
  }

  // CINEMATIC "ENTER MY WORLD" FLY-THROUGH
  startEnterFlythrough(onComplete) {
    this.mode = "INTRO_FLY";
    this.isFlying = true;
    this.flyThroughProgress = 0;
    this.onEnterComplete = onComplete;

    if (this.reducedMotion) {
      this.mode = "MAP";
      this.isFlying = false;
      this.currentPos.copy(this.mapPosition);
      this.currentTarget.copy(this.mapTarget);
      this.camera.position.copy(this.mapPosition);
      this.camera.lookAt(this.mapTarget);
      if (onComplete) onComplete();
      return;
    }
  }

  // FOCUS ON CLICKED BUILDING
  focusBuilding(buildingData) {
    this.mode = "FOCUS";
    const bx = buildingData.pos.x;
    const bz = buildingData.pos.z;
    const bh = buildingData.size.h;

    // Angle slightly offset from building for architectural depth
    const offsetDistance = Math.max(12, buildingData.size.w * 2.2);
    this.targetPos.set(bx + offsetDistance * 0.65, bh * 0.75 + 5.5, bz + offsetDistance * 0.85);
    this.targetLookAt.set(bx, bh * 0.45, bz);

    if (this.reducedMotion) {
      this.currentPos.copy(this.targetPos);
      this.currentTarget.copy(this.targetLookAt);
    }

    if (this.onModeChange) this.onModeChange("FOCUS", buildingData);
  }

  // RETURN TO ELEVATED MAP VIEW
  returnToMap() {
    this.mode = "MAP";
    this.targetPos.copy(this.mapPosition);
    this.targetLookAt.copy(this.mapTarget);

    if (this.reducedMotion) {
      this.currentPos.copy(this.mapPosition);
      this.currentTarget.copy(this.mapTarget);
    }

    if (this.onModeChange) this.onModeChange("MAP", null);
  }

  update(delta) {
    if (this.mode === "INTRO_FLY") {
      this.flyThroughProgress += delta * 0.42; // ~2.4 second cinematic fly-through
      const t = Math.min(1.0, this.flyThroughProgress);
      // Smooth cubic bezier easing
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      // Waypoint curve from boot position gliding over city to elevated map view
      const startX = 0, startY = 16, startZ = 75;
      const midX = 6, midY = 38, midZ = 45;
      const endX = 0, endY = 32, endZ = 40;

      // Quadratic bezier for flight path
      const p0 = (1 - ease) * (1 - ease);
      const p1 = 2 * (1 - ease) * ease;
      const p2 = ease * ease;

      this.currentPos.x = p0 * startX + p1 * midX + p2 * endX;
      this.currentPos.y = p0 * startY + p1 * midY + p2 * endY;
      this.currentPos.z = p0 * startZ + p1 * midZ + p2 * endZ;

      this.currentTarget.x = THREE.MathUtils.lerp(this.bootTarget.x, this.mapTarget.x, ease);
      this.currentTarget.y = THREE.MathUtils.lerp(this.bootTarget.y, this.mapTarget.y, ease);
      this.currentTarget.z = THREE.MathUtils.lerp(this.bootTarget.z, this.mapTarget.z, ease);

      this.camera.position.copy(this.currentPos);
      this.camera.lookAt(this.currentTarget);

      if (t >= 1.0) {
        this.mode = "MAP";
        this.isFlying = false;
        if (this.onEnterComplete) this.onEnterComplete();
      }
      return;
    }

    if (this.mode === "MAP") {
      // Parallax damping
      this.parallax.x += (this.parallax.targetX - this.parallax.x) * 0.08;
      this.parallax.y += (this.parallax.targetY - this.parallax.y) * 0.08;

      // Orbit damping
      this.orbit.angle += (this.orbit.targetAngle - this.orbit.angle) * 0.08;
      this.orbit.pitch += (this.orbit.targetPitch - this.orbit.pitch) * 0.08;

      // Compute base spherical map position with orbit and zoom
      const baseDist = 52 * this.zoom;
      const camY = 32 * this.zoom + this.orbit.pitch * 16 + this.parallax.y;

      const angle = this.orbit.angle;
      const camX = Math.sin(angle) * baseDist + this.parallax.x;
      const camZ = Math.cos(angle) * baseDist;

      this.targetPos.set(camX, camY, camZ);
      this.targetLookAt.set(this.parallax.x * 0.25, 3 + this.orbit.pitch * 4, 0);

      const lerpSpeed = this.reducedMotion ? 0.9 : 0.07;
      this.currentPos.lerp(this.targetPos, lerpSpeed);
      this.currentTarget.lerp(this.targetLookAt, lerpSpeed);

      this.camera.position.copy(this.currentPos);
      this.camera.lookAt(this.currentTarget);
      return;
    }

    if (this.mode === "FOCUS") {
      const lerpSpeed = this.reducedMotion ? 0.9 : 0.08;
      this.currentPos.lerp(this.targetPos, lerpSpeed);
      this.currentTarget.lerp(this.targetLookAt, lerpSpeed);

      this.camera.position.copy(this.currentPos);
      this.camera.lookAt(this.currentTarget);
    }
  }
}
