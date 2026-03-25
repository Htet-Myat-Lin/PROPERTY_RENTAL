import {
  Flex,
  Box,
  Image,
  Badge,
  VStack,
  Text,
  HStack,
  IconButton,
  Button,
} from "@chakra-ui/react";
import {
  LuBath,
  LuBed,
  LuCalendar,
  LuCar,
  LuHeart,
  LuMapPin,
  LuPawPrint,
  LuSquare,
  LuWifi,
} from "react-icons/lu";
import { Link } from "react-router";
import { StarRating } from "./StarRating";
import type { Property, Status } from "../Listings";

const STATUS_COLOR: Record<Status, string> = {
  AVAILABLE: "green",
  RENTED: "red",
  MAINTENANCE: "orange",
};

const STATUS_LABEL: Record<Status, string> = {
  AVAILABLE: "Available",
  RENTED: "Rented",
  MAINTENANCE: "Maintenance",
};

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
};

export function PropertyRowList({
  property,
  isInWishlist,
  toggleSave,
}: {
  property: Property;
  isInWishlist: (propertyId: string) => boolean;
  toggleSave: (propertyId: string) => void;
}) {
  return (
    <Flex
      borderWidth="1px"
      borderRadius="2xl"
      overflow="hidden"
      bg="bg.panel"
      transition="all 0.2s ease"
      _hover={{ shadow: "md", borderColor: "blue.300" }}
      align="stretch"
      minH="36"
    >
      {/* Image */}
      <Box
        position="relative"
        minW={{ base: "28", sm: "48" }}
        w={{ base: "28", sm: "48" }}
        h="44"
        flexShrink={0}
        bg="bg.muted"
        overflow="hidden"
      >
        {property.images?.[0] ? (
          <Image
            src={`${import.meta.env.VITE_FILE_URL}/property-images/${property.images[0]}`}
            alt={property.title}
            w="full"
            h="full"
            objectFit="cover"
            transition="transform 0.3s"
            _hover={{ transform: "scale(1.04)" }}
          />
        ) : (
          <Flex h="full" align="center" justify="center">
            <LuSquare size={28} color="var(--chakra-colors-fg-subtle)" />
          </Flex>
        )}
        <Badge
          position="absolute"
          top="3"
          left="3"
          colorPalette={STATUS_COLOR[property.status]}
          size="sm"
          borderRadius="full"
          fontWeight="semibold"
        >
          {STATUS_LABEL[property.status]}
        </Badge>
      </Box>

      {/* Content */}
      <Flex
        flex="1"
        p={{ base: "3", sm: "4" }}
        justify="space-between"
        align="stretch"
        gap={{ base: "2", sm: "4" }}
        minW="0"
      >
        <VStack align="flex-start" gap="1.5" flex="1" minW="0">
          <Flex align="center" gap="2" w="full">
            <Text
              fontWeight="semibold"
              fontSize={{ base: "sm", sm: "md" }}
              lineClamp={1}
              flex="1"
            >
              {property.title}
            </Text>
            <StarRating rating={property.rating} />
          </Flex>

          {property.locationAddress && (
            <HStack gap="1" color="fg.muted">
              <LuMapPin size={11} />
              <Text fontSize="xs" lineClamp={1}>
                {property.locationAddress}
              </Text>
            </HStack>
          )}

          <Text
            fontSize="xs"
            color="fg.muted"
            lineClamp={1}
            mt="0.5"
            display={{ base: "none", sm: "block" }}
          >
            {truncateText(property.description, 60)}
          </Text>

          <HStack gap="3" color="fg.muted" mt="1" wrap="wrap">
            {property.beds != null && (
              <HStack gap="1">
                <LuBed size={12} />
                <Text fontSize="xs">{property.beds} Beds</Text>
              </HStack>
            )}
            {property.baths != null && (
              <HStack gap="1">
                <LuBath size={12} />
                <Text fontSize="xs">{property.baths} Baths</Text>
              </HStack>
            )}
            {property.area != null && (
              <HStack gap="1" display={{ base: "none", sm: "flex" }}>
                <LuSquare size={12} />
                <Text fontSize="xs">{property.area.toLocaleString()} sqft</Text>
              </HStack>
            )}
            {property.leaseTermMonths && (
              <HStack gap="1" display={{ base: "none", md: "flex" }}>
                <LuCalendar size={12} />
                <Text fontSize="xs">
                  {property.leaseTermMonths} month lease
                </Text>
              </HStack>
            )}
          </HStack>

          <HStack
            gap="1.5"
            mt="auto"
            wrap="wrap"
            display={{ base: "none", sm: "flex" }}
          >
            {property.petAllowed && (
              <Badge
                variant="subtle"
                colorPalette="green"
                size="sm"
                borderRadius="full"
              >
                <LuPawPrint size={9} /> Pets OK
              </Badge>
            )}
            {property.parkingSpaces > 0 && (
              <Badge
                variant="subtle"
                colorPalette="blue"
                size="sm"
                borderRadius="full"
              >
                <LuCar size={9} /> {property.parkingSpaces} Parking
              </Badge>
            )}
            {property.internetSpeed && (
              <Badge
                variant="subtle"
                colorPalette="purple"
                size="sm"
                borderRadius="full"
              >
                <LuWifi size={9} /> {property.internetSpeed}
              </Badge>
            )}
            {property.yearBuilt && (
              <Badge
                variant="subtle"
                colorPalette="gray"
                size="sm"
                borderRadius="full"
              >
                Built {property.yearBuilt}
              </Badge>
            )}
          </HStack>
        </VStack>

        {/* Right: Price + Actions */}
        <VStack
          align="flex-end"
          justify="space-between"
          flexShrink={0}
          minW={{ base: "20", sm: "28" }}
        >
          <VStack align="flex-end" gap="0">
            <Text
              fontWeight="bold"
              fontSize={{ base: "md", sm: "xl" }}
              color="blue.500"
              lineHeight="1.2"
            >
              {property.baseRentPrice.toLocaleString()} mmk
            </Text>
            <Text fontSize="xs" color="fg.muted">
              /month
            </Text>
          </VStack>

          {property.availableDate && (
            <Text
              fontSize="xs"
              color="fg.muted"
              textAlign="right"
              display={{ base: "none", sm: "block" }}
            >
              From{" "}
              {new Date(property.availableDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </Text>
          )}

          <HStack gap="1.5">
            <IconButton
              aria-label="Save"
              variant="ghost"
              size="sm"
              borderRadius="full"
              color={isInWishlist(property.id) ? "red.400" : "fg.muted"}
              onClick={() => toggleSave(property.id)}
            >
              <LuHeart
                size={14}
                fill={isInWishlist(property.id) ? "currentColor" : "none"}
              />
            </IconButton>
            <Link to={`/properties/${property.id}`}>
              <Button
                size="sm"
                colorPalette="blue"
                borderRadius="lg"
                display={{ base: "none", sm: "flex" }}
              >
                View
              </Button>
            </Link>
          </HStack>
        </VStack>
      </Flex>
    </Flex>
  );
}
