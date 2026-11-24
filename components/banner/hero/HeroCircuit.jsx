"use client";

import { useEffect, useRef } from "react";

const random = (min, max) => min + Math.random() * (max - min);

const WAVE = { amplitude: 55, frequency: 1.1, speed: 0.45, spacing: 0.19 };

const LIGHT = {
  trace: (alpha) => `rgba(18, 52, 77, ${alpha})`,
  node: (alpha) => `rgba(39, 191, 199, ${alpha})`,
  pulse: ["rgba(39, 191, 199, 0.55)", "rgba(39, 191, 199, 0)"],
  wave: (alpha) => `rgba(39, 191, 199, ${alpha})`,
};

const DARK = {
  trace: (alpha) => `rgba(0, 163, 223, ${alpha})`,
  node: (alpha) => `rgba(30, 196, 255, ${alpha})`,
  pulse: ["rgba(88, 224, 255, 0.85)", "rgba(0, 174, 255, 0)"],
  wave: (alpha) => `rgba(0, 167, 230, ${alpha})`,
};

function buildWaves() {
  const count = 14;
  const mid = (count - 1) / 2;
  return Array.from({ length: count }, (_, index) => ({
    offset: (index - mid) * 3.2,
    amplitude: WAVE.amplitude,
    frequency: WAVE.frequency,
    phase: index * WAVE.spacing,
    speed: WAVE.speed,
    opacity: 0.08 + (index / (count - 1)) * 0.07,
  }));
}

function buildPaths(width, height) {
  const next = [];
  for (const side of [0, 1]) {
    for (let x = 5; x < width; x += random(18, 30)) {
      const sign = side === 0 ? 1 : -1;
      const y = side === 0 ? 0 : height;
      const depth = random(height * 0.15, height * 0.2);
      const bend = random(8, 19);
      const dx = (Math.random() < 0.5 ? -1 : 1) * bend;
      const reach = depth * random(0.18, 0.55);
      const points = [
        [x, y],
        [x, y + sign * reach],
        [x + dx, y + sign * (reach + bend)],
        [x + dx, y + sign * depth],
      ];
      const segments = points.slice(1).map((point, index) =>
        Math.hypot(point[0] - points[index][0], point[1] - points[index][1])
      );
      next.push({
        points,
        segments,
        length: segments.reduce((sum, segment) => sum + segment, 0),
        speed: random(4, 11),
        phase: Math.random(),
        opacity: random(0.1, 0.2),
      });
    }
  }
  return next;
}

function pointAt(path, distance) {
  let remaining = distance;
  for (let index = 0; index < path.segments.length; index += 1) {
    if (remaining <= path.segments[index]) {
      const amount = remaining / path.segments[index];
      const start = path.points[index];
      const end = path.points[index + 1];
      return [start[0] + (end[0] - start[0]) * amount, start[1] + (end[1] - start[1]) * amount];
    }
    remaining -= path.segments[index];
  }
  return path.points[path.points.length - 1];
}

export default function HeroCircuit({ paused = false, reduce = false }) {
  const canvasRef = useRef(null);
  const pausedRef = useRef(paused);
  const reduceRef = useRef(reduce);
  pausedRef.current = paused;
  reduceRef.current = reduce;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext("2d");
    if (!context) return undefined;

    const waves = buildWaves();
    let width = 0;
    let height = 0;
    let paths = [];
    let frame = 0;
    let running = true;

    const colors = () =>
      document.documentElement.classList.contains("dark") ? DARK : LIGHT;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const density = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * density);
      canvas.height = Math.round(height * density);
      context.setTransform(density, 0, 0, density, 0, 0);
      paths = width && height ? buildPaths(width, height) : [];
    };

    const draw = (ms) => {
      const time = reduceRef.current ? 0 : ms * 0.001;
      const palette = colors();
      context.clearRect(0, 0, width, height);

      for (const path of paths) {
        context.beginPath();
        path.points.forEach(([x, y], index) => {
          if (index) context.lineTo(x, y);
          else context.moveTo(x, y);
        });
        context.strokeStyle = palette.trace(path.opacity);
        context.lineWidth = 0.7;
        context.stroke();

        const [endX, endY] = path.points[path.points.length - 1];
        context.beginPath();
        context.arc(endX, endY, 1.6, 0, Math.PI * 2);
        context.fillStyle = palette.node(Math.min(path.opacity + 0.05, 0.28));
        context.fill();

        if (reduceRef.current) continue;
        const distance = (time * path.speed + path.phase * (path.length + 60)) % (path.length + 60);
        if (distance < path.length) {
          const [x, y] = pointAt(path, distance);
          const glow = context.createRadialGradient(x, y, 0, x, y, 7);
          glow.addColorStop(0, palette.pulse[0]);
          glow.addColorStop(1, palette.pulse[1]);
          context.fillStyle = glow;
          context.fillRect(x - 5, y - 5, 10, 10);
        }
      }

      for (const wave of waves) {
        context.beginPath();
        for (let x = 0; x <= width + 4; x += 4) {
          const across = x / Math.max(width, 1);
          const y =
            height * 0.5 +
            (wave.offset * height) / 344 +
            Math.sin(across * Math.PI * 2 * wave.frequency + wave.phase - time * wave.speed) *
              wave.amplitude *
              (height / 344);
          if (x === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.strokeStyle = palette.wave(wave.opacity);
        context.lineWidth = 1;
        context.stroke();
      }
    };

    const tick = (ms) => {
      if (!running) return;
      draw(ms);
      if (!pausedRef.current && !reduceRef.current) frame = requestAnimationFrame(tick);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(tick);
    };

    const observer = new ResizeObserver(() => {
      resize();
      if (pausedRef.current || reduceRef.current) draw(0);
    });
    observer.observe(canvas);
    const onChange = () => start();
    canvas.addEventListener("hero-circuit-sync", onChange);
    resize();
    start();

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener("hero-circuit-sync", onChange);
    };
  }, []);

  useEffect(() => {
    canvasRef.current?.dispatchEvent(new Event("hero-circuit-sync"));
  }, [paused, reduce]);

  return (
    <div className="hero-circuit" aria-hidden>
      <div className="hero-circuit-wash" />
      <canvas ref={canvasRef} className="hero-circuit-canvas" />
    </div>
  );
}
