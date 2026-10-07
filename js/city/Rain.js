/**
 * RAIN & ATMOSPHERIC DROPLET SYSTEM
 * Stylized cinematic rain streaks + virtual camera lens droplets
 */

export class RainSystem {
  constructor(scene, isMobile = false) {
    this.scene = scene;
    this.isMobile = isMobile;
    this.enabled = true;
    this.rainMesh = null;
    this.count = isMobile ? 400 : 1200;
    this.positions = null;
    this.speeds = null;
    this.lensCanvas = null;
    this.lensCtx = null;
    this.droplets = [];

    this.initRainMesh();
    this.initLensDroplets();
  }

  initRainMesh() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.count * 6); // 2 vertices per line streak
    const speeds = new Float32Array(this.count);

    const rangeX = 80;
    const rangeY = 45;
    const rangeZ = 80;

    for (let i = 0; i < this.count; i++) {
      const x = (Math.random() - 0.5) * rangeX;
      const y = Math.random() * rangeY;
      const z = (Math.random() - 0.5) * rangeZ;
      const len = 0.8 + Math.random() * 0.9;

      positions[i * 6] = x;
      positions[i * 6 + 1] = y;
      positions[i * 6 + 2] = z;

      // Slight angle to simulate wind/cinematic fall
      positions[i * 6 + 3] = x + 0.08;
      positions[i * 6 + 4] = y - len;
      positions[i * 6 + 5] = z + 0.04;

      speeds[i] = 28 + Math.random() * 22;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    this.positions = positions;
    this.speeds = speeds;

    const material = new THREE.LineBasicMaterial({
      color: 0x9370db,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.rainMesh = new THREE.LineSegments(geometry, material);
    this.scene.add(this.rainMesh);
  }

  initLensDroplets() {
    this.lensCanvas = document.createElement("canvas");
    this.lensCanvas.id = "lens-droplets";
    this.lensCanvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(this.lensCanvas);
    this.lensCtx = this.lensCanvas.getContext("2d");

    this.resizeLens();
    window.addEventListener("resize", () => this.resizeLens());

    // Spawn occasional camera droplets
    setInterval(() => {
      if (!this.enabled || document.hidden || this.droplets.length > (this.isMobile ? 3 : 8)) return;
      if (Math.random() > 0.4) {
        this.spawnDroplet();
      }
    }, 1200);
  }

  resizeLens() {
    if (!this.lensCanvas) return;
    this.lensCanvas.width = window.innerWidth;
    this.lensCanvas.height = window.innerHeight;
  }

  spawnDroplet() {
    const w = this.lensCanvas.width;
    const h = this.lensCanvas.height;
    this.droplets.push({
      x: 30 + Math.random() * (w - 60),
      y: 30 + Math.random() * (h - 60),
      radius: 2 + Math.random() * 4,
      alpha: 0.0,
      targetAlpha: 0.28 + Math.random() * 0.25,
      life: 0,
      maxLife: 180 + Math.random() * 120,
      distortion: 0.8 + Math.random() * 0.4
    });
  }

  update(delta) {
    if (!this.enabled) {
      if (this.rainMesh) this.rainMesh.visible = false;
      if (this.lensCtx) this.lensCtx.clearRect(0, 0, this.lensCanvas.width, this.lensCanvas.height);
      return;
    }

    if (this.rainMesh) {
      this.rainMesh.visible = true;
      const positions = this.rainMesh.geometry.attributes.position.array;
      const len = this.count;

      for (let i = 0; i < len; i++) {
        const speed = this.speeds[i] * delta;
        positions[i * 6 + 1] -= speed;
        positions[i * 6 + 4] -= speed;

        if (positions[i * 6 + 4] < -1) {
          const y = 40 + Math.random() * 10;
          const streak = 0.8 + Math.random() * 0.9;
          positions[i * 6 + 1] = y;
          positions[i * 6 + 4] = y - streak;
        }
      }

      this.rainMesh.geometry.attributes.position.needsUpdate = true;
    }

    // Update virtual-camera droplets
    if (this.lensCtx && this.lensCanvas) {
      this.lensCtx.clearRect(0, 0, this.lensCanvas.width, this.lensCanvas.height);

      for (let i = this.droplets.length - 1; i >= 0; i--) {
        const d = this.droplets[i];
        d.life++;

        if (d.life < 30) {
          d.alpha += (d.targetAlpha - d.alpha) * 0.1;
        } else if (d.life > d.maxLife - 40) {
          d.alpha *= 0.92;
        }

        if (d.life >= d.maxLife || d.alpha <= 0.01) {
          this.droplets.splice(i, 1);
          continue;
        }

        // Draw soft refractive droplet
        const ctx = this.lensCtx;
        ctx.save();
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);

        const grad = ctx.createRadialGradient(
          d.x - d.radius * 0.3,
          d.y - d.radius * 0.3,
          d.radius * 0.1,
          d.x,
          d.y,
          d.radius
        );
        grad.addColorStop(0, `rgba(255, 255, 255, ${d.alpha * 0.9})`);
        grad.addColorStop(0.5, `rgba(167, 139, 250, ${d.alpha * 0.5})`);
        grad.addColorStop(1, `rgba(11, 9, 20, ${d.alpha * 0.1})`);

        ctx.fillStyle = grad;
        ctx.fill();

        ctx.strokeStyle = `rgba(196, 181, 253, ${d.alpha * 0.6})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.restore();
      }
    }
  }

  setTheme(isDark) {
    if (this.rainMesh) {
      this.rainMesh.material.color.setHex(isDark ? 0x9370db : 0x7c3aed);
      this.rainMesh.material.opacity = isDark ? 0.35 : 0.22;
    }
  }

  toggle(force) {
    this.enabled = force !== undefined ? force : !this.enabled;
    if (!this.enabled && this.lensCtx && this.lensCanvas) {
      this.lensCtx.clearRect(0, 0, this.lensCanvas.width, this.lensCanvas.height);
    }
    return this.enabled;
  }
}
