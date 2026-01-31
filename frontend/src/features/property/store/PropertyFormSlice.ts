import type { StoreSlice } from "@/app/types";
import type { IPropertyFormSlice } from "../types"

export const createPropertyFormSlice: StoreSlice<IPropertyFormSlice> = (set) => ({
  currentStep: 0,
  totalSteps: 3,

  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.totalSteps - 1, state.currentStep + 1),
    })),

  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(0, state.currentStep - 1),
    })),

  resetStep: () => set({ currentStep: 0 })
})