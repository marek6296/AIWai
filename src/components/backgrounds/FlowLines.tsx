"use client";

import { useEffect, useRef } from "react";

type Particle = {
    x: number;
    y: number;
    trail: { x: number; y: number }[];
    speed: number;       // px per frame baseline
    maxTrail: number;
    width: number;
    alpha: number;
    hue: 0 | 1;          // 0 warm gold, 1 bright gold
    life: number;        // frames lived
    maxLife: number;
};

/**
 * FlowLines — gold streaks following a smooth flow field (sin/cos noise).
 * Each particle leaves a curved fading trail. Scroll accelerates flight.
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
        let timePhase = 0; // slowly evolving phase for the flow field

        function resize() {
            if (!canvas) return;
            width = canvas.clientWidth;
            height = canvas.clientHeight;
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        // Flow field: smooth angle field derived from layered sin/cos.
        // Returns an angle in radians, varying smoothly across (x,y) and over time.
        function flowAngle(x: number, y: number, t: number): number {
            const a =
                Math.sin(x * 0.0018 + t * 0.6) +
                Math.cos(y * 0.0022 - t * 0.4) +
                Math.sin((x + y) * 0.0012 + t * 0.25) * 0.6;
            // Map to ~full circle, but biased horizontally for nicer flow
            return a * Math.PI * 0.55;
        }

        function makeParticle(_unused: boolean): Particle {
            // Always spawn inside the viewport with margin so the flow field
            // can carry the particle in any direction without it disappearing.
            const margin = 60;
            const x = margin + Math.random() * Math.max(1, width - margin * 2);
            const y = margin + Math.random() * Math.max(1, height - margin * 2);
            const speed = 0.7 + Math.random() * 1.3;
            const maxTrail = 26 + Math.floor(Math.random() * 28); // 26–54 points
            const width_ = Math.random() < 0.18 ? 1.2 : 0.6;
            const alpha = 0.22 + Math.random() * 0.32;
            const hue: 0 | 1 = Math.random() < 0.3 ? 1 : 0;
            const maxLife = 320 + Math.floor(Math.random() * 360);

            // Pre-fill a short trail backwards along the local flow so the
            // particle does not visibly "pop in" — it appears already moving.
            const initialAngle = flowAngle(x, y, timePhase);
            const trail: { x: number; y: number }[] = [];
            const preFill = 6 + Math.floor(Math.random() * 6);
            for (let k = preFill; k >= 1; k--) {
                trail.push({
                    x: x - Math.cos(initialAngle) * speed * k,
                    y: y - Math.sin(initialAngle) * speed * k,
                });
            }
            trail.push({ x, y });

            return {
                x,
                y,
                trail,
                speed,
                maxTrail,
                width: width_,
                alpha,
                hue,
                life: 0,
                maxLife,
            };
        }

        function spawn() {
            const count = window.innerWidth < 768 ? 36 : 70;
            particles = Array.from({ length: count }, () => makeParticle(true));
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

        function drawTrail(p: Particle) {
            const pts = p.trail;
            if (pts.length < 2) return;

            const colorRgb = p.hue === 1 ? "228, 200, 150" : "201, 168, 117";

            // Stroke each segment with a per-segment alpha so head is bright,
            // tail fades to zero. Cheap and looks clean with round caps.
            ctx!.lineCap = "round";
            ctx!.lineJoin = "round";
            ctx!.lineWidth = p.width;

            for (let i = 1; i < pts.length; i++) {
                const u = i / (pts.length - 1); // 0 = oldest tail, 1 = newest head
                const segAlpha = p.alpha * Math.pow(u, 1.6);
                if (segAlpha < 0.012) continue;
                ctx!.strokeStyle = `rgba(${colorRgb}, ${segAlpha})`;
                ctx!.beginPath();
                ctx!.moveTo(pts[i - 1].x, pts[i - 1].y);
                ctx!.lineTo(pts[i].x, pts[i].y);
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

            // Flow field phase advances slowly so the field morphs over time
            timePhase += 0.002 * Math.max(1, speedBoost * 0.4);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                const angle = flowAngle(p.x, p.y, timePhase);
                const v = p.speed * speedBoost;
                p.x += Math.cos(angle) * v;
                p.y += Math.sin(angle) * v;

                p.trail.push({ x: p.x, y: p.y });
                if (p.trail.length > p.maxTrail) p.trail.shift();
                p.life++;

                // Respawn condition: dead, off-screen with no useful trail, or aged out.
                const oldest = p.trail[0];
                const outOfView =
                    (p.x < -60 ||
                        p.x > width + 60 ||
                        p.y < -60 ||
                        p.y > height + 60) &&
                    (oldest.x < -60 ||
                        oldest.x > width + 60 ||
                        oldest.y < -60 ||
                        oldest.y > height + 60);
                if (outOfView || p.life > p.maxLife) {
                    particles[i] = makeParticle(false);
                    continue;
                }

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
            // Warm-up: pre-advance the field a bit so initial render has trails
            for (let k = 0; k < 30; k++) {
                timePhase += 0.002;
                for (const p of particles) {
                    const angle = flowAngle(p.x, p.y, timePhase);
                    p.x += Math.cos(angle) * p.speed;
                    p.y += Math.sin(angle) * p.speed;
                    p.trail.push({ x: p.x, y: p.y });
                    if (p.trail.length > p.maxTrail) p.trail.shift();
                }
            }
            frame();
        } else {
            ctx.clearRect(0, 0, width, height);
            // Static render with pre-warmed trails
            for (let k = 0; k < 25; k++) {
                timePhase += 0.002;
                for (const p of particles) {
                    const angle = flowAngle(p.x, p.y, timePhase);
                    p.x += Math.cos(angle) * p.speed;
                    p.y += Math.sin(angle) * p.speed;
                    p.trail.push({ x: p.x, y: p.y });
                    if (p.trail.length > p.maxTrail) p.trail.shift();
                }
            }
            for (const p of particles) drawTrail(p);
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
