/**
 * Small, grounded landscape stories for the shared 3D island.
 *
 * Geometry is merged by the supplied material rather than cloned or individually
 * drawn. The bridge has a real open arch; shoreline stones sample the actual
 * shore, and ivy clings to raycast cliff points. The only animated pieces are
 * shallow lily leaves, whose transforms repeat exactly at phase 0 and phase 1.
 */
export function buildLandscapeDetails(THREE, materials, terrain) {
  const group = new THREE.Group();
  group.name = 'handcrafted-landscape-details';
  const bags = new Map();
  const temporaryGeometry = new Set();
  const transform = new THREE.Matrix4();
  const normalMatrix = new THREE.Matrix3();
  const vertex = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const position = new THREE.Vector3();
  const scale = new THREE.Vector3();
  let seed = 83147;
  const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const range = (a, b) => a + (b - a) * random();
  const dryGround = (x, z) => {
    const lakeDistance = terrain.lakeDistance ? terrain.lakeDistance(x, z) : Math.hypot((x - 1.05) / 2.35, (z - .15) / 1.65);
    const inWaterFootprint = lakeDistance < 1.24 || (z > 1 && Math.abs(x - terrain.riverX(z)) < .60);
    return !inWaterFootprint || terrain.height(x, z) > terrain.waterLevel + .025;
  };
  const geo = value => { temporaryGeometry.add(value); return value; };
  const block = geo(new THREE.BoxGeometry(1, 1, 1));
  const pebble = geo(new THREE.IcosahedronGeometry(1, 1));
  const petal = geo(new THREE.SphereGeometry(1, 8, 4));
  const flowerCenter = geo(new THREE.IcosahedronGeometry(1, 0));
  const stem = geo(new THREE.CylinderGeometry(1, 1, 1, 5, 1));
  const up = new THREE.Vector3(0, 1, 0);

  function stamp(shape, materialKey, p, s = [1, 1, 1], rotation = [0, 0, 0]) {
    position.set(...p); scale.set(...s);
    quaternion.setFromEuler(new THREE.Euler(...rotation));
    transform.compose(position, quaternion, scale);
    append(shape, materialKey, transform);
  }
  function append(shape, materialKey, matrix) {
    if (!bags.has(materialKey)) bags.set(materialKey, { positions:[], normals:[], uvs:[], indices:[] });
    const bag = bags.get(materialKey);
    const p = shape.getAttribute('position');
    if (!shape.getAttribute('normal')) shape.computeVertexNormals();
    const n = shape.getAttribute('normal'), uv = shape.getAttribute('uv');
    const offset = bag.positions.length / 3;
    normalMatrix.getNormalMatrix(matrix);
    for (let i = 0; i < p.count; i++) {
      vertex.fromBufferAttribute(p, i).applyMatrix4(matrix);
      normal.fromBufferAttribute(n, i).applyNormalMatrix(normalMatrix);
      bag.positions.push(vertex.x, vertex.y, vertex.z);
      bag.normals.push(normal.x, normal.y, normal.z);
      bag.uvs.push(uv ? uv.getX(i) : 0, uv ? uv.getY(i) : 0);
    }
    if (shape.index) {
      for (let i = 0; i < shape.index.count; i++) bag.indices.push(offset + shape.index.getX(i));
    } else {
      for (let i = 0; i < p.count; i++) bag.indices.push(offset + i);
    }
  }
  function twig(a, b, radius = .009, materialKey = 'leaf') {
    const start = new THREE.Vector3(...a), end = new THREE.Vector3(...b);
    const direction = end.clone().sub(start);
    if (direction.lengthSq() < 1e-8) return;
    quaternion.setFromUnitVectors(up, direction.clone().normalize());
    transform.compose(start.add(end).multiplyScalar(.5), quaternion, scale.set(radius, direction.length(), radius));
    append(stem, materialKey, transform);
  }

  // A folded, curved leaf with an actual central ridge and pointed silhouette.
  const leaf = (() => {
    const p = [], uv = [], ix = [], segments = 6;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments, width = Math.sin(t * Math.PI) * .25;
      for (const side of [-1, 0, 1]) {
        p.push(t, Math.sin(t * Math.PI) * (.10 + (side === 0 ? .06 : 0)), side * width);
        uv.push(t, (side + 1) / 2);
      }
      if (i < segments) for (let j = 0; j < 2; j++) {
        const a = i * 3 + j;
        ix.push(a, a + 3, a + 1, a + 1, a + 3, a + 4);
      }
    }
    const shape = new THREE.BufferGeometry();
    shape.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
    shape.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    shape.setIndex(ix); shape.computeVertexNormals();
    return geo(shape);
  })();

  // A single small bridge crosses X, while the river continues unobstructed in Z.
  // Each wedge is a separate voussoir in the merged masonry, with tiny mortar gaps.
  const bridgeZ = 2.65, bridgeX = terrain.riverX(bridgeZ);
  const bankLeft = terrain.height(bridgeX - .96, bridgeZ);
  const bankRight = terrain.height(bridgeX + .96, bridgeZ);
  const springY = Math.max(terrain.waterLevel + .02, Math.min(bankLeft, bankRight) - .11);
  const innerRadius = .73, outerRadius = .93, archRise = .43;
  function archWedge(a, b, innerX, outerX, innerY, outerY, depth) {
    const shape = new THREE.Shape();
    const point = (angle, rx, ry) => [Math.sin(angle) * rx, springY + Math.cos(angle) * ry];
    shape.moveTo(...point(a, innerX, innerY));
    shape.lineTo(...point(b, innerX, innerY));
    shape.lineTo(...point(b, outerX, outerY));
    shape.lineTo(...point(a, outerX, outerY)); shape.closePath();
    return geo(new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled:false, curveSegments:1, steps:1 }).translate(0, 0, -depth / 2));
  }
  for (let i = 0; i < 13; i++) {
    const a = -Math.PI / 2 + i / 13 * Math.PI + .008;
    const b = -Math.PI / 2 + (i + 1) / 13 * Math.PI - .008;
    stamp(archWedge(a, b, innerRadius, outerRadius, archRise, archRise + .16, .61),
      i % 4 === 1 ? 'stoneLight' : 'stone', [bridgeX, 0, bridgeZ]);
    // Low side parapets leave the arched walking surface visible from above.
    for (const side of [-1, 1]) {
      stamp(archWedge(a, b, outerRadius - .018, outerRadius + .035, archRise + .17, archRise + .31, .067),
        'stoneLight', [bridgeX, 0, bridgeZ + side * .28]);
    }
  }
  for (const side of [-1, 1]) {
    for (let step = 0; step < 3; step++) {
      const x = bridgeX + side * (.89 + step * .18), z = bridgeZ;
      const ground = terrain.height(x, z), top = Math.max(ground + .07, springY + .10 - step * .025);
      stamp(block, 'stone', [x, (ground + top) / 2 - .02, z], [.20, top - ground + .08, .66], [0, side * .015, 0]);
    }
    for (const edge of [-1, 1]) {
      const x = bridgeX + side * .80, z = bridgeZ + edge * .255;
      const ground = terrain.height(x, z);
      stamp(block, 'stoneLight', [x, ground + .105, z], [.18, .25, .115]);
    }
  }

  // A quiet, interrupted route connects the west bridge steps to the existing
  // castle trail. Each slab follows the height field instead of hovering above it.
  for (let i = 0; i < 5; i++) {
    const t = i / 4;
    const x = (bridgeX - 1.51) * (1 - t) - .55 * t;
    const z = bridgeZ + .13 * t + Math.sin(t * Math.PI) * .055;
    stamp(pebble, 'stone', [x, terrain.height(x, z) + .013, z],
      [.118, .031, .096], [0, -.13 + i * .085, 0]);
  }

  // Find the actual water/ground transition rather than arranging a perfect
  // decorative ellipse. Broken groups leave breathing room around the lake.
  let shoreStoneCount = 0;
  for (let i = 0; i < 40; i++) {
    const angle = i / 40 * Math.PI * 2 + range(-.07, .07);
    // Exposed stone gathers in irregular groups, with long untouched banks.
    if (Math.sin(angle * 3 + .5) + Math.sin(angle * 5 + .2) < -.12 || i % 9 === 0) continue;
    let r = .94, x = 0, z = 0;
    while (r < 1.37) {
      x = 1.05 + Math.cos(angle) * 2.35 * r;
      z = .15 + Math.sin(angle) * 1.65 * r;
      if (terrain.height(x, z) > terrain.waterLevel + .017) break;
      r += .009;
    }
    if (!terrain.contains(x, z, .24) || (z > 1.25 && Math.abs(x - terrain.riverX(z)) < .78)) continue;
    const size = range(.075, .145);
    stamp(pebble, i % 3 ? 'rock' : 'stone', [x, terrain.height(x, z) + .015, z],
      [size * range(1.2, 1.8), size * .54, size], [range(-.2, .2), range(0, Math.PI), range(-.15, .15)]);
    shoreStoneCount++;
    if (i % 3 === 0) {
      const xx = x + Math.cos(angle + .8) * size * 1.8, zz = z + Math.sin(angle + .8) * size;
      stamp(pebble, 'stone', [xx, terrain.height(xx, zz) + .012, zz], [size * .64, size * .32, size * .53], [0, angle, 0]);
      shoreStoneCount++;
    }
  }

  // Each blossom has petals and a seed centre rather than a single colored dot.
  function blossom(x, y, z, size, phase = 0, materialKey = 'flower') {
    for (let p = 0; p < 5; p++) {
      const angle = phase + p / 5 * Math.PI * 2;
      stamp(petal, materialKey, [x + Math.cos(angle) * size * .43, y, z + Math.sin(angle) * size * .43],
        [size * .55, size * .13, size * .30], [0, -angle, .11]);
    }
    stamp(flowerCenter, 'gold', [x, y + size * .11, z], [size * .23, size * .16, size * .23]);
  }
  let gardenCount = 0;
  const gardenCenters = [[-4.55, .25], [-2.00, 2.15], [4.55, 2.20]];
  for (const [gx, gz] of gardenCenters) {
    if (!terrain.contains(gx, gz, .8) || !dryGround(gx, gz)) continue;
    gardenCount++;
    for (let b = 0; b < 7; b++) {
      const angle = b / 7 * Math.PI * 2 + range(-.25, .25), radius = range(.13, .43);
      const x = gx + Math.cos(angle) * radius, z = gz + Math.sin(angle) * radius;
      const y = terrain.height(x, z), height = range(.18, .34);
      twig([x, y - .02, z], [x + .018, y + height, z], .010);
      for (let l = 0; l < 5; l++) {
        const leafAngle = angle + l * 2.399, length = range(.18, .32);
        stamp(leaf, 'leaf', [x, y + .045 + l / 5 * height, z], [length, length, length], [0, leafAngle, range(.12, .5)]);
      }
    }
    for (let f = 0; f < 12; f++) {
      const angle = range(0, Math.PI * 2), radius = range(.16, .62);
      const x = gx + Math.cos(angle) * radius, z = gz + Math.sin(angle) * radius;
      if (!terrain.contains(x, z, .15) || !dryGround(x, z)) continue;
      const y = terrain.height(x, z), h = range(.10, .23), size = range(.057, .092);
      twig([x, y - .016, z], [x, y + h, z], .0045);
      stamp(leaf, 'leaf', [x, y + h * .35, z], [.11, .11, .11], [0, angle, .36]);
      blossom(x, y + h, z, size, angle, f % 4 === 0 ? 'stoneLight' : 'flower');
    }
  }

  // Low, slightly broken retaining walls flank the climb to the castle. The
  // middle stays open where the existing path approaches the entrance.
  const castle = terrain.castleAnchor;
  for (const [start, end] of [[-.25, .77], [2.13, 2.92]]) {
    const blocks = 8;
    for (let i = 0; i < blocks; i++) {
      const angle = start + (end - start) * (i + .5) / blocks;
      const x = castle.x + Math.cos(angle) * 1.74, z = castle.z + Math.sin(angle) * 1.43;
      const ground = terrain.height(x, z), length = 1.58 * (end - start) / blocks - .012;
      for (let row = 0; row < (i === 0 || i === blocks - 1 ? 1 : 2); row++) {
        stamp(block, row ? 'stoneLight' : 'stone', [x, ground + .065 + row * .12, z],
          [length, .12, .14], [0, -angle + Math.PI / 2, 0]);
      }
    }
  }

  // Sparse trailing ivy follows the irregular cliff rather than floating on an
  // assumed cylinder. Leaves sit just outside the real rock surface.
  let ivyLeafCount = 0;
  const cliff = terrain.group.getObjectByName('continuous-eroded-cliff');
  if (cliff) {
    terrain.group.updateMatrixWorld(true);
    const ray = new THREE.Raycaster(), surfaceNormal = new THREE.Vector3();
    for (const angle of [.30, .61, 2.00, 2.53, 3.67, 5.55]) {
      const dx = Math.cos(angle), dz = Math.sin(angle) * .76;
      let radius = 4;
      while (terrain.contains(dx * radius, dz * radius)) radius += .018;
      const rx = dx * (radius - .025), rz = dz * (radius - .025);
      const rimHeight = terrain.height(rx, rz);
      let previous = null;
      for (let i = 0; i < 9; i++) {
        const y = rimHeight - .10 - i * .135;
        const origin = new THREE.Vector3(dx * (radius + 2), y, dz * (radius + 2));
        ray.set(origin, new THREE.Vector3(-dx, 0, -dz).normalize());
        const hit = ray.intersectObject(cliff, false)[0];
        if (!hit) { previous = null; continue; }
        surfaceNormal.copy(hit.face.normal).transformDirection(cliff.matrixWorld);
        const point = hit.point.clone().addScaledVector(surfaceNormal, .033);
        if (previous) twig(previous.toArray(), point.toArray(), .008, 'trunk');
        previous = point;
        for (const side of [-1, 1]) {
          const length = range(.14, .22);
          stamp(leaf, 'leaf', point.toArray(), [length, length, length], [0, -angle + side * .85, -.35 - random() * .2]);
          ivyLeafCount++;
        }
      }
    }
  }

  // Assemble static detail into one draw per shared material, retaining custom
  // onBeforeCompile shaders and style switching on the original instances.
  let triangleCount = 0;
  for (const [materialKey, bag] of bags) {
    const shape = new THREE.BufferGeometry();
    shape.setAttribute('position', new THREE.Float32BufferAttribute(bag.positions, 3));
    shape.setAttribute('normal', new THREE.Float32BufferAttribute(bag.normals, 3));
    shape.setAttribute('uv', new THREE.Float32BufferAttribute(bag.uvs, 2));
    shape.setIndex(bag.indices); shape.computeBoundingSphere();
    const mesh = new THREE.Mesh(shape, materials[materialKey]);
    mesh.name = `landscape-details-${materialKey}`;
    mesh.castShadow = mesh.receiveShadow = true;
    group.add(mesh); triangleCount += bag.indices.length / 3;
  }
  for (const shape of temporaryGeometry) shape.dispose();

  // Shallow extruded leaves float above the ripples; each turns about its own
  // centre. No animated positions accumulate, so rerenders remain deterministic.
  const padShape = new THREE.Shape();
  padShape.moveTo(0, 0);
  padShape.lineTo(Math.cos(.16), Math.sin(.16));
  padShape.absarc(0, 0, 1, .16, Math.PI * 2 - .16, false);
  padShape.lineTo(0, 0);
  const padGeometry = new THREE.ExtrudeGeometry(padShape, { depth:.055, bevelEnabled:false, curveSegments:12, steps:1 });
  padGeometry.rotateX(-Math.PI / 2);
  const pads = [];
  for (const angle of [2.56, 2.72, 2.84, 3.87, 4.02, 5.38, 5.57, 5.72]) {
    const radius = range(.74, .87);
    const x = 1.05 + Math.cos(angle) * 2.35 * radius;
    const z = .15 + Math.sin(angle) * 1.65 * radius;
    if (terrain.height(x, z) >= terrain.waterLevel - .05) continue;
    pads.push({ x, z, size:range(.105, .17), yaw:range(0, Math.PI * 2) });
  }
  const lilies = new THREE.InstancedMesh(padGeometry, materials.leaf, pads.length);
  lilies.name = 'slowly-drifting-lily-leaves'; lilies.castShadow = lilies.receiveShadow = true;
  lilies.renderOrder = 4; group.add(lilies);
  triangleCount += (padGeometry.index ? padGeometry.index.count : padGeometry.getAttribute('position').count) / 3 * pads.length;
  function animate(phase) {
    const cycle = ((phase % 1) + 1) % 1, time = cycle * Math.PI * 2;
    pads.forEach((pad, i) => {
      position.set(pad.x, terrain.waterLevel + .031 + Math.sin(time + i) * .003, pad.z);
      quaternion.setFromAxisAngle(up, pad.yaw + Math.sin(time + i * .7) * .10);
      transform.compose(position, quaternion, scale.set(pad.size, pad.size, pad.size));
      lilies.setMatrixAt(i, transform);
    });
    lilies.instanceMatrix.needsUpdate = true;
  }
  animate(0);
  const stats = { drawCalls:group.children.length, triangles:triangleCount, bridge:true,
    shoreStones:shoreStoneCount, gardens:gardenCount, ivyLeaves:ivyLeafCount, lilyLeaves:pads.length };
  group.userData.landscapeDetails = stats;
  return { group, animate, stats };
}
