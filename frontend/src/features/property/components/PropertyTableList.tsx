import { Table, Image, HStack, Icon } from "@chakra-ui/react";
import type { IProperty } from "../types";
import { formateDate } from "@/utils/format-date";
import { LuSquarePen, LuTrash } from "react-icons/lu";
import { useDeleteProperty } from "../hooks/useDeleteProperty";

export function PropertyTableList({ items, openEditModal, }: { items: IProperty[], openEditModal: (property: IProperty) => void }) {

  const {mutate} = useDeleteProperty()

  const handleDelete = (id: string) => {
    mutate(id)
  }

  return (
    <Table.Root size="sm" striped variant="outline">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader></Table.ColumnHeader>
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
            <Table.Cell>
              <Image
                rounded="md"
                src={`${import.meta.env.VITE_FILE_URL}/property-images/${item.images[0]}`}
                alt="property image"
                htmlWidth="50px"
                htmlHeight="50px"
              />
            </Table.Cell>
            <Table.Cell>{item.title}</Table.Cell>
            <Table.Cell>{item.rentPrice}</Table.Cell>
            <Table.Cell>{item.propertyType}</Table.Cell>
            <Table.Cell>{`${item.beds} / ${item.baths}`}</Table.Cell>
            <Table.Cell>{item.location.address}</Table.Cell>
            <Table.Cell>{formateDate(item.updatedAt)}</Table.Cell>
            <Table.Cell>{item.status}</Table.Cell>
            <Table.Cell>
              <HStack>
                <Icon color="red" size="sm">
                  <LuTrash onClick={() => handleDelete(item._id)} />
                </Icon>
                <Icon color="green" size="sm">
                  <LuSquarePen onClick={() => openEditModal(item)} />
                </Icon>
              </HStack>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
