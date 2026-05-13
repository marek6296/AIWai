export default function GrainOverlay() {
    return (
        <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-[0.12] mix-blend-overlay animate-grain"
            style={{
                backgroundImage:
                    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.79  0 0 0 0 0.66  0 0 0 0 0.46  0 0 0 0.7 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
                backgroundSize: "220px 220px",
            }}
        />
    );
}
