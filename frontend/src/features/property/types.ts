import type { IUser } from "../auth/types";

export interface IPropertyFormSlice {
  currentStep: number;
  totalSteps: number;

  nextStep: () => void;
  prevStep: () => void;
  resetStep: () => void;
}

type UtilityType = "INCLUDED" | "FIXED" | "METERED";

export interface IProperty {
  _id: string;
  title: string;
  description: string;
  baseRentPrice: number;
  beds: number;
  baths: number;
  area: number;
  propertyType: string;
  status: string;
  location: { type: string; coordinates: [number, number]; address: string };
  images: string[];
  nearTransit: { type: string; distance: number };
  parkingSpaces: number;
  rating: number;
  yearBuilt?: number;
  petAllowed: boolean;
  appliances?: string[];
  availableDate: string;
  internet?: { name: string; speed: string };
  leaseTermMonths: number;
  utilityFee: {
    electricity: { type: UtilityType; amount?: number };
    water: { type: UtilityType; amount?: number };
    internet?: { type: UtilityType; amount?: number };
    trashCollection?: { type: UtilityType; amount?: number };
  };
  user: IUser;
  createdAt: Date;
  updatedAt: Date;
}
