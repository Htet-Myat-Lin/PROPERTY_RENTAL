import { Box, Button, Container, Flex, Heading, Text } from "@chakra-ui/react";

export function CTASection() {
  return (
    <Box as="section" py={16} bg="bg.info">
      <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }} textAlign="center">
        <Box maxW="2xl" mx="auto">
          <Heading as="h2" fontSize="3xl" fontWeight="bold" mb={4}>
            Ready to write your own story?
          </Heading>

          <Text mb={8} fontSize="lg">
            Join thousands of owners and tenants who have switched to the modern
            way of renting.
          </Text>

          <Flex
            justify="center"
            gap={4}
            direction={{ base: "column", sm: "row" }}
          >
            <Button
              colorPalette="blue"
              size="lg"
              px={8}
              py={6}
              borderRadius="lg"
              fontWeight="bold"
              shadow="lg"
              transition="all 0.2s"
            >
              Find a Home
            </Button>

            <Button
              colorPalette="blue"
              variant="outline"
              size="lg"
              px={8}
              py={6}
              borderRadius="lg"
              fontWeight="bold"
              transition="all 0.2s"
            >
              List Your Property
            </Button>
          </Flex>
        </Box>
      </Container>
    </Box>
  );
}
