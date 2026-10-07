import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCcw, Gift } from 'lucide-react';
import { useMotionStore } from '../../store/motionStore';

export default function GiftingRevealCanvas({ className = '' }) {
  const mountRef = useRef(null);
  const { motionEnabled } = useMotionStore();
  const [hasRevealed, setHasRevealed] = useState(false);

  const stateRef = useRef({
    renderer: null,
    scene: null,
    camera: null,
    lidGroup: null,
    lidAngle: 0,
    targetLidAngle: 0,
    animFrameId: null,
    isVisible: true,
    elapsedReveal: 0,
    isReplaying: false,
  });

  const handleReplay = () => {
    const s = stateRef.current;
    s.lidAngle = 0;
    s.targetLidAngle = 0;
    s.elapsedReveal = 0;
    s.isReplaying = true;
    setHasRevealed(false);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 420;
    const s = stateRef.current;

    const scene = new THREE.Scene();
    s.scene = scene;

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 2.8, 4.8);
    camera.lookAt(0, 0.3, 0);
    s.camera = camera;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);
    s.renderer = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const goldSpot = new THREE.SpotLight(0xd9b779, 4.5, 12, Math.PI / 4, 0.3);
    goldSpot.position.set(3.0, 4.5, 3.5);
    scene.add(goldSpot);

    const redRim = new THREE.PointLight(0xe52b32, 2.5, 6);
    redRim.position.set(-2.5, 1.5, -2.0);
    scene.add(redRim);

    const boxGroup = new THREE.Group();
    boxGroup.position.set(0, -0.2, 0);
    scene.add(boxGroup);

    const boxW = 3.4;
    const boxH = 0.85;
    const boxD = 2.4;
    const boxMat = new THREE.MeshStandardMaterial({
      color: 0x141417,
      roughness: 0.5,
      metalness: 0.15,
    });
    const boxBody = new THREE.Mesh(
      new THREE.BoxGeometry(boxW, boxH, boxD),
      boxMat
    );
    boxBody.position.y = boxH / 2;
    boxGroup.add(boxBody);

    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0xd9b779,
      roughness: 0.25,
      metalness: 0.65,
    });
    const ribbon = new THREE.Mesh(
      new THREE.BoxGeometry(boxW + 0.02, boxH + 0.02, 0.35),
      ribbonMat
    );
    ribbon.position.y = boxH / 2;
    boxGroup.add(ribbon);

    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, boxH, -boxD / 2);
    boxGroup.add(lidGroup);
    s.lidGroup = lidGroup;

    const lidMesh = new THREE.Mesh(
      new THREE.BoxGeometry(boxW + 0.06, 0.08, boxD + 0.06),
      boxMat
    );
    lidMesh.position.set(0, 0.04, boxD / 2);
    lidGroup.add(lidMesh);

    const packMat1 = new THREE.MeshStandardMaterial({ color: 0x00b4ac, roughness: 0.3 });
    const packMat2 = new THREE.MeshStandardMaterial({ color: 0xe07b20, roughness: 0.3 });
    const packMat3 = new THREE.MeshStandardMaterial({ color: 0xe52b32, roughness: 0.3 });

    const packGeo = new THREE.BoxGeometry(0.85, 0.55, 0.95);
    const mats = [packMat1, packMat2, packMat3];
    [-0.95, 0, 0.95].forEach((px, idx) => {
      const pMesh = new THREE.Mesh(packGeo, mats[idx % mats.length]);
      pMesh.position.set(px, boxH * 0.45, 0);
      boxGroup.add(pMesh);
    });

    const floorGeo = new THREE.PlaneGeometry(6, 5);
    const floorCanvas = document.createElement('canvas');
    floorCanvas.width = 256;
    floorCanvas.height = 256;
    const fCtx = floorCanvas.getContext('2d');
    const fGrad = fCtx.createRadialGradient(128, 128, 20, 128, 128, 120);
    fGrad.addColorStop(0, 'rgba(0,0,0,0.85)');
    fGrad.addColorStop(0.5, 'rgba(217, 183, 121, 0.15)');
    fGrad.addColorStop(1, 'rgba(0,0,0,0)');
    fCtx.fillStyle = fGrad;
    fCtx.fillRect(0, 0, 256, 256);
    const floor = new THREE.Mesh(
      floorGeo,
      new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(floorCanvas),
        transparent: true,
        opacity: 0.75,
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0.01;
    boxGroup.add(floor);

    const observer = new IntersectionObserver(([entry]) => {
      s.isVisible = entry.isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(container);

    let lastTime = performance.now();

    const animate = () => {
      s.animFrameId = requestAnimationFrame(animate);
      if (!s.isVisible) return;

      const now = performance.now();
      const delta = Math.min((now - lastTime) * 0.001, 0.1);
      lastTime = now;
      s.elapsedReveal += delta;

      if (s.elapsedReveal > 1.2) {
        s.targetLidAngle = 2.0;
        if (!hasRevealed && s.elapsedReveal > 4.0) {
          setHasRevealed(true);
        }
      }

      s.lidAngle += (s.targetLidAngle - s.lidAngle) * 0.05;
      if (s.lidGroup) {
        s.lidGroup.rotation.x = -s.lidAngle;
      }

      if (motionEnabled) {
        boxGroup.position.y = -0.2 + Math.sin(s.elapsedReveal * 1.2) * 0.02;
        boxGroup.rotation.y = Math.sin(s.elapsedReveal * 0.7) * 0.03;
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
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      if (s.animFrameId) cancelAnimationFrame(s.animFrameId);
      if (renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [motionEnabled]);

  return (
    <div className={`relative w-full h-full select-none ${className}`}>
      <div
        className="w-full h-[320px] md:h-[400px] rounded-3xl overflow-hidden relative"
        style={{
          background: 'radial-gradient(ellipse at 50% 65%, #18181c 0%, #080809 75%)',
        }}
        aria-label="CGI Gifting Box Reveal Film"
      >
        {/* Dedicated Three.js canvas mount */}
        <div ref={mountRef} className="absolute inset-0 w-full h-full pointer-events-none" />

        {/* Replay Control */}
        <div className="absolute bottom-4 right-4 z-20 pointer-events-auto">
          <button
            onClick={handleReplay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#141416]/85 hover:bg-[#141416] text-[#B7B5B0] hover:text-[#F6F3ED] text-xs font-semibold uppercase tracking-wider backdrop-blur-md border border-white/10 transition-all shadow-lg"
            title="Replay Gifting Box Reveal"
          >
            <RotateCcw size={12} className="text-[#D9B779]" />
            <span>Replay Reveal</span>
          </button>
        </div>

        {/* Badge */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none">
          <span
            className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5"
            style={{
              background: 'rgba(20,20,22,0.85)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(217, 183, 121, 0.3)',
              color: '#D9B779',
            }}
          >
            <Gift size={12} className="text-[#E52B32]" />
            V04 Reveal Film
          </span>
        </div>
      </div>
    </div>
  );
}
