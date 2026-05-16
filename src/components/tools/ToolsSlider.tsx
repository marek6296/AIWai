"use client";

type Tool = { name: string; slug: string };

const TOOLS: Tool[] = [
    { name: "Next.js", slug: "nextdotjs" },
    { name: "React", slug: "react" },
    { name: "TypeScript", slug: "typescript" },
    { name: "Tailwind CSS", slug: "tailwindcss" },
    { name: "Vercel", slug: "vercel" },
    { name: "Supabase", slug: "supabase" },
    { name: "Anthropic", slug: "anthropic" },
    { name: "n8n", slug: "n8n" },
    { name: "Vue", slug: "vuedotjs" },
    { name: "Flutter", slug: "flutter" },
    { name: "Framer", slug: "framer" },
    { name: "Railway", slug: "railway" },
    { name: "Figma", slug: "figma" },
];

const COLOR = "E4C896";

export default function ToolsSlider() {
    // duplicate twice for seamless loop
    const items = [...TOOLS, ...TOOLS];

    return (
        <section
            aria-label="Tools we use"
            className="relative w-full bg-char border-t border-b border-cream/10 py-2 md:py-3 overflow-hidden"
        >
            <div
                className="relative w-full overflow-hidden"
                style={{
                    WebkitMaskImage:
                        "linear-gradient(to right, transparent 0, #000 160px, #000 calc(100% - 160px), transparent 100%)",
                    maskImage:
                        "linear-gradient(to right, transparent 0, #000 160px, #000 calc(100% - 160px), transparent 100%)",
                }}
            >
                <div className="tools-track flex w-max items-center gap-[42px] md:gap-[64px] py-1">
                    {items.map((tool, i) => (
                        <div
                            key={`${tool.slug}-${i}`}
                            className="flex items-center gap-3 shrink-0 opacity-75"
                            title={tool.name}
                        >
                            <img
                                src={`https://cdn.simpleicons.org/${tool.slug}/${COLOR}`}
                                alt={tool.name}
                                width={28}
                                height={28}
                                loading="lazy"
                                className="h-6 md:h-7 w-auto select-none pointer-events-none"
                                draggable={false}
                            />
                            <span className="hidden md:inline text-sm font-semibold tracking-wide text-cream/70 whitespace-nowrap">
                                {tool.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes tools-marquee {
                    from { transform: translate3d(0, 0, 0); }
                    to { transform: translate3d(-50%, 0, 0); }
                }
                .tools-track {
                    animation: tools-marquee 60s linear infinite;
                    will-change: transform;
                }
                @media (prefers-reduced-motion: reduce) {
                    .tools-track { animation: none; }
                }
            `}</style>
        </section>
    );
}
