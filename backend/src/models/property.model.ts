import { model, Schema } from "mongoose";
import type { IProperty } from "../utils/types.js";

const propertySchema = new Schema<IProperty>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: [true, "Property Title is required"] },
    description: { type: String, required: [true, "Description is required"] },
    baseRentPrice: { type: Number, required: [true, "Rent Price is required"] },
    beds: Number,
    baths: Number,
    area: Number,
    propertyType: {
      type: String,
      enum: {
        values: ["Apartment", "House", "Condo", "Villa"],
        message: "Please select a valid property type",
      },
    },
    status: {
      type: String,
      enum: {
        values: ["AVAILABLE", "RENTED", "RESERVED"],
        message: "Please select a valid status",
      },
      default: "AVAILABLE",
    },
    location: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      address: String,
    },
    images: [String],
    nearTransit: { type: {type: String}, distance: Number },
    parkingSpaces: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    yearBuilt: {
      type: Number,
      validate: {
        validator: function (val) {
          return val <= new Date().getFullYear();
        },
        message: "Year Built must not be future date",
      },
    },
    petAllowed: { type: Boolean, default: false },
    appliances: [String],
    availableDate: Date,
    internet: { name: String, speed: String },
    leaseTermMonths: Number
  },
  {
    timestamps: true,
  },
);

export const PropertyModel = model<IProperty>("Property", propertySchema);
