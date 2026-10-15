import { Box, Container, Heading, Image, Text, VStack } from "@chakra-ui/react";
import heroImage from "@/assets/team.jpg";

export function HeroSection() {
  return (
    <Box
      as="section"
      position="relative"
      h="400px"
      bg="blue.900"
      overflow="hidden"
    >
      <Image
        src={heroImage}
        alt="People sharing their rental experiences"
        position="absolute"
        inset="0"
        w="100%"
        h="100%"
        objectFit="cover"
        opacity="0.3"
        pointerEvents="none"
      />

      <Container
        position="relative"
        zIndex={1}
        maxW="7xl"
        h="100%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        px={{ base: 4, sm: 6, lg: 8 }}
      >
        <VStack gap={4} maxW="2xl">
          <Heading
            as="h1"
            fontSize={{ base: "4xl", md: "5xl" }}
            fontWeight="bold"
            color="white"
            lineHeight="shorter"
          >
            Stories From Our Community
          </Heading>

          <Text fontSize="xl" color="blue.100">
            Hear from the tenants, landlords, and families who trust us with
            their property journey.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}
