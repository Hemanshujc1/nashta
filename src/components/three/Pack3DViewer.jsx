import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useMotionStore } from "../../store/motionStore";
import {
  useWebGLSlot,
  applyCrop,
  disposeScene,
  softBlobTexture,
  MAX_PIXEL_RATIO,
} from "../../lib/webgl";

// Creates custom realistic pouch geometry with pillow bulge and crimped sealed ends
function createPouchGeometry() {
  const width = 1.9;
  const height = 2.7;
  const depth = 0.42;
  const segW = 28;
  const segH = 36;
  const segD = 8;

  const geo = new THREE.BoxGeometry(width, height, depth, segW, segH, segD);
  const pos = geo.attributes.position;
  const halfH = height / 2;
  const halfW = width / 2;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    let z = pos.getZ(i);

    const normY = y / halfH; // -1 to 1
    const absNormY = Math.abs(normY);
    const normX = x / halfW; // -1 to 1

    if (absNormY > 0.84) {
      // Crimped seal area at top & bottom
      const crimpFactor = (absNormY - 0.84) / 0.16;
      // Flatten depth
      z *= Math.max(0.12, 1 - crimpFactor * 0.88);
      // Subtle corrugated crinkle in foil
      z += Math.sin(normX * 45) * 0.015 * crimpFactor;
    } else {
      // Main pillow belly
      const bellyX = Math.cos(normX * Math.PI * 0.5);
      const bellyY = Math.cos((normY / 0.84) * Math.PI * 0.5);
      const bulge = bellyX * bellyY * 0.28;

      if (z > 0) {
        z += bulge;
      } else if (z < 0) {
        z -= bulge;
      }
    }

    pos.setXYZ(i, x, y, z);
  }

  geo.computeVertexNormals();
  return geo;
}

// Generate realistic foil back texture for the rear face
function createFoilBackTexture(accentColor) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 720;
  const ctx = canvas.getContext("2d");

  // Deep matte foil gradient
  const grad = ctx.createLinearGradient(0, 0, 512, 720);
  grad.addColorStop(0, "#1c1c1f");
  grad.addColorStop(0.5, "#26262b");
  grad.addColorStop(1, "#151517");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 720);

  // Subtle metallic texture lines
  ctx.fillStyle = "rgba(255,255,255,0.03)";
  for (let y = 0; y < 720; y += 4) {
    ctx.fillRect(0, y, 512, 1.5);
  }

  // Top crimp band
  ctx.fillStyle = "rgba(255,255,255,0.07)";
  ctx.fillRect(0, 0, 512, 50);
  ctx.fillRect(0, 670, 512, 50);

  // Brand logo text
  ctx.fillStyle = "#E52B32";
  ctx.font = "bold 36px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("NAASTHA", 256, 120);

  ctx.fillStyle = "#F6F3ED";
  ctx.font = "bold 16px sans-serif";
  ctx.fillText("CRISP’IT SAVOURY SNACKS", 256, 150);

  // Nutrition panel mock
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.strokeRect(40, 190, 432, 220);

  ctx.fillStyle = accentColor || "#D9B779";
  ctx.font = "bold 14px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("NUTRITIONAL VALUES (PER 100g)", 60, 220);

  ctx.fillStyle = "#B7B5B0";
  ctx.font = "12px sans-serif";
  const facts = [
    "ENERGY ................. 428 kcal",
    "PROTEIN ................ 12.0 g",
    "TOTAL CARBOHYDRATES .... 64.0 g",
    "SUGAR (ADDED) .......... 0.0 g",
    "CHOLESTEROL ............ 0.0 mg",
    "TRANS FAT .............. 0.0 g",
    "OIL TYPE ............... Sunflower (No Palm Oil)",
  ];
  facts.forEach((f, idx) => {
    ctx.fillText(f, 60, 250 + idx * 22);
  });

  // Mock Barcode
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(60, 480, 200, 70);
  ctx.fillStyle = "#000000";
  for (let x = 70; x < 250; x += 5) {
    const w = x % 3 === 0 ? 3 : 1.5;
    ctx.fillRect(x, 490, w, 50);
  }

  // Authentic badge
  ctx.strokeStyle = "#E52B32";
  ctx.strokeRect(300, 480, 150, 70);
  ctx.fillStyle = "#E52B32";
  ctx.font = "bold 12px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("100% VEG", 375, 510);
  ctx.fillText("MADE WITH ATTA", 375, 530);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const TWIST = 0.35; // ~20deg
