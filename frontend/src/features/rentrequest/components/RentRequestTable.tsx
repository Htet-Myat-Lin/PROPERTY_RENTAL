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
import { FiCheck, FiEdit, FiEye, FiX } from "react-icons/fi";
import { LuFileDown, LuLock, LuRotateCcw } from "react-icons/lu";
import { Tooltip } from "@/components/ui/tooltip";
import { formatCurrency } from "@/utils/format-currency";
import { formateDate } from "@/utils/format-date";
import { useCancelRentRequest } from "../hooks/useCancelRentRequest";
import { useDownloadLeaseAgreement } from "../hooks/useDownloadLeaseAgreement";
import { useReleaseEscrow } from "../hooks/useReleaseEscrow";
import { escrowStatusMeta, rentRequestStatusMeta } from "../utils/status";
import type { IRentRequest } from "../types";

const columnHeaderProps = {
  fontWeight: "semibold",
  fontSize: "xs",
  textTransform: "uppercase",
  letterSpacing: "wider",
  color: "fg.muted",
} as const;

const iconButtonProps = (color: string, hoverBg: string) => ({
  variant: "ghost" as const,
  size: "xs" as const,
  borderRadius: "md" as const,
  color,
  _hover: { bg: hoverBg, _dark: { bg: `${hoverBg}` } },
});

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

function RequestDetails({
  request,
  mode,
  onDownloadLease,
  isDownloading,
}: {
  request: IRentRequest;
  mode: "tenant" | "landlord";
  onDownloadLease: (request: IRentRequest) => void;
  isDownloading: boolean;
}) {
  const party = mode === "landlord" ? request.user : request.landlord;
  const rows: [string, string][] = [
    ["Property", request.property.title],
    ...(request.property.locationAddress ? ([["Location", request.property.locationAddress]] as [string, string][]) : []),
    [mode === "landlord" ? "Tenant" : "Landlord", party?.username ?? "—"],
    ["Monthly rent", formatCurrency(request.property.baseRentPrice)],
    ["Lease term", `${request.durationMonths} month${request.durationMonths === 1 ? "" : "s"}`],
    ["Total rent", formatCurrency(request.amount)],
    ["Security deposit", formatCurrency(request.depositAmount)],
    ["Move in", formateDate(request.startDate)],
    ["Move out", formateDate(request.endDate)],
    ["Status", rentRequestStatusMeta[request.status].label],
    ["Requested", formateDate(request.createdAt)],
  ];

  const canDownloadLease = request.status === "APPROVED";

  return (
    <VStack gap={3} align="stretch">
      {rows.map(([label, value]) => (
        <FlexRow key={label} label={label} value={value} />
      ))}

      {canDownloadLease && (
        <Button
          size="sm"
          borderRadius="lg"
          colorPalette="blue"
          variant="outline"
          alignSelf="flex-start"
          loading={isDownloading}
          onClick={() => onDownloadLease(request)}
        >
          Download lease agreement
        </Button>
      )}

      {request.leaseGeneratedAt && (
        <Text color="fg.muted" fontSize="xs">
          Agreement generated {formateDate(request.leaseGeneratedAt)}
        </Text>
      )}

      {request.message && (
        <Box borderTopWidth="1px" borderColor="border.muted" pt={3}>
          <Text color="fg.muted" fontSize="xs" mb={1}>
            Message
          </Text>
          <Text fontSize="sm">{request.message}</Text>
        </Box>
      )}

      {request.decisionReason && (
        <Box borderTopWidth="1px" borderColor="border.muted" pt={3}>
          <Text color="fg.muted" fontSize="xs" mb={1}>
            Landlord&apos;s reason
          </Text>
          <Text fontSize="sm">{request.decisionReason}</Text>
        </Box>
      )}

      {request.payments.map((payment) => (
        <Box key={payment.id} borderTopWidth="1px" borderColor="border.muted" pt={3}>
          <Text color="fg.muted" fontSize="xs" mb={2}>
            Deposit payment
          </Text>
          <VStack gap={2} align="stretch">
            <FlexRow label="Amount charged" value={formatCurrency(payment.amount)} />
            <FlexRow label="Landlord receives" value={formatCurrency(payment.landlordAmount)} />
            <FlexRow label="Platform fee" value={formatCurrency(payment.commissionAmount)} />
            {payment.escrow && (
              <>
                <FlexRow
                  label="Escrow"
                  value={escrowStatusMeta[payment.escrow.status].label}
                />
                {payment.escrow.releaseDate && (
                  <FlexRow label="Released on" value={formateDate(payment.escrow.releaseDate)} />
                )}
              </>
            )}
          </VStack>
        </Box>
      ))}
    </VStack>
  );
}

