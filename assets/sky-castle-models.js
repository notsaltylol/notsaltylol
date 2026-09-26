/*
 * Reusable, fully three-dimensional architecture and vegetation.
 *
 * All colors and lighting come from the supplied materials. Small pieces are
 * merged by material, so ornament does not become hundreds of draw calls.
 * Local ground is y = 0. No camera, lights, image planes, or DOM are used here.
 */

function createWorkshop(THREE, materials) {
  const group = new THREE.Group();
  const buckets = new Map();
  const fallback = materials.stone;
  const material = (name) => materials[name] || fallback;

  function add(geometry, name, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], outline = false) {
    const selected = typeof name === 'string' ? material(name) : name;
    const key = `${selected.uuid}:${outline ? 'outline' : 'detail'}`;
    if (!buckets.has(key)) buckets.set(key, { material: selected, outline, geometries: [] });
    const transform = new THREE.Object3D();
    transform.position.set(...position);
    transform.rotation.set(...rotation);
    transform.scale.set(...scale);
    transform.updateMatrix();
    const transformed = geometry.index ? geometry.toNonIndexed() : geometry.clone();
    transformed.applyMatrix4(transform.matrix);
    buckets.get(key).geometries.push(transformed);
    geometry.dispose();
  }

  function box(name, x, y, z, w, h, d, rotation = [0, 0, 0], outline = false) {
    add(new THREE.BoxGeometry(w, h, d), name, [x, y, z], rotation, [1, 1, 1], outline);
  }

  function cylinder(name, x, y, z, radiusTop, radiusBottom, height, outline = false, segments = 32) {
    add(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments), name, [x, y, z], [0, 0, 0], [1, 1, 1], outline);
  }

  function lathe(name, x, y, z, points, outline = true) {
    add(new THREE.LatheGeometry(points.map(([r, h]) => new THREE.Vector2(r, h)), 40), name, [x, y, z], [0, 0, 0], [1, 1, 1], outline);
  }

  function tube(name, points, radius, segments = 24) {
    add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point))), segments, radius, 6, false), name);
  }

  function finish() {
    for (const bucket of buckets.values()) {
      const count = bucket.geometries.reduce((sum, geometry) => sum + geometry.attributes.position.count, 0);
      const positions = new Float32Array(count * 3);
      const normals = new Float32Array(count * 3);
      const uvs = new Float32Array(count * 2);
      let offset = 0;
      for (const geometry of bucket.geometries) {
        const attributes = geometry.attributes;
        positions.set(attributes.position.array, offset * 3);
        normals.set(attributes.normal.array, offset * 3);
        if (attributes.uv) uvs.set(attributes.uv.array, offset * 2);
        offset += attributes.position.count;
        geometry.dispose();
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
      geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
      geometry.computeBoundingSphere();
      const mesh = new THREE.Mesh(geometry, bucket.material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData.outline = bucket.outline;
      group.add(mesh);
    }
    return group;
  }

  return { group, add, box, cylinder, lathe, tube, finish };
}

// A round-headed arch, drawn in its wall's XY plane. Unlike a dark decal, a
// hole in an extruded wall remains an open passage from the reverse angle.
function archPath(THREE, x, bottom, width, height, PathType = THREE.Path) {
  const shape = new PathType();
  const radius = width / 2;
  const spring = bottom + height - radius;
  shape.moveTo(x - radius, bottom);
  shape.lineTo(x + radius, bottom);
  shape.lineTo(x + radius, spring);
  shape.absarc(x, spring, radius, 0, Math.PI, false);
  shape.lineTo(x - radius, bottom);
  return shape;
}

function extrudedArch(THREE, width, height, rim, depth) {
  const shape = archPath(THREE, 0, 0, width, height, THREE.Shape);
  shape.holes.push(archPath(THREE, 0, rim, width - rim * 2, height - rim * 2));
  return new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 16 });
}

