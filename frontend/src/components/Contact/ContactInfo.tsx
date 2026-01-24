/* eslint-disable @typescript-eslint/no-explicit-any */
import { Flex, HStack, VStack, Text, Icon } from "@chakra-ui/react";

export const ContactInfo = ({ icon, title, detail }: Record<"icon" | "title" | "detail", any>) => (
  <HStack gap={4} align="flex-start">
    <Flex
      w={12}
      h={12}
      bg="blue.50"
      color="blue.600"
      borderRadius="lg"
      align="center"
      justify="center"
      flexShrink={0}
    >
      <Icon as={icon} boxSize={5} />
    </Flex>
    <VStack align="flex-start" gap={0}>
      <Text fontWeight="bold" color={{ base: "gray.800", _dark: "gray.400" }}>{title}</Text>
      <Text color="gray.600">{detail}</Text>
    </VStack>
  </HStack>
);