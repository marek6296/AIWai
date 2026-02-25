"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import WaveBackground from "@/components/backgrounds/WaveBackground";
import MagneticButton from "@/components/ui/MagneticButton";
import RetellVoice from "@/components/chat/RetellVoice";

export default function HeroSection() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Intro timeline
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            // Initial state
            gsap.set("#hero-text", { autoAlpha: 0, y: 30 });
            gsap.set("#hero-wave", { opacity: 0 });
            gsap.set("#hero-video", { opacity: 0, scale: 0.9, filter: "blur(10px)" });

            // 1. Hexagon outline draws
            tl.to("#hero-hexagon path", {
                strokeDashoffset: 0,
                duration: 2,
                ease: "power2.inOut",
            })
                // 3. Text reveals smoothly
                .to("#hero-text", {
                    autoAlpha: 1,
                    y: 0,
                    duration: 1.5,
                    stagger: 0.2,
                }, "-=1.5")
                // 4. Video reveals as the final step
                .to("#hero-video", {
                    opacity: 1,
                    scale: 1,
                    filter: "blur(0px)",
                    duration: 2,
                    ease: "power2.out"
                }, ">-0.5"); // Starts slightly after text reveal begins
        });

        // Loop Transition Logic - White Flash
        const checkTime = () => {
            if (videoRef.current && overlayRef.current) {
                const vid = videoRef.current;
                const t = vid.currentTime;
                const d = vid.duration;
                if (!d) return;

                const fadeTime = 0.5; // Duration of fade in seconds

                // Opacity calculation: 1 at ends, 0 in middle
                let opacity = 0;

                if (t < fadeTime) {
                    // Fading out at start
                    opacity = 1 - (t / fadeTime);
                } else if (t > d - fadeTime) {
                    // Fading in at end
                    opacity = (t - (d - fadeTime)) / fadeTime;
                }

                overlayRef.current.style.opacity = opacity.toString();
            }
        };

        gsap.ticker.add(checkTime);

        return () => {
            ctx.revert(); // Clean up GSAP context on unmount
            gsap.ticker.remove(checkTime);
        };
    }, []);

    return (
        <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-white">
            {/* Background Wave - Controlled by GSAP */}
            <div id="hero-wave" className="absolute inset-0 opacity-20">
                <WaveBackground />
            </div>

            {/* Center Hexagon & Logo */}
            <div className="relative z-10 flex flex-col items-center justify-center">
                <div className="relative w-[300px] h-[300px] flex items-center justify-center">
                    {/* SVG Hexagon */}
                    <svg
                        viewBox="0 0 100 100"
                        className="absolute inset-0 w-full h-full drop-shadow-[0_0_15px_rgba(216,185,138,0.3)]"
                    >
                        <path
                            id="hero-hexagon"
                            d="M50 5 L89 27.5 L89 72.5 L50 95 L11 72.5 L11 27.5 Z"
                            fill="none"
                            stroke="#D8B98A" // Brand Sand
                            strokeWidth="0.5"
                            strokeDasharray="300"
                            strokeDashoffset="300"
                        />
                    </svg>

                    {/* Logo / Wave Content */}
                    <div className="w-1/2 h-1/2 bg-brand-sand/10 rounded-full blur-2xl absolute animate-pulse" />

                    {/* Intro Video - Reverting to stable clipping version with expanded bounds */}
                    <video
                        id="hero-video"
                        ref={videoRef}
                        src="/intro.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                        style={{
                            clipPath: "polygon(50% 2%, 98% 26%, 98% 74%, 50% 98%, 2% 74%, 2% 26%)",
                            mixBlendMode: "multiply",
                            transform: "scale(1.02) translateZ(0)",
                            backfaceVisibility: "hidden",
                            filter: "contrast(1.05)",
                            willChange: "transform, opacity"
                        }}
                    />

                    {/* Loop Transition Overlay */}
                    <div
                        ref={overlayRef}
                        className="absolute inset-0 bg-white pointer-events-none opacity-0 z-20"
                        style={{
                            clipPath: "polygon(50% 2%, 98% 26%, 98% 74%, 50% 98%, 2% 74%, 2% 26%)",
                            mixBlendMode: "overlay"
                        }}
                    />
                </div>

                {/* Text Overlay - Controlled by GSAP */}
                <div id="hero-text" className="mt-12 text-center opacity-0 translate-y-8">
                    <h1 className="text-4xl md:text-6xl font-sans font-bold tracking-tight text-brand-indigo mb-4">
                        AIWai
                    </h1>
                    <p className="text-brand-indigo/60 uppercase tracking-[0.2em] text-sm md:text-base">
                        Intelligent Digital Architecture
                    </p>

                    {/* Button container */}
                    <div className="mt-8 flex items-center justify-center gap-4 flex-col sm:flex-row">
                        <MagneticButton onClick={() => {
                            const element = document.getElementById('contact');
                            if (element) {
                                gsap.to(window, {
                                    duration: 2.5,
                                    scrollTo: { y: element, offsetY: 0 },
                                    ease: "power4.inOut"
                                });
                            }
                        }}>
                            Contact Us
                        </MagneticButton>
                        <RetellVoice />
                    </div>
                </div>
            </div>

            {/* Overlay Gradient - Light version */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white pointer-events-none" />
        </section>
    );
}
