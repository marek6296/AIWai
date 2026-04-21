"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useAnimationFrame } from "framer-motion";
import { Send, X, Sparkles } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";
import PremiumIcon from "@/components/ui/PremiumIcon";
import ReactMarkdown from "react-markdown";

interface Message {
    role: "user" | "assistant" | "system";
    content: string;       // raw content including [NÁVRHY:...] if present
    chips?: string[];      // parsed suggestions stripped from content
    displayContent?: string; // content with [NÁVRHY:...] removed
}

/** Parse [NÁVRHY: opt1 • opt2 • opt3] from end of assistant message */
function parseChips(raw: string): { display: string; chips: string[] } {
    const idx = raw.lastIndexOf("[N\u00C1VRHY:");
    if (idx === -1) return { display: raw.trim(), chips: [] };
    const inner = raw.slice(idx + 8).replace(/\]\s*$/, "").trim();
    const chips = inner
        .split("\u2022")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 4);
    const display = raw.slice(0, idx).trim();
    return { display, chips };
}

const INITIAL_CHIPS = [
    "Chcem nový web alebo e-shop",
    "Zaujíma ma AI chatbot pre firmu",
    "Čo dokáže automatizácia procesov?",
    "Aké sú vaše ceny?",
];

export default function Chatbot() {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Session ID — persisted in localStorage
    const sessionIdRef = useRef<string>("");
    useEffect(() => {
        try {
            let id = localStorage.getItem("aiwai_chat_session");
            if (!id) {
                id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
                localStorage.setItem("aiwai_chat_session", id);
            }
            sessionIdRef.current = id;
        } catch {
            sessionIdRef.current = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
        }
    }, []);

    // Walking state
    const [isHovered, setIsHovered] = useState(false);
    const [windowWidth, setWindowWidth] = useState(0);
    const [direction, setDirection] = useState<-1 | 1>(-1);
    const [alignment, setAlignment] = useState<"left" | "right">("right");
    const [showBubble, setShowBubble] = useState(false);
    const [bubbleMessage, setBubbleMessage] = useState("");
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const lastBubbleTime = useRef(0);
    const x = useMotionValue(0);
    const speed = 0.8;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => { scrollToBottom(); }, [messages]);

    useEffect(() => {
        setWindowWidth(window.innerWidth);
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (showBubble) {
            const timer = setTimeout(() => setShowBubble(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [showBubble]);

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

    useAnimationFrame(() => {
        if (isOpen || isHovered || windowWidth === 0 || showBubble || isInitialLoad) return;
        const currentX = x.get();
        const leftLimit = -(windowWidth - 100);
        const rightLimit = 0;
        if (direction === -1) {
            if (currentX > leftLimit) { x.set(currentX - speed); }
            else { setDirection(1); }
        } else {
            if (currentX < rightLimit) { x.set(currentX + speed); }
            else {
                setDirection(-1);
                const now = Date.now();
                if (now - lastBubbleTime.current > 10000) {
                    setBubbleMessage(t("chatbot.bubble.repeat"));
                    setShowBubble(true);
                    lastBubbleTime.current = now;
                }
            }
        }
    });

    const handleToggle = () => {
        if (!isOpen) {
            const currentX = x.get();
            const rightEdgePosition = windowWidth - 24 + currentX;
            const spaceOnLeft = rightEdgePosition;
            const spaceOnRight = windowWidth - (rightEdgePosition - 56);
            setAlignment(spaceOnRight > spaceOnLeft ? "left" : "right");
        } else {
            setIsHovered(false);
        }
        setIsOpen(!isOpen);
    };

    const sendMessage = async (text: string) => {
        if (!text.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: text, displayContent: text };
        const newMessages: Message[] = [...messages, userMessage];

        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        // Build clean messages array for API (content only, no chips metadata)
        const apiMessages = newMessages.map((m) => ({ role: m.role, content: m.content }));

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: apiMessages, sessionId: sessionIdRef.current }),
            });

            if (!response.ok) throw new Error("Failed to fetch");

            const data = await response.json();
            const rawContent: string = data.message?.content ?? "";
            const { display, chips } = parseChips(rawContent);

            const assistantMsg: Message = {
                role: "assistant",
                content: rawContent,
                displayContent: display,
                chips,
            };
            setMessages([...newMessages, assistantMsg]);
        } catch {
            setMessages([...newMessages, {
                role: "assistant",
                content: "Prepáč, nastala chyba. Napíš priamo na marek@aiwai.app.",
                displayContent: "Prepáč, nastala chyba. Napíš priamo na **marek@aiwai.app**.",
                chips: [],
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await sendMessage(input);
    };

    const handleChip = (chip: string) => {
        // Strip leading emoji and whitespace from initial chips like "💡 Chcem web"
        const clean = chip.replace(/^[^\w\u00C0-\u024F]+/, "").trim();
        sendMessage(clean);
    };

    const isWalking = !isOpen && !isHovered && !showBubble && !isInitialLoad;

    // Last message chips (to show after latest assistant response)
    const lastMsg = messages[messages.length - 1];
    const activeChips =
        lastMsg?.role === "assistant" && lastMsg.chips?.length
            ? lastMsg.chips
            : [];

    // Leg animations
    const leftLegVariants = {
        walking: { rotate: [-20, 20, -20], transition: { repeat: Infinity, duration: 1 } },
        idle: { rotate: 0 },
    };
    const rightLegVariants = {
        walking: { rotate: [20, -20, 20], transition: { repeat: Infinity, duration: 1 } },
        idle: { rotate: 0 },
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        style={windowWidth < 640 ? {} : { x: alignment === "left" ? x.get() + 344 : x }}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`fixed bottom-[calc(1.5rem+80px)] left-2 right-2 mx-auto sm:left-auto sm:right-6 sm:mx-0 ${alignment === "left" ? "sm:origin-bottom-left" : "sm:origin-bottom-right"} w-auto sm:w-[400px] max-w-[400px] h-[min(520px,calc(100dvh-130px))] sm:h-[520px] sm:max-h-none bg-white sm:bg-white/80 sm:backdrop-blur-xl border border-brand-indigo/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-[60]`}
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
                            <button
                                onClick={() => { setIsOpen(false); setIsHovered(false); }}
                                className="text-brand-indigo/40 hover:text-brand-indigo transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-brand-indigo/10 scrollbar-track-transparent">
                            {/* Empty state with initial chips */}
                            {messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                                    <div className="opacity-30">
                                        <PremiumIcon type="ai-agents" size={52} className="text-brand-indigo mx-auto mb-2" />
                                        <p className="text-sm text-brand-indigo max-w-[200px]">
                                            {t("chatbot.bubble.initial")}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-2 w-full max-w-[280px] mt-2">
                                        {INITIAL_CHIPS.map((chip) => (
                                            <button
                                                key={chip}
                                                onClick={() => handleChip(chip)}
                                                className="px-4 py-2.5 bg-white border border-brand-indigo/15 rounded-xl text-xs font-medium text-brand-indigo/80 hover:bg-brand-indigo hover:text-white hover:border-brand-indigo transition-all duration-200 text-left"
                                            >
                                                {chip}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {messages.map((message, index) => (
                                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div
                                        className={`max-w-[82%] p-3 rounded-2xl text-sm ${
                                            message.role === "user"
                                                ? "bg-brand-indigo text-white rounded-tr-sm"
                                                : "bg-brand-offwhite text-brand-indigo border border-brand-indigo/5 rounded-tl-sm"
                                        }`}
                                    >
                                        {message.role === "assistant" ? (
                                            <div className="prose prose-sm prose-neutral max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-strong:text-brand-indigo prose-strong:font-semibold">
                                                <ReactMarkdown>
                                                    {message.displayContent ?? message.content}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            message.content
                                        )}
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

                            {/* Quick reply chips after assistant response */}
                            {!isLoading && activeChips.length > 0 && (
                                <div className="flex flex-col gap-1.5 pt-1">
                                    {activeChips.map((chip) => (
                                        <button
                                            key={chip}
                                            onClick={() => handleChip(chip)}
                                            className="px-4 py-2.5 bg-white border border-brand-indigo/15 rounded-xl text-xs font-medium text-brand-indigo/80 hover:bg-brand-indigo hover:text-white hover:border-brand-indigo transition-all duration-200 text-left"
                                        >
                                            {chip}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-brand-indigo/5">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={t("chatbot.placeholder")}
                                    className="w-full bg-brand-offwhite border border-brand-indigo/10 rounded-full py-3 pl-4 pr-12 text-brand-indigo placeholder:text-brand-indigo/40 focus:outline-none focus:border-brand-indigo/30 transition-colors"
                                    style={{ fontSize: "16px" }}
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className="absolute right-2 p-2 bg-brand-indigo text-white rounded-full hover:bg-brand-indigo/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isLoading ? (
                                        <Sparkles size={16} className="animate-spin" />
                                    ) : (
                                        <Send size={16} />
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Walking bot button */}
            <motion.div
                style={{ x }}
                className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="relative">
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-4 z-40"
                        style={{ transform: `translateX(-50%) scaleX(${direction === -1 ? 1 : -1})` }}
                    >
                        <motion.div className="w-2.5 h-5 bg-brand-indigo rounded-b-full origin-top" variants={leftLegVariants} animate={isWalking ? "walking" : "idle"} />
                        <motion.div className="w-2.5 h-5 bg-brand-indigo rounded-b-full origin-top" variants={rightLegVariants} animate={isWalking ? "walking" : "idle"} />
                    </div>

                    <motion.button
                        onClick={handleToggle}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{ y: isWalking ? [0, -3, 0] : 0 }}
                        transition={{ y: { repeat: Infinity, duration: 0.5, ease: "easeInOut" } }}
                        className="w-14 h-14 relative group z-50 mb-3"
                    >
                        <AnimatePresence>
                            {showBubble && !isOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.8 }}
                                    className="absolute bottom-full right-0 mb-3 w-48 bg-white text-brand-indigo p-3 rounded-xl rounded-br-none shadow-lg text-xs font-medium border border-brand-indigo/10 z-50 pointer-events-none"
                                >
                                    {bubbleMessage}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="absolute inset-0 rounded-full bg-brand-indigo text-white shadow-xl shadow-brand-indigo/20 overflow-hidden flex items-center justify-center">
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <div style={{ transform: `scaleX(${direction === 1 && !isOpen ? -1 : 1})` }}>
                                <AnimatePresence mode="wait">
                                    {isOpen ? (
                                        <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                                            <X size={24} />
                                        </motion.div>
                                    ) : (
                                        <motion.div key="open" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                                            <PremiumIcon type="ai-agents" size={36} className="text-white" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {!isOpen && (
                            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-brand-indigo border-2 border-white rounded-full shadow-[0_0_15px_4px_rgba(10,10,90,0.8)] z-10" />
                        )}
                    </motion.button>
                </div>
            </motion.div>
        </>
    );
}
