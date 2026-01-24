import { model, Schema } from "mongoose";
import type { IProperty } from "../utils/types.js";

const propertySchema = new Schema<IProperty>({
    title: {type: String, required: [true, "Property Title is required"]},
    description: {type: String, required: [true, "Description is required"]},
    rentPrice: {type: Number, requied: [true, "Rent Price is required"] },
    beds: Number,
    baths: Number,
    area: Number,
    propertyType: {
        type: String,
        enum: {
            values: ["Apartment", "House", "Condo", "Villa"],
            message: "Please select a valid property type"
        }
    },
    status: {
        type: String,
        enum: {
            values: ["AVAILABLE", "RENTED"],
            message: "Please slect a valid status"
        },
        default: "AVAILABLE"
    },
    location: {
        type: {
            type: String,
            default: "Point"
        },
        coordinates: {
            type: [Number],
            required: true
        },
        address: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    nearTransit: { type: String, distance: Number },
    parkingSpaces: Number,
    rating: { type: Number, default: 0 },
    images: [String]
},{
    timestamps: true
})

export const PropertyModel = model<IProperty>("Property", propertySchema)