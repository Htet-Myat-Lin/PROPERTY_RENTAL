import { Container, Heading } from "@chakra-ui/react";
import { PropertyEditForm } from "../components/PropertyEditForm";
import { useEffect, useState } from "react";
import type { PropertyFormValues } from "../schema";

export function PropertyEditPage() {
  const [propertyData, setPropertyData] = useState<Partial<PropertyFormValues> | null>(null);
  const [propertyId] = useState("sample-property-id"); // This would come from URL params

  useEffect(() => {
    // Fetch property data
    const fetchProperty = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/properties/${propertyId}`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const result = await response.json();
          const property = result.property;
          
          // Transform backend data to frontend form format
          const formData: Partial<PropertyFormValues> = {
            title: property.title,
            description: property.description,
            rentPrice: property.rentPrice,
            beds: property.beds,
            baths: property.baths,
            area: property.area,
            propertyType: property.propertyType,
            location: {
              coordinates: [property.location.coordinates[1], property.location.coordinates[0]], // Convert from [lng, lat] to [lat, lng]
              address: property.location.address,
            },
            existingImages: property.images || [],
          };
          
          setPropertyData(formData);
        }
      } catch (error) {
        console.error('Error fetching property:', error);
      }
    };

    fetchProperty();
  }, [propertyId]);

  if (!propertyData) {
    return <div>Loading property data...</div>;
  }

  return (
    <Container maxW="container.md" py={8}>
      <Heading mb={6}>Edit Property</Heading>
      <PropertyEditForm propertyId={propertyId} initialData={propertyData} />
    </Container>
  );
}
