import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Play, Pause } from 'lucide-react';
import { useMotionStore } from '../../store/motionStore';

// Pouch geometry for floating packs in hero
function createHeroPouchGeometry(scale = 1.0) {
  const width = 1.8 * scale;
  const height = 2.5 * scale;
  const depth = 0.4 * scale;
  const geo = new THREE.BoxGeometry(width, height, depth, 20, 24, 6);
  const pos = geo.attributes.position;
  const halfH = height / 2;
  const halfW = width / 2;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    let z = pos.getZ(i);

    const normY = y / halfH;
    const absNormY = Math.abs(normY);
    const normX = x / halfW;

    if (absNormY > 0.84) {
      z *= 0.15;
    } else {
      const bellyX = Math.cos(normX * Math.PI * 0.5);
      const bellyY = Math.cos((normY / 0.84) * Math.PI * 0.5);
      const bulge = bellyX * bellyY * (0.24 * scale);
      if (z > 0) z += bulge;
      else if (z < 0) z -= bulge;
    }
    pos.setXYZ(i, x, y, z);
  }
  geo.computeVertexNormals();
  return geo;
}

export default function HeroCinematicCanvas({ className = '' }) {
  const mountRef = useRef(null);
  const { motionEnabled, toggleMotion } = useMotionStore();
  const [isPlaying, setIsPlaying] = useState(true);

  const stateRef = useRef({
    renderer: null,
    scene: null,
    camera: null,
    heroPack: null,
    leftPack: null,
    rightPack: null,
    particles: null,
    animFrameId: null,
    isVisible: true,
    pointerX: 0,
    pointerY: 0,
    targetPointerX: 0,
    targetPointerY: 0,
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 650;
    const s = stateRef.current;

    // Scene
    const scene = new THREE.Scene();
    s.scene = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.2);
    s.camera = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);
    s.renderer = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // Warm key rim light
    const keyLight = new THREE.DirectionalLight(0xd9b779, 3.2);
    keyLight.position.set(3.5, 3.5, 2.5);
    scene.add(keyLight);

    // Deep-red backlight halo
    const redHalo = new THREE.PointLight(0xe52b32, 3.0, 7.0);
    redHalo.position.set(0, 0.2, -2.0);
    scene.add(redHalo);

    // Cool fill
    const fillLight = new THREE.DirectionalLight(0x94a3b8, 1.2);
    fillLight.position.set(-3.5, -2.0, 3.0);
    scene.add(fillLight);

    // Texture Loader
    const loader = new THREE.TextureLoader();

    // 1. Dominant Hero Pack (Peri Desi)
    const heroGeo = createHeroPouchGeometry(1.15);
    const heroMat = new THREE.MeshStandardMaterial({
      roughness: 0.28,
      metalness: 0.16,
    });
    const sideMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.4,
    });

    const heroMesh = new THREE.Mesh(heroGeo, [
      sideMat, sideMat, sideMat, sideMat, heroMat, sideMat
    ]);
    heroMesh.position.set(0.1, 0, 0.2);
    scene.add(heroMesh);
    s.heroPack = heroMesh;

    loader.load('/products/peri-desi.jpg', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      heroMat.map = tex;
      heroMat.needsUpdate = true;
    });

    // 2. Left Supporting Pack (Cream 'n' Onion)
    const leftGeo = createHeroPouchGeometry(0.85);
    const leftMat = new THREE.MeshStandardMaterial({
      roughness: 0.35,
      metalness: 0.18,
    });
    const leftMesh = new THREE.Mesh(leftGeo, [
      sideMat, sideMat, sideMat, sideMat, leftMat, sideMat
    ]);
    leftMesh.position.set(-1.65, -0.45, -0.8);
    leftMesh.rotation.y = 0.25;
    leftMesh.rotation.z = -0.06;
    scene.add(leftMesh);
    s.leftPack = leftMesh;

    loader.load('/products/cream-n-onion.jpg', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      leftMat.map = tex;
      leftMat.needsUpdate = true;
    });

    // 3. Right Supporting Pack (Manchurian)
    const rightGeo = createHeroPouchGeometry(0.82);
    const rightMat = new THREE.MeshStandardMaterial({
      roughness: 0.35,
      metalness: 0.18,
    });
    const rightMesh = new THREE.Mesh(rightGeo, [
      sideMat, sideMat, sideMat, sideMat, rightMat, sideMat
    ]);
    rightMesh.position.set(1.75, 0.4, -0.7);
    rightMesh.rotation.y = -0.22;
    rightMesh.rotation.z = 0.05;
    scene.add(rightMesh);
    s.rightPack = rightMesh;

    loader.load('/products/manchurian.jpg', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      rightMat.map = tex;
      rightMat.needsUpdate = true;
    });

    // 4. Floating Ingredients & Spice Particles
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color('#D9B779'),
      new THREE.Color('#E52B32'),
      new THREE.Color('#2E8B42'),
      new THREE.Color('#FFFFFF'),
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6.5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5.0;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3.5;

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext('2d');
    const pGrad = pCtx.createRadialGradient(32, 32, 4, 32, 32, 30);
    pGrad.addColorStop(0, 'rgba(255,255,255,1)');
    pGrad.addColorStop(0.6, 'rgba(255,255,255,0.6)');
    pGrad.addColorStop(1, 'rgba(255,255,255,0)');
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 64, 64);
    const pTex = new THREE.CanvasTexture(pCanvas);

    const pMat = new THREE.PointsMaterial({
      size: 0.12,
      map: pTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, pMat);
    scene.add(particles);
    s.particles = particles;

    // Contact Floor Soft Glow
    const floorGeo = new THREE.PlaneGeometry(8, 5);
    const floorCanvas = document.createElement('canvas');
    floorCanvas.width = 256;
    floorCanvas.height = 256;
    const fCtx = floorCanvas.getContext('2d');
    const fGrad = fCtx.createRadialGradient(128, 128, 20, 128, 128, 120);
    fGrad.addColorStop(0, 'rgba(229, 43, 50, 0.22)');
    fGrad.addColorStop(0.5, 'rgba(217, 183, 121, 0.12)');
    fGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    fCtx.fillStyle = fGrad;
    fCtx.fillRect(0, 0, 256, 256);
    const floorMat = new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(floorCanvas),
      transparent: true,
      opacity: 0.75,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.9;
    scene.add(floor);

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      s.targetPointerX = x * 0.35;
      s.targetPointerY = -y * 0.25;
    };
    window.addEventListener('pointermove', handlePointerMove);

    const observer = new IntersectionObserver(([entry]) => {
      s.isVisible = entry.isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(container);

    let startTime = performance.now();

    const animate = () => {
      s.animFrameId = requestAnimationFrame(animate);
      if (!s.isVisible) return;

      const now = performance.now();
      const time = (now - startTime) * 0.001;

      s.pointerX += (s.targetPointerX - s.pointerX) * 0.05;
      s.pointerY += (s.targetPointerY - s.pointerY) * 0.05;

      const activeMotion = motionEnabled && isPlaying;

      if (activeMotion) {
        const heroTurn = Math.sin(time * 0.7) * 0.14;
        const heroFloat = Math.sin(time * 1.1) * 0.08;
        heroMesh.rotation.y = heroTurn + s.pointerX * 0.5;
        heroMesh.rotation.x = Math.cos(time * 0.9) * 0.04 + s.pointerY * 0.5;
        heroMesh.position.y = heroFloat;

        leftMesh.rotation.y = 0.25 + Math.sin(time * 0.5 + 1) * 0.08 + s.pointerX * 0.3;
        leftMesh.position.y = -0.45 + Math.sin(time * 0.9 + 2) * 0.06;

        rightMesh.rotation.y = -0.22 + Math.cos(time * 0.6) * 0.08 + s.pointerX * 0.3;
        rightMesh.position.y = 0.4 + Math.cos(time * 0.8 + 1) * 0.07;

        particles.rotation.y = time * 0.03 + s.pointerX * 0.2;
        particles.rotation.x = Math.sin(time * 0.04) * 0.08;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      if (s.animFrameId) cancelAnimationFrame(s.animFrameId);
      if (renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      heroGeo.dispose();
      leftGeo.dispose();
      rightGeo.dispose();
      particleGeo.dispose();
      renderer.dispose();
    };
  }, [motionEnabled, isPlaying]);

  return (
    <div className={`relative w-full h-full select-none ${className}`}>
      {/* Dedicated Three.js Hero Canvas Mount */}
      <div
        ref={mountRef}
        className="w-full h-full min-h-[380px] md:min-h-[540px] relative pointer-events-auto"
        aria-label="Cinematic product film: three floating Naastha snack packs with studio rim lighting and floating spice particles"
      />

      {/* Unobtrusive Pause/Play Motion Control */}
      <div className="absolute bottom-4 right-4 z-20">
        <button
          onClick={() => {
            setIsPlaying(!isPlaying);
            if (!motionEnabled) toggleMotion();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#141416]/80 hover:bg-[#141416] text-[#B7B5B0] hover:text-[#F6F3ED] text-[11px] font-semibold uppercase tracking-wider backdrop-blur-md border border-white/10 transition-all shadow-lg focus:outline-none focus:ring-1 focus:ring-[#E52B32]"
          title={isPlaying ? 'Pause hero cinematic loop' : 'Resume hero cinematic loop'}
          aria-label={isPlaying ? 'Pause hero animation' : 'Resume hero animation'}
        >
          {isPlaying && motionEnabled ? (
            <>
              <Pause size={11} className="text-[#E52B32]" />
              <span>Pause Motion</span>
            </>
          ) : (
            <>
              <Play size={11} className="text-[#D9B779]" />
              <span>Play Motion</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
