import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Stack,
  Button,
  HStack,
  Stat,
  Image,
  For,
  Input,
  IconButton,
} from "@chakra-ui/react";
import heroImageSrc from "@/assets/hero.jpg";
import { LuSearch } from "react-icons/lu";

const stats = [
  { label: "Properties", value: "1.2k+" },
  { label: "Customers", value: "2.5k+" },
  { label: "Awards", value: "100+" },
];

export function HeroSection() {
  return (
    <>
      <Box
        bg="bg.info"
        px={{ base: "4", md: "8" }}
        py={{ base: "12", md: "20" }}
      >
        <SimpleGrid
          alignItems="center"
          mx="auto"
          maxW="7xl"
          columns={{ base: 1, md: 2 }}
          gap={{ base: "12", md: "20" }}
        >
          {/* Left Side */}
          <Stack gap="8">
            <Stack gap="2">
              <Heading size="5xl" lineHeight="tight">
                Find A House That <br />
                <Text as="span" color="blue.600">
                  Suits Your Lifestyle
                </Text>
              </Heading>
              <Text fontSize="lg" color="fg.muted" maxW="lg">
                We help you navigate the journey of finding a home that matches
                your personality and needs, hassle-free.
              </Text>
            </Stack>

            <Button size="xl" w="fit-content" colorPalette="blue" px="10">
              Get Started
            </Button>

            <HStack gap="8" pt="4">
              <For each={stats}>
                {(stat, i) => (
                  <Stat.Root key={i} border="none">
                    <Stat.ValueText fontSize="2xl" fontWeight="bold">
                      {stat.value}
                    </Stat.ValueText>
                    <Stat.Label color="fg.subtle">{stat.label}</Stat.Label>
                  </Stat.Root>
                )}
              </For>
            </HStack>
          </Stack>

          {/* Right Side */}
          <Box position="relative">
            <Box
              position="absolute"
              top="-4"
              right="-4"
              bg="blue.100"
              w="full"
              h="full"
              rounded="2xl"
              zIndex="0"
            />
            <Image
              src={heroImageSrc}
              alt="Modern House"
              aspectRatio={4 / 3}
              borderRadius="2xl"
              shadow="2xl"
              position="relative"
              zIndex="1"
              objectFit="cover"
            />
          </Box>
        </SimpleGrid>
      </Box>

      {/* Search box container */}
      <Box
        px={{ base: "6", md: "4" }}
        mt={{ base: "-7", md: "-10" }}
        zIndex="docked"
      >
        <Box
          mx="auto"
          maxW={{ base: "full", md: "2xl" }}
          position="relative"
        >
          <Input
            placeholder="Search properties here"
            size="lg"
            h={{ base: "14", md: "16" }}
            pl="12"
            pr="14"
            bg="bg.panel"
            shadow="2xl"
            borderRadius="2xl"
            borderWidth="1px"
            borderColor="border.emphasized"
            fontSize="md"
            _focus={{
              borderColor: "blue.500",
              ring: "4px",
              ringColor: "blue.500/10",
            }}
          />

          {/* Left Side: Decorative Icon */}
          <Box
            position="absolute"
            left="4"
            top="50%"
            transform="translateY(-50%)"
            color="fg.muted"
            pointerEvents="none"
          >
            <LuSearch size="20" />
          </Box>

          {/* Right Side: Functional IconButton */}
          <Box
            position="absolute"
            right="2"
            top="50%"
            transform="translateY(-50%)"
          >
            <IconButton
              aria-label="Submit search"
              colorPalette="blue"
              variant="solid"
              size="md"
              h={{ base: "10", md: "12" }}
              w={{ base: "10", md: "12" }}
              borderRadius="xl"
              _hover={{ transform: "scale(1.05)" }}
              _active={{ transform: "scale(0.95)" }}
            >
              <LuSearch />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </>
  );
}
