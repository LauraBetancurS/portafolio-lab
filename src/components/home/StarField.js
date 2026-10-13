'use client';

import { useEffect, useRef } from 'react';

// ─── Ajustes ────────────────────────────────────────────────
// Colores de las estrellas (tomados del mockup)
const COLORS = ['#C9DB4B', '#E8603C', '#F2A2DC', '#A9D6F5', '#DB6A8C'];
const STAR_COUNT_DESKTOP = 16;
const STAR_COUNT_MOBILE = 9;
const MIN_SIZE = 14;          // radio exterior mínimo (px)
const MAX_SIZE = 26;          // radio exterior máximo (px)
const REPEL_RADIUS = 160;     // qué tan cerca debe estar el mouse para empujar
const REPEL_FORCE = 9;        // fuerza del empujón
const SPRING = 0.035;         // qué tan rápido vuelven a su lugar
const FRICTION = 0.88;        // freno (más cerca de 1 = se deslizan más)
// Zona central sin estrellas, para no tapar el título (porcentajes)
const SAFE_ZONE = { x1: 0.27, x2: 0.73, y1: 0.36, y2: 0.62 };
// ────────────────────────────────────────────────────────────

function drawStar(ctx, x, y, r, rotation, color) {
  const inner = r * 0.48;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? r : inner;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = color;
  ctx.lineWidth = r * 0.12; // puntas un poco redondeadas
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function createStars(width, height) {
  const count = width < 768 ? STAR_COUNT_MOBILE : STAR_COUNT_DESKTOP;
  const stars = [];
  let tries = 0;
  while (stars.length < count && tries < 2000) {
    tries++;
    const x = 40 + Math.random() * (width - 80);          // sin cortarse en los bordes
    const y = 130 + Math.random() * (height - 180);       // debajo del navbar
    const inSafeZone =
      x > width * SAFE_ZONE.x1 && x < width * SAFE_ZONE.x2 &&
      y > height * SAFE_ZONE.y1 && y < height * SAFE_ZONE.y2;
    if (inSafeZone) continue;
    // que no queden pegadas unas a otras
    if (stars.some(s => Math.hypot(s.homeX - x, s.homeY - y) < 90)) continue;
    stars.push({
      homeX: x,
      homeY: y,
      x,
      y,
      vx: 0,
      vy: 0,
      r: MIN_SIZE + Math.random() * (MAX_SIZE - MIN_SIZE),
      rotation: Math.random() * Math.PI,
      spin: 0,
      color: COLORS[stars.length % COLORS.length],
      floatPhase: Math.random() * Math.PI * 2,
      floatSpeed: 0.6 + Math.random() * 0.6,
      scale: 0, // para la animación de entrada
    });
  }
  return stars;
}

export default function StarField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mouse = { x: -9999, y: -9999 };
    let stars = [];
    let width = 0;
    let height = 0;
    let frame;
    let time = 0;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = createStars(width, height);
      if (reduceMotion) stars.forEach(s => (s.scale = 1));
    };

    // Posición del mouse relativa al canvas
    const onPointerMove = e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onPointerLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const tick = () => {
      time += 1 / 60;
      ctx.clearRect(0, 0, width, height);

      stars.forEach((s, i) => {
        // Entrada: aparecen una por una
        if (s.scale < 1) s.scale = Math.min(1, s.scale + 0.04 * (time > i * 0.05 ? 1 : 0));

        // Flotar suavecito alrededor de su casa
        const floatX = Math.sin(time * s.floatSpeed + s.floatPhase) * 4;
        const floatY = Math.cos(time * s.floatSpeed * 0.8 + s.floatPhase) * 6;
        const targetX = s.homeX + floatX;
        const targetY = s.homeY + floatY;

        // Repulsión del mouse
        const dx = s.x - mouse.x;
        const dy = s.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < REPEL_RADIUS && dist > 0.1) {
          const force = (1 - dist / REPEL_RADIUS) * REPEL_FORCE;
          s.vx += (dx / dist) * force;
          s.vy += (dy / dist) * force;
          s.spin += (dx > 0 ? 1 : -1) * force * 0.004; // giran al ser empujadas
        }

        // Resorte de vuelta a casa + fricción
        s.vx += (targetX - s.x) * SPRING;
        s.vy += (targetY - s.y) * SPRING;
        s.vx *= FRICTION;
        s.vy *= FRICTION;
        s.x += s.vx;
        s.y += s.vy;

        s.spin *= 0.95;
        s.rotation += s.spin + 0.002;

        drawStar(ctx, s.x, s.y, s.r * s.scale, s.rotation, s.color);
      });

      frame = requestAnimationFrame(tick);
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      stars.forEach(s => drawStar(ctx, s.homeX, s.homeY, s.r, s.rotation, s.color));
    };

    resize();
    if (reduceMotion) {
      drawStatic();
    } else {
      frame = requestAnimationFrame(tick);
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      document.addEventListener('pointerleave', onPointerLeave);
    }

    const onResize = () => {
      resize();
      if (reduceMotion) drawStatic();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0"
    />
  );
}
