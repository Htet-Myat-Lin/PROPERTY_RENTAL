import { Box, Button, For, HStack, IconButton, Input, NativeSelect, Text } from "@chakra-ui/react";
import { LuPlus, LuX } from "react-icons/lu";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import type { IBooking, IBookingSchedule } from "../types";
import { useUpdateBooking } from "../hooks/useUpdateBooking";
import { bookingDateLabel, bookingDateOptions, type BookingDateOption } from "../utils/date";

const timeSlots = [
    "09 AM", "10 AM", "11 AM", "12 PM",
    "01 PM", "02 PM", "03 PM", "04 PM", "05 PM",
];

type Props = {
    booking: IBooking;
    onClose: () => void;
};

export function BookingEditDialog({ booking, onClose }: Props) {
    const defaultSchedules: IBookingSchedule[] =
        Array.isArray(booking.schedules) && booking.schedules.length > 0
            ? booking.schedules
            : [{ date: "", time: "" }];

    const [phoneNumber, setPhoneNumber] = useState(booking.phoneNumber || "");
    const [schedules, setSchedules] = useState<IBookingSchedule[]>(defaultSchedules);
    const { mutate: updateBooking, isPending } = useUpdateBooking();

    const dateOptions = useMemo(() => {
        const options: BookingDateOption[] = bookingDateOptions();
        schedules.forEach((s) => {
            if (s.date && !options.some((o) => o.value === s.date)) {
                options.push({ value: s.date, label: bookingDateLabel(s.date) });
            }
        });
        return options;
    }, [schedules]);

    const timeOptions = useMemo(() => {
        const options = [...timeSlots];
        schedules.forEach((s) => {
            if (s.time && !options.includes(s.time)) options.push(s.time);
        });
        return options;
    }, [schedules]);

    const updateSchedule = (index: number, field: keyof IBookingSchedule, value: string) => {
        setSchedules((prev) =>
            prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
        );
    };

    const addSchedule = () => {
        if (schedules.length >= 3) {
            toast.warn("You can only have up to 3 dates.");
            return;
        }
        setSchedules((prev) => [...prev, { date: "", time: "" }]);
    };

    const removeSchedule = (index: number) => {
        setSchedules((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        const validSchedules = schedules.filter((s) => s.date && s.time);
        if (!validSchedules.length) {
            toast.warn("Please select at least one date and time.");
            return;
        }
        if (!phoneNumber.trim()) {
            toast.warn("Please enter your phone number.");
            return;
        }
        updateBooking(
            { bookingId: booking.id, payload: { phoneNumber, schedules: validSchedules } },
            {
                onSuccess: onClose,
            }
        );
    };

    return (
        <Box>
            <Text fontSize="sm" color="fg.muted" mb="3">
                Update your contact number and preferred tour times. You can add up to 3 options.
            </Text>

            <Text fontWeight="semibold" fontSize="sm" mb="2">Tour Schedules</Text>
            {schedules.length === 0 && (
                <Text fontSize="sm" color="fg.muted" mb="2">
                    No schedules selected.
                </Text>
            )}
            <For each={schedules}>
                {(schedule, index) => (
                    <HStack key={index} gap="2" mb="2" p="2" borderWidth="1px" borderRadius="md" borderColor="border.muted" bg="bg.muted">
                        <NativeSelect.Root size="sm" flex="1">
                            <NativeSelect.Field
                                value={schedule.date}
                                onChange={(e) => updateSchedule(index, "date", e.target.value)}
                            >
                                <option value="" disabled>Select Date</option>
                                <For each={dateOptions}>
                                    {(option) => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    )}
                                </For>
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                        <NativeSelect.Root size="sm" flex="1">
                            <NativeSelect.Field
                                value={schedule.time}
                                onChange={(e) => updateSchedule(index, "time", e.target.value)}
                            >
                                <option value="" disabled>Select Time</option>
                                <For each={timeOptions}>
                                    {(time) => (
                                        <option key={time} value={time}>{time}</option>
                                    )}
                                </For>
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                        {schedules.length > 1 && (
                            <IconButton
                                type="button"
                                aria-label="Remove schedule"
                                variant="ghost"
                                size="xs"
                                color="red.500"
                                borderRadius="md"
                                _hover={{ bg: "red.50", _dark: { bg: "red.950" } }}
                                onClick={() => removeSchedule(index)}
                                flexShrink={0}
                            >
                                <LuX />
                            </IconButton>
                        )}
                    </HStack>
                )}
            </For>

            {schedules.length < 3 && (
                <Button size="xs" variant="outline" onClick={addSchedule}>
                    <LuPlus /> Add Date
                </Button>
            )}

            <Input
                placeholder="Enter phone number"
                mt="3"
                size="md"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
            />

            <Button
                colorPalette="blue"
                mt="4"
                w="full"
                disabled={isPending}
                onClick={handleSave}
            >
                Save Changes
            </Button>
        </Box>
    );
}