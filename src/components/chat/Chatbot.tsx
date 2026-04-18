"use client";

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
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Walking state — all via refs to avoid re-renders on every frame
    const [isHovered, setIsHovered] = useState(false);
    const [showBubble, setShowBubble] = useState(false);
    const [bubbleMessage, setBubbleMessage] = useState("");
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isOpen2, setIsOpen2] = useState(false); // chat window visible (for CSS transition)
    const [alignment, setAlignment] = useState<"left" | "right">("right");
    const [isWalking, setIsWalking] = useState(false);
    const [direction, setDirection] = useState<-1 | 1>(-1);

    const xRef = useRef(0);
    const dirRef = useRef<-1 | 1>(-1);
    const rafRef = useRef<number | null>(null);
    const botRef = useRef<HTMLDivElement>(null);
    const windowWidthRef = useRef(0);
    const lastBubbleTime = useRef(0);
    const speed = 0.8;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => { scrollToBottom(); }, [messages]);

    useEffect(() => {
        windowWidthRef.current = window.innerWidth;
        const handleResize = () => { windowWidthRef.current = window.innerWidth; };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Auto-hide bubble
    useEffect(() => {
        if (showBubble) {
            const timer = setTimeout(() => setShowBubble(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [showBubble]);

    // Initial load sequence
    useEffect(() => {
        const timer = setTimeout(() => {
            setBubbleMessage(t("chatbot.bubble.initial"));
            setShowBubble(true);
            setIsInitialLoad(false);
            lastBubbleTime.current = Date.now();
        }, 3000);
        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // RAF walking loop
    const walk = useCallback(() => {
        const ww = windowWidthRef.current;
        if (ww === 0) { rafRef.current = requestAnimationFrame(walk); return; }

        const leftLimit = -(ww - 100);
        const rightLimit = 0;
        const cur = xRef.current;
        const dir = dirRef.current;

        if (dir === -1) {
            if (cur > leftLimit) {
                xRef.current = cur - speed;
            } else {
                dirRef.current = 1;
                setDirection(1);
            }
        } else {
            if (cur < rightLimit) {
                xRef.current = cur + speed;
            } else {
                dirRef.current = -1;
                setDirection(-1);
                const now = Date.now();
                if (now - lastBubbleTime.current > 10000) {
                    setBubbleMessage(t("chatbot.bubble.repeat"));
                    setShowBubble(true);
                    lastBubbleTime.current = now;
                }
            }
        }

        if (botRef.current) {
            botRef.current.style.transform = `translateX(${xRef.current}px)`;
        }

        rafRef.current = requestAnimationFrame(walk);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Start/stop RAF based on walking state
    useEffect(() => {
        const shouldWalk = !isOpen && !isHovered && !showBubble && !isInitialLoad;
        setIsWalking(shouldWalk);
        if (shouldWalk) {
            rafRef.current = requestAnimationFrame(walk);
        } else {
            if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
        }
        return () => { if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; } };
    }, [isOpen, isHovered, showBubble, isInitialLoad, walk]);

    const handleToggle = () => {
        if (!isOpen) {
            const currentX = xRef.current;
            const rightEdgePos = windowWidthRef.current - 24 + currentX;
            const spaceOnLeft = rightEdgePos;
            const spaceOnRight = windowWidthRef.current - (rightEdgePos - 56);
            setAlignment(spaceOnRight > spaceOnLeft ? "left" : "right");
            setIsOpen(true);
            requestAnimationFrame(() => setIsOpen2(true));
        } else {
            setIsOpen2(false);
            setTimeout(() => { setIsOpen(false); setIsHovered(false); }, 200);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: input };
        const newMessages: Message[] = [...messages, userMessage];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: newMessages }),
            });
            if (!response.ok) throw new Error("Failed to fetch");
            const data = await response.json();
            setMessages([...newMessages, data.message as Message]);
        } catch {
            setMessages([...newMessages, { role: "assistant", content: "I'm currently recalibrating my neural pathways. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Chat window */}
            {isOpen && (
                <div
                    className={`fixed bottom-[calc(1.5rem+80px)] left-4 right-4 mx-auto sm:left-auto sm:right-6 sm:mx-0 ${alignment === "left" ? "sm:origin-bottom-left" : "sm:origin-bottom-right"} w-auto sm:w-[400px] max-w-[400px] h-[500px] max-h-[70vh] sm:max-h-none bg-white/80 backdrop-blur-xl border border-brand-indigo/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-[60] transition-all duration-200`}
                    style={{
                        opacity: isOpen2 ? 1 : 0,
                        transform: isOpen2 ? "scale(1) translateY(0)" : "scale(0.95) translateY(20px)",
                    }}
                >
                    {/* Header */}
                    <div className="p-4 bg-brand-indigo/5 border-b border-brand-indigo/5 flex justify-between items-center">
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
                        <button onClick={handleToggle} className="text-brand-indigo/40 hover:text-brand-indigo transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                <PremiumIcon type="ai-agents" size={64} className="text-brand-indigo mb-4" />
                                <p className="text-sm text-brand-indigo max-w-[200px]">{t("chatbot.bubble.initial")}</p>
                            </div>
                        )}
                        {messages.map((message, index) => (
                            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${message.role === "user" ? "bg-brand-indigo text-white rounded-tr-sm" : "bg-brand-offwhite text-brand-indigo border border-brand-indigo/5 rounded-tl-sm"}`}>
                                    {message.content}
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
                    <form onSubmit={handleSubmit} className="p-4 bg-white/50 border-t border-brand-indigo/5">
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
            )}

            {/* Walking Bot */}
            <div
                ref={botRef}
                className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{ willChange: "transform" }}
            >
                <div className="relative">
                    {/* Walking legs */}
                    <div
                        className="absolute bottom-1 left-1/2 flex gap-4 z-40"
                        style={{ transform: `translateX(-50%) scaleX(${direction === -1 ? 1 : -1})` }}
                    >
                        {/* Left leg */}
                        <div
                            className="w-2.5 h-5 bg-brand-indigo rounded-b-full origin-top"
                            style={{
                                animation: isWalking ? "legLeft 1s ease-in-out infinite" : "none",
                                transform: isWalking ? undefined : "rotate(0deg)",
                            }}
                        />
                        {/* Right leg */}
                        <div
                            className="w-2.5 h-5 bg-brand-indigo rounded-b-full origin-top"
                            style={{
                                animation: isWalking ? "legRight 1s ease-in-out infinite" : "none",
                                transform: isWalking ? undefined : "rotate(0deg)",
                            }}
                        />
                    </div>

                    {/* Main Toggle Button */}
                    <button
                        onClick={handleToggle}
                        className="w-14 h-14 relative group z-50 mb-3 hover:scale-105 active:scale-95 transition-transform"
                        style={{
                            animation: isWalking ? "botBob 0.5s ease-in-out infinite" : "none",
                        }}
                    >
                        {/* Help Bubble */}
                        {showBubble && !isOpen && (
                            <div
                                className="absolute bottom-full right-0 mb-3 w-48 bg-white text-brand-indigo p-3 rounded-xl rounded-br-none shadow-lg text-xs font-medium border border-brand-indigo/10 z-50 pointer-events-none"
                                style={{ animation: "adminCardReveal 0.3s ease both" }}
                            >
                                {bubbleMessage}
                            </div>
                        )}

                        {/* Visual Container */}
                        <div className="absolute inset-0 rounded-full bg-brand-indigo text-white shadow-xl shadow-brand-indigo/20 overflow-hidden flex items-center justify-center">
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <div style={{ transform: `scaleX(${direction === 1 && !isOpen ? -1 : 1})` }}>
                                {isOpen ? <X size={24} /> : <PremiumIcon type="ai-agents" size={36} className="text-white" />}
                            </div>
                        </div>

                        {/* Status indicator */}
                        {!isOpen && (
                            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-brand-indigo border-2 border-white rounded-full shadow-[0_0_15px_4px_rgba(10,10,90,0.8)] z-10" />
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}
