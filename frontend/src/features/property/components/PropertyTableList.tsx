import {
  Table,
  HStack,
  Dialog,
  Portal,
  Button,
  CloseButton,
  Checkbox,
  ActionBar,
  Badge,
  Text,
  IconButton,
} from "@chakra-ui/react";
import type { IProperty } from "../types";
import { formateDate } from "@/utils/format-date";
import { FiEdit3, FiEye, FiTrash2 } from "react-icons/fi";
import { useDeleteProperty } from "../hooks/useDeleteProperty";
import { PropertyDetailDialog } from "./PropertyDetailDialog";
import { useCallback, useMemo, useState } from "react";
import { useDeleteProperties } from "../hooks/useDeleteProperties";

type Props = {
  items: IProperty[];
  openEditModal: (property: IProperty) => void;
};

/* ─── Status Badge Color Map ─── */
const statusColorMap: Record<string, string> = {
  AVAILABLE: "green",
  RENTED: "blue",
  RESERVED: "orange",
};

export function PropertyTableList({ items, openEditModal }: Props) {
  const [selectedIds, setSelectedIds] = useState(new Set<string>());

  // Memoize allIds to avoid recreating on every render
  const allIds = useMemo(() => items.map((item) => item._id), [items]);

  // Optimized handlers with useCallback
  const handleCheckboxChange = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (!items.length) return;
    setSelectedIds((prev) => {
      if (prev.size === items.length) return new Set(); // Deselect all
      return new Set(allIds); // Select all
    });
  }, [items.length, allIds]);

  const isChecked = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds]
  );

  const openActionBar = selectedIds.size > 1;

  const { mutate: deleteProperty } = useDeleteProperty();
  const { mutate: deleteProperties } = useDeleteProperties();

  const handleDelete = (id: string) => {
    deleteProperty(id);
  };
  const handleBulkDelete = () => {
    deleteProperties(Array.from(selectedIds));
    setSelectedIds(new Set<string>());
  };

  return (
    <Table.Root size="sm" variant="outline" showColumnBorder>
      <Table.Header>
        <Table.Row bg="bg.subtle" _dark={{ bg: "whiteAlpha.50" }}>
          <Table.ColumnHeader w="40px" textAlign="center">
            <Checkbox.Root
              display={selectedIds.size > 0 ? "block" : "none"}
              variant="solid"
              colorPalette="blue"
              size="sm"
              checked={items.length > 0 && selectedIds.size === items.length}
              onChange={handleSelectAll}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
            </Checkbox.Root>
          </Table.ColumnHeader>
          <Table.ColumnHeader fontWeight="semibold" fontSize="xs" textTransform="uppercase" letterSpacing="wider" color="fg.muted">
            Title
          </Table.ColumnHeader>
          <Table.ColumnHeader fontWeight="semibold" fontSize="xs" textTransform="uppercase" letterSpacing="wider" color="fg.muted">
            Rent Fee
          </Table.ColumnHeader>
          <Table.ColumnHeader fontWeight="semibold" fontSize="xs" textTransform="uppercase" letterSpacing="wider" color="fg.muted">
            Type
          </Table.ColumnHeader>
          <Table.ColumnHeader fontWeight="semibold" fontSize="xs" textTransform="uppercase" letterSpacing="wider" color="fg.muted">
            Beds / Baths
          </Table.ColumnHeader>
          <Table.ColumnHeader fontWeight="semibold" fontSize="xs" textTransform="uppercase" letterSpacing="wider" color="fg.muted">
            Address
          </Table.ColumnHeader>
          <Table.ColumnHeader fontWeight="semibold" fontSize="xs" textTransform="uppercase" letterSpacing="wider" color="fg.muted">
            Updated
          </Table.ColumnHeader>
          <Table.ColumnHeader fontWeight="semibold" fontSize="xs" textTransform="uppercase" letterSpacing="wider" color="fg.muted">
            Status
          </Table.ColumnHeader>
          <Table.ColumnHeader fontWeight="semibold" fontSize="xs" textTransform="uppercase" letterSpacing="wider" color="fg.muted" textAlign="center">
            Actions
          </Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {items.map((item) => (
          <Table.Row
            key={item._id}
            transition="background 0.15s"
            _hover={{ bg: "bg.subtle", _dark: { bg: "whiteAlpha.50" } }}
          >
            <Table.Cell textAlign="center">
              <Checkbox.Root
                variant="solid"
                colorPalette="blue"
                size="sm"
                checked={isChecked(item._id)}
                onChange={() => handleCheckboxChange(item._id)}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
              </Checkbox.Root>
            </Table.Cell>
            <Table.Cell>
              <Text fontWeight="medium" fontSize="sm" lineClamp={1}>
                {item.title}
              </Text>
            </Table.Cell>
            <Table.Cell>
              <Text fontWeight="semibold" fontSize="sm" color="blue.600" _dark={{ color: "blue.300" }}>
                ${item.baseRentPrice.toLocaleString()}
              </Text>
            </Table.Cell>
            <Table.Cell>
              <Badge variant="subtle" colorPalette="gray" borderRadius="full" size="sm">
                {item.propertyType}
              </Badge>
            </Table.Cell>
            <Table.Cell>
              <Text fontSize="sm">{`${item.beds} / ${item.baths}`}</Text>
            </Table.Cell>
            <Table.Cell>
              <Text fontSize="sm" lineClamp={1} maxW="200px" color="fg.muted">
                {item.location.address}
              </Text>
            </Table.Cell>
            <Table.Cell>
              <Text fontSize="sm" color="fg.muted">
                {formateDate(item.updatedAt)}
              </Text>
            </Table.Cell>
            <Table.Cell>
              <Badge
                variant="subtle"
                colorPalette={statusColorMap[item.status] || "gray"}
                borderRadius="full"
                size="sm"
                px={3}
              >
                {item.status}
              </Badge>
            </Table.Cell>
            <Table.Cell>
              <HStack gap={1} justify="center">
                {/* View Detail */}
                <Dialog.Root placement="center" size="lg">
                  <Dialog.Trigger asChild>
                    <IconButton
                      variant="ghost"
                      size="xs"
                      aria-label="View details"
                      color="blue.500"
                      borderRadius="md"
                      _hover={{ bg: "blue.50", _dark: { bg: "blue.950" } }}
                    >
                      <FiEye />
                    </IconButton>
                  </Dialog.Trigger>
                  <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                      <Dialog.Content borderRadius="xl">
                        <Dialog.Header />
                        <Dialog.Body>
                          <PropertyDetailDialog property={item} />
                        </Dialog.Body>
                        <Dialog.CloseTrigger asChild>
                          <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                      </Dialog.Content>
                    </Dialog.Positioner>
                  </Portal>
                </Dialog.Root>

                {/* Edit */}
                <IconButton
                  variant="ghost"
                  size="xs"
                  aria-label="Edit property"
                  color="green.500"
                  borderRadius="md"
                  _hover={{ bg: "green.50", _dark: { bg: "green.950" } }}
                  onClick={() => openEditModal(item)}
                >
                  <FiEdit3 />
                </IconButton>

                {/* Delete */}
                <Dialog.Root role="alertdialog">
                  <Dialog.Trigger asChild>
                    <IconButton
                      variant="ghost"
                      size="xs"
                      aria-label="Delete property"
                      color="red.500"
                      borderRadius="md"
                      _hover={{ bg: "red.50", _dark: { bg: "red.950" } }}
                    >
                      <FiTrash2 />
                    </IconButton>
                  </Dialog.Trigger>
                  <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                      <Dialog.Content borderRadius="xl">
                        <Dialog.Header>
                          <Dialog.Title>Delete Property</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                          <Text color="fg.muted">
                            This action cannot be undone. This will permanently
                            delete your property listing and remove your data
                            from our systems.
                          </Text>
                        </Dialog.Body>
                        <Dialog.Footer gap={3}>
                          <Dialog.ActionTrigger asChild>
                            <Button variant="outline" borderRadius="lg">
                              Cancel
                            </Button>
                          </Dialog.ActionTrigger>
                          <Button
                            colorPalette="red"
                            borderRadius="lg"
                            onClick={() => handleDelete(item._id)}
                          >
                            Delete
                          </Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                          <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                      </Dialog.Content>
                    </Dialog.Positioner>
                  </Portal>
                </Dialog.Root>
              </HStack>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>

      {/* ─── Bulk Action Bar ─── */}
      <ActionBar.Root open={openActionBar}>
        <Portal>
          <ActionBar.Positioner>
            <ActionBar.Content borderRadius="xl" shadow="lg">
              <ActionBar.SelectionTrigger>
                <Badge colorPalette="blue" variant="solid" borderRadius="full" mr={1}>
                  {selectedIds.size}
                </Badge>
                items selected
              </ActionBar.SelectionTrigger>
              <ActionBar.Separator />
              {/* Bulk Delete Confirm Dialog */}
              <Dialog.Root role="alertdialog">
                <Dialog.Trigger asChild>
                  <Button variant="surface" size="sm" colorPalette="red" borderRadius="lg">
                    <FiTrash2 />
                    Delete Selected
                  </Button>
                </Dialog.Trigger>
                <Portal>
                  <Dialog.Backdrop />
                  <Dialog.Positioner>
                    <Dialog.Content borderRadius="xl">
                      <Dialog.Header>
                        <Dialog.Title>Delete {selectedIds.size} Properties</Dialog.Title>
                      </Dialog.Header>
                      <Dialog.Body>
                        <Text color="fg.muted">
                          This action cannot be undone. This will permanently
                          delete the selected property listings and remove the
                          data from our systems.
                        </Text>
                      </Dialog.Body>
                      <Dialog.Footer gap={3}>
                        <Dialog.ActionTrigger asChild>
                          <Button variant="outline" borderRadius="lg">
                            Cancel
                          </Button>
                        </Dialog.ActionTrigger>
                        <Button
                          colorPalette="red"
                          borderRadius="lg"
                          onClick={handleBulkDelete}
                        >
                          Delete All
                        </Button>
                      </Dialog.Footer>
                      <Dialog.CloseTrigger asChild>
                        <CloseButton size="sm" />
                      </Dialog.CloseTrigger>
                    </Dialog.Content>
                  </Dialog.Positioner>
                </Portal>
              </Dialog.Root>
            </ActionBar.Content>
          </ActionBar.Positioner>
        </Portal>
      </ActionBar.Root>
    </Table.Root>
  );
}
