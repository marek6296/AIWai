"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Plus, ArrowUpRight, ExternalLink, Mail, Phone } from "lucide-react";
import ReactMarkdown, { type Components } from "react-markdown";
import Link from "next/link";
import { useTranslation } from "@/i18n/useTranslation";

// Custom markdown components — site lacks @tailwindcss/typography, so style
// every node explicitly. Keeps message bubbles consistent and visually rich.
const MD_COMPONENTS: Components = {
    h1: ({ children }) => (
        <h3 className="mt-3 mb-2 font-display text-base font-bold tracking-tight text-cream first:mt-0">{children}</h3>
    ),
    h2: ({ children }) => (
        <h3 className="mt-3 mb-2 font-display text-[15px] font-bold tracking-tight text-cream first:mt-0">{children}</h3>
    ),
    h3: ({ children }) => (
        <h4 className="mt-3 mb-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-gold/85 first:mt-0">{children}</h4>
    ),
    h4: ({ children }) => (
        <h5 className="mt-2 mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-gold/75 first:mt-0">{children}</h5>
    ),
    p: ({ children }) => <p className="my-1.5 leading-relaxed text-cream/85 first:mt-0 last:mb-0">{children}</p>,
    ul: ({ children }) => <ul className="my-2 space-y-1.5 first:mt-0 last:mb-0">{children}</ul>,
    ol: ({ children }) => <ol className="my-2 list-decimal space-y-1.5 pl-5 first:mt-0 last:mb-0">{children}</ol>,
    li: ({ children }) => (
        <li className="relative flex gap-2 pl-0 leading-relaxed text-cream/85">
            <span aria-hidden="true" className="mt-[7px] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gold/70" />
            <span className="min-w-0 flex-1">{children}</span>
        </li>
    ),
    strong: ({ children }) => <strong className="font-semibold text-cream">{children}</strong>,
    em: ({ children }) => <em className="text-cream/95">{children}</em>,
    code: ({ children }) => (
        <code className="rounded bg-cream/[0.07] px-1 py-0.5 text-[12px] text-gold/95">{children}</code>
    ),
    a: ({ href, children }) => (
        <a
            href={href}
            target={href?.startsWith("http") ? "_blank" : undefined}
            rel={href?.startsWith("http") ? "noreferrer noopener" : undefined}
            className="text-gold underline-offset-2 hover:underline"
        >
            {children}
        </a>
    ),
    hr: () => <hr className="my-3 border-cream/[0.08]" />,
    blockquote: ({ children }) => (
        <blockquote className="my-2 border-l-2 border-gold/40 pl-3 text-cream/75 italic">{children}</blockquote>
    ),
};

type Segment =
    | { type: "md"; text: string }
    | { type: "action"; label: string; target: string };

interface Message {
    role: "user" | "assistant" | "system";
    content: string;
    chips?: string[];
    segments?: Segment[];
    displayContent?: string;
}

function parseChips(raw: string): { display: string; chips: string[] } {
    const re = /\[(?:NÁVRHY|NAVRHY|SUGGESTIONS?)\s*:\s*([^\]]+)\]\s*$/i;
    const match = raw.match(re);
    if (!match || match.index === undefined) return { display: raw.trim(), chips: [] };
    const chips = match[1]
        .split(/[•|;]/)
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 4);
    const display = raw.slice(0, match.index).trim();
    return { display, chips };
}

/**
 * Parse [ACTION: Label | target] markers into ordered segments so they
 * can be rendered as inline buttons inside the message bubble.
 */
function parseSegments(raw: string): Segment[] {
    const segments: Segment[] = [];
    const re = /\[ACTION\s*:\s*([^|\]]+?)\s*\|\s*([^\]]+?)\s*\]/gi;
    let lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(raw)) !== null) {
        if (m.index > lastIndex) {
            const text = raw.slice(lastIndex, m.index);
            if (text.trim()) segments.push({ type: "md", text });
        }
        segments.push({ type: "action", label: m[1].trim(), target: m[2].trim() });
        lastIndex = m.index + m[0].length;
    }
    if (lastIndex < raw.length) {
        const text = raw.slice(lastIndex);
        if (text.trim()) segments.push({ type: "md", text });
    }
    // Collapse: if no actions matched, return a single md segment
    if (segments.length === 0) segments.push({ type: "md", text: raw });
    return segments;
}

function actionTargetKind(target: string): "internal" | "external" | "mailto" | "tel" | "query" {
    if (target.startsWith("?")) return "query";
    if (target.startsWith("mailto:")) return "mailto";
    if (target.startsWith("tel:")) return "tel";
    if (target.startsWith("http://") || target.startsWith("https://")) return "external";
    return "internal";
}

function ActionButton({
    label,
    target,
    onQuery,
    onClose,
}: {
    label: string;
    target: string;
    onQuery: (text: string) => void;
    onClose: () => void;
}) {
    const kind = actionTargetKind(target);
    const Icon =
        kind === "external" ? ExternalLink : kind === "mailto" ? Mail : kind === "tel" ? Phone : ArrowUpRight;

    const base =
        "group inline-flex items-center justify-between gap-3 w-full rounded-xl border border-gold/30 bg-gradient-to-b from-gold/[0.10] to-gold/[0.04] px-3.5 py-2.5 text-left text-sm font-medium text-cream/95 transition-all hover:-translate-y-0.5 hover:border-gold/55 hover:from-gold/[0.18] hover:to-gold/[0.06] hover:text-cream";

    const content = (
        <>
            <span className="truncate">{label}</span>
            <Icon className="h-3.5 w-3.5 shrink-0 text-gold transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </>
    );

    if (kind === "query") {
        return (
            <button
                type="button"
                onClick={() => onQuery(target.slice(1))}
                className={base}
            >
                {content}
            </button>
        );
    }
    if (kind === "internal") {
        return (
            <Link
                href={target}
                onClick={() => onClose()}
                className={base}
            >
                {content}
            </Link>
        );
    }
    // external, mailto, tel
    return (
        <a
            href={target}
            target={kind === "external" ? "_blank" : undefined}
            rel={kind === "external" ? "noreferrer noopener" : undefined}
            className={base}
        >
            {content}
        </a>
    );
}

export default function Chatbot() {
    const { t, lang } = useTranslation();

    const initialChips = useMemo(
        () => [
            t("chatbot.suggestion.web"),
            t("chatbot.suggestion.chatbot"),
            t("chatbot.suggestion.automation"),
            t("chatbot.suggestion.pricing"),
        ],
        [t],
    );

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [reveal, setReveal] = useState(false);
    const [isWideStable, setIsWideStable] = useState(false);
    const [beamActive, setBeamActive] = useState(false);

    useEffect(() => {
        const id = setTimeout(() => setReveal(true), 5300);
        return () => clearTimeout(id);
    }, []);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const sessionIdRef = useRef<string>("");
    const dockRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Fresh session ID on every mount → refresh = clean conversation,
        // both in UI (messages state starts empty) and in admin Supabase logs
        // (each page-load creates a new chatbot_conversations row).
        sessionIdRef.current = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    }, []);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            const max = 120;
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, max)}px`;
        }
    }, [input]);

    useEffect(() => {
        // Small delay so the new message has time to mount and start its
        // entrance animation before we scroll to it — feels less abrupt.
        const id = requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
        });
        return () => cancelAnimationFrame(id);
    }, [messages, isLoading]);

    useEffect(() => {
        const wide = isExpanded || isFocused || input.trim().length > 0;
        if (wide) {
            setIsWideStable(true);
        } else {
            const id = setTimeout(() => setIsWideStable(false), 650);
            return () => clearTimeout(id);
        }
    }, [isExpanded, isFocused, input]);

    useEffect(() => {
        if (!reveal) return;
        if (isExpanded) {
            setBeamActive(false);
            return;
        }
        const id = setTimeout(() => setBeamActive(true), 900);
        return () => clearTimeout(id);
    }, [reveal, isExpanded]);

    useEffect(() => {
        if (!isExpanded) return;
        const onPointerDown = (event: MouseEvent | TouchEvent) => {
            const target = event.target as Node | null;
            if (target && dockRef.current && !dockRef.current.contains(target)) {
                setIsExpanded(false);
                textareaRef.current?.blur();
            }
        };
        document.addEventListener("mousedown", onPointerDown);
        document.addEventListener("touchstart", onPointerDown);
        return () => {
            document.removeEventListener("mousedown", onPointerDown);
            document.removeEventListener("touchstart", onPointerDown);
        };
    }, [isExpanded]);

    const sendMessage = async (text: string) => {
        if (!text.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: text, displayContent: text };
        const newMessages: Message[] = [...messages, userMessage];

        setMessages(newMessages);
        setInput("");
        setIsLoading(true);
        if (!isExpanded) setIsExpanded(true);

        const apiMessages = newMessages.map((m) => ({ role: m.role, content: m.content }));

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: apiMessages,
                    sessionId: sessionIdRef.current,
                    language: lang,
                }),
            });

            if (!response.ok) throw new Error("Failed to fetch");

            const data = await response.json();
            const rawContent: string = data.message?.content ?? "";
            const { display, chips } = parseChips(rawContent);
            const segments = parseSegments(display);

            setMessages([
                ...newMessages,
                { role: "assistant", content: rawContent, displayContent: display, chips, segments },
            ]);
        } catch {
            const fallback = t("chatbot.error.network");
            setMessages([
                ...newMessages,
                {
                    role: "assistant",
                    content: fallback,
                    displayContent: fallback,
                    chips: [],
                    segments: [{ type: "md", text: fallback }],
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    };

    const [selectedChip, setSelectedChip] = useState<string | null>(null);

    const handleChip = (chip: string) => {
        const clean = chip.replace(/^[^\wÀ-ɏ]+/, "").trim();
        // Visual cue before send — the chip flashes "selected" and other
        // chips fade out, then the message slides in with the standard
        // entrance animation we already wire up for user messages.
        setSelectedChip(chip);
        setTimeout(() => {
            sendMessage(clean);
            setSelectedChip(null);
        }, 220);
    };

    const closePanel = () => {
        setIsExpanded(false);
        textareaRef.current?.blur();
    };

    const lastMsg = messages[messages.length - 1];
    const activeChips =
        lastMsg?.role === "assistant" && lastMsg.chips?.length
            ? lastMsg.chips
            : messages.length === 0
              ? initialChips
              : [];

    if (!reveal) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none fixed inset-x-0 bottom-3 z-50 flex justify-center px-3 md:bottom-5"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
            <div
                ref={dockRef}
                className={`pointer-events-auto w-full font-display transition-[max-width] duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isWideStable ? "max-w-[760px]" : "max-w-[380px] md:max-w-[320px]"
                }`}
            >
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            key="chat-panel"
                            initial={{ opacity: 0, y: 14, scaleY: 0.85, scaleX: 0.97 }}
                            animate={{ opacity: 1, y: 0, scaleY: 1, scaleX: 1 }}
                            exit={{ opacity: 0, y: 10, scaleY: 0.9, scaleX: 0.98 }}
                            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                            className="mb-2 overflow-hidden origin-bottom will-change-transform"
                            style={{ transformOrigin: "bottom center" }}
                        >
                            <div className="relative overflow-hidden rounded-[18px] border border-cream/[0.08] bg-char/95 backdrop-blur-3xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.95)] ring-1 ring-gold/[0.08]">
                                <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

                                <div className="flex items-center justify-between gap-3 border-b border-cream/[0.06] bg-char px-4 py-3">
                                    <div className="flex items-center gap-2.5">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src="/logo-v2.png"
                                            alt="AIWai"
                                            width={28}
                                            height={28}
                                            className="h-5 w-auto select-none object-contain"
                                            draggable={false}
                                        />
                                        <span className="text-[13px] font-semibold tracking-tight text-cream/90">Assistant</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={closePanel}
                                        aria-label="Zavrieť"
                                        className="flex h-7 w-7 items-center justify-center rounded-full text-cream/50 transition-colors hover:bg-cream/[0.06] hover:text-cream"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                </div>

                                <div className="relative max-h-[60vh] overflow-y-auto bg-char px-4 py-5 md:px-5 [scrollbar-width:thin]">
                                    {messages.length === 0 ? (
                                        <div className="flex flex-col gap-5 py-4">
                                            <div className="space-y-1.5 text-center">
                                                <h3 className="font-display text-xl font-bold tracking-tight text-cream md:text-2xl">
                                                    Ako vám môžeme pomôcť?
                                                </h3>
                                                <p className="text-xs text-cream/55">
                                                    Vyberte si otázku alebo napíšte vlastnú.
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                {initialChips.map((chip, i) => {
                                                    const clean = chip.replace(/^[^\wÀ-ɏ]+\s*/, "").trim();
                                                    const isSelected = selectedChip === chip;
                                                    const isOther = selectedChip !== null && !isSelected;
                                                    return (
                                                        <motion.button
                                                            key={chip}
                                                            type="button"
                                                            onClick={() => handleChip(chip)}
                                                            disabled={selectedChip !== null}
                                                            initial={{ opacity: 0, y: 8 }}
                                                            animate={{
                                                                opacity: isOther ? 0.15 : 1,
                                                                y: 0,
                                                                scale: isSelected ? 1.04 : 1,
                                                            }}
                                                            transition={{
                                                                duration: isSelected || isOther ? 0.2 : 0.45,
                                                                delay: selectedChip ? 0 : i * 0.06,
                                                                ease: [0.22, 1, 0.36, 1],
                                                            }}
                                                            whileHover={
                                                                selectedChip ? undefined : { y: -2, scale: 1.01 }
                                                            }
                                                            whileTap={{ scale: 0.97 }}
                                                            className={`group relative overflow-hidden rounded-xl border px-3.5 py-3 text-left text-sm leading-snug transition-colors ${
                                                                isSelected
                                                                    ? "border-gold/60 bg-gold/[0.12] text-cream shadow-[0_0_24px_-6px_rgba(201,168,117,0.45)]"
                                                                    : "border-cream/[0.07] bg-cream/[0.02] text-cream/80 hover:border-gold/35 hover:bg-gold/[0.04] hover:text-cream"
                                                            }`}
                                                        >
                                                            <span
                                                                aria-hidden="true"
                                                                className={`pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(120%_120%_at_0%_0%,rgba(201,168,117,0.18),transparent_60%)] transition-opacity ${
                                                                    isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                                                }`}
                                                            />
                                                            <span className="relative">{clean}</span>
                                                        </motion.button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <ul className="space-y-4">
                                                <AnimatePresence initial={false}>
                                                    {messages.map((msg, idx) => {
                                                        const isUser = msg.role === "user";
                                                        return (
                                                            <motion.li
                                                                key={idx}
                                                                layout="position"
                                                                initial={{
                                                                    opacity: 0,
                                                                    y: 14,
                                                                    x: isUser ? 18 : -18,
                                                                    scale: 0.96,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    y: 0,
                                                                    x: 0,
                                                                    scale: 1,
                                                                }}
                                                                style={{ willChange: "transform, opacity" }}
                                                                transition={{
                                                                    type: "spring",
                                                                    damping: 26,
                                                                    stiffness: 280,
                                                                    mass: 0.7,
                                                                }}
                                                                className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
                                                            >
                                                                {!isUser && (
                                                                    <motion.div
                                                                        initial={{ scale: 0, rotate: -45, opacity: 0 }}
                                                                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                                                        transition={{
                                                                            type: "spring",
                                                                            damping: 14,
                                                                            stiffness: 320,
                                                                            delay: 0.05,
                                                                        }}
                                                                        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold/35 bg-gradient-to-b from-gold/[0.15] to-gold/[0.04]"
                                                                    >
                                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                        <img
                                                                            src="/logo-v2.png"
                                                                            alt="AIWai"
                                                                            width={20}
                                                                            height={20}
                                                                            className="h-4 w-auto object-contain select-none"
                                                                            draggable={false}
                                                                        />
                                                                    </motion.div>
                                                                )}
                                                                <div
                                                                    className={`max-w-[85%] rounded-2xl text-[14px] leading-relaxed ${
                                                                        isUser
                                                                            ? "border border-gold/25 bg-gold/12 px-4 py-2.5 text-cream"
                                                                            : "border border-cream/[0.07] bg-cream/[0.025] px-4 py-3 text-cream/90 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)]"
                                                                    }`}
                                                                >
                                                                    {!isUser ? (
                                                                        <div className="space-y-3">
                                                                            {(msg.segments ?? [
                                                                                {
                                                                                    type: "md" as const,
                                                                                    text: msg.displayContent ?? msg.content,
                                                                                },
                                                                            ]).map((seg, sidx) => {
                                                                                if (seg.type === "md") {
                                                                                    return (
                                                                                        <motion.div
                                                                                            key={sidx}
                                                                                            initial={{ opacity: 0, y: 6 }}
                                                                                            animate={{ opacity: 1, y: 0 }}
                                                                                            transition={{
                                                                                                duration: 0.5,
                                                                                                ease: [0.22, 1, 0.36, 1],
                                                                                                delay: 0.1 + sidx * 0.05,
                                                                                            }}
                                                                                            className="text-[14px]"
                                                                                        >
                                                                                            <ReactMarkdown components={MD_COMPONENTS}>
                                                                                                {seg.text}
                                                                                            </ReactMarkdown>
                                                                                        </motion.div>
                                                                                    );
                                                                                }
                                                                                return null;
                                                                            })}

                                                                            {msg.segments?.some((s) => s.type === "action") && (
                                                                                <motion.div
                                                                                    initial={{ opacity: 0, y: 8 }}
                                                                                    animate={{ opacity: 1, y: 0 }}
                                                                                    transition={{
                                                                                        duration: 0.5,
                                                                                        delay: 0.25,
                                                                                        ease: [0.22, 1, 0.36, 1],
                                                                                    }}
                                                                                    className="mt-1 flex flex-col gap-2 border-t border-cream/[0.06] pt-3"
                                                                                >
                                                                                    {msg.segments
                                                                                        .filter(
                                                                                            (s): s is Extract<Segment, { type: "action" }> =>
                                                                                                s.type === "action",
                                                                                        )
                                                                                        .map((seg, aidx) => (
                                                                                            <motion.div
                                                                                                key={aidx}
                                                                                                initial={{ opacity: 0, x: -6 }}
                                                                                                animate={{ opacity: 1, x: 0 }}
                                                                                                transition={{
                                                                                                    duration: 0.4,
                                                                                                    delay: 0.3 + aidx * 0.06,
                                                                                                    ease: [0.22, 1, 0.36, 1],
                                                                                                }}
                                                                                            >
                                                                                                <ActionButton
                                                                                                    label={seg.label}
                                                                                                    target={seg.target}
                                                                                                    onQuery={(q) => sendMessage(q)}
                                                                                                    onClose={closePanel}
                                                                                                />
                                                                                            </motion.div>
                                                                                        ))}
                                                                                </motion.div>
                                                                            )}
                                                                        </div>
                                                                    ) : (
                                                                        <p>{msg.displayContent ?? msg.content}</p>
                                                                    )}
                                                                </div>
                                                            </motion.li>
                                                        );
                                                    })}

                                                    {isLoading && (
                                                        <motion.li
                                                            key="loading"
                                                            layout="position"
                                                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
                                                            transition={{
                                                                type: "spring",
                                                                damping: 26,
                                                                stiffness: 280,
                                                            }}
                                                            className="flex justify-start gap-2.5"
                                                        >
                                                            <div className="relative mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gradient-to-br from-gold/25 via-gold/10 to-transparent shadow-[0_4px_14px_-4px_rgba(201,168,117,0.55),inset_0_1px_0_rgba(255,255,255,0.10)] ring-1 ring-inset ring-gold/15">
                                                                <span
                                                                    aria-hidden="true"
                                                                    className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(120%_120%_at_30%_15%,rgba(228,200,150,0.45),transparent_55%)]"
                                                                />
                                                                <motion.span
                                                                    animate={{ scale: [1, 1.08, 1] }}
                                                                    transition={{
                                                                        duration: 1.8,
                                                                        repeat: Infinity,
                                                                        ease: "easeInOut",
                                                                    }}
                                                                    className="relative"
                                                                >
                                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                    <img
                                                                        src="/logo-v2.png"
                                                                        alt="AIWai"
                                                                        width={20}
                                                                        height={20}
                                                                        className="h-4 w-auto object-contain select-none drop-shadow-[0_0_6px_rgba(228,200,150,0.45)]"
                                                                        draggable={false}
                                                                    />
                                                                </motion.span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 rounded-2xl border border-cream/[0.07] bg-cream/[0.025] px-4 py-3">
                                                                {[0, 1, 2].map((i) => (
                                                                    <motion.span
                                                                        key={i}
                                                                        animate={{
                                                                            opacity: [0.25, 1, 0.25],
                                                                            y: [0, -3, 0],
                                                                            scale: [1, 1.15, 1],
                                                                        }}
                                                                        transition={{
                                                                            duration: 1.2,
                                                                            repeat: Infinity,
                                                                            delay: i * 0.18,
                                                                            ease: "easeInOut",
                                                                        }}
                                                                        className="block h-1.5 w-1.5 rounded-full bg-gold"
                                                                    />
                                                                ))}
                                                            </div>
                                                        </motion.li>
                                                    )}
                                                </AnimatePresence>
                                            </ul>
                                            <div ref={messagesEndRef} />
                                        </>
                                    )}
                                </div>

                                <AnimatePresence>
                                    {messages.length > 0 && activeChips.length > 0 && !isLoading && (
                                        <motion.div
                                            key={`chips-${messages.length}`}
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -4, transition: { duration: 0.18 } }}
                                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                            className="flex flex-wrap gap-2 border-t border-cream/[0.06] bg-char px-4 py-3"
                                        >
                                            {activeChips.map((chip, i) => {
                                                const isSelected = selectedChip === chip;
                                                const isOther = selectedChip !== null && !isSelected;
                                                return (
                                                    <motion.button
                                                        key={chip}
                                                        type="button"
                                                        onClick={() => handleChip(chip)}
                                                        disabled={selectedChip !== null}
                                                        initial={{ opacity: 0, y: 6, scale: 0.94 }}
                                                        animate={{
                                                            opacity: isOther ? 0.15 : 1,
                                                            y: 0,
                                                            scale: isSelected ? 1.06 : 1,
                                                        }}
                                                        transition={{
                                                            duration: isSelected || isOther ? 0.18 : 0.35,
                                                            delay: selectedChip ? 0 : i * 0.05,
                                                            ease: [0.22, 1, 0.36, 1],
                                                        }}
                                                        whileHover={selectedChip ? undefined : { y: -1 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className={`group inline-flex items-center rounded-full border px-3 py-1.5 text-xs transition-colors ${
                                                            isSelected
                                                                ? "border-gold/60 bg-gold/[0.14] text-cream shadow-[0_0_18px_-4px_rgba(201,168,117,0.5)]"
                                                                : "border-cream/[0.08] bg-cream/[0.03] text-cream/75 hover:border-gold/40 hover:bg-gold/[0.06] hover:text-cream"
                                                        }`}
                                                    >
                                                        {chip}
                                                    </motion.button>
                                                );
                                            })}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className={`relative rounded-full chat-beam-border ${beamActive ? "beam-active" : ""}`}>
                    <form
                        onSubmit={handleSubmit}
                        className="relative flex items-end gap-2 rounded-full bg-char/95 backdrop-blur-2xl px-3 py-2 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.95)]"
                    >
                        <span aria-hidden="true" className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent" />

                    <button
                        type="button"
                        onClick={() => textareaRef.current?.focus()}
                        aria-label="Rozšíriť"
                        className="flex shrink-0 items-center justify-center self-end p-2 text-cream/55 transition-colors hover:text-gold"
                    >
                        <Plus className="h-5 w-5" strokeWidth={1.6} />
                    </button>

                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => {
                            setIsFocused(true);
                            setTimeout(() => setIsExpanded(true), 750);
                        }}
                        onBlur={() => setIsFocused(false)}
                        placeholder={t("chatbot.bubble.initial")}
                        rows={1}
                        aria-label="Napíšte správu"
                        className="flex-1 resize-none self-center bg-transparent px-1 py-2 text-base md:text-sm leading-snug text-cream placeholder:text-cream/40 outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none truncate [scrollbar-width:thin]"
                    />

                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        aria-label="Odoslať"
                        className="flex h-9 w-9 shrink-0 items-center justify-center self-end rounded-full bg-gold text-ink transition-all hover:bg-gold-bright disabled:cursor-not-allowed disabled:bg-cream/10 disabled:text-cream/30"
                    >
                        <Send className="h-3.5 w-3.5" />
                    </button>
                    </form>
                </div>
            </div>
        </motion.div>
    );
}
