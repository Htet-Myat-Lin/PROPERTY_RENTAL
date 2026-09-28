"use client"

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
} from "@chakra-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type Resolver } from "react-hook-form"
import { LuInfo } from "react-icons/lu"
import { useDeposit } from "../hooks/useDeposit"
import { depositFormSchema, PAYMENT_METHODS, type DepositFormValues } from "../schema"
import { getApiErrorMessage, getApiFieldErrors } from "@/utils/api-error"

const QUICK_AMOUNTS = [50_000, 100_000, 250_000, 500_000]
const CURRENCY = "MMK"

const currencySymbol = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 0,
})
    .format(0)
    .replace(/[\d.,\s]/g, "")

const formatAmount = (amount: number) =>
    new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(amount)

interface DepositDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function DepositDialog({ isOpen, onClose }: DepositDialogProps) {
    const { mutate: deposit, isPending, error, reset } = useDeposit()
    const {
        register,
        handleSubmit,
        reset: resetForm,
        setValue,
        setError,
        formState: { errors },
    } = useForm<DepositFormValues>({
        resolver: zodResolver(depositFormSchema) as Resolver<DepositFormValues>,
        mode: "onChange",
        defaultValues: { ammount: undefined, paymentMethod: "kbz_pay", transactionId: "" },
    })

    const onSubmit = handleSubmit((values) => {
        deposit(
            {
                ammount: Number(values.ammount),
                paymentMethod: values.paymentMethod,
                transactionId: values.transactionId.trim(),
            },
            {
                onSuccess: () => {
                    resetForm()
                    onClose()
                },
                onError: (err) => {
                    // Surface zod rejections on the offending field, otherwise
                    // fall back to a banner above the form.
                    const fieldErrors = getApiFieldErrors(err)
                    const fields = Object.keys(fieldErrors) as (keyof DepositFormValues)[]
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
                            <Dialog.Title>Deposit funds</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Stack gap={4}>
                                {error && !Object.keys(getApiFieldErrors(error)).length && (
                                    <Alert.Root status="error" variant="subtle" borderRadius="md">
                                        <Alert.Indicator />
                                        <Alert.Content>
                                            <Alert.Description>
                                                {getApiErrorMessage(error, "Could not submit your deposit request")}
                                            </Alert.Description>
                                        </Alert.Content>
                                    </Alert.Root>
                                )}

                                <form id="deposit-form" onSubmit={onSubmit} noValidate>
                                    <Stack gap={4}>
                                        <Field.Root invalid={!!errors.ammount}>
                                            <Field.Label>Amount</Field.Label>
                                            <InputGroup
                                                startElement={
                                                    <Text color="fg.muted" fontWeight="medium">
                                                        {currencySymbol}
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
                                            <Field.ErrorText>{errors.ammount?.message}</Field.ErrorText>
                                        </Field.Root>

                                        <HStack gap={2} wrap="wrap">
                                            {QUICK_AMOUNTS.map((amount) => (
                                                <Button
                                                    key={amount}
                                                    type="button"
                                                    size="xs"
                                                    variant="subtle"
                                                    colorPalette="blue"
                                                    onClick={() =>
                                                        setValue("ammount", amount, { shouldValidate: true })
                                                    }
                                                >
                                                    +{formatAmount(amount)}
                                                </Button>
                                            ))}
                                        </HStack>

                                        <Field.Root invalid={!!errors.paymentMethod}>
                                            <Field.Label>Payment method</Field.Label>
                                            <NativeSelect.Root>
                                                <NativeSelect.Field borderRadius="lg" {...register("paymentMethod")}>
                                                    {PAYMENT_METHODS.map((method) => (
                                                        <option key={method.value} value={method.value}>
                                                            {method.label}
                                                        </option>
                                                    ))}
                                                </NativeSelect.Field>
                                                <NativeSelect.Indicator />
                                            </NativeSelect.Root>
                                            <Field.ErrorText>{errors.paymentMethod?.message}</Field.ErrorText>
                                        </Field.Root>

                                        <Field.Root invalid={!!errors.transactionId}>
                                            <Field.Label>Transaction reference</Field.Label>
                                            <Input
                                                borderRadius="lg"
                                                placeholder="e.g. KBZ123456789"
                                                {...register("transactionId")}
                                            />
                                            <Field.HelperText>
                                                The reference from your payment receipt, so an admin can verify it.
                                            </Field.HelperText>
                                            <Field.ErrorText>{errors.transactionId?.message}</Field.ErrorText>
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
                                                Funds are credited once an admin approves this request. You can track it
                                                under pending activity.
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
                                form="deposit-form"
                                colorPalette="blue"
                                borderRadius="lg"
                                loading={isPending}
                                loadingText="Submitting"
                            >
                                Submit request
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
