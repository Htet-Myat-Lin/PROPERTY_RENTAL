import {
  Box,
  Flex,
  Heading,
  Stack,
  Text,
  Badge,
  Separator,
  Grid,
  Image,
  Icon,
} from "@chakra-ui/react";
import type { IconType } from "react-icons/lib";
import { useFormContext } from "react-hook-form";
import type { PropertyFormValues } from "../../schema";
import { formatAddress, reverseGeocode } from "@/utils/geocoding";
import { useEffect, useState } from "react";
import { 
  LuDollarSign, 
  LuRuler, 
  LuCar, 
  LuCalendar, 
  LuMapPin,
  LuWifi,
  LuWarehouse,
  LuCircle,
  LuBedDouble,
  LuBath
} from "react-icons/lu";

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
          <Box 
            key={index} 
            boxSize="90px" 
            overflow="hidden" 
            borderRadius="lg"
            border="1px solid"
            borderColor="border"
          >
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

  const InfoRow = ({ label, value, icon, badgeColor }: { label: string; value: React.ReactNode; icon?: IconType; badgeColor?: string }) => (
    <Flex justify="space-between" align="center" py={2}>
      <HStack gap={2} color="fg.muted">
        {icon && <Icon as={icon} boxSize={4} />}
        <Text fontSize="sm">{label}</Text>
      </HStack>
      {badgeColor ? (
        <Badge colorPalette={badgeColor} borderRadius="full" px={3} py={1}>
          {value as string}
        </Badge>
      ) : (
        <Text fontSize="sm" fontWeight="medium" textAlign="right" maxW="60%">
          {value as string}
        </Text>
      )}
    </Flex>
  );

  const HStack = Flex;

  return (
    <Box my="2">
      <Box 
        mb={4} 
        p={4} 
        bg="blue.50" 
        _dark={{ bg: "blue.950", borderColor: "blue.800" }}
        borderRadius="xl"
        border="1px solid"
        borderColor="blue.200"
      >
        <Flex align="center" gap={2}>
          <Icon as={LuCircle} boxSize={5} color="blue.500" />
          <Text fontWeight="semibold" color="blue.700" _dark={{ color: "blue.200" }}>
            Please review all information before submitting
          </Text>
        </Flex>
      </Box>

      <Stack gap={4}>
        {/* Basic Information */}
        <Box 
          p={4} 
          borderWidth="1px" 
          borderRadius="xl"
          borderColor="border"
        >
          <Heading size="sm" mb={4} color="fg">
            Basic Information
          </Heading>
          <InfoRow 
            label="Title" 
            value={formData.title} 
          />
          <InfoRow 
            label="Description" 
            value={
              <Text fontSize="sm" color="fg.muted" textAlign="right" maxW="60%" lineClamp={2}>
                {formData.description}
              </Text>
            } 
          />
          <Separator my={2} />
          <Grid templateColumns="1fr 1fr" gap={2}>
            <InfoRow 
              label="Rent Price" 
              value={`$${formData.baseRentPrice}/mo`}
              icon={LuDollarSign}
              badgeColor="green"
            />
            <InfoRow 
              label="Area" 
              value={`${formData.area} sqft`}
              icon={LuRuler}
            />
            <InfoRow 
              label="Parking" 
              value={formData.parkingSpaces || 0}
              icon={LuCar}
            />
            <InfoRow 
              label="Year Built" 
              value={formData.yearBuilt || "N/A"}
            />
          </Grid>
          <Separator my={2} />
          <Grid templateColumns="1fr 1fr" gap={2}>
            <InfoRow 
              label="Pet Allowed" 
              value={formData.petAllowed ? "Yes" : "No"}
              badgeColor={formData.petAllowed ? "green" : "red"}
            />
            <InfoRow 
              label="Available" 
              value={formData.availableDate ? new Date(formData.availableDate).toLocaleDateString() : "N/A"}
              icon={LuCalendar}
            />
          </Grid>
        </Box>

        {/* Property Details */}
        <Box 
          p={4} 
          borderWidth="1px" 
          borderRadius="xl"
          borderColor="border"
        >
          <Heading size="sm" mb={4} color="fg">
            Property Details
          </Heading>
          <Grid templateColumns="1fr 1fr" gap={2}>
            <InfoRow 
              label="Bedrooms" 
              value={formData.beds}
              icon={LuBedDouble}
            />
            <InfoRow 
              label="Bathrooms" 
              value={formData.baths}
              icon={LuBath}
            />
            <InfoRow 
              label="Property Type" 
              value={formData.propertyType}
              badgeColor="blue"
            />
            <InfoRow 
              label="Lease Term" 
              value={formData.leaseTermMonths ? `${formData.leaseTermMonths} months` : "N/A"}
            />
          </Grid>
        </Box>

        {/* Additional Features */}
        {(formData.nearTransit?.type || formData.appliances?.length || formData.internet?.name) && (
          <Box 
            p={4} 
            borderWidth="1px" 
            borderRadius="xl"
            borderColor="border"
          >
            <Heading size="sm" mb={4} color="fg">
              Additional Features
            </Heading>
            <Stack gap={2}>
              {formData.nearTransit?.type && (
                <InfoRow 
                  label="Near Transit" 
                  value={`${formData.nearTransit.type} (${formData.nearTransit.distance}m)`}
                />
              )}
              {formData.appliances && formData.appliances.length > 0 && (
                <Flex justify="space-between" align="start" py={2}>
                  <HStack gap={2} color="fg.muted">
                    <Icon as={LuWarehouse} boxSize={4} />
                    <Text fontSize="sm">Appliances</Text>
                  </HStack>
                  <Flex gap={1} flexWrap="wrap" justify="flex-end" maxW="60%">
                    {formData.appliances.map((app, i) => (
                      <Badge key={i} variant="subtle" colorPalette="gray" fontSize="xs">
                        {app}
                      </Badge>
                    ))}
                  </Flex>
                </Flex>
              )}
              {formData.internet?.name && (
                <InfoRow 
                  label="Internet" 
                  value={`${formData.internet.name} (${formData.internet.speed})`}
                  icon={LuWifi}
                />
              )}
            </Stack>
          </Box>
        )}

        {/* Location */}
        <Box 
          p={4} 
          borderWidth="1px" 
          borderRadius="xl"
          borderColor="border"
        >
          <Heading size="sm" mb={4} color="fg">
            <HStack gap={2}>
              <Icon as={LuMapPin} boxSize={4} color="red.500" />
              Location
            </HStack>
          </Heading>
          <Stack gap={2}>
            <InfoRow 
              label="Coordinates" 
              value={
                <Text fontSize="xs" color="fg.muted">
                  {formData.location.coordinates.length === 2 
                    ? `${formData.location.coordinates[0].toFixed(6)}, ${formData.location.coordinates[1].toFixed(6)}`
                    : 'Not set'
                  }
                </Text>
              } 
            />
            <Flex justify="space-between" align="start" py={2}>
              <HStack gap={2} color="fg.muted">
                <Icon as={LuMapPin} boxSize={4} />
                <Text fontSize="sm">Address</Text>
              </HStack>
              <Text fontSize="sm" textAlign="right" maxW="60%" color="fg.muted">
                {address || 'Loading address...'}
              </Text>
            </Flex>
          </Stack>
        </Box>

        {/* Images */}
        <Box 
          p={4} 
          borderWidth="1px" 
          borderRadius="xl"
          borderColor="border"
        >
          <Heading size="sm" mb={4} color="fg">
            Property Images
          </Heading>
          {formData.images && formData.images.length > 0 && (
            <Box mb={3}>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                New Images ({formData.images.length})
              </Text>
              {renderImagePreview(formData.images || [])}
            </Box>
          )}
          {formData.existingImages && formData.existingImages.length > 0 && (
            <Box>
              <Separator my={2} />
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                Existing Images ({formData.existingImages.length})
              </Text>
              {renderImagePreview(formData.existingImages)}
            </Box>
          )}
          {(!formData.images || formData.images.length === 0) && (!formData.existingImages || formData.existingImages.length === 0) && (
            <Flex 
              direction="column" 
              align="center" 
              justify="center" 
              py={8}
              color="fg.muted"
            >
              <Icon as={LuCircle} boxSize={8} mb={2} opacity={0.3} />
              <Text fontSize="sm">No images uploaded</Text>
            </Flex>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
