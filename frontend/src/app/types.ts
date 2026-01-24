import type { StateCreator } from "zustand";

export type StoreSlice<T, U = T> = StateCreator<T, [], [], U>

export type Role = "ADMIN" | "TENANT" | "LANDLORD"