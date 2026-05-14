"use client";

/**
 * DeferredShell — delays mounting of heavy components until
 * the browser's main thread is idle after initial hydration.
 *
 * Particle triangles have been removed; sections now provide their own
 * lightweight animated backgrounds (HexagonOverlay, gold-vlines, glows).
 */

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

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
            <ScrollProgress />
            <Chatbot />
        </>
    );
}