type Props = {
  items: IRentRequest[];
  mode: "tenant" | "landlord";
  onEdit: (request: IRentRequest) => void;
  /** Escalated to the parent so the reason-bearing DecisionDialog can be owned by the list. */
  onDecide: (action: { type: "approve" | "reject"; request: IRentRequest }) => void;
};

export function RentRequestTable({ items, mode, onEdit, onDecide }: Props) {
  const { mutate: cancel, isPending: isCancelling } = useCancelRentRequest();
  const { mutate: releaseEscrow, isPending: isReleasing } = useReleaseEscrow();
  const { mutate: downloadLease, isPending: isDownloadingLease } = useDownloadLeaseAgreement();

  // `escrowId` is captured when the action is opened: release targets the
  // payment whose escrow is still PENDING, not merely the first payment.
  const [action, setAction] = useState<{
    type: "cancel" | "release";
    request: IRentRequest;
    escrowId?: string;
  } | null>(null);

  const isBusy = isCancelling || isReleasing;

  const confirmAction = () => {    if (!action) return;
    const options = { onSuccess: () => setAction(null) };
    if (action.type === "cancel") cancel(action.request.id, options);
    if (action.type === "release" && action.escrowId) releaseEscrow(action.escrowId, options);
  };

  const pendingEscrow = (request: IRentRequest) =>
    request.payments.find((payment) => payment.escrow?.status === "PENDING")?.id;

  return (
    <>
      <Box overflowX="auto">
        <Table.Root size="sm" variant="outline" showColumnBorder>
          <Table.Header>
            <Table.Row bg="bg.subtle" _dark={{ bg: "whiteAlpha.50" }}>
              <Table.ColumnHeader {...columnHeaderProps}>
                {mode === "landlord" ? "Tenant" : "Property"}
              </Table.ColumnHeader>
              <Table.ColumnHeader {...columnHeaderProps}>Lease</Table.ColumnHeader>
              <Table.ColumnHeader {...columnHeaderProps}>Total</Table.ColumnHeader>
              <Table.ColumnHeader {...columnHeaderProps}>Deposit</Table.ColumnHeader>
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
              const escrowId = pendingEscrow(item);
              const party = mode === "landlord" ? item.user : item.landlord;

              return (
                <Table.Row
                  key={item.id}
                  transition="background 0.15s"
                  _hover={{ bg: "bg.subtle", _dark: { bg: "whiteAlpha.50" } }}
                >
                  <Table.Cell>
                    {mode === "landlord" ? (
                      <HStack gap={2}>
                        <Avatar.Root size="xs">
                          <Avatar.Fallback name={party?.username} />
                          {party?.profilePicture && (
                            <Avatar.Image
                              src={`${import.meta.env.VITE_FILE_URL}/profile-images/${party.profilePicture}`}
                            />
                          )}
                        </Avatar.Root>
                        <Box minW={0}>
                          <Text fontWeight="medium" fontSize="sm" lineClamp={1}>
                            {party?.username}
                          </Text>
                          <Text fontSize="xs" color="fg.muted" lineClamp={1} maxW="160px">
                            {party?.email}
                          </Text>
                        </Box>
                      </HStack>
                    ) : (
                      <Box minW={0}>
                        <Text fontWeight="medium" fontSize="sm" lineClamp={1}>
                          {item.property.title}
                        </Text>
                        <Text fontSize="xs" color="fg.muted" lineClamp={1} maxW="160px">
                          {item.property.locationAddress ?? item.landlord?.username}
                        </Text>
                      </Box>
                    )}
                  </Table.Cell>

                  <Table.Cell>
                    <Text fontSize="sm">{item.durationMonths} mo</Text>
                    <Text fontSize="xs" color="fg.muted">
                      {formateDate(item.startDate)}
                    </Text>
                  </Table.Cell>

                  <Table.Cell>
                    <Text fontWeight="semibold" fontSize="sm" color="blue.600" _dark={{ color: "blue.300" }}>
                      {formatCurrency(item.amount)}
                    </Text>
                  </Table.Cell>

                  <Table.Cell>
                    <Text fontSize="sm">{formatCurrency(item.depositAmount)}</Text>
                    {item.payments[0]?.escrow && (
                      <Badge
                        variant="subtle"
                        colorPalette={escrowStatusMeta[item.payments[0].escrow!.status].colorPalette}
                        borderRadius="full"
                        size="sm"
                        mt={1}
                      >
                        {escrowStatusMeta[item.payments[0].escrow!.status].label}
                      </Badge>
                    )}
                  </Table.Cell>

                  <Table.Cell>
                    <Text fontSize="sm" color="fg.muted">
                      {formateDate(item.createdAt)}
                    </Text>
                  </Table.Cell>

                  <Table.Cell>
                    <Badge
                      variant="subtle"
                      colorPalette={rentRequestStatusMeta[item.status].colorPalette}
                      borderRadius="full"
                      size="sm"
                      px={3}
                    >
                      {rentRequestStatusMeta[item.status].label}
                    </Badge>
                  </Table.Cell>

                  <Table.Cell>
                    <HStack gap={1} justify="center">
                      {/* View details */}
                      <Dialog.Root placement="center" size="md">
                        <Dialog.Trigger asChild>
                          <IconButton
                            {...iconButtonProps("blue.500", "blue.50")}
                            aria-label="View rent request details"
                          >
                            <FiEye />
                          </IconButton>
                        </Dialog.Trigger>
                        <Portal>
                          <Dialog.Backdrop />
                          <Dialog.Positioner>
                            <Dialog.Content borderRadius="xl">
                              <Dialog.Header>
                                <Dialog.Title>Rent Request</Dialog.Title>
                              </Dialog.Header>
                              <Dialog.Body>
                                <RequestDetails
                                  request={item}
                                  mode={mode}
                                  onDownloadLease={(target) => downloadLease(target.id)}
                                  isDownloading={isDownloadingLease}
                                />
                              </Dialog.Body>
                              <Dialog.CloseTrigger asChild>
                                <CloseButton size="sm" />
                              </Dialog.CloseTrigger>
                            </Dialog.Content>
                          </Dialog.Positioner>
                        </Portal>
                      </Dialog.Root>

                      {mode === "tenant" && isPendingRequest && (
                        <>
                          <Tooltip content="Edit request">
                            <IconButton
                              {...iconButtonProps("orange.500", "orange.50")}
                              aria-label="Edit rent request"
                              disabled={isBusy}
                              onClick={() => onEdit(item)}
                            >
                              <FiEdit />
                            </IconButton>
                          </Tooltip>

                          <Tooltip content="Withdraw request">
                            <IconButton
                              {...iconButtonProps("red.500", "red.50")}
                              aria-label="Cancel rent request"
                              disabled={isBusy}
                              onClick={() => setAction({ type: "cancel", request: item })}
                            >
                              <LuRotateCcw />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}

                      {mode === "landlord" && isPendingRequest && (
                        <>
                          <Tooltip content="Approve and take deposit into escrow">
                            <IconButton
                              {...iconButtonProps("green.500", "green.50")}
                              aria-label="Approve rent request"
                              disabled={isBusy}
                              onClick={() => onDecide({ type: "approve", request: item })}
                            >
                              <FiCheck />
                            </IconButton>
                          </Tooltip>

                          <Tooltip content="Reject request">
                            <IconButton
                              {...iconButtonProps("red.500", "red.50")}
                              aria-label="Reject rent request"
                              disabled={isBusy}
                              onClick={() => onDecide({ type: "reject", request: item })}
                            >
                              <FiX />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}

                      {item.status === "APPROVED" && (
                        <Tooltip content="Download lease agreement">
                          <IconButton
                            {...iconButtonProps("blue.500", "blue.50")}
                            aria-label="Download lease agreement"
                            disabled={isBusy || isDownloadingLease}
                            onClick={() => downloadLease(item.id)}
                          >
                            <LuFileDown />
                          </IconButton>
                        </Tooltip>
                      )}

                      {mode === "landlord" && item.status === "APPROVED" && escrowId && (
                        <Tooltip content="Release the deposit to your wallet">
                          <IconButton
                            {...iconButtonProps("green.500", "green.50")}
                            aria-label="Release escrow to wallet"
                            disabled={isBusy}
                            onClick={() => setAction({ type: "release", request: item, escrowId })}
                          >
                            <LuLock />
                          </IconButton>
                        </Tooltip>
                      )}
                    </HStack>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </Box>

      {/* ─── Shared confirmation for cancel / release / refund ─── */}
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
                  {action?.type === "cancel" ? "Withdraw rent request" : "Release deposit"}
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                {action && (
                  <Text color="fg.muted">
                    {action.type === "cancel" ? (
                      <>
                        This withdraws your request for{" "}
                        <Text as="span" fontWeight="semibold" color="fg">
                          {action.request.property.title}
                        </Text>
                        . You can apply again later, but the landlord will no longer see it as
                        pending.
                      </>
                    ) : (
                      <>
                        This pays{" "}
                        <Text as="span" fontWeight="semibold" color="fg">
                          {formatCurrency(
                            action.request.payments.find((p) => p.id === action.escrowId)
                              ?.landlordAmount ?? 0,
                          )}
                        </Text>{" "}
                        from escrow into your wallet and marks the property as rented. It cannot be
                        undone.
                      </>
                    )}
                  </Text>
                )}
              </Dialog.Body>
              <Dialog.Footer gap={3}>
                <Button variant="outline" borderRadius="lg" onClick={() => setAction(null)} disabled={isBusy}>
                  Cancel
                </Button>
                <Button
                  colorPalette={action?.type === "cancel" ? "red" : "green"}
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