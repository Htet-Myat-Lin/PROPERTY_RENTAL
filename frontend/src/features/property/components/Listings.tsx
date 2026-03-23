import {
  Box,
  Flex,
  Input,
  Stack,
  Text,
  Button,
  Group,
  Checkbox,
  For,
  NativeSelect,
  NumberInput,
  InputGroup,
  Menu,
  Portal,
  Badge,
  Image,
  Skeleton,
  SkeletonText,
  Separator,
  IconButton,
  HStack,
  VStack,
  SimpleGrid,
  Drawer,
} from "@chakra-ui/react";
import {
  LuSearch,
  LuBed,
  LuBath,
  LuSquare,
  LuMapPin,
  LuStar,
  LuHeart,
  LuWifi,
  LuCar,
  LuPawPrint,
  LuCalendar,
  LuList,
  LuLayoutGrid,
  LuChevronLeft,
  LuChevronRight,
  LuX,
  LuSlidersHorizontal,
} from "react-icons/lu";
import { HiSortAscending } from "react-icons/hi";
import { Link, useSearchParams } from "react-router";
import { useMemo, useState } from "react";
import { useGetAllProperties } from "../hooks/useGetAllProperties";

// ─── Types ────────────────────────────────────────────────────────────────────

type PropertyType = "APARTMENT" | "HOUSE" | "CONDO" | "VILLA";
type Status = "AVAILABLE" | "RENTED" | "MAINTENANCE";

interface Property {
  id: string;
  landlordId: string;
  title: string;
  description: string;
  baseRentPrice: number;
  beds?: number;
  baths?: number;
  area?: number;
  propertyType: PropertyType;
  status: Status;
  locationAddress?: string;
  coordinates?: number[];
  images: string[];
  nearTransitType?: string;
  nearTransitDist?: number;
  parkingSpaces: number;
  rating: number;
  yearBuilt?: number;
  petAllowed: boolean;
  appliances: string[];
  availableDate?: string;
  internetName?: string;
  internetSpeed?: string;
  leaseTermMonths?: number;
  createdAt: string;
  updatedAt: string;
}

type Filter = {
  page?: number;
  limit?: number;
  sortBy?: string;
  search?: string;
  priceRange?: { min: number; max: number };
  bedrooms?: number;
  bathrooms?: number;
  leaseTermMonths?: number;
  propertyTypes?: string[];
};

// ─── Constants ────────────────────────────────────────────────────────────────

const PROPERTY_TYPES = ["Apartment", "House", "Condo", "Villa"];
const SORT_OPTIONS = [
  { label: "Newest", value: "desc" },
  { label: "Oldest", value: "asc" },
  { label: "Price: High to Low", value: "priceDesc" },
  { label: "Price: Low to High", value: "priceAsc" },
  { label: "Best Rated", value: "rating" },
];

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

// ─── Filter Panel (shared between sidebar + drawer) ───────────────────────────

interface FilterPanelProps {
  propertyTypesParam: string[];
  bedroomsParam: string;
  bathroomsParam: string;
  leaseTermMonthsParam: string;
  priceRange: { min: number; max: number };
  activeFilterCount: number;
  onPropertyTypeChange: (v: string) => void;
  onBedroomsChange: (v: string) => void;
  onBathroomsChange: (v: string) => void;
  onLeaseTermChange: (v: string) => void;
  onPriceRangeChange: (r: { min: number; max: number }) => void;
  onClearFilters: () => void;
}

