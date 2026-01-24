import {
  Button,
  Center,
  Field,
  Link,
  PinInput,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useResetPassword } from "../hooks/useResetPassword";
import { useSendResetPasswordOTP } from "../hooks/useSendPasswordResetOTP";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from "react-toastify";

export function ResetPasswordForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(0);
  const email = location?.state?.email;

  const { mutate, isPending, error, isSuccess } = useResetPassword();
  const { mutate: resendOTP, isPending: isResending } =
    useSendResetPasswordOTP();

  const {
    handleSubmit,
    setValue,
    formState: { errors },
    register,
  } = useForm({
    defaultValues: {
      otp: "",
      email,
      newPassword: "",
      confirmNewPassword: "",
    },
    shouldFocusError: false,
  });

  setValue("otp", otp.join(""));

  const handleResetPassword = (
    payload: Record<
      "otp" | "email" | "newPassword" | "confirmNewPassword",
      string
    >,
  ) => {
    mutate(payload);
  };

  const handleResendOTP = () => {
    resendOTP(email, {
      onSuccess: () => {
        toast.success("OTP was sended to your email");
        setCountdown(60);
      },
    });
  };

  useEffect(() => {
    if (!email) navigate("/");
  }, [email, navigate]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Your password was reseted successfully");
      navigate("/");
    }
  }, [navigate, isSuccess]);

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
        onSubmit={handleSubmit(handleResetPassword)}
      >
        <Stack>
          <Text textAlign="center" fontSize="lg" fontWeight="semibold">
            Reset Password
          </Text>
          <Text fontSize="sm" textAlign="center">
            We've sent OTP to{" "}
            <Text display="inline" color="blue.600" textDecor="underline">
              {email}
            </Text>
            {". "}Enter the code below to continue.
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

        <PinInput.Root
          colorPalette="blue"
          placeholder=""
          size="lg"
          value={otp}
          onValueChange={(e) => setOtp(e.value)}
        >
          <PinInput.HiddenInput />
          <PinInput.Control>
            <PinInput.Input index={0} />
            <PinInput.Input index={1} />
            <PinInput.Input index={2} />
            <PinInput.Input index={3} />
            <PinInput.Input index={4} />
            <PinInput.Input index={5} />
          </PinInput.Control>
        </PinInput.Root>

        <Text fontSize="sm" textAlign="center">
          Didn't get a code?{" "}
          <Link onClick={handleResendOTP} color="blue.600">
            <button disabled={isResending}>
              {isResending
                ? "Resending"
                : countdown > 0
                  ? `Resend in ${countdown}s`
                  : "Click to resend"}
            </button>
          </Link>
        </Text>

        <hr />

        <Field.Root invalid={!!errors.newPassword}>
          <Field.Label>New Password</Field.Label>
          <PasswordInput
            placeholder="New Password"
            colorPalette="blue"
            {...register("newPassword", {
              required: "New Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          <Field.ErrorText>{errors.newPassword?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.confirmNewPassword}>
          <Field.Label>Confirm New Password</Field.Label>
          <PasswordInput
            placeholder="Confirm New Password"
            colorPalette="blue"
            {...register("confirmNewPassword", {
              required: "Confirm-Password is required",
              validate: (value, formValues) => {
                return (
                  value === formValues.newPassword || "Passwords do not match"
                );
              },
            })}
          />
          <Field.ErrorText>
            {errors.confirmNewPassword?.message}
          </Field.ErrorText>
        </Field.Root>

        <Button type="submit" disabled={isPending} colorPalette="blue">
          {isPending ? <Spinner /> : "Reset Password"}
        </Button>
      </Stack>
    </Center>
  );
}
