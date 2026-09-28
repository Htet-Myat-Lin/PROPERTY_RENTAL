import {
  Badge,
  Box,
  Button,
  CloseButton,
  Dialog,
  HStack,
  IconButton,
  Portal,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiCheck, FiEye, FiX } from "react-icons/fi";
import { formateDate } from "@/utils/format-date";
import { formatCurrency } from "@/utils/format-currency";
import { useApproveDepositRequest } from "../hooks/useApproveDepositRequest";
import { useRejectDepositRequest } from "../hooks/useRejectDepositRequest";
import { PAYMENT_METHODS } from "../schema";
import type { DepositRequestStatus, IAdminDepositRequest } from "../types";

const statusColorMap: Record<DepositRequestStatus, string> = {
  PENDING: "orange",
  APPROVED: "green",
  REJECTED: "red",
};

const methodLabels = Object.fromEntries(PAYMENT_METHODS.map((m) => [m.value, m.label]));

const columnHeaderProps = {
  fontWeight: "semibold",
  fontSize: "xs",
  textTransform: "uppercase",
  letterSpacing: "wider",
  color: "fg.muted",
} as const;

type Props = {
  items: IAdminDepositRequest[];
};

function FlexRow({ label, value }: { label: string; value: string }) {
  return (
    <HStack justify="space-between" align="flex-start" gap={4} fontSize="sm">
      <Text color="fg.muted" flexShrink={0}>
        {label}
      </Text>
      <Text fontWeight="medium" textAlign="right" wordBreak="break-word">
        {value}
      </Text>
    </HStack>
  );
}

/* ─── Read-only detail view ─── */
function RequestDetails({ request }: { request: IAdminDepositRequest }) {
  const rows: [string, string][] = [
    ["Tenant", request.user.username],
    ["Email", request.user.email],
    ["Amount", formatCurrency(request.ammount)],
    ["Payment method", methodLabels[request.paymentMethod] ?? request.paymentMethod],
    ["Transaction reference", request.transactionId],
    ["Status", request.status],
    ["Requested", formateDate(request.createdAt)],
  ];

  return (
    <VStack gap={3} align="stretch">
      {rows.map(([label, value]) => (
        <FlexRow key={label} label={label} value={value} />
      ))}
    </VStack>
  );
}

type Action = { type: "approve" | "reject"; request: IAdminDepositRequest };

