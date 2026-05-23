"use client";

import { motion, useSpring } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";

type Mouse = { x: number | null; y: number | null };

function Spark({
    mouse,
    containerRef,
}: {
    mouse: Mouse;
    containerRef: React.RefObject<HTMLDivElement>;
}) {
    const [initial] = useState(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: 1 + Math.random() * 2,
        duration: 2 + Math.random() * 3,
        delay: Math.random() * 5,
    }));

    const springConfig = { stiffness: 100, damping: 15, mass: 0.1 };
    const springX = useSpring(0, springConfig);
    const springY = useSpring(0, springConfig);

    useEffect(() => {
        if (!containerRef.current || mouse.x === null || mouse.y === null) {
            springX.set(0);
            springY.set(0);
            return;
        }
        const rect = containerRef.current.getBoundingClientRect();
        const starX = rect.left + (parseFloat(initial.left) / 100) * rect.width;
        const starY = rect.top + (parseFloat(initial.top) / 100) * rect.height;
        const dx = mouse.x - starX;
        const dy = mouse.y - starY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = 500;
        if (dist < radius) {
            const force = 1 - dist / radius;
            springX.set(dx * force * 0.45);
            springY.set(dy * force * 0.45);
        } else {
            springX.set(0);
            springY.set(0);
        }
    }, [mouse, initial, containerRef, springX, springY]);

    return (
        <motion.div
            aria-hidden="true"
            className="absolute rounded-full bg-gold"
            style={{
                top: initial.top,
                left: initial.left,
                width: initial.size,
                height: initial.size,
                x: springX,
                y: springY,
                boxShadow: "0 0 6px rgba(201,168,117,0.5)",
                willChange: "transform",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
                duration: initial.duration,
                repeat: Infinity,
                delay: initial.delay,
            }}
        />
    );
}

/**
 * InteractiveStarfield — gold spark particles that lean toward the cursor.
 * Wrap the section with a ref + mouse handlers (or use <InteractiveStarfieldContainer/>).
 */
export function InteractiveStarfield({
    mouse,
    containerRef,
    count = 80,
}: {
    mouse: Mouse;
    containerRef: React.RefObject<HTMLDivElement>;
    count?: number;
}) {
    // Cut spark count on mobile — 80 infinite opacity animations =
    // measurable battery drain + iOS Safari jank during scroll.
    const [effectiveCount, setEffectiveCount] = useState(count);
    useEffect(() => {
        const apply = () => {
            const isMobile = window.innerWidth < 768;
            setEffectiveCount(isMobile ? Math.min(count, 30) : count);
        };
        apply();
        window.addEventListener("resize", apply);
        return () => window.removeEventListener("resize", apply);
    }, [count]);
    const sparks = useMemo(() => Array.from({ length: effectiveCount }), [effectiveCount]);
    return (
        <div
            aria-hidden="true"
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ transform: "translateZ(0)" }}
        >
            {sparks.map((_, i) => (
                <Spark key={i} mouse={mouse} containerRef={containerRef} />
            ))}
        </div>
    );
}

/**
 * Self-contained variant — drop into any positioned parent.
 * Tracks the pointer globally so sparks react even when overlaid behind content.
 */
export default function InteractiveStarfieldLayer({ count = 80 }: { count?: number }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mouse, setMouse] = useState<Mouse>({ x: null, y: null });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const onMove = (e: PointerEvent) => setMouse({ x: e.clientX, y: e.clientY });
        const onLeave = () => setMouse({ x: null, y: null });
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerleave", onLeave);
        return () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerleave", onLeave);
        };
    }, []);

    return (
        <div ref={containerRef} aria-hidden="true" className="absolute inset-0 pointer-events-none">
            {mounted && <InteractiveStarfield mouse={mouse} containerRef={containerRef} count={count} />}
        </div>
    );
}
