import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const canvas = document.getElementById('hero-canvas');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canvas && !prefersReducedMotion) {
  initHeroScene(canvas);
} else if (canvas) {
  canvas.style.display = 'none';
}

function initHeroScene(canvas) {
  const isSmallScreen = window.innerWidth < 700;
  const LINE_COUNT = isSmallScreen ? 40 : 90;
  const POINTS_PER_LINE = 60;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
  camera.position.z = 1;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const lines = [];
  const mouse = { x: 0, y: 0, target: { x: 0, y: 0 } };

  function createLine(index) {
    const yBase = (index / LINE_COUNT) * 2 - 1;
    const positions = new Float32Array(POINTS_PER_LINE * 3);
    for (let i = 0; i < POINTS_PER_LINE; i++) {
      const x = (i / (POINTS_PER_LINE - 1)) * 2 - 1;
      positions[i * 3] = x;
      positions[i * 3 + 1] = yBase;
      positions[i * 3 + 2] = 0;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.LineBasicMaterial({
      color: 0x2a2420,
      transparent: true,
      opacity: 0.06 + (index % 5) * 0.01,
    });
    const line = new THREE.Line(geometry, material);
    scene.add(line);
    return { line, yBase, geometry };
  }

  for (let i = 0; i < LINE_COUNT; i++) {
    lines.push(createLine(i));
  }

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('pointermove', (e) => {
    mouse.target.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.target.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    mouse.x += (mouse.target.x - mouse.x) * 0.05;
    mouse.y += (mouse.target.y - mouse.y) * 0.05;

    lines.forEach(({ geometry, yBase }, lineIndex) => {
      const positions = geometry.attributes.position.array;
      for (let i = 0; i < POINTS_PER_LINE; i++) {
        const x = positions[i * 3];
        const wave = Math.sin(x * 2 + t * 0.6 + lineIndex * 0.3) * 0.04;
        const distToMouse = Math.hypot(x - mouse.x, yBase - mouse.y);
        const mouseInfluence = Math.max(0, 0.4 - distToMouse) * 0.6;
        positions[i * 3 + 1] = yBase + wave + mouseInfluence;
      }
      geometry.attributes.position.needsUpdate = true;
    });

    renderer.render(scene, camera);
  }
  animate();
}
