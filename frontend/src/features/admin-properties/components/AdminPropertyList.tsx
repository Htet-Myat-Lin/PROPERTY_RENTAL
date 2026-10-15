import {
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Icon,
  Image,
  Input,
  Menu,
  Portal,
  Spinner,
  Stack,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { LuFilter, LuSearch, LuStar, LuChrome, LuX } from "react-icons/lu";
import { useGetAdminProperties } from "../hooks/useGetAdminProperties";
import {
  PROPERTY_STATUS_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  type IAdminProperty,
} from "../types";
import { Pagination } from "@/features/property/components/property-listing/Pagination";
import { getApiErrorMessage } from "@/utils/api-error";
import { formatCurrency } from "@/utils/format-currency";
import { formateDate } from "@/utils/format-date";

const PAGE_LIMIT = 10;

const STATUS_BADGE: Record<string, string> = {
  AVAILABLE: "green",
  RENTED: "blue",
  RESERVED: "orange",
};

const columnHeaderProps = {
  fontWeight: "semibold",
  fontSize: "xs",
  textTransform: "uppercase",
  letterSpacing: "wider",
  color: "fg.muted",
} as const;

const propertyImageUrl = (image: string) =>
  `${import.meta.env.VITE_FILE_URL}/property-images/${image}`;

const profileImageUrl = (picture: string) =>
  `${import.meta.env.VITE_FILE_URL}/profile-images/${picture}`;

export function AdminPropertyList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const statusValue = searchParams.get("status") ?? "";
  const typeValue = searchParams.get("propertyType") ?? "";
  const searchParam = searchParams.get("q") ?? "";

  const [searchInput, setSearchInput] = useState(searchParam);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // setSearchParams is recreated on every URL change, so keying a debounce
  // effect off it would re-run after each pagination click and reset the page
  // back to 1. Debounce from the input handler instead; `value` is the full
  // input text captured when typing goes idle.
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setSearchParams((prev) => {
        if (value) prev.set("q", value);
        else prev.delete("q");
        prev.set("page", "1");
        return prev;
      });
    }, 400);
  };

  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  useEffect(
    () => () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    },
    [],
  );

  const updateParams = (key: string, value: string) => {
    setSearchParams((prev) => {
      if (value) prev.set(key, value);
      else prev.delete(key);
      if (key !== "page") prev.set("page", "1");
      return prev;
    });
  };

  const hasFilters = Boolean(searchParam || statusValue || typeValue);

  const { data, isPending, isError, error } = useGetAdminProperties({
    page,
    limit: PAGE_LIMIT,
    search: searchParam || undefined,
    status: statusValue || undefined,
    propertyType: typeValue || undefined,
  });

  const properties = data?.properties ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalCount = data?.totalCount ?? 0;

  return (
    <Stack gap="6">
      <Flex alignItems={{ base: "start", md: "center" }} justify="space-between" gap="4" wrap="wrap">
        <Box>
          <HStack gap={2} mb={1}>
            <Icon as={LuChrome} boxSize={6} color="blue.500" />
            <Text fontSize="xl" fontWeight="bold" color="fg">
              Properties
            </Text>
          </HStack>
          <Text fontSize="sm" color="fg.muted">
            Every listing on the platform, with its landlord and activity.
          </Text>
        </Box>
        {totalCount > 0 && (
          <Badge colorPalette="gray" variant="subtle" borderRadius="full" px={3} py={1}>
            {totalCount} listing{totalCount === 1 ? "" : "s"}
          </Badge>
        )}
      </Flex>

      {/* ─── Filters ─── */}
      <Box bg="bg.panel" borderRadius="xl" border="1px solid" borderColor="border.muted" p={4}>
        <Flex direction={{ base: "column", md: "row" }} gap={3} align={{ base: "stretch", md: "center" }} justify="space-between">
          <HStack wrap="wrap" gap="2" flex={1}>
            <Box position="relative" flex={{ base: "1", md: "0 0 280px" }}>
              <Icon as={LuSearch} pos="absolute" left="3" top="50%" transform="translateY(-50%)" color="fg.muted" boxSize={4} pointerEvents="none" />
              <Input
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by title, address, or landlord"
                borderRadius="lg"
                ps="10"
                size="sm"
              />
            </Box>

            <Menu.Root>
              <Menu.Trigger asChild>
                <Button variant="outline" size="sm" borderRadius="lg" gap={2}>
                  <Icon as={LuFilter} boxSize={4} />
                  {PROPERTY_STATUS_OPTIONS.find((option) => option.value === statusValue)?.label ?? "Status"}
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content minW="10rem" bg="bg.panel" borderRadius="lg">
                    <Menu.RadioItemGroup value={statusValue} onValueChange={(e) => updateParams("status", e.value)}>
                      {PROPERTY_STATUS_OPTIONS.map((option) => (
                        <Menu.RadioItem key={option.label} value={option.value}>
                          {option.label}
                          <Menu.ItemIndicator />
                        </Menu.RadioItem>
                      ))}
                    </Menu.RadioItemGroup>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>

            <Menu.Root>
              <Menu.Trigger asChild>
                <Button variant="outline" size="sm" borderRadius="lg" gap={2}>
                  <Icon as={LuFilter} boxSize={4} />
                  {PROPERTY_TYPE_OPTIONS.find((option) => option.value === typeValue)?.label ?? "Type"}
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content minW="10rem" bg="bg.panel" borderRadius="lg">
                    <Menu.RadioItemGroup value={typeValue} onValueChange={(e) => updateParams("propertyType", e.value)}>
                      {PROPERTY_TYPE_OPTIONS.map((option) => (
                        <Menu.RadioItem key={option.label} value={option.value}>
                          {option.label}
                          <Menu.ItemIndicator />
                        </Menu.RadioItem>
                      ))}
                    </Menu.RadioItemGroup>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>

            {hasFilters && (
              <Button variant="ghost" size="sm" borderRadius="lg" color="fg.muted" onClick={() => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current); setSearchInput(""); setSearchParams({ page: "1" }); }} gap={1}>
                <Icon as={LuX} boxSize={4} />
                Clear
              </Button>
            )}
          </HStack>
        </Flex>
      </Box>

      {/* ─── Content ─── */}
      {isPending ? (
        <Center minH="40vh">
          <VStack gap={4}>
            <Spinner color="blue.500" size="xl" borderWidth="3px" />
            <Text color="fg.muted" fontSize="sm">
              Loading properties...
            </Text>
          </VStack>
        </Center>
      ) : isError ? (
        <Center minH="30vh" borderWidth="1px" borderColor="border.muted" borderRadius="xl" p={8}>
          <Text color="red.500" fontSize="sm" textAlign="center">
            {getApiErrorMessage(error, "Could not load properties")}
          </Text>
        </Center>
      ) : properties.length === 0 ? (
        <Center minH="30vh" borderWidth="2px" borderStyle="dashed" borderColor="border.muted" borderRadius="xl" p={8}>
          <VStack gap={1}>
            <Text fontWeight="semibold" color="fg">
              No properties found
            </Text>
            <Text color="fg.muted" fontSize="sm" textAlign="center">
              {hasFilters ? "Try adjusting your search or filters" : "No listings have been created yet"}
            </Text>
          </VStack>
        </Center>
      ) : (
        <Box bg="bg.panel" borderRadius="xl" border="1px solid" borderColor="border.muted" overflow="hidden">
          <Box overflowX="auto">
            <Table.Root size="sm" variant="outline" showColumnBorder>
              <Table.Header>
                <Table.Row bg="bg.subtle" _dark={{ bg: "whiteAlpha.50" }}>
                  <Table.ColumnHeader {...columnHeaderProps}>Property</Table.ColumnHeader>
                  <Table.ColumnHeader {...columnHeaderProps}>Landlord</Table.ColumnHeader>
                  <Table.ColumnHeader {...columnHeaderProps}>Type</Table.ColumnHeader>
                  <Table.ColumnHeader {...columnHeaderProps}>Rent</Table.ColumnHeader>
                  <Table.ColumnHeader {...columnHeaderProps}>Beds / Baths</Table.ColumnHeader>
                  <Table.ColumnHeader {...columnHeaderProps}>Rating</Table.ColumnHeader>
                  <Table.ColumnHeader {...columnHeaderProps}>Requests</Table.ColumnHeader>
                  <Table.ColumnHeader {...columnHeaderProps}>Status</Table.ColumnHeader>
                  <Table.ColumnHeader {...columnHeaderProps}>Listed</Table.ColumnHeader>
                  <Table.ColumnHeader {...columnHeaderProps} textAlign="center">
                    View
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {properties.map((property: IAdminProperty) => (
                  <Table.Row key={property.id} transition="background 0.15s" _hover={{ bg: "bg.subtle", _dark: { bg: "whiteAlpha.50" } }}>
                    <Table.Cell>
                      <HStack gap={3} minW={0}>
                        <Box boxSize="10" rounded="lg" overflow="hidden" borderWidth="1px" borderColor="border.muted" flexShrink={0}>
                          {property.images[0] ? (
                            <Image src={propertyImageUrl(property.images[0])} alt={property.title} boxSize="10" objectFit="cover" />
                          ) : (
                            <Center boxSize="10" bg="bg.subtle">
                              <Icon as={LuChrome} color="fg.muted" boxSize={4} />
                            </Center>
                          )}
                        </Box>
                        <Box minW={0}>
                          <Text fontWeight="medium" fontSize="sm" lineClamp={1}>
                            {property.title}
                          </Text>
                          <Text fontSize="xs" color="fg.muted" lineClamp={1} maxW="240px">
                            {property.locationAddress ?? "—"}
                          </Text>
                        </Box>
                      </HStack>
                    </Table.Cell>
                    <Table.Cell>
                      <HStack gap={2}>
                        <Avatar.Root size="xs">
                          {property.landlord.profilePicture && <Avatar.Image src={profileImageUrl(property.landlord.profilePicture)} />}
                          <Avatar.Fallback name={property.landlord.username} />
                        </Avatar.Root>
                        <Box minW={0}>
                          <Text fontWeight="medium" fontSize="sm" lineClamp={1}>
                            {property.landlord.username}
                          </Text>
                          <Text fontSize="xs" color="fg.muted" lineClamp={1} maxW="200px">
                            {property.landlord.email}
                          </Text>
                        </Box>
                      </HStack>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge variant="subtle" colorPalette="gray" borderRadius="full" size="sm">
                        {property.propertyType}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Text fontSize="sm" fontVariantNumeric="tabular-nums">
                        {formatCurrency(property.baseRentPrice)}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text fontSize="sm">
                        {property.beds ?? "—"} / {property.baths ?? "—"}
                        {property.area != null && (
                          <Text as="span" color="fg.muted" fontSize="xs"> · {property.area} sqft</Text>
                        )}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <HStack gap={1}>
                        {property.rating != null ? (
                          <>
                            <Icon as={LuStar} color="yellow.500" boxSize={3} />
                            <Text fontSize="sm" fontVariantNumeric="tabular-nums">
                              {property.rating.toFixed(1)}
                            </Text>
                            <Text as="span" color="fg.muted" fontSize="xs">
                              ({property.reviewCount})
                            </Text>
                          </>
                        ) : (
                          <Text fontSize="sm" color="fg.muted">
                            —
                          </Text>
                        )}
                      </HStack>
                    </Table.Cell>
                    <Table.Cell>
                      <Text fontSize="sm" fontVariantNumeric="tabular-nums">
                        {property.openRequests.toLocaleString()}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge variant="subtle" colorPalette={STATUS_BADGE[property.status] ?? "gray"} borderRadius="full" size="sm" px={3}>
                        {property.status}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Text fontSize="sm" color="fg.muted">
                        {formateDate(property.createdAt)}
                      </Text>
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <Button asChild variant="ghost" size="xs" color="blue.500" borderRadius="md" _hover={{ bg: "blue.50", _dark: { bg: "blue.950" } }}>
                        <Link to={`/properties/${property.id}`}>View</Link>
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        </Box>
      )}

      {totalPages > 1 && (
        <Box borderWidth="1px" borderColor="border.muted" borderRadius="xl">
          <Pagination page={page} totalPages={totalPages} onPageChange={(p) => updateParams("page", String(p))} />
        </Box>
      )}
    </Stack>
  );
}