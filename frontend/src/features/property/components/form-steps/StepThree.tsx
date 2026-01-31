import {
  Box,
  Flex,
  Heading,
  Stack,
  Text,
  Badge,
  Separator,
  Grid,
  Image
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import type { PropertyFormValues } from "../../schema";
import { formatAddress, reverseGeocode } from "@/utils/geocoding";
import { useEffect, useState } from "react";

export function StepThree() {
  const { watch, setValue } = useFormContext<PropertyFormValues>();
  const formData = watch();
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    const getAddress = async () => {
      if (formData.location.coordinates.length === 2) {
        const [lat, lng] = formData.location.coordinates;
        const result = await reverseGeocode(lat, lng);
        const formattedAddress = formatAddress(result);
        setAddress(formattedAddress);
      }
    };
    getAddress();
    setValue("location.address", address);
  }, [formData.location.coordinates, setValue, address]);

  const renderImagePreview = (images: string[]) => {
    if (!images || images.length === 0) return null;
  
    return (
      <Grid templateColumns="repeat(auto-fill, minmax(80px, 1fr))" gap={2}>
        {images.map((image, index) => (
          <Box key={index} boxSize="90px" overflow="hidden" borderRadius="md">
            {typeof image === "string" ? (
              <Image
                src={`${import.meta.env.VITE_FILE_URL}/property-images/${image}`}
                alt={`Property image ${index + 1}`}
                boxSize="100%"
                objectFit="cover"
              />
            ) : (
              <Image
                src={URL.createObjectURL(image)}
                alt={`Property image ${index + 1}`}
                boxSize="100%"
                objectFit="cover"
              />
            )}
          </Box>
        ))}
      </Grid>
    );
  };

  return (
    <Box my="5">
      <Heading size="md" mb="4">Review Property Details</Heading>
      <Stack gap="4">
        {/* Basic Information */}
        <Box p="4" borderWidth="1px" borderRadius="md">
          <Heading size="sm" mb="3">Basic Information</Heading>
          <Stack gap="2">
            <Flex justify="space-between">
              <Text fontWeight="medium">Title:</Text>
              <Text>{formData.title}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontWeight="medium">Description:</Text>
              <Text maxW="70%" textAlign="right">{formData.description}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontWeight="medium">Rent Price:</Text>
              <Text>${formData.baseRentPrice}/month</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontWeight="medium">Area:</Text>
              <Text>{formData.area} sqft</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontWeight="medium">Parking Spaces:</Text>
              <Text>{formData.parkingSpaces || 0}</Text>
            </Flex>
            {formData.yearBuilt && (
              <Flex justify="space-between">
                <Text fontWeight="medium">Year Built:</Text>
                <Text>{formData.yearBuilt}</Text>
              </Flex>
            )}
            <Flex justify="space-between">
              <Text fontWeight="medium">Pet Allowed:</Text>
              <Badge colorScheme={formData.petAllowed ? "green" : "red"}>
                {formData.petAllowed ? "Yes" : "No"}
              </Badge>
            </Flex>
            {formData.availableDate && (
              <Flex justify="space-between">
                <Text fontWeight="medium">Available Date:</Text>
                <Text>{new Date(formData.availableDate).toLocaleDateString()}</Text>
              </Flex>
            )}
          </Stack>
        </Box>

        {/* Property Details */}
        <Box p="4" borderWidth="1px" borderRadius="md">
          <Heading size="sm" mb="3">Property Details</Heading>
          <Stack gap="2">
            <Flex justify="space-between">
              <Text fontWeight="medium">Bedrooms:</Text>
              <Text>{formData.beds}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontWeight="medium">Bathrooms:</Text>
              <Text>{formData.baths}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontWeight="medium">Property Type:</Text>
              <Badge colorScheme="blue">{formData.propertyType}</Badge>
            </Flex>
            {formData.leaseTermMonths && (
              <Flex justify="space-between">
                <Text fontWeight="medium">Lease Term:</Text>
                <Text>{formData.leaseTermMonths} months</Text>
              </Flex>
            )}
          </Stack>
        </Box>

        {/* Additional Features */}
        {(formData.nearTransit || formData.appliances?.length || formData.internet) && (
          <Box p="4" borderWidth="1px" borderRadius="md">
            <Heading size="sm" mb="3">Additional Features</Heading>
            <Stack gap="2">
              {formData.nearTransit?.type && (
                <Flex justify="space-between">
                  <Text fontWeight="medium">Near Transit:</Text>
                  <Text>{formData.nearTransit.type} ({formData.nearTransit.distance}m)</Text>
                </Flex>
              )}
              {formData.appliances && formData.appliances.length > 0 && (
                <Flex justify="space-between">
                  <Text fontWeight="medium">Appliances:</Text>
                  <Text>{formData.appliances.join(", ")}</Text>
                </Flex>
              )}
              {formData.internet?.name && (
                <Flex justify="space-between">
                  <Text fontWeight="medium">Internet:</Text>
                  <Text>{formData.internet.name} ({formData.internet.speed})</Text>
                </Flex>
              )}
            </Stack>
          </Box>
        )}

        {/* Location */}
        <Box p="4" borderWidth="1px" borderRadius="md">
          <Heading size="sm" mb="3">Location</Heading>
          <Stack gap="2">
            <Flex justify="space-between">
              <Text fontWeight="medium">Coordinates:</Text>
              <Text fontSize="sm" color="gray.600">
                {formData.location.coordinates.length === 2 
                  ? `${formData.location.coordinates[0].toFixed(6)}, ${formData.location.coordinates[1].toFixed(6)}`
                  : 'Not set'
                }
              </Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontWeight="medium">Address:</Text>
              <Text maxW="70%" textAlign="right" fontSize="sm">
                {address || 'Loading address...'}
              </Text>
            </Flex>
          </Stack>
        </Box>

        {/* Images */}
        <Box p="4" borderWidth="1px" borderRadius="md">
          <Heading size="sm" mb="3">Property Images</Heading>
          {renderImagePreview(formData.images || [])}
          {formData.existingImages && formData.existingImages.length > 0 && (
            <>
              <Separator my="2" />
              <Text fontSize="sm" fontWeight="medium" mb="2">Existing Images:</Text>
              {renderImagePreview(formData.existingImages)}
            </>
          )}
        </Box>

        {/* Submit Notice */}
        <Box p="4" bg="blue.50" borderRadius="md">
          <Text fontSize="sm" color="blue.800">
            Please review all the information above. Click "Create Property" to submit your listing.
          </Text>
        </Box>
      </Stack>
    </Box>
  );
}