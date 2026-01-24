import {
  Button,
  Center,
  Dialog,
  Flex,
  HStack,
  Menu,
  Portal,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { HiSortAscending } from "react-icons/hi";
import { PropertyForm } from "./PropertyForm";
import { useGetLandlordProperties } from "../hooks/useGetLandlordProperties";
import { PropertyTableList } from "./PropertyTableList";
import type { IProperty } from "../types";

const sortBy = [
  { label: "Ascending", value: "asc" },
  { label: "Descending", value: "desc" },
];

const statuses = [
  { label: "All", value: "" },
  { label: "Available", value: "AVAILABLE" },
  { label: "Rented", value: "RENTED" },
];

export function PropertyList() {
  const [sort, setSort] = useState("asc");
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState<IProperty | null>(null)

  const openCreateModal = () => {
    setOpen(true)
    setPropertyToEdit(null)
  }

  const openEditModal = (property: IProperty) => {
    setOpen(true)
    setPropertyToEdit(property)
  }

  const { data, isPending } = useGetLandlordProperties();

  if (isPending) {
    return (
      <Center minH="95vh">
        <VStack colorPalette="teal">
          <Spinner color="colorPalette.600" />
          <Text color="colorPalette.600">Loading...</Text>
        </VStack>
      </Center>
    );
  }

  const { properties } = data;

  return (
    <Stack gap="6">
      <Flex alignItems="center" justify="space-between" gap="1">
        <Text fontSize="lg" fontWeight="semibold">
          Property
        </Text>
        <HStack>
          {/* Filter by Status */}
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button
                colorPalette="blue"
                variant="surface"
                size={{ base: "xs", md: "sm" }}
              >
                <HiSortAscending /> Status
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content minW="10rem" bg="bg.info">
                  <Menu.RadioItemGroup
                    value={status}
                    onValueChange={(e) => setStatus(e.value)}
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
            <Button
              colorPalette="blue"
              variant="surface"
              size={{ base: "xs", md: "sm" }}
            >
              <HiSortAscending /> Sort
            </Button>
            <Portal>
              <Menu.Positioner>
                <Menu.Content minW="10rem" bg="bg.info">
                  <Menu.RadioItemGroup
                    value={sort}
                    onValueChange={(e) => setSort(e.value)}
                  >
                    {sortBy.map((item) => (
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
          <Dialog.Root
            placement="center"
            size="lg"
            closeOnInteractOutside={false}
            open={open}
            scrollBehavior="inside"
          >
            <Button
              onClick={openCreateModal}
              colorPalette="blue"
              variant="surface"
              size={{ base: "xs", md: "sm" }}
            >
              <FaPlus /> New
            </Button>
            <Portal>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content>
                  <Dialog.Body>
                    {/* Property Create Form Modal */}
                    <PropertyForm setOpen={setOpen} propertyToEdit={propertyToEdit} />
                  </Dialog.Body>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>
        </HStack>
      </Flex>

      {/* Property Table */}
      <PropertyTableList items={properties} openEditModal={openEditModal} />
    </Stack>
  );
}
