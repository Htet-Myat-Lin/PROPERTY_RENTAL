import type { IUser } from "../auth/types";

export interface IPropertyFormSlice {
    currentStep: number;
    totalSteps: number;
    
    nextStep: () => void;
    prevStep: () => void;
    resetStep: () => void
}

export interface IProperty {
    _id: string;
    title: string;
    description: string;
    rentPrice: number;
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
    user: IUser,
    createdAt: Date;
    updatedAt: Date
}