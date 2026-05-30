"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GooeyTextProps {
    texts: string[];
    morphTime?: number;
    cooldownTime?: number;
    className?: string;
    textClassName?: string;
    /**
     * Which renderer to use:
     *  - "auto" (default): gooey on desktop, plain crossfade on touch — the
     *    original responsive behaviour. PC HeroSection relies on this.
     *  - "gooey": force the SVG-threshold gooey morph everywhere (used by
     *    MobileHero so phones get the exact desktop melt animation).
     *  - "crossfade": force the plain opacity crossfade everywhere.
     */
    variant?: "auto" | "gooey" | "crossfade";
}

/**
 * Mobile variant — drops the SVG threshold filter and CSS blur (both stutter
 * badly on iOS Safari). Renders a clean opacity crossfade between texts.
 * Visually different but actually smooth on phones.
 */
function MobileGooeyText({
    texts,
    morphTime = 1,
    cooldownTime = 0.25,
    className,
    textClassName,
}: GooeyTextProps) {
    const [idx, setIdx] = React.useState(0);

    React.useEffect(() => {
        const cycleMs = Math.max(900, (morphTime + cooldownTime) * 1000);
        const id = window.setInterval(() => {
            setIdx((v) => (v + 1) % texts.length);
        }, cycleMs);
        return () => window.clearInterval(id);
    }, [texts.length, morphTime, cooldownTime]);

    return (
        <div className={cn("relative flex items-center justify-center", className)}>
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={idx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                        "select-none whitespace-nowrap text-center",
                        textClassName,
                    )}
                >
                    {texts[idx]}
                </motion.span>
            </AnimatePresence>
        </div>
    );
}

function DesktopGooeyText({
    texts,
    morphTime = 1,
    cooldownTime = 0.25,
    className,
    textClassName,
}: GooeyTextProps) {
    const text1Ref = React.useRef<HTMLSpanElement>(null);
    const text2Ref = React.useRef<HTMLSpanElement>(null);
    const filterId = React.useId().replace(/:/g, "");

    React.useEffect(() => {
        let textIndex = texts.length - 1;
        let time = new Date();
        let morph = 0;
        let cooldown = cooldownTime;
        let raf = 0;

        const setMorph = (fraction: number) => {
            if (!text1Ref.current || !text2Ref.current) return;
            text2Ref.current.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
            text2Ref.current.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

            const inv = 1 - fraction;
            text1Ref.current.style.filter = `blur(${Math.min(8 / inv - 8, 100)}px)`;
            text1Ref.current.style.opacity = `${Math.pow(inv, 0.4) * 100}%`;
        };

        const doCooldown = () => {
            morph = 0;
            if (!text1Ref.current || !text2Ref.current) return;
            text2Ref.current.style.filter = "";
            text2Ref.current.style.opacity = "100%";
            text1Ref.current.style.filter = "";
            text1Ref.current.style.opacity = "0%";
        };

        const doMorph = () => {
            morph -= cooldown;
            cooldown = 0;
            let fraction = morph / morphTime;

            if (fraction > 1) {
                cooldown = cooldownTime;
                fraction = 1;
            }

            setMorph(fraction);
        };

        const animate = () => {
            raf = requestAnimationFrame(animate);
            const newTime = new Date();
            const shouldIncrementIndex = cooldown > 0;
            const dt = (newTime.getTime() - time.getTime()) / 1000;
            time = newTime;

            cooldown -= dt;

            if (cooldown <= 0) {
                if (shouldIncrementIndex) {
                    textIndex = (textIndex + 1) % texts.length;
                    if (text1Ref.current && text2Ref.current) {
                        text1Ref.current.textContent = texts[textIndex % texts.length];
                        text2Ref.current.textContent = texts[(textIndex + 1) % texts.length];
                    }
                }
                doMorph();
            } else {
                doCooldown();
            }
        };

        animate();
        return () => cancelAnimationFrame(raf);
    }, [texts, morphTime, cooldownTime]);

    return (
        <div className={cn("relative", className)}>
            <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
                <defs>
                    <filter id={`gooey-threshold-${filterId}`}>
                        <feColorMatrix
                            in="SourceGraphic"
                            type="matrix"
                            values="1 0 0 0 0
                                    0 1 0 0 0
                                    0 0 1 0 0
                                    0 0 0 255 -140"
                        />
                    </filter>
                </defs>
            </svg>

            <div
                className="flex h-full items-center justify-center"
                style={{ filter: `url(#gooey-threshold-${filterId})` }}
            >
                <span
                    ref={text1Ref}
                    className={cn(
                        "absolute inline-block select-none whitespace-nowrap text-center",
                        textClassName,
                    )}
                >
                    {texts[texts.length - 1]}
                </span>
                <span
                    ref={text2Ref}
                    className={cn(
                        "absolute inline-block select-none whitespace-nowrap text-center",
                        textClassName,
                    )}
                >
                    {texts[0]}
                </span>
            </div>
        </div>
    );
}

export function GooeyText(props: GooeyTextProps) {
    const { variant = "auto", ...rest } = props;

    // Picking a variant is a one-time decision per mount — no resize listener
    // needed since rotating a phone won't usefully switch effect modes.
    const [isTouch, setIsTouch] = React.useState<boolean | null>(null);

    React.useEffect(() => {
        const touch =
            window.matchMedia("(hover: none)").matches ||
            window.innerWidth < 768;
        setIsTouch(touch);
    }, []);

    // Explicit overrides skip the touch sniff entirely (and render the same on
    // SSR + client, so no first-paint flash).
    if (variant === "gooey") return <DesktopGooeyText {...rest} />;
    if (variant === "crossfade") return <MobileGooeyText {...rest} />;

    // SSR + first paint: render the desktop variant by default (no flash on
    // PC) but with the text already visible so mobile is never blank.
    if (isTouch === null) {
        return (
            <div className={cn("relative flex items-center justify-center", rest.className)}>
                <span
                    className={cn(
                        "select-none whitespace-nowrap text-center",
                        rest.textClassName,
                    )}
                >
                    {rest.texts[0]}
                </span>
            </div>
        );
    }

    return isTouch ? <MobileGooeyText {...rest} /> : <DesktopGooeyText {...rest} />;
}
