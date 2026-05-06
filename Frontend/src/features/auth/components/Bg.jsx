import React, { useEffect, useRef } from 'react';
import './style/Bg.css';

// ─── Config ───────────────────────────────────────────────────────────────────
const P = {
  pForward:    0.85,
  pBranch:     0.18,
  pScale:      0.25,
  scaleAmount: 0.85,
  pDivide:     0.12,
  margin:      1,
  speed:       40,       // squares processed per tick
  minSize:     1,
  initSize:    20,       // seed square size (px)
  lifetime:    2200,     // ms before fade begins
  fadeDur:     900,      // ms to fully fade out
  spawnDelay:  180,      // ms between spawns
  spawnDist:   18,       // min px cursor must move to spawn
};

const DIRS = [
  { dx:  1, dy:  0 },
  { dx: -1, dy:  0 },
  { dx:  0, dy:  1 },
  { dx:  0, dy: -1 },
];

// ─── PRNG ─────────────────────────────────────────────────────────────────────
function mulberry32(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── Per-simulation helpers ───────────────────────────────────────────────────
const CELL = P.minSize;
const EPS  = 0.5;

function simKey(cx, cy) { return `${cx},${cy}`; }

function simRegister(sim, sq) {
  const x0 = Math.floor(sq.x / CELL);
  const y0 = Math.floor(sq.y / CELL);
  const x1 = Math.floor((sq.x + sq.s - 0.001) / CELL);
  const y1 = Math.floor((sq.y + sq.s - 0.001) / CELL);
  for (let cy = y0; cy <= y1; cy++) {
    for (let cx = x0; cx <= x1; cx++) {
      const k = simKey(cx, cy);
      let b = sim.grid.get(k);
      if (!b) { b = []; sim.grid.set(k, b); }
      b.push(sq);
    }
  }
}

function simCollides(sim, canvasW, canvasH, x, y, s) {
  const m = P.margin;
  if (x < m || y < m || x + s > canvasW - m || y + s > canvasH - m) return true;
  const x0 = Math.floor((x - m + EPS) / CELL);
  const y0 = Math.floor((y - m + EPS) / CELL);
  const x1 = Math.floor((x + s + m - EPS) / CELL);
  const y1 = Math.floor((y + s + m - EPS) / CELL);
  for (let cy = y0; cy <= y1; cy++) {
    for (let cx = x0; cx <= x1; cx++) {
      const bucket = sim.grid.get(simKey(cx, cy));
      if (!bucket) continue;
      for (const o of bucket) {
        if (x + s - EPS <= o.x - m) continue;
        if (y + s - EPS <= o.y - m) continue;
        if (x + EPS >= o.x + o.s + m) continue;
        if (y + EPS >= o.y + o.s + m) continue;
        return true;
      }
    }
  }
  return false;
}

function simMakeSquare(sim, x, y, s, depth, fromDir) {
  const sq = { x, y, s, depth, fromDir, bornAt: performance.now() };
  sim.squares.push(sq);
  sim.frontier.push(sq);
  simRegister(sim, sq);
  return sq;
}

function simShuffle(rng, a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = (rng() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function outgoingFor(fromDir) {
  if (!fromDir) return DIRS.map(d => ({ dir: d, role: 'forward' }));
  const out = [{ dir: fromDir, role: 'forward' }];
  if (fromDir.dx !== 0) {
    out.push({ dir: { dx: 0, dy:  1 }, role: 'branch' });
    out.push({ dir: { dx: 0, dy: -1 }, role: 'branch' });
  } else {
    out.push({ dir: { dx:  1, dy: 0 }, role: 'branch' });
    out.push({ dir: { dx: -1, dy: 0 }, role: 'branch' });
  }
  return out;
}

function simGrow(sim, parent, canvasW, canvasH) {
  const { rng } = sim;
  const candidates = simShuffle(rng, outgoingFor(parent.fromDir));

  for (const { dir: d, role } of candidates) {
    const prob = role === 'forward' ? P.pForward : P.pBranch;
    if (rng() >= prob) continue;

    let childSize = parent.s;
    if (rng() < P.pScale) {
      const ratio = P.scaleAmount * (0.9 + rng() * 0.2);
      childSize = Math.max(P.minSize, Math.round(parent.s * ratio));
    }

    const m  = P.margin;
    const cx = parent.x + (d.dx === 1 ? parent.s + m : d.dx === -1 ? -(childSize + m) : 0);
    const cy = parent.y + (d.dy === 1 ? parent.s + m : d.dy === -1 ? -(childSize + m) : 0);

    let ox = cx, oy = cy;
    if (d.dx !== 0) {
      const slack = Math.max(0, parent.s - childSize);
      oy = parent.y + (slack ? Math.floor(rng() * (slack + 1)) : 0);
    } else {
      const slack = Math.max(0, parent.s - childSize);
      ox = parent.x + (slack ? Math.floor(rng() * (slack + 1)) : 0);
    }

    // Divide: 2×2 quad-children
    if (rng() < P.pDivide && childSize >= P.minSize * 2 + m) {
      const qA = Math.floor((childSize - m) / 2);
      const qB = childSize - m - qA;
      if (qA >= P.minSize && qB >= P.minSize) {
        const quads = [
          { x: ox,      y: oy,      s: qA },
          { x: ox+qA+m, y: oy,      s: qB },
          { x: ox,      y: oy+qA+m, s: qB },
          { x: ox+qA+m, y: oy+qA+m, s: qB },
        ];
        if (quads.every(c => !simCollides(sim, canvasW, canvasH, c.x, c.y, c.s))) {
          for (const c of quads) simMakeSquare(sim, c.x, c.y, c.s, parent.depth + 1, d);
          continue;
        }
      }
    }

    if (!simCollides(sim, canvasW, canvasH, ox, oy, childSize)) {
      simMakeSquare(sim, ox, oy, childSize, parent.depth + 1, d);
    }
  }
}

// ─── Rendering ────────────────────────────────────────────────────────────────
function squareColor(sq) {
  const warm = Math.min(1, sq.depth / 80);
  const r = Math.round(244 + (193 - 244) * warm * 0.35);
  const g = Math.round(241 + (68  - 241) * warm * 0.18);
  const b = Math.round(234 + (46  - 234) * warm * 0.12);
  return { r, g, b };
}

function drawSquare(ctx, sq, now, simAlpha) {
  const age      = Math.min(1, (now - sq.bornAt) / 280);
  const t        = 1 - Math.pow(1 - age, 3);          // ease-out cubic birth
  const cx       = sq.x + sq.s / 2;
  const cy       = sq.y + sq.s / 2;
  const drawSize = sq.s * t;
  const x        = cx - drawSize / 2;
  const y        = cy - drawSize / 2;
  const { r, g, b } = squareColor(sq);
  const alpha    = (0.55 + 0.35 * t) * simAlpha;
  ctx.fillStyle  = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
  ctx.fillRect(x, y, drawSize, drawSize);
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Bg() {
  const canvasRef   = useRef(null);
  const rafRef      = useRef(null);
  const simsRef     = useRef([]);
  const lastSpawnRef = useRef({ t: 0, x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');

    function resize() {
      canvas.width  = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // ── Spawn a new simulation at (mx, my) ───────────────────────────────────
    function spawnSim(mx, my) {
      const W = canvas.width, H = canvas.height;
      const seed = (performance.now() * 9301 + Math.random() * 49297) | 0;
      const sim  = {
        rng:      mulberry32(seed),
        squares:  [],
        frontier: [],
        grid:     new Map(),
        bornAt:   performance.now(),
      };
      const s  = P.initSize;
      const sx = Math.max(P.margin, Math.min(W - s - P.margin, Math.floor(mx - s / 2)));
      const sy = Math.max(P.margin, Math.min(H - s - P.margin, Math.floor(my - s / 2)));
      simMakeSquare(sim, sx, sy, s, 0, null);
      simsRef.current.push(sim);
    }

    // ── Mouse move handler ───────────────────────────────────────────────────
    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      const mx   = e.clientX - rect.left;
      const my   = e.clientY - rect.top;
      const now  = performance.now();
      const last = lastSpawnRef.current;
      const dx   = mx - last.x, dy = my - last.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (now - last.t >= P.spawnDelay && dist >= P.spawnDist) {
        spawnSim(mx, my);
        lastSpawnRef.current = { t: now, x: mx, y: my };
      }
    }
    canvas.addEventListener('mousemove', onMouseMove);

    // ── Main loop ────────────────────────────────────────────────────────────
    function tick() {
      const now        = performance.now();
      const totalLife  = P.lifetime + P.fadeDur;
      const W = canvas.width, H = canvas.height;

      // Step living sims
      for (const sim of simsRef.current) {
        if (sim.frontier.length === 0) continue;
        const toProcess = Math.min(sim.frontier.length, 1 + Math.floor(P.speed));
        for (let i = 0; i < toProcess; i++) {
          simGrow(sim, sim.frontier.shift(), W, H);
        }
      }

      // Purge expired sims
      simsRef.current = simsRef.current.filter(s => now - s.bornAt < totalLife);

      // Render
      ctx.clearRect(0, 0, W, H);
      for (const sim of simsRef.current) {
        const age = now - sim.bornAt;
        // Sim-level fade-out alpha
        const simAlpha = age < P.lifetime
          ? 1
          : Math.max(0, 1 - (age - P.lifetime) / P.fadeDur);

        for (const sq of sim.squares) {
          drawSquare(ctx, sq, now, simAlpha);
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <div className="citymap-root">
      <canvas ref={canvasRef} className="citymap-canvas" />
    </div>
  );
}