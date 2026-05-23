"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import HomeBackdrop from "@/components/backgrounds/HomeBackdrop";
import MobileBackdrop from "@/components/home/MobileBackdrop";

// useLayoutEffect warns on the server. Swap it for useEffect during SSR.
const useIsoLayoutEffect =
    typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * AdaptiveBackdrop — picks the right backdrop for the viewport before paint.
 *
 *  - SSR + first commit: HomeBackdrop (matches existing prerendered HTML
 *    and keeps the rich desktop experience intact).
 *  - useLayoutEffect on the client: detect viewport before paint. On phones
 *    we unmount HomeBackdrop and mount MobileBackdrop instead, so the
 *    FlowLines canvas / grain / rAF loop never start up on mobile.
 *
 * Same trick as HomeRouter, scoped to just the backdrop so it can be
 * dropped into any page (cennik, realizacie, sluzby, …) without touching
 * the page tree.
 */
export default function AdaptiveBackdrop() {
    const [variant, setVariant] = useState<"desktop" | "mobile">("desktop");
    const [resolved, setResolved] = useState(false);

    useIsoLayoutEffect(() => {
        const mq = window.matchMedia("(max-width: 767px)");
        setVariant(mq.matches ? "mobile" : "desktop");
        setResolved(true);
    }, []);

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 767px)");
        const handler = (e: MediaQueryListEvent) =>
            setVariant(e.matches ? "mobile" : "desktop");
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    if (!resolved) {
        return <HomeBackdrop />;
    }

    return variant === "mobile" ? <MobileBackdrop /> : <HomeBackdrop />;
}
