import {
  Box,
  Flex,
  Input,
  Stack,
  Text,
  Button,
  Group,
  InputGroup,
  Menu,
  Portal,
  Badge,
  IconButton,
  HStack,
  SimpleGrid,
  Drawer,
} from "@chakra-ui/react";
import {
  LuSearch,
  LuList,
  LuLayoutGrid,
  LuX,
  LuSlidersHorizontal,
} from "react-icons/lu";
import { HiSortAscending } from "react-icons/hi";
import { useSearchParams } from "react-router";
import { useMemo, useState } from "react";
import { useGetAllProperties } from "../hooks/useGetAllProperties";
import { FilterPanel } from "./property-listing/FilterPanel";
import { PropertyCardSkeleton } from "./property-listing/PropertyCardSkeleton";
import { PropertyCardGrid } from "./property-listing/PropertyCardGrid";
import { PropertyRowList } from "./property-listing/PropertyRowList";
import { Pagination } from "./property-listing/Pagination";
import { useHandleWishlist } from "../hooks/useHandleWishlist";

const SORT_OPTIONS = [
  { label: "Newest", value: "desc" },
  { label: "Oldest", value: "asc" },
  { label: "Price: High to Low", value: "priceDesc" },
  { label: "Price: Low to High", value: "priceAsc" },
  { label: "Best Rated", value: "rating" },
];

export type Filter = {
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

export interface Property {
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

export interface FilterPanelProps {
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

export type PropertyType = "APARTMENT" | "HOUSE" | "CONDO" | "VILLA";
export type Status = "AVAILABLE" | "RENTED" | "MAINTENANCE";

export function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState<"list" | "card">(localStorage.getItem("view") as "list" | "card" || "list");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleView = () => {
    setView(view === "list" ? "card" : "list");
    localStorage.setItem("view", view === "list" ? "card" : "list");
  }

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
    const filterObj: Filter = { page, limit: 9 };
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
  }, [ page, sortValue, searchTerm, priceRange, bedroomsParam, bathroomsParam, leaseTermMonthsParam, propertyTypesParam ]);

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

  const { isInWishlist, toggleSave } = useHandleWishlist();

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
                onClick={toggleView}
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
                onClick={toggleView}
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
          {/* ── Desktop Filter Sidebar ── */}
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
                  <PropertyCardGrid key={p.id} property={p} isInWishlist={isInWishlist} toggleSave={toggleSave} />
                ))}
              </SimpleGrid>
            ) : (
              <Stack gap="3">
                {properties.map((p) => (
                  <PropertyRowList key={p.id} property={p} isInWishlist={isInWishlist} toggleSave={toggleSave} />
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