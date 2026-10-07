/**
 * CITY BUILDINGS & SIGNATURE PV ARTIFACT
 * 9 distinctive foreground architectural buildings representing Pranay's journey.
 * Rich procedural geometry, Midnight Violet materials, and interactive states.
 */

import { createPVMonogramMesh } from "./PVLogoGeometry.js";

export class CityBuildings {
  constructor(scene, config, onBuildingHover, onBuildingClick) {
    this.scene = scene;
    this.config = config;
    this.onBuildingHover = onBuildingHover;
    this.onBuildingClick = onBuildingClick;

    this.buildingsGroup = new THREE.Group();
    this.scene.add(this.buildingsGroup);

    this.buildingMeshes = [];
    this.buildingMap = new Map();
    this.pvMesh = null;
    this.hoveredBuilding = null;
    this.activeBuildingId = null;

    this.buildAll();
  }

  buildAll() {
    this.config.buildings.forEach((bData) => {
      const bGroup = this.createBuilding(bData);
      bGroup.position.set(bData.pos.x, bData.pos.y, bData.pos.z);
      this.buildingsGroup.add(bGroup);
      this.buildingMap.set(bData.id, { data: bData, group: bGroup });
    });
  }

  createBuilding(data) {
    const group = new THREE.Group();
    group.userData = { id: data.id, config: data, isInteractive: true };

    const baseColor = 0x0c0a17;
    const trimColor = 0x17122b;
    const accentHex = parseInt(data.color.replace("#", "0x"), 16);

    // Standard architectural materials
    const wallMat = new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: 0.35,
      metalness: 0.85
    });

    const trimMat = new THREE.MeshStandardMaterial({
      color: trimColor,
      roughness: 0.25,
      metalness: 0.9
    });

    const emissiveMat = new THREE.MeshStandardMaterial({
      color: 0x0f0c1d,
      emissive: accentHex,
      emissiveIntensity: 0.65,
      roughness: 0.2,
      metalness: 0.7
    });

    group.userData.emissiveMat = emissiveMat;
    group.userData.baseEmissive = 0.65;

    // Building-specific architectural designs
    switch (data.id) {
      case "about":
        this.buildHomeBase(group, data, wallMat, trimMat, emissiveMat);
        break;
      case "education":
        this.buildEducationComplex(group, data, wallMat, trimMat, emissiveMat);
        break;
      case "skills":
        this.buildTechTower(group, data, wallMat, trimMat, emissiveMat);
        break;
      case "projects":
        this.buildProjectLabs(group, data, wallMat, trimMat, emissiveMat);
        break;
      case "github":
        this.buildGitHubCommandCenter(group, data, wallMat, trimMat, emissiveMat);
        break;
      case "goals":
        this.buildFutureTower(group, data, wallMat, trimMat, emissiveMat);
        break;
      case "resume":
        this.buildCareerCenter(group, data, wallMat, trimMat, emissiveMat);
        break;
      case "contact":
        this.buildCommunicationTower(group, data, wallMat, trimMat, emissiveMat);
        break;
      case "innovation":
        this.buildInnovationLab(group, data, wallMat, trimMat, emissiveMat);
        break;
      default:
        this.buildGenericBuilding(group, data, wallMat, trimMat, emissiveMat);
    }

    // Register all child meshes for raycasting
    group.traverse((child) => {
      if (child.isMesh) {
        child.userData.buildingId = data.id;
        child.userData.parentBuilding = group;
        this.buildingMeshes.push(child);
      }
    });

    return group;
  }

  // 01 / ABOUT — HOME BASE + PV SIGNATURE ARTIFACT
  buildHomeBase(group, data, wallMat, trimMat, emissiveMat) {
    const { w, h, d } = data.size;

    // Plinth
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(w * 1.25, 0.6, d * 1.25), trimMat);
    plinth.position.y = 0.3;
    group.add(plinth);

    // Main Pavilion Body with glass atrium
    const mainBody = new THREE.Mesh(new THREE.BoxGeometry(w, h * 0.7, d), wallMat);
    mainBody.position.y = h * 0.35 + 0.6;
    group.add(mainBody);

    // Horizontal window bands
    const bandMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.75 });
    for (let i = 1; i <= 4; i++) {
      const band = new THREE.Mesh(new THREE.BoxGeometry(w * 1.02, 0.3, d * 1.02), bandMat);
      band.position.y = i * 1.4 + 1.2;
      group.add(band);
    }

    // Roof Terrace
    const roof = new THREE.Mesh(new THREE.BoxGeometry(w * 0.85, 0.4, d * 0.85), trimMat);
    roof.position.y = h * 0.7 + 0.8;
    group.add(roof);

    // Rooftop Glass Canopy
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(w * 0.5, 1.2, d * 0.5), emissiveMat);
    canopy.position.y = h * 0.7 + 1.6;
    group.add(canopy);

    // SIGNATURE PV 3D ARTIFACT (Obsidian architectural monolith)
    this.pvMesh = this.createPVArtifact();
    this.pvMesh.position.set(0, h * 0.7 + 3.2, 0);
    this.pvMesh.scale.setScalar(0.9);
    group.add(this.pvMesh);
    group.userData.pvArtifact = this.pvMesh;
  }

  // Obsidian Architectural PV Monogram
  createPVArtifact() {
    const pvGroup = createPVMonogramMesh({ scale: 0.65, isCityVersion: true });
    pvGroup.userData = { isPVArtifact: true };
    return pvGroup;
  }

  // 02 / EDUCATION — JECRC UNIVERSITY
  buildEducationComplex(group, data, wallMat, trimMat, emissiveMat) {
    const { w, h, d } = data.size;

    // Podium
    const base = new THREE.Mesh(new THREE.BoxGeometry(w * 1.2, 0.8, d * 1.2), trimMat);
    base.position.y = 0.4;
    group.add(base);

    // East Wing
    const eastWing = new THREE.Mesh(new THREE.BoxGeometry(w * 0.38, h * 0.85, d * 0.9), wallMat);
    eastWing.position.set(-w * 0.32, h * 0.425 + 0.8, 0);
    group.add(eastWing);

    // West Wing
    const westWing = new THREE.Mesh(new THREE.BoxGeometry(w * 0.38, h * 0.7, d * 0.9), wallMat);
    westWing.position.set(w * 0.32, h * 0.35 + 0.8, 0);
    group.add(westWing);

    // Elevated Central Atrium / Skybridge
    const skybridge = new THREE.Mesh(new THREE.BoxGeometry(w * 0.45, 1.2, d * 0.5), emissiveMat);
    skybridge.position.set(0, h * 0.55 + 0.8, 0);
    group.add(skybridge);

    // Academic Spire
    const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.4, 3.5, 8), trimMat);
    spire.position.set(-w * 0.32, h * 0.85 + 2.5, 0);
    group.add(spire);

    // Architectural beacon
    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12), emissiveMat);
    beacon.position.set(-w * 0.32, h * 0.85 + 4.3, 0);
    group.add(beacon);
  }

  // 03 / SKILLS — TECH TOWER
  buildTechTower(group, data, wallMat, trimMat, emissiveMat) {
    const { w, h, d } = data.size;

    // Stepped crystalline base
    const base1 = new THREE.Mesh(new THREE.CylinderGeometry(w * 0.6, w * 0.7, 1.5, 8), trimMat);
    base1.position.y = 0.75;
    group.add(base1);

    // Tower Shaft (Octagonal high-tech spire)
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(w * 0.35, w * 0.5, h * 0.8, 8), wallMat);
    shaft.position.y = h * 0.4 + 1.5;
    group.add(shaft);

    // Vertical glowing energy conduits
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const conduit = new THREE.Mesh(new THREE.BoxGeometry(0.12, h * 0.75, 0.12), emissiveMat);
      conduit.position.set(Math.cos(angle) * (w * 0.42), h * 0.4 + 1.5, Math.sin(angle) * (w * 0.42));
      group.add(conduit);
    }

    // Floating Holographic Rings
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.55 });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(w * 0.55, 0.06, 8, 32), ringMat);
    ring1.rotation.x = Math.PI / 2;
    ring1.position.y = h * 0.55 + 1.5;
    group.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(w * 0.42, 0.06, 8, 32), ringMat);
    ring2.rotation.x = Math.PI / 2;
    ring2.position.y = h * 0.75 + 1.5;
    group.add(ring2);

    // Tower Crown / Antenna
    const crown = new THREE.Mesh(new THREE.ConeGeometry(0.6, 2.5, 8), trimMat);
    crown.position.y = h * 0.8 + 2.75;
    group.add(crown);

    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), emissiveMat);
    tip.position.y = h * 0.8 + 4.1;
    group.add(tip);
  }

  // 04 / PROJECTS — PROJECT LABS
  buildProjectLabs(group, data, wallMat, trimMat, emissiveMat) {
    const { w, h, d } = data.size;

    // Foundation
    const base = new THREE.Mesh(new THREE.BoxGeometry(w * 1.1, 0.8, d * 1.1), trimMat);
    base.position.y = 0.4;
    group.add(base);

    // Lower Hub
    const lower = new THREE.Mesh(new THREE.BoxGeometry(w * 0.9, h * 0.45, d * 0.9), wallMat);
    lower.position.y = h * 0.225 + 0.8;
    group.add(lower);

    // Cantilevered Upper Lab Modules
    const module1 = new THREE.Mesh(new THREE.BoxGeometry(w * 0.6, h * 0.35, d * 0.75), wallMat);
    module1.position.set(-w * 0.18, h * 0.6 + 0.8, w * 0.1);
    group.add(module1);

    const module2 = new THREE.Mesh(new THREE.BoxGeometry(w * 0.55, h * 0.3, d * 0.65), emissiveMat);
    module2.position.set(w * 0.2, h * 0.68 + 0.8, -w * 0.1);
    group.add(module2);

    // Observation Deck & Roof Grid
    const deck = new THREE.Mesh(new THREE.BoxGeometry(w * 0.75, 0.25, d * 0.75), trimMat);
    deck.position.y = h * 0.85 + 0.8;
    group.add(deck);

    // Central Prototyping Core Light
    const coreLight = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.8, 16), emissiveMat);
    coreLight.position.set(0, h * 0.9 + 1.2, 0);
    group.add(coreLight);
  }

  // 05 / GITHUB — COMMAND CENTER
  buildGitHubCommandCenter(group, data, wallMat, trimMat, emissiveMat) {
    const { w, h, d } = data.size;

    // Fortress Foundation
    const base = new THREE.Mesh(new THREE.BoxGeometry(w * 1.15, 1.2, d * 1.15), trimMat);
    base.position.y = 0.6;
    group.add(base);

    // Brutalist Tower Core
    const core = new THREE.Mesh(new THREE.BoxGeometry(w * 0.8, h * 0.7, d * 0.8), wallMat);
    core.position.y = h * 0.35 + 1.2;
    group.add(core);

    // Recessed Server Matrix Windows
    const matrixMat = new THREE.MeshBasicMaterial({ color: 0x818cf8, transparent: true, opacity: 0.85 });
    for (let f = 1; f <= 5; f++) {
      const slit = new THREE.Mesh(new THREE.BoxGeometry(w * 0.85, 0.22, d * 0.85), matrixMat);
      slit.position.y = f * 1.5 + 1.4;
      group.add(slit);
    }

    // Telecommunications Dish & Antenna
    const dishArm = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.0, 8), trimMat);
    dishArm.position.set(0, h * 0.7 + 2.2, 0);
    group.add(dishArm);

    const dish = new THREE.Mesh(new THREE.ConeGeometry(1.2, 0.5, 16, 1, true), emissiveMat);
    dish.rotation.x = -Math.PI / 3;
    dish.rotation.z = Math.PI / 4;
    dish.position.set(0.6, h * 0.7 + 2.8, -0.4);
    group.add(dish);

    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), emissiveMat);
    beacon.position.set(0, h * 0.7 + 3.3, 0);
    group.add(beacon);
  }

  // 06 / GOALS — FUTURE TOWER
  buildFutureTower(group, data, wallMat, trimMat, emissiveMat) {
    const { w, h, d } = data.size;

    // Tier 1: Foundation (Student)
    const tier1 = new THREE.Mesh(new THREE.BoxGeometry(w, h * 0.35, d), wallMat);
    tier1.position.y = h * 0.175;
    group.add(tier1);

    // Tier 2: Stepped Middle (Developer)
    const tier2 = new THREE.Mesh(new THREE.BoxGeometry(w * 0.75, h * 0.3, d * 0.75), wallMat);
    tier2.position.y = h * 0.35 + h * 0.15;
    group.add(tier2);

    // Tier 3: Upper Spire (Software Engineer)
    const tier3 = new THREE.Mesh(new THREE.BoxGeometry(w * 0.5, h * 0.25, d * 0.5), wallMat);
    tier3.position.y = h * 0.65 + h * 0.125;
    group.add(tier3);

    // Tier 4: Pinnacle Crown (Future)
    const pinnacle = new THREE.Mesh(new THREE.ConeGeometry(w * 0.35, 3.8, 4), emissiveMat);
    pinnacle.position.y = h * 0.9 + 1.9;
    pinnacle.rotation.y = Math.PI / 4;
    group.add(pinnacle);

    // Vertical Ascension Light Strip
    const lightStrip = new THREE.Mesh(new THREE.BoxGeometry(0.15, h * 0.85, 0.15), emissiveMat);
    lightStrip.position.set(0, h * 0.45, d * 0.52);
    group.add(lightStrip);
  }

  // 07 / RESUME — CAREER CENTER
  buildCareerCenter(group, data, wallMat, trimMat, emissiveMat) {
    const { w, h, d } = data.size;

    // Modern architectural plinth
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(w * 1.2, 0.6, d * 1.2), trimMat);
    plinth.position.y = 0.3;
    group.add(plinth);

    // Transparent / Glass Corporate Pavilion
    const glassBody = new THREE.Mesh(new THREE.BoxGeometry(w, h * 0.7, d), wallMat);
    glassBody.position.y = h * 0.35 + 0.6;
    group.add(glassBody);

    // Internal Glowing Data Monolith
    const corePrism = new THREE.Mesh(new THREE.BoxGeometry(w * 0.45, h * 0.6, d * 0.45), emissiveMat);
    corePrism.position.y = h * 0.35 + 0.6;
    group.add(corePrism);

    // Cantilever Roof Overhang
    const roof = new THREE.Mesh(new THREE.BoxGeometry(w * 1.15, 0.35, d * 1.15), trimMat);
    roof.position.y = h * 0.7 + 0.75;
    group.add(roof);

    // Architectural fin array
    for (let i = -2; i <= 2; i++) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.08, h * 0.65, 0.6), trimMat);
      fin.position.set(i * 0.8, h * 0.35 + 0.6, d * 0.52);
      group.add(fin);
    }
  }

  // 08 / CONTACT — COMMUNICATION TOWER
  buildCommunicationTower(group, data, wallMat, trimMat, emissiveMat) {
    const { w, h, d } = data.size;

    // Hexagonal Base
    const base = new THREE.Mesh(new THREE.CylinderGeometry(w * 0.5, w * 0.65, 1.8, 6), trimMat);
    base.position.y = 0.9;
    group.add(base);

    // Slender Mast
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(w * 0.2, w * 0.35, h * 0.7, 6), wallMat);
    mast.position.y = h * 0.35 + 1.8;
    group.add(mast);

    // Circular Transmission Array Rings
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xd8b4fe, transparent: true, opacity: 0.6 });
    const r1 = new THREE.Mesh(new THREE.TorusGeometry(w * 0.45, 0.08, 8, 24), ringMat);
    r1.rotation.x = Math.PI / 2;
    r1.position.y = h * 0.5 + 1.8;
    group.add(r1);

    const r2 = new THREE.Mesh(new THREE.TorusGeometry(w * 0.3, 0.08, 8, 24), ringMat);
    r2.rotation.x = Math.PI / 2;
    r2.position.y = h * 0.7 + 1.8;
    group.add(r2);

    // Terminal Beacon Spike
    const spike = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.2, 3.2, 8), trimMat);
    spike.position.y = h * 0.7 + 3.4;
    group.add(spike);

    const beaconLight = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), emissiveMat);
    beaconLight.position.y = h * 0.7 + 5.0;
    group.add(beaconLight);
  }

  // 09 / INNOVATION — INNOVATION LAB
  buildInnovationLab(group, data, wallMat, trimMat, emissiveMat) {
    const { w, h, d } = data.size;

    // Foundation
    const base = new THREE.Mesh(new THREE.CylinderGeometry(w * 0.65, w * 0.7, 0.8, 16), trimMat);
    base.position.y = 0.4;
    group.add(base);

    // Geodesic Innovation Dome
    const domeGeo = new THREE.IcosahedronGeometry(w * 0.55, 2);
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0x140e26,
      emissive: 0xec4899,
      emissiveIntensity: 0.55,
      roughness: 0.15,
      metalness: 0.85,
      wireframe: false
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.y = w * 0.35 + 0.8;
    group.add(dome);

    // Outer wireframe orbit cage
    const cage = new THREE.Mesh(
      new THREE.IcosahedronGeometry(w * 0.65, 1),
      new THREE.MeshBasicMaterial({ color: 0xf472b6, wireframe: true, transparent: true, opacity: 0.4 })
    );
    cage.position.y = w * 0.35 + 0.8;
    group.add(cage);

    // Floating Ring
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(w * 0.7, w * 0.8, 32),
      new THREE.MeshBasicMaterial({ color: 0xf472b6, side: THREE.DoubleSide, transparent: true, opacity: 0.45 })
    );
    ring.rotation.x = Math.PI / 2.5;
    ring.position.y = w * 0.35 + 0.8;
    group.add(ring);
  }

  buildGenericBuilding(group, data, wallMat, trimMat, emissiveMat) {
    const { w, h, d } = data.size;
    const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallMat);
    body.position.y = h * 0.5;
    group.add(body);
  }

  // Update loop: slow PV artifact rotation, building animations
  update(time, delta) {
    // Rotate the signature PV identity object
    if (this.pvMesh) {
      this.pvMesh.rotation.y = time * 0.55;
      this.pvMesh.position.y = 10 * 0.7 + 3.2 + Math.sin(time * 1.5) * 0.15;
    }

    // Pulse hovered/active building emissive
    this.buildingMap.forEach(({ group }, id) => {
      const mat = group.userData.emissiveMat;
      if (!mat) return;

      const isHovered = this.hoveredBuilding === id;
      const isActive = this.activeBuildingId === id;
      const base = group.userData.baseEmissive || 0.65;

      const targetIntensity = isActive ? 1.6 : isHovered ? 1.35 : base;
      mat.emissiveIntensity += (targetIntensity - mat.emissiveIntensity) * 0.15;
    });
  }

  setHover(buildingId) {
    if (this.hoveredBuilding === buildingId) return;
    this.hoveredBuilding = buildingId;
    if (this.onBuildingHover) {
      this.onBuildingHover(buildingId ? this.buildingMap.get(buildingId)?.data : null);
    }
  }

  setActive(buildingId) {
    this.activeBuildingId = buildingId;
  }

  getBuilding(id) {
    return this.buildingMap.get(id);
  }

  setTheme(isDark) {
    this.buildingMap.forEach(({ group, data }) => {
      const mat = group.userData.emissiveMat;
      if (!mat) return;
      if (isDark) {
        mat.emissive.setHex(parseInt(data.color.replace("#", "0x"), 16));
        group.userData.baseEmissive = 0.65;
      } else {
        mat.emissive.setHex(parseInt(data.accent.replace("#", "0x"), 16));
        group.userData.baseEmissive = 0.45;
      }
    });
  }
}
