import {
    Alert,
    Button,
    Card,
    Field,
    Stack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { PasswordInput } from "@/components/ui/password-input";
import { getApiErrorMessage, getApiFieldErrors } from "@/utils/api-error";
import { useChangePassword } from "../hooks/useChangePassword";
import { changePasswordSchema, type ChangePasswordFormValues } from "../schema";

export function ChangePasswordForm() {
    const { mutate: changePassword, isPending, error, reset } = useChangePassword();

    const {
        register,
        handleSubmit,
        reset: resetForm,
        setError,
        formState: { errors },
    } = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordSchema) as Resolver<ChangePasswordFormValues>,
        mode: "onChange",
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
    });

    const onSubmit = handleSubmit((values) => {
        changePassword(values, {
            onSuccess: () => {
                reset();
                resetForm();
            },
            onError: (err) => {
                const fieldErrors = getApiFieldErrors(err);
                const fields = Object.keys(fieldErrors) as (keyof ChangePasswordFormValues)[];
                if (fields.length) {
                    fields.forEach((field) => setError(field, { message: fieldErrors[field] }));
                }
            },
        });
    });

    const hasFieldError = Object.keys(getApiFieldErrors(error)).length > 0;

    return (
        <Card.Root
            width="100%"
            bg="bg.panel"
            borderWidth="1px"
            borderColor="border.muted"
            borderRadius="2xl"
            overflow="hidden"
            shadow="md"
            _dark={{ shadow: "none" }}
        >
            <Card.Header px={5} py={4} borderBottomWidth="1px" borderColor="border.muted">
                <Stack gap={0.5}>
                    <Card.Title fontSize="sm" fontWeight="semibold">Change password</Card.Title>
                    <Card.Description fontSize="xs">Use a strong password you don't reuse elsewhere.</Card.Description>
                </Stack>
            </Card.Header>

            <Card.Body px={5} py={5}>
                <form onSubmit={onSubmit} noValidate>
                    <Stack gap={4}>
                        {error && !hasFieldError && (
                            <Alert.Root status="error" variant="subtle" borderRadius="md" role="alert">
                                <Alert.Indicator />
                                <Alert.Content>
                                    <Alert.Description>
                                        {getApiErrorMessage(error, "Could not change your password")}
                                    </Alert.Description>
                                </Alert.Content>
                            </Alert.Root>
                        )}

                        <Field.Root invalid={!!errors.currentPassword}>
                            <Field.Label>Current password</Field.Label>
                            <PasswordInput
                                borderRadius="lg"
                                placeholder="Enter your current password"
                                autoComplete="current-password"
                                {...register("currentPassword")}
                            />
                            <Field.ErrorText>{errors.currentPassword?.message}</Field.ErrorText>
                        </Field.Root>

                        <Field.Root invalid={!!errors.newPassword}>
                            <Field.Label>New password</Field.Label>
                            <PasswordInput
                                borderRadius="lg"
                                placeholder="Enter your new password"
                                autoComplete="new-password"
                                {...register("newPassword")}
                            />
                            <Field.ErrorText>{errors.newPassword?.message}</Field.ErrorText>
                        </Field.Root>

                        <Field.Root invalid={!!errors.confirmNewPassword}>
                            <Field.Label>Confirm new password</Field.Label>
                            <PasswordInput
                                borderRadius="lg"
                                placeholder="Repeat your new password"
                                autoComplete="new-password"
                                {...register("confirmNewPassword")}
                            />
                            <Field.ErrorText>{errors.confirmNewPassword?.message}</Field.ErrorText>
                        </Field.Root>

                        <Button
                            type="submit"
                            colorPalette="blue"
                            borderRadius="lg"
                            alignSelf="flex-start"
                            loading={isPending}
                            loadingText="Updating"
                        >
                            Update password
                        </Button>
                    </Stack>
                </form>
            </Card.Body>
        </Card.Root>
    );
}
