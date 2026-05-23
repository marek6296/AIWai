/**
 * MobileBackdrop — static CSS-only backdrop for the mobile homepage.
 * No canvas, no rAF, no framer-motion. Just layered gradients + grain.
 * iOS Safari renders this with zero main-thread cost.
 */
export default function MobileBackdrop() {
    return (
        <div
            aria-hidden="true"
            className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-char"
        >
            {/* Primary gold accent — top right */}
            <div
                className="absolute -top-40 -right-40 w-[460px] h-[460px] rounded-full"
                style={{
                    background:
                        "radial-gradient(circle, rgba(201,168,117,0.16) 0%, rgba(201,168,117,0.04) 40%, transparent 70%)",
                }}
            />

            {/* Secondary cool accent — bottom left */}
            <div
                className="absolute -bottom-32 -left-32 w-[380px] h-[380px] rounded-full"
                style={{
                    background:
                        "radial-gradient(circle, rgba(28,31,58,0.45) 0%, transparent 65%)",
                }}
            />

            {/* Mid-page warm glow — gives a frozen-streak feeling */}
            <div
                className="absolute top-[35%] left-1/2 -translate-x-1/2 w-[520px] h-[260px] rounded-[50%]"
                style={{
                    background:
                        "radial-gradient(ellipse, rgba(201,168,117,0.08) 0%, transparent 70%)",
                    filter: "blur(40px)",
                }}
            />

            {/* Diagonal gold streak — single static line, suggests the desktop flow-field */}
            <div
                className="absolute inset-0 opacity-[0.18]"
                style={{
                    backgroundImage:
                        "linear-gradient(115deg, transparent 38%, rgba(228,200,150,0.5) 50%, transparent 62%)",
                    backgroundSize: "200% 200%",
                    backgroundPosition: "60% 40%",
                }}
            />

            {/* Fine grain — adds texture without animation */}
            <div
                className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                }}
            />

            {/* Navbar fade — softens area behind sticky navbar */}
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-char/90 to-transparent" />
        </div>
    );
}
