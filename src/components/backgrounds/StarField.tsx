"use client";

import { useEffect, useRef } from "react";

type Particle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
    a: number;
    twinkle: number;
    twinkleSpeed: number;
};

/**
 * StarField — twinkling gold particles with connection lines.
 * Ported from AIWai-redesign hero. Replaces gradient mesh background.
 */
export default function StarField() {
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

        function resize() {
            if (!canvas) return;
            width = canvas.clientWidth;
            height = canvas.clientHeight;
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        function spawn() {
            const count = window.innerWidth < 768 ? 70 : 160;
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
                r: Math.random() < 0.08 ? 1.4 + Math.random() * 1.4 : 0.4 + Math.random() * 1.2,
                a: 0.25 + Math.random() * 0.55,
                twinkle: Math.random() * Math.PI * 2,
                twinkleSpeed: 0.005 + Math.random() * 0.015,
            }));
        }

        // Initial speed boost — particles fly fast on first load, then ease into normal drift.
        // 7× faster at t=0, decays per frame and settles to 1× after ~0.8s.
        let speedBoost = 7;
        const BOOST_DECAY = 0.96;    // per frame; reaches 1.0 in ~48 frames (~0.8s @ 60fps)
        const BOOST_MIN = 1.0;

        function frame() {
            if (!running) return;
            ctx!.clearRect(0, 0, width, height);

            // Ease the speed boost toward normal (1.0)
            if (speedBoost > BOOST_MIN) {
                speedBoost = Math.max(BOOST_MIN, speedBoost * BOOST_DECAY);
            }

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx * speedBoost;
                p.y += p.vy * speedBoost;
                // Twinkle also kicks faster initially for a brief sparkle burst
                p.twinkle += p.twinkleSpeed * speedBoost;
                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                const tw = 0.6 + 0.4 * Math.sin(p.twinkle);
                const alpha = p.a * tw;

                if (p.r > 1.2) {
                    const grad = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
                    grad.addColorStop(0, `rgba(228, 200, 150, ${alpha * 0.5})`);
                    grad.addColorStop(1, "rgba(228, 200, 150, 0)");
                    ctx!.fillStyle = grad;
                    ctx!.beginPath();
                    ctx!.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
                    ctx!.fill();
                }

                ctx!.beginPath();
                ctx!.fillStyle = `rgba(228, 200, 150, ${alpha})`;
                ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx!.fill();
            }

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 140) {
                        const alpha = ((140 - dist) / 140) * 0.18;
                        ctx!.strokeStyle = `rgba(201, 168, 117, ${alpha})`;
                        ctx!.lineWidth = 0.5;
                        ctx!.beginPath();
                        ctx!.moveTo(particles[i].x, particles[i].y);
                        ctx!.lineTo(particles[j].x, particles[j].y);
                        ctx!.stroke();
                    }
                }
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

        function onResize() {
            resize();
            spawn();
        }

        resize();
        spawn();
        if (!reduced) {
            frame();
        } else {
            ctx.clearRect(0, 0, width, height);
            for (const p of particles) {
                ctx.beginPath();
                ctx.fillStyle = `rgba(228, 200, 150, ${p.a})`;
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        window.addEventListener("resize", onResize);
        document.addEventListener("visibilitychange", onVisibility);

        return () => {
            running = false;
            cancelAnimationFrame(rafId);
            window.removeEventListener("resize", onResize);
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
