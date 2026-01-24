import {
  Box,
  Card,
  For,
  SimpleGrid,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import { LuHouse, LuBuilding, LuHotel, LuWarehouse } from "react-icons/lu";

const propertyTypes = [
  {
    name: "Apartment",
    icon: <LuBuilding />,
    count: "120+ Properties",
    color: "blue",
  },
  {
    name: "Villa",
    icon: <LuHouse />,
    count: "80+ Properties",
    color: "orange",
  },
  {
    name: "Townhouse",
    icon: <LuHotel />,
    count: "45+ Properties",
    color: "purple",
  },
  {
    name: "Office",
    icon: <LuWarehouse />,
    count: "60+ Properties",
    color: "teal",
  },
];

export function ExplorePropertySection() {
  return (
    <Box px={{ base: "4", md: "8" }} py={{ base: "10", md: "15" }}>
      <Box maxW="7xl" mx="auto" mt="10">
        <VStack align="flex-start" mb="8" gap="1">
          <Text
            fontWeight="bold"
            color="blue.600"
            textTransform="uppercase"
            fontSize="sm"
            letterSpacing="widest"
          >
            Categories
          </Text>
          <Text fontSize="3xl" fontWeight="bold">
            Explore Property Types
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 2, md: 4 }} gap={{ base: "4", md: "6" }}>
          <For each={propertyTypes}>
            {(type, i) => (
              <Card.Root
                key={i}
                variant="subtle"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{
                  bg: "bg.panel",
                  shadow: "md",
                  transform: "translateY(-4px)",
                  borderColor: `${type.color}.500`,
                }}
                borderWidth="1px"
                borderColor="transparent"
              >
                <Card.Body py="8">
                  <VStack gap="4" textAlign="center">
                    {/* Icon Container */}
                    <Box
                      p="4"
                      borderRadius="2xl"
                      bg={`${type.color}.50`}
                      color={`${type.color}.600`}
                    >
                      <Icon fontSize="3xl">{type.icon}</Icon>
                    </Box>

                    <Box>
                      <Card.Title fontSize="lg" mb="1">
                        {type.name}
                      </Card.Title>
                      <Card.Description fontSize="xs" fontWeight="medium">
                        {type.count}
                      </Card.Description>
                    </Box>
                  </VStack>
                </Card.Body>
              </Card.Root>
            )}
          </For>
        </SimpleGrid>
      </Box>
    </Box>
  );
}
