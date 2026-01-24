import { Box, Heading, Text, Image, Stack } from "@chakra-ui/react";

export const TeamCard = ({ image, name, role, description } : Record<"image" | "name" | "role" | "description", string>) => {
  return (
    <Box
      bg="white"
      borderRadius="xl"
      shadow="lg"
      overflow="hidden"
      role="group" // Equivalent to Tailwind 'group'
    >
      <Box h="64" overflow="hidden">
        <Image
          src={image}
          alt={name}
          w="full"
          h="full"
          objectFit="cover"
          transition="transform 0.5s ease"
          _groupHover={{ transform: "scale(1.1)" }} // Equivalent to group-hover:scale-110
        />
      </Box>
      <Stack p={6} textAlign="center" gap={1}>
        <Heading as="h3" size="md" color="gray.900">
          {name}
        </Heading>
        <Text color="blue.600" fontWeight="medium" mb={2}>
          {role}
        </Text>
        <Text color="gray.500" fontSize="sm">
          {description}
        </Text>
      </Stack>
    </Box>
  );
};