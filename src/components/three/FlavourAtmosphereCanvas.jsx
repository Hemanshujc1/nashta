import React, { useEffect, useRef } from 'react';
import { useMotionStore } from '../../store/motionStore';

const FLAVOUR_PARTICLES = {
  'cream-n-onion': {
    primary: '#00B4AC',
    secondary: '#FFFFFF',
    ambient: 'rgba(0, 180, 172, 0.12)',
    particleTypes: ['herb', 'orb', 'fleck'],
  },
  'manchurian': {
    primary: '#8B5A2B',
    secondary: '#D4A373',
    ambient: 'rgba(139, 90, 43, 0.14)',
    particleTypes: ['garlic', 'ginger', 'orb'],
  },
  'punjabi-tadka': {
    primary: '#E07B20',
    secondary: '#2E8B42',
    ambient: 'rgba(224, 123, 32, 0.14)',
    particleTypes: ['cumin', 'chili', 'fleck'],
  },
  'pizza': {
    primary: '#E8A90C',
    secondary: '#E52B32',
    ambient: 'rgba(232, 169, 12, 0.14)',
    particleTypes: ['oregano', 'herb', 'orb'],
  },
  'peri-desi': {
    primary: '#E52B32',
    secondary: '#FF7B00',
    ambient: 'rgba(229, 43, 50, 0.16)',
    particleTypes: ['chili', 'ember', 'fleck'],
  },
  'methi-oregano': {
    primary: '#2E8B42',
    secondary: '#D9B779',
    ambient: 'rgba(46, 139, 66, 0.14)',
    particleTypes: ['methi-leaf', 'herb', 'orb'],
  },
};

export default function FlavourAtmosphereCanvas({ flavourId, className = '' }) {
  const canvasRef = useRef(null);
  const { motionEnabled } = useMotionStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let isVisible = true;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 600;
      canvas.height = canvas.parentElement?.clientHeight || 500;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particle pool around outer edges, keeping centre 55% dark and clear for the 3D pack
    const particleCount = 28;
    const particles = [];
    const config = FLAVOUR_PARTICLES[flavourId] || FLAVOUR_PARTICLES['cream-n-onion'];

    for (let i = 0; i < particleCount; i++) {
      // Pick position outside central 50%
      const isLeft = Math.random() < 0.5;
      const x = isLeft
        ? Math.random() * (canvas.width * 0.28)
        : canvas.width * 0.72 + Math.random() * (canvas.width * 0.28);
      const y = Math.random() * canvas.height;

      particles.push({
        x,
        y,
        baseX: x,
        baseY: y,
        size: Math.random() * 4.5 + 1.5,
        depth: Math.random() * 0.8 + 0.2, // Depth factor
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.15 - Math.random() * 0.35,
        alpha: Math.random() * 0.5 + 0.2,
        phase: Math.random() * Math.PI * 2,
        isSecondary: Math.random() < 0.3,
      });
    }

    // Intersection observer
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(canvas);

    let time = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      if (!isVisible) return;

      time += 0.015;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const currentConfig = FLAVOUR_PARTICLES[flavourId] || config;

      // Soft outer edge atmospheric lighting gradients
      // Left edge glow
      const leftGlow = ctx.createRadialGradient(
        0, canvas.height * 0.5, 20,
        0, canvas.height * 0.5, canvas.width * 0.45
      );
      leftGlow.addColorStop(0, currentConfig.ambient);
      leftGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = leftGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Right edge glow
      const rightGlow = ctx.createRadialGradient(
        canvas.width, canvas.height * 0.5, 20,
        canvas.width, canvas.height * 0.5, canvas.width * 0.45
      );
      rightGlow.addColorStop(0, currentConfig.ambient);
      rightGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rightGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render floating particles
      particles.forEach((p) => {
        if (motionEnabled) {
          p.y += p.vy * p.depth;
          p.x += Math.sin(time + p.phase) * 0.35;

          // Wrap around top/bottom
          if (p.y < -20) {
            p.y = canvas.height + 15;
            p.x = p.baseX + (Math.random() - 0.5) * 40;
          }
        }

        const color = p.isSecondary ? currentConfig.secondary : currentConfig.primary;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.depth, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = p.alpha * (0.6 + Math.sin(time * 2 + p.phase) * 0.4) * p.depth;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10 * p.depth;
        ctx.fill();
        ctx.restore();
      });
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      observer.disconnect();
      cancelAnimationFrame(animId);
    };
  }, [flavourId, motionEnabled]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${className}`}
      aria-hidden="true"
    />
  );
}
