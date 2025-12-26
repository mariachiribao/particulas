const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#three-canvas') });
renderer.setSize(window.innerWidth, window.innerHeight);

// Crear partículas
const count = 5000;
const positions = new Float32Array(count * 3);
const originalPositions = new Float32Array(count * 3);

for(let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
    originalPositions[i] = positions[i]; // Guardamos la base
}

const geometry = new THREE.BufferAttribute(positions, 3);
const bufferGeo = new THREE.BufferGeometry();
bufferGeo.setAttribute('position', geometry);

const material = new THREE.PointsMaterial({ size: 0.05, color: 0x00ffcc });
const points = new THREE.Points(bufferGeo, material);
scene.add(points);

camera.position.z = 15;