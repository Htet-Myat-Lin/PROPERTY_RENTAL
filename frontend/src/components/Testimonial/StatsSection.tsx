import { Box, Container, SimpleGrid, Stack, Text } from "@chakra-ui/react";

export function StatsSection() {
  const stats = [
    { value: "10K+", label: "Happy Tenants" },
    { value: "5K+", label: "Properties Listed" },
    { value: "4.9", label: "Average Rating" },
    { value: "25+", label: "Cities Covered" },
  ];

  return (
    <Box as="section" py={{ base: 12, md: 16 }} bg="bg.subtle">
      <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
        <SimpleGrid columns={{ base: 2, md: 4 }} gap={8}>
          {stats.map((stat) => (
            <Stack key={stat.label} align="center" textAlign="center" gap={1}>
              <Text
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="bold"
                color="blue.600"
              >
                {stat.value}
              </Text>
              <Text color="fg.muted" fontSize="sm">
                {stat.label}
              </Text>
            </Stack>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
