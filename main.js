const videoElement = document.getElementById('webcam');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('three-canvas'), antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1);
camera.position.z = 24;

// --- COLORES ---
const colorAzulFrancia = new THREE.Color(0x0055ff);
const colorElectricBlue = new THREE.Color(0x00ffff);
const colorViolet = new THREE.Color(0x8a2be2);
const colorFucsiaNeon = new THREE.Color(0xff00ff);
const colorIdleBase = colorAzulFrancia.clone().lerp(colorElectricBlue, 0.3);

let systemState = 'QA_IDLE';
let bienvenidosSystem = null;

function createParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.4, 'rgba(0, 255, 255, 0.6)'); // Halo azul eléctrico
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
}

function createTextSystem(text, fontSize, spacing, color, isBienvenidos = false) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = isBienvenidos ? 1200 : 512;
    canvas.height = 256;
    ctx.fillStyle = 'white';
    ctx.font = `900 ${fontSize}px Arial Black, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width/2, 128);

    const data = ctx.getImageData(0, 0, canvas.width, 256).data;
    const positions = [], originals = [], randomness = [];
    const step = isBienvenidos ? 1.8 : 0.7; // QA denso, Bienvenidos ligero

    for (let y = 0; y < 256; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
            let idx = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
            if (data[idx] > 128) {
                const px = (x - canvas.width/2) * spacing;
                const py = (128 - y) * spacing;
                const pz = (Math.random() - 0.5) * 2;
                positions.push(px, py, pz);
                originals.push(px, py, pz);
                randomness.push(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
            }
        }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('origin', new THREE.Float32BufferAttribute(originals, 3));
    geo.setAttribute('rand', new THREE.Float32BufferAttribute(randomness, 3));

    const mat = new THREE.PointsMaterial({
        size: isBienvenidos ? 0.08 : 0.12,
        map: createParticleTexture(),
        transparent: true, opacity: isBienvenidos ? 0 : 0.9,
        depthWrite: false, blending: THREE.AdditiveBlending,
        color: color
    });

    return new THREE.Points(geo, mat);
}

const qaSystem = createTextSystem("QA", 130, 0.12, colorIdleBase);
qaSystem.userData = { currentScale: 1.2, targetScale: 1.2, isTracking: false, targetPos: new THREE.Vector3(0,0,0) };
scene.add(qaSystem);

// --- HANDS TRACKING ---
const hands = new Hands({ locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}` });
hands.setOptions({ maxNumHands: 2, modelComplexity: 1, minDetectionConfidence: 0.6 });

hands.onResults((results) => {
    if (systemState === 'BIENVENIDOS_ANIMATING') return;

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        qaSystem.userData.isTracking = true;
        let maxPinch = 0, totalX = 0, totalY = 0;

        results.multiHandLandmarks.forEach((landmarks) => {
            const d = Math.sqrt(Math.pow(landmarks[4].x - landmarks[8].x, 2) + Math.pow(landmarks[4].y - landmarks[8].y, 2));
            if (d > maxPinch) maxPinch = d;
            totalX += landmarks[9].x; totalY += landmarks[9].y;
        });

        // DISPARADOR BIENVENIDOS (SUPER EXPANDIDO)
        if (maxPinch > 0.5) {
            systemState = 'BIENVENIDOS_ANIMATING';
            qaSystem.visible = false;
            bienvenidosSystem = createTextSystem("BIENVENIDOS", 100, 0.07, colorViolet, true);
            bienvenidosSystem.userData = { life: 0 };
            scene.add(bienvenidosSystem);
            return;
        }

        const avgX = (0.5 - totalX / results.multiHandLandmarks.length) * 45;
        const avgY = (0.5 - totalY / results.multiHandLandmarks.length) * 30;
        qaSystem.userData.targetPos.set(avgX, avgY, 0);
        qaSystem.userData.targetScale = 1.0 + (maxPinch * 30);

        // MEZCLA DE COLOR QA (Azul -> Violeta -> Magenta)
        let colorFactor = Math.min(maxPinch * 4, 1);
        let mix = colorIdleBase.clone().lerp(colorViolet, colorFactor).lerp(colorFucsiaNeon, colorFactor * 0.6);
        qaSystem.material.color.copy(mix);
        qaSystem.material.size = 0.12 + (maxPinch * 1.2);
    } else {
        qaSystem.userData.isTracking = false;
        qaSystem.userData.targetPos.set(0, 0, 0);
        qaSystem.material.color.lerp(colorIdleBase, 0.05);
        qaSystem.material.size = 0.12;
    }
});

new Camera(videoElement, { onFrame: async () => await hands.send({image: videoElement}), width: 1280, height: 720 }).start();

let time = 0;
function animate() {
    requestAnimationFrame(animate);
    time += 0.02;

    if (systemState === 'BIENVENIDOS_ANIMATING' && bienvenidosSystem) {
        const data = bienvenidosSystem.userData;
        data.life += 0.02;
        // Animación de BIENVENIDOS (Formación -> Neón -> Out)
        if (data.life < 1.5) {
            bienvenidosSystem.material.opacity = data.life / 1.5;
            bienvenidosSystem.material.size = 0.08 + (data.life * 0.1);
        } else if (data.life < 4.5) {
            bienvenidosSystem.material.color.lerp(colorFucsiaNeon, 0.05);
            bienvenidosSystem.material.size = 0.22 + Math.sin(time * 4) * 0.04;
        } else {
            bienvenidosSystem.material.opacity = 1 - (data.life - 4.5);
            if (bienvenidosSystem.material.opacity <= 0) {
                scene.remove(bienvenidosSystem);
                bienvenidosSystem = null;
                qaSystem.visible = true;
                systemState = 'QA_IDLE';
                return;
            }
        }
        bienvenidosSystem.position.y = Math.sin(time) * 0.3;
    } else {
        // --- ANIMACIÓN QA CON FÍSICA DE EXPANSIÓN ---
        const data = qaSystem.userData;
        if (!data.isTracking) {
            data.targetScale = 1.2 + Math.sin(time * 1.5) * 0.1;
            qaSystem.position.y = Math.sin(time) * 0.4;
        } else {
            qaSystem.position.lerp(data.targetPos, 0.15);
        }
        data.currentScale += (data.targetScale - data.currentScale) * 0.1;

        const attrPos = qaSystem.geometry.attributes.position;
        const pos = attrPos.array;
        const ori = qaSystem.geometry.attributes.origin.array;
        const rnd = qaSystem.geometry.attributes.rand.array;

        for (let i = 0; i < pos.length; i += 3) {
            const spread = (data.currentScale - 1) * 5.0; // Factor de expansión
            const mx = Math.sin(time + i) * (spread * 0.15);
            const my = Math.cos(time + i) * (spread * 0.15);

            pos[i] += (ori[i] * data.currentScale + (rnd[i] * spread) + mx - pos[i]) * 0.12;
            pos[i+1] += (ori[i+1] * data.currentScale + (rnd[i+1] * spread) + my - pos[i+1]) * 0.12;
            pos[i+2] += (ori[i+2] * data.currentScale + (rnd[i+2] * spread) - pos[i+2]) * 0.12;
        }
        attrPos.needsUpdate = true;
    }

    renderer.render(scene, camera);
}
animate();
