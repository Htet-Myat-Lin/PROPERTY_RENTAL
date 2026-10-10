import {
    Alert,
    Button,
    Card,
    Field,
    Input,
    Stack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { useAppStore } from "@/app/store";
import { getApiErrorMessage, getApiFieldErrors } from "@/utils/api-error";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { updateProfileSchema, type UpdateProfileFormValues } from "../schema";

export function ProfileDetailsForm() {
    const user = useAppStore((s) => s.user);
    const { mutate: updateProfile, isPending, error } = useUpdateProfile();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isDirty },
    } = useForm<UpdateProfileFormValues>({
        resolver: zodResolver(updateProfileSchema) as Resolver<UpdateProfileFormValues>,
        mode: "onChange",
        defaultValues: {
            username: user?.username ?? "",
            phone: user?.phone ?? "",
        },
    });

    const onSubmit = handleSubmit((values) => {
        updateProfile(
            {
                username: values.username.trim(),
                phone: values.phone.trim(),
            },
            {
                onError: (err) => {
                    const fieldErrors = getApiFieldErrors(err);
                    const fields = Object.keys(fieldErrors) as (keyof UpdateProfileFormValues)[];
                    if (fields.length) {
                        fields.forEach((field) => setError(field, { message: fieldErrors[field] }));
                    }
                },
            }
        );
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
                    <Card.Title fontSize="sm" fontWeight="semibold">Personal information</Card.Title>
                    <Card.Description fontSize="xs">Update the details shown on your account.</Card.Description>
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
                                        {getApiErrorMessage(error, "Could not update your profile")}
                                    </Alert.Description>
                                </Alert.Content>
                            </Alert.Root>
                        )}

                        <Field.Root invalid={!!errors.username}>
                            <Field.Label>Username</Field.Label>
                            <Input
                                borderRadius="lg"
                                placeholder="Your username"
                                {...register("username")}
                            />
                            <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
                        </Field.Root>

                        <Field.Root invalid={!!errors.phone}>
                            <Field.Label>Phone number</Field.Label>
                            <Input
                                borderRadius="lg"
                                type="tel"
                                placeholder="e.g. 09123456789"
                                {...register("phone")}
                            />
                            <Field.HelperText>Optional. Reachable number for tenants or landlords.</Field.HelperText>
                            <Field.ErrorText>{errors.phone?.message}</Field.ErrorText>
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Email</Field.Label>
                            <Input borderRadius="lg" value={user?.email ?? ""} disabled color="fg.muted" />
                            <Field.HelperText>Your email is used to sign in and reset your password, so it can't be changed here.</Field.HelperText>
                        </Field.Root>

                        <Button
                            type="submit"
                            colorPalette="blue"
                            borderRadius="lg"
                            alignSelf="flex-start"
                            loading={isPending}
                            loadingText="Saving"
                            disabled={!isDirty}
                        >
                            Save changes
                        </Button>
                    </Stack>
                </form>
            </Card.Body>
        </Card.Root>
    );
}
