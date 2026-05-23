"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import HomeDesktop from "@/components/home/HomeDesktop";
import HomeMobile from "@/components/home/MobileHome";

// useLayoutEffect warns on the server. Swap it for useEffect during SSR.
const useIsoLayoutEffect =
    typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * HomeRouter — chooses MobileHome or HomeDesktop based on viewport width.
 *
 * Strategy:
 *  - SSR renders the desktop tree, so search engines see the rich content.
 *  - On the client, useLayoutEffect runs BEFORE the browser's first paint,
 *    swapping in MobileHome on phones. That means HomeDesktop's heavy
 *    useEffects (FlowLines canvas, framer-motion infinite loops, …)
 *    never fire on mobile, because the desktop subtree is unmounted in
 *    the same React commit it was mounted in.
 *  - A resize listener handles the rare case where viewport crosses the
 *    breakpoint (e.g. orientation change, devtools toggle).
 */
export default function HomeRouter() {
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

    // Pre-resolution: render the desktop tree so SSR HTML carries the SEO
    // content and the client's first React commit matches the server (no
    // hydration mismatch). The layout effect above runs right after this
    // commit, so on mobile we swap before paint.
    if (!resolved) {
        return <HomeDesktop />;
    }

    return variant === "mobile" ? <HomeMobile /> : <HomeDesktop />;
}
