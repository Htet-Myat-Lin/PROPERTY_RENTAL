import fs from "node:fs";
import { PropertyModel } from "../models/property.model.js";
import type { IProperty, PropertyFilters } from "../utils/types.js";
import { AppError } from "../utils/app.error.js";

export class PropertyService {
  static async createProperty(data: Partial<IProperty>) {
    return await PropertyModel.create(data);
  }

  static async getAllProperties() {
    return await PropertyModel.find()
      .sort({ createdAt: -1 })
      .populate("user", "username");
  }

  static async getPropertiesByLandlord(
    userId: string,
    filters: PropertyFilters,
  ) {
    const { search, sortBy, status } = filters;
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const queryFilters: any = {};
    if (status) {
      queryFilters.status = status;
    }
    if (search && search.trim().length > 0) {
      const searchTerm = new RegExp(search, "i");
      queryFilters.$or = [
        { title: { $regex: searchTerm } },
        { description: { $regex: searchTerm } },
        { propertyType: { $regex: searchTerm } },
        { "location.address": { $regex: searchTerm } },
      ];
    }

    const sort: any = {};
    if (sortBy) {
      switch (sortBy) {
        case "newest":
          sort.createdAt = -1;
          break;
        case "oldest":
          sort.createdAt = 1;
          break;
        case "priceAsc":
          sort.baseRentPrice = 1;
          break;
        case "priceDesc":
          sort.baseRentPrice = -1;
          break;
        default:
          break;
      }
    } else {
      sort.createdAt = -1;
    }

    const propertyQuery = PropertyModel.find(queryFilters)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("user", "username");

    const totalCountQuery = PropertyModel.countDocuments(queryFilters)

    const [properties, totalCount] = await Promise.all([propertyQuery, totalCountQuery])

    const totalPages = Math.ceil(totalCount / limit)

    return { properties, totalPages }
  }

  static async getPropertyById(id: string) {
    return await PropertyModel.findById(id).populate("user", "username");
  }

  static async updateProperty(id: string, data: Partial<IProperty>) {
    return await PropertyModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  static async deleteProperty(id: string) {
    const property = await this.getPropertyById(id);
    if (!property) throw new AppError("Property not found", 404);
    property.images?.forEach((img) => {
      const imgPath = `src/uploads/property-images/${img}`;
      if (fs.existsSync(imgPath)) {
        fs.unlink(imgPath, () => {});
      }
    });
    await PropertyModel.findByIdAndDelete(id);
  }

  static async deleteProperties(ids: string[]) {
    const properties = await PropertyModel.find({ _id: { $in: ids } });
    if (!properties.length) throw new AppError("No properties", 404);
    properties.forEach((property) => {
      property?.images?.forEach((img) => {
        const imgPath = `src/uploads/property-images/${img}`;
        if (fs.existsSync(imgPath)) {
          fs.unlink(imgPath, () => {});
        }
      });
    });

    await PropertyModel.deleteMany({ _id: { $in: ids } });
  }
}
