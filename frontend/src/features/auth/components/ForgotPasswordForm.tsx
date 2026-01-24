import { Button, Center, Field, Input, Spinner, Stack, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useForgotPassowrd } from "../hooks/useForgotPassword";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

export function ForgotPasswordForm() {
  const { handleSubmit, formState: { errors }, register, getValues } = useForm({
    defaultValues: {
        email: ""
    },
    shouldFocusError: false
  })

  const { mutate, error, isPending, isSuccess } = useForgotPassowrd()

  const handleForgotPassword = (payload: { email: string }) => {
    mutate(payload)
  }

  const navigate = useNavigate()

  useEffect(() => {
    if(isSuccess) {
        toast.success("OTP was sended to your email to reset your password");
        navigate("/reset-password", {state: { email: getValues("email") }})
    }
  }, [isSuccess, navigate, getValues])

  return (
    <Center minH="95vh" bg="bg.info">
      <Stack
        maxW="sm"
        bg="bg.muted"
        shadow="2xl"
        borderRadius="2xl"
        px="8"
        py="6"
        gap="5"
        as="form"
        onSubmit={handleSubmit(handleForgotPassword)}
      >
        <Stack>
          <Text textAlign="center" fontSize="lg" fontWeight="semibold">
            Forgot Password?
          </Text>
          <Text fontSize="sm">
            Enter your email address and we will send you OTP to reset your password.
          </Text>
        </Stack>

        {/* Api Response Error */}
        {error && (
          <Text textAlign="center" fontSize="xs" color="red.500">
            {axios.isAxiosError(error)
              ? error?.response?.data?.message
              : "Internal Server Error"}
          </Text>
        )}

        <Field.Root invalid={!!errors.email}>
            <Field.Label>Email</Field.Label>
            <Input placeholder="me@example.com" colorPalette="blue" {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })} />
            <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
        </Field.Root>

        <Button disabled={isPending} colorPalette="blue" type="submit">
            {isPending ? <Spinner /> : "Request Password Reset OTP"}
        </Button>
      </Stack>
    </Center>
  );
}