function FilterPanel({
  propertyTypesParam,
  bedroomsParam,
  bathroomsParam,
  leaseTermMonthsParam,
  priceRange,
  activeFilterCount,
  onPropertyTypeChange,
  onBedroomsChange,
  onBathroomsChange,
  onLeaseTermChange,
  onPriceRangeChange,
  onClearFilters,
}: FilterPanelProps) {
  return (
    <Stack gap="5" h="full">
      {/* Header */}
      <Flex justify="space-between" align="center">
        <HStack gap="2">
          <Text fontWeight="bold" fontSize="sm" letterSpacing="tight">
            Filters
          </Text>
          {activeFilterCount > 0 && (
            <Badge
              colorPalette="blue"
              size="sm"
              borderRadius="full"
              px="1.5"
            >
              {activeFilterCount}
            </Badge>
          )}
        </HStack>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="xs"
            colorPalette="red"
            onClick={onClearFilters}
          >
            Clear all
          </Button>
        )}
      </Flex>

      <Separator />

      {/* Property Type */}
      <Stack gap="3">
        <Text
          fontSize="xs"
          fontWeight="bold"
          textTransform="uppercase"
          letterSpacing="widest"
          color="fg.muted"
        >
          Property Type
        </Text>
        <Stack gap="2">
          <For each={PROPERTY_TYPES}>
            {(type) => (
              <Checkbox.Root
                key={type}
                variant="solid"
                colorPalette="blue"
                size="sm"
                checked={propertyTypesParam.includes(type)}
                onCheckedChange={() => onPropertyTypeChange(type)}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control borderRadius="md" />
                <Checkbox.Label fontSize="sm">{type}</Checkbox.Label>
              </Checkbox.Root>
            )}
          </For>
        </Stack>
      </Stack>

      <Separator />

      {/* Bedrooms */}
      <Stack gap="2">
        <Text
          fontSize="xs"
          fontWeight="bold"
          textTransform="uppercase"
          letterSpacing="widest"
          color="fg.muted"
        >
          Min Bedrooms
        </Text>
        <NativeSelect.Root size="sm">
          <NativeSelect.Field
            borderRadius="lg"
            value={bedroomsParam}
            onChange={(e) => onBedroomsChange(e.currentTarget.value)}
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Stack>

      {/* Bathrooms */}
      <Stack gap="2">
        <Text
          fontSize="xs"
          fontWeight="bold"
          textTransform="uppercase"
          letterSpacing="widest"
          color="fg.muted"
        >
          Min Bathrooms
        </Text>
        <NativeSelect.Root size="sm">
          <NativeSelect.Field
            borderRadius="lg"
            value={bathroomsParam}
            onChange={(e) => onBathroomsChange(e.currentTarget.value)}
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Stack>

      {/* Lease Term */}
      <Stack gap="2">
        <Text
          fontSize="xs"
          fontWeight="bold"
          textTransform="uppercase"
          letterSpacing="widest"
          color="fg.muted"
        >
          Min Lease Term
        </Text>
        <NativeSelect.Root size="sm">
          <NativeSelect.Field
            borderRadius="lg"
            value={leaseTermMonthsParam}
            onChange={(e) => onLeaseTermChange(e.currentTarget.value)}
          >
            <option value="">Any</option>
            <option value="6">6+ months</option>
            <option value="12">12+ months</option>
            <option value="24">24+ months</option>
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Stack>

      <Separator />

      {/* Price Range */}
      <Stack gap="3">
        <Flex justify="space-between" align="center">
          <Text
            fontSize="xs"
            fontWeight="bold"
            textTransform="uppercase"
            letterSpacing="widest"
            color="fg.muted"
          >
            Price Range
          </Text>
          {(priceRange.min > 0 || priceRange.max < 10000000) && (
            <Text fontSize="xs" color="blue.500" fontWeight="semibold">
              ${priceRange.min.toLocaleString()} –{" "}
              {priceRange.max === 10000000
                ? "∞"
                : "$" + priceRange.max.toLocaleString()}
            </Text>
          )}
        </Flex>

        <Stack gap="2.5">
          <Flex align="center" gap="3">
            <Text
              fontSize="xs"
              color="fg.muted"
              w="8"
              flexShrink={0}
            >
              Min
            </Text>
            <NumberInput.Root
              size="sm"
              value={String(priceRange.min)}
              min={0}
              max={priceRange.max}
              flex="1"
              onValueChange={(e) =>
                onPriceRangeChange({
                  ...priceRange,
                  min: Math.max(0, parseInt(e.value) || 0),
                })
              }
            >
              <NumberInput.Input borderRadius="lg" />
              <NumberInput.Control>
                <NumberInput.IncrementTrigger />
                <NumberInput.DecrementTrigger />
              </NumberInput.Control>
            </NumberInput.Root>
          </Flex>
          <Flex align="center" gap="3">
            <Text
              fontSize="xs"
              color="fg.muted"
              w="8"
              flexShrink={0}
            >
              Max
            </Text>
            <NumberInput.Root
              size="sm"
              value={String(priceRange.max)}
              min={priceRange.min}
              max={10000000}
              flex="1"
              onValueChange={(e) =>
                onPriceRangeChange({
                  ...priceRange,
                  max: Math.min(
                    10000000,
                    parseInt(e.value) || 10000000
                  ),
                })
              }
            >
              <NumberInput.Input borderRadius="lg" />
              <NumberInput.Control>
                <NumberInput.IncrementTrigger />
                <NumberInput.DecrementTrigger />
              </NumberInput.Control>
            </NumberInput.Root>
          </Flex>
        </Stack>
      </Stack>
    </Stack>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <HStack gap="0.5" align="center">
      <LuStar
        size={11}
        fill="var(--chakra-colors-yellow-400)"
        color="var(--chakra-colors-yellow-400)"
      />
      <Text fontSize="xs" fontWeight="semibold" color="fg.muted">
        {rating > 0 ? rating.toFixed(1) : "New"}
      </Text>
    </HStack>
  );
}

