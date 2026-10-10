import {
  Alert,
  Badge,
  Box,
  Button,
  CloseButton,
  Dialog,
  Field,
  HStack,
  Icon,
  Input,
  Link,
  Portal,
  Stack,
  Text,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { LuInfo, LuTriangleAlert } from "react-icons/lu";
import { formatCurrency } from "@/utils/format-currency";
import { getApiErrorMessage, getApiFieldErrors } from "@/utils/api-error";
import { useGetWallet } from "@/features/wallet/hooks/useGetWallet";
import { useCreateRentRequest } from "../hooks/useCreateRentRequest";
import { useUpdateRentRequest } from "../hooks/useUpdateRentRequest";
import { addMonths, rentRequestFormSchema, todayIso, type RentRequestFormValues } from "../schema";
import type { IRentRequest } from "../types";

/** Mirrors `DEPOSIT_MONTHS` in the server's rent request service. */
const DEPOSIT_MONTHS = 1;

/** Shortfall message shown when the wallet cannot cover the deposit. */
const shortfallMessage = (required: number, available: number) =>
  `Your wallet holds ${formatCurrency(available)} but the security deposit is ${formatCurrency(
    required,
  )}. Top up your wallet before applying.`;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  baseRentPrice?: number;
  leaseTermMonths?: number | null;
  /** Present in edit mode; omitted when a tenant applies from a listing. */
  request?: IRentRequest;
};

