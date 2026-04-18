"use client";

/**
 * Chatbot — walking mascot + chat window.
 * Rewritten from Framer Motion to vanilla RAF + CSS, preserving 100% of the
 * original behaviour: walking left/right, leg animation, bobbing, help bubble,
 * chat window follows the bot on desktop, alignment logic, hover/tap scales.
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, X, Sparkles } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";
import PremiumIcon from "@/components/ui/PremiumIcon";

interface Message {
    role: "user" | "assistant" | "system";
    content: string;
}

export default function Chatbot() {
    const { t } = useTranslation();

    // ── Chat state ──────────────────────────────────────────────────────────
    const [isOpen, setIsOpen]         = useState(false);
    const [isOpen2, setIsOpen2]       = useState(false); // CSS enter trigger (1 tick after isOpen)
    const [messages, setMessages]     = useState<Message[]>([]);
    const [input, setInput]           = useState("");
    const [isLoading, setIsLoading]   = useState(false);
    const messagesEndRef              = useRef<HTMLDivElement>(null);

    // ── Walking state ────────────────────────────────────────────────────────
    const [isHovered, setIsHovered]   = useState(false);
    const [windowWidth, setWindowWidth] = useState(0);
    const [direction, setDirection]   = useState<-1 | 1>(-1); // -1 = left, 1 = right
    const [alignment, setAlignment]   = useState<"left" | "right">("right");
    const [chatX, setChatX]           = useState(0);   // x snapshot when chat opens
    const [showBubble, setShowBubble] = useState(false);
    const [bubbleMessage, setBubbleMessage] = useState("");
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // ── Refs (hot values used inside RAF — avoid stale closures) ─────────────
    const xRef            = useRef(0);          // current horizontal offset (≤0)
    const dirRef          = useRef<-1 | 1>(-1);
    const isOpenRef       = useRef(false);
    const isHoveredRef    = useRef(false);
    const showBubbleRef   = useRef(false);
    const isInitialRef    = useRef(true);
    const windowWidthRef  = useRef(0);
    const lastBubbleTime  = useRef(0);
    const rafRef          = useRef<number | null>(null);
    const botRef          = useRef<HTMLDivElement>(null);
    const tRef            = useRef(t);          // keep translation fn fresh

    const SPEED = 0.8;

    // Keep refs in sync with state/props
    useEffect(() => { isOpenRef.current     = isOpen;       }, [isOpen]);
    useEffect(() => { isHoveredRef.current  = isHovered;    }, [isHovered]);
    useEffect(() => { showBubbleRef.current = showBubble;   }, [showBubble]);
    useEffect(() => { isInitialRef.current  = isInitialLoad; }, [isInitialLoad]);
    useEffect(() => { tRef.current          = t;            }, [t]);

    // ── Scroll to latest message ─────────────────────────────────────────────
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // ── Window width ─────────────────────────────────────────────────────────
    useEffect(() => {
        const w = window.innerWidth;
        setWindowWidth(w);
        windowWidthRef.current = w;
        const onResize = () => {
            setWindowWidth(window.innerWidth);
            windowWidthRef.current = window.innerWidth;
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    // ── Auto-hide bubble ─────────────────────────────────────────────────────
    useEffect(() => {
        if (!showBubble) return;
        const t = setTimeout(() => setShowBubble(false), 5000);
        return () => clearTimeout(t);
    }, [showBubble]);

    // ── Initial greeting (3 s delay) ─────────────────────────────────────────
    useEffect(() => {
        const timer = setTimeout(() => {
            setBubbleMessage(tRef.current("chatbot.bubble.initial"));
            setShowBubble(true);
            setIsInitialLoad(false);
            lastBubbleTime.current = Date.now();
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    // ── RAF walking loop ─────────────────────────────────────────────────────
    const walk = useCallback(() => {
        const ww = windowWidthRef.current;

        // Pause conditions (same as original useAnimationFrame early-return)
        if (
            isOpenRef.current ||
            isHoveredRef.current ||
            ww === 0 ||
            showBubbleRef.current ||
            isInitialRef.current
        ) {
            rafRef.current = requestAnimationFrame(walk);
            return;
        }

        const leftLimit  = -(ww - 100); // leftmost x (most negative)
        const rightLimit = 0;            // rightmost x (start position)
        const cur        = xRef.current;
        const dir        = dirRef.current;

        if (dir === -1) {
            // Moving left
            if (cur > leftLimit) {
                xRef.current = cur - SPEED;
            } else {
                dirRef.current = 1;
                setDirection(1);
            }
        } else {
            // Moving right
            if (cur < rightLimit) {
                xRef.current = cur + SPEED;
            } else {
                dirRef.current = -1;
                setDirection(-1);
                // Trigger repeat bubble (10 s cooldown)
                const now = Date.now();
                if (now - lastBubbleTime.current > 10000) {
                    setBubbleMessage(tRef.current("chatbot.bubble.repeat"));
                    setShowBubble(true);
                    lastBubbleTime.current = now;
                }
            }
        }

        // Apply transform directly to DOM — no React re-render
        if (botRef.current) {
            botRef.current.style.transform = `translateX(${xRef.current}px)`;
        }

        rafRef.current = requestAnimationFrame(walk);
    }, []); // stable — all values via refs

    // Start RAF on mount, stop on unmount
    useEffect(() => {
        rafRef.current = requestAnimationFrame(walk);
        return () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
    }, [walk]);

    // ── isWalking for CSS animations ─────────────────────────────────────────
    const isWalking = !isOpen && !isHovered && !showBubble && !isInitialLoad;

    // ── Open / close chat ────────────────────────────────────────────────────
    const handleToggle = () => {
        if (!isOpen) {
            // Snapshot current x for chat window positioning
            const currentX       = xRef.current;
            const ww             = windowWidthRef.current;
            // Replicate original alignment logic exactly
            const rightEdgePos   = ww - 24 + currentX;
            const spaceOnLeft    = rightEdgePos;
            const spaceOnRight   = ww - (rightEdgePos - 56);
            const newAlignment   = spaceOnRight > spaceOnLeft ? "left" : "right";

            setChatX(currentX);
            setAlignment(newAlignment);
            setIsOpen(true);
            // 1-tick delay so CSS transition sees the initial state first
            requestAnimationFrame(() => setIsOpen2(true));
        } else {
            setIsOpen2(false);
            setTimeout(() => {
                setIsOpen(false);
                setIsHovered(false);
            }, 200);
        }
    };

    // ── Send message ─────────────────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg: Message   = { role: "user", content: input };
        const newMessages        = [...messages, userMsg];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ messages: newMessages }),
            });
            if (!res.ok) throw new Error();
            const data = await res.json();
            setMessages([...newMessages, data.message as Message]);
        } catch {
            setMessages([...newMessages, {
                role:    "assistant",
                content: "I'm currently recalibrating my neural pathways. Please try again later.",
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // ── Chat window x offset (mirrors original Framer Motion logic exactly) ──
    // On mobile (< 640): no x offset. On desktop: follow the bot.
    const chatWindowX = windowWidth >= 640
        ? (alignment === "left" ? chatX + 344 : chatX)
        : 0;

    return (
        <>
            {/* ── Chat Window ───────────────────────────────────────────── */}
            {isOpen && (
                // Outer div: x positioning (follows bot on desktop, same as original)
                <div
                    className={`fixed bottom-[calc(1.5rem+80px)] left-4 right-4 mx-auto sm:left-auto sm:right-6 sm:mx-0 w-auto sm:w-[400px] max-w-[400px] z-[60] ${alignment === "left" ? "sm:origin-bottom-left" : "sm:origin-bottom-right"}`}
                    style={windowWidth >= 640 ? { transform: `translateX(${chatWindowX}px)` } : {}}
                >
                    {/* Inner div: enter/exit animation (opacity + scale + y) */}
                    <div
                        className="h-[500px] max-h-[70vh] sm:max-h-none bg-white/80 backdrop-blur-xl border border-brand-indigo/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-200"
                        style={{
                            opacity:   isOpen2 ? 1 : 0,
                            transform: isOpen2 ? "scale(1) translateY(0)" : "scale(0.95) translateY(20px)",
                        }}
                    >
                        {/* Header */}
                        <div className="p-4 bg-brand-indigo/5 border-b border-brand-indigo/5 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-brand-indigo flex items-center justify-center p-1">
                                    <PremiumIcon type="ai-agents" size={24} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-brand-indigo font-bold text-sm">{t("chatbot.header")}</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-brand-indigo shadow-[0_0_10px_rgba(10,10,80,0.8)] animate-pulse" />
                                        <span className="text-[10px] text-brand-indigo/60 uppercase tracking-widest">Online</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => { setIsOpen(false); setIsHovered(false); }}
                                className="text-brand-indigo/40 hover:text-brand-indigo transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                    <PremiumIcon type="ai-agents" size={64} className="text-brand-indigo mb-4" />
                                    <p className="text-sm text-brand-indigo max-w-[200px]">
                                        {t("chatbot.bubble.initial")}
                                    </p>
                                </div>
                            )}
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === "user" ? "bg-brand-indigo text-white rounded-tr-sm" : "bg-brand-offwhite text-brand-indigo border border-brand-indigo/5 rounded-tl-sm"}`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-brand-offwhite px-4 py-3 rounded-2xl rounded-tl-sm border border-brand-indigo/5 flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-brand-indigo/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <span className="w-1.5 h-1.5 bg-brand-indigo/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <span className="w-1.5 h-1.5 bg-brand-indigo/40 rounded-full animate-bounce" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="p-4 bg-white/50 border-t border-brand-indigo/5 shrink-0">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={t("chatbot.placeholder")}
                                    className="w-full bg-brand-offwhite border border-brand-indigo/10 rounded-full py-3 pl-4 pr-12 text-sm text-brand-indigo placeholder:text-brand-indigo/40 focus:outline-none focus:border-brand-indigo/30 transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className="absolute right-2 p-2 bg-brand-indigo text-white rounded-full hover:bg-brand-indigo/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isLoading ? <Sparkles size={16} className="animate-spin" /> : <Send size={16} />}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Walking Bot ───────────────────────────────────────────── */}
            {/*
             * botRef div: positioned fixed bottom-right, translateX via RAF.
             * The RAF writes directly to style.transform so no re-render occurs
             * during walking — only direction flips trigger re-renders.
             */}
            <div
                ref={botRef}
                className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{ willChange: "transform" }}
            >
                <div className="relative">
                    {/* ── Legs ── */}
                    {/*
                     * Two legs: left oscillates -20°→20°, right 20°→-20°
                     * (opposite phase). CSS @keyframes legLeft/legRight defined
                     * in globals.css. Flip scaleX matches direction.
                     */}
                    <div
                        className="absolute bottom-1 left-1/2 flex gap-4 z-40"
                        style={{
                            // -translate-x-1/2 is baked into translateX below to avoid class conflict
                            transform: `translateX(-50%) scaleX(${direction === -1 ? 1 : -1})`,
                        }}
                    >
                        {/* Left leg */}
                        <div
                            className="w-2.5 h-5 bg-brand-indigo rounded-b-full origin-top"
                            style={{
                                animation:  isWalking ? "legLeft 1s ease-in-out infinite" : "none",
                                transform:  isWalking ? undefined : "rotate(0deg)",
                            }}
                        />
                        {/* Right leg */}
                        <div
                            className="w-2.5 h-5 bg-brand-indigo rounded-b-full origin-top"
                            style={{
                                animation:  isWalking ? "legRight 1s ease-in-out infinite" : "none",
                                transform:  isWalking ? undefined : "rotate(0deg)",
                            }}
                        />
                    </div>

                    {/* ── Main Toggle Button ── */}
                    {/*
                     * botBob @keyframes: y [0, -3, 0] at 0.5 s (matches original).
                     * CSS :hover → scale(1.05), :active → scale(0.95) replaces
                     * whileHover/whileTap. Works because walking stops on hover.
                     */}
                    <button
                        onClick={handleToggle}
                        className="w-14 h-14 relative group z-50 mb-3 chatbot-btn"
                        style={{
                            animation: isWalking ? "botBob 0.5s ease-in-out infinite" : "none",
                        }}
                        aria-label={isOpen ? "Close chat" : "Open chat"}
                    >
                        {/* ── Help Bubble ── */}
                        {showBubble && !isOpen && (
                            <div
                                className="absolute bottom-full right-0 mb-3 w-48 bg-white text-brand-indigo p-3 rounded-xl rounded-br-none shadow-lg text-xs font-medium border border-brand-indigo/10 z-50 pointer-events-none"
                                style={{ animation: "bubbleReveal 0.3s cubic-bezier(0.22,1,0.36,1) both" }}
                            >
                                {bubbleMessage}
                            </div>
                        )}

                        {/* ── Button Body ── */}
                        <div className="absolute inset-0 rounded-full bg-brand-indigo text-white shadow-xl shadow-brand-indigo/20 overflow-hidden flex items-center justify-center">
                            {/* Liquid fill on hover */}
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />

                            {/* Icon — flipped when walking right */}
                            <div
                                className="relative z-10 transition-all duration-150"
                                style={{ transform: `scaleX(${direction === 1 && !isOpen ? -1 : 1})` }}
                            >
                                {/* Close icon (when open) */}
                                <span
                                    className="absolute inset-0 flex items-center justify-center transition-all duration-150"
                                    style={{
                                        opacity:   isOpen ? 1 : 0,
                                        transform: isOpen ? "rotate(0deg) scale(1)" : "rotate(-90deg) scale(0.5)",
                                    }}
                                >
                                    <X size={24} />
                                </span>
                                {/* Bot icon (when closed) */}
                                <span
                                    className="flex items-center justify-center transition-all duration-150"
                                    style={{
                                        opacity:   isOpen ? 0 : 1,
                                        transform: isOpen ? "scale(0.5)" : "scale(1)",
                                    }}
                                >
                                    <PremiumIcon type="ai-agents" size={36} className="text-white" />
                                </span>
                            </div>
                        </div>

                        {/* Status dot */}
                        {!isOpen && (
                            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-brand-indigo border-2 border-white rounded-full shadow-[0_0_15px_4px_rgba(10,10,90,0.8)] z-10" />
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}
