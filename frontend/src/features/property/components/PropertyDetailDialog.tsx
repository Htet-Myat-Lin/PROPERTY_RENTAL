import {
  Box,
  Flex,
  Heading,
  Stack,
  Text,
  Badge,
  Grid,
  Image,
} from "@chakra-ui/react";
import type { IProperty } from "../types";

export function PropertyDetailDialog({ property }: { property: IProperty }) {
  const renderImagePreview = (images: string[]) => {
    if (!images || images.length === 0) return null;

    return (
      <Grid templateColumns="repeat(auto-fill, minmax(100px, 1fr))" gap={3}>
        {images.map((image, index) => (
          <Box key={index} boxSize="120px" overflow="hidden" borderRadius="md" borderWidth="1px">
            <Image
              src={`${import.meta.env.VITE_FILE_URL}/property-images/${image}`}
              alt={`Property image ${index + 1}`}
              boxSize="100%"
              objectFit="cover"
            />
          </Box>
        ))}
      </Grid>
    );
  };

  const formatUtilityFee = (utility: { type: string; amount?: number } | undefined) => {
    if (!utility) return "Not specified";
    if (utility.type === "INCLUDED") return "Included";
    if (utility.amount) return `${utility.type} - $${utility.amount}`;
    return utility.type;
  };

  return (
    <Box my="5" maxH="80vh" overflowY="auto">
      <Heading size="lg" mb="4">{property.title}</Heading>
      <Stack gap="4">
        {/* Basic Information */}
        <Box p="4" borderWidth="1px" borderRadius="md" bg="gray.50">
          <Heading size="sm" mb="3">Basic Information</Heading>
          <Stack gap="2">
            <Flex justify="space-between">
              <Text fontWeight="medium">Title:</Text>
              <Text>{property.title}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontWeight="medium">Description:</Text>
              <Text maxW="70%" textAlign="right">{property.description}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontWeight="medium">Rent Price:</Text>
              <Text fontWeight="bold" color="blue.600">${property.baseRentPrice}/month</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontWeight="medium">Area:</Text>
              <Text>{property.area} sqft</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontWeight="medium">Parking Spaces:</Text>
              <Text>{property.parkingSpaces || 0}</Text>
            </Flex>
            {property.yearBuilt && (
              <Flex justify="space-between">
                <Text fontWeight="medium">Year Built:</Text>
                <Text>{property.yearBuilt}</Text>
              </Flex>
            )}
            <Flex justify="space-between">
              <Text fontWeight="medium">Pet Allowed:</Text>
              <Badge colorPalette={property.petAllowed ? "green" : "red"}>
                {property.petAllowed ? "Yes" : "No"}
              </Badge>
            </Flex>
            {property.availableDate && (
              <Flex justify="space-between">
                <Text fontWeight="medium">Available Date:</Text>
                <Text>{new Date(property.availableDate).toLocaleDateString()}</Text>
              </Flex>
            )}
            <Flex justify="space-between">
              <Text fontWeight="medium">Status:</Text>
              <Badge 
                colorPalette={
                  property.status === "AVAILABLE" ? "green" : 
                  property.status === "RENTED" ? "red" : 
                  "yellow"
                }
              >
                {property.status}
              </Badge>
            </Flex>
          </Stack>
        </Box>

        {/* Property Details */}
        <Box p="4" borderWidth="1px" borderRadius="md" bg="gray.50">
          <Heading size="sm" mb="3">Property Details</Heading>
          <Stack gap="2">
            <Flex justify="space-between">
              <Text fontWeight="medium">Bedrooms:</Text>
              <Text>{property.beds}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontWeight="medium">Bathrooms:</Text>
              <Text>{property.baths}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontWeight="medium">Property Type:</Text>
              <Badge colorPalette="blue">{property.propertyType}</Badge>
            </Flex>
            {property.leaseTermMonths && (
              <Flex justify="space-between">
                <Text fontWeight="medium">Lease Term:</Text>
                <Text>{property.leaseTermMonths} months</Text>
              </Flex>
            )}
            {property.rating > 0 && (
              <Flex justify="space-between">
                <Text fontWeight="medium">Rating:</Text>
                <Text>{property.rating.toFixed(1)} ⭐</Text>
              </Flex>
            )}
          </Stack>
        </Box>

        {/* Location */}
        <Box p="4" borderWidth="1px" borderRadius="md" bg="gray.50">
          <Heading size="sm" mb="3">Location</Heading>
          <Stack gap="2">
            {property.location.address && (
              <Flex justify="space-between">
                <Text fontWeight="medium">Address:</Text>
                <Text maxW="70%" textAlign="right" fontSize="sm">
                  {property.location.address}
                </Text>
              </Flex>
            )}
            <Flex justify="space-between">
              <Text fontWeight="medium">Coordinates:</Text>
              <Text fontSize="sm" color="gray.600">
                {property.location.coordinates.length === 2
                  ? `${property.location.coordinates[0].toFixed(6)}, ${property.location.coordinates[1].toFixed(6)}`
                  : "Not set"}
              </Text>
            </Flex>
          </Stack>
        </Box>

        {/* Additional Features */}
        {(property.nearTransit || property.appliances?.length || property.internet) && (
          <Box p="4" borderWidth="1px" borderRadius="md" bg="gray.50">
            <Heading size="sm" mb="3">Additional Features</Heading>
            <Stack gap="2">
              {property.nearTransit?.type && (
                <Flex justify="space-between">
                  <Text fontWeight="medium">Near Transit:</Text>
                  <Text>
                    {property.nearTransit.type} ({property.nearTransit.distance}m)
                  </Text>
                </Flex>
              )}
              {property.appliances && property.appliances.length > 0 && (
                <Flex justify="space-between">
                  <Text fontWeight="medium">Appliances:</Text>
                  <Text maxW="70%" textAlign="right">
                    {property.appliances.join(", ")}
                  </Text>
                </Flex>
              )}
              {property.internet?.name && (
                <Flex justify="space-between">
                  <Text fontWeight="medium">Internet:</Text>
                  <Text>
                    {property.internet.name} ({property.internet.speed})
                  </Text>
                </Flex>
              )}
            </Stack>
          </Box>
        )}

        {/* Utility Fees */}
        {property.utilityFee && (
          <Box p="4" borderWidth="1px" borderRadius="md" bg="gray.50">
            <Heading size="sm" mb="3">Utility Fees</Heading>
            <Stack gap="2">
              {property.utilityFee.electricity && (
                <Flex justify="space-between">
                  <Text fontWeight="medium">Electricity:</Text>
                  <Text>{formatUtilityFee(property.utilityFee.electricity)}</Text>
                </Flex>
              )}
              {property.utilityFee.water && (
                <Flex justify="space-between">
                  <Text fontWeight="medium">Water:</Text>
                  <Text>{formatUtilityFee(property.utilityFee.water)}</Text>
                </Flex>
              )}
              {property.utilityFee.internet && (
                <Flex justify="space-between">
                  <Text fontWeight="medium">Internet (Utility):</Text>
                  <Text>{formatUtilityFee(property.utilityFee.internet)}</Text>
                </Flex>
              )}
              {property.utilityFee.trashCollection && (
                <Flex justify="space-between">
                  <Text fontWeight="medium">Trash Collection:</Text>
                  <Text>{formatUtilityFee(property.utilityFee.trashCollection)}</Text>
                </Flex>
              )}
            </Stack>
          </Box>
        )}

        {/* Images */}
        {property.images && property.images.length > 0 && (
          <Box p="4" borderWidth="1px" borderRadius="md" bg="gray.50">
            <Heading size="sm" mb="3">Property Images</Heading>
            {renderImagePreview(property.images)}
          </Box>
        )}

        {/* Landlord Information */}
        {property.user && (
          <Box p="4" borderWidth="1px" borderRadius="md" bg="gray.50">
            <Heading size="sm" mb="3">Landlord Information</Heading>
            <Stack gap="2">
              <Flex justify="space-between">
                <Text fontWeight="medium">Name:</Text>
                <Text>{property.user.username || property.user.email}</Text>
              </Flex>
              {property.user.email && (
                <Flex justify="space-between">
                  <Text fontWeight="medium">Email:</Text>
                  <Text fontSize="sm">{property.user.email}</Text>
                </Flex>
              )}
            </Stack>
          </Box>
        )}

        {/* Dates */}
        <Box p="4" borderWidth="1px" borderRadius="md" bg="gray.50">
          <Heading size="sm" mb="3">Listing Information</Heading>
          <Stack gap="2">
            <Flex justify="space-between">
              <Text fontWeight="medium">Created:</Text>
              <Text fontSize="sm" color="gray.600">
                {new Date(property.createdAt).toLocaleDateString()}
              </Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontWeight="medium">Last Updated:</Text>
              <Text fontSize="sm" color="gray.600">
                {new Date(property.updatedAt).toLocaleDateString()}
              </Text>
            </Flex>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