export function DepositRequestTable({ items }: Props) {
  const { mutate: approve, isPending: isApproving } = useApproveDepositRequest();
  const { mutate: reject, isPending: isRejecting } = useRejectDepositRequest();
  const [action, setAction] = useState<Action | null>(null);

  const isBusy = isApproving || isRejecting;
  const isApproveAction = action?.type === "approve";

  const confirmAction = () => {
    if (!action) return;
    const options = { onSuccess: () => setAction(null) };

    if (action.type === "approve") {
      approve(action.request.id, options);
    } else {
      reject(action.request.id, options);
    }
  };

  return (
    <>
      <Box overflowX="auto">
        <Table.Root size="sm" variant="outline" showColumnBorder>
          <Table.Header>
            <Table.Row bg="bg.subtle" _dark={{ bg: "whiteAlpha.50" }}>
              <Table.ColumnHeader {...columnHeaderProps}>Tenant</Table.ColumnHeader>
              <Table.ColumnHeader {...columnHeaderProps}>Amount</Table.ColumnHeader>
              <Table.ColumnHeader {...columnHeaderProps}>Method</Table.ColumnHeader>
              <Table.ColumnHeader {...columnHeaderProps}>Reference</Table.ColumnHeader>
              <Table.ColumnHeader {...columnHeaderProps}>Requested</Table.ColumnHeader>
              <Table.ColumnHeader {...columnHeaderProps}>Status</Table.ColumnHeader>
              <Table.ColumnHeader {...columnHeaderProps} textAlign="center">
                Actions
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {items.map((item) => {
              const isPendingRequest = item.status === "PENDING";

              return (
                <Table.Row
                  key={item.id}
                  transition="background 0.15s"
                  _hover={{ bg: "bg.subtle", _dark: { bg: "whiteAlpha.50" } }}
                >
                  <Table.Cell>
                    <Text fontWeight="medium" fontSize="sm" lineClamp={1}>
                      {item.user.username}
                    </Text>
                    <Text fontSize="xs" color="fg.muted" lineClamp={1} maxW="200px">
                      {item.user.email}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontWeight="semibold" fontSize="sm" color="blue.600" _dark={{ color: "blue.300" }}>
                      {formatCurrency(item.ammount)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant="subtle" colorPalette="gray" borderRadius="full" size="sm">
                      {methodLabels[item.paymentMethod] ?? item.paymentMethod}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontSize="sm" fontFamily="mono" color="fg.muted" lineClamp={1} maxW="160px">
                      {item.transactionId}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontSize="sm" color="fg.muted">
                      {formateDate(item.createdAt)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      variant="subtle"
                      colorPalette={statusColorMap[item.status] ?? "gray"}
                      borderRadius="full"
                      size="sm"
                      px={3}
                    >
                      {item.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <HStack gap={1} justify="center">
                      {/* View details */}
                      <Dialog.Root placement="center" size="md">
                        <Dialog.Trigger asChild>
                          <IconButton
                            variant="ghost"
                            size="xs"
                            aria-label="View request details"
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
                              <Dialog.Header>
                                <Dialog.Title>Deposit Request</Dialog.Title>
                              </Dialog.Header>
                              <Dialog.Body>
                                <RequestDetails request={item} />
                              </Dialog.Body>
                              <Dialog.CloseTrigger asChild>
                                <CloseButton size="sm" />
                              </Dialog.CloseTrigger>
                            </Dialog.Content>
                          </Dialog.Positioner>
                        </Portal>
                      </Dialog.Root>

                      {/* Approve - credits the tenant's wallet */}
                      <IconButton
                        variant="ghost"
                        size="xs"
                        aria-label="Approve deposit request"
                        color="green.500"
                        borderRadius="md"
                        _hover={{ bg: "green.50", _dark: { bg: "green.950" } }}
                        disabled={!isPendingRequest || isBusy}
                        title={isPendingRequest ? "Approve" : `Already ${item.status.toLowerCase()}`}
                        onClick={() => setAction({ type: "approve", request: item })}
                      >
                        <FiCheck />
                      </IconButton>

                      {/* Reject */}
                      <IconButton
                        variant="ghost"
                        size="xs"
                        aria-label="Reject deposit request"
                        color="red.500"
                        borderRadius="md"
                        _hover={{ bg: "red.50", _dark: { bg: "red.950" } }}
                        disabled={!isPendingRequest || isBusy}
                        title={isPendingRequest ? "Reject" : `Already ${item.status.toLowerCase()}`}
                        onClick={() => setAction({ type: "reject", request: item })}
                      >
                        <FiX />
                      </IconButton>
                    </HStack>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </Box>

      {/* ─── Shared approve / reject confirmation ─── */}
      <Dialog.Root
        role="alertdialog"
        open={action !== null}
        onOpenChange={(e) => {
          if (!e.open) setAction(null);
        }}
        closeOnInteractOutside={!isBusy}
        size="md"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content borderRadius="xl">
              <Dialog.Header>
                <Dialog.Title>{isApproveAction ? "Approve Deposit" : "Reject Deposit"}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                {action && isApproveAction ? (
                  <Text color="fg.muted">
                    This credits{" "}
                    <Text as="span" fontWeight="semibold" color="fg">
                      {formatCurrency(action.request.ammount)}
                    </Text>{" "}
                    to {action.request.user.username}&apos;s wallet and records a DEPOSIT transaction. This cannot
                    be undone.
                  </Text>
                ) : (
                  action && (
                    <Text color="fg.muted">
                      {action.request.user.username}&apos;s request for{" "}
                      <Text as="span" fontWeight="semibold" color="fg">
                        {formatCurrency(action.request.ammount)}
                      </Text>{" "}
                      will be declined. The tenant can submit a new request with a different transaction
                      reference.
                    </Text>
                  )
                )}
              </Dialog.Body>
              <Dialog.Footer gap={3}>
                <Button variant="outline" borderRadius="lg" onClick={() => setAction(null)} disabled={isBusy}>
                  Cancel
                </Button>
                <Button
                  colorPalette={isApproveAction ? "green" : "red"}
                  borderRadius="lg"
                  loading={isBusy}
                  onClick={confirmAction}
                >
                  {isApproveAction ? "Approve" : "Reject"}
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}
