"use client";

/**
 * DeferredShell — delays mounting of heavy background components until
 * the browser's main thread is idle after initial hydration.
 *
 * WHY: ParticleField runs a 140-particle RAF loop and Chatbot runs a
 * walking RAF loop. Mounting them immediately competes with React hydration
 * and hero animations for main-thread time. Deferring by ~1 s (or until
 * the browser is truly idle via requestIdleCallback) gives the critical
 * above-the-fold content a clear run first.
 *
 * The components are not visible during this 1-second window anyway:
 * particles are a background effect and the chatbot appears bottom-right.
 */

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ParticleField  = dynamic(() => import("@/components/backgrounds/ParticleField"),  { ssr: false });
const ScrollProgress = dynamic(() => import("@/components/ui/ScrollProgress"),          { ssr: false });
const Chatbot        = dynamic(() => import("@/components/chat/Chatbot"),               { ssr: false });

export default function DeferredShell() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ric = (window as any).requestIdleCallback as
            | ((cb: () => void, opts: { timeout: number }) => number)
            | undefined;

        if (ric) {
            // Fire when browser is idle; at most 1.5 s from now.
            const id = ric(() => setReady(true), { timeout: 1500 });
            return () => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (window as any).cancelIdleCallback(id);
            };
        }

        // Safari / fallback: fixed 1-second delay
        const id = setTimeout(() => setReady(true), 1000);
        return () => clearTimeout(id);
    }, []);

    if (!ready) return null;

    return (
        <>
            <ParticleField />
            <ScrollProgress />
            <Chatbot />
        </>
    );
}
