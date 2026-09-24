import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  type: 'sakura' | 'strawberry-leaf' | 'white-petal';
}

export const PetalCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Number of subtle petals
    const count = window.innerWidth < 768 ? 16 : 28;
    const petals: Petal[] = [];

    const types: ('sakura' | 'strawberry-leaf' | 'white-petal')[] = [
      'sakura',
      'white-petal',
      'sakura',
      'strawberry-leaf',
    ];

    for (let i = 0; i < count; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 8 + 7,
        speedY: Math.random() * 0.7 + 0.35,
        speedX: Math.random() * 0.5 - 0.25,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.2,
        opacity: Math.random() * 0.4 + 0.3,
        type: types[Math.floor(Math.random() * types.length)],
      });
    }

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;

      ctx.beginPath();
      if (p.type === 'sakura') {
        // Soft Pink Petal
        ctx.fillStyle = '#FDA4AF';
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-p.size / 2, -p.size, -p.size, -p.size / 2, 0, p.size);
        ctx.bezierCurveTo(p.size, -p.size / 2, p.size / 2, -p.size, 0, 0);
      } else if (p.type === 'white-petal') {
        // Soft Cream White Petal
        ctx.fillStyle = '#FFF5F7';
        ctx.shadowColor = 'rgba(244, 114, 182, 0.2)';
        ctx.shadowBlur = 4;
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-p.size / 2, -p.size * 0.9, -p.size * 0.8, -p.size / 2, 0, p.size * 0.9);
        ctx.bezierCurveTo(p.size * 0.8, -p.size / 2, p.size / 2, -p.size * 0.9, 0, 0);
      } else {
        // Strawberry Leaf / Calyx green
        ctx.fillStyle = '#A3E635';
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-p.size / 3, -p.size / 2, 0, -p.size);
        ctx.quadraticCurveTo(p.size / 3, -p.size / 2, 0, 0);
      }
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of petals) {
        p.y += p.speedY;
        p.x += Math.sin(p.y * 0.01) * 0.5 + p.speedX;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        drawPetal(p);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5,
      }}
      aria-hidden="true"
    />
  );
};