function arcadeGeometry(THREE, width, height, depth, count, openingHeight) {
  const wall = new THREE.Shape();
  wall.moveTo(-width / 2, 0);
  wall.lineTo(width / 2, 0);
  wall.lineTo(width / 2, height);
  wall.lineTo(-width / 2, height);
  wall.closePath();
  const bay = width / count;
  for (let i = 0; i < count; i++) {
    wall.holes.push(archPath(THREE, -width / 2 + bay * (i + 0.5), 0.025, bay * 0.70, openingHeight));
  }
  return new THREE.ExtrudeGeometry(wall, { depth, bevelEnabled: false, curveSegments: 16 });
}

export function buildCastle(THREE, materials) {
  const work = createWorkshop(THREE, materials);
  const { add, box, cylinder, lathe, tube } = work;
  work.group.name = 'Sky castle — limestone terraces and copper roofs';

  // The ellipsoidal terraces belong to the architecture. The scene supplies
  // the natural hill underneath, hiding their back edges among grass and rock.
  add(new THREE.CylinderGeometry(1.68, 1.75, 0.15, 64), 'stone', [0, 0.075, 0], [0, 0, 0], [1, 1, 0.74], true);
  add(new THREE.CylinderGeometry(1.46, 1.52, 0.22, 64), 'stoneLight', [0, 0.24, -0.09], [0, 0, 0], [1, 1, 0.76], true);
  add(new THREE.CylinderGeometry(1.28, 1.35, 0.12, 64), 'stone', [0, 0.41, -0.16], [0, 0, 0], [1, 1, 0.75]);
  for (let i = 0; i < 7; i++) {
    box('stoneLight', 0.12, 0.026 + i * 0.035, 1.20 - i * 0.082, 0.58, 0.052, 0.17);
  }

  function window(x, y, z, yaw, width = 0.16, height = 0.44) {
    const transform = new THREE.Matrix4().makeRotationY(yaw);
    const offset = (localX, localZ) => new THREE.Vector3(localX, 0, localZ).applyMatrix4(transform).add(new THREE.Vector3(x, y, z));
    const recess = archPath(THREE, 0, 0, width, height, THREE.Shape);
    add(new THREE.ShapeGeometry(recess, 14), 'dark', [x, y, z], [0, yaw, 0]);
    const rim = offset(0, 0.002);
    add(extrudedArch(THREE, width + 0.075, height + 0.053, 0.038, 0.023), 'stoneLight', [rim.x, y - 0.025, rim.z], [0, yaw, 0]);
    const mullion = offset(0, 0.026);
    box('stone', mullion.x, y + height * 0.40, mullion.z, 0.018, height * 0.72, 0.024, [0, yaw, 0]);
    const sill = offset(0, 0.025);
    box('stoneLight', sill.x, y - 0.031, sill.z, width + 0.10, 0.043, 0.10, [0, yaw, 0]);
  }

  function finial(x, y, z, height = 0.36) {
    cylinder('gold', x, y + height * 0.30, z, 0.012, 0.022, height * 0.6, false, 12);
    add(new THREE.SphereGeometry(0.048, 12, 10), 'gold', [x, y + height * 0.47, z]);
    add(new THREE.ConeGeometry(0.041, height * 0.42, 12), 'gold', [x, y + height * 0.83, z]);
  }

  function tower({ x, z, radius, height, base = 0.43, roof = 'dome', roofHeight = 0.70, windows = 6 }) {
    const top = base + height;
    // Entasis and several ledges make these feel like built masonry towers,
    // instead of uniform cylinders stacked under primitive cones.
    lathe('stone', x, base, z, [[0, 0], [radius * 1.10, 0], [radius * 1.10, 0.13], [radius, 0.19], [radius * 0.97, height * 0.48], [radius * 0.94, height - 0.15], [radius, height - 0.12], [radius, height], [0, height]]);
    for (const level of [0.17, height * 0.47, height - 0.17, height + 0.015]) {
      cylinder('stoneLight', x, base + level, z, radius * 1.07, radius * 1.09, 0.05);
    }
    cylinder('stoneLight', x, top + 0.055, z, radius * 1.15, radius * 1.05, 0.08);
    cylinder('gold', x, top + 0.105, z, radius * 1.16, radius * 1.16, 0.023);
    for (let level = 0; level < 2; level++) {
      for (let i = 0; i < windows; i++) {
        const angle = i / windows * Math.PI * 2 + (level ? Math.PI / windows : 0);
        const r = radius * (level ? 0.955 : 0.99);
        window(x + Math.sin(angle) * r, base + height * (level ? 0.68 : 0.24), z + Math.cos(angle) * r, angle, radius * 0.37, Math.min(0.54, height * 0.22));
      }
    }
    const roofBase = top + 0.12;
    const r = radius * 1.19;
    if (roof === 'dome') {
      lathe('roof', x, roofBase, z, [[0, 0], [r, 0], [r * 1.035, roofHeight * 0.09], [r * 1.015, roofHeight * 0.23], [r * 0.93, roofHeight * 0.43], [r * 0.75, roofHeight * 0.65], [r * 0.48, roofHeight * 0.84], [r * 0.15, roofHeight * 0.98], [0, roofHeight]]);
      // Fine copper ribs follow the dome profile without making it faceted.
      for (let i = 0; i < 8; i++) {
        const angle = i * Math.PI / 4;
        tube('gold', [[x + Math.sin(angle) * r, roofBase + 0.015, z + Math.cos(angle) * r], [x + Math.sin(angle) * r * 1.018, roofBase + roofHeight * 0.20, z + Math.cos(angle) * r * 1.018], [x + Math.sin(angle) * r * 0.78, roofBase + roofHeight * 0.63, z + Math.cos(angle) * r * 0.78], [x + Math.sin(angle) * r * 0.40, roofBase + roofHeight * 0.89, z + Math.cos(angle) * r * 0.40], [x, roofBase + roofHeight, z]], 0.008, 20);
      }
    } else {
      lathe('roof', x, roofBase, z, [[0, 0], [r * 1.08, 0], [r * 1.11, 0.055], [r * 0.90, roofHeight * 0.13], [r * 0.73, roofHeight * 0.31], [r * 0.49, roofHeight * 0.56], [r * 0.24, roofHeight * 0.79], [r * 0.045, roofHeight], [0, roofHeight]]);
      cylinder('gold', x, roofBase + 0.03, z, r * 1.10, r * 1.10, 0.018);
    }
    finial(x, roofBase + roofHeight, z, radius < 0.3 ? 0.25 : 0.34);
    // Slender buttresses run into the lower stonework. Their sloped cap is a
    // three-point prism rather than a series of blocky crenellations.
    for (let i = 0; i < 4; i++) {
      const a = i * Math.PI / 2 + Math.PI / 4;
      const r = radius * 1.04;
      box('stoneLight', x + Math.sin(a) * r, base + height * 0.12, z + Math.cos(a) * r, radius * 0.15, height * 0.24, radius * 0.18, [0, a, 0]);
    }
  }

  // Tall forms sit behind the terrace. Their off-center distribution leaves
  // readable gaps of sky and distinct roof lines through an entire orbit.
  tower({ x: -0.43, z: -0.49, radius: 0.42, height: 2.91, roofHeight: 0.77 });
  tower({ x: 0.48, z: -0.71, radius: 0.275, height: 3.14, roof: 'spire', roofHeight: 0.73, windows: 5 });
  tower({ x: 1.05, z: 0.02, radius: 0.32, height: 2.06, roofHeight: 0.58, windows: 5 });
  tower({ x: -1.11, z: 0.21, radius: 0.27, height: 1.74, roof: 'spire', roofHeight: 0.64, windows: 5 });
  tower({ x: 0.12, z: 0.62, radius: 0.245, height: 1.49, roofHeight: 0.45, windows: 5 });

  function roofedHall(x, y, z, width, height, depth) {
    box('stone', x, y + height / 2, z, width, height, depth, [0, 0, 0], true);
    for (const level of [0.06, height * 0.51, height - 0.035]) {
      box('stoneLight', x, y + level, z, width + 0.045, 0.046, depth + 0.055);
    }
    const roofWidth = width + 0.12, roofDepth = depth + 0.15, rise = depth * 0.55;
    const shape = new THREE.Shape();
    shape.moveTo(-roofDepth / 2, 0);
    shape.lineTo(roofDepth / 2, 0);
    shape.lineTo(0, rise);
    shape.closePath();
    add(new THREE.ExtrudeGeometry(shape, { depth: roofWidth, bevelEnabled: false }), 'roof', [x - roofWidth / 2, y + height, z], [0, Math.PI / 2, 0], [1, 1, 1], true);
    tube('gold', [[x - roofWidth / 2, y + height + rise + 0.005, z], [x + roofWidth / 2, y + height + rise + 0.005, z]], 0.018, 4);
    // Raised tile courses catch the toon key light, giving each roof relief.
    for (const side of [-1, 1]) {
      for (let i = 1; i <= 4; i++) {
        const t = i / 5;
        tube('roof', [[x - roofWidth / 2, y + height + rise * (1 - t) + 0.01, z + side * roofDepth / 2 * t], [x + roofWidth / 2, y + height + rise * (1 - t) + 0.01, z + side * roofDepth / 2 * t]], 0.016, 4);
      }
    }
    const count = Math.max(2, Math.floor(width / 0.37));
    for (let i = 0; i < count; i++) {
      const wx = x - width / 2 + (i + 0.5) * width / count;
      window(wx, y + 0.16, z + depth / 2 + 0.006, 0, 0.14, height * 0.58);
      window(wx, y + 0.16, z - depth / 2 - 0.006, Math.PI, 0.14, height * 0.58);
    }
  }

  // Low wings give the ensemble a broad, inhabited base. Roofs step down to
  // the loggia instead of every form being another narrow vertical tower.
  roofedHall(-0.10, 1.37, -0.02, 1.91, 0.66, 0.70);
  roofedHall(-0.78, 0.91, -0.68, 1.03, 0.53, 0.63);

  // Open loggias, visible from front and side. Each bay has real depth,
  // continuous curved soffits, and a thin rim around its opening.
  const frontY = 0.35;
  add(arcadeGeometry(THREE, 2.22, 1.01, 0.15, 5, 0.80), 'stone', [-0.02, frontY, 0.73], [0, 0, 0], [1, 1, 1], true);
  box('stoneLight', -0.02, frontY + 1.02, 0.76, 2.36, 0.095, 0.25);
  box('stone', -0.02, frontY + 1.12, 0.57, 2.27, 0.13, 0.62);
  for (let i = 0; i < 5; i++) {
    const x = -1.11 + 2.22 / 5 * (i + 0.5) - 0.02;
    add(extrudedArch(THREE, 2.22 / 5 * 0.70 + 0.047, 0.85, 0.028, 0.028), 'stoneLight', [x, frontY + 0.015, 0.883]);
  }
  for (const side of [-1, 1]) {
    add(arcadeGeometry(THREE, 1.13, 0.89, 0.13, 3, 0.70), 'stone', [side * 1.02, 0.37, -0.07], [0, side * Math.PI / 2, 0], [1, 1, 1], true);
    box('stoneLight', side * 1.02, 1.30, -0.07, 0.21, 0.095, 1.26);
    box('stone', side * 0.92, 1.40, -0.07, 0.38, 0.13, 1.19);
  }

  // Small roofed bridges bind the independent towers into one castle.
  box('stone', 0.02, 2.13, -0.43, 0.95, 0.43, 0.36, [0, 0, 0], true);
  box('stoneLight', 0.02, 1.90, -0.43, 1.03, 0.07, 0.41);
  box('stoneLight', 0.02, 2.37, -0.43, 1.04, 0.08, 0.43);
  for (const z of [-0.626, -0.234]) {
    for (const x of [-0.13, 0.12, 0.37]) window(x, 1.96, z, z < -0.4 ? Math.PI : 0, 0.11, 0.28);
  }

  // Restrained parapets: narrow balusters and rounded coping, avoiding an
  // oversized toy battlement pattern at the silhouette.
  for (let i = 0; i < 17; i++) {
    const angle = Math.PI * 0.08 + i / 16 * Math.PI * 0.84;
    const x = Math.cos(angle) * 1.52;
    const z = Math.sin(angle) * 1.13 - 0.10;
    if (Math.abs(x - 0.12) < 0.27 && z > 0.90) continue;
    cylinder('stoneLight', x, 0.42, z, 0.034, 0.046, 0.33, false, 10);
    add(new THREE.SphereGeometry(0.052, 10, 8), 'stoneLight', [x, 0.59, z]);
  }
  for (const side of [-1, 1]) {
    const points = [];
    const start = side < 0 ? Math.PI * 0.55 : Math.PI * 0.08;
    const end = side < 0 ? Math.PI * 0.92 : Math.PI * 0.43;
    for (let i = 0; i <= 20; i++) {
      const a = start + (end - start) * i / 20;
      points.push([Math.cos(a) * 1.52, 0.59, Math.sin(a) * 1.13 - 0.10]);
    }
    tube('stoneLight', points, 0.035, 24);
  }

  // A few climbing leaves soften the join between terrace and architecture.
  for (let i = 0; i < 15; i++) {
    const y = 0.49 + i * 0.066;
    const x = -1.10 + Math.sin(i * 0.9) * 0.06;
    add(new THREE.SphereGeometry(0.055, 10, 8), 'leaf', [x, y, 0.47 + Math.cos(i * 0.8) * 0.025], [0, i, 0], [1.3, 0.55, 0.85]);
  }

  const castle = work.finish();
  castle.userData.kind = 'castle';
  return castle;
}

