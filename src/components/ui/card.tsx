import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * shadcn-style Card primitives. The shadcn project depends on CSS variables
 * (--card, --card-foreground, --muted-foreground, --border) that aren't
 * defined in this repo, so we resolve them to shadcn's canonical dark
 * defaults inline:
 *   --card: hsl(240 10% 3.9%)        → #09090B  (zinc-950)
 *   --card-foreground: hsl(0 0% 98%) → #FAFAFA
 *   --border: hsl(240 3.7% 15.9%)    → #27272A  (zinc-800)
 *   --muted-foreground: hsl(240 5% 64.9%) → #A1A1AA (zinc-400)
 */

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "rounded-lg border border-[#27272A] bg-[#09090B] text-[#FAFAFA] shadow-sm",
                className,
            )}
            {...props}
        />
    ),
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("flex flex-col space-y-1.5 p-6", className)}
            {...props}
        />
    ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h3
            ref={ref}
            className={cn(
                "text-2xl font-semibold leading-none tracking-tight text-[#FAFAFA]",
                className,
            )}
            {...props}
        />
    ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p
            ref={ref}
            className={cn("text-sm text-[#A1A1AA]", className)}
            {...props}
        />
    ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
    ),
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("flex items-center p-6 pt-0", className)}
            {...props}
        />
    ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
