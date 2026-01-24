/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Heading, Text, Flex, Icon } from "@chakra-ui/react";

export const MissionCard = ({ icon, title, description }: Record<"icon" | "title" | "description", any>) => {
  return (
    <Box
      bg="bg"
      p={8}
      borderRadius="xl"
      transition="all 0.3s ease"
      _hover={{ transform: "translateY(-4px)" }}
      textAlign="center"
    >
      <Flex
        w={14}
        h={14}
        bg="blue.600"
        rounded="full"
        align="center"
        justify="center"
        mx="auto"
        mb={6}
        shadow="0 0 15px rgba(49, 130, 206, 0.4)"
      >
        <Icon as={icon} boxSize={6} color="white" />
      </Flex>
      <Heading as="h4" size="md" mb={3}>
        {title}
      </Heading>
      <Text color={{ base: "gray.700" , _dark:"gray.400" }} lineHeight="relaxed">
        {description}
      </Text>
    </Box>
  );
};