"use client";

import { cn } from "@/lib/utils";
import { motion, stagger, useAnimate, useInView } from "framer-motion";
import { useEffect, useState } from "react";

type Word = { text: string; className?: string };

export const TypewriterEffect = ({
    words,
    className,
    cursorClassName,
    speed = 0.03,
    cursorLingerMs = 1600,
    startDelayMs = 0,
}: {
    words: Word[];
    className?: string;
    cursorClassName?: string;
    speed?: number;
    cursorLingerMs?: number;
    startDelayMs?: number;
}) => {
    const wordsArray = words.map((word) => ({ ...word, text: word.text.split("") }));
    const totalChars = wordsArray.reduce((sum, w) => sum + w.text.length, 0);
    const [scope, animate] = useAnimate();
    const isInView = useInView(scope);
    const [cursorActive, setCursorActive] = useState(false);

    useEffect(() => {
        if (!isInView) return;
        const startId = setTimeout(() => {
            setCursorActive(true);
            animate(
                "span",
                { display: "inline-block", opacity: 1, width: "fit-content" },
                { duration: 0.18, delay: stagger(speed), ease: "easeInOut" },
            );
        }, startDelayMs);
        const typingMs = totalChars * speed * 1000 + 180;
        const stopId = setTimeout(() => setCursorActive(false), startDelayMs + typingMs + cursorLingerMs);
        return () => {
            clearTimeout(startId);
            clearTimeout(stopId);
        };
    }, [isInView, animate, speed, totalChars, cursorLingerMs, startDelayMs]);

    return (
        <div className={cn("text-center", className)}>
            <motion.div ref={scope} className="inline">
                {wordsArray.map((word, idx) => (
                    <div key={`word-${idx}`} className="inline-block">
                        {word.text.map((char, index) => (
                            <motion.span
                                initial={{}}
                                key={`char-${index}`}
                                className={cn("text-cream opacity-0 hidden", word.className)}
                            >
                                {char}
                            </motion.span>
                        ))}
                        &nbsp;
                    </div>
                ))}
            </motion.div>
            <motion.span
                initial={{ opacity: 0 }}
                animate={cursorActive ? { opacity: [0, 1, 0] } : { opacity: 0 }}
                transition={cursorActive
                    ? { duration: 0.9, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 0.6, ease: "easeOut" }}
                className={cn("inline-block rounded-sm w-[2px] h-4 md:h-5 bg-gold align-middle", cursorClassName)}
            />
        </div>
    );
};

export const TypewriterEffectSmooth = ({
    words,
    className,
    cursorClassName,
    duration = 2,
    delay = 0.4,
}: {
    words: Word[];
    className?: string;
    cursorClassName?: string;
    duration?: number;
    delay?: number;
}) => {
    const wordsArray = words.map((word) => ({ ...word, text: word.text.split("") }));

    return (
        <div className={cn("flex items-center", className)}>
            <motion.div
                className="overflow-hidden"
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration, ease: "linear", delay }}
            >
                <div className="font-light text-[15px] md:text-xl text-cream/65 leading-relaxed">
                    {wordsArray.map((word, idx) => (
                        <span key={`word-${idx}`} className="inline-block whitespace-pre">
                            {word.text.map((char, index) => (
                                <span key={`char-${index}`} className={cn("text-cream/65", word.className)}>
                                    {char}
                                </span>
                            ))}
                            {idx < wordsArray.length - 1 ? " " : ""}
                        </span>
                    ))}
                </div>
            </motion.div>
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                className={cn("ml-1 inline-block w-[2px] h-4 md:h-5 bg-gold rounded-sm", cursorClassName)}
            />
        </div>
    );
};
