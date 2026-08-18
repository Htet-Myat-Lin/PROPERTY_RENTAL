export function formatMessageTime(date: Date | string): string {
    return new Date(date).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function formatChatTimestamp(date: Date | string): string {
    const target = new Date(date);
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const day = new Date(target);
    day.setHours(0, 0, 0, 0);

    const diffDays = Math.round((today.getTime() - day.getTime()) / 86_400_000);

    if (diffDays === 0) {
        return formatMessageTime(target);
    }
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) {
        return target.toLocaleDateString("en-US", { weekday: "short" });
    }
    return target.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function getDateLabel(date: Date | string): string {
    const target = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const day = new Date(target);
    day.setHours(0, 0, 0, 0);

    const diffDays = Math.round((today.getTime() - day.getTime()) / 86_400_000);

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return target.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
    });
}

export const chatScrollbarCss = {
    "&::-webkit-scrollbar": { width: "4px" },
    "&::-webkit-scrollbar-track": { background: "transparent" },
    "&::-webkit-scrollbar-thumb": {
        background: "var(--chakra-colors-border-emphasized)",
        borderRadius: "full",
    },
};
