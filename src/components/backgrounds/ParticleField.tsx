"use client";

import { useEffect, useRef } from "react";

interface Particle {
    // Absolute positions on the full document
    pageX: number;
    pageY: number;
    // Velocity
    vx: number;
    vy: number;
    // Autonomous drift
    driftAngle: number;      // current drift direction in radians
    driftSpeed: number;      // px per frame of natural movement
    driftTurnSpeed: number;  // how fast the angle rotates (radians/frame)
    radius: number;
    opacity: number;
    baseOpacity: number;
    fadeSpeed: number;
}

export default function ParticleField() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const particlesRef = useRef<Particle[]>([]);
    const scrollYRef = useRef(0);
    const mouseRef = useRef({ x: -9999, y: -9999 }); // viewport coords

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        const isMobile = window.innerWidth < 768;
        const CONNECTION_DISTANCE = isMobile ? 120 : 180;
        const MOUSE_RADIUS = 250;

        const getDocHeight = () =>
            Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.offsetHeight
            );

        // --- Canvas: fixed, covers viewport ---
        const resizeCanvas = () => {
            const dpr = Math.min(window.devicePixelRatio, 2);
            const w = window.innerWidth;
            const h = window.innerHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.scale(dpr, dpr);
        };

        // --- Seed particles: dense at top, tapering lower ---
        const initParticles = () => {
            const docH = getDocHeight();
            const vw = window.innerWidth;
            const vh = window.innerHeight;

            // 70% of particles in the first viewport-height, 30% spread across the rest
            const topCount = isMobile ? 120 : 240;
            const restCount = isMobile ? 60 : 120;
            const totalCount = topCount + restCount;

            particlesRef.current = Array.from({ length: totalCount }, (_, i) => {
                const baseOpacity = Math.random() * 0.25 + 0.1;
                const isTop = i < topCount;
                // Top section: uniform random in [0, vh*1.5]
                // Rest: uniform random in [vh*1.5, docH]
                const pageY = isTop
                    ? Math.random() * Math.min(vh * 1.5, docH)
                    : Math.min(vh * 1.5, docH) + Math.random() * Math.max(docH - vh * 1.5, 1);
                return {
                    pageX: Math.random() * vw,
                    pageY,
                    vx: 0,
                    vy: 0,
                    driftAngle: Math.random() * Math.PI * 2,
                    driftSpeed: Math.random() * 0.4 + 0.15,
                    driftTurnSpeed: (Math.random() - 0.5) * 0.012,
                    radius: Math.random() * 2 + 0.8,
                    opacity: baseOpacity,
                    baseOpacity,
                    fadeSpeed: Math.random() * 0.003 + 0.001,
                };
            });
        };

        // Track mouse in viewport space
        const onMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        const onMouseLeave = () => {
            mouseRef.current = { x: -9999, y: -9999 };
        };

        // Track scroll
        const onScroll = () => {
            scrollYRef.current = window.scrollY;
        };

        const animate = () => {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const docH = getDocHeight();
            const scrollY = scrollYRef.current;
            const mouse = mouseRef.current;

            ctx.clearRect(0, 0, vw, vh);

            const particles = particlesRef.current;

            // Buffer: render particles slightly outside viewport so connections don't pop
            const buffer = CONNECTION_DISTANCE;

            // Compute screen Y for each particle; only process visible ones
            // but we need all nearby ones for connection rendering
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Screen position = page position - scroll
                const sx = p.pageX;
                const sy = p.pageY - scrollY;

                // ── Autonomous drift ──
                // Slowly rotate drift direction for organic feel
                p.driftAngle += p.driftTurnSpeed;
                // Apply gentle drift toward current angle
                const driftX = Math.cos(p.driftAngle) * p.driftSpeed;
                const driftY = Math.sin(p.driftAngle) * p.driftSpeed;
                p.vx += driftX * 0.05;
                p.vy += driftY * 0.05;

                // ── Mouse repulsion (strong) ──
                const dx = sx - mouse.x;
                const dy = sy - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MOUSE_RADIUS && dist > 0) {
                    // Quadratic falloff so close particles fly away hard
                    const t = 1 - dist / MOUSE_RADIUS;
                    const force = t * t * 0.18;
                    p.vx += (dx / dist) * force;
                    p.vy += (dy / dist) * force;
                }

                // Soft speed cap so particles don't fly off screen
                const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                const MAX_SPEED = 4;
                if (speed > MAX_SPEED) {
                    p.vx = (p.vx / speed) * MAX_SPEED;
                    p.vy = (p.vy / speed) * MAX_SPEED;
                }

                // Damping — gentle enough to let drift sustain movement
                p.vx *= 0.97;
                p.vy *= 0.97;

                // Move in page space
                p.pageX += p.vx;
                p.pageY += p.vy;

                // Wrap horizontally
                if (p.pageX < -10) p.pageX = vw + 10;
                if (p.pageX > vw + 10) p.pageX = -10;

                // Wrap vertically within document
                if (p.pageY < -10) p.pageY = docH + 10;
                if (p.pageY > docH + 10) p.pageY = -10;

                // Pulsation
                p.opacity += p.fadeSpeed;
                if (p.opacity > p.baseOpacity + 0.1 || p.opacity < p.baseOpacity - 0.05) {
                    p.fadeSpeed = -p.fadeSpeed;
                }

                // Only draw if on screen (+ buffer)
                if (sy > -buffer && sy < vh + buffer) {
                    ctx.beginPath();
                    ctx.arc(sx, sy, p.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(28, 31, 58, ${p.opacity})`;
                    ctx.fill();
                }
            }

            // Connections — only between visible particles
            for (let i = 0; i < particles.length; i++) {
                const a = particles[i];
                const asy = a.pageY - scrollY;
                if (asy < -buffer || asy > vh + buffer) continue;

                for (let j = i + 1; j < particles.length; j++) {
                    const b = particles[j];
                    const bsy = b.pageY - scrollY;
                    if (bsy < -buffer || bsy > vh + buffer) continue;

                    const ddx = a.pageX - b.pageX;
                    const ddy = asy - bsy;
                    const distance = Math.sqrt(ddx * ddx + ddy * ddy);

                    if (distance < CONNECTION_DISTANCE) {
                        const opacity = (1 - distance / CONNECTION_DISTANCE) * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(a.pageX, asy);
                        ctx.lineTo(b.pageX, bsy);
                        ctx.strokeStyle = `rgba(28, 31, 58, ${opacity})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        resizeCanvas();
        initParticles();
        animate();

        window.addEventListener("resize", () => { resizeCanvas(); initParticles(); }, { passive: true });
        window.addEventListener("mousemove", onMouseMove, { passive: true });
        window.addEventListener("scroll", onScroll, { passive: true });
        document.addEventListener("mouseleave", onMouseLeave);

        return () => {
            cancelAnimationFrame(animationRef.current);
            window.removeEventListener("resize", resizeCanvas);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("scroll", onScroll);
            document.removeEventListener("mouseleave", onMouseLeave);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                pointerEvents: "none",
                zIndex: 1,
            }}
        />
    );
}
