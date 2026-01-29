import {
  Table,
  HStack,
  Icon,
  Dialog,
  Portal,
  Button,
  CloseButton,
  Checkbox,
  ActionBar,
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
    [selectedIds],
  );

  const openActionBar = selectedIds.size > 1;

  const { mutate: deleteProperty } = useDeleteProperty();
  const { mutate: deleteProperties } = useDeleteProperties();

  const handleDelete = (id: string) => {
    deleteProperty(id);
  };
  const handleBulkDelete = () => {
    deleteProperties(Array.from(selectedIds));
    setSelectedIds(new Set<string>())
  };

  return (
    <Table.Root
      size="sm"
      variant="outline"
      showColumnBorder
      borderRadius="sm"
      shadow="md"
    >
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader textAlign="center">
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
          <Table.ColumnHeader>Title</Table.ColumnHeader>
          <Table.ColumnHeader>Rent Fee</Table.ColumnHeader>
          <Table.ColumnHeader>Type</Table.ColumnHeader>
          <Table.ColumnHeader>Beds / Baths</Table.ColumnHeader>
          <Table.ColumnHeader>Address</Table.ColumnHeader>
          <Table.ColumnHeader>Updated</Table.ColumnHeader>
          <Table.ColumnHeader>Status</Table.ColumnHeader>
          <Table.ColumnHeader>Actions</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {items.map((item) => (
          <Table.Row key={item._id}>
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
            <Table.Cell>{item.title}</Table.Cell>
            <Table.Cell>{item.baseRentPrice}</Table.Cell>
            <Table.Cell>{item.propertyType}</Table.Cell>
            <Table.Cell>{`${item.beds} / ${item.baths}`}</Table.Cell>
            <Table.Cell>{item.location.address}</Table.Cell>
            <Table.Cell>{formateDate(item.updatedAt)}</Table.Cell>
            <Table.Cell>{item.status}</Table.Cell>
            <Table.Cell>
              <HStack>
                {/* Delete Icon */}
                <Icon color="red" size="sm">
                  {/* Delete Confirm Dialog */}
                  <Dialog.Root role="alertdialog">
                    <Dialog.Trigger asChild>
                      <Icon color="red" size="sm">
                        <FiTrash2 />
                      </Icon>
                    </Dialog.Trigger>
                    <Portal>
                      <Dialog.Backdrop />
                      <Dialog.Positioner>
                        <Dialog.Content>
                          <Dialog.Header>
                            <Dialog.Title>Are you sure to delete?</Dialog.Title>
                          </Dialog.Header>
                          <Dialog.Body>
                            <p>
                              This action cannot be undone. This will
                              permanently delete your property listing and
                              remove your data from our systems.
                            </p>
                          </Dialog.Body>
                          <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                              <Button variant="outline">Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Button
                              colorPalette="red"
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
                </Icon>
                {/* Edit Icon */}
                <Icon color="green" size="sm">
                  <FiEdit3 onClick={() => openEditModal(item)} />
                </Icon>
                {/* View Detail Icon */}
                <Dialog.Root placement="center" size="lg">
                  <Dialog.Trigger asChild>
                    <Icon color="blue.solid" size="sm">
                      <FiEye />
                    </Icon>
                  </Dialog.Trigger>
                  <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                      <Dialog.Content>
                        <Dialog.Header></Dialog.Header>
                        <Dialog.Body>
                          {/* Property Detial Modal */}
                          <PropertyDetailDialog property={item} />
                        </Dialog.Body>
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
      {/* Action Bar For Bulk Delete */}
      <ActionBar.Root open={openActionBar}>
        <Portal>
          <ActionBar.Positioner>
            <ActionBar.Content>
              <ActionBar.SelectionTrigger>
                {selectedIds.size} selected
              </ActionBar.SelectionTrigger>
              <ActionBar.Separator />
              {/* Bulk Delete Confirm Dialog */}
              <Dialog.Root role="alertdialog">
                <Dialog.Trigger asChild>
                  <Button variant="surface" size="sm" colorPalette="red">
                    <FiTrash2 />
                    Delete
                  </Button>
                </Dialog.Trigger>
                <Portal>
                  <Dialog.Backdrop />
                  <Dialog.Positioner>
                    <Dialog.Content>
                      <Dialog.Header>
                        <Dialog.Title>Are you sure to delete?</Dialog.Title>
                      </Dialog.Header>
                      <Dialog.Body>
                        <p>
                          This action cannot be undone. This will permanently
                          delete your property listing and remove your data from
                          our systems.
                        </p>
                      </Dialog.Body>
                      <Dialog.Footer>
                        <Dialog.ActionTrigger asChild>
                          <Button variant="outline">Cancel</Button>
                        </Dialog.ActionTrigger>
                        <Button colorPalette="red" onClick={handleBulkDelete}>
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
            </ActionBar.Content>
          </ActionBar.Positioner>
        </Portal>
      </ActionBar.Root>
    </Table.Root>
  );
}
