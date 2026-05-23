import React from "react";

function cx(...parts: Array<string | undefined | false | null>) {
    return parts.filter(Boolean).join(" ");
}

interface FlowSectionProps {
    children: React.ReactNode;
    className?: string;
    flowId?: string;
    "aria-label"?: string;
}

export function FlowSection({ children, className, flowId, "aria-label": ariaLabel }: FlowSectionProps) {
    return (
        <section
            data-flow-section
            data-flow-anchor={flowId}
            aria-label={ariaLabel}
            className={cx("relative w-full", className)}
        >
            {children}
        </section>
    );
}

interface FlowArtProps {
    children: React.ReactNode;
    className?: string;
    "aria-label"?: string;
}

export default function FlowArt({
    children,
    className,
    "aria-label": ariaLabel = "AIWai homepage",
}: FlowArtProps) {
    return (
        <main
            aria-label={ariaLabel}
            className={cx("relative w-full overflow-x-hidden", className)}
        >
            {children}
        </main>
    );
}
