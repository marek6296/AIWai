"use client";

import { useEffect } from "react";

export default function BodyReveal() {
    useEffect(() => {
        // Lock scroll position on load
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }
        window.scrollTo(0, 0);

        const reveal = () => {
            window.scrollTo(0, 0);
            // Small delay: let Framer Motion register its initial states
            // before we fade in, so there's no visible 'snap'
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    document.body.style.opacity = "1";
                });
            });
        };

        if (document.readyState === "complete") {
            reveal();
        } else {
            window.addEventListener("load", reveal, { once: true });
        }
    }, []);

    return null;
}