export function buildTree(THREE, materials, { height = 1, seed = 1, kind = 'broadleaf' } = {}) {
  const work = createWorkshop(THREE, materials);
  const { add, lathe, tube } = work;
  let state = Math.max(1, Math.floor(seed) % 2147483647);
  const random = () => (state = state * 16807 % 2147483647) / 2147483647;
  const h = height;
  work.group.name = kind === 'cypress' ? 'Mediterranean cypress' : 'Wind-shaped broadleaf tree';

  tube('trunk', [[0, h * 0.015, 0], [-h * 0.028, h * 0.22, 0], [h * 0.01, h * 0.41, h * 0.012], [h * 0.05, h * 0.66, 0]], h * 0.029, 12);
  lathe('trunk', 0, 0, 0, [[0, 0], [h * 0.048, 0], [h * 0.034, h * 0.11], [0, h * 0.30]], false);
  if (kind === 'cypress') {
    const profile = [];
    for (let i = 0; i <= 24; i++) {
      const t = i / 24;
      const y = h * (0.18 + 0.82 * t);
      const radius = h * 0.153 * Math.pow(Math.sin(t * Math.PI), 0.77) * (1.20 - t * 0.48);
      profile.push(new THREE.Vector2(radius, y));
    }
    const geometry = new THREE.LatheGeometry(profile, 32);
    const position = geometry.attributes.position;
    for (let i = 0; i < position.count; i++) {
      const y = position.getY(i) / h;
      const a = Math.atan2(position.getZ(i), position.getX(i));
      const ripple = 1 + 0.12 * Math.sin(a * 5 + y * 21 + seed) + 0.065 * Math.cos(a * 9 - y * 33 + seed * 2);
      position.setXYZ(i, position.getX(i) * ripple + Math.sin(y * 3.9) * h * 0.040, position.getY(i), position.getZ(i) * ripple * 0.87);
    }
    geometry.computeVertexNormals();
    add(geometry, 'leaf', [0, 0, 0], [0, random() * Math.PI, 0], [1, 1, 1], true);
  } else {
    for (let i = 0; i < 5; i++) {
      const a = i / 5 * Math.PI * 2 + seed;
      tube('trunk', [[h * 0.01, h * 0.34, 0], [Math.cos(a) * h * 0.14, h * 0.50, Math.sin(a) * h * 0.13], [Math.cos(a) * h * 0.29 + h * 0.04, h * (0.61 + i * 0.025), Math.sin(a) * h * 0.24]], h * 0.014, 10);
    }
    // A continuous wind-shaped crown avoids the stacked-ball silhouette that
    // becomes especially obvious when lighting is quantized into toon bands.
    const geometry = new THREE.SphereGeometry(1, 48, 32);
    const position = geometry.attributes.position;
    for (let i = 0; i < position.count; i++) {
      const px = position.getX(i), py = position.getY(i), pz = position.getZ(i);
      const a = Math.atan2(pz, px);
      const radial = 1 + 0.085 * Math.sin(a * 3 + seed) * (1 - py * py) + 0.05 * Math.cos(a * 7 + py * 4 + seed);
      const lifted = py + 0.045 * Math.cos(a * 5 + seed) * (1 - py * py) + px * 0.09;
      position.setXYZ(i, px * radial + py * 0.14, lifted, pz * radial);
    }
    geometry.computeVertexNormals();
    add(geometry, 'leaf', [h * 0.045, h * 0.74, 0], [0, random() * Math.PI, 0], [h * 0.45, h * 0.26, h * 0.34], true);
  }
  const tree = work.finish();
  tree.userData.kind = 'tree';
  return tree;
}

export function buildPavilion(THREE, materials) {
  const work = createWorkshop(THREE, materials);
  const { add, cylinder, lathe, tube } = work;
  work.group.name = 'Open six-column domed pavilion';
  cylinder('stone', 0, 0.05, 0, 0.63, 0.66, 0.10, true, 48);
  cylinder('stoneLight', 0, 0.14, 0, 0.57, 0.59, 0.08, true, 48);
  for (let i = 0; i < 6; i++) {
    const a = i * Math.PI / 3;
    const x = Math.sin(a) * 0.44, z = Math.cos(a) * 0.44;
    lathe('stoneLight', x, 0.18, z, [[0, 0], [0.071, 0], [0.071, 0.045], [0.049, 0.08], [0.038, 0.45], [0.036, 0.92], [0.07, 0.965], [0.07, 1.01], [0, 1.01]], true);
    const next = a + Math.PI / 3;
    const arc = [];
    for (let j = 0; j <= 18; j++) {
      const t = j / 18;
      arc.push([Math.sin(a) * 0.44 * (1 - t) + Math.sin(next) * 0.44 * t, 0.88 + Math.sin(t * Math.PI) * 0.25, Math.cos(a) * 0.44 * (1 - t) + Math.cos(next) * 0.44 * t]);
    }
    tube('stoneLight', arc, 0.027, 18);
  }
  cylinder('stoneLight', 0, 1.21, 0, 0.55, 0.53, 0.12, true, 48);
  cylinder('gold', 0, 1.29, 0, 0.565, 0.565, 0.036);
  lathe('roof', 0, 1.31, 0, [[0, 0], [0.56, 0], [0.56, 0.07], [0.51, 0.21], [0.38, 0.39], [0.17, 0.53], [0, 0.57]], true);
  for (let i = 0; i < 6; i++) {
    const a = i * Math.PI / 3;
    tube('gold', [[Math.sin(a) * 0.56, 1.32, Math.cos(a) * 0.56], [Math.sin(a) * 0.53, 1.49, Math.cos(a) * 0.53], [Math.sin(a) * 0.36, 1.72, Math.cos(a) * 0.36], [0, 1.88, 0]], 0.008, 16);
  }
  cylinder('gold', 0, 1.955, 0, 0.008, 0.02, 0.15, false, 10);
  add(new THREE.SphereGeometry(0.036, 12, 8), 'gold', [0, 1.93, 0]);
  add(new THREE.ConeGeometry(0.027, 0.085, 12), 'gold', [0, 2.045, 0]);
  const pavilion = work.finish();
  pavilion.userData.kind = 'pavilion';
  return pavilion;
}
