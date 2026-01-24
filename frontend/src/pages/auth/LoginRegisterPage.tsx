import { Header } from "@/components/Header/Header";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { Box, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";

export function LoginRegisterPage() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const toggleMode = () => setIsRegisterMode((prev) => !prev);

  const blueGradient = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

  return (
    <>
      <Header />
      <Box
        p={{ base: 4, md: 8 }}
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="bg.info"
      >
        <Box
          maxW="6xl"
          w="full"
          shadow="2xl"
          borderRadius="3xl"
          overflow="hidden"
        >
          <SimpleGrid columns={{ base: 1, md: 2 }}>
            {/* --- Left Panel --- */}
            <Box
              p={{ base: 10, md: 16 }}
              bg={!isRegisterMode ? "bg.muted" : blueGradient}
              color="light"
              display="flex"
              alignItems="center"
              justifyContent="center"
              transition="background 0.5s ease"
            >
              {isRegisterMode ? (
                <Stack gap="4" maxW="sm" display={{ base: "none", md: "flex" }}>
                  <Heading size="3xl" letterSpacing="tight">
                    Hello, Friend!
                  </Heading>
                  <Text fontSize="lg" fontWeight="medium" opacity="0.8">
                    Enter your personal details and start your journey with us.
                  </Text>
                </Stack>
              ) : (
                <LoginForm onToggleMode={toggleMode} />
              )}
            </Box>

            {/* --- Right Panel --- */}
            <Box
              p={{ base: 10, md: 16 }}
              bg={isRegisterMode ? "bg.muted" : blueGradient}
              color="light"
              display="flex"
              alignItems="center"
              justifyContent="center"
              transition="background 0.5s ease"
            >
              {isRegisterMode ? (
                <RegisterForm onToggleMode={toggleMode} />
              ) : (
                <Stack display={{ base: "none", md: "flex" }} gap="4" maxW="sm" textAlign="right" alignItems="flex-end">
                  <Heading size="3xl" letterSpacing="tight">
                    Welcome Back!
                  </Heading>
                  <Text fontSize="lg" fontWeight="medium" opacity="0.8">
                    To keep connected with us please login with your personal info.
                  </Text>
                </Stack>
              )}
            </Box>
          </SimpleGrid>
        </Box>
      </Box>
    </>
  );
}
