import { createAuthSlice } from "@/features/auth/store/auth-slice";
import type { IAuthSlice } from "@/features/auth/types";
import { createPropertyFormSlice } from "@/features/property/store/PropertyFormSlice";
import type { IPropertyFormSlice } from "@/features/property/types";
import { create } from "zustand";

type AppState = IAuthSlice & IPropertyFormSlice

export const useAppStore = create<AppState>()((...args) => ({
    ...createAuthSlice(...args),
    ...createPropertyFormSlice(...args)
}))