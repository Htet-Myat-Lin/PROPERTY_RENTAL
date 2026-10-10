import {
  Alert,
  Button,
  CloseButton,
  Dialog,
  Field,
  Portal,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import { formatCurrency } from "@/utils/format-currency";
import { formateDate } from "@/utils/format-date";
import { getApiErrorMessage } from "@/utils/api-error";
import { useApproveRentRequest } from "../hooks/useApproveRentRequest";
import { useRejectRentRequest } from "../hooks/useRejectRentRequest";
import type { IRentRequest } from "../types";

type Props = {
  request: IRentRequest | null;
  action: "approve" | "reject" | null;
  onClose: () => void;
  /** Names the applicant so the copy reads naturally to the landlord. */
  tenantName?: string;
};

/**
 * The reason field is reset by the parent keying this component per decision,
 * so reopening for a different request never shows a stale reason.
 */
export function DecisionDialog({ request, action, onClose, tenantName = "the tenant" }: Props) {
  const { mutate: approve, isPending: isApproving, error: approveError } = useApproveRentRequest();
  const { mutate: reject, isPending: isRejecting, error: rejectError } = useRejectRentRequest();
  const [reason, setReason] = useState("");

  const isApprove = action === "approve";
  const isPending = isApproving || isRejecting;
  const error = isApprove ? approveError : rejectError;

  if (!request || !action) return null;

  const confirm = () => {
    const options = { onSuccess: onClose };
    const trimmed = reason.trim() || undefined;

    if (isApprove) {
      approve({ id: request.id, decisionReason: trimmed }, options);
    } else {
      reject({ id: request.id, decisionReason: trimmed }, options);
    }
  };

  return (
    <Dialog.Root
      role="alertdialog"
      open
      onOpenChange={(e) => {
        if (!e.open && !isPending) onClose();
      }}
      closeOnInteractOutside={!isPending}
      placement="center"
      size="md"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="xl">
            <Dialog.Header>
              <Dialog.Title>
                {isApprove ? "Approve rent request" : "Reject rent request"}
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <Stack gap={4}>
                {error && (
                  <Alert.Root status="error" variant="subtle" borderRadius="md">
                    <Alert.Indicator />
                    <Alert.Content>
                      <Alert.Description>
                        {getApiErrorMessage(
                          error,
                          isApprove ? "Could not approve" : "Could not reject",
                        )}
                      </Alert.Description>
                    </Alert.Content>
                  </Alert.Root>
                )}

                {isApprove ? (
                  <Text color="fg.muted" fontSize="sm">
                    Approving reserves the property and debits {tenantName}&apos;s wallet by{" "}
                    <Text as="span" fontWeight="semibold" color="fg">
                      {formatCurrency(request.depositAmount)}
                    </Text>{" "}
                    as a security deposit, held in escrow until you release it.{" "}
                    <Text as="span" fontWeight="semibold" color="fg">
                      {formatCurrency(request.amount)}
                    </Text>{" "}
                    is the total rent for the lease, and{" "}
                    <Text as="span" color="fg.muted">
                      {formateDate(request.startDate)} to {formateDate(request.endDate)}
                    </Text>
                    . This cannot be undone.
                  </Text>
                ) : (
                  <Text color="fg.muted" fontSize="sm">
                    {tenantName} will see your reason on the request. This cannot be undone, though
                    they can apply again later.
                  </Text>
                )}

                <Field.Root>
                  <Field.Label>Reason {isApprove ? "(optional)" : ""}</Field.Label>
                  <Textarea
                    borderRadius="lg"
                    rows={3}
                    value={reason}
                    placeholder={
                      isApprove ? "Add a note for the tenant" : "Explain why this was declined"
                    }
                    onChange={(e) => setReason(e.target.value)}
                  />
                  {!isApprove && (
                    <Field.HelperText>
                      Shown to the tenant alongside the rejected request.
                    </Field.HelperText>
                  )}
                </Field.Root>
              </Stack>
            </Dialog.Body>

            <Dialog.Footer gap={3}>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" borderRadius="lg" disabled={isPending}>
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button
                colorPalette={isApprove ? "green" : "red"}
                borderRadius="lg"
                loading={isPending}
                loadingText={isApprove ? "Approving" : "Rejecting"}
                onClick={confirm}
              >
                {isApprove ? "Approve" : "Reject"}
              </Button>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" disabled={isPending} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}