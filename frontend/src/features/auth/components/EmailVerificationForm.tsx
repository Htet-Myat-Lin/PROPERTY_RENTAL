import {
  Button,
  Center,
  Icon,
  Link,
  PinInput,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { MdMarkEmailRead } from "react-icons/md";
import { useVerifyEmail } from "../hooks/useVerifyEmail";
import axios from "axios";
import { useSendEmailVerifyOTP } from "../hooks/useSendVerifyEmailOtp";
import { toast } from "react-toastify";

export function EmailVerificationForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [value, setValue] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(0);
  const { mutate, isPending, error } = useVerifyEmail();
  const { mutate: resendOTP, isPending: resendingOTP } =
    useSendEmailVerifyOTP();

  const payload = {
    email,
    otp: value.join(""),
  };

  const handleResendOTP = () => {
    resendOTP(email, {
      onSuccess: () => {
        toast.success("OTP was sended to your email");
        // Set countdown to 60
        setCountdown(60);
      },
    });
  };

  const handleVerifyEmail = () => {
    mutate(payload, {
      onSuccess: () => {
        toast.success("Your email was successfully verified");
        navigate("/");
      },
    });
  };

  useEffect(() => {
    if (!email) navigate("/", { replace: true });
  }, [email, navigate]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <Center minH="95vh" bg="bg.info">
      <Stack
        maxW="sm"
        bg="bg.muted"
        shadow="2xl"
        borderRadius="2xl"
        px="8"
        py="6"
        gap="6"
      >
        <Center>
          <Icon color="blue.600" bg="bg.info" p="3" borderRadius="full">
            <MdMarkEmailRead size="60px" />
          </Icon>
        </Center>

        <Stack>
          <Text textAlign="center" fontSize="lg" fontWeight="semibold">
            Enter verification code
          </Text>
          <Text fontSize="sm">
            We've sent a code to{" "}
            <Text display="inline" textDecor="underline" color="blue.600">
              {email}
            </Text>
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
          value={value}
          onValueChange={(e) => setValue(e.value)}
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
            <button disabled={resendingOTP}>
              {resendingOTP
                ? "Resending"
                : countdown > 0
                  ? `Resend in ${countdown}s`
                  : "Click to resend"}
            </button>
          </Link>
        </Text>

        <Button
          disabled={isPending}
          onClick={handleVerifyEmail}
          colorPalette="blue"
        >
          {isPending ? <Spinner /> : "Verify Email"}
        </Button>
      </Stack>
    </Center>
  );
}