function PropertyCardSkeleton({ list = false }: { list?: boolean }) {
  if (list) {
    return (
      <Flex
        borderWidth="1px"
        borderRadius="2xl"
        overflow="hidden"
        h="36"
        bg="bg.panel"
      >
        <Skeleton w="48" flexShrink={0} />
        <Box p="4" flex="1">
          <SkeletonText noOfLines={1} mb="3" />
          <SkeletonText noOfLines={2} mb="3" />
          <SkeletonText noOfLines={1} />
        </Box>
      </Flex>
    );
  }
  return (
    <Box borderWidth="1px" borderRadius="2xl" overflow="hidden" bg="bg.panel">
      <Skeleton h="52" />
      <Box p="4">
        <SkeletonText noOfLines={1} mb="2" />
        <SkeletonText noOfLines={2} mb="3" />
        <SkeletonText noOfLines={1} />
      </Box>
    </Box>
  );
}

function PropertyCardGrid({ property }: { property: Property }) {
  const [saved, setSaved] = useState(false);

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
            bg={saved ? "red.500" : "whiteAlpha.800"}
            color={saved ? "white" : "gray.700"}
            backdropFilter="blur(6px)"
            _hover={{ bg: saved ? "red.600" : "whiteAlpha.950" }}
            onClick={() => setSaved(!saved)}
          >
            <LuHeart size={12} fill={saved ? "currentColor" : "none"} />
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
            <Text
              as="span"
              fontSize="xs"
              fontWeight="normal"
              opacity={0.85}
            >
              {" "}
              /mo
            </Text>
          </Text>
        </Box>
      </Box>

      {/* Body */}
      <Box p="4" pb="3">
        <Flex justify="space-between" align="flex-start" mb="1">
          <Text
            fontWeight="semibold"
            fontSize="sm"
            lineClamp={1}
            flex="1"
            mr="2"
          >
            {property.title}
          </Text>
          <StarRating rating={property.rating} />
        </Flex>

        {property.locationAddress && (
          <HStack gap="1" mb="3" color="fg.muted">
            <LuMapPin size={11} />
            <Text fontSize="xs" lineClamp={1}>
              {property.locationAddress}
            </Text>
          </HStack>
        )}

        <Separator mb="3" />

        <HStack gap="3" color="fg.muted" wrap="wrap">
          {property.beds != null && (
            <HStack gap="1">
              <LuBed size={13} />
              <Text fontSize="xs">{property.beds} bd</Text>
            </HStack>
          )}
          {property.baths != null && (
            <HStack gap="1">
              <LuBath size={13} />
              <Text fontSize="xs">{property.baths} ba</Text>
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

function PropertyRowList({ property }: { property: Property }) {
  const [saved, setSaved] = useState(false);

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
            lineClamp={2}
            mt="0.5"
            display={{ base: "none", sm: "block" }}
          >
            {property.description}
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
                <Text fontSize="xs">{property.leaseTermMonths} month lease</Text>
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
              color={saved ? "red.400" : "fg.muted"}
              onClick={() => setSaved(!saved)}
            >
              <LuHeart size={14} fill={saved ? "currentColor" : "none"} />
            </IconButton>
            <Button
              size="sm"
              colorPalette="blue"
              borderRadius="lg"
              display={{ base: "none", sm: "flex" }}
            >
              <Link to={`/properties/${property.id}`}>View</Link>
            </Button>
          </HStack>
        </VStack>
      </Flex>
    </Flex>
  );
}

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    if (totalPages <= 5) return i + 1;
    if (page <= 3) return i + 1;
    if (page >= totalPages - 2) return totalPages - 4 + i;
    return page - 2 + i;
  });

  return (
    <HStack justify="center" gap="1" mt="2" pb="2">
      <IconButton
        aria-label="Previous"
        variant="ghost"
        size="sm"
        borderRadius="lg"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        <LuChevronLeft />
      </IconButton>
      {pages.map((p) => (
        <Button
          key={p}
          size="sm"
          variant={p === page ? "solid" : "ghost"}
          colorPalette={p === page ? "blue" : "gray"}
          borderRadius="lg"
          minW="8"
          onClick={() => onPageChange(p)}
        >
          {p}
        </Button>
      ))}
      <IconButton
        aria-label="Next"
        variant="ghost"
        size="sm"
        borderRadius="lg"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <LuChevronRight />
      </IconButton>
    </HStack>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState<"list" | "card">("list");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const page = Number(searchParams.get("page")) || 1;
  const sortValue = searchParams.get("sortBy") || "";
  const searchValue = searchParams.get("search") || "";
  const priceRangeParam = searchParams.get("priceRange") || "";
  const bedroomsParam = searchParams.get("bedrooms") || "";
  const bathroomsParam = searchParams.get("bathrooms") || "";
  const leaseTermMonthsParam = searchParams.get("leaseTermMonths") || "";
  const propertyTypesParam = useMemo(
    () => searchParams.getAll("propertyTypes") || [],
    [searchParams]
  );

  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>(
    priceRangeParam
      ? JSON.parse(priceRangeParam)
      : { min: 0, max: 10000000 }
  );
  const [searchTerm, setSearchTerm] = useState(searchValue);

  const filters = useMemo<Filter>(() => {
    const filterObj: Filter = { page, limit: 10 };
    if (searchTerm) filterObj.search = searchTerm;
    if (sortValue) filterObj.sortBy = sortValue;
    if (priceRange.min > 0 || priceRange.max < 10000000)
      filterObj.priceRange = priceRange;
    if (bedroomsParam) filterObj.bedrooms = Number(bedroomsParam);
    if (bathroomsParam) filterObj.bathrooms = Number(bathroomsParam);
    if (leaseTermMonthsParam)
      filterObj.leaseTermMonths = Number(leaseTermMonthsParam);
    if (propertyTypesParam.length > 0)
      filterObj.propertyTypes = propertyTypesParam;
    return filterObj;
  }, [
    page,
    sortValue,
    searchTerm,
    priceRange,
    bedroomsParam,
    bathroomsParam,
    leaseTermMonthsParam,
    propertyTypesParam,
  ]);

  const setParam = (key: string, value: string) =>
    setSearchParams((prev) => {
      prev.set(key, value);
      return prev;
    });

  const handlePageChange = (p: number) => setParam("page", String(p));
  const handleSortChange = (value: string) => setParam("sortBy", value);
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setParam("search", value);
  };
  const handlePriceRangeChange = (newRange: { min: number; max: number }) => {
    setPriceRange(newRange);
    setParam("priceRange", JSON.stringify(newRange));
  };
  const handleBedroomsChange = (value: string) =>
    setParam("bedrooms", value);
  const handleBathroomsChange = (value: string) =>
    setParam("bathrooms", value);
  const handleLeaseTermMonthsChange = (value: string) =>
    setParam("leaseTermMonths", value);

  const handlePropertyTypeChange = (value: string) => {
    setSearchParams((prev) => {
      const types = prev.getAll("propertyTypes");
      if (types.includes(value)) prev.delete("propertyTypes", value);
      else prev.append("propertyTypes", value);
      return prev;
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPriceRange({ min: 0, max: 10000000 });
    setSearchParams({});
  };

  const activeFilterCount = [
    searchTerm,
    priceRange.min > 0 || priceRange.max < 10000000,
    bedroomsParam,
    bathroomsParam,
    leaseTermMonthsParam,
    ...propertyTypesParam,
  ].filter(Boolean).length;

  const { data, isPending } = useGetAllProperties(filters);
  const properties: Property[] = data?.content?.properties || [];
  const totalPages = data?.content?.totalPages || 1;
  const totalCount = data?.content?.totalCount || 0;

  const filterPanelProps: FilterPanelProps = {
    propertyTypesParam,
    bedroomsParam,
    bathroomsParam,
    leaseTermMonthsParam,
    priceRange,
    activeFilterCount,
    onPropertyTypeChange: handlePropertyTypeChange,
    onBedroomsChange: handleBedroomsChange,
    onBathroomsChange: handleBathroomsChange,
    onLeaseTermChange: handleLeaseTermMonthsChange,
    onPriceRangeChange: handlePriceRangeChange,
    onClearFilters: clearFilters,
  };

  return (
    // Subtle warm tinted background
    <Box
      minH="100vh"
      bg={{ base: "gray.50", _dark: "gray.950" }}
      px={{ base: "3", sm: "5", lg: "8" }}
      py={{ base: "4", sm: "6" }}
    >
      <Box maxW="1400px" mx="auto">
        {/* ── Top Bar ── */}
        <Flex align="center" gap="2.5" mb="5" wrap="nowrap">
          {/* Search */}
          <InputGroup
            flex="1"
            maxW={{ base: "full", md: "sm" }}
            startElement={<LuSearch size={14} color="var(--chakra-colors-fg-muted)" />}
          >
            <Input
              placeholder="Search properties…"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              colorPalette="blue"
              borderRadius="xl"
              size="sm"
              bg="white"
              _dark={{ bg: "gray.900" }}
              shadow="sm"
            />
          </InputGroup>

          {searchTerm && (
            <IconButton
              aria-label="Clear search"
              variant="ghost"
              size="sm"
              borderRadius="full"
              flexShrink={0}
              onClick={() => handleSearchChange("")}
            >
              <LuX size={13} />
            </IconButton>
          )}

          {/* Filters button — visible only on small screens */}
          <Button
            display={{ base: "flex", lg: "none" }}
            variant="outline"
            size="sm"
            borderRadius="xl"
            gap="1.5"
            flexShrink={0}
            bg="white"
            _dark={{ bg: "gray.900" }}
            shadow="sm"
            onClick={() => setDrawerOpen(true)}
          >
            <LuSlidersHorizontal size={13} />
            <Text display={{ base: "none", sm: "block" }}>Filters</Text>
            {activeFilterCount > 0 && (
              <Badge
                colorPalette="blue"
                size="sm"
                borderRadius="full"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>

          {/* View toggle — pushed to end */}
          <Box ml="auto" flexShrink={0}>
            <Group attached>
              <IconButton
                aria-label="List view"
                variant={view === "list" ? "solid" : "outline"}
                colorPalette="blue"
                size="sm"
                onClick={() => setView("list")}
                bg={view === "list" ? undefined : "white"}
                _dark={{ bg: view === "list" ? undefined : "gray.900" }}
                shadow="sm"
              >
                <LuList size={14} />
              </IconButton>
              <IconButton
                aria-label="Grid view"
                variant={view === "card" ? "solid" : "outline"}
                colorPalette="blue"
                size="sm"
                onClick={() => setView("card")}
                bg={view === "card" ? undefined : "white"}
                _dark={{ bg: view === "card" ? undefined : "gray.900" }}
                shadow="sm"
              >
                <LuLayoutGrid size={14} />
              </IconButton>
            </Group>
          </Box>
        </Flex>

        {/* ── Main Layout ── */}
        <Flex gap="5" align="flex-start">
          {/* ── Desktop Sidebar ── */}
          <Box
            display={{ base: "none", lg: "block" }}
            w="64"
            minW="64"
            flexShrink={0}
            position="sticky"
            top="4"
          >
            <Box
              borderWidth="1px"
              borderRadius="2xl"
              p="5"
              bg="white"
              _dark={{ bg: "gray.900" }}
              shadow="sm"
            >
              <FilterPanel {...filterPanelProps} />
            </Box>
          </Box>

          {/* ── Mobile Drawer ── */}
          <Drawer.Root
            open={drawerOpen}
            onOpenChange={(e) => setDrawerOpen(e.open)}
            placement="start"
          >
            <Portal>
              <Drawer.Backdrop />
              <Drawer.Positioner>
                <Drawer.Content
                  w="80"
                  maxW="85vw"
                  bg="white"
                  _dark={{ bg: "gray.900" }}
                >
                  <Drawer.Header
                    borderBottomWidth="1px"
                    pb="3"
                    pt="4"
                    px="5"
                  >
                    <Drawer.Title fontSize="sm" fontWeight="bold">
                      Filters
                    </Drawer.Title>
                    <Drawer.CloseTrigger asChild>
                      <IconButton
                        aria-label="Close"
                        variant="ghost"
                        size="sm"
                        borderRadius="full"
                        position="absolute"
                        top="3"
                        right="3"
                      >
                        <LuX size={14} />
                      </IconButton>
                    </Drawer.CloseTrigger>
                  </Drawer.Header>
                  <Drawer.Body px="5" py="4" overflowY="auto">
                    <FilterPanel {...filterPanelProps} />
                  </Drawer.Body>
                  <Drawer.Footer borderTopWidth="1px" px="5" py="4">
                    <Button
                      w="full"
                      colorPalette="blue"
                      borderRadius="xl"
                      size="sm"
                      onClick={() => setDrawerOpen(false)}
                    >
                      Show {totalCount} results
                    </Button>
                  </Drawer.Footer>
                </Drawer.Content>
              </Drawer.Positioner>
            </Portal>
          </Drawer.Root>

          {/* ── Listings column ── */}
          <Stack gap="3.5" flex="1" minW="0">
            {/* Result / sort bar */}
            <Flex
              justify="space-between"
              align="center"
              py="2.5"
              px="4"
              borderWidth="1px"
              borderRadius="xl"
              bg="white"
              _dark={{ bg: "gray.900" }}
              shadow="sm"
            >
              <Text fontSize="sm" color="fg.muted">
                {isPending ? (
                  "Loading…"
                ) : (
                  <>
                    <Text as="span" fontWeight="semibold" color="fg">
                      {totalCount.toLocaleString()}
                    </Text>{" "}
                    propert{totalCount === 1 ? "y" : "ies"} found
                  </>
                )}
              </Text>
              <Menu.Root>
                <Menu.Trigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    borderRadius="lg"
                    gap="1.5"
                    fontSize="xs"
                  >
                    <HiSortAscending size={14} />
                    {SORT_OPTIONS.find((o) => o.value === sortValue)?.label ||
                      "Sort by"}
                  </Button>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content
                      minW="11rem"
                      bg="white"
                      _dark={{ bg: "gray.900" }}
                      borderRadius="xl"
                      shadow="lg"
                    >
                      <Menu.RadioItemGroup
                        value={sortValue}
                        onValueChange={(e) => handleSortChange(e.value)}
                      >
                        {SORT_OPTIONS.map((item) => (
                          <Menu.RadioItem
                            key={item.value}
                            value={item.value}
                            borderRadius="lg"
                            fontSize="sm"
                          >
                            {item.label}
                            <Menu.ItemIndicator />
                          </Menu.RadioItem>
                        ))}
                      </Menu.RadioItemGroup>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            </Flex>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <HStack gap="2" wrap="wrap">
                {propertyTypesParam.map((t) => (
                  <Badge
                    key={t}
                    colorPalette="blue"
                    variant="subtle"
                    borderRadius="full"
                    px="3"
                    py="1"
                    cursor="pointer"
                    fontSize="xs"
                    onClick={() => handlePropertyTypeChange(t)}
                  >
                    {t}
                    <Box as="span" ml="1" opacity={0.7}>
                      ×
                    </Box>
                  </Badge>
                ))}
                {bedroomsParam && (
                  <Badge
                    colorPalette="gray"
                    variant="subtle"
                    borderRadius="full"
                    px="3"
                    py="1"
                    cursor="pointer"
                    fontSize="xs"
                    onClick={() => handleBedroomsChange("")}
                  >
                    {bedroomsParam}+ beds{" "}
                    <Box as="span" ml="1" opacity={0.7}>
                      ×
                    </Box>
                  </Badge>
                )}
                {bathroomsParam && (
                  <Badge
                    colorPalette="gray"
                    variant="subtle"
                    borderRadius="full"
                    px="3"
                    py="1"
                    cursor="pointer"
                    fontSize="xs"
                    onClick={() => handleBathroomsChange("")}
                  >
                    {bathroomsParam}+ baths{" "}
                    <Box as="span" ml="1" opacity={0.7}>
                      ×
                    </Box>
                  </Badge>
                )}
                {leaseTermMonthsParam && (
                  <Badge
                    colorPalette="gray"
                    variant="subtle"
                    borderRadius="full"
                    px="3"
                    py="1"
                    cursor="pointer"
                    fontSize="xs"
                    onClick={() => handleLeaseTermMonthsChange("")}
                  >
                    {leaseTermMonthsParam}+ mo lease{" "}
                    <Box as="span" ml="1" opacity={0.7}>
                      ×
                    </Box>
                  </Badge>
                )}
              </HStack>
            )}

            {/* Cards or Rows */}
            {isPending ? (
              view === "card" ? (
                <SimpleGrid
                  columns={{ base: 1, sm: 2, xl: 3 }}
                  gap="4"
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <PropertyCardSkeleton key={i} />
                  ))}
                </SimpleGrid>
              ) : (
                <Stack gap="3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <PropertyCardSkeleton key={i} list />
                  ))}
                </Stack>
              )
            ) : properties.length === 0 ? (
              <Flex
                direction="column"
                align="center"
                justify="center"
                py="20"
                borderWidth="1px"
                borderRadius="2xl"
                borderStyle="dashed"
                gap="3"
                color="fg.muted"
                bg="white"
                _dark={{ bg: "gray.900" }}
              >
                <LuSearch size={36} />
                <Text fontWeight="semibold">No properties found</Text>
                <Text fontSize="sm">
                  Try adjusting your filters or search term
                </Text>
                <Button
                  size="sm"
                  variant="outline"
                  colorPalette="blue"
                  borderRadius="xl"
                  mt="2"
                  onClick={clearFilters}
                >
                  Clear filters
                </Button>
              </Flex>
            ) : view === "card" ? (
              <SimpleGrid
                columns={{ base: 1, sm: 2, xl: 3 }}
                gap="4"
              >
                {properties.map((p) => (
                  <PropertyCardGrid key={p.id} property={p} />
                ))}
              </SimpleGrid>
            ) : (
              <Stack gap="3">
                {properties.map((p) => (
                  <PropertyRowList key={p.id} property={p} />
                ))}
              </Stack>
            )}

            {/* Pagination */}
            {!isPending && totalPages > 1 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </Stack>
        </Flex>
      </Box>
    </Box>
  );
}