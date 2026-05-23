"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface IconConfig {
    id: number;
    slug: string;   // simpleicons.org slug
    name: string;   // tooltip / alt
    className: string;
    size?: "sm" | "md" | "lg";
}

// Brand logos served from /public/brands/ (downloaded locally so Safari
// doesn't block cross-origin SVGs — the simpleicons.org CDN delivers
// `image/svg+xml` that Safari refuses to render in some configurations).

const ICONS: IconConfig[] = [
    { id: 1, slug: "openai", name: "OpenAI", className: "top-[10%] right-[34%] hidden md:block", size: "sm" },
    { id: 2, slug: "anthropic", name: "Anthropic", className: "top-[14%] right-[8%]", size: "lg" },
    { id: 3, slug: "vercel", name: "Vercel", className: "top-[30%] right-[24%] hidden md:block", size: "md" },
    { id: 4, slug: "nextdotjs", name: "Next.js", className: "top-[38%] right-[5%] hidden md:block", size: "md" },
    { id: 5, slug: "supabase", name: "Supabase", className: "top-[55%] right-[18%] hidden md:block", size: "lg" },
    { id: 6, slug: "n8n", name: "n8n", className: "top-[64%] right-[6%]", size: "md" },
    { id: 7, slug: "tailwindcss", name: "Tailwind CSS", className: "top-[80%] right-[24%] hidden md:block", size: "md" },
    { id: 8, slug: "figma", name: "Figma", className: "top-[86%] right-[10%]", size: "sm" },
];

const SIZE_BADGE: Record<NonNullable<IconConfig["size"]>, string> = {
    sm: "w-12 h-12 md:w-14 md:h-14 p-2.5",
    md: "w-14 h-14 md:w-16 md:h-16 p-3",
    lg: "w-16 h-16 md:w-[72px] md:h-[72px] p-3.5",
};

const SIZE_LOGO: Record<NonNullable<IconConfig["size"]>, string> = {
    sm: "w-5 h-5 md:w-6 md:h-6",
    md: "w-6 h-6 md:w-7 md:h-7",
    lg: "w-7 h-7 md:w-8 md:h-8",
};

function FloatingIcon({
    cfg,
    index,
    mouseX,
    mouseY,
    enableRepel,
}: {
    cfg: IconConfig;
    index: number;
    mouseX: React.MutableRefObject<number>;
    mouseY: React.MutableRefObject<number>;
    enableRepel: boolean;
}) {
    const ref = React.useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 280, damping: 22 });
    const springY = useSpring(y, { stiffness: 280, damping: 22 });

    React.useEffect(() => {
        if (!enableRepel) return;
        let raf = 0;
        const tick = () => {
            const el = ref.current;
            if (el) {
                const rect = el.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = mouseX.current - cx;
                const dy = mouseY.current - cy;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const RANGE = 170;
                if (dist < RANGE && dist > 0) {
                    const angle = Math.atan2(dy, dx);
                    const force = (1 - dist / RANGE) * 70;
                    x.set(-Math.cos(angle) * force);
                    y.set(-Math.sin(angle) * force);
                } else {
                    x.set(0);
                    y.set(0);
                }
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [x, y, mouseX, mouseY, enableRepel]);

    const size = cfg.size ?? "md";

    return (
        <motion.div
            ref={ref}
            style={{ x: springX, y: springY }}
            initial={{ opacity: 0, scale: 0.55 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                delay: 0.4 + index * 0.09,
                duration: 0.75,
                ease: [0.22, 1, 0.36, 1],
            }}
            className={`absolute ${cfg.className}`}
            title={cfg.name}
        >
            <motion.div
                className={`relative flex items-center justify-center ${SIZE_BADGE[size]} rounded-2xl border border-cream/10 bg-char-soft/60 backdrop-blur-sm shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] ring-1 ring-inset ring-cream/[0.04]`}
                animate={{
                    y: [0, -10, 0, 10, 0],
                    x: [0, 7, 0, -7, 0],
                    rotate: [0, 4, 0, -4, 0],
                }}
                transition={{
                    duration: 6 + (cfg.id % 4) * 1.3,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                    delay: cfg.id * 0.15,
                }}
            >
                {/* subtle gold inner glow */}
                <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(120%_120%_at_30%_15%,rgba(228,200,150,0.18),transparent_60%)]"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={`/brands/${cfg.slug}.svg`}
                    alt={cfg.name}
                    width={32}
                    height={32}
                    draggable={false}
                    className={`relative ${SIZE_LOGO[size]} object-contain select-none drop-shadow-[0_0_8px_rgba(228,200,150,0.35)]`}
                />
            </motion.div>
        </motion.div>
    );
}

export default function FloatingServiceIcons() {
    const mouseX = React.useRef(0);
    const mouseY = React.useRef(0);
    const [enableRepel, setEnableRepel] = React.useState(false);

    React.useEffect(() => {
        const isTouch =
            window.matchMedia("(hover: none)").matches || window.innerWidth < 768;
        if (isTouch) return;
        setEnableRepel(true);

        const onMove = (e: MouseEvent) => {
            mouseX.current = e.clientX;
            mouseY.current = e.clientY;
        };
        window.addEventListener("mousemove", onMove, { passive: true });
        return () => window.removeEventListener("mousemove", onMove);
    }, []);

    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
        >
            {ICONS.map((cfg, i) => (
                <FloatingIcon
                    key={cfg.id}
                    cfg={cfg}
                    index={i}
                    mouseX={mouseX}
                    mouseY={mouseY}
                    enableRepel={enableRepel}
                />
            ))}
        </div>
    );
}
