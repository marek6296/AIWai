"use client";

import { motion } from "framer-motion";

type IconType = "ai-agents" | "chatbots" | "automation" | "design" | "premium-design" | "growth";

interface PremiumIconProps {
  type: IconType;
  size?: number;
  className?: string;
  glow?: boolean;
}

export default function PremiumIcon({ type, size = 48, className = "", glow = true }: PremiumIconProps) {
  const renderIconContent = () => {
    switch (type) {
      case "ai-agents":
        return (
          <g>
            {/* Neural Nodes */}
            <motion.circle
              cx="24" cy="24" r="6"
              fill="currentColor"
              className="text-brand-sand opacity-80"
              animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.path
              d="M12 24L18 24M30 24L36 24M24 12L24 18M24 30L24 36M15.5 15.5L19.7 19.7M28.3 28.3L32.5 32.5M15.5 32.5L19.7 28.3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="text-brand-indigo/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            {/* Orbiting particles */}
            {[0, 90, 180, 270].map((angle, i) => (
              <motion.circle
                key={i}
                cx="24" cy="24" r="2"
                fill="currentColor"
                className="text-brand-sand"
                animate={{
                  x: [0, 14 * Math.cos(angle * Math.PI / 180)],
                  y: [0, 14 * Math.sin(angle * Math.PI / 180)],
                  opacity: [0, 1, 0],
                }}
                transition={{ duration: 2 + i * 0.5, repeat: Infinity, ease: "easeOut" }}
              />
            ))}
          </g>
        );
      case "chatbots":
        return (
          <g>
            {/* Concentric rings of intelligence */}
            {[1, 2, 3].map((i) => (
              <motion.circle
                key={i}
                cx="24" cy="24" r={i * 6}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-brand-indigo/10"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
              />
            ))}
            {/* Focal voice/brain indicator */}
            <motion.path
              d="M18 24C18 20.6863 20.6863 18 24 18C27.3137 18 30 20.6863 30 24C30 27.3137 27.3137 30 24 30C20.6863 30 18 27.3137 18 24Z"
              fill="currentColor"
              className="text-brand-indigo"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.path
              d="M20 24H28M22 21H26M22 27H26"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </g>
        );
      case "automation":
        return (
          <g>
            {/* Geometric structure */}
            <rect x="14" y="14" width="20" height="20" rx="3" fill="none" stroke="currentColor" strokeWidth="1" className="text-brand-indigo/20" />
            <motion.path
              d="M10 24H38M24 10V38"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-brand-indigo/10"
            />
            {/* Moving light nodes */}
            <motion.rect
              width="6" height="6" rx="1.5"
              fill="currentColor"
              className="text-brand-sand"
              animate={{
                x: [14, 28, 28, 14, 14],
                y: [14, 14, 28, 28, 14],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            />
            <motion.circle
              cx="24" cy="24" r="1.5"
              fill="currentColor"
              className="text-brand-indigo"
              animate={{ scale: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </g>
        );
      case "design":
        return (
          <g>
            {/* Prismatic layers */}
            <motion.path
              d="M24 6L6 34H42L24 6Z"
              fill="currentColor"
              className="text-brand-sand/10"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.path
              d="M24 14L12 34H36L24 14Z"
              fill="currentColor"
              className="text-brand-sand/30"
              animate={{ scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.circle
              cx="24" cy="28" r="4"
              fill="currentColor"
              className="text-brand-indigo"
            />
            {/* Reflection lines */}
            <motion.path
              d="M18 20L22 14M26 14L30 20"
              stroke="currentColor"
              className="text-brand-sand/50"
              strokeWidth="1"
              animate={{ pathLength: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </g>
        );
      case "premium-design":
        return (
          <g>
            {/* Sculptural abstract form */}
            <motion.path
                d="M12 12Q24 4 36 12Q44 24 36 36Q24 44 12 36Q4 24 12 12Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-brand-indigo/10"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
            <motion.path
                d="M16 16Q24 10 32 16Q38 24 32 32Q24 38 16 32Q10 24 16 16Z"
                fill="currentColor"
                className="text-brand-indigo"
                animate={{ 
                    scale: [1, 1.05, 1],
                    borderRadius: ["30%", "50%", "30%"]
                }}
                transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.circle
                cx="32" cy="16" r="3"
                fill="currentColor"
                className="text-brand-sand"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
            />
          </g>
        );
      case "growth":
        return (
          <g>
            {/* Geometric progression */}
            {[0, 1, 2].map((i) => (
                <motion.rect
                    key={i}
                    x={14 + i * 8}
                    y={32 - i * 8}
                    width="6"
                    height={i * 8 + 6}
                    rx="1"
                    fill="currentColor"
                    className={i === 2 ? "text-brand-sand" : "text-brand-indigo/30"}
                    initial={{ height: 0 }}
                    whileInView={{ height: i * 8 + 6 }}
                    transition={{ delay: i * 0.2, duration: 1 }}
                />
            ))}
            <motion.path
                d="M10 36H38"
                stroke="currentColor"
                strokeWidth="1"
                className="text-brand-indigo/20"
            />
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Decorative Glow */}
      {glow && (
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className={`absolute inset-0 rounded-full blur-xl pointer-events-none ${
            type === "ai-agents" || type === "design" || type === "growth"
              ? "bg-brand-sand"
              : "bg-brand-indigo"
          }`}
        />
      )}
      
      {/* SVG Icon Container */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 overflow-visible"
      >
        {renderIconContent()}
      </svg>
    </div>
  );
}
