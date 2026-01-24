import type { StoreSlice } from "@/app/types";
import type { IAuthSlice } from "../types";

export const createAuthSlice : StoreSlice<IAuthSlice> = (set) => ({
    user: null,
    accessToken: null,
    loading: true,

    setUser: (user) => set({ user }),
    setAccessToken: (token) => set({ accessToken: token }),
    setLoading: (loading) => set({ loading })
})