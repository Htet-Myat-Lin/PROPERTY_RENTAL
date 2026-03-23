import { z } from "zod";

export const propertySchema = z
  .object({
    title: z.string().min(1, "Title is required"),

    description: z.string().min(1, "Description is required"),

    baseRentPrice: z.coerce
      .number()
      .min(0, "Price cannot be negative")
      .default(0),

    beds: z.coerce.number().nonnegative().default(0),

    baths: z.coerce.number().nonnegative().default(0),

    area: z.coerce.number().nonnegative().default(0),

    propertyType: z.string().min(1, "Property Type is required"),

    coordinates: z.preprocess(
      (val) => {
        if (typeof val === "string") {
          try {
            return JSON.parse(val);
          } catch {
            return undefined;
          }
        }
        return val;
      },
      z.array(z.number()).length(2, "Property location is required"),
    ),

    locationAddress: z.string().min(1, "Address is required"),

    images: z.any().array().optional(),

    existingImages: z.preprocess((val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return [];
        }
      }
      return val;
    }, z.array(z.string()).optional()),

    nearTransitType: z.string().optional(),

    nearTransitDist: z.coerce.number().nonnegative().optional(),

    parkingSpaces: z.coerce.number().nonnegative().default(0),

    yearBuilt: z.preprocess((val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    }, z.number().nonnegative().optional()),

    petAllowed: z
      .preprocess((val) => val === "true" || val === true, z.boolean())
      .default(false),

    appliances: z.preprocess((val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return [];
        }
      }
      return val;
    }, z.array(z.string()).optional()),

    availableDate: z.preprocess((val) => {
      if (!val) return undefined;
      const date = new Date(val as string);
      return isNaN(date.getTime()) ? undefined : date;
    }, z.date()),

    internetName: z.string().optional(),

    internetSpeed: z.string().optional(),

    leaseTermMonths: z.coerce
      .number()
      .min(6, "Minimum Lease Term must be 6 months")
      .optional(),
  })

export type PropertySchema = z.infer<typeof propertySchema>;
