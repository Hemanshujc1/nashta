import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useMotionStore } from '../../store/motionStore';
import { useWebGLSlot, applyCrop, disposeScene, softBlobTexture, MAX_PIXEL_RATIO } from '../../lib/webgl';

const ARC = 0.65; // s: pack flight into its slot
const SWEEP = 0.7; // s: light sweep after the third pack lands
const LID_OPEN = 1.95; // rad, lid thrown back
const LID_SETTLED = 1.3; // rad, lid resting in its presenting pose
const SLOT_X = [-1.1, 0, 1.1];
const BOX = { w: 3.6, h: 0.5, d: 1.9, wall: 0.06 };
const REST = { y: 0.28, z: 0, tilt: -Math.PI / 2 + 0.1 }; // packs lie face-up in the box

// Pouch for the packs in the box
function createMiniPouchGeometry() {
  const width = 0.92;
  const height = 1.35;
  const depth = 0.2;
  const geo = new THREE.BoxGeometry(width, height, depth, 16, 20, 6);
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

    if (absNormY > 0.82) {
      z *= 0.2; // crimped end
    } else {
      const bulge = Math.cos(normX * Math.PI * 0.5) * Math.cos((normY / 0.82) * Math.PI * 0.5) * 0.1;
      if (z > 0) z += bulge;
      else if (z < 0) z -= bulge;
    }
    pos.setXYZ(i, x, y, z);
  }
  geo.computeVertexNormals();
  return geo;
}

function slotMarkerTexture() {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 188;
  const ctx = c.getContext('2d');
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 3;
  ctx.setLineDash([9, 9]);
  ctx.strokeRect(6, 6, 116, 176);
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = 'bold 34px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('+', 64, 94);
  return new THREE.CanvasTexture(c);
}

const LOGO_SRC = '/nashta-logo.png';

// Paints the brand logo onto a canvas texture once it has loaded.
function drawLogo(tex, x, y, size) {
  const img = new Image();
  img.onload = () => {
    tex.image.getContext('2d').drawImage(img, x, y, size, size);
    tex.needsUpdate = true;
  };
  img.src = LOGO_SRC;
}

function createLidTopTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 540;
  const ctx = canvas.getContext('2d');

  // Deep premium matte charcoal finish
  ctx.fillStyle = '#1c1c20';
  ctx.fillRect(0, 0, 1024, 540);

  // Subtle luxury gold border frame
  ctx.strokeStyle = 'rgba(217, 183, 121, 0.45)';
  ctx.lineWidth = 5;
  ctx.strokeRect(36, 36, 952, 468);

  // Ornate gold corner notches
  ctx.strokeStyle = '#D9B779';
  ctx.lineWidth = 7;
  ctx.beginPath(); ctx.moveTo(32, 75); ctx.lineTo(32, 32); ctx.lineTo(75, 32); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(949, 32); ctx.lineTo(992, 32); ctx.lineTo(992, 75); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(32, 465); ctx.lineTo(32, 508); ctx.lineTo(75, 508); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(949, 508); ctx.lineTo(992, 508); ctx.lineTo(992, 465); ctx.stroke();

  // Bold NAASTHA wordmark in vibrant metallic gold
  ctx.fillStyle = '#D9B779';
  ctx.font = '900 84px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('NAASTHA', 340, 230);

  // Red accent line
  ctx.fillStyle = '#E52B32';
  ctx.fillRect(260, 292, 160, 4);

  // Subtitle
  ctx.fillStyle = '#F6F3ED';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('SAVOURY SNACKS · THREE-PACK BOX', 340, 335);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  drawLogo(tex, 620, 90, 360);
  return tex;
}

function createBoxFrontTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#1c1c20';
  ctx.fillRect(0, 0, 1024, 160);

  ctx.strokeStyle = 'rgba(217, 183, 121, 0.3)';
  ctx.lineWidth = 3;
  ctx.strokeRect(16, 16, 992, 128);

  ctx.fillStyle = '#D9B779';
  ctx.font = '900 52px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('NAASTHA', 440, 80);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  drawLogo(tex, 700, 6, 148);
  return tex;
}

const outCubic = (t) => 1 - Math.pow(1 - t, 3);
const bezier = (a, b, c, t) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;
const BTN =
  'min-h-11 px-4 rounded-full text-xs font-bold uppercase tracking-wider bg-[#141416]/90 text-[#F6F3ED] border border-white/15 hover:bg-white/10 transition-colors backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white';

/**
 * G02 box viewer. Each new flavour arcs into its slot (650ms) and a contact shadow grows under it as it
 * lands. The third pack triggers a light sweep, then the lid automatically closes to present the branded box.
 */
export default function Box3DViewer({ selectedFlavours = [], className = '', bare = false, stageClassName = 'h-[330px] md:h-[370px]' }) {
  const stageRef = useRef(null);
  const mountRef = useRef(null);
  const motionEnabled = useMotionStore((s) => s.motionEnabled);
  const active = useWebGLSlot(stageRef);
  const [lidClosed, setLidClosed] = useState(false);
  const [snapshot, setSnapshot] = useState(null);

  const live = useRef({ box: selectedFlavours, motion: motionEnabled, lidClosed: false, hasSnapshot: false });

  useEffect(() => {
    live.current.box = selectedFlavours;
  }, [selectedFlavours]);

  useEffect(() => {
    live.current.motion = motionEnabled;
  }, [motionEnabled]);

  useEffect(() => {
    live.current.lidClosed = lidClosed;
  }, [lidClosed]);

  const full = selectedFlavours.length === SLOT_X.length;
  // Automatically close lid when all 3 slots are filled; open when fewer
  useEffect(() => {
    if (full) {
      const timer = setTimeout(() => {
        setLidClosed(true);
      }, 1300);
      return () => clearTimeout(timer);
    } else {
      setLidClosed(false);
    }
  }, [full]);

  useEffect(() => {
    if (!active) return undefined;
    const container = mountRef.current;
    const s = live.current;
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 340;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    // Extents the camera must keep in frame: the box body, plus the raised lid while it is open.
    const hw = BOX.w / 2 + 0.05;
    const hd = BOX.d / 2;
    const bodyPts = [];
    [-hw, hw].forEach((x) => [0, BOX.h].forEach((y) => [-hd, hd].forEach((z) => bodyPts.push(new THREE.Vector3(x, y, z)))));
    const lidTip = (angle) => new THREE.Vector3(0, BOX.h + BOX.d * Math.sin(angle), -hd + BOX.d * Math.cos(angle));
    const tipOpen = lidTip(LID_OPEN);
    const tipSettled = lidTip(LID_SETTLED);
    const lidTipY = Math.max(tipOpen.y, tipSettled.y);
    const openPts = [...bodyPts];
    [-hw, hw].forEach((x) => [tipOpen, tipSettled].forEach((tip) => openPts.push(new THREE.Vector3(x, tip.y, tip.z))));
    const camDir = new THREE.Vector3(0, 3.4, 4.0).normalize();
    const camTargetOpen = new THREE.Vector3(0, lidTipY / 2, -0.2);
    const camTargetClosed = new THREE.Vector3(0, 0.25, 0);
    const fitMargin = 0.88; // fraction of the half-viewport the extents may occupy
    const ndc = new THREE.Vector3();
    const fitDistance = (pts, target) => {
      let lo = 2;
      let hi = 40;
      for (let i = 0; i < 20; i++) {
        const mid = (lo + hi) / 2;
        camera.position.copy(target).addScaledVector(camDir, mid);
        camera.lookAt(target);
        camera.updateMatrixWorld(true);
        const fits = pts.every((p) => {
          ndc.copy(p).project(camera);
          return Math.abs(ndc.x) <= fitMargin && Math.abs(ndc.y) <= fitMargin;
        });
        if (fits) hi = mid;
        else lo = mid;
      }
      return hi;
    };
    let fitOpen = { dist: 5.5 };
    let fitClosed = { dist: 5.5 };
    const placeCamera = (lidT) => {
      // lidT 1 = lid raised, 0 = lid shut; blend framing so the box recentres as the lid closes
      const target = camTargetClosed.clone().lerp(camTargetOpen, lidT);
      const dist = fitClosed.dist + (fitOpen.dist - fitClosed.dist) * lidT;
      camera.position.copy(target).addScaledVector(camDir, dist);
      camera.lookAt(target);
    };
    const frameCamera = (aspect) => {
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      fitOpen = { dist: fitDistance(openPts, camTargetOpen) };
      fitClosed = { dist: fitDistance(bodyPts, camTargetClosed) };
      placeCamera(1);
    };
    frameCamera(width / height);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.0));
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.6);
    keyLight.position.set(2.5, 5, 3.5);
    scene.add(keyLight);
    const rim = new THREE.DirectionalLight(0xd9b779, 1.6);
    rim.position.set(-2.5, 3, -2.5);
    scene.add(rim);
    const sweepLight = new THREE.PointLight(0xfff0c0, 0, 5);
    sweepLight.position.set(-3, 1.4, 0.6);
    scene.add(sweepLight);

    const box = new THREE.Group();
    scene.add(box);

    const shell = new THREE.MeshStandardMaterial({ color: 0x2c2c33, roughness: 0.55, metalness: 0.2 });
    const lining = new THREE.MeshStandardMaterial({ color: 0x151518, roughness: 0.9 });
    const trimMat = new THREE.MeshStandardMaterial({ color: 0xe52b32, roughness: 0.35, metalness: 0.2 });
    const { w, h, d, wall } = BOX;
    const part = (gw, gh, gd, mat, x, y, z, parent = box) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(gw, gh, gd), mat);
      mesh.position.set(x, y, z);
      parent.add(mesh);
      return mesh;
    };
    part(w, wall, d, lining, 0, wall / 2, 0); // floor
    part(w, h, wall, shell, 0, h / 2, d / 2 - wall / 2); // front
    part(w, h, wall, shell, 0, h / 2, -d / 2 + wall / 2); // back
    part(wall, h, d, shell, -w / 2 + wall / 2, h / 2, 0);
    part(wall, h, d, shell, w / 2 - wall / 2, h / 2, 0);
    part(w + 0.02, 0.03, 0.03, trimMat, 0, h, d / 2 - wall / 2); // red lip on the front edge

    // Branded front plaque
    const frontTex = createBoxFrontTexture();
    const frontPlaqueMat = new THREE.MeshStandardMaterial({ map: frontTex, roughness: 0.45, metalness: 0.2 });
    const frontPlaque = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.2, h - 0.08), frontPlaqueMat);
    frontPlaque.position.set(0, h / 2, d / 2 + 0.002);
    box.add(frontPlaque);

    const lid = new THREE.Group(); // hinged along the back edge
    lid.position.set(0, h, -d / 2);
    box.add(lid);
    part(w, wall, d, shell, 0, wall / 2, d / 2, lid);
    const lidLining = new THREE.MeshStandardMaterial({ color: 0x8a1219, roughness: 0.75 });
    part(w - 0.16, 0.01, d - 0.16, lidLining, 0, -0.005, d / 2, lid); // red lining inside the lid

    // Branded top of the lid with gold NAASTHA logo
    const lidTopTex = createLidTopTexture();
    const lidTopMat = new THREE.MeshStandardMaterial({ map: lidTopTex, roughness: 0.45, metalness: 0.2 });
    const lidTopMesh = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.06, d - 0.06), lidTopMat);
    lidTopMesh.rotation.x = -Math.PI / 2;
    lidTopMesh.position.set(0, wall + 0.002, d / 2);
    lid.add(lidTopMesh);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(7, 5),
      new THREE.MeshBasicMaterial({
        map: softBlobTexture([[0, 'rgba(0,0,0,0.85)'], [0.5, 'rgba(0,0,0,0.3)'], [1, 'rgba(0,0,0,0)']]),
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
      })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    box.add(ground);

    const pouchGeo = createMiniPouchGeometry();
    const sideMat = new THREE.MeshStandardMaterial({ color: 0x1f1f23, roughness: 0.4 });
    const markerTex = slotMarkerTexture();
    const shadowTex = softBlobTexture([[0, 'rgba(0,0,0,0.9)'], [0.55, 'rgba(0,0,0,0.45)'], [1, 'rgba(0,0,0,0)']]);

    const slots = SLOT_X.map((x) => {
      const marker = new THREE.Mesh(
        new THREE.PlaneGeometry(0.86, 1.26),
        new THREE.MeshBasicMaterial({ map: markerTex, transparent: true, opacity: 0.45, depthWrite: false })
      );
      marker.rotation.x = -Math.PI / 2;
      marker.position.set(x, wall + 0.01, 0);
      box.add(marker);

      const shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(1.25, 1.7),
        new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, opacity: 0, depthWrite: false })
      );
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.set(x, wall + 0.02, 0);
      box.add(shadow);

      const front = new THREE.MeshStandardMaterial({ roughness: 0.3, metalness: 0.15 });
      const pack = new THREE.Mesh(pouchGeo, [sideMat, sideMat, sideMat, sideMat, front, sideMat]);
      pack.visible = false;
      box.add(pack);
      return { x, marker, shadow, front, pack, id: null, t: 1 };
    });

    const loader = new THREE.TextureLoader();
    const textures = new Map();
    let disposed = false;
    const paint = (slot, f) => {
      const cached = textures.get(f.img);
      if (cached) {
        slot.front.map = cached;
        slot.front.needsUpdate = true;
        return;
      }
      loader.load(f.img, (tex) => {
        if (disposed) {
          tex.dispose();
          return;
        }
        tex.colorSpace = THREE.SRGBColorSpace;
        textures.set(f.img, applyCrop(tex, f.crop));
        if (slot.id === f.id) {
          slot.front.map = tex;
          slot.front.needsUpdate = true;
        }
      });
    };

    let first = true; // first reconcile after (re)mount places packs without replaying their flight
    let sweepAt = Infinity; // when the light sweep starts
    let settled = false;
    let lidAngle = LID_OPEN;
    let wasFull = false;
    let raf;
    let last = performance.now();
    let clock = 0;
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
      clock += delta;

      // reconcile slots with the current selection
      const picks = s.box;
      slots.forEach((slot, i) => {
        const f = picks[i];
        if (f && slot.id !== f.id) {
          slot.id = f.id;
          slot.t = first || !s.motion ? 1 : 0;
          slot.pack.visible = true;
          slot.marker.visible = false;
          paint(slot, f);
        } else if (!f && slot.id) {
          slot.id = null;
          slot.pack.visible = false;
          slot.marker.visible = true;
          slot.shadow.material.opacity = 0;
        }
      });
      const isFull = picks.length === slots.length;
      if (isFull && !wasFull) {
        if (first || !s.motion) settled = true;
        else sweepAt = clock + ARC;
      } else if (!isFull) {
        settled = false;
        sweepAt = Infinity;
      }
      wasFull = isFull;
      first = false;

      // flight: from above and in front of the box, over the front wall, down into the slot
      slots.forEach((slot, i) => {
        if (!slot.id) return;
        slot.t = Math.min(1, slot.t + delta / ARC);
        const p = outCubic(slot.t);
        const fromX = slot.x * 1.5 + (i === 1 ? 0.5 : 0);
        slot.pack.position.set(
          bezier(fromX, slot.x, slot.x, p),
          bezier(2.6, 2.4, REST.y, p),
          bezier(2.2, 0.4, REST.z, p)
        );
        slot.pack.rotation.set(REST.tilt * p + -0.25 * (1 - p), 0, (1 - p) * (i === 0 ? 0.5 : -0.5));
        slot.shadow.material.opacity = 0.75 * p * p;
        slot.shadow.scale.setScalar(1.7 - 0.7 * p);
      });

      // third pick: light sweep, then the lid settles
      const sweep = (clock - sweepAt) / SWEEP;
      if (sweep >= 0 && sweep <= 1) {
        sweepLight.position.x = -3 + 6 * sweep;
        sweepLight.intensity = Math.sin(sweep * Math.PI) * 14;
        if (sweep > 0.55) settled = true;
      } else {
        sweepLight.intensity = 0;
      }
      const lidTarget = s.lidClosed ? 0 : settled ? LID_SETTLED : LID_OPEN;
      lidAngle += (lidTarget - lidAngle) * Math.min(1, delta * 5);
      lid.rotation.x = -lidAngle;
      placeCamera(Math.min(1, lidAngle / LID_SETTLED));

      if (s.motion) {
        box.position.y = Math.sin(clock * 1.2) * 0.02;
        box.rotation.y = Math.sin(clock * 0.8) * 0.035;
      }

      renderer.render(scene, camera);
      if (s.hasSnapshot) {
        s.hasSnapshot = false;
        setSnapshot(null);
      }
    };
    frame();

    const ro = new ResizeObserver(() => {
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      if (!cw || !ch) return;
      frameCamera(cw / ch);
      renderer.setSize(cw, ch);
    });
    ro.observe(container);

    return () => {
      // keep the last frame on screen while another stage holds the WebGL slot
      renderer.render(scene, camera);
      s.hasSnapshot = true;
      setSnapshot(renderer.domElement.toDataURL('image/webp', 0.9));
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      textures.forEach((tex) => tex.dispose());
      markerTex.dispose();
      shadowTex.dispose();
      disposeScene(scene, renderer);
      renderer.domElement.remove();
    };
  }, [active]);

  return (
    <div className={`relative select-none ${className}`}>
      <div
        ref={stageRef}
        className={`w-full relative ${bare ? '' : 'rounded-3xl overflow-hidden'} ${stageClassName}`}
        style={bare ? undefined : { background: 'radial-gradient(ellipse at 50% 65%, #18181c 0%, #080809 75%)' }}
        role="img"
        aria-label={`Your box: ${selectedFlavours.length ? selectedFlavours.map((f) => f.name).join(', ') : 'empty'}. ${selectedFlavours.length} of 3 packs.`}
      >
        {snapshot && <img src={snapshot} alt="" className="absolute inset-0 w-full h-full" />}
        <div ref={mountRef} className="absolute inset-0 pointer-events-none" />
      </div>

      {full && (
        <div className="absolute top-3 right-3 z-10">
          <button type="button" onClick={() => setLidClosed((v) => !v)} className={BTN} aria-pressed={lidClosed}>
            {lidClosed ? 'Open lid' : 'Close lid'}
          </button>
        </div>
      )}
    </div>
  );
}
