import { z } from "zod";

export const propertyFormSchema = z.object({
    title: z.string().min(1, "Title is requried"),
    description: z.string().min(1, "Description is required"),
    rentPrice: z.coerce // coerce converts "" or "123" into numbers
        .number()
        .min(0, "Price cannot be negative")
        .default(0),
    beds: z.coerce.number().nonnegative(),
    baths: z.coerce.number().nonnegative(),
    area: z.coerce.number().nonnegative(),
    propertyType: z.string().min(1, "Property Type is required"),
    location: z.object({
        coordinates: z
            .array(z.number())
            .length(2, "Property location is required"),
        address: z.string().optional(),
    }),
    images: z.any().array().optional(),
    existingImages: z.array(z.string()).optional(),
})
    .superRefine((data, ctx) => {
    const hasNewImages = data.images && data.images.length > 0;
    const hasExistingImages = data.existingImages && data.existingImages.length > 0;

    if (!hasNewImages && !hasExistingImages) {
      ctx.addIssue({
        path: ["images"],
        message: "At least one image is required",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;
