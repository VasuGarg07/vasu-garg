import * as THREE from 'three';

const flat = (color) => new THREE.MeshBasicMaterial({ color, fog: false });

export function createSky(scene) {
  const sky = new THREE.Group();
  scene.add(sky);

  sky.add(new THREE.Mesh(
    new THREE.SphereGeometry(400, 32, 16),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: {
        top: { value: new THREE.Color(0x07061a) },
        mid: { value: new THREE.Color(0x45286b) },
        low: { value: new THREE.Color(0xe0715a) },
      },
      vertexShader: `
        varying vec3 vDir;
        void main() {
          vDir = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: `
        uniform vec3 top;
        uniform vec3 mid;
        uniform vec3 low;
        varying vec3 vDir;
        void main() {
          float h = vDir.y;
          vec3 c = mix(low, mid, smoothstep(0.0, 0.22, h));
          c = mix(c, top, smoothstep(0.2, 0.75, h));
          c = mix(c, low * 0.35, smoothstep(0.0, -0.3, h));
          gl_FragColor = vec4(c, 1.0);
        }`,
    })
  ));

  const stars = [];
  while (stars.length < 1500) {
    const v = new THREE.Vector3().randomDirection();
    if (v.y > 0.08) stars.push(v.x * 380, v.y * 380, v.z * 380);
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(stars, 3));
  sky.add(new THREE.Points(starGeo, new THREE.PointsMaterial({
    size: 1.8, sizeAttenuation: false, color: 0xffffff, fog: false, transparent: true, opacity: 0.85, depthWrite: false,
  })));

  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(14, 32, 24),
    new THREE.MeshBasicMaterial({ color: new THREE.Color().setRGB(2.2, 2.0, 1.7), fog: false })
  );
  moon.position.set(-110, 95, -250);
  sky.add(moon);

  const fuji = new THREE.Mesh(new THREE.ConeGeometry(75, 72, 8), flat(0x241a3f));
  fuji.position.set(30, 34, -340);
  const snow = new THREE.Mesh(new THREE.ConeGeometry(23, 22, 8), flat(0x9d89b8));
  snow.position.set(30, 59, -340);
  scene.add(fuji, snow);

  for (let i = 0; i < 16; i++) {
    const r = 30 + Math.random() * 35;
    const ridge = new THREE.Mesh(
      new THREE.ConeGeometry(r, r * (0.7 + Math.random() * 0.5), 6),
      flat(Math.random() > 0.5 ? 0x2d1f4f : 0x1a1230)
    );
    const side = Math.random() > 0.5 ? 1 : -1;
    ridge.position.set(side * (70 + Math.random() * 170), r * 0.3, -190 - Math.random() * 160);
    scene.add(ridge);
  }

  return sky;
}
