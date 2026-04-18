"use client";

export type IconType =
  | "ai-agents"
  | "chatbots"
  | "automation"
  | "design"
  | "premium-design"
  | "growth";

interface PremiumIconProps {
    type: IconType;
    className?: string;
    size?: number;
}

export default function PremiumIcon({ type, className = "", size = 120 }: PremiumIconProps) {
    const renderIcon = () => {
        switch (type) {
            case "ai-agents":
                return (
                    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
                        <path d="M30 45C30 36.7157 36.7157 30 45 30H55C63.2843 30 70 36.7157 70 45V60C70 65.5228 65.5228 70 60 70H40C34.4772 70 30 65.5228 30 60V45Z" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M30 50H70" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
                        <rect x="38" y="42" width="24" height="6" rx="3" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="44" cy="45" r="1" fill="currentColor" />
                        <circle cx="56" cy="45" r="1" fill="currentColor" />
                        <path d="M50 30V22" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="50" cy="20" r="2" stroke="currentColor" strokeWidth="1" />
                        <path d="M70 45H76M70 55H76M30 45H24M30 55H24" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
                    </svg>
                );
            case "chatbots":
                return (
                    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
                        <circle cx="50" cy="50" r="8" stroke="currentColor" strokeWidth="2" />
                        <path d="M35 35C40 30 45 28 50 28C55 28 60 30 65 35" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        <path d="M28 28C35 21 42 18 50 18C58 18 65 21 72 28" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" strokeLinecap="round" />
                        <path d="M35 65C40 70 45 72 50 72C55 72 60 70 65 65" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        <path d="M28 72C35 79 42 82 50 82C58 82 65 79 72 72" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" strokeLinecap="round" />
                        <circle cx="50" cy="38" r="1.5" fill="currentColor" />
                        <circle cx="50" cy="62" r="1.5" fill="currentColor" />
                    </svg>
                );
            case "automation":
                return (
                    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
                        <path d="M60 40C60 34.4772 55.5228 30 50 30C44.4772 30 40 34.4772 40 40M40 60C40 65.5228 44.4772 70 50 70C55.5228 70 60 65.5228 60 60" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M45 45L55 55M55 45L45 55" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M25 50H35M65 50H75M50 25V35M50 65V75" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
                        <circle cx="20" cy="50" r="2.5" stroke="currentColor" strokeWidth="1" />
                        <circle cx="80" cy="50" r="2.5" stroke="currentColor" strokeWidth="1" />
                    </svg>
                );
            case "design":
                return (
                    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
                        <path d="M30 40C30 30 40 25 50 25C70 25 80 35 80 55C80 70 65 80 45 80C30 80 20 70 20 55C20 50 25 45 30 45V40Z" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="40" cy="45" r="3" fill="currentColor" fillOpacity="0.2" stroke="currentColor" />
                        <circle cx="55" cy="40" r="3" fill="currentColor" fillOpacity="0.2" stroke="currentColor" />
                        <circle cx="65" cy="55" r="3" fill="currentColor" fillOpacity="0.2" stroke="currentColor" />
                        <path d="M45 60L65 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                );
            case "premium-design":
                return (
                    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
                        <path d="M50 20L80 40L80 65L50 85L20 65L20 40L50 20Z" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M20 40L50 50L80 40M50 50V85" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
                        <path d="M20 65L50 50L80 65" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
                    </svg>
                );
            case "growth":
                return (
                    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
                        <path d="M30 75H70" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <rect x="35" y="55" width="6" height="20" rx="1" stroke="currentColor" strokeWidth="1.5" />
                        <rect x="47" y="40" width="6" height="35" rx="1" stroke="currentColor" strokeWidth="1.5" />
                        <rect x="59" y="25" width="6" height="50" rx="1" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M30 65C40 65 50 45 75 20" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" strokeOpacity="0.5" />
                        <path d="M70 20H75V25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`flex items-center justify-center relative ${className}`}>
            <div className="absolute inset-0 bg-brand-sand/[0.03] blur-[40px] rounded-full scale-150 pointer-events-none" />
            {renderIcon()}
        </div>
    );
}
