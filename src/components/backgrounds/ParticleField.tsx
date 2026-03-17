"use client";

import { useEffect, useRef } from "react";

interface Particle {
    pageX: number;
    pageY: number;
    vx: number;
    vy: number;
    driftAngle: number;
    driftSpeed: number;
    driftTurnSpeed: number;
    radius: number;
    opacity: number;
    baseOpacity: number;
    fadeSpeed: number;
}

// Detect Safari once at module level
const isSafari = typeof window !== "undefined"
    ? /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    : false;

export default function ParticleField() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const particlesRef = useRef<Particle[]>([]);
    const scrollYRef = useRef(0);
    const mouseRef = useRef({ x: -9999, y: -9999 });

    // Cache layout measurements — update only on resize, NOT every frame
    const layoutRef = useRef({ vw: 0, vh: 0, docH: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        const isMobile = window.innerWidth < 768;

        // Safari gets fewer particles and shorter connection distance
        const CONNECTION_DISTANCE = isMobile ? 100 : (isSafari ? 140 : 180);
        const MOUSE_RADIUS = isSafari ? 180 : 250;
        // DPR cap: 1 on Safari (avoids huge canvas on Retina), 2 on Chrome
        const DPR = isSafari ? 1 : Math.min(window.devicePixelRatio, 2);

        const getDocHeight = () =>
            Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight,
            );

        const updateLayout = () => {
            layoutRef.current = {
                vw: window.innerWidth,
                vh: window.innerHeight,
                docH: getDocHeight(),
            };
        };

        const resizeCanvas = () => {
            updateLayout();
            const { vw, vh } = layoutRef.current;
            canvas.width = vw * DPR;
            canvas.height = vh * DPR;
            canvas.style.width = `${vw}px`;
            canvas.style.height = `${vh}px`;
            if (DPR !== 1) ctx.scale(DPR, DPR);
        };

        const initParticles = () => {
            const { vw, vh, docH } = layoutRef.current;

            // Particle counts — Safari gets ~half
            const topCount = isMobile ? 60 : (isSafari ? 120 : 240);
            const restCount = isMobile ? 30 : (isSafari ? 60 : 120);
            const total = topCount + restCount;

            particlesRef.current = Array.from({ length: total }, (_, i) => {
                const baseOpacity = Math.random() * 0.25 + 0.1;
                const isTop = i < topCount;
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

        const onMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        const onMouseLeave = () => {
            mouseRef.current = { x: -9999, y: -9999 };
        };
        const onScroll = () => {
            scrollYRef.current = window.scrollY;
        };

        let frameCount = 0;
        const animate = () => {
            frameCount++;
            // Read layout from cache — NO layout reflow inside animation loop
            const { vw, vh, docH } = layoutRef.current;
            const scrollY = scrollYRef.current;
            const mouse = mouseRef.current;
            const buffer = CONNECTION_DISTANCE;

            ctx.clearRect(0, 0, vw, vh);

            const particles = particlesRef.current;

            // On Safari: skip connection rendering every other frame
            const drawConnections = isSafari ? frameCount % 2 === 0 : true;

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                const sx = p.pageX;
                const sy = p.pageY - scrollY;

                // Drift
                p.driftAngle += p.driftTurnSpeed;
                p.vx += Math.cos(p.driftAngle) * p.driftSpeed * 0.05;
                p.vy += Math.sin(p.driftAngle) * p.driftSpeed * 0.05;

                // Mouse repulsion
                const dx = sx - mouse.x;
                const dy = sy - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MOUSE_RADIUS && dist > 0) {
                    const t = 1 - dist / MOUSE_RADIUS;
                    const force = t * t * 0.18;
                    p.vx += (dx / dist) * force;
                    p.vy += (dy / dist) * force;
                }

                // Speed cap + damping
                const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                if (speed > 4) { p.vx = (p.vx / speed) * 4; p.vy = (p.vy / speed) * 4; }
                p.vx *= 0.97;
                p.vy *= 0.97;

                p.pageX += p.vx;
                p.pageY += p.vy;

                // Wrap
                if (p.pageX < -10) p.pageX = vw + 10;
                if (p.pageX > vw + 10) p.pageX = -10;
                if (p.pageY < -10) p.pageY = docH + 10;
                if (p.pageY > docH + 10) p.pageY = -10;

                // Pulsation
                p.opacity += p.fadeSpeed;
                if (p.opacity > p.baseOpacity + 0.1 || p.opacity < p.baseOpacity - 0.05) {
                    p.fadeSpeed = -p.fadeSpeed;
                }

                // Draw particle
                if (sy > -buffer && sy < vh + buffer) {
                    ctx.beginPath();
                    ctx.arc(sx, sy, p.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(28,31,58,${p.opacity})`;
                    ctx.fill();
                }
            }

            // Connections
            if (drawConnections) {
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
                        const dist = Math.sqrt(ddx * ddx + ddy * ddy);
                        if (dist < CONNECTION_DISTANCE) {
                            const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.12;
                            ctx.beginPath();
                            ctx.moveTo(a.pageX, asy);
                            ctx.lineTo(b.pageX, bsy);
                            ctx.strokeStyle = `rgba(28,31,58,${opacity})`;
                            ctx.lineWidth = 0.6;
                            ctx.stroke();
                        }
                    }
                }
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        resizeCanvas();
        initParticles();
        animate();

        const onResize = () => { resizeCanvas(); initParticles(); };
        window.addEventListener("resize", onResize, { passive: true });
        window.addEventListener("mousemove", onMouseMove, { passive: true });
        window.addEventListener("scroll", onScroll, { passive: true });
        document.addEventListener("mouseleave", onMouseLeave);

        return () => {
            cancelAnimationFrame(animationRef.current);
            window.removeEventListener("resize", onResize);
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
