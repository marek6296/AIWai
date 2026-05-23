import {
    Globe2,
    Bot,
    Workflow,
    Palette,
    Megaphone,
    type LucideIcon,
} from "lucide-react";

export const SERVICE_ICONS: Record<string, LucideIcon> = {
    "tvorba-webu": Globe2,
    "ai-chatbot": Bot,
    "ai-automatizacia": Workflow,
    "logo-branding": Palette,
    "sprava-socialnych-sieti": Megaphone,
};

export const SERVICE_TAGS: Record<string, string> = {
    "tvorba-webu": "WEB",
    "ai-chatbot": "AI",
    "ai-automatizacia": "AI",
    "logo-branding": "DIZAJN",
    "sprava-socialnych-sieti": "MARKETING",
};
