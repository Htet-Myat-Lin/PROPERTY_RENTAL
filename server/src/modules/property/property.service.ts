import { PropertyRepository } from "@/repositories/property.repository";
import { PropertyFilters } from "@/types/types";
import { AppError, NotFoundError } from "@/utils/app.error";
import { PropertyType } from "generated/prisma/client.js";
import fs from "node:fs"

const PROPERTY_TYPES = Object.values(PropertyType) as string[];

export const getPropertiesByLandlordService = async (
  landlordId: string,
  filters: PropertyFilters,
) => {
  const { search, sortBy, status } = filters;
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const skip = (page - 1) * limit;

  const queryFilters: any = {};
  if (landlordId) queryFilters.landlordId = landlordId;
  if (status) queryFilters.status = status;
  if (search && search.trim().length > 0) {
    const searchTerm = search.trim().toLowerCase();
    const orConditions: any[] = [
      { title: { contains: searchTerm, mode: "insensitive" } },
      { description: { contains: searchTerm, mode: "insensitive" } },
      { locationAddress: { contains: searchTerm, mode: "insensitive" } }
    ];
    const matchingPropertyType = PROPERTY_TYPES.find(
      (t) => t.toLowerCase() === searchTerm
    );
    if (matchingPropertyType) {
      orConditions.push({ propertyType: { equals: matchingPropertyType as PropertyType } });
    }
    queryFilters.OR = orConditions;
  }

  let orderBy: any = { createdAt: "desc" }; // default newest
  if (sortBy) {
    switch (sortBy) {
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "priceAsc":
        orderBy = { baseRentPrice: "asc" };
        break;
      case "priceDesc":
        orderBy = { baseRentPrice: "desc" };
        break;
      default:
        break;
    }
  }

  const { properties, totalCount } = await PropertyRepository.findByLandlordId(
    queryFilters,
    orderBy,
    skip,
    limit,
  );

  return { properties, totalPages: Math.ceil(totalCount / limit), totalCount };
};

export const createPropertyService = async (
  landlordId: string,
  body: any,
  files: Express.Multer.File[],
) => {
  if (typeof body.coordinates === "string") {
    body.coordinates = JSON.parse(body.coordinates);
  }
  if (typeof body.appliances === "string") {
    body.appliances = JSON.parse(body.appliances);
  }
  body.baseRentPrice = Number(body.baseRentPrice);
  body.beds = Number(body.beds);
  body.baths = Number(body.baths);
  body.area = Number(body.area);
  body.parkingSpaces = Number(body.parkingSpaces);
  body.yearBuilt = Number(body.yearBuilt);
  body.leaseTermMonths = Number(body.leaseTermMonths);
  body.petAllowed = Boolean(body.petAllowed);
  body.availableDate = new Date(body.availableDate);
  body.nearTransitDist = Number(body.nearTransitDist);

  const images = files?.map((file) => file.filename);

  const newProperty = await PropertyRepository.create({
    ...body,
    images,
    landlordId: landlordId,
  });

  return { property: newProperty };
};

export const editPropertyService = async (propertyId: string, body: any, files: Express.Multer.File[]) => {
  const property = await PropertyRepository.findById(propertyId);
  if (!property) throw new NotFoundError("Property");

  if (typeof body.coordinates === "string") {
    body.coordinates = JSON.parse(body.coordinates);
  }
  if (typeof body.appliances === "string") {
    body.appliances = JSON.parse(body.appliances);
  }
  if (typeof body.existingImages === "string") {
    body.existingImages = JSON.parse(body.existingImages);
  }

  const existingImages = body.existingImages || [];

  if (files.length + existingImages.length > 5) throw new AppError("You can upload a maximum of 5 images", 400);

  const imagesToDelete = property.images.filter(img => !existingImages.includes(img));
  imagesToDelete.forEach(img => {
    const imgPath = `src/uploads/property-images/${img}`;
    if (fs.existsSync(imgPath)) fs.unlink(imgPath, () => {});
  })

  const newImages = files?.map((file) => file.filename)

  delete body.expressingImages // remove existing images from body for update
  
  const updatedProperty = await PropertyRepository.edit(propertyId, { ...body, images: [...existingImages, ...newImages] })

  return { property: updatedProperty };
}

export const deletePropertyService = async (propertyId: string) => {
  const property = await PropertyRepository.findById(propertyId);
  if (!property) throw new NotFoundError("Property");
  property.images?.forEach((img) => {
    const imgPath = `src/uploads/property-images/${img}`;
    if (fs.existsSync(imgPath)) fs.unlink(imgPath, () => {});
  });
  await PropertyRepository.delete(propertyId);

  return { message: "Property deleted successfully" };
}

export const bulkDeletePropertiesService = async (ids: string[]) => {
  const properties = await PropertyRepository.findByIds(ids);
  if (!properties.length) throw new AppError("No properties", 404);
  properties.forEach((property) => {
    property?.images?.forEach((img) => {
      const imgPath = `src/uploads/property-images/${img}`;
      if (fs.existsSync(imgPath)) fs.unlink(imgPath, () => {});
    });
  });
  
  await PropertyRepository.bulkDelete(ids);

  return { message: "Properties deleted successfully" };
}
