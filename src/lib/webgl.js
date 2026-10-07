import { useEffect, useState } from 'react';
import * as THREE from 'three';

// PRD v3 §7: one WebGL canvas active at a time. Every 3D stage registers here and the one with the
// most pixels on screen owns the slot; the others drop their renderer until they win it back.
const stages = new Map();
let owner = null;

const arbitrate = () => {
  let best = null;
  stages.forEach((stage, key) => {
    if (stage.px > 0 && (!best || stage.px > stages.get(best).px)) best = key;
  });
  // keep the current owner unless another stage is clearly more visible (avoids flip-flopping)
  const held = owner && stages.get(owner);
  if (held && held.px > 0 && best !== owner && stages.get(best).px < held.px * 1.25) best = owner;
  owner = best;
  stages.forEach((stage, key) => stage.set(key === owner));
};

// `target` is a ref or an element.
export function useWebGLSlot(target) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = target && 'current' in target ? target.current : target;
    if (!el) return undefined;
    const key = {};
    const stage = { px: 0, set: setActive };
    stages.set(key, stage);
    const io = new IntersectionObserver(
      ([entry]) => {
        stage.px = entry.isIntersecting ? entry.intersectionRect.width * entry.intersectionRect.height : 0;
        arbitrate();
      },
      { threshold: Array.from({ length: 11 }, (_, i) => i / 10) }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stages.delete(key);
      if (owner === key) owner = null;
      arbitrate();
    };
  }, [target]);

  return active;
}

export const MAX_PIXEL_RATIO = 2;

// Show only the pack inside a product photo. crop = [left, top, right, bottom] in 0-1 image space.
export const applyCrop = (texture, crop) => {
  if (!crop) return texture;
  const [l, t, r, b] = crop;
  texture.offset.set(l, 1 - b);
  texture.repeat.set(r - l, b - t);
  return texture;
};

// Free every geometry, material and texture under a scene, then the renderer and its GL context.
export const disposeScene = (scene, renderer) => {
  scene.traverse((obj) => {
    obj.geometry?.dispose();
    const mats = Array.isArray(obj.material) ? obj.material : obj.material ? [obj.material] : [];
    mats.forEach((m) => {
      m.map?.dispose();
      m.dispose();
    });
  });
  renderer.dispose();
  renderer.forceContextLoss();
};

export const softBlobTexture = (stops) => {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 6, 64, 64, 62);
  stops.forEach(([at, colour]) => g.addColorStop(at, colour));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
};
