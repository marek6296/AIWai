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
const isSafari =
    typeof window !== "undefined"
        ? /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
        : false;

export default function ParticleField() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const particlesRef = useRef<Particle[]>([]);
    const scrollYRef = useRef(0);
    const mouseRef = useRef({ x: -9999, y: -9999 });
    const layoutRef = useRef({ vw: 0, vh: 0, docH: 0 });

    useEffect(() => {
        // Skip on mobile — particles block main thread and are invisible on small screens
        if (window.innerWidth < 768) return;
        // Skip on Safari — canvas animation causes GPU contention with page animations
        if (isSafari) return;
        // Respect reduced-motion preference
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });
        if (!ctx) return;

        const CONNECTION_DISTANCE = 130;
        const CONNECTION_DIST_SQ = CONNECTION_DISTANCE * CONNECTION_DISTANCE;
        const MOUSE_RADIUS = 180;
        const MOUSE_RADIUS_SQ = MOUSE_RADIUS * MOUSE_RADIUS;
        // Always cap DPR at 1 — canvas animation doesn't benefit from retina
        const DPR = 1;

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
        };

        const initParticles = () => {
            const { vw, vh, docH } = layoutRef.current;
            const topCount = 100;
            const restCount = 40;
            const total = topCount + restCount;

            particlesRef.current = Array.from({ length: total }, (_, i) => {
                const baseOpacity = Math.random() * 0.22 + 0.08;
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
                    driftSpeed: Math.random() * 0.35 + 0.1,
                    driftTurnSpeed: (Math.random() - 0.5) * 0.01,
                    radius: Math.random() * 1.8 + 0.6,
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

        let scrX: Float32Array;
        let scrY: Float32Array;
        let visible: Uint8Array;

        let frameCount = 0;
        const animate = () => {
            frameCount++;
            const { vw, vh, docH } = layoutRef.current;
            const scrollY = scrollYRef.current;
            const mouse = mouseRef.current;
            const buffer = CONNECTION_DISTANCE;

            ctx.clearRect(0, 0, vw, vh);

            const particles = particlesRef.current;
            const len = particles.length;

            if (!scrX || scrX.length !== len) {
                scrX = new Float32Array(len);
                scrY = new Float32Array(len);
                visible = new Uint8Array(len);
            }

            ctx.fillStyle = "rgb(28,31,58)";

            for (let i = 0; i < len; i++) {
                const p = particles[i];

                p.driftAngle += p.driftTurnSpeed;
                p.vx += Math.cos(p.driftAngle) * p.driftSpeed * 0.05;
                p.vy += Math.sin(p.driftAngle) * p.driftSpeed * 0.05;

                const dx = p.pageX - mouse.x;
                const dy = (p.pageY - scrollY) - mouse.y;
                const distSq = dx * dx + dy * dy;
                if (distSq < MOUSE_RADIUS_SQ && distSq > 0) {
                    const dist = Math.sqrt(distSq);
                    const t = 1 - dist / MOUSE_RADIUS;
                    const force = t * t * 0.15;
                    p.vx += (dx / dist) * force;
                    p.vy += (dy / dist) * force;
                }

                const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                if (speed > 3.5) { p.vx = (p.vx / speed) * 3.5; p.vy = (p.vy / speed) * 3.5; }
                p.vx *= 0.97;
                p.vy *= 0.97;

                p.pageX += p.vx;
                p.pageY += p.vy;

                if (p.pageX < -10) p.pageX = vw + 10;
                else if (p.pageX > vw + 10) p.pageX = -10;
                if (p.pageY < -10) p.pageY = docH + 10;
                else if (p.pageY > docH + 10) p.pageY = -10;

                p.opacity += p.fadeSpeed;
                if (p.opacity > p.baseOpacity + 0.08 || p.opacity < p.baseOpacity - 0.04) {
                    p.fadeSpeed = -p.fadeSpeed;
                }

                const sx = p.pageX;
                const sy = p.pageY - scrollY;
                scrX[i] = sx;
                scrY[i] = sy;
                visible[i] = (sy > -buffer && sy < vh + buffer) ? 1 : 0;

                if (visible[i]) {
                    ctx.globalAlpha = p.opacity;
                    ctx.beginPath();
                    ctx.arc(sx, sy, p.radius, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            ctx.globalAlpha = 1;

            // Connections — batch into opacity buckets
            if (frameCount % 2 === 0) {
                const BUCKETS = 8;
                const buckets: { path: Path2D; alpha: number }[] = [];
                for (let k = 0; k < BUCKETS; k++) {
                    buckets[k] = { path: new Path2D(), alpha: (k + 1) / BUCKETS };
                }

                for (let i = 0; i < len; i++) {
                    if (!visible[i]) continue;
                    const ax = scrX[i];
                    const ay = scrY[i];

                    for (let j = i + 1; j < len; j++) {
                        if (!visible[j]) continue;
                        const ddx = ax - scrX[j];
                        const ddy = ay - scrY[j];
                        const distSq = ddx * ddx + ddy * ddy;

                        if (distSq < CONNECTION_DIST_SQ) {
                            const ratio = 1 - Math.sqrt(distSq) / CONNECTION_DISTANCE;
                            const bucket = Math.min(Math.floor(ratio * BUCKETS), BUCKETS - 1);
                            const p2d = buckets[bucket].path;
                            p2d.moveTo(ax, ay);
                            p2d.lineTo(scrX[j], scrY[j]);
                        }
                    }
                }

                ctx.strokeStyle = "rgb(28,31,58)";
                ctx.lineWidth = 0.5;
                for (let k = 0; k < BUCKETS; k++) {
                    ctx.globalAlpha = buckets[k].alpha * 0.1;
                    ctx.stroke(buckets[k].path);
                }
                ctx.globalAlpha = 1;
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        resizeCanvas();
        initParticles();
        animate();

        const onVisibility = () => {
            if (document.hidden) {
                cancelAnimationFrame(animationRef.current);
            } else {
                animate();
            }
        };

        const onResize = () => { resizeCanvas(); initParticles(); };
        window.addEventListener("resize", onResize, { passive: true });
        window.addEventListener("mousemove", onMouseMove, { passive: true });
        window.addEventListener("scroll", onScroll, { passive: true });
        document.addEventListener("mouseleave", onMouseLeave);
        document.addEventListener("visibilitychange", onVisibility);

        return () => {
            cancelAnimationFrame(animationRef.current);
            window.removeEventListener("resize", onResize);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("scroll", onScroll);
            document.removeEventListener("mouseleave", onMouseLeave);
            document.removeEventListener("visibilitychange", onVisibility);
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
                willChange: "contents",
            }}
        />
    );
}
