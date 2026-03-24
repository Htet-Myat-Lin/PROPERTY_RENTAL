import {
  HStack,
  Stack,
  Icon,
  Text,
  SimpleGrid,
  For,
  Box,
  Separator,
  Flex,
  Badge,
} from "@chakra-ui/react";
import { SectionWrapper } from "./SectionWrapper";
import { LuCheck, LuWifi, LuBus } from "react-icons/lu";

type Props = {
  appliances: string[];
  internetName: string;
  internetSpeed: string;
  nearTransitType: string;
  nearTransitDist: number;
};

export function FeatureAndConnectivity({
  appliances,
  internetName,
  internetSpeed,
  nearTransitType,
  nearTransitDist,
}: Props) {
  return (
    <SectionWrapper title="Features & Connectivity">
      <Stack gap="5">
        {/* Appliances */}
        <Stack gap="3">
          <HStack gap="2">
            <Icon as={LuCheck} boxSize={4} color="blue.400" />
            <Text
              fontSize="xs"
              fontWeight="bold"
              textTransform="uppercase"
              letterSpacing="widest"
              color="fg.muted"
            >
              Appliances
            </Text>
          </HStack>
          <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} gap="2">
            <For each={appliances}>
              {(el) => (
                <HStack
                  gap="2.5"
                  px="3"
                  py="2"
                  borderWidth="1px"
                  borderRadius="xl"
                  bg="bg.subtle"
                  _hover={{
                    borderColor: "blue.200",
                    bg: "blue.50",
                    _dark: { bg: "blue.950" },
                  }}
                  transition="all 0.15s"
                >
                  <Box
                    w="2"
                    h="2"
                    borderRadius="full"
                    bg="blue.400"
                    flexShrink={0}
                  />
                  <Text fontSize="sm" fontWeight="medium">
                    {el.toString()}
                  </Text>
                </HStack>
              )}
            </For>
          </SimpleGrid>
        </Stack>

        <Separator />

        {/* Internet + Transit */}
        <SimpleGrid columns={{ base: 1, sm: 2 }} gap="3">
          {/* Internet */}
          <HStack
            gap="3"
            p="3.5"
            borderWidth="1px"
            borderRadius="xl"
            bg="bg.subtle"
          >
            <Flex
              w="9"
              h="9"
              borderRadius="lg"
              bg="blue.50"
              _dark={{ bg: "blue.950" }}
              align="center"
              justify="center"
              flexShrink={0}
            >
              <Icon as={LuWifi} boxSize={4} color="blue.500" />
            </Flex>
            <Stack gap="0.5">
              <Text
                fontSize="xs"
                fontWeight="bold"
                textTransform="uppercase"
                letterSpacing="widest"
                color="fg.muted"
              >
                Internet
              </Text>
              <HStack gap="2">
                <Text fontSize="sm" fontWeight="semibold">
                  {internetName}
                </Text>
                <Badge
                  colorPalette="blue"
                  variant="subtle"
                  size="sm"
                  borderRadius="full"
                >
                  {internetSpeed}
                </Badge>
              </HStack>
            </Stack>
          </HStack>

          {/* Transit */}
          <HStack
            gap="3"
            p="3.5"
            borderWidth="1px"
            borderRadius="xl"
            bg="bg.subtle"
          >
            <Flex
              w="9"
              h="9"
              borderRadius="lg"
              bg="green.50"
              _dark={{ bg: "green.950" }}
              align="center"
              justify="center"
              flexShrink={0}
            >
              <Icon as={LuBus} boxSize={4} color="green.500" />
            </Flex>
            <Stack gap="0.5">
              <Text
                fontSize="xs"
                fontWeight="bold"
                textTransform="uppercase"
                letterSpacing="widest"
                color="fg.muted"
              >
                Transit
              </Text>
              <HStack gap="2">
                <Text fontSize="sm" fontWeight="semibold">
                  {nearTransitType}
                </Text>
                <Badge
                  colorPalette="green"
                  variant="subtle"
                  size="sm"
                  borderRadius="full"
                >
                  {nearTransitDist} mi
                </Badge>
              </HStack>
            </Stack>
          </HStack>
        </SimpleGrid>
      </Stack>
    </SectionWrapper>
  );
}
