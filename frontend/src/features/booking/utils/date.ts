export type BookingDateOption = {
    value: string;
    label: string;
};

export function toISODate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function formatBookingDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
}

export function bookingDateLabel(value: string): string {
    const date = new Date(value);
    if (!isNaN(date.getTime())) return formatBookingDate(date);
    return value;
}

export function bookingDateOptions(count = 7): BookingDateOption[] {
    const today = new Date();
    const options: BookingDateOption[] = [];
    for (let i = 0; i < count; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        options.push({ value: toISODate(date), label: formatBookingDate(date) });
    }
    return options;
}

export function timeSlotToTime(time: string): string {
    const match = time.trim().match(/^(\d{1,2})\s*(AM|PM)$/i);
    if (!match) return "00:00:00";
    let hour = parseInt(match[1], 10);
    const meridian = match[2].toUpperCase();
    if (meridian === "PM" && hour !== 12) hour += 12;
    if (meridian === "AM" && hour === 12) hour = 0;
    return `${String(hour).padStart(2, "0")}:00:00`;
}