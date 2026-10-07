/**
 * CITY SCENE — THREE.JS 3D ENVIRONMENT
 * Midnight Violet atmospheric night city with wet reflective streets,
 * distant skyline, moon, stars, rain, and interactive foreground architecture.
 */

import { CityBuildings } from "./Buildings.js";
import { RainSystem } from "./Rain.js";
import { CityCameraController } from "./CameraController.js";

export class CityScene {
  constructor(canvasContainer, config, callbacks) {
    this.container = canvasContainer;
    this.config = config;
    this.callbacks = callbacks || {};

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.cameraController = null;
    this.buildings = null;
    this.rain = null;

    this.ambientLight = null;
    this.moonLight = null;
    this.rimLight = null;
    this.moonMesh = null;
    this.stars = null;
    this.skylineGroup = null;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-999, -999);
    this.isDark = true;
    this.isMobile = window.innerWidth <= 768;
    this.clock = new THREE.Clock();
    this.animId = null;

    this.init();
  }

  init() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x06050e);
    this.scene.fog = new THREE.FogExp2(0x080614, 0.015);

    this.camera = new THREE.PerspectiveCamera(46, width / height, 0.5, 300);

    // 2. WebGL Renderer with Tone Mapping
    this.renderer = new THREE.WebGLRenderer({
      powerPreference: "high-performance",
      antialias: !this.isMobile,
      stencil: false,
      depth: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.domElement.id = "city-webgl-canvas";
    this.container.appendChild(this.renderer.domElement);

    // 3. Lighting
    this.initLighting();

    // 4. Celestial: Moon, Stars & Distant Clouds
    this.initCelestial();

    // 5. Environment: Wet Reflective Streets & Distant Skyline
    this.initGroundAndRoads();
    this.initDistantSkyline();

    // 6. Rain System
    this.rain = new RainSystem(this.scene, this.isMobile);

    // 7. Interactive Foreground Buildings
    this.buildings = new CityBuildings(
      this.scene,
      this.config,
      (bData) => this.callbacks.onBuildingHover?.(bData),
      (bData) => this.callbacks.onBuildingClick?.(bData)
    );

    // 8. Camera Controller
    this.cameraController = new CityCameraController(
      this.camera,
      this.renderer.domElement,
      (mode, data) => this.callbacks.onCameraModeChange?.(mode, data)
    );

    // 9. Events & Render Loop
    this.bindEvents();
    this.animate();
  }

  initLighting() {
    // Ambient Midnight Violet Fill
    this.ambientLight = new THREE.AmbientLight(0x23143d, 0.95);
    this.scene.add(this.ambientLight);

    // Cool Lavender Directional Moon Light
    this.moonLight = new THREE.DirectionalLight(0xc4b5fd, 1.4);
    this.moonLight.position.set(-35, 55, -45);
    this.scene.add(this.moonLight);

    // Subtle Cool Blue Ground Rim
    this.rimLight = new THREE.DirectionalLight(0x38bdf8, 0.45);
    this.rimLight.position.set(40, 20, 40);
    this.scene.add(this.rimLight);

    // Strategic City Point Lights
    const lightColors = [0x8b5cf6, 0x38bdf8, 0xa78bfa, 0xec4899];
    const lightCoords = [
      [0, 4, 0],
      [-12, 5, 8],
      [14, 5, -8],
      [0, 5, 12]
    ];

    lightCoords.forEach(([x, y, z], i) => {
      const pLight = new THREE.PointLight(lightColors[i % lightColors.length], 0.8, 22);
      pLight.position.set(x, y, z);
      this.scene.add(pLight);
    });
  }

  initCelestial() {
    // Crescent Moon
    const moonGeo = new THREE.SphereGeometry(3.5, 24, 24);
    const moonMat = new THREE.MeshBasicMaterial({ color: 0xe2d9fd });
    this.moonMesh = new THREE.Mesh(moonGeo, moonMat);
    this.moonMesh.position.set(-42, 62, -75);
    this.scene.add(this.moonMesh);

    // Moon Glow Aura Ring
    const haloGeo = new THREE.RingGeometry(3.6, 6.2, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x9370db,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.copy(this.moonMesh.position);
    halo.lookAt(0, 20, 20);
    this.scene.add(halo);

    // Stars
    const starCount = this.isMobile ? 350 : 800;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const radius = 130 + Math.random() * 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * (Math.PI * 0.42); // Upper hemisphere only

      starPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = radius * Math.cos(phi) + 10;
      starPos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }

    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xddd6fe,
      size: 0.8,
      transparent: true,
      opacity: 0.75
    });
    this.stars = new THREE.Points(starGeo, starMat);
    this.scene.add(this.stars);
  }

  initGroundAndRoads() {
    // Wet Reflective Asphalt Ground
    const groundGeo = new THREE.PlaneGeometry(160, 160);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x07060f,
      roughness: 0.22,
      metalness: 0.85
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    this.scene.add(ground);

    // City Street Grid Lines & Intersection Markings
    const roadGroup = new THREE.Group();
    const lineMat = new THREE.MeshBasicMaterial({
      color: 0x4c1d95,
      transparent: true,
      opacity: 0.45
    });

    const markMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.65
    });

    // Main Avenues (Cross Grid)
    const aveGeo1 = new THREE.PlaneGeometry(150, 4.2);
    const ave1 = new THREE.Mesh(aveGeo1, lineMat);
    ave1.rotation.x = -Math.PI / 2;
    ave1.position.set(0, 0.02, 0);
    roadGroup.add(ave1);

    const aveGeo2 = new THREE.PlaneGeometry(4.2, 150);
    const ave2 = new THREE.Mesh(aveGeo2, lineMat);
    ave2.rotation.x = -Math.PI / 2;
    ave2.position.set(0, 0.02, 0);
    roadGroup.add(ave2);

    // Cross Secondary Streets
    const streets = [-24, -12, 12, 24];
    streets.forEach((pos) => {
      const sH = new THREE.Mesh(new THREE.PlaneGeometry(140, 2.2), lineMat);
      sH.rotation.x = -Math.PI / 2;
      sH.position.set(0, 0.02, pos);
      roadGroup.add(sH);

      const sV = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 140), lineMat);
      sV.rotation.x = -Math.PI / 2;
      sV.position.set(pos, 0.02, 0);
      roadGroup.add(sV);
    });

    // Subtle reflective lane dividers
    for (let x = -60; x <= 60; x += 6) {
      if (Math.abs(x) < 2) continue;
      const marker = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.25), markMat);
      marker.rotation.x = -Math.PI / 2;
      marker.position.set(x, 0.03, 0);
      roadGroup.add(marker);

      const markerV = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 2.4), markMat);
      markerV.rotation.x = -Math.PI / 2;
      markerV.position.set(0, 0.03, x);
      roadGroup.add(markerV);
    }

    this.scene.add(roadGroup);
  }

  initDistantSkyline() {
    this.skylineGroup = new THREE.Group();
    const count = this.isMobile ? 36 : 72;
    const baseColor = 0x0a0714;

    const towerMat = new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: 0.4,
      metalness: 0.8
    });

    const windowColors = [0x7c3aed, 0x8b5cf6, 0x38bdf8, 0x9333ea];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const dist = 55 + (i % 5) * 6 + Math.random() * 8;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;

      const w = 4.5 + Math.random() * 4.5;
      const h = 18 + Math.random() * 26 + (dist > 70 ? 10 : 0);
      const d = 4.5 + Math.random() * 4.5;

      const tower = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), towerMat);
      tower.position.set(x, h * 0.5, z);
      this.skylineGroup.add(tower);

      // Random glowing window strips
      const bandCount = 2 + Math.floor(Math.random() * 4);
      for (let b = 0; b < bandCount; b++) {
        const winColor = windowColors[Math.floor(Math.random() * windowColors.length)];
        const bandMat = new THREE.MeshBasicMaterial({
          color: winColor,
          transparent: true,
          opacity: 0.35 + Math.random() * 0.4
        });
        const band = new THREE.Mesh(new THREE.BoxGeometry(w * 1.01, 0.35, d * 1.01), bandMat);
        band.position.set(x, 4 + b * (h / (bandCount + 1)), z);
        this.skylineGroup.add(band);
      }

      // Rooftop antennas with blinking beacons
      if (Math.random() > 0.4) {
        const antennaH = 3 + Math.random() * 4;
        const antenna = new THREE.Mesh(
          new THREE.CylinderGeometry(0.08, 0.15, antennaH, 4),
          new THREE.MeshBasicMaterial({ color: 0x3b1d6e })
        );
        antenna.position.set(x, h + antennaH * 0.5, z);
        this.skylineGroup.add(antenna);

        const beacon = new THREE.Mesh(
          new THREE.SphereGeometry(0.18, 6, 6),
          new THREE.MeshBasicMaterial({ color: 0xc4b5fd })
        );
        beacon.position.set(x, h + antennaH, z);
        this.skylineGroup.add(beacon);
      }
    }

    this.scene.add(this.skylineGroup);
  }

  bindEvents() {
    window.addEventListener("resize", () => this.onResize());

    const canvas = this.renderer.domElement;

    canvas.addEventListener("mousemove", (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      this.checkHover();
    });

    canvas.addEventListener("click", () => {
      if (this.cameraController.mode === "MAP") {
        this.checkClick();
      }
    });

    // Touch tap for mobile
    let touchStartTime = 0;
    canvas.addEventListener("touchstart", (e) => {
      touchStartTime = Date.now();
      if (e.touches.length === 1) {
        this.mouse.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    }, { passive: true });

    canvas.addEventListener("touchend", () => {
      if (Date.now() - touchStartTime < 250 && this.cameraController.mode === "MAP") {
        this.checkClick();
      }
    });
  }

  checkHover() {
    if (this.cameraController.mode !== "MAP") {
      this.buildings.setHover(null);
      return;
    }

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.buildings.buildingMeshes);

    if (intersects.length > 0) {
      const targetMesh = intersects[0].object;
      const bId = targetMesh.userData.buildingId;
      if (bId) {
        this.buildings.setHover(bId);
        return;
      }
    }
    this.buildings.setHover(null);
  }

  checkClick() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.buildings.buildingMeshes);

    if (intersects.length > 0) {
      const bId = intersects[0].object.userData.buildingId;
      if (bId) {
        const b = this.buildings.getBuilding(bId);
        if (b && this.callbacks.onBuildingSelect) {
          // Trigger central navigation callback
          this.callbacks.onBuildingSelect(b.data);
        }
      }
    }
  }

  navigateToBuilding(bData) {
    if (!bData) return;
    this.buildings.setActive(bData.id);
    this.cameraController.focusBuilding(bData);
    // Do NOT re-trigger callbacks.onBuildingSelect to avoid infinite recursion
  }

  returnToMap() {
    this.buildings.setActive(null);
    this.cameraController.returnToMap();
  }

  onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.isMobile = w <= 768;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2));
  }

  // CINEMATIC THEME TRANSITION: Night <-> Dawn/Day
  setTheme(isDark) {
    this.isDark = isDark;
    const duration = 1.2;

    const targetBg = isDark ? new THREE.Color(0x06050e) : new THREE.Color(0x1a152e);
    const targetFog = isDark ? new THREE.Color(0x080614) : new THREE.Color(0x28203f);
    const targetAmb = isDark ? new THREE.Color(0x23143d) : new THREE.Color(0x52427a);
    const targetMoon = isDark ? new THREE.Color(0xc4b5fd) : new THREE.Color(0xfff3e0);

    // Smooth color lerp
    const startTime = performance.now();
    const animateTheme = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      const t = Math.min(1.0, elapsed / duration);
      const ease = t * (2 - t);

      this.scene.background.lerp(targetBg, ease * 0.1);
      this.scene.fog.color.lerp(targetFog, ease * 0.1);
      this.ambientLight.color.lerp(targetAmb, ease * 0.1);
      this.moonLight.color.lerp(targetMoon, ease * 0.1);

      if (t < 1.0) {
        requestAnimationFrame(animateTheme);
      }
    };
    animateTheme();

    if (this.buildings) this.buildings.setTheme(isDark);
    if (this.rain) this.rain.setTheme(isDark);
    if (this.stars) this.stars.visible = isDark;
  }

  animate() {
    this.animId = requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // Update Camera
    if (this.cameraController) {
      this.cameraController.update(delta);
    }

    // Update Rain
    if (this.rain) {
      this.rain.update(delta);
    }

    // Update Buildings (PV artifact rotation, pulses)
    if (this.buildings) {
      this.buildings.update(time, delta);
    }

    // Twinkle stars
    if (this.stars && this.isDark) {
      this.stars.rotation.y = time * 0.005;
    }

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
    window.removeEventListener("resize", this.onResize);
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.remove();
    }
  }
}
