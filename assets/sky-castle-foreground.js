/** Grounded details for the foreground lookout, shared by every art direction. */
export function buildForegroundDetails(THREE, materials, ledge) {
  const group = new THREE.Group();
  group.name = 'lookout-garden';
  ledge.updateMatrixWorld(true);
  const ray = new THREE.Raycaster();
  const down = new THREE.Vector3(0, -1, 0);
  function groundHeight(x, z) {
    ray.set(new THREE.Vector3(x, 20, z), down);
    return ray.intersectObject(ledge, true)[0]?.point.y ?? -3.7;
  }
  let seed = 3109;
  const random = () => { seed = seed * 16807 % 2147483647; return seed / 2147483647; };
  const transform = new THREE.Object3D();
  function instances(geometry, material, points) {
    const mesh = new THREE.InstancedMesh(geometry, material, points.length);
    points.forEach(({x, y, z, scale, rotation = [0, 0, 0], tint}, index) => {
      transform.position.set(x, y, z);
      transform.rotation.set(...rotation);
      transform.scale.set(...scale);
      transform.updateMatrix();
      mesh.setMatrixAt(index, transform.matrix);
      if (tint) mesh.setColorAt(index, new THREE.Color(tint));
    });
    mesh.castShadow = mesh.receiveShadow = true;
    group.add(mesh);
  }

  // An irregular stepping-stone trail leads toward the two travelers. Each
  // stone samples the ledge surface so the trail follows its gentle crown.
  const path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-15, 0, 11.15), new THREE.Vector3(-12, 0, 11.5),
    new THREE.Vector3(-9.2, 0, 10.15), new THREE.Vector3(-6.7, 0, 10.5),
  ]);
  const stones = [];
  for (let i = 0; i < 24; i++) {
    const p = path.getPoint(i / 23), s = .12 + random() * .05;
    p.x += (random() - .5) * .1; p.z += (random() - .5) * .16;
    stones.push({x:p.x, y:groundHeight(p.x, p.z) + .025, z:p.z,
      scale:[s * 1.25, .05, s * .8], rotation:[0, random() * Math.PI, 0]});
  }
  instances(new THREE.SphereGeometry(1, 10, 6), materials.stone, stones);

  const shrubs = [], rocks = [], petals = [], hearts = [], stems = [], leaves = [];
  const patches = [[-13,10.5,.7],[-11.8,12,.45],[-9.8,9.7,.7],[-7.8,11.3,.6],[-4.6,10.6,.8],[-3,10.8,.45]];
  for (const [cx, cz, radius] of patches) {
    for (let i = 0; i < 5; i++) {
      const angle = random() * Math.PI * 2, r = Math.sqrt(random()) * radius;
      const x = cx + Math.cos(angle) * r, z = cz + Math.sin(angle) * r, y = groundHeight(x, z);
      const s = .13 + random() * .19;
      shrubs.push({x, y:y+s*.42, z, scale:[s*1.3,s*.7,s], rotation:[0,random()*6,0]});
      if (i < 2) rocks.push({x:x+.18, y:y+.04, z:z+.15, scale:[s*.55,s*.5,s*.8], rotation:[0,random()*6,0]});
    }
    for (let i = 0; i < 15; i++) {
      const angle = random() * Math.PI * 2, r = Math.sqrt(random()) * radius * 1.5;
      const x = cx + Math.cos(angle) * r, z = cz + Math.sin(angle) * r;
      const y = groundHeight(x,z), h = .10 + random() * .16, size = .024 + random() * .014;
      stems.push({x,y:y+h/2,z,scale:[.006,h,.006]});
      hearts.push({x,y:y+h,z,scale:[size*.6,size*.5,size*.6]});
      for(let j=0;j<5;j++){
        const a=j/5*Math.PI*2;
        petals.push({x:x+Math.cos(a)*size*.8,y:y+h,z:z+Math.sin(a)*size*.8,
          scale:[size,size*.35,size*.55],rotation:[0,-a,0]});
      }
      for(let j=0;j<2;j++) leaves.push({x:x+(j?1:-1)*.027,y:y+h*.45,z,
        scale:[.042,.008,.018],rotation:[0,angle,j?.45:-.45]});
    }
  }
  instances(new THREE.SphereGeometry(1,12,8), materials.leaf, shrubs);
  instances(new THREE.IcosahedronGeometry(1,1), materials.rock, rocks);
  instances(new THREE.CylinderGeometry(1,1,1,5), materials.trunk, stems);
  instances(new THREE.SphereGeometry(1,6,4), materials.flower, petals);
  instances(new THREE.SphereGeometry(1,6,4), materials.gold, hearts);
  instances(new THREE.SphereGeometry(1,6,4), materials.grass, leaves);

  // Fine plants live beside the existing trail and shrubs, leaving the viewing
  // clearing open. A folded, tapered leaf carries its own restrained vein shader.
  const leafPositions = [], leafUvs = [], leafIndices = [];
  for(let i=0;i<=4;i++){
    const t=i/4, width=Math.sin(t*Math.PI)*.23;
    for(const side of [-1,0,1]){
      leafPositions.push(t,Math.sin(t*Math.PI)*(.09+(side===0?.035:0)),side*width);
      leafUvs.push(t,(side+1)/2);
    }
    if(i<4)for(let j=0;j<2;j++){
      const q=i*3+j;leafIndices.push(q,q+1,q+3,q+1,q+4,q+3);
    }
  }
  const leafGeometry=new THREE.BufferGeometry();
  leafGeometry.setAttribute('position',new THREE.Float32BufferAttribute(leafPositions,3));
  leafGeometry.setAttribute('uv',new THREE.Float32BufferAttribute(leafUvs,2));
  leafGeometry.setIndex(leafIndices);leafGeometry.computeVertexNormals();
  const fineLeaves=[], fernStems=[];
  const up=new THREE.Vector3(0,1,0);
  function stemBetween(a,b){
    const length=a.distanceTo(b), middle=a.clone().add(b).multiplyScalar(.5);
    const quaternion=new THREE.Quaternion().setFromUnitVectors(up,b.clone().sub(a).normalize());
    const rotation=new THREE.Euler().setFromQuaternion(quaternion);
    fernStems.push({x:middle.x,y:middle.y,z:middle.z,scale:[.004,length,.004],rotation:[rotation.x,rotation.y,rotation.z]});
  }
  for(const [cx,cz] of [[-12.4,10.65],[-9.9,9.65],[-7.75,11.3],[-4.8,10.6]]){
    const base=groundHeight(cx,cz);
    for(let frond=0;frond<5;frond++){
      const angle=frond/5*Math.PI*2+random(), length=.30+random()*.16;
      let previous=new THREE.Vector3(cx,base,cz);
      for(let j=1;j<=6;j++){
        const t=j/6, reach=length*t, y=base+Math.sin(t*Math.PI*.76)*length*.72;
        const center=new THREE.Vector3(cx+Math.cos(angle)*reach,y,cz+Math.sin(angle)*reach);
        stemBetween(previous,center);previous=center;
        const size=length*.32*Math.sin(t*Math.PI*.88);
        for(const side of [-1,1])fineLeaves.push({x:center.x,y,z:center.z,
          scale:[size,size,size],rotation:[0,-angle+side*1.05,.10]});
      }
    }
    // A few fallen leaves and pebble-sized fragments give the path a lived-in edge.
    for(let i=0;i<6;i++){
      const angle=random()*Math.PI*2,r=.18+random()*.48;
      const x=cx+Math.cos(angle)*r,z=cz+Math.sin(angle)*r,size=.07+random()*.07;
      fineLeaves.push({x,y:groundHeight(x,z)+.013,z,scale:[size,size*.45,size],rotation:[0,random()*6.28,0],tint:0xd4cc9c});
    }
  }
  // Small leaf sprays follow the shrub crown instead of floating above it.
  for(const shrub of shrubs)for(let i=0;i<7;i++){
    const angle=i/7*Math.PI*2+random()*.3, h=.2+random()*.55;
    const x=shrub.x+Math.cos(angle)*shrub.scale[0]*Math.sqrt(1-h*h);
    const z=shrub.z+Math.sin(angle)*shrub.scale[2]*Math.sqrt(1-h*h);
    fineLeaves.push({x,y:shrub.y+shrub.scale[1]*h,z,scale:[.10,.10,.10],rotation:[0,-angle,.35]});
  }
  instances(leafGeometry,materials.leafDetail,fineLeaves);
  instances(new THREE.CylinderGeometry(1,1,1,5),materials.trunk,fernStems);
  return {group, groundHeight};
}
