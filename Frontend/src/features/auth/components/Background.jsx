import React, { useEffect, useRef } from 'react';
import './style/Background.css';

// ─── Value noise (hash → bilinear interpolation) ──────────────────────────────
function hash(ix, iy) {
  const n = Math.sin(ix * 127.1 + iy * 311.7) * 43758.5453123;
  return n - Math.floor(n);
}

function valueNoise(x, y) {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix,        fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);  // smoothstep
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash(ix,     iy);
  const b = hash(ix + 1, iy);
  const c = hash(ix,     iy + 1);
  const d = hash(ix + 1, iy + 1);
  return a + (b - a) * ux + (c - a) * uy + ((d - b) - (c - a)) * ux * uy;
}

// ─── Fractal Brownian Motion (5 octaves) ─────────────────────────────────────
function fbm(x, y) {
  let v = 0, amp = 0.5, freq = 1;
  for (let i = 0; i < 5; i++) {
    v    += valueNoise(x * freq, y * freq) * amp;
    amp  *= 0.5;
    freq *= 2.07;
  }
  return v;  // roughly 0..1
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Background() {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const frameRef  = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    const t0     = performance.now();

    let W = 0, H = 0;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function draw(now) {
      // Render at ~20fps (skip 2 frames out of 3) for performance
      frameRef.current++;
      if (frameRef.current % 3 !== 0) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const t = (now - t0) * 0.00008; // very slow time

      // ── Clear ──
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, W, H);

      // ── Effect center — offset right like reference ──
      const cx     = W * 0.56;
      const cy     = H * 0.5;
      const scaleX = W * 0.46;
      const scaleY = H * 0.32;

      // ── Cell / square config ──
      const CELL   = 5;      // grid resolution (px)
      const MAX_SQ = 52;     // max square size (px)
      const THRESH = 0.30;   // noise threshold — below = invisible

      for (let py = 0; py <= H; py += CELL) {
        for (let px = 0; px <= W; px += CELL) {

          // Normalise to ellipse coordinates
          const dx = (px - cx) / scaleX;
          const dy = (py - cy) / scaleY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Fast reject — skip anything more than 1.05 ellipse-radii away
          if (dist > 1.05) continue;

          // Elliptical falloff (soft edge)
          const falloff = Math.max(0, 1 - dist);
          const falloffSmooth = falloff * falloff * (3 - 2 * falloff);

          // Slowly rotate the noise sampling coords
          const cosT = Math.cos(t), sinT = Math.sin(t);
          const rx = dx * cosT - dy * sinT;
          const ry = dx * sinT + dy * cosT;

          // FBM noise
          const n = fbm(rx * 2.8 + 4.0, ry * 2.8 + 2.5);

          // Combine noise + falloff, power-curve to push small values lower
          const raw = Math.pow(n, 0.75) * Math.pow(falloffSmooth, 0.5);

          if (raw < THRESH) continue;

          // Map [THRESH..1] → square size [0..MAX_SQ]
          const t_val  = (raw - THRESH) / (1 - THRESH);
          const sqSize = Math.pow(t_val, 1.6) * MAX_SQ + 0.6;

          if (sqSize < 0.5) continue;

          // Draw centred on cell
          const sqX = px + (CELL - sqSize) * 0.5;
          const sqY = py + (CELL - sqSize) * 0.5;

          // Warm white, alpha driven by value
          const alpha = Math.min(1, raw * 1.4);
          ctx.fillStyle = `rgba(224,216,206,${alpha.toFixed(3)})`;
          ctx.fillRect(sqX, sqY, sqSize, sqSize);
        }
      }
    }

    function loop(now) {
      draw(now);
      rafRef.current = requestAnimationFrame(loop);
    }

    resize();
    window.addEventListener('resize', resize);
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="citymap-root">
      <canvas ref={canvasRef} className="citymap-canvas" />
    </div>
  );
}
