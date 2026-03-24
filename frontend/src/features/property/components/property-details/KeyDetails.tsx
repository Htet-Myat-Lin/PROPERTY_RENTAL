import { SimpleGrid, For, Stack, HStack, Flex, Text, Icon } from "@chakra-ui/react";
import { SectionWrapper } from "./SectionWrapper";
import type { ElementType } from "react";

type Details = {
    label: string;
    icon: ElementType;
    value: string | number;
    unit?: string;
}

type Props = {
    keyDetails: Details[]
}

export function KeyDetails({ keyDetails } : Props) {
  return (
    <SectionWrapper title="Key Details">
      <SimpleGrid columns={{ base: 2, sm: 3 }} gap="4">
        <For each={keyDetails}>
          {(el) => (
            <HStack
              key={el.label}
              gap="3"
              p="3"
              borderWidth="1px"
              borderRadius="xl"
              bg="bg.subtle"
              align="flex-start"
            >
              <Flex
                w="8"
                h="8"
                borderRadius="lg"
                bg="blue.50"
                _dark={{ bg: "blue.900" }}
                align="center"
                justify="center"
                flexShrink={0}
              >
                <Icon as={el.icon} boxSize={4} color="blue.500" />
              </Flex>
              <Stack gap="0.5">
                <Text fontSize="xs" color="fg.muted" fontWeight="medium">
                  {el.label}
                </Text>
                <Text fontSize="sm" fontWeight="semibold">
                  {el.value}
                  {el.unit && (
                    <Text
                      as="span"
                      fontSize="xs"
                      color="fg.muted"
                      fontWeight="normal"
                      ml="1"
                    >
                      {el.unit}
                    </Text>
                  )}
                </Text>
              </Stack>
            </HStack>
          )}
        </For>
      </SimpleGrid>
    </SectionWrapper>
  );
}