export function RentRequestDialog({
  isOpen,
  onClose,
  propertyId,
  baseRentPrice,
  leaseTermMonths,
  request,
}: Props) {
  const isEdit = Boolean(request);
  const { mutate: create, isPending: isCreating, error: createError } = useCreateRentRequest();
  const { mutate: update, isPending: isUpdating, error: updateError } = useUpdateRentRequest();
  const { wallet } = useGetWallet();

  const isPending = isCreating || isUpdating;
  const error = isEdit ? updateError : createError;

  const defaultValues = useMemo<RentRequestFormValues>(() => {
    if (request) {
      return {
        startDate: request.startDate.slice(0, 10),
        endDate: request.endDate.slice(0, 10),
        durationMonths: request.durationMonths,
        message: request.message ?? "",
      };
    }

    const startDate = todayIso();
    const months = leaseTermMonths ?? 12;
    return {
      startDate,
      endDate: addMonths(startDate, months),
      durationMonths: months,
      message: "",
    };
  }, [request, leaseTermMonths]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors },
  } = useForm<RentRequestFormValues>({
    resolver: zodResolver(rentRequestFormSchema(leaseTermMonths)) as Resolver<RentRequestFormValues>,
    mode: "onChange",
    defaultValues,
  });

  useEffect(() => {
    if (isOpen) reset(defaultValues);
  }, [isOpen, defaultValues, reset]);

  // `useWatch` rather than `watch()` so the estimate stays memo-safe.
  const durationMonths = useWatch({ control, name: "durationMonths" });
  const estimatedTotal =
    baseRentPrice && Number.isFinite(Number(durationMonths))
      ? baseRentPrice * Number(durationMonths)
      : 0;

  // The server refuses the application outright, so the button is disabled up
  // front and the shortfall is spelled out instead of surfacing as a raw 402.
  const depositRequired = (baseRentPrice ?? 0) * DEPOSIT_MONTHS;
  const walletBalance = wallet?.balance ?? null;
  const isUnderfunded =
    depositRequired > 0 && walletBalance !== null && walletBalance < depositRequired;

  const onSubmit = handleSubmit((values) => {
    const payload = {
      propertyId,
      startDate: values.startDate,
      endDate: values.endDate,
      durationMonths: Number(values.durationMonths),
      message: values.message?.trim() ? values.message.trim() : undefined,
    };

    const options = {
      onSuccess: () => onClose(),
      onError: (err: unknown) => {
        const fieldErrors = getApiFieldErrors(err);
        const fields = Object.keys(fieldErrors) as (keyof RentRequestFormValues)[];
        if (fields.length) {
          fields.forEach((field) => setError(field, { message: fieldErrors[field] }));
        }
      },
    };

    if (request) {
      update({ id: request.id, payload }, options);
    } else {
      create(payload, options);
    }
  });

  const close = () => {
    if (isPending) return;
    onClose();
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(e) => !e.open && close()}
      placement="center"
      size="sm"
      closeOnInteractOutside={!isPending}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="xl">
            <Dialog.Header>
              <Dialog.Title>{isEdit ? "Edit rent request" : "Request to rent"}</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <Stack gap={4}>
                {error && !Object.keys(getApiFieldErrors(error)).length && (
                  <Alert.Root status="error" variant="subtle" borderRadius="md">
                    <Alert.Indicator />
                    <Alert.Content>
                      <Alert.Description>
                        {getApiErrorMessage(
                          error,
                          isEdit ? "Could not update your request" : "Could not send your request",
                        )}
                      </Alert.Description>
                    </Alert.Content>
                  </Alert.Root>
                )}

                <form id="rent-request-form" onSubmit={onSubmit} noValidate>
                  <Stack gap={4}>
                    <Field.Root invalid={!!errors.startDate}>
                      <Field.Label>Move-in date</Field.Label>
                      <Input type="date" borderRadius="lg" {...register("startDate")} />
                      <Field.ErrorText>{errors.startDate?.message}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.endDate}>
                      <Field.Label>Move-out date</Field.Label>
                      <Input type="date" borderRadius="lg" {...register("endDate")} />
                      <Field.ErrorText>{errors.endDate?.message}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.durationMonths}>
                      <Field.Label>Lease length (months)</Field.Label>
                      <Input
                        type="number"
                        min={1}
                        max={120}
                        borderRadius="lg"
                        {...register("durationMonths")}
                        readOnly={Boolean(leaseTermMonths)}
                      />
                      {leaseTermMonths ? (
                        <Field.HelperText>
                          <Badge variant="subtle" colorPalette="blue" borderRadius="full" size="sm">
                            This listing only accepts a {leaseTermMonths} month lease
                          </Badge>
                        </Field.HelperText>
                      ) : null}
                      <Field.ErrorText>{errors.durationMonths?.message}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.message}>
                      <Field.Label>Message to landlord (optional)</Field.Label>
                      <Input
                        borderRadius="lg"
                        placeholder="Introduce yourself or ask a question"
                        {...register("message")}
                      />
                      <Field.ErrorText>{errors.message?.message}</Field.ErrorText>
                    </Field.Root>

                    {estimatedTotal > 0 && (
                      <HStack
                        align="flex-start"
                        gap={2}
                        px={3}
                        py={2.5}
                        borderRadius="md"
                        bg="bg.subtle"
                        color="fg.muted"
                        fontSize="xs"
                      >
                        <Icon as={LuInfo} boxSize={4} mt="1px" flexShrink={0} />
                        <Box>
                          Estimated total rent{" "}
                          <Text as="span" fontWeight="semibold" color="fg">
                            {formatCurrency(estimatedTotal)}
                          </Text>{" "}
                          plus a{" "}
                          <Text as="span" fontWeight="semibold" color="fg">
                            {formatCurrency((baseRentPrice ?? 0) * DEPOSIT_MONTHS)}
                          </Text>{" "}
                          security deposit. The deposit is taken from your wallet and held in escrow
                          only once the landlord approves. Final figures are set by the server.
                        </Box>
                      </HStack>
                    )}

                    {isUnderfunded && (
                      <HStack
                        align="flex-start"
                        gap={2}
                        px={3}
                        py={2.5}
                        borderRadius="md"
                        bg="red.subtle"
                        color="fg.muted"
                        fontSize="xs"
                      >
                        <Icon as={LuTriangleAlert} boxSize={4} mt="1px" flexShrink={0} />
                        <Text>
                          {shortfallMessage(depositRequired, walletBalance ?? 0)}{" "}
                          <Link
                            href="/tenant/wallet"
                            fontWeight="semibold"
                            color="fg"
                            textDecoration="underline"
                          >
                            Top up
                          </Link>{" "}
                          to continue.
                        </Text>
                      </HStack>
                    )}

                    {!isEdit && (
                      <HStack
                        align="flex-start"
                        gap={2}
                        px={3}
                        py={2.5}
                        borderRadius="md"
                        bg="orange.subtle"
                        color="fg.muted"
                        fontSize="xs"
                      >
                        <Icon as={LuTriangleAlert} boxSize={4} mt="1px" flexShrink={0} />
                        <Text>
                          You can only hold one live request per property. You can edit or withdraw it
                          until the landlord responds.
                        </Text>
                      </HStack>
                    )}
                  </Stack>
                </form>
              </Stack>
            </Dialog.Body>

            <Dialog.Footer gap={3}>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" borderRadius="lg" disabled={isPending}>
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button
                type="submit"
                form="rent-request-form"
                colorPalette="blue"
                borderRadius="lg"
                loading={isPending}
                loadingText="Submitting"
                disabled={isUnderfunded}
              >
                {isEdit ? "Save changes" : "Send request"}
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