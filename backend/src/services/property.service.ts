import { createDeflate } from "node:zlib";
import { PropertyModel } from "../models/property.model.js";
import type { IProperty } from "../utils/types.js";

export class PropertyService {
    static async createProperty (data: Partial<IProperty>){
        return await PropertyModel.create(data)
    }

    static async getAllProperties() {
        return await PropertyModel.find().sort({ createdAt: -1 });
    }

    static async getPropertiesByLandlord(userId: string) {
        return await PropertyModel.find({ user: userId }).sort({ createdAt: -1 })
    }

    static async getPropertyById(id: string) {
        return await PropertyModel.findById(id);
    }

    static async updateProperty(id: string, data: Partial<IProperty>) {
        return await PropertyModel.findByIdAndUpdate(id, data, { new: true });
    }

    static async deleteProperty(id: string) {
        await PropertyModel.findByIdAndDelete(id)
    }
}