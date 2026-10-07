import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useMotionStore } from '../../store/motionStore';

function createClosingPackGeo() {
  const geo = new THREE.BoxGeometry(1.2, 1.7, 0.32, 16, 20, 4);
  const pos = geo.attributes.position;
  const halfH = 1.7 / 2;
  const halfW = 1.2 / 2;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    let z = pos.getZ(i);

    const normY = y / halfH;
    const absNormY = Math.abs(normY);
    const normX = x / halfW;

    if (absNormY > 0.82) {
      z *= 0.18;
    } else {
      const belly = Math.cos(normX * Math.PI * 0.5) * Math.cos((normY / 0.82) * Math.PI * 0.5) * 0.16;
      if (z > 0) z += belly;
      else if (z < 0) z -= belly;
    }
    pos.setXYZ(i, x, y, z);
  }
  geo.computeVertexNormals();
  return geo;
}

export default function ClosingSceneCanvas({ className = '' }) {
  const mountRef = useRef(null);
  const { motionEnabled } = useMotionStore();

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 550;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 5.0);
    camera.lookAt(0, 0, 0);

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

    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const goldRim = new THREE.DirectionalLight(0xd9b779, 3.2);
    goldRim.position.set(3, 4, 3);
    scene.add(goldRim);

    const redHalo = new THREE.PointLight(0xe52b32, 2.8, 6);
    redHalo.position.set(0, -0.5, -1.8);
    scene.add(redHalo);

    const boxGroup = new THREE.Group();
    boxGroup.position.set(0, -0.6, 0);
    scene.add(boxGroup);

    const boxMat = new THREE.MeshStandardMaterial({
      color: 0x161619,
      roughness: 0.6,
      metalness: 0.15,
    });
    const boxMesh = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 0.9, 2.0),
      boxMat
    );
    boxMesh.position.y = 0.45;
    boxGroup.add(boxMesh);

    const packGeo = createClosingPackGeo();
    const loader = new THREE.TextureLoader();

    const packImages = [
      '/products/peri-desi.jpg',
      '/products/cream-n-onion.jpg',
      '/products/punjabi-tadka.jpg',
    ];
    const xPositions = [-1.05, 0, 1.05];
    const rotations = [-0.1, 0, 0.1];
    const packs = [];

    packImages.forEach((src, idx) => {
      const mat = new THREE.MeshStandardMaterial({
        roughness: 0.3,
        metalness: 0.15,
      });
      loader.load(src, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        mat.map = tex;
        mat.needsUpdate = true;
      });

      const sideMat = new THREE.MeshStandardMaterial({ color: 0x1c1c20 });
      const pMesh = new THREE.Mesh(packGeo, [
        sideMat, sideMat, sideMat, sideMat, mat, sideMat
      ]);
      pMesh.position.set(xPositions[idx], 0.9, 0.1);
      pMesh.rotation.y = rotations[idx];
      pMesh.rotation.x = 0.15;
      boxGroup.add(pMesh);
      packs.push(pMesh);
    });

    const floorGeo = new THREE.PlaneGeometry(6, 4);
    const floorCanvas = document.createElement('canvas');
    floorCanvas.width = 256;
    floorCanvas.height = 256;
    const fCtx = floorCanvas.getContext('2d');
    const fGrad = fCtx.createRadialGradient(128, 128, 20, 128, 128, 120);
    fGrad.addColorStop(0, 'rgba(229,43,50,0.25)');
    fGrad.addColorStop(0.5, 'rgba(217,183,121,0.12)');
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

    let animId;
    let startTime = performance.now();
    let isVisible = true;

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(container);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const now = performance.now();
      const time = (now - startTime) * 0.001;

      if (motionEnabled) {
        packs.forEach((p, idx) => {
          p.position.y = 0.9 + Math.sin(time * 1.1 + idx) * 0.025;
        });
        boxGroup.rotation.y = Math.sin(time * 0.8) * 0.025;
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
      cancelAnimationFrame(animId);
      if (renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      packGeo.dispose();
      renderer.dispose();
    };
  }, [motionEnabled]);

  return (
    <div
      ref={mountRef}
      className={`w-full h-[320px] md:h-[420px] rounded-3xl overflow-hidden relative ${className}`}
      aria-label="V07 Closing Composition: three flavour packs presented inside the Naastha box under studio lighting"
    />
  );
}
