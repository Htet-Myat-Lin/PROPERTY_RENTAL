export function formatNotificationDate(date: Date | string): string {
    const target = new Date(date);
    const diffMs = Date.now() - target.getTime();

    if (diffMs < 60_000) return "Just now";

    const diffMinutes = Math.floor(diffMs / 60_000);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;

    return target.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: target.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    });
}