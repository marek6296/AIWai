"use client";

import { useEffect, useRef } from "react";

// Number of alpha buckets for batched stroking. Each bucket = one strokeStyle
// assignment + one beginPath/stroke per particle. Fewer GPU submits = smoother.
const BUCKETS = 6;

type Particle = {
    x: number;
    y: number;
    // Circular trail buffer: xs[head], ys[head] is the newest point.
    // count <= cap. Walk back from head to get older points.
    xs: Float32Array;
    ys: Float32Array;
    cap: number;
    head: number;
    count: number;
    speed: number;
    width: number;
    alpha: number;
    hue: 0 | 1;
    life: number;
    maxLife: number;
};

/**
 * FlowLines — gold streaks following a smooth flow field (sin/cos noise).
 *
 * Performance notes:
 *  - Trail stored in Float32Array circular buffers (no per-frame allocations).
 *  - Per-particle segments quantized into BUCKETS alpha levels and batched
 *    into a single beginPath/stroke per bucket. Cuts stroke() count ~6×.
 *  - Particle count tuned for stable 60fps on idle desktops.
 */
export default function FlowLines() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        let width = 0;
        let height = 0;
        let particles: Particle[] = [];
        let rafId = 0;
        let running = true;
        let timePhase = 0;

        function resize() {
            if (!canvas) return;
            width = canvas.clientWidth;
            height = canvas.clientHeight;
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        // Smooth flow field: layered sin/cos in (x, y, t). Cheap per call.
        function flowAngle(x: number, y: number, t: number): number {
            const a =
                Math.sin(x * 0.0018 + t * 0.6) +
                Math.cos(y * 0.0022 - t * 0.4) +
                Math.sin((x + y) * 0.0012 + t * 0.25) * 0.6;
            return a * Math.PI * 0.55;
        }

        function makeParticle(): Particle {
            const margin = 60;
            const x = margin + Math.random() * Math.max(1, width - margin * 2);
            const y = margin + Math.random() * Math.max(1, height - margin * 2);
            const speed = 0.7 + Math.random() * 1.3;
            const cap = 50 + Math.floor(Math.random() * 30); // 50–80
            const width_ = Math.random() < 0.25 ? 3.2 : 1.8;
            const alpha = 0.22 + Math.random() * 0.32;
            const hue: 0 | 1 = Math.random() < 0.3 ? 1 : 0;
            const maxLife = 320 + Math.floor(Math.random() * 360);

            const xs = new Float32Array(cap);
            const ys = new Float32Array(cap);

            // Pre-fill the buffer along the local flow so there's no pop-in.
            const initialAngle = flowAngle(x, y, timePhase);
            const cosA = Math.cos(initialAngle);
            const sinA = Math.sin(initialAngle);
            const preFill = Math.min(cap, 6 + Math.floor(Math.random() * 6));
            // Fill from oldest to newest into the circular buffer.
            // After fill: head = (preFill - 1), count = preFill.
            for (let k = 0; k < preFill; k++) {
                // k=0 is oldest, k=preFill-1 is newest at the current (x,y).
                const back = preFill - 1 - k;
                xs[k] = x - cosA * speed * back;
                ys[k] = y - sinA * speed * back;
            }

            return {
                x,
                y,
                xs,
                ys,
                cap,
                head: preFill - 1,
                count: preFill,
                speed,
                width: width_,
                alpha,
                hue,
                life: 0,
                maxLife,
            };
        }

        function pushTrail(p: Particle, x: number, y: number) {
            p.head = (p.head + 1) % p.cap;
            p.xs[p.head] = x;
            p.ys[p.head] = y;
            if (p.count < p.cap) p.count++;
        }

        // Index helper: i = 0 → newest, i = count-1 → oldest.
        function idxAt(p: Particle, i: number): number {
            return (p.head - i + p.cap) % p.cap;
        }

        function spawn() {
            const count = window.innerWidth < 768 ? 14 : 26;
            particles = Array.from({ length: count }, () => makeParticle());
        }

        const BOOST_START = 4;
        const BOOST_FRAMES = 130;
        let boostFrame = 0;

        const isMobile = window.innerWidth < 768;
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        const isSafariMobile = isMobile && isSafari;

        let scrollVelocity = 0;
        const SCROLL_GAIN = 0.18;
        const SCROLL_DECAY = 0.92;
        const SCROLL_BOOST_FACTOR = 0.45;
        const SCROLL_CAP = 7;
        let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;

        function onScroll() {
            const y = window.scrollY;
            const dy = Math.abs(y - lastScrollY);
            scrollVelocity = Math.min(scrollVelocity + dy * SCROLL_GAIN, SCROLL_CAP * 4);
            lastScrollY = y;
        }
        if (!isMobile) {
            window.addEventListener("scroll", onScroll, { passive: true });
        }

        let safariScrollTimeout: ReturnType<typeof setTimeout> | null = null;
        function onSafariScrollPause() {
            if (running) {
                running = false;
                cancelAnimationFrame(rafId);
            }
            if (safariScrollTimeout) clearTimeout(safariScrollTimeout);
            safariScrollTimeout = setTimeout(() => {
                if (!running && !reduced && document.visibilityState !== "hidden") {
                    running = true;
                    frame();
                }
            }, 150);
        }
        if (isSafariMobile) {
            window.addEventListener("scroll", onSafariScrollPause, { passive: true });
        }

        // Pre-quantized alpha lookup per (count, segIdx) is not worth caching
        // because count varies per particle; instead we compute u once per segment
        // and bucket inline. Allocate bucket scratch arrays once, reuse each frame.
        const bucketSegs: number[][] = Array.from({ length: BUCKETS }, () => []);

        function drawTrail(p: Particle) {
            if (p.count < 2) return;

            const colorRgb = p.hue === 1 ? "228, 200, 150" : "201, 168, 117";
            const segs = p.count - 1;

            // Reset bucket scratch
            for (let b = 0; b < BUCKETS; b++) bucketSegs[b].length = 0;

            // Walk newest→oldest. Newest segment (i=0) gets bucket BUCKETS-1.
            // Each entry stores the "newer" index of the segment (so we draw
            // from idxAt(p, i) to idxAt(p, i+1) — newer point to older point).
            for (let i = 0; i < segs; i++) {
                // u: 1 at head segment, → 0 toward tail
                const u = 1 - i / segs;
                // Power curve emphasizing the head — same feel as Math.pow(u, 1.6)
                const w = u * u * (1 - 0.4 * (1 - u)); // approx Math.pow(u, ~1.5)
                const segAlpha = p.alpha * w;
                if (segAlpha < 0.012) break; // sorted by index → can break
                let b = Math.floor(segAlpha / p.alpha * BUCKETS);
                if (b >= BUCKETS) b = BUCKETS - 1;
                if (b < 0) b = 0;
                bucketSegs[b].push(i);
            }

            const xs = p.xs;
            const ys = p.ys;
            const cap = p.cap;
            const head = p.head;

            // For each bucket: one strokeStyle, one beginPath, many move/line, one stroke
            for (let b = 0; b < BUCKETS; b++) {
                const list = bucketSegs[b];
                if (list.length === 0) continue;
                // Use the midpoint alpha for the bucket
                const midU = (b + 0.5) / BUCKETS;
                const a = p.alpha * midU;
                ctx!.strokeStyle = `rgba(${colorRgb},${a.toFixed(3)})`;
                ctx!.beginPath();
                for (let s = 0; s < list.length; s++) {
                    const i = list[s];
                    const aIdx = (head - i + cap) % cap;
                    const bIdx = (head - (i + 1) + cap) % cap;
                    ctx!.moveTo(xs[aIdx], ys[aIdx]);
                    ctx!.lineTo(xs[bIdx], ys[bIdx]);
                }
                ctx!.stroke();
            }
        }

        function frame() {
            if (!running) return;
            ctx!.clearRect(0, 0, width, height);

            let introBoost: number;
            if (boostFrame >= BOOST_FRAMES) {
                introBoost = 1;
            } else {
                const t = boostFrame / BOOST_FRAMES;
                const eased = 1 - (1 - t) * (1 - t);
                introBoost = BOOST_START - (BOOST_START - 1) * eased;
                boostFrame++;
            }

            scrollVelocity *= SCROLL_DECAY;
            if (scrollVelocity < 0.02) scrollVelocity = 0;
            const scrollMultiplier = isMobile
                ? 1
                : Math.min(1 + scrollVelocity * SCROLL_BOOST_FACTOR, SCROLL_CAP);
            const speedBoost = Math.max(introBoost, scrollMultiplier);

            timePhase += 0.002 * Math.max(1, speedBoost * 0.4);

            // Stroke state shared across particles (line caps + width set per particle)
            ctx!.lineCap = "round";
            ctx!.lineJoin = "round";

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                const angle = flowAngle(p.x, p.y, timePhase);
                const v = p.speed * speedBoost;
                p.x += Math.cos(angle) * v;
                p.y += Math.sin(angle) * v;
                pushTrail(p, p.x, p.y);
                p.life++;

                // Out-of-view = both head AND oldest tail are off-screen with margin
                const oldestIdx = idxAt(p, p.count - 1);
                const ox = p.xs[oldestIdx];
                const oy = p.ys[oldestIdx];
                const headOff =
                    p.x < -60 || p.x > width + 60 || p.y < -60 || p.y > height + 60;
                const tailOff =
                    ox < -60 || ox > width + 60 || oy < -60 || oy > height + 60;
                if ((headOff && tailOff) || p.life > p.maxLife) {
                    particles[i] = makeParticle();
                    continue;
                }

                ctx!.lineWidth = p.width;
                drawTrail(p);
            }

            rafId = requestAnimationFrame(frame);
        }

        function onVisibility() {
            if (document.visibilityState === "hidden") {
                running = false;
                cancelAnimationFrame(rafId);
            } else if (!running) {
                running = true;
                frame();
            }
        }

        let lastWidth = window.innerWidth;
        function onResize() {
            resize();
            if (isSafariMobile) {
                const newWidth = window.innerWidth;
                if (newWidth !== lastWidth) {
                    spawn();
                    lastWidth = newWidth;
                }
            } else {
                spawn();
            }
        }

        resize();
        spawn();
        if (!reduced) {
            // Warm-up: advance the field so initial render already shows curves
            for (let k = 0; k < 30; k++) {
                timePhase += 0.002;
                for (const p of particles) {
                    const angle = flowAngle(p.x, p.y, timePhase);
                    p.x += Math.cos(angle) * p.speed;
                    p.y += Math.sin(angle) * p.speed;
                    pushTrail(p, p.x, p.y);
                }
            }
            frame();
        } else {
            ctx.clearRect(0, 0, width, height);
            for (let k = 0; k < 25; k++) {
                timePhase += 0.002;
                for (const p of particles) {
                    const angle = flowAngle(p.x, p.y, timePhase);
                    p.x += Math.cos(angle) * p.speed;
                    p.y += Math.sin(angle) * p.speed;
                    pushTrail(p, p.x, p.y);
                }
            }
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            for (const p of particles) {
                ctx.lineWidth = p.width;
                drawTrail(p);
            }
        }

        window.addEventListener("resize", onResize);
        document.addEventListener("visibilitychange", onVisibility);

        return () => {
            running = false;
            cancelAnimationFrame(rafId);
            if (safariScrollTimeout) clearTimeout(safariScrollTimeout);
            window.removeEventListener("resize", onResize);
            if (!isMobile) window.removeEventListener("scroll", onScroll);
            if (isSafariMobile) window.removeEventListener("scroll", onSafariScrollPause);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden="true"
        />
    );
}
