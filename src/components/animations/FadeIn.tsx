interface FadeInProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "none";
    as?: "div" | "section" | "article";
}

export default function FadeIn({
    children,
    className = "",
    as: Tag = "div",
}: FadeInProps) {
    return <Tag className={className}>{children}</Tag>;
}
