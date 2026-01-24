import { Box, Container, Heading, Text, VStack, Image } from "@chakra-ui/react";
import aboutImage from "@/assets/about1.jpg";

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
        src={aboutImage}
        alt="Modern Corporate Office Building"
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
            Redefining Property Management
          </Heading>
          
          <Text fontSize="xl" color="blue.100">
            We bridge the gap between property owners and tenants with technology, trust, and transparency.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}