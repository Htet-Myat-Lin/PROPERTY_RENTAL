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
import { useSearchParams } from "react-router";
import { LuBuilding2, LuFilter, LuSearch, LuUsers, LuX } from "react-icons/lu";
import { useGetLandlordTenants } from "../hooks/useGetLandlordTenants";
import { TENANT_STATUS_OPTIONS } from "../types";
import { Pagination } from "@/features/property/components/property-listing/Pagination";
import { getApiErrorMessage } from "@/utils/api-error";
import { formatCurrency } from "@/utils/format-currency";
import { formateDate } from "@/utils/format-date";
import type { ILandlordTenant } from "../types";

const PAGE_LIMIT = 10;

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

export function TenantList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const statusValue = searchParams.get("status") ?? "";
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

  const hasFilters = Boolean(searchParam || statusValue);

  const { data, isPending, isError, error } = useGetLandlordTenants({
    page,
    limit: PAGE_LIMIT,
    search: searchParam || undefined,
    status: statusValue || undefined,
  });

  const tenants = data?.tenants ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalCount = data?.totalCount ?? 0;

  return (
    <Stack gap="6">
      <Flex alignItems={{ base: "start", md: "center" }} justify="space-between" gap="4" wrap="wrap">
        <Box>
          <HStack gap={2} mb={1}>
            <Icon as={LuUsers} boxSize={6} color="blue.500" />
            <Text fontSize="xl" fontWeight="bold" color="fg">
              Tenants
            </Text>
          </HStack>
          <Text fontSize="sm" color="fg.muted">
            Everyone renting one of your properties, current or past.
          </Text>
        </Box>
        {totalCount > 0 && (
          <Badge colorPalette="gray" variant="subtle" borderRadius="full" px={3} py={1}>
            {totalCount} tenant{totalCount === 1 ? "" : "s"}
          </Badge>
        )}
      </Flex>

      {/* ─── Filters ─── */}
      <Box bg="bg.panel" borderRadius="xl" border="1px solid" borderColor="border.muted" p={4}>
        <Flex direction={{ base: "column", md: "row" }} gap={3} align={{ base: "stretch", md: "center" }} justify="space-between">
          <HStack wrap="wrap" gap="2" flex={1}>
            <Box position="relative" flex={{ base: "1", md: "0 0 260px" }}>
              <Icon as={LuSearch} pos="absolute" left="3" top="50%" transform="translateY(-50%)" color="fg.muted" boxSize={4} pointerEvents="none" />
              <Input
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search tenant or property"
                borderRadius="lg"
                ps="10"
                size="sm"
              />
            </Box>

            <Menu.Root>
              <Menu.Trigger asChild>
                <Button variant="outline" size="sm" borderRadius="lg" gap={2}>
                  <Icon as={LuFilter} boxSize={4} />
                  {TENANT_STATUS_OPTIONS.find((option) => option.value === statusValue)?.label ?? "Status"}
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content minW="10rem" bg="bg.panel" borderRadius="lg">
                    <Menu.RadioItemGroup value={statusValue} onValueChange={(e) => updateParams("status", e.value)}>
                      {TENANT_STATUS_OPTIONS.map((option) => (
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
              Loading tenants...
            </Text>
          </VStack>
        </Center>
      ) : isError ? (
        <Center minH="30vh" borderWidth="1px" borderColor="border.muted" borderRadius="xl" p={8}>
          <Text color="red.500" fontSize="sm" textAlign="center">
            {getApiErrorMessage(error, "Could not load tenants")}
          </Text>
        </Center>
      ) : tenants.length === 0 ? (
        <Center minH="30vh" borderWidth="2px" borderStyle="dashed" borderColor="border.muted" borderRadius="xl" p={8}>
          <VStack gap={1}>
            <Text fontWeight="semibold" color="fg">
              No tenants found
            </Text>
            <Text color="fg.muted" fontSize="sm" textAlign="center">
              {hasFilters ? "Try adjusting your search or status filter" : "You don't have any approved rent requests yet"}
            </Text>
          </VStack>
        </Center>
      ) : (
        <Box bg="bg.panel" borderRadius="xl" border="1px solid" borderColor="border.muted" overflow="hidden">
          <Box overflowX="auto">
            <Table.Root size="sm" variant="outline" showColumnBorder>
              <Table.Header>
                <Table.Row bg="bg.subtle" _dark={{ bg: "whiteAlpha.50" }}>
                  <Table.ColumnHeader {...columnHeaderProps}>Tenant</Table.ColumnHeader>
                  <Table.ColumnHeader {...columnHeaderProps}>Property</Table.ColumnHeader>
                  <Table.ColumnHeader {...columnHeaderProps}>Lease</Table.ColumnHeader>
                  <Table.ColumnHeader {...columnHeaderProps}>Monthly rent</Table.ColumnHeader>
                  <Table.ColumnHeader {...columnHeaderProps}>Status</Table.ColumnHeader>
                  <Table.ColumnHeader {...columnHeaderProps}>Requested</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {tenants.map((tenant: ILandlordTenant) => (
                  <Table.Row key={tenant.requestId} transition="background 0.15s" _hover={{ bg: "bg.subtle", _dark: { bg: "whiteAlpha.50" } }}>
                    <Table.Cell>
                      <HStack gap={2}>
                        <Avatar.Root size="xs">
                          {tenant.profilePicture && <Avatar.Image src={profileImageUrl(tenant.profilePicture)} />}
                          <Avatar.Fallback name={tenant.username} />
                        </Avatar.Root>
                        <Box minW={0}>
                          <Text fontWeight="medium" fontSize="sm" lineClamp={1}>
                            {tenant.username}
                          </Text>
                          <Text fontSize="xs" color="fg.muted" lineClamp={1} maxW="180px">
                            {tenant.email}
                          </Text>
                        </Box>
                      </HStack>
                    </Table.Cell>
                    <Table.Cell>
                      <HStack gap={2}>
                        <Box boxSize="34px" borderRadius="md" overflow="hidden" bg="bg.subtle" flexShrink={0}>
                          {tenant.propertyImage ? (
                            <Image src={propertyImageUrl(tenant.propertyImage)} alt={tenant.propertyTitle} w="full" h="full" objectFit="cover" />
                          ) : (
                            <Center h="full" color="fg.muted">
                              <Icon as={LuBuilding2} boxSize={3.5} />
                            </Center>
                          )}
                        </Box>
                        <Text fontSize="sm" fontWeight="medium" lineClamp={1} maxW="170px">
                          {tenant.propertyTitle}
                        </Text>
                      </HStack>
                    </Table.Cell>
                    <Table.Cell>
                      <Text fontSize="sm">
                        {formateDate(tenant.startDate)}
                      </Text>
                      <Text fontSize="xs" color="fg.muted">
                        {tenant.durationMonths} mo · until {formateDate(tenant.endDate)}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text fontSize="sm" fontWeight="semibold" color="blue.600" _dark={{ color: "blue.300" }} fontVariantNumeric="tabular-nums">
                        {formatCurrency(tenant.monthlyRent)}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge variant="subtle" colorPalette={tenant.isActive ? "green" : "gray"} borderRadius="full" size="sm" px={3}>
                        {tenant.isActive ? "Active" : "Past"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Text fontSize="sm" color="fg.muted">
                        {formateDate(tenant.requestedAt)}
                      </Text>
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