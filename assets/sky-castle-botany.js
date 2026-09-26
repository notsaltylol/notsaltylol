/**
 * Fine botanical geometry for the floating island.
 *
 * Grass uses folded, tapered ribbons with four curved sections; ferns have
 * separate paired leaflets and curved rachises. Clover has three lobed leaves.
 * Nothing is a camera-facing card. Local plant meshes are instanced in irregular
 * patches, with shared live materials and protected paths, water and foundations.
 */
export function buildBotany(THREE, materials, terrain) {
  const group = new THREE.Group();
  group.name = 'fine-island-botany';
  const leafMaterial = materials.leafDetail || materials.leaf;
  let seed = 572691;
  const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const range = (a, b) => a + random() * (b - a);
  const up = new THREE.Vector3(0, 1, 0);
  const transform = new THREE.Matrix4(), quaternion = new THREE.Quaternion();
  const position = new THREE.Vector3(), scale = new THREE.Vector3();
  const normalMatrix = new THREE.Matrix3(), vertex = new THREE.Vector3(), normal = new THREE.Vector3();
  const localGeometry = new Set();
  const hold = g => { localGeometry.add(g); return g; };
  const point = new THREE.Vector3();

  // The same spline used by buildTerrain, sampled densely enough to protect the
  // complete winding path, including its tight turn below the castle.
  const trail = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-.8, 0, 2.8), new THREE.Vector3(-2.5, 0, 2.1),
    new THREE.Vector3(-3.8, 0, .9), new THREE.Vector3(-2.7, 0, -.25),
    new THREE.Vector3(-3.1, 0, -1.7),
  ]);
  const trailPoints = trail.getPoints(140);
  const gardens = [[-4.55, .25], [-2, 2.15], [4.55, 2.2]];
  function dryLand(x, z) {
    const lake = terrain.lakeDistance ? terrain.lakeDistance(x, z) : Math.hypot((x - 1.05) / 2.35, (z - .15) / 1.65);
    const wetFootprint = lake < 1.25 || (z > 1 && Math.abs(x - terrain.riverX(z)) < .63);
    return !wetFootprint || terrain.height(x, z) > terrain.waterLevel + .055;
  }
  function allowed(x, z, clearance = .15, protectGardens = true) {
    if (!terrain.contains(x, z, .24 + clearance) || !dryLand(x, z)) return false;
    if (Math.hypot((x - terrain.castleAnchor.x) / 1.52, (z - terrain.castleAnchor.z) / 1.25) < 1.03) return false;
    if (Math.hypot(x - 4.1, z + 2.6) < .57) return false;
    if (z > 2.28 && z < 3.03 && x > -.78 && x < 3.5) return false;
    if (trailPoints.some(p => Math.hypot(x - p.x, z - p.z) < .19 + clearance)) return false;
    if (protectGardens && gardens.some(p => Math.hypot(x - p[0], z - p[1]) < .57)) return false;
    return true;
  }

  function bucket() { return { positions:[], normals:[], uvs:[], indices:[] }; }
  function mergeInto(bag, shape, p = [0, 0, 0], s = [1, 1, 1], rotation = [0, 0, 0]) {
    position.set(...p); scale.set(...s); quaternion.setFromEuler(new THREE.Euler(...rotation));
    transform.compose(position, quaternion, scale); normalMatrix.getNormalMatrix(transform);
    const pos = shape.getAttribute('position');
    if (!shape.getAttribute('normal')) shape.computeVertexNormals();
    const nor = shape.getAttribute('normal'), uv = shape.getAttribute('uv');
    const offset = bag.positions.length / 3;
    for (let i = 0; i < pos.count; i++) {
      vertex.fromBufferAttribute(pos, i).applyMatrix4(transform);
      normal.fromBufferAttribute(nor, i).applyNormalMatrix(normalMatrix);
      bag.positions.push(vertex.x, vertex.y, vertex.z);
      bag.normals.push(normal.x, normal.y, normal.z);
      bag.uvs.push(uv ? uv.getX(i) : .5, uv ? uv.getY(i) : .5);
    }
    if (shape.index) for (let i = 0; i < shape.index.count; i++) bag.indices.push(offset + shape.index.getX(i));
    else for (let i = 0; i < pos.count; i++) bag.indices.push(offset + i);
  }
  function finish(bag) {
    const shape = new THREE.BufferGeometry();
    shape.setAttribute('position', new THREE.Float32BufferAttribute(bag.positions, 3));
    shape.setAttribute('normal', new THREE.Float32BufferAttribute(bag.normals, 3));
    shape.setAttribute('uv', new THREE.Float32BufferAttribute(bag.uvs, 2));
    shape.setIndex(bag.indices); shape.computeBoundingSphere(); return shape;
  }

  // Shared botanical materials render both sides of these genuinely curved
  // surfaces. u runs root→tip, v runs edge→midrib→edge across each blade.
  function ribbon({ height = .28, width = .026, bend = .14, yaw = 0, segments = 4, horizontal = false }) {
    const p = [], uv = [], ix = [], row = 3, count = (segments + 1) * row;
    for (let face = 0; face < 1; face++) {
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const taper = Math.pow(1 - t, .66) * (.65 + .35 * Math.sin(t * Math.PI));
        const w = width * taper;
        for (const side of [-1, 0, 1]) {
          const ridge = side === 0 ? width * .22 * Math.sin(t * Math.PI) : 0;
          if (horizontal) {
            p.push(t * height, Math.sin(t * Math.PI) * bend + ridge, side * w);
          } else {
            const forward = bend * t * t + ridge;
            p.push(Math.sin(yaw) * forward + Math.cos(yaw) * side * w,
              height * t - .014, Math.cos(yaw) * forward - Math.sin(yaw) * side * w);
          }
          uv.push(t, (side + 1) / 2);
        }
      }
      for (let i = 0; i < segments; i++) for (let side = 0; side < 2; side++) {
        const a = face * count + i * row + side, b = a + row;
        if (face === 0) ix.push(a, b, a + 1, a + 1, b, b + 1);
        else ix.push(a, a + 1, b, a + 1, b + 1, b);
      }
    }
    const shape = new THREE.BufferGeometry();
    shape.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
    shape.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    shape.setIndex(ix); shape.computeVertexNormals(); return hold(shape);
  }
  function grassShape(blades, taller) {
    const bag = bucket();
    for (let i = 0; i < blades; i++) {
      const angle = i * 2.399 + .23;
      const shape = ribbon({ height:range(taller ? .18 : .13, taller ? .29 : .24),
        width:range(.02375, .03875), bend:range(.085, .18), yaw:angle });
      mergeInto(bag, shape, [Math.cos(angle) * .027, 0, Math.sin(angle) * .027]);
    }
    return finish(bag);
  }
  const tallGrassGeometry = grassShape(5, true);
  const fineGrassGeometry = grassShape(4, false);

  // Four arcing fronds, with the leaflets narrowing toward the tip. The short
  // leaflets use the same UV convention as the detailed leaf-vein material.
  const fernBag = bucket();
  const leaflet = ribbon({ height:1, width:.19, bend:.10, horizontal:true, segments:2 });
  for (let f = 0; f < 4; f++) {
    const angle = f * Math.PI / 2 + .18, length = .34 + (f % 2) * .065, rise = .235;
    const curvePoints = [];
    for (let i = 0; i <= 6; i++) {
      const t = i / 6;
      curvePoints.push(new THREE.Vector3(Math.cos(angle) * length * t, Math.sin(t * Math.PI * .87) * rise, Math.sin(angle) * length * t));
    }
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    mergeInto(fernBag, hold(new THREE.TubeGeometry(curve, 6, .006, 3, false)));
    for (let pair = 0; pair < 5; pair++) {
      const t = .19 + pair * .155;
      const centre = curve.getPoint(t);
      const size = (.115 - pair * .011) * Math.sin(t * Math.PI) ** .40;
      for (const side of [-1, 1]) {
        const yaw = -angle + side * 1.0;
        mergeInto(fernBag, leaflet, centre.toArray(), [size, size, size], [0, yaw, .12 + t * .17]);
      }
    }
  }
  const fernGeometry = finish(fernBag);

  // Three heart-shaped lobes around one low stem, with a slight central fold.
  const cloverBag = bucket();
  const heart = (() => {
    const outline = [[0, 0], [-.037, .03], [-.050, .067], [-.042, .099], [-.017, .113],
      [0, .099], [.017, .113], [.042, .099], [.050, .067], [.037, .03]];
    const p = [], uv = [], ix = [], count = outline.length + 1;
    for (let face = 0; face < 1; face++) {
      p.push(.055, .014, 0); uv.push(.055 / .113, .5);
      for (const [width, length] of outline) {
        p.push(length, .004 + Math.sin(length / .113 * Math.PI) * .006, width);
        uv.push(length / .113, width < 0 ? 0 : width > 0 ? 1 : .5);
      }
      for (let i = 0; i < outline.length; i++) {
        const a = face * count, b = a + 1 + i, c = a + 1 + (i + 1) % outline.length;
        if (face === 0) ix.push(a, b, c); else ix.push(a, c, b);
      }
    }
    const shape = new THREE.BufferGeometry();
    shape.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
    shape.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    shape.setIndex(ix); shape.computeVertexNormals(); return hold(shape);
  })();
  for (let i = 0; i < 3; i++) mergeInto(cloverBag, heart, [0, .047, 0], [1, 1, 1], [0, i * Math.PI * 2 / 3, .08]);
  mergeInto(cloverBag, hold(new THREE.CylinderGeometry(.004, .005, .061, 5, 1)), [0, .017, 0]);
  const cloverGeometry = finish(cloverBag);

  const reedBag = bucket();
  mergeInto(reedBag, hold(new THREE.CylinderGeometry(.0055, .008, .40, 5, 1)), [0, .19, 0]);
  for (let i = 0; i < 2; i++) {
    const blade = ribbon({ height:.22 - i * .045, width:.017, bend:.15, yaw:i * Math.PI + .4 });
    mergeInto(reedBag, blade, [0, .075 + i * .09, 0]);
  }
  const reedGeometry = finish(reedBag);
  const seedHeadGeometry = new THREE.CapsuleGeometry(.016, .080, 2, 5);

  // Clumps gather at the edges of deliberately empty clearings instead of being
  // evenly scattered. Both populations share the same protected landscape mask.
  const patchCenters = [
    [-5.15, 1.05, .64], [-4.95, -2.8, .60], [-4.1, 2.65, .70],
    [-2.05, 3.45, .62], [.15, 3.76, .57], [4.6, 3.0, .60],
    [5.3, .76, .73], [5.13, -1.18, .68], [3.0, -3.75, .74],
    [.65, -3.45, .78], [-1.25, -3.7, .62], [-5.4, -.40, .57],
  ];
  const occupied = [];
  function scatterGrass(count, smaller) {
    const roots = [];
    for (let attempt = 0; roots.length < count && attempt < count * 80; attempt++) {
      const patch = patchCenters[Math.floor(random() * patchCenters.length)];
      const angle = random() * Math.PI * 2, radius = Math.sqrt(random()) * patch[2];
      const x = patch[0] + Math.cos(angle) * radius, z = patch[1] + Math.sin(angle) * radius;
      if (!allowed(x, z, .15) || Math.sin(x * 3.1 + .7) * Math.cos(z * 2.3) < -.64) continue;
      if (occupied.some(p => Math.hypot(x - p.x, z - p.z) < .115)) continue;
      const root = { x, z, y:terrain.height(x, z), size:range(smaller ? .75 : .72, smaller ? 1.25 : 1.18), yaw:random() * Math.PI * 2, phase:random() * Math.PI * 2 };
      roots.push(root); occupied.push(root);
    }
    return roots;
  }
  const tallRoots = scatterGrass(170, false), fineRoots = scatterGrass(60, true);
  const fernRoots = [];
  const fernPatches = [[-4.75, 1.6], [4.7, -1.55], [-.9, -3.85], [3.9, 2.1]];
  for (let attempt = 0; fernRoots.length < 12 && attempt < 500; attempt++) {
    const patch = fernPatches[Math.floor(random() * fernPatches.length)];
    const angle = random() * Math.PI * 2, radius = range(.08, .48);
    const x = patch[0] + Math.cos(angle) * radius, z = patch[1] + Math.sin(angle) * radius;
    if (!allowed(x, z, .27) || fernRoots.some(p => Math.hypot(x - p.x, z - p.z) < .41)) continue;
    fernRoots.push({ x, z, y:terrain.height(x, z) + .007, size:range(.80, 1.12), yaw:range(0, Math.PI * 2), phase:0 });
  }
  const cloverRoots = [];
  const cloverPatches = [[-4.75, .85], [-1.15, 3.15], [4.85, .35], [.20, -3.15]];
  for (let attempt = 0; cloverRoots.length < 60 && attempt < 1800; attempt++) {
    const patch = cloverPatches[Math.floor(random() * cloverPatches.length)];
    const angle = random() * Math.PI * 2, radius = Math.sqrt(random()) * .48;
    const x = patch[0] + Math.cos(angle) * radius, z = patch[1] + Math.sin(angle) * radius;
    if (!allowed(x, z, .12) || cloverRoots.some(p => Math.hypot(x - p.x, z - p.z) < .115)) continue;
    cloverRoots.push({ x, z, y:terrain.height(x, z) + .003, size:range(.8, 1.25), yaw:range(0, Math.PI * 2), phase:0 });
  }
  const reedRoots = [];
  for (const baseAngle of [.10, 1.94, 2.73, 4.55]) {
    for (let i = 0; i < 3; i++) {
      const angle = baseAngle + (i - 1) * .045;
      let radius = 1.03, x = 0, z = 0;
      for (; radius < 1.40; radius += .012) {
        x = 1.05 + Math.cos(angle) * 2.35 * radius;
        z = .15 + Math.sin(angle) * 1.65 * radius;
        if (terrain.height(x, z) > terrain.waterLevel + .065) break;
      }
      if (!allowed(x, z, .07, false)) continue;
      reedRoots.push({ x, z, y:terrain.height(x, z), size:range(.78, 1.14), yaw:range(0, Math.PI * 2), phase:range(0, Math.PI * 2) });
    }
  }

  const animated = [];
  let triangles = 0;
  function instances(name, shape, material, roots, wind = 0, seedOffset = false) {
    const mesh = new THREE.InstancedMesh(shape, material, roots.length);
    mesh.name = name; mesh.receiveShadow = true; mesh.castShadow = !wind;
    mesh.userData.botanyRoots = roots.map(root => ({ x:root.x, y:root.y, z:root.z }));
    const record = { mesh, roots, wind, seedOffset, initialized:false };
    animated.push(record); group.add(mesh);
    const geometryTriangles = (shape.index ? shape.index.count : shape.getAttribute('position').count) / 3;
    triangles += geometryTriangles * roots.length;
    return mesh;
  }
  instances('curved-meadow-grass', tallGrassGeometry, materials.grass, tallRoots, 1);
  instances('short-folded-grass', fineGrassGeometry, materials.grass, fineRoots, .7);
  instances('paired-leaflet-ferns', fernGeometry, leafMaterial, fernRoots);
  instances('heart-leaf-clover', cloverGeometry, leafMaterial, cloverRoots);
  instances('shoreline-reed-leaves', reedGeometry, materials.leaf, reedRoots, .55);
  instances('reed-seed-heads', seedHeadGeometry, materials.wood, reedRoots, .55, true);
  for (const shape of localGeometry) shape.dispose();

  function animate(phase) {
    const cycle = ((phase % 1) + 1) % 1, time = cycle * Math.PI * 2;
    for (const record of animated) {
      const { mesh, roots, wind, seedOffset } = record;
      if (!wind && record.initialized) continue;
      roots.forEach((root, i) => {
        const sway = wind * (.034 * Math.sin(time * 3 + root.phase) + .017 * Math.sin(time * 5 + root.phase * .7));
        quaternion.setFromEuler(new THREE.Euler(sway * .48, root.yaw, sway));
        position.set(root.x, root.y, root.z);
        if (seedOffset) {
          // Transform the head from the same rooted stem, so the two cannot drift apart.
          point.set(0, .426 * root.size, 0).applyQuaternion(quaternion);
          position.add(point);
        }
        transform.compose(position, quaternion, scale.setScalar(root.size));
        mesh.setMatrixAt(i, transform);
      });
      mesh.instanceMatrix.needsUpdate = true;
      record.initialized = true;
    }
  }
  animate(0);
  for (const { mesh } of animated) mesh.computeBoundingSphere();
  const stats = { drawCalls:group.children.length, triangles, grassClumps:tallRoots.length + fineRoots.length,
    grassBlades:tallRoots.length * 5 + fineRoots.length * 4, ferns:fernRoots.length, cloverPlants:cloverRoots.length,
    reeds:reedRoots.length, trailProtected:true, bridgeProtected:true };
  group.userData.botany = stats;
  return { group, animate, stats };
}
