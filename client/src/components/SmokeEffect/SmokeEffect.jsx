import { useEffect, useRef } from "react";
import "./SmokeEffect.css";

/**
 * SmokeEffect
 * Lightweight canvas-based drifting smoke, meant to sit behind
 * dark hero content (e.g. the Gel Ash Tray hero).
 *
 * Usage:
 *   <div className="gel-hero-dark">
 *     <SmokeEffect />
 *     ...content on top, position: relative + z-index...
 *   </div>
 */
function SmokeEffect({ density = 26, color = "255, 255, 255", className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let animationId;
    let particles = [];

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function makeParticle(spawnAtBottom = true) {
      const size = 90 + Math.random() * 170;
      return {
        x: Math.random() * width,
        y: spawnAtBottom
          ? height + size * 0.5 + Math.random() * height * 0.4
          : Math.random() * height,
        size,
        baseSize: size,
        speedY: 0.18 + Math.random() * 0.32,
        driftX: (Math.random() - 0.5) * 0.35,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.002 + Math.random() * 0.004,
        swayAmount: 20 + Math.random() * 40,
        opacity: 0.05 + Math.random() * 0.1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.0015,
      };
    }

    function init() {
      resize();
      particles = Array.from({ length: density }, () => makeParticle(false));
    }

    function drawParticle(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
      gradient.addColorStop(0, `rgba(${color}, ${p.opacity})`);
      gradient.addColorStop(0.6, `rgba(${color}, ${p.opacity * 0.4})`);
      gradient.addColorStop(1, `rgba(${color}, 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.75, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function tick() {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.sway += p.swaySpeed;
        p.y -= p.speedY;
        p.x += p.driftX + Math.sin(p.sway) * 0.15;
        p.rotation += p.rotationSpeed;
        p.size = p.baseSize * (1 + (height - p.y) / (height * 6));

        if (p.y + p.size < -50) {
          Object.assign(p, makeParticle(true));
        }

        drawParticle(p);
      }

      animationId = requestAnimationFrame(tick);
    }

    init();

    if (prefersReducedMotion) {
      // Draw a single static frame instead of animating.
      particles.forEach(drawParticle);
    } else {
      animationId = requestAnimationFrame(tick);
    }

    const handleResize = () => resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [density, color]);

  return (
    <canvas
      ref={canvasRef}
      className={`smoke-effect-canvas ${className}`}
      aria-hidden="true"
    />
  );
}

export default SmokeEffect;
