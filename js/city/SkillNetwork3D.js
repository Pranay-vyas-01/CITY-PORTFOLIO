/**
 * 3D SKILL NETWORK
 * Interactive constellation of floating skill nodes (C, C++, DSA, GitHub, VS Code)
 * NO fake percentages, NO progress bars. Pure architectural nodes.
 */

export class SkillNetwork3D {
  constructor(containerEl, skillsData, onNodeSelect) {
    this.container = containerEl;
    this.skillsData = skillsData;
    this.onNodeSelect = onNodeSelect;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.nodesGroup = null;
    this.nodeMeshes = [];
    this.linesMesh = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-999, -999);
    this.hoveredNode = null;
    this.activeNode = null;
    this.animId = null;
    this.isDragging = false;
    this.prevMouse = { x: 0, y: 0 };
    this.targetRotation = { x: 0.1, y: 0 };

    this.init();
  }

  init() {
    const width = this.container.clientWidth || 600;
    const height = this.container.clientHeight || 450;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(0, 0, 16);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // Subtle lighting
    const ambLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambLight);

    const pointLight = new THREE.PointLight(0xa78bfa, 2, 30);
    pointLight.position.set(5, 8, 10);
    this.scene.add(pointLight);

    this.buildNetwork();
    this.bindEvents();
    this.animate();
  }

  buildNetwork() {
    this.nodesGroup = new THREE.Group();
    this.scene.add(this.nodesGroup);

    // Central core node
    const coreGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x1e1233,
      emissive: 0x7c3aed,
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: false
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.userData = { isCore: true, name: "FOUNDATION" };
    this.nodesGroup.add(coreMesh);

    // Core wireframe shell
    const shellGeo = new THREE.IcosahedronGeometry(1.5, 1);
    const shellMat = new THREE.MeshBasicMaterial({
      color: 0xc4b5fd,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    this.nodesGroup.add(new THREE.Mesh(shellGeo, shellMat));

    // Outer satellite nodes in 3D orbit
    const count = this.skillsData.length;
    const radius = 6.2;
    const nodeCoords = [];

    this.skillsData.forEach((skill, i) => {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi) * 0.75;
      const z = radius * Math.cos(phi);

      nodeCoords.push(new THREE.Vector3(x, y, z));

      const group = new THREE.Group();
      group.position.set(x, y, z);

      // Node Geometry: Chamfered octahedron/dodecahedron
      const nodeGeo = new THREE.OctahedronGeometry(0.9, 0);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: 0x0f0c1d,
        emissive: 0x8b5cf6,
        emissiveIntensity: 0.45,
        roughness: 0.2,
        metalness: 0.9
      });
      const mesh = new THREE.Mesh(nodeGeo, nodeMat);
      mesh.userData = { skill, group, baseEmissive: 0.45, index: i };
      group.add(mesh);

      // Orbiting ring around node
      const ringGeo = new THREE.RingGeometry(1.2, 1.25, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xa78bfa,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      group.add(ring);

      this.nodesGroup.add(group);
      this.nodeMeshes.push(mesh);
    });

    // Constellation lines connecting nodes
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x7c3aed,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });

    const lineGeo = new THREE.BufferGeometry();
    const linePoints = [];

    // Connect core to every node
    nodeCoords.forEach((p) => {
      linePoints.push(0, 0, 0);
      linePoints.push(p.x, p.y, p.z);
    });

    // Connect adjacent nodes in ring
    for (let i = 0; i < count; i++) {
      const p1 = nodeCoords[i];
      const p2 = nodeCoords[(i + 1) % count];
      linePoints.push(p1.x, p1.y, p1.z);
      linePoints.push(p2.x, p2.y, p2.z);
    }

    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePoints, 3));
    this.linesMesh = new THREE.LineSegments(lineGeo, lineMat);
    this.nodesGroup.add(this.linesMesh);
  }

  bindEvents() {
    const el = this.renderer.domElement;

    el.addEventListener("mousedown", (e) => {
      this.isDragging = true;
      this.prevMouse = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener("mouseup", () => {
      this.isDragging = false;
    });

    window.addEventListener("mousemove", (e) => {
      if (this.isDragging) {
        const dx = e.clientX - this.prevMouse.x;
        const dy = e.clientY - this.prevMouse.y;
        this.targetRotation.y += dx * 0.008;
        this.targetRotation.x += dy * 0.008;
        this.prevMouse = { x: e.clientX, y: e.clientY };
      }

      const rect = el.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });

    el.addEventListener("click", () => {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.nodeMeshes);
      if (intersects.length > 0) {
        const target = intersects[0].object;
        this.selectNode(target.userData.skill.id);
      }
    });

    window.addEventListener("resize", () => {
      if (!this.container || !this.renderer) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      if (w && h) {
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
      }
    });
  }

  selectNode(skillId) {
    this.activeNode = skillId;
    this.nodeMeshes.forEach((mesh) => {
      const isSelected = mesh.userData.skill.id === skillId;
      mesh.material.emissiveIntensity = isSelected ? 1.0 : 0.35;
      mesh.material.emissive.setHex(isSelected ? 0x38bdf8 : 0x8b5cf6);
      mesh.scale.setScalar(isSelected ? 1.35 : 1.0);
    });

    if (this.onNodeSelect) {
      this.onNodeSelect(skillId);
    }
  }

  animate() {
    this.animId = requestAnimationFrame(() => this.animate());

    const time = performance.now() * 0.001;

    // Smooth rotation lerp
    if (!this.isDragging) {
      this.targetRotation.y += 0.003;
    }
    this.nodesGroup.rotation.y += (this.targetRotation.y - this.nodesGroup.rotation.y) * 0.08;
    this.nodesGroup.rotation.x += (this.targetRotation.x - this.nodesGroup.rotation.x) * 0.08;

    // Bobbing and local rotation of individual nodes
    this.nodeMeshes.forEach((mesh, i) => {
      mesh.rotation.x = time * 0.6 + i;
      mesh.rotation.y = time * 0.8 + i;
      mesh.parent.position.y += Math.sin(time * 1.5 + i) * 0.002;
    });

    // Hover raycast
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.nodeMeshes);

    if (intersects.length > 0) {
      const hovered = intersects[0].object;
      if (this.hoveredNode !== hovered) {
        if (this.hoveredNode && this.hoveredNode.userData.skill.id !== this.activeNode) {
          this.hoveredNode.material.emissiveIntensity = this.hoveredNode.userData.baseEmissive;
          this.hoveredNode.scale.setScalar(1.0);
        }
        this.hoveredNode = hovered;
        hovered.material.emissiveIntensity = 0.9;
        if (hovered.userData.skill.id !== this.activeNode) {
          hovered.scale.setScalar(1.2);
        }
      }
    } else if (this.hoveredNode) {
      if (this.hoveredNode.userData.skill.id !== this.activeNode) {
        this.hoveredNode.material.emissiveIntensity = this.hoveredNode.userData.baseEmissive;
        this.hoveredNode.scale.setScalar(1.0);
      }
      this.hoveredNode = null;
    }

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.remove();
    }
  }
}
