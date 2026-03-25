import {
  Box,
  Image,
  Flex,
  Text,
  Badge,
  IconButton,
  HStack,
  Separator
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
import { StarRating } from "./StarRating";
import type { Property, Status } from "../Listings";
import { Link } from "react-router";

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

export function PropertyCardGrid({
  property,
  isInWishlist,
  toggleSave,
}: {
  property: Property;
  isInWishlist: (propertyId: string) => boolean;
  toggleSave: (propertyId: string) => void;
}) {
  return (
    <Box
      borderWidth="1px"
      borderRadius="2xl"
      overflow="hidden"
      bg="bg.panel"
      transition="all 0.22s ease"
      _hover={{ shadow: "xl", transform: "translateY(-3px)" }}
    >
      {/* Image */}
      <Box position="relative" h="52" overflow="hidden" bg="bg.subtle">
        {property.images.length > 0 ? (
          <Image
            src={`${import.meta.env.VITE_FILE_URL}/property-images/${property.images[0]}`}
            alt={property.title}
            w="full"
            h="full"
            objectFit="cover"
            transition="transform 0.35s ease"
            _hover={{ transform: "scale(1.05)" }}
          />
        ) : (
          <Flex h="full" align="center" justify="center" bg="bg.muted">
            <LuSquare size={36} color="var(--chakra-colors-fg-subtle)" />
          </Flex>
        )}

        {/* Gradient overlay */}
        <Box
          position="absolute"
          inset="0"
          bgGradient="to-t"
          gradientFrom="blackAlpha.600"
          gradientTo="transparent"
          pointerEvents="none"
        />

        {/* Top badges */}
        <Flex
          position="absolute"
          top="3"
          left="3"
          right="3"
          justify="space-between"
          align="flex-start"
        >
          <Badge
            colorPalette={STATUS_COLOR[property.status]}
            size="sm"
            borderRadius="full"
            px="2.5"
            fontWeight="semibold"
          >
            {STATUS_LABEL[property.status]}
          </Badge>
          <IconButton
            aria-label="Save"
            variant="solid"
            size="xs"
            borderRadius="full"
            bg={isInWishlist(property.id) ? "red.500" : "whiteAlpha.800"}
            color={isInWishlist(property.id) ? "white" : "gray.700"}
            backdropFilter="blur(6px)"
            _hover={{
              bg: isInWishlist(property.id) ? "red.600" : "whiteAlpha.950",
            }}
            onClick={() => toggleSave(property.id)}
          >
            <LuHeart
              size={12}
              fill={isInWishlist(property.id) ? "currentColor" : "none"}
            />
          </IconButton>
        </Flex>

        {/* Bottom price */}
        <Box position="absolute" bottom="3" left="3">
          <Text
            color="white"
            fontWeight="bold"
            fontSize="lg"
            lineHeight="1.2"
            textShadow="0 1px 4px rgba(0,0,0,0.5)"
          >
            ${property.baseRentPrice.toLocaleString()}
            <Text as="span" fontSize="xs" fontWeight="normal" opacity={0.85}>
              {" "}
              /mo
            </Text>
          </Text>
        </Box>
      </Box>

      {/* Body */}
      <Box p="4" pb="3">
        <Flex justify="space-between" align="flex-start" mb="1">
          <Link to={`/properties/${property.id}`}>
            <Text
              fontWeight="semibold"
              lineClamp={1}
              flex="1"
              mr="2"
              _hover={{ textDecoration: "underline" }}
            >
              {property.title}
            </Text>
          </Link>

          <StarRating rating={property.rating} />
        </Flex>

        {property.locationAddress && (
          <HStack gap="1" mb="2" color="fg.muted">
            <LuMapPin size={11} />
            <Text fontSize="xs" lineClamp={1}>
              {property.locationAddress}
            </Text>
          </HStack>
        )}

        {property.description && (
          <Text fontSize="xs" color="fg.muted" lineClamp={1} mb="3">
            {truncateText(property.description, 50)}
          </Text>
        )}

        <Separator mb="3" />

        <HStack gap="3" color="fg.muted" wrap="wrap">
          {property.beds != null && (
            <HStack gap="1">
              <LuBed size={13} />
              <Text fontSize="xs">{property.beds} beds</Text>
            </HStack>
          )}
          {property.baths != null && (
            <HStack gap="1">
              <LuBath size={13} />
              <Text fontSize="xs">{property.baths} baths</Text>
            </HStack>
          )}
          {property.area != null && (
            <HStack gap="1">
              <LuSquare size={13} />
              <Text fontSize="xs">{property.area.toLocaleString()} sqft</Text>
            </HStack>
          )}
        </HStack>

        <HStack gap="1.5" mt="3" wrap="wrap">
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
              <LuCar size={9} /> Parking
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
        </HStack>
      </Box>

      {property.availableDate && (
        <Box px="4" pb="3">
          <HStack gap="1" color="fg.muted">
            <LuCalendar size={11} />
            <Text fontSize="xs">
              Available from{" "}
              {new Date(property.availableDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
          </HStack>
        </Box>
      )}
    </Box>
  );
}
