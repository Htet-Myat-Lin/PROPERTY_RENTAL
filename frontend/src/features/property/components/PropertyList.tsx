import {
  Button,
  ButtonGroup,
  Center,
  Dialog,
  Flex,
  HStack,
  IconButton,
  Input,
  Menu,
  Pagination,
  Portal,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import { HiSortAscending } from "react-icons/hi";
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

  // 2. Filter Object for API Req
  const filters: PropertyFilters = {
    page,
    limit: PAGE_LIMIT,
    sortBy: sortValue,
    status: statusValue,
    search: searchValue,
  };

  // 3. Helper to update URL params
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

  return (
    <Stack gap="6">
      {/* --- HEADER SECTION --- */}
      <Flex
        alignItems={{ base: "start", md: "center" }}
        justify="space-between"
        gap="4"
        direction={{ base: "column", md: "row" }}
      >
        <Text fontSize="lg" fontWeight="semibold">
          Properties
        </Text>

        <HStack wrap="wrap" gap="2">
          {/* Search Input */}
          <HStack gap="0" mr="2">
            <Input
              placeholder="Search..."
              size="sm"
              maxW="200px"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
              borderRightRadius="0"
            />
            <IconButton
              aria-label="Search"
              size="sm"
              onClick={handleSearchSubmit}
              borderLeftRadius="0"
              variant="surface"
              colorPalette="gray"
            >
              <FaSearch />
            </IconButton>
          </HStack>

          {/* Filter by Status */}
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button colorPalette="blue" variant="surface" size="sm">
                <HiSortAscending />{" "}
                {statusValue
                  ? statuses.find((s) => s.value === statusValue)?.label
                  : "Status"}
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content minW="10rem" bg="bg.panel">
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
              <Button colorPalette="blue" variant="surface" size="sm">
                <HiSortAscending /> Sort
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content minW="10rem" bg="bg.panel">
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

          {/* Add New Property Button */}
          <Button
            onClick={openCreateModal}
            colorPalette="blue"
            variant="solid"
            size="sm"
          >
            <FaPlus /> New
          </Button>
        </HStack>
      </Flex>

      {/* --- CONTENT SECTION --- */}
      {isPending ? (
        <Center minH="40vh">
          <VStack colorPalette="teal">
            <Spinner color="colorPalette.600" size="xl" />
            <Text color="colorPalette.600">Loading properties...</Text>
          </VStack>
        </Center>
      ) : (
        <>
          {properties.length === 0 ? (
            <Center
              minH="20vh"
              borderWidth="1px"
              borderStyle="dashed"
              borderRadius="md"
              gap="2"
            >
              <Text color="fg.muted">No properties found.</Text>
              {searchParams.size > 0 && (
                <Button size="xs" onClick={resetFilter}>
                  Reset Filter
                </Button>
              )}
            </Center>
          ) : (
            <PropertyTableList
              items={properties}
              openEditModal={openEditModal}
            />
          )}

          {/* --- PAGINATION SECTION --- */}
          {totalPages > 1 && (
            <Pagination.Root count={totalCount} pageSize={PAGE_LIMIT} defaultPage={page}>
              <ButtonGroup attached variant="outline" size="sm">
                <Pagination.PrevTrigger>
                  <IconButton onClick={() => handlePageChange(Math.max(1, page - 1))}>
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
                  <IconButton onClick={() => handlePageChange(Math.min(totalPages, page + 1))}>
                    <MdChevronRight />
                  </IconButton>
                </Pagination.NextTrigger>
              </ButtonGroup>
            </Pagination.Root>
          )}
        </>
      )}

      {/* --- MODALS --- */}
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
            <Dialog.Content>
              <Dialog.Body bg="bg.panel" shadow="lg" borderRadius="lg" p="6">
                {/* Property Form Modal */}
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
