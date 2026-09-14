import { useEffect, useRef } from "react";

// ============================================================
//  The animated background. You probably don't need to edit
//  this file — but if you want to tweak the ANIMATION itself
//  (not colors — those live in Portfolio.css), the knobs are:
//
//    LINK_DIST      -> how far apart nodes can be and still connect
//    node count      -> search "Math.floor((W * H) / 15000)" below,
//                       lower the 15000 for MORE nodes, raise for fewer
//    pulse frequency -> search "Math.random() < 0.02" below,
//                       raise this number for more traveling packets
// ============================================================

const LINK_DIST = 165;
const SIGNAL = "47,95,246"; // must match --signal in Portfolio.css
const AMBER = "232,139,27"; // must match --amber in Portfolio.css
const INK = "23,27,36";     // must match --ink in Portfolio.css

export default function NeuralBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    let W, H, nodes, pulses, rafId;
    const MOUSE = { x: -9999, y: -9999 };

    function buildNodes() {
      const count = Math.max(40, Math.min(110, Math.floor((W * H) / 15000)));
      nodes = [];
      for (let i = 0; i < count; i++) {
        const isAmber = Math.random() < 0.14;
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.24,
          vy: (Math.random() - 0.5) * 0.24,
          r: isAmber ? 1.8 + Math.random() * 1.4 : 1.2 + Math.random() * 1.9,
          c: isAmber ? AMBER : SIGNAL,
          pulse: Math.random() * Math.PI * 2,
        });
      }
      pulses = [];
    }

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      buildNodes();
    }

    function maybeSpawnPulse(edgeList) {
      if (reduceMotion) return;
      if (Math.random() < 0.02 && pulses.length < 14 && edgeList.length) {
        const e = edgeList[Math.floor(Math.random() * edgeList.length)];
        pulses.push({ a: e.a, b: e.b, p: 0, speed: 0.012 + Math.random() * 0.012 });
      }
    }

    function step() {
      ctx.clearRect(0, 0, W, H);

      const cx = W * 0.7, cy = H * 0.25;
      const wash = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.75);
      wash.addColorStop(0, "rgba(47,95,246,0.05)");
      wash.addColorStop(1, "rgba(47,95,246,0)");
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, W, H);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.02;
        if (n.x < -20) n.x = W + 20;
        if (n.x > W + 20) n.x = -20;
        if (n.y < -20) n.y = H + 20;
        if (n.y > H + 20) n.y = -20;

        const dx = n.x - MOUSE.x, dy = n.y - MOUSE.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 16000) {
          const f = ((16000 - d2) / 16000) * 0.06;
          n.x += dx * f * 0.06;
          n.y += dy * f * 0.06;
        }
      }

      const edgeList = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.22;
            ctx.strokeStyle = `rgba(${INK},${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            edgeList.push({ a, b });
          }
        }
      }

      maybeSpawnPulse(edgeList);

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.p += p.speed;
        if (p.p >= 1) { pulses.splice(i, 1); continue; }
        const px = p.a.x + (p.b.x - p.a.x) * p.p;
        const py = p.a.y + (p.b.y - p.a.y) * p.p;
        const fade = Math.sin(p.p * Math.PI);
        ctx.beginPath();
        ctx.arc(px, py, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${SIGNAL},${0.75 * fade})`;
        ctx.shadowColor = `rgba(${SIGNAL},0.9)`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      for (const n of nodes) {
        const glow = 0.5 + Math.sin(n.pulse) * 0.3;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${n.c},${glow})`;
        ctx.fill();
      }

      if (!reduceMotion) rafId = requestAnimationFrame(step);
    }

    function onMouseMove(e) { MOUSE.x = e.clientX; MOUSE.y = e.clientY; }
    function onMouseLeave() { MOUSE.x = -9999; MOUSE.y = -9999; }

    resize();
    step();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} id="bg-canvas" aria-hidden="true" />;
}
