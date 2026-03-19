import type { IUser } from "../auth/types";

export interface IPropertyFormSlice {
  currentStep: number;
  totalSteps: number;

  nextStep: () => void;
  prevStep: () => void;
  resetStep: () => void;
}

export interface IProperty {
  id: string;
  title: string;
  description: string;
  baseRentPrice: number;
  beds: number;
  baths: number;
  area: number;
  propertyType: string;
  status: string;
  locationAddress?: string;
  coordinates: [number, number];
  images: string[];
  nearTransitType?: string;
  nearTransitDist?: number;
  parkingSpaces: number;
  rating: number;
  yearBuilt?: number;
  petAllowed: boolean;
  appliances?: string[];
  availableDate: string;
  internetName?: string;
  internetSpeed?: string;
  leaseTermMonths: number;
  user: IUser;
  createdAt: Date;
  updatedAt: Date;
}
