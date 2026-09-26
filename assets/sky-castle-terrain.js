import { fractalRock } from './sky-castle-geology.js';

/** Continuous rolling terrain, an excavated lake, and a connected river/fall. */
export function buildTerrain(THREE, materials) {
  const group = new THREE.Group();
  group.name = 'living-floating-island';
  const waterLevel = 1.04;
  const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const radius = a => 6.8 * (1 + .065 * Math.sin(a * 3 + .4) + .035 * Math.cos(a * 5 - .6) + .022 * Math.sin(a * 9));
  const contains = (x, z, margin = 0) => Math.hypot(x, z / .76) < radius(Math.atan2(z / .76, x)) - margin;
  const riverX = z => 1.9 + .27 * Math.sin((z - 1) * 1.7);
  const lakeDistance = (x, z) => Math.hypot((x - 1.05) / 2.35, (z - .15) / 1.65);
  function height(x, z) {
    let h = 1.14 + .13 * Math.sin(x * .9 + z * .45) + .10 * Math.cos(z * 1.6 - x * .28);
    h += 2.05 * Math.exp(-((x + 3.1) ** 2 / 3.3 + (z + 1.7) ** 2 / 3.6));
    h += .55 * Math.exp(-((x - 3.7) ** 2 / 2.8 + (z + 2.8) ** 2 / 2));
    const terrace = 1 - smooth(.85, 1.5, Math.hypot((x + 3.1) / 1.5, (z + 1.7) / 1.15));
    h = h * (1 - terrace) + 2.78 * terrace;
    const basin = 1 - smooth(.90, 1.23, lakeDistance(x, z));
    const channel = (1 - smooth(.25, .63, Math.abs(x - riverX(z)))) * smooth(.6, 1.3, z);
    const excavation = Math.max(basin, channel);
    return h * (1 - excavation) + .55 * excavation;
  }
  const segments = 160, rings = 56;
  const positions = [], uvs = [], indices = [];
  for (let j = 0; j <= rings; j++) {
    for (let i = 0; i <= segments; i++) {
      const a = i / segments * Math.PI * 2, r = radius(a) * j / rings;
      const x = Math.cos(a) * r, z = Math.sin(a) * r * .76;
      positions.push(x, height(x, z), z); uvs.push(x / 14 + .5, z / 11 + .5);
    }
  }
  for (let j = 0; j < rings; j++) for (let i = 0; i < segments; i++) {
    const a = j * (segments + 1) + i, b = a + segments + 1;
    indices.push(a, a + 1, b, a + 1, b + 1, b);
  }
  function geometry(pos, uv, idx) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx); g.computeVertexNormals(); return g;
  }
  function add(g, material) {
    const m = new THREE.Mesh(g, material); m.castShadow = m.receiveShadow = true; group.add(m); return m;
  }
  const meadow = add(geometry(positions, uvs, indices), materials.grass);
  meadow.name = 'continuous-sculpted-meadow';
  let lipZ = 2;
  while (contains(riverX(lipZ), lipZ)) lipZ += .012;
  lipZ -= .012;
  const fallAngle=Math.atan2(lipZ/.76,riverX(lipZ));

  // Large unequal buttresses form a single connected cliff, with smaller strata
  // sitting within the silhouette instead of a necklace of disconnected spikes.
  const cliffP = [], cliffU = [], cliffI = [];
  const cliffSegments = segments * 2, cliffRings = 72;
  function cliffBase(a, t) {
    const profile = [[0,1],[.08,1.005],[.23,.98],[.36,.94],[.56,.82],[.74,.61],[.90,.30],[1,.018]];
    let taper = 1;
    for (let k = 1; k < profile.length; k++) if (t >= profile[k-1][0] && t <= profile[k][0]) {
      const blend=(t-profile[k-1][0])/(profile[k][0]-profile[k-1][0]);
      taper=profile[k-1][1]*(1-blend)+profile[k][1]*blend;
    }
    const channelAngle=Math.abs(Math.atan2(Math.sin(a-fallAngle),Math.cos(a-fallAngle)));
    const clearFall=smooth(.10,.25,channelAngle);
    const buttress = 1 + clearFall*smooth(0,.18,t)*(1-smooth(.88,1,t))*(.22*Math.sin(a*5+.8)+.085*Math.sin(a*9)-.05*Math.cos(a*3));
    const r = radius(a) * taper * buttress;
    const x = Math.cos(a) * r - .8 * t, z = Math.sin(a) * r * .76 + .22 * t;
    const rimY = height(Math.cos(a) * radius(a), Math.sin(a) * radius(a) * .76);
    const fracture = Math.sin(Math.PI * t) * (.27 * Math.sin(a * 17 + t * 5) + .13 * Math.cos(a * 29));
    const depth=5.55+.65*Math.sin(a*3-.6)+.25*Math.cos(a*7);
    const y = rimY * (1 - t) - depth * t + fracture;
    return [x, y, z];
  }
  for (let j = 0; j <= cliffRings; j++) for (let i = 0; i <= cliffSegments; i++) {
    const a = (i === cliffSegments ? 0 : i / cliffSegments) * Math.PI * 2, t = j / cliffRings;
    let [x, y, z] = cliffBase(a, t);
    if (j === 0 || j === cliffRings) {
      // The denser mesh subdivides the exact old boundary segments. It does
      // not move the meadow rim, its attachments, or the original bottom ring.
      const edge = i / 2, left = Math.floor(edge) % segments, right = (left + 1) % segments, blend = edge % 1;
      const p = cliffBase(left / segments * Math.PI * 2, t), q = cliffBase(right / segments * Math.PI * 2, t);
      [x, y, z] = p.map((coordinate, axis) => coordinate + (q[axis] - coordinate) * blend);
    } else {
      const channelAngle = Math.abs(Math.atan2(Math.sin(a - fallAngle), Math.cos(a - fallAngle)));
      const clearFall = smooth(.16, .32, channelAngle);
      const rimAndTip = smooth(.025, .17, t) * (1 - smooth(.81, .985, t));
      // Preserve a quiet face for the small raycast stone inscription. This
      // mask is spatial, so nearby rock still receives geological variation.
      const nameX = smooth(-5.35, -4.90, x) * (1 - smooth(-1.10, -.65, x));
      const nameY = smooth(-2.35, -1.98, y) * (1 - smooth(-.42, -.08, y));
      const nameFront = smooth(.70, .96, Math.sin(a));
      const nameProtection = 1 - nameX * nameY * nameFront * .94;
      const envelope = rimAndTip * clearFall * nameProtection;
      const displacement = fractalRock(x, y, z) * .88 * envelope;
      // Mostly outward displacement adds face crags. A smaller vertical
      // component creates irregular shelves without distorting the whole mass.
      x += Math.cos(a) * displacement;
      z += Math.sin(a) * displacement * .76;
      y += fractalRock(x * .67 + 17.3, y * .91 - 4.8, z * .67) * .105 * envelope;
    }
    cliffP.push(x, y, z); cliffU.push(i / cliffSegments, t);
  }
  for (let j = 0; j < cliffRings; j++) for (let i = 0; i < cliffSegments; i++) {
    const a = j * (cliffSegments + 1) + i, b = a + cliffSegments + 1;
    cliffI.push(a, a + 1, b, a + 1, b + 1, b);
  }
  const tip=cliffP.length/3;cliffP.push(-.8,-6.48,.22);cliffU.push(.5,1);
  for(let i=0;i<cliffSegments;i++){const a=cliffRings*(cliffSegments+1)+i;cliffI.push(a,a+1,tip);}
  const cliffGeometry = geometry(cliffP, cliffU, cliffI);
  // The UV seam duplicates vertices. Average their normals explicitly so
  // rotating around the complete island cannot reveal a lighting seam.
  const normal = cliffGeometry.attributes.normal;
  for (let j = 0; j <= cliffRings; j++) {
    const first = j * (cliffSegments + 1), last = first + cliffSegments;
    const n = new THREE.Vector3(normal.getX(first) + normal.getX(last), normal.getY(first) + normal.getY(last), normal.getZ(first) + normal.getZ(last)).normalize();
    normal.setXYZ(first, n.x, n.y, n.z); normal.setXYZ(last, n.x, n.y, n.z);
  }
  const cliff = add(cliffGeometry, materials.rock);
  cliff.name = 'continuous-eroded-cliff';
  // A narrow uneven turf skirt integrates meadow and rock at the rim.
  const skirtP = [], skirtU = [], skirtI = [];
  for (let j = 0; j < 2; j++) for (let i = 0; i <= segments; i++) {
    const a = i / segments * Math.PI * 2, r = radius(a) + .006;
    const x = Math.cos(a) * r, z = Math.sin(a) * r * .76;
    skirtP.push(x, height(x, z) - j * (.11 + .08 * (1 + Math.sin(a * 17))), z);
    skirtU.push(i / segments, j);
  }
  for (let i = 0; i < segments; i++) skirtI.push(i, i + 1, i + segments + 1, i + 1, i + segments + 2, i + segments + 1);
  add(geometry(skirtP, skirtU, skirtI), materials.grass);

  // Lake vertices are built directly in XZ, so water shader ripples remain in
  // the horizontal plane. Its edge disappears into the excavated shoreline.
  const waterP = [1.05, waterLevel, .15], waterU = [.5, .5], waterI = [];
  for (let i = 0; i <= 100; i++) {
    const a = i / 100 * Math.PI * 2;
    waterP.push(1.05 + Math.cos(a) * 2.35 * 1.20, waterLevel, .15 + Math.sin(a) * 1.65 * 1.20);
    waterU.push(.5 + .5 * Math.cos(a), .5 + .5 * Math.sin(a));
    if (i < 100) waterI.push(0, i + 2, i + 1);
  }
  const lake = add(geometry(waterP, waterU, waterI), materials.water);
  lake.castShadow = false; lake.renderOrder = 2;
  const riverP = [], riverU = [], riverI = [];
  for (let i = 0; i <= 80; i++) {
    const z = 1 + (lipZ - 1) * i / 80;
    const width = .41 + .045 * Math.sin(z * 2);
    for (const side of [-1, 1]) { riverP.push(riverX(z) + side * width, waterLevel, z); riverU.push((side + 1) / 2, i / 80); }
    if (i < 80) { const a = i * 2; riverI.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
  }
  const river = add(geometry(riverP, riverU, riverI), materials.water);
  river.castShadow = false; river.renderOrder = 2;
  const lip = new THREE.Vector3(riverX(lipZ), waterLevel, lipZ);
  const fallP = [], fallU = [], fallI = [];
  for (let j = 0; j <= 80; j++) for (let i = 0; i <= 12; i++) {
    const t = j / 80, side = i / 12 - .5;
    const width = .89 * (1 - .24 * t) + .06 * Math.sin(t * 17 + side * 2);
    fallP.push(lip.x + side * width, waterLevel - t * 7.4, lip.z + .05 + .46 * Math.sin(t * Math.PI / 2));
    fallU.push(i / 12, 1 - t);
    if (j < 80 && i < 12) { const a = j * 13 + i; fallI.push(a, a + 1, a + 13, a + 1, a + 14, a + 13); }
  }
  const waterfall = add(geometry(fallP, fallU, fallI), materials.waterfall);
  waterfall.castShadow = false; waterfall.renderOrder = 3;

  // Low stones and tufts share instanced geometry; density adds scale without
  // thousands of individual draw calls or sphere-shaped tree canopies.
  let seed = 8753;
  const random = () => { seed = seed * 16807 % 2147483647; return seed / 2147483647; };
  const rockGeo = new THREE.IcosahedronGeometry(1, 2);
  const stones = new THREE.InstancedMesh(rockGeo, materials.stone, 46);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < 46; i++) {
    let x, z;
    do { x = (random() - .5) * 13; z = (random() - .5) * 9; } while (!contains(x, z, .25) || height(x, z) < waterLevel + .05 || Math.hypot(x + 3.1, z + 1.7) < 1.3);
    const s = .07 + random() * .16;
    dummy.position.set(x, height(x, z) - .025, z); dummy.scale.set(s * (1 + random()), s * .60, s);
    dummy.rotation.set(random() * .6, random() * 6.28, random() * .4); dummy.updateMatrix(); stones.setMatrixAt(i, dummy.matrix);
  }
  stones.castShadow = stones.receiveShadow = true; group.add(stones);
  // Preserve the established flower positions while the richer botanical module
  // replaces the old triangle grass. No legacy blade meshes are allocated.
  let sampled = 0;
  while (sampled < 650) {
    const x = (random() - .5) * 13.8, z = (random() - .5) * 10.4;
    if (!contains(x, z, .18) || height(x, z) < waterLevel + .045 || Math.hypot(x + 3.1, z + 1.7) < 1.5) continue;
    random(); random(); sampled++;
  }
  const flowers = new THREE.InstancedMesh(new THREE.SphereGeometry(.035, 5, 4), materials.flower, 380);
  for (let i = 0; i < 380; i++) {
    let x, z;
    do { x = (random() - .5) * 13.2; z = (random() - .5) * 9.6; } while (!contains(x, z, .45) || height(x, z) < waterLevel + .12 || Math.hypot(x + 3.1, z + 1.7) < 1.5);
    dummy.position.set(x, height(x, z) + .12, z); dummy.scale.set(1.3, .5, 1.3); dummy.rotation.set(0, random() * 6, 0); dummy.updateMatrix(); flowers.setMatrixAt(i, dummy.matrix);
  }
  group.add(flowers);

  // A winding limestone route climbs the hill; each section follows terrain.
  const pathP = [], pathU = [], pathI = [];
  const path = new THREE.CatmullRomCurve3([new THREE.Vector3(-.8,0,2.8),new THREE.Vector3(-2.5,0,2.1),new THREE.Vector3(-3.8,0,.9),new THREE.Vector3(-2.7,0,-.25),new THREE.Vector3(-3.1,0,-1.7)]);
  for (let i = 0; i <= 100; i++) {
    const t = i / 100, p = path.getPoint(t), tangent = path.getTangent(t), width = .17;
    for (const side of [-1, 1]) { const x = p.x + tangent.z * width * side, z = p.z - tangent.x * width * side; pathP.push(x, height(x,z) + .023, z); pathU.push((side+1)/2,t); }
    if (i < 100) { const a = i * 2; pathI.push(a,a+2,a+1,a+1,a+2,a+3); }
  }
  const trail = add(geometry(pathP,pathU,pathI), materials.stone); trail.material.side = THREE.DoubleSide; trail.castShadow = false;
  return { group, height, contains, radius, lakeDistance, riverX, waterLevel, lip, castleAnchor:new THREE.Vector3(-3.1,height(-3.1,-1.7),-1.7) };
}
