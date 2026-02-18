import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Dialog,
  Flex,
  HStack,
  Icon,
  IconButton,
  Input,
  Menu,
  Pagination,
  Portal,
  Spinner,
  Stack,
  Text,
  VStack,
  Badge,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import { HiSortAscending } from "react-icons/hi";
import { LuFilter, LuX, LuChrome } from "react-icons/lu";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { useSearchParams } from "react-router";
import { PropertyForm } from "./PropertyForm";
import { useGetLandlordProperties } from "../hooks/useGetLandlordProperties";
import { PropertyTableList } from "./PropertyTableList";
import type { IProperty } from "../types";

// Types
interface PropertyFilters {
  page: number;
  limit: number;
  sortBy?: string;
  status?: string;
  search?: string;
}

const PAGE_LIMIT = 3;

const statuses = [
  { label: "All", value: "" },
  { label: "Available", value: "AVAILABLE" },
  { label: "Rented", value: "RENTED" },
  { label: "Reserved", value: "RESERVED" },
];

const sortValues = [
  { label: "Newest", value: "desc" },
  { label: "Oldest", value: "asc" },
  { label: "Price: High to low", value: "priceDesc" },
  { label: "Price: Low to high", value: "priceAsc" },
];

export function PropertyList() {
  const [open, setOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState<IProperty | null>(null);

  // Manage URL Params
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract values with defaults
  const page = Number(searchParams.get("page")) || 1;
  const statusValue = searchParams.get("status") || "";
  const sortValue = searchParams.get("sortBy") || "";
  const searchValue = searchParams.get("search") || "";

  const [searchInput, setSearchInput] = useState(searchValue);

  const openCreateModal = () => {
    setOpen(true);
    setPropertyToEdit(null);
  };
  const openEditModal = (property: IProperty) => {
    setOpen(true);
    setPropertyToEdit(property);
  };

  // Filter Object for API Req
  const filters: PropertyFilters = {
    page,
    limit: PAGE_LIMIT,
    sortBy: sortValue,
    status: statusValue,
    search: searchValue,
  };

  // Helper to update URL params
  const updateParams = (key: string, value: string) => {
    setSearchParams((prev) => {
      if (value) {
        prev.set(key, value);
      } else {
        prev.delete(key);
      }

      if (key !== "page") {
        prev.set("page", "1");
      }
      return prev;
    });
  };

  const handleSearchSubmit = () => {
    updateParams("search", searchInput);
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set("page", newPage.toString());
      return prev;
    });
  };

  const resetFilter = () => {
    setSearchInput("");
    setSearchParams({});
  };

  const { data, isPending } = useGetLandlordProperties(filters);
  const properties = data?.properties || [];
  const totalPages = data?.totalPages || 0;
  const totalCount = data?.totalCount || 0;

  const hasActiveFilters = statusValue || sortValue || searchValue;

  return (
    <Stack gap="6">
      {/* ─── Page Header ─── */}
      <Flex
        alignItems={{ base: "start", md: "center" }}
        justify="space-between"
        gap="4"
        direction={{ base: "column", md: "row" }}
      >
        <Box>
          <HStack gap={2} mb={1}>
            <Icon as={LuChrome} boxSize={6} color="blue.500" />
            <Text fontSize="xl" fontWeight="bold" color="fg">
              Properties
            </Text>
          </HStack>
          <Text fontSize="sm" color="fg.muted">
            Manage and monitor all your property listings
          </Text>
        </Box>

        <Button
          onClick={openCreateModal}
          colorPalette="blue"
          variant="solid"
          size="sm"
          borderRadius="lg"
          px={5}
        >
          <FaPlus /> Add Property
        </Button>
      </Flex>

      {/* ─── Filters & Search Bar ─── */}
      <Box
        bg="bg.panel"
        borderRadius="xl"
        border="1px solid"
        borderColor="border.muted"
        p={4}
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={3}
          align={{ base: "stretch", md: "center" }}
          justify="space-between"
        >
          {/* Search Input */}
          <HStack gap="0" flex={1} maxW={{ md: "320px" }}>
            <Input
              placeholder="Search properties..."
              size="sm"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
              borderRightRadius="0"
              borderRadius="lg"
              bg="bg.subtle"
              _dark={{ bg: "whiteAlpha.50" }}
            />
            <IconButton
              aria-label="Search"
              size="sm"
              onClick={handleSearchSubmit}
              borderLeftRadius="0"
              borderRightRadius="lg"
              variant="solid"
              colorPalette="blue"
            >
              <FaSearch />
            </IconButton>
          </HStack>

          {/* Filter Controls */}
          <HStack wrap="wrap" gap="2">
            {/* Filter by Status */}
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  borderRadius="lg"
                  gap={2}
                >
                  <Icon as={LuFilter} boxSize={4} />
                  {statusValue
                    ? statuses.find((s) => s.value === statusValue)?.label
                    : "Status"}
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content minW="10rem" bg="bg.panel" borderRadius="lg">
                    <Menu.RadioItemGroup
                      value={statusValue}
                      onValueChange={(e) => updateParams("status", e.value)}
                    >
                      {statuses.map((item) => (
                        <Menu.RadioItem key={item.value} value={item.value}>
                          {item.label}
                          <Menu.ItemIndicator />
                        </Menu.RadioItem>
                      ))}
                    </Menu.RadioItemGroup>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>

            {/* Sorting Menu */}
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  borderRadius="lg"
                  gap={2}
                >
                  <HiSortAscending /> Sort
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content minW="10rem" bg="bg.panel" borderRadius="lg">
                    <Menu.RadioItemGroup
                      value={sortValue}
                      onValueChange={(e) => updateParams("sortBy", e.value)}
                    >
                      {sortValues.map((item) => (
                        <Menu.RadioItem key={item.value} value={item.value}>
                          {item.label}
                          <Menu.ItemIndicator />
                        </Menu.RadioItem>
                      ))}
                    </Menu.RadioItemGroup>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                borderRadius="lg"
                color="fg.muted"
                onClick={resetFilter}
                gap={1}
              >
                <Icon as={LuX} boxSize={4} />
                Clear
              </Button>
            )}
          </HStack>
        </Flex>

        {/* Active filter badges */}
        {hasActiveFilters && (
          <HStack mt={3} gap={2} flexWrap="wrap">
            {searchValue && (
              <Badge
                variant="subtle"
                colorPalette="blue"
                borderRadius="full"
                px={3}
                py={1}
              >
                Search: {searchValue}
              </Badge>
            )}
            {statusValue && (
              <Badge
                variant="subtle"
                colorPalette="green"
                borderRadius="full"
                px={3}
                py={1}
              >
                Status: {statuses.find((s) => s.value === statusValue)?.label}
              </Badge>
            )}
            {sortValue && (
              <Badge
                variant="subtle"
                colorPalette="purple"
                borderRadius="full"
                px={3}
                py={1}
              >
                Sort: {sortValues.find((s) => s.value === sortValue)?.label}
              </Badge>
            )}
          </HStack>
        )}
      </Box>

      {/* ─── Content Section ─── */}
      {isPending ? (
        <Center minH="40vh">
          <VStack gap={4}>
            <Spinner color="blue.500" size="xl" borderWidth="3px" />
            <Text color="fg.muted" fontSize="sm">
              Loading properties...
            </Text>
          </VStack>
        </Center>
      ) : (
        <>
          {properties.length === 0 ? (
            <Center
              minH="30vh"
              borderWidth="2px"
              borderStyle="dashed"
              borderColor="border.muted"
              borderRadius="xl"
              flexDirection="column"
              gap="4"
              p={8}
            >
              <Box
                w="60px"
                h="60px"
                borderRadius="full"
                bg="blue.50"
                _dark={{ bg: "blue.950" }}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={LuChrome} boxSize={7} color="blue.500" />
              </Box>
              <VStack gap={1}>
                <Text fontWeight="semibold" color="fg">
                  No properties found
                </Text>
                <Text color="fg.muted" fontSize="sm" textAlign="center">
                  {searchParams.size > 0
                    ? "Try adjusting your filters or search terms"
                    : "Get started by adding your first property"}
                </Text>
              </VStack>
              {searchParams.size > 0 ? (
                <Button
                  size="sm"
                  variant="outline"
                  borderRadius="lg"
                  onClick={resetFilter}
                >
                  Reset Filters
                </Button>
              ) : (
                <Button
                  size="sm"
                  colorPalette="blue"
                  borderRadius="lg"
                  onClick={openCreateModal}
                >
                  <FaPlus /> Add Property
                </Button>
              )}
            </Center>
          ) : (
            <Box
              bg="bg.panel"
              borderRadius="xl"
              border="1px solid"
              borderColor="border.muted"
              overflow="hidden"
            >
              <PropertyTableList
                items={properties}
                openEditModal={openEditModal}
              />
            </Box>
          )}

          {/* ─── Pagination ─── */}
          {totalPages > 1 && (
            <Flex justify="center" pt={2}>
              <Pagination.Root
                count={totalCount}
                pageSize={PAGE_LIMIT}
                defaultPage={page}
              >
                <ButtonGroup attached variant="outline" size="sm">
                  <Pagination.PrevTrigger>
                    <IconButton
                      onClick={() => handlePageChange(Math.max(1, page - 1))}
                      borderRadius="lg"
                    >
                      <MdChevronLeft />
                    </IconButton>
                  </Pagination.PrevTrigger>

                  <Pagination.Items
                    render={(page) => (
                      <IconButton
                        onClick={() => handlePageChange(page.value)}
                        variant={{ base: "outline", _selected: "solid" }}
                        zIndex={{ _selected: "1" }}
                        colorPalette={{ base: "gray", _selected: "blue" }}
                      >
                        {page.value}
                      </IconButton>
                    )}
                  />

                  <Pagination.NextTrigger>
                    <IconButton
                      onClick={() =>
                        handlePageChange(Math.min(totalPages, page + 1))
                      }
                      borderRadius="lg"
                    >
                      <MdChevronRight />
                    </IconButton>
                  </Pagination.NextTrigger>
                </ButtonGroup>
              </Pagination.Root>
            </Flex>
          )}
        </>
      )}

      {/* ─── Property Form Modal ─── */}
      <Dialog.Root
        placement="center"
        size="lg"
        closeOnInteractOutside={false}
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
        scrollBehavior="inside"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content borderRadius="xl">
              <Dialog.Body bg="bg.panel" shadow="lg" borderRadius="xl" p="6">
                <PropertyForm
                  setOpen={setOpen}
                  propertyToEdit={propertyToEdit}
                />
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Stack>
  );
}
