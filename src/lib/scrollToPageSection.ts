"use client";

const getMaxScroll = () =>
    Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

const clampScroll = (top: number) => Math.min(Math.max(0, top), getMaxScroll());

export function scrollToPageSection(id: string, behavior: ScrollBehavior = "smooth") {
    if (typeof window === "undefined") return false;

    const flowTarget = document.querySelector<HTMLElement>(`[data-flow-anchor="${id}"]`);
    if (flowTarget) {
        const savedTop = Number(flowTarget.dataset.flowScrollTop);
        const top = Number.isFinite(savedTop) ? savedTop : flowTarget.offsetTop;

        window.scrollTo({
            top: clampScroll(top),
            behavior,
        });
        return true;
    }

    const el = document.getElementById(id);
    if (!el) return false;

    const navHeight = document.querySelector("nav")?.getBoundingClientRect().height ?? 80;
    const viewportH = window.innerHeight;
    const form = el.querySelector("form");

    if (form) {
        const formRect = form.getBoundingClientRect();
        const available = viewportH - navHeight;
        const offset = Math.max(24, (available - formRect.height) / 2);

        window.scrollTo({
            top: clampScroll(formRect.top + window.scrollY - navHeight - offset),
            behavior,
        });
        return true;
    }

    const heading = el.querySelector("h1, h2") as HTMLElement | null;
    const top = heading
        ? heading.getBoundingClientRect().top + window.scrollY - navHeight - 24
        : el.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({
        top: clampScroll(top),
        behavior,
    });
    return true;
}
