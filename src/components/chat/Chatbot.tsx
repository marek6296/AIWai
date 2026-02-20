"use client";

// Triggering fresh Vercel deployment for Supabase integration
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useAnimationFrame } from "framer-motion";
import { Send, X, Bot, Sparkles } from "lucide-react";

interface Message {
    role: "user" | "assistant" | "system";
    content: string;
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Walking Logic State
    const [isHovered, setIsHovered] = useState(false);
    const [windowWidth, setWindowWidth] = useState(0);
    const [direction, setDirection] = useState<-1 | 1>(-1); // -1 = going left, 1 = going right
    const [alignment, setAlignment] = useState<"left" | "right">("right"); // Alignment of the chat window
    const [showBubble, setShowBubble] = useState(false); // Help bubble state
    const [isInitialLoad, setIsInitialLoad] = useState(true); // Initial load delay
    const lastBubbleTime = useRef(0); // Cooldown for bubble
    const x = useMotionValue(0);
    const speed = 0.8; // Speed of walking

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initialize window width
    useEffect(() => {
        setWindowWidth(window.innerWidth);
        const handleResize = () => setWindowWidth(window.innerWidth);
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
            setShowBubble(true);
            setIsInitialLoad(false);
            lastBubbleTime.current = Date.now();
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    // Animation Frame for Movement
    useAnimationFrame(() => {
        if (isOpen || isHovered || windowWidth === 0 || showBubble || isInitialLoad) return;

        const currentX = x.get();
        // Constraints: Start at 0 (Right side), End at approx -windowWidth + 100 (Left side)
        const leftLimit = -(windowWidth - 100);
        const rightLimit = 0;

        // Move
        if (direction === -1) {
            // Moving Left
            if (currentX > leftLimit) {
                x.set(currentX - speed);
            } else {
                setDirection(1); // Turn Right
            }
        } else {
            // Moving Right
            if (currentX < rightLimit) {
                x.set(currentX + speed);
            } else {
                setDirection(-1); // Turn Left
                // Trigger bubble if cooldown passed
                const now = Date.now();
                if (now - lastBubbleTime.current > 10000) {
                    setShowBubble(true);
                    lastBubbleTime.current = now;
                }
            }
        }
    });

    const handleToggle = () => {
        if (!isOpen) {
            // Opening
            // Calculate space available on both sides
            const currentX = x.get();
            const rightEdgePosition = windowWidth - 24 + currentX;
            const spaceOnLeft = rightEdgePosition;
            const spaceOnRight = windowWidth - (rightEdgePosition - 56); // 56 is the bot button width

            if (spaceOnRight > spaceOnLeft) {
                setAlignment("left"); // Expand right
            } else {
                setAlignment("right"); // Expand left
            }
        } else {
            // Closing
            setIsHovered(false);
        }
        setIsOpen(!isOpen);
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
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ messages: newMessages }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch");
            }

            const data = await response.json();
            setMessages([...newMessages, data.message as Message]);
        } catch (error) {
            console.error("Error:", error);
            // Fallback message
            const errorMessage: Message = { role: "assistant", content: "I'm currently recalibrating my neural pathways. Please try again later." };
            setMessages([...newMessages, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const isWalking = !isOpen && !isHovered && !showBubble && !isInitialLoad;

    // Leg Variants
    const leftLegVariants = {
        walking: {
            rotate: [-20, 20, -20],
            transition: { repeat: Infinity, duration: 1 }
        },
        idle: { rotate: 0 }
    };

    const rightLegVariants = {
        walking: {
            rotate: [20, -20, 20],
            transition: { repeat: Infinity, duration: 1 }
        },
        idle: { rotate: 0 }
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        style={windowWidth < 640 ? {} : { x }}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`fixed bottom-[calc(1.5rem+80px)] left-4 right-4 mx-auto sm:left-auto sm:right-6 sm:mx-0 ${alignment === "left" ? "sm:origin-bottom-left" : "sm:origin-bottom-right"} w-auto sm:w-[400px] max-w-[400px] h-[500px] max-h-[70vh] sm:max-h-none bg-white/80 backdrop-blur-xl border border-brand-indigo/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-[60]`}
                    >
                        {/* Header */}
                        <div className="p-4 bg-brand-indigo/5 border-b border-brand-indigo/5 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-brand-indigo flex items-center justify-center">
                                    <Bot size={18} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-brand-indigo font-bold text-sm">AIWai Assistant</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-brand-indigo shadow-[0_0_10px_rgba(10,10,80,0.8)] animate-pulse" />
                                        <span className="text-[10px] text-brand-indigo/60 uppercase tracking-widest">Online</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    setIsHovered(false);
                                }}
                                className="text-brand-indigo/40 hover:text-brand-indigo transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-brand-indigo/10 scrollbar-track-transparent">
                            {messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                    <Bot size={48} className="text-brand-indigo mb-4" />
                                    <p className="text-sm text-brand-indigo max-w-[200px]">
                                        Hello! I&apos;m AIWai. How can I assist you with your digital architecture today?
                                    </p>
                                </div>
                            )}

                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl text-sm ${message.role === "user"
                                            ? "bg-brand-indigo text-white rounded-tr-sm"
                                            : "bg-brand-offwhite text-brand-indigo border border-brand-indigo/5 rounded-tl-sm"
                                            }`}
                                    >
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
                                    placeholder="Ask about AI solutions..."
                                    className="w-full bg-brand-offwhite border border-brand-indigo/10 rounded-full py-3 pl-4 pr-12 text-sm text-brand-indigo placeholder:text-brand-indigo/40 focus:outline-none focus:border-brand-indigo/30 transition-colors"
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

            <motion.div
                style={{ x }}
                className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >

                {/* Walking Legs Container - Moved relative to button */}
                <div className="relative">
                    {/* Legs behind the button */}
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-4 z-40"
                        style={{
                            transform: `translateX(-50%) scaleX(${direction === -1 ? 1 : -1})` // Flip legs direction
                        }}
                    >
                        {/* Left Leg */}
                        <motion.div
                            className="w-2.5 h-5 bg-brand-indigo rounded-b-full origin-top"
                            variants={leftLegVariants}
                            animate={isWalking ? "walking" : "idle"}
                        />
                        {/* Right Leg */}
                        <motion.div
                            className="w-2.5 h-5 bg-brand-indigo rounded-b-full origin-top"
                            variants={rightLegVariants}
                            animate={isWalking ? "walking" : "idle"}
                        />
                    </div>

                    {/* Main Toggle Button */}
                    <motion.button
                        onClick={handleToggle}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{
                            y: isWalking ? [0, -3, 0] : 0, // Bobbing animation
                        }}
                        transition={{
                            y: { repeat: Infinity, duration: 0.5, ease: "easeInOut" }
                        }}
                        className="w-14 h-14 relative group z-50 mb-3" // Added margin bottom for legs clearance
                    >
                        {/* Help Bubble */}
                        <AnimatePresence>
                            {showBubble && !isOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.8 }}
                                    className="absolute bottom-full right-0 mb-3 w-48 bg-white text-brand-indigo p-3 rounded-xl rounded-br-none shadow-lg text-xs font-medium border border-brand-indigo/10 z-50 pointer-events-none"
                                >
                                    If you need anything, don&apos;t hesitate to ask!
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Visual Container with Overflow Hidden */}
                        <div className="absolute inset-0 rounded-full bg-brand-indigo text-white shadow-xl shadow-brand-indigo/20 overflow-hidden flex items-center justify-center">
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />

                            {/* Wrapper for flipping the icon when walking left/right */}
                            <div style={{ transform: `scaleX(${direction === 1 && !isOpen ? -1 : 1})` }}>
                                <AnimatePresence mode="wait">
                                    {isOpen ? (
                                        <motion.div
                                            key="close"
                                            initial={{ rotate: -90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: 90, opacity: 0 }}
                                        >
                                            <X size={24} />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="open"
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.5, opacity: 0 }}
                                        >
                                            <Bot size={28} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Status Indicator - Unclipped */}
                        {!isOpen && (
                            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-brand-indigo border-2 border-white rounded-full shadow-[0_0_15px_4px_rgba(10,10,90,0.8)] z-10" />
                        )}
                    </motion.button>
                </div>
            </motion.div>
        </>
    );
}
