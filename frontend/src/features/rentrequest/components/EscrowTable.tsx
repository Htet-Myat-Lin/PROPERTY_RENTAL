import {
  Avatar,
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
import { LuLock, LuRotateCcw } from "react-icons/lu";
import { Tooltip } from "@/components/ui/tooltip";
import { formatCurrency } from "@/utils/format-currency";
import { formateDate } from "@/utils/format-date";
import { useRefundEscrow } from "../hooks/useRefundEscrow";
import { useReleaseEscrow } from "../hooks/useReleaseEscrow";
import { escrowStatusMeta } from "../utils/status";
import type { IRentRequest } from "../types";

const columnHeaderProps = {
  fontWeight: "semibold",
  fontSize: "xs",
  textTransform: "uppercase",
  letterSpacing: "wider",
  color: "fg.muted",
} as const;

/** A payment plus the escrow that is holding its funds. */
type EscrowRow = {
  paymentId: string;
  amount: number;
  landlordAmount: number;
  commissionAmount: number;
  status: "PENDING" | "RELEASED" | "REFUNDED";
  releaseDate: string | null;
  request: IRentRequest;
};

const toRows = (items: IRentRequest[]): EscrowRow[] =>
  items.flatMap((request) =>
    request.payments
      .filter((payment) => Boolean(payment.escrow))
      .map((payment) => ({
        paymentId: payment.id,
        amount: payment.amount,
        landlordAmount: payment.landlordAmount,
        commissionAmount: payment.commissionAmount,
        status: payment.escrow!.status,
        releaseDate: payment.escrow!.releaseDate ?? null,
        request,
      })),
  );

function PartyCell({ username, picture }: { username?: string; picture?: string | null }) {
  return (
    <HStack gap={2}>
      <Avatar.Root size="xs">
        <Avatar.Fallback name={username} />
        {picture && (
          <Avatar.Image src={`${import.meta.env.VITE_FILE_URL}/profile-images/${picture}`} />
        )}
      </Avatar.Root>
      <Text fontSize="sm" lineClamp={1} maxW="120px">
        {username ?? "—"}
      </Text>
    </HStack>
  );
}

type Props = {
  items: IRentRequest[];
};

export function EscrowTable({ items }: Props) {
  const { mutate: release, isPending: isReleasing } = useReleaseEscrow();
  const { mutate: refund, isPending: isRefunding } = useRefundEscrow();

  const [action, setAction] = useState<{ type: "release" | "refund"; row: EscrowRow } | null>(null);

  const isBusy = isReleasing || isRefunding;
  const rows = toRows(items);

  const confirmAction = () => {
    if (!action) return;
    const options = { onSuccess: () => setAction(null) };
    if (action.type === "release") release(action.row.paymentId, options);
    if (action.type === "refund") refund(action.row.paymentId, options);
  };

  return (
    <>
      <Box overflowX="auto">
        <Table.Root size="sm" variant="outline" showColumnBorder>
          <Table.Header>
            <Table.Row bg="bg.subtle" _dark={{ bg: "whiteAlpha.50" }}>
              <Table.ColumnHeader {...columnHeaderProps}>Property</Table.ColumnHeader>
              <Table.ColumnHeader {...columnHeaderProps}>Tenant</Table.ColumnHeader>
              <Table.ColumnHeader {...columnHeaderProps}>Landlord</Table.ColumnHeader>
              <Table.ColumnHeader {...columnHeaderProps}>Held</Table.ColumnHeader>
              <Table.ColumnHeader {...columnHeaderProps}>Landlord gets</Table.ColumnHeader>
              <Table.ColumnHeader {...columnHeaderProps}>Fee</Table.ColumnHeader>
              <Table.ColumnHeader {...columnHeaderProps}>Escrow</Table.ColumnHeader>
              <Table.ColumnHeader {...columnHeaderProps} textAlign="center">
                Actions
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {rows.map((row) => {
              const isPending = row.status === "PENDING";

              return (
                <Table.Row
                  key={row.paymentId}
                  transition="background 0.15s"
                  _hover={{ bg: "bg.subtle", _dark: { bg: "whiteAlpha.50" } }}
                >
                  <Table.Cell>
                    <Box minW={0}>
                      <Text fontWeight="medium" fontSize="sm" lineClamp={1}>
                        {row.request.property.title}
                      </Text>
                      <Text fontSize="xs" color="fg.muted" lineClamp={1} maxW="160px">
                        Move in {formateDate(row.request.startDate)}
                      </Text>
                    </Box>
                  </Table.Cell>

                  <Table.Cell>
                    <PartyCell
                      username={row.request.user?.username}
                      picture={row.request.user?.profilePicture}
                    />
                  </Table.Cell>

                  <Table.Cell>
                    <PartyCell
                      username={row.request.landlord?.username}
                      picture={row.request.landlord?.profilePicture}
                    />
                  </Table.Cell>

                  <Table.Cell>
                    <Text fontWeight="semibold" fontSize="sm">
                      {formatCurrency(row.amount)}
                    </Text>
                  </Table.Cell>

                  <Table.Cell>
                    <Text fontSize="sm" color="blue.600" _dark={{ color: "blue.300" }}>
                      {formatCurrency(row.landlordAmount)}
                    </Text>
                  </Table.Cell>

                  <Table.Cell>
                    <Text fontSize="sm" color="fg.muted">
                      {formatCurrency(row.commissionAmount)}
                    </Text>
                  </Table.Cell>

                  <Table.Cell>
                    <Badge
                      variant="subtle"
                      colorPalette={escrowStatusMeta[row.status].colorPalette}
                      borderRadius="full"
                      size="sm"
                      px={3}
                    >
                      {escrowStatusMeta[row.status].label}
                    </Badge>
                    {row.releaseDate && (
                      <Text fontSize="xs" color="fg.muted" mt={1}>
                        {formateDate(row.releaseDate)}
                      </Text>
                    )}
                  </Table.Cell>

                  <Table.Cell>
                    <HStack gap={1} justify="center">
                      {isPending ? (
                        <>
                          <Tooltip content="Release to the landlord">
                            <IconButton
                              variant="ghost"
                              size="xs"
                              borderRadius="md"
                              color="green.500"
                              _hover={{ bg: "green.50" }}
                              aria-label="Release escrow to landlord"
                              disabled={isBusy}
                              onClick={() => setAction({ type: "release", row })}
                            >
                              <LuLock />
                            </IconButton>
                          </Tooltip>

                          <Tooltip content="Refund to the tenant">
                            <IconButton
                              variant="ghost"
                              size="xs"
                              borderRadius="md"
                              color="red.500"
                              _hover={{ bg: "red.50" }}
                              aria-label="Refund escrow to tenant"
                              disabled={isBusy}
                              onClick={() => setAction({ type: "refund", row })}
                            >
                              <LuRotateCcw />
                            </IconButton>
                          </Tooltip>
                        </>
                      ) : (
                        <Text fontSize="xs" color="fg.muted">
                          Settled
                        </Text>
                      )}
                    </HStack>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </Box>

      <Dialog.Root
        role="alertdialog"
        open={action !== null}
        onOpenChange={(e) => {
          if (!e.open && !isBusy) setAction(null);
        }}
        closeOnInteractOutside={!isBusy}
        size="md"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content borderRadius="xl">
              <Dialog.Header>
                <Dialog.Title>
                  {action?.type === "release" ? "Release escrow" : "Refund escrow"}
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                {action && (
                  <VStack gap={3} align="stretch">
                    <Text color="fg.muted">
                      {action.type === "release" ? (
                        <>
                          This pays{" "}
                          <Text as="span" fontWeight="semibold" color="fg">
                            {formatCurrency(action.row.landlordAmount)}
                          </Text>{" "}
                          to{" "}
                          <Text as="span" fontWeight="semibold" color="fg">
                            {action.row.request.landlord?.username ?? "the landlord"}
                          </Text>{" "}
                          and marks the property as rented. It cannot be undone.
                        </>
                      ) : (
                        <>
                          This returns{" "}
                          <Text as="span" fontWeight="semibold" color="fg">
                            {formatCurrency(action.row.amount)}
                          </Text>{" "}
                          to{" "}
                          <Text as="span" fontWeight="semibold" color="fg">
                            {action.row.request.user?.username ?? "the tenant"}
                          </Text>
                          . The platform fee is not returned, and this cannot be undone.
                        </>
                      )}
                    </Text>

                    {action.row.request.decisionReason && (
                      <Box borderTopWidth="1px" borderColor="border.muted" pt={3}>
                        <Text color="fg.muted" fontSize="xs" mb={1}>
                          Landlord&apos;s stated reason
                        </Text>
                        <Text fontSize="sm">{action.row.request.decisionReason}</Text>
                      </Box>
                    )}
                  </VStack>
                )}
              </Dialog.Body>
              <Dialog.Footer gap={3}>
                <Button
                  variant="outline"
                  borderRadius="lg"
                  onClick={() => setAction(null)}
                  disabled={isBusy}
                >
                  Cancel
                </Button>
                <Button
                  colorPalette={action?.type === "release" ? "green" : "red"}
                  borderRadius="lg"
                  loading={isBusy}
                  onClick={confirmAction}
                >
                  Confirm
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
