import type {StoreSlice} from "@/app/types.ts";
import type {INotificationSlice} from "@/features/notification/type.ts";

export const createNotificationSlice: StoreSlice<INotificationSlice> = (set) => ({
    notifications: [],
    setNotifications: (notifications) => set((state) => ({ notifications: typeof notifications === "function" ? notifications(state.notifications) : notifications })),
})