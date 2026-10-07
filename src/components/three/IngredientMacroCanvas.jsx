import React, { useEffect, useRef } from 'react';
import { useMotionStore } from '../../store/motionStore';

export default function IngredientMacroCanvas({ className = '' }) {
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
      canvas.width = canvas.parentElement?.clientWidth || 500;
      canvas.height = canvas.parentElement?.clientHeight || 450;
    };
    resize();
    window.addEventListener('resize', resize);

    // Micro-particles simulating floating ground spices & golden atta dust
    const dustCount = 35;
    const dust = [];
    for (let i = 0; i < dustCount; i++) {
      dust.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2.5 + 0.8,
        vy: -0.12 - Math.random() * 0.2,
        vx: (Math.random() - 0.5) * 0.15,
        alpha: Math.random() * 0.6 + 0.2,
        color: Math.random() > 0.4 ? '#D9B779' : '#E52B32',
      });
    }

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

      // 1. Moving warm macro side-light sweep
      const sweepX = (Math.sin(time * 0.8) * 0.35 + 0.5) * canvas.width;
      const sweepY = (Math.cos(time * 0.5) * 0.2 + 0.4) * canvas.height;

      const lightGrad = ctx.createRadialGradient(
        sweepX, sweepY, 20,
        sweepX, sweepY, canvas.width * 0.6
      );
      lightGrad.addColorStop(0, 'rgba(217, 183, 121, 0.22)');
      lightGrad.addColorStop(0.5, 'rgba(229, 43, 50, 0.08)');
      lightGrad.addColorStop(1, 'rgba(7, 7, 8, 0)');

      ctx.fillStyle = lightGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Macro Pore Shimmer Grid (representing textured whole-wheat pores)
      const poreCount = 18;
      for (let i = 0; i < poreCount; i++) {
        const px = (i % 6) * (canvas.width / 5) + 30;
        const py = Math.floor(i / 6) * (canvas.height / 3) + 40;
        const shimmer = Math.sin(time * 1.5 + i) * 0.5 + 0.5;

        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(217, 183, 121, ${0.15 + shimmer * 0.25})`;
        ctx.shadowColor = '#D9B779';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }

      // 3. Render floating spices
      dust.forEach((d) => {
        if (motionEnabled) {
          d.y += d.vy;
          d.x += d.vx;
          if (d.y < -10) {
            d.y = canvas.height + 10;
            d.x = Math.random() * canvas.width;
          }
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = d.color;
        ctx.globalAlpha = d.alpha * (0.6 + Math.sin(time + d.r) * 0.4);
        ctx.shadowColor = d.color;
        ctx.shadowBlur = 6;
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
  }, [motionEnabled]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