const HALF = 0.275; // s: twist out, then twist in = 550ms
const SWAY = 0.14; // ~8deg idle sway
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/**
 * G01 pack viewer. The pouch is textured with the pack cropped out of the flavour photo.
 * Flavour switch: the pack twists out ~20deg, swaps artwork while hidden, and twists back in (550ms).
 * Only the latest requested flavour is ever applied, so rapid switching cannot queue up or desync.
 * The renderer exists only while this stage owns the page's WebGL slot; a snapshot stands in otherwise.
 */
export default function Pack3DViewer({
  flavour,
  className = "",
  stageClassName = "h-[380px] md:h-[460px]",
  bare = false,
}) {
  const stageRef = useRef(null);
  const mountRef = useRef(null);
  const motionEnabled = useMotionStore((s) => s.motionEnabled);
  const active = useWebGLSlot(stageRef);

  const [loaded, setLoaded] = useState(false);
  const [snapshot, setSnapshot] = useState(null);

  const live = useRef({
    wanted: flavour,
    motion: motionEnabled,
    dragging: false,
    px: 0,
    py: 0,
    targetY: 0,
    targetX: 0,
    hasSnapshot: false,
  });

  useEffect(() => {
    live.current.wanted = flavour;
    live.current.targetY = 0;
    live.current.targetX = 0;
  }, [flavour]);

  useEffect(() => {
    live.current.motion = motionEnabled;
  }, [motionEnabled]);

  useEffect(() => {
    if (!active) return undefined;
    const container = mountRef.current;
    const s = live.current;
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 460;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.8);
    keyLight.position.set(3.2, 4.0, 4.0);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xe2e8f0, 1.2);
    fillLight.position.set(-3.0, -1.5, 3.0);
    scene.add(fillLight);
    const rimLight = new THREE.DirectionalLight(0xd9b779, 3.2);
    rimLight.position.set(2.5, 2.0, -3.5);
    scene.add(rimLight);

    // contact shadow
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 6),
      new THREE.MeshBasicMaterial({
        map: softBlobTexture([
          [0, "rgba(0,0,0,0.7)"],
          [0.6, "rgba(0,0,0,0.25)"],
          [1, "rgba(0,0,0,0)"],
        ]),
        transparent: true,
        opacity: 0.65,
        depthWrite: false,
      }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.52;
    scene.add(floor);

    const sideMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1d,
      roughness: 0.4,
      metalness: 0.25,
      transparent: true,
    });
    const backMat = new THREE.MeshStandardMaterial({
      roughness: 0.38,
      metalness: 0.22,
      transparent: true,
    });
    const frontMat = new THREE.MeshStandardMaterial({
      roughness: 0.28,
      metalness: 0.16,
      transparent: true,
    });
    const pack = new THREE.Mesh(createPouchGeometry(), [
      sideMat,
      sideMat,
      sideMat,
      sideMat,
      frontMat,
      backMat,
    ]);
    pack.position.y = 0.05;
    scene.add(pack);

    // artwork cache: one texture per flavour photo, loaded on demand
    const loader = new THREE.TextureLoader();
    const textures = new Map();
    const loading = new Set();
    let disposed = false;
    const request = (f) => {
      if (textures.has(f.img) || loading.has(f.img)) return;
      loading.add(f.img);
      loader.load(f.img, (tex) => {
        if (disposed) {
          tex.dispose();
          return;
        }
        tex.colorSpace = THREE.SRGBColorSpace;
        textures.set(f.img, applyCrop(tex, f.crop));
      });
    };

    let shown = null; // id of the flavour currently on the pouch
    let vis = 0; // 0 hidden .. 1 fully presented
    let side = -1; // which way the pack is turned while not fully presented
    let rotY = 0;
    let rotX = 0;

    const show = (f) => {
      frontMat.map = textures.get(f.img);
      frontMat.needsUpdate = true;
      backMat.map?.dispose();
      backMat.map = createFoilBackTexture(f.accent || f.packColor);
      backMat.needsUpdate = true;
      rimLight.color.set(f.accent || "#D9B779");
      shown = f.id;
      side = -1;
      if (s.hasSnapshot || !s.motion) vis = 1; // resuming behind a snapshot: no intro
      s.hasSnapshot = false;
      setSnapshot(null);
      setLoaded(true);
    };

    let raf;
    let last = performance.now();
    let onScreen = true;
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
    });
    io.observe(container);

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const now = performance.now();
      const delta = Math.min((now - last) * 0.001, 0.1);
      last = now;
      if (!onScreen) return;

      const want = s.wanted;
      if (want && shown !== want.id) {
        request(want);
        vis = shown === null || !s.motion ? 0 : Math.max(0, vis - delta / HALF);
        if (vis === 0 && textures.has(want.img)) show(want);
      } else if (vis < 1) {
        vis = s.motion ? Math.min(1, vis + delta / HALF) : 1;
        if (vis === 1) side = 1;
      }

      const e = ease(vis);
      const time = now * 0.001;
      const idle = s.motion && !s.dragging;
      rotY += (s.targetY - rotY) * 0.09;
      rotX += (s.targetX - rotX) * 0.09;
      pack.rotation.y =
        rotY +
        side * (1 - e) * TWIST +
        (idle ? Math.sin(time * 1.1) * SWAY : 0);
      pack.rotation.x = rotX + (idle ? Math.cos(time * 0.9) * 0.04 : 0);
      pack.position.y = 0.05 + (idle ? Math.sin(time * 1.6) * 0.05 : 0);
      pack.scale.setScalar(0.94 + 0.06 * e);
      sideMat.opacity = e;
      backMat.opacity = e;
      frontMat.opacity = e;
      floor.material.opacity = 0.65 * e;

      renderer.render(scene, camera);
    };
    frame();

    const ro = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(container);

    return () => {
      // keep the last frame on screen while another stage holds the WebGL slot
      if (shown) {
        renderer.render(scene, camera);
        s.hasSnapshot = true;
        setSnapshot(renderer.domElement.toDataURL("image/webp", 0.9));
      }
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      textures.forEach((tex) => tex.dispose());
      disposeScene(scene, renderer);
      renderer.domElement.remove();
    };
  }, [active]);

  const onPointerDown = (e) => {
    const s = live.current;
    s.dragging = true;
    s.px = e.clientX;
    s.py = e.clientY;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    const s = live.current;
    if (!s.dragging) return;
    s.targetY += (e.clientX - s.px) * 0.012;
    s.targetX = Math.max(
      -0.6,
      Math.min(0.6, s.targetX + (e.clientY - s.py) * 0.008),
    );
    s.px = e.clientX;
    s.py = e.clientY;
  };

  const onPointerUp = () => {
    live.current.dragging = false;
  };

  return (
    <div className={`relative select-none ${className}`}>
      <div
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        data-cursor="Drag"
        className={`w-full relative overflow-hidden ${stageClassName} ${bare ? "" : "rounded-3xl"} cursor-grab active:cursor-grabbing`}
        style={{
          touchAction: "none",
          background: bare
            ? undefined
            : "radial-gradient(ellipse at 50% 60%, rgba(20,20,22,0.8) 0%, rgba(7,7,8,0.95) 70%)",
        }}
        aria-label={`3D ${flavour?.name ?? ""} pack. Drag to rotate.`}
        role="group"
      >
        {snapshot && (
          <img
            src={snapshot}
            alt=""
            className="absolute inset-0 w-full h-full"
          />
        )}
        <div ref={mountRef} className="absolute inset-0 pointer-events-none" />

        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[#B7B5B0] text-xs font-semibold uppercase tracking-widest">
            Loading pack…
          </div>
        )}
      </div>
    </div>
  );
}
