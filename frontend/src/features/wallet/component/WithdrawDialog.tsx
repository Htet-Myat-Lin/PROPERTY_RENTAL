"use client";

import {
    Alert,
    Button,
    CloseButton,
    Dialog,
    Field,
    HStack,
    Icon,
    Input,
    InputGroup,
    NativeSelect,
    Portal,
    Stack,
    Text,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { LuArrowUpFromLine, LuInfo } from "react-icons/lu";
import { getApiErrorMessage, getApiFieldErrors } from "@/utils/api-error";
import { formatCurrency, WALLET_CURRENCY } from "@/utils/format-currency";
import { useWithdraw } from "../hooks/useWithdraw";
import { PAYOUT_METHODS, withdrawFormSchema, type WithdrawFormValues } from "../schema";

const QUICK_AMOUNTS = [100_000, 250_000, 500_000];

const formatPlain = (amount: number) =>
    new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(amount);

interface WithdrawDialogProps {
    isOpen: boolean;
    onClose: () => void;
    availableBalance: number;
}

export function WithdrawDialog({ isOpen, onClose, availableBalance }: WithdrawDialogProps) {
    const { mutate: withdraw, isPending, error, reset } = useWithdraw();
    const {
        register,
        handleSubmit,
        reset: resetForm,
        setValue,
        setError,
        formState: { errors },
    } = useForm<WithdrawFormValues>({
        resolver: zodResolver(withdrawFormSchema(availableBalance)) as Resolver<WithdrawFormValues>,
        mode: "onChange",
        defaultValues: { ammount: undefined, paymentMethod: "bank_account" },
    });

    const onSubmit = handleSubmit((values) => {
        withdraw(
            { ammount: Number(values.ammount), paymentMethod: values.paymentMethod },
            {
                onSuccess: () => {
                    resetForm()
                    onClose()
                },
                onError: (err) => {
                    const fieldErrors = getApiFieldErrors(err)
                    const fields = Object.keys(fieldErrors) as (keyof WithdrawFormValues)[]
                    if (fields.length) {
                        fields.forEach((field) => setError(field, { message: fieldErrors[field] }))
                    }
                },
            }
        )
    })

    const close = () => {
        reset()
        resetForm()
        onClose()
    }

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
                            <HStack gap={2}>
                                <Icon as={LuArrowUpFromLine} boxSize={5} color="red.500" />
                                <Dialog.Title>Withdraw funds</Dialog.Title>
                            </HStack>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Stack gap={4}>
                                {error && !Object.keys(getApiFieldErrors(error)).length && (
                                    <Alert.Root status="error" variant="subtle" borderRadius="md">
                                        <Alert.Indicator />
                                        <Alert.Content>
                                            <Alert.Description>
                                                {getApiErrorMessage(error, "Could not submit your withdrawal")}
                                            </Alert.Description>
                                        </Alert.Content>
                                    </Alert.Root>
                                )}

                                <form id="withdraw-form" onSubmit={onSubmit} noValidate>
                                    <Stack gap={4}>
                                        <Field.Root invalid={!!errors.ammount}>
                                            <Field.Label>Amount</Field.Label>
                                            <InputGroup
                                                startElement={
                                                    <Text color="fg.muted" fontWeight="medium">
                                                        {WALLET_CURRENCY}
                                                    </Text>
                                                }
                                            >
                                                <Input
                                                    type="number"
                                                    step="1000"
                                                    min="1"
                                                    placeholder="0"
                                                    borderRadius="lg"
                                                    {...register("ammount")}
                                                />
                                            </InputGroup>
                                            <Field.HelperText>
                                                Available: {formatCurrency(availableBalance)}
                                            </Field.HelperText>
                                            <Field.ErrorText>{errors.ammount?.message}</Field.ErrorText>
                                        </Field.Root>

                                        <HStack gap={2} wrap="wrap">
                                            {QUICK_AMOUNTS.map((amount) => (
                                                <Button
                                                    key={amount}
                                                    type="button"
                                                    size="xs"
                                                    variant="subtle"
                                                    colorPalette="red"
                                                    disabled={amount > availableBalance}
                                                    onClick={() => setValue("ammount", amount, { shouldValidate: true })}
                                                >
                                                    {formatPlain(amount)}
                                                </Button>
                                            ))}
                                            <Button
                                                type="button"
                                                size="xs"
                                                variant="subtle"
                                                colorPalette="red"
                                                disabled={availableBalance <= 0}
                                                onClick={() =>
                                                    setValue("ammount", availableBalance, { shouldValidate: true })
                                                }
                                            >
                                                Max
                                            </Button>
                                        </HStack>

                                        <Field.Root invalid={!!errors.paymentMethod}>
                                            <Field.Label>Payout method</Field.Label>
                                            <NativeSelect.Root>
                                                <NativeSelect.Field borderRadius="lg" {...register("paymentMethod")}>
                                                    {PAYOUT_METHODS.map((method) => (
                                                        <option key={method.value} value={method.value}>
                                                            {method.label}
                                                        </option>
                                                    ))}
                                                </NativeSelect.Field>
                                                <NativeSelect.Indicator />
                                            </NativeSelect.Root>
                                            <Field.ErrorText>{errors.paymentMethod?.message}</Field.ErrorText>
                                        </Field.Root>

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
                                            <Text>
                                                Payouts are reviewed before they are sent, so the balance stays available
                                                until then.
                                            </Text>
                                        </HStack>
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
                                form="withdraw-form"
                                colorPalette="red"
                                borderRadius="lg"
                                loading={isPending}
                                loadingText="Submitting"
                                disabled={availableBalance <= 0}
                            >
                                Withdraw
                            </Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" disabled={isPending} />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}
