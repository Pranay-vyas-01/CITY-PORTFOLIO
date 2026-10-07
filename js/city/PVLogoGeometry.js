/**
 * PV MONOGRAM 3D GEOMETRY BUILDER
 * High-precision architectural 3D typography for "PV" (Pranay Vyas).
 * Clean, unmistakable P on the left and V on the right.
 * Beveled obsidian / graphite metal with subtle Midnight Violet edge illumination.
 */

export function createPVMonogramMesh(options = {}) {
  const scale = options.scale || 1.0;
  const isCityVersion = options.isCityVersion || false;

  const group = new THREE.Group();
  group.userData = { isPVMonogram: true };

  // ==========================================
  // 1. SHAPE DEFINITION FOR LETTER "P"
  // ==========================================
  const pShape = new THREE.Shape();
  // Outer contour of P (counter-clockwise)
  pShape.moveTo(-2.2, -1.8);        // Bottom-left stem base
  pShape.lineTo(-1.6, -1.8);        // Bottom-right of stem
  pShape.lineTo(-1.6, -0.05);       // Up stem to bottom of bowl
  pShape.lineTo(-1.0, -0.05);       // Right to bottom arc start
  // Smooth rounded outer bowl
  pShape.bezierCurveTo(-0.15, -0.05, -0.15, 1.8, -1.0, 1.8); // Outer arc to top
  pShape.lineTo(-2.2, 1.8);         // Left to top-left stem corner
  pShape.closePath();               // Down stem to start

  // Inner counter (hole) of P (clockwise)
  const pHole = new THREE.Path();
  pHole.moveTo(-1.6, 0.5);          // Bottom-left of hole
  pHole.lineTo(-1.0, 0.5);          // Bottom-right of hole
  pHole.bezierCurveTo(-0.55, 0.5, -0.55, 1.25, -1.0, 1.25); // Inner curve
  pHole.lineTo(-1.6, 1.25);         // Top-left of hole
  pHole.closePath();
  pShape.holes.push(pHole);

  // ==========================================
  // 2. SHAPE DEFINITION FOR LETTER "V"
  // ==========================================
  const vShape = new THREE.Shape();
  // Outer contour of V
  vShape.moveTo(-0.1, 1.8);         // Top-left outer corner
  vShape.lineTo(0.95, -1.8);        // Sharp bottom vertex
  vShape.lineTo(2.0, 1.8);          // Top-right outer corner
  vShape.lineTo(1.42, 1.8);         // Top-right inner corner
  vShape.lineTo(0.95, -0.65);       // Inner notch apex
  vShape.lineTo(0.48, 1.8);         // Top-left inner corner
  vShape.closePath();

  // ==========================================
  // 3. INTERLOCKING BRIDGE CONNECTOR
  // ==========================================
  // Subtle geometric tie connecting P bowl bottom to V left diagonal
  const tieShape = new THREE.Shape();
  tieShape.moveTo(-1.0, 0.05);
  tieShape.lineTo(0.3, 0.05);
  tieShape.lineTo(0.2, -0.35);
  tieShape.lineTo(-1.0, -0.35);
  tieShape.closePath();

  // ==========================================
  // 4. EXTRUSION SETTINGS (PREMIUM BEVELS)
  // ==========================================
  const extrudeSettings = {
    depth: 0.42,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.05,
    bevelThickness: 0.06
  };

  const pGeo = new THREE.ExtrudeGeometry(pShape, extrudeSettings);
  const vGeo = new THREE.ExtrudeGeometry(vShape, extrudeSettings);
  const tieGeo = new THREE.ExtrudeGeometry(tieShape, {
    depth: 0.32,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.03,
    bevelThickness: 0.04
  });

  // Center geometries along Z axis
  pGeo.center();
  vGeo.center();
  tieGeo.center();

  // Re-position back to exact typographic alignment
  // P center was around (-1.17, 0.0), V center around (0.95, 0.0)
  pGeo.translate(-1.18, 0, 0);
  vGeo.translate(0.95, 0, 0);
  tieGeo.translate(-0.35, -0.15, -0.05);

  // ==========================================
  // 5. MATERIALS: OBSIDIAN GRAPHITE & VIOLET
  // ==========================================
  const obsidianMat = new THREE.MeshStandardMaterial({
    color: 0x090714,
    roughness: 0.2,
    metalness: 0.92,
    emissive: 0x6d28d9,
    emissiveIntensity: isCityVersion ? 0.45 : 0.3
  });

  const edgeLineMat = new THREE.LineBasicMaterial({
    color: 0xc4b5fd,
    transparent: true,
    opacity: 0.45,
    blending: THREE.AdditiveBlending
  });

  // Meshes
  const pMesh = new THREE.Mesh(pGeo, obsidianMat);
  const vMesh = new THREE.Mesh(vGeo, obsidianMat);
  const tieMesh = new THREE.Mesh(tieGeo, obsidianMat);

  // Edges highlighting for crisp architectural silhouette
  const pEdges = new THREE.LineSegments(new THREE.EdgesGeometry(pGeo, 30), edgeLineMat);
  const vEdges = new THREE.LineSegments(new THREE.EdgesGeometry(vGeo, 30), edgeLineMat);

  group.add(pMesh);
  group.add(vMesh);
  group.add(tieMesh);
  group.add(pEdges);
  group.add(vEdges);

  // ==========================================
  // 6. ARCHITECTURAL PEDESTAL (BASE PLINTH)
  // ==========================================
  if (!isCityVersion) {
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0x07050f,
      roughness: 0.3,
      metalness: 0.85
    });

    // Tier 1 Base
    const plinth1 = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.22, 1.6), plinthMat);
    plinth1.position.y = -2.05;
    group.add(plinth1);

    // Glowing Violet Inset Line
    const glowLineMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.7
    });
    const glowLine = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.04, 1.45), glowLineMat);
    glowLine.position.y = -1.93;
    group.add(glowLine);

    // Subtle edge for plinth
    const plinthEdges = new THREE.LineSegments(new THREE.EdgesGeometry(plinth1.geometry), edgeLineMat);
    plinthEdges.position.copy(plinth1.position);
    group.add(plinthEdges);
  }

  group.scale.setScalar(scale);
  return group;
}
