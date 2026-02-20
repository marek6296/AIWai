"use client";

import { useEffect } from "react";

export default function BodyReveal() {
    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);

        const handleReveal = () => {
            window.scrollTo(0, 0);
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 50);
        };

        if (document.readyState === 'complete') {
            handleReveal();
        } else {
            window.addEventListener('load', handleReveal);
            return () => window.removeEventListener('load', handleReveal);
        }
    }, []);

    return null;
}
