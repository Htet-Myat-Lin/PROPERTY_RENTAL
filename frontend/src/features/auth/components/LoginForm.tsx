import { PasswordInput } from "@/components/ui/password-input";
import {
  Link,
  VStack,
  Text,
  Button,
  Field,
  Input,
  Stack,
  HStack,
  Icon,
  Spinner,
} from "@chakra-ui/react";
import { FaHouseDamage } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useLogin } from "../hooks/useLogin";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

export const LoginForm = ({ onToggleMode }: { onToggleMode: () => void }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    shouldFocusError: false,
  });

  const { mutate, error, isPending, isSuccess } = useLogin();
  const handleLogin = (payload: { email: string; password: string }) =>
    mutate(payload);

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Login successful.");
      navigate("/");
    }
  }, [isSuccess, navigate]);

  return (
    <VStack
      gap="8"
      align="stretch"
      w="full"
      as="form"
      onSubmit={handleSubmit(handleLogin)}
    >
      <HStack gap="1" justify="center">
        <Icon size="lg" color="blue.600">
          <FaHouseDamage />
        </Icon>
        <Text fontWeight="bold" fontSize="lg">
          Rentify
        </Text>
      </HStack>
      <Stack>
        <Text
          fontSize="sm"
          color="blue.600"
          textAlign="center"
          letterSpacing="widest"
          fontWeight="bold"
        >
          WELCOME BACK
        </Text>
        <Text
          fontSize={{ base: "xl", md: "3xl" }}
          fontWeight="bold"
          textAlign="center"
        >
          Log in to your Account
        </Text>
      </Stack>
      <VStack gap="4">
        {/* Api Response Error */}
        {error && (
          <Text alignSelf="flex-start" fontSize="xs" color="red.500">
            {axios.isAxiosError(error)
              ? error?.response?.data?.message
              : "Internal Server Error"}
          </Text>
        )}

        {/* Email */}
        <Field.Root invalid={!!errors.email}>
          <Field.Label>Email</Field.Label>
          <Input
            variant="flushed"
            placeholder="Enter Your Email Address"
            colorPalette="blue"
            {...register("email", { required: "Email is required" })}
          />
          <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
        </Field.Root>

        {/* Password */}
        <Field.Root invalid={!!errors.password}>
          <Field.Label>Password</Field.Label>
          <PasswordInput
            variant="flushed"
            placeholder="Enter Your Password"
            colorPalette="blue"
            {...register("password", { required: "Password is required" })}
          />
          <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
        </Field.Root>
        <Text
          fontSize="sm"
          color="blue.500"
          alignSelf="flex-end"
          cursor="pointer"
          _hover={{ textDecoration: "underline" }}
          onClick={() => navigate("/forgot-password")}
        >
          Forgot password?
        </Text>
      </VStack>

      <Button
        type="submit"
        size="lg"
        colorPalette="blue"
        borderRadius="lg"
        w="full"
        shadow="md"
        disabled={isPending}
      >
        {isPending ? <Spinner size="sm" /> : "Login"}
      </Button>

      <Text fontSize="sm" color="gray.500" textAlign="center">
        Don't have an account?
        <Link
          color="blue.500"
          _hover={{ textDecor: "underline" }}
          ml="1"
          onClick={onToggleMode}
        >
          Create an account
        </Link>
      </Text>
    </VStack>
  );
};
