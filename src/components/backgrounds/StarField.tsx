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
            // Lighter particle count on mobile — keeps RAF under budget so
            // scroll never drops frames.
            const count = window.innerWidth < 768 ? 35 : 160;
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

        // Initial speed boost — smoothly decelerates from 4× to 1× over ~2.2s
        // using an easeOut-quad curve (steady, organic slowdown — not exponential).
        const BOOST_START = 4;
        const BOOST_FRAMES = 130;     // ~2.2s @ 60fps
        let boostFrame = 0;

        // Scroll-driven speed boost — DESKTOP ONLY.
        // Mobile scroll events fire too aggressively (momentum/rubber-band)
        // and choke the canvas RAF loop, so we skip the listener there entirely.
        const isMobile = window.innerWidth < 768;
        let scrollVelocity = 0;          // accumulated scroll energy
        const SCROLL_GAIN = 0.18;        // how much each scrolled pixel adds
        const SCROLL_DECAY = 0.92;       // per-frame falloff (~1s back to rest)
        const SCROLL_BOOST_FACTOR = 0.45; // how strongly velocity boosts speed
        const SCROLL_CAP = 7;            // max additional multiplier
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

        function frame() {
            if (!running) return;
            ctx!.clearRect(0, 0, width, height);

            // Intro speed boost: easeOutQuad from BOOST_START down to 1.0
            let introBoost: number;
            if (boostFrame >= BOOST_FRAMES) {
                introBoost = 1;
            } else {
                const t = boostFrame / BOOST_FRAMES;
                const eased = 1 - (1 - t) * (1 - t);
                introBoost = BOOST_START - (BOOST_START - 1) * eased;
                boostFrame++;
            }

            // Scroll boost decays each frame; whichever boost is bigger wins.
            // On mobile scrollVelocity is never populated → scrollMultiplier = 1,
            // so effective boost is just the intro curve → identical to pre-scroll-feature.
            scrollVelocity *= SCROLL_DECAY;
            if (scrollVelocity < 0.02) scrollVelocity = 0;
            const scrollMultiplier = isMobile
                ? 1
                : Math.min(1 + scrollVelocity * SCROLL_BOOST_FACTOR, SCROLL_CAP);
            const speedBoost = Math.max(introBoost, scrollMultiplier);

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

            // Connection lines — O(n²), too heavy for mobile. Desktop only.
            if (!isMobile) {
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const distSq = dx * dx + dy * dy;
                        if (distSq < 19600) { // 140² — avoid sqrt unless needed
                            const dist = Math.sqrt(distSq);
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

        // On iOS the address bar showing/hiding fires resize even though
        // width hasn't changed. Only re-spawn particles on real width changes
        // (orientation/breakpoint), otherwise just rescale the canvas.
        let lastWidth = window.innerWidth;
        function onResize() {
            resize();
            const newWidth = window.innerWidth;
            if (newWidth !== lastWidth) {
                spawn();
                lastWidth = newWidth;
            }
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

        // IntersectionObserver — pause the RAF loop when the canvas (hero)
        // is fully off-screen. Saves a huge amount of work on mobile while
        // user is scrolling through the rest of the page.
        let observer: IntersectionObserver | null = null;
        if (typeof IntersectionObserver !== "undefined") {
            observer = new IntersectionObserver(
                (entries) => {
                    const entry = entries[0];
                    if (!entry) return;
                    if (entry.isIntersecting) {
                        if (!running && !reduced) {
                            running = true;
                            frame();
                        }
                    } else {
                        running = false;
                        cancelAnimationFrame(rafId);
                    }
                },
                { threshold: 0 }
            );
            observer.observe(canvas);
        }

        return () => {
            running = false;
            cancelAnimationFrame(rafId);
            window.removeEventListener("resize", onResize);
            if (!isMobile) window.removeEventListener("scroll", onScroll);
            document.removeEventListener("visibilitychange", onVisibility);
            if (observer) observer.disconnect();
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
