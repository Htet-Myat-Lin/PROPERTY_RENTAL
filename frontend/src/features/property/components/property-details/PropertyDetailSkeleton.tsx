import {
  Box,
  Flex,
  Skeleton,
  Stack,
  HStack,
  SimpleGrid,
  GridItem,
  SkeletonText,
} from "@chakra-ui/react";

export function PropertyDetailSkeleton() {
  return (
    <Box
      bg={{ base: "gray.50", _dark: "gray.950" }}
      minH="100vh"
      px={{ base: "3", sm: "5", lg: "8" }}
      py={{ base: "4", sm: "6" }}
    >
      <Stack gap="5" maxW="7xl" mx="auto">
        {/* Breadcrumb */}
        <Skeleton h="4" w="48" borderRadius="full" />

        {/* Hero header card */}
        <Box
          borderWidth="1px"
          borderRadius="2xl"
          p="6"
          bg="white"
          _dark={{ bg: "gray.900" }}
          shadow="sm"
        >
          <Flex justify="space-between" align="flex-start" gap="4">
            <Stack gap="3" flex="1">
              <HStack gap="2">
                <Skeleton h="6" w="16" borderRadius="full" />
                <Skeleton h="6" w="20" borderRadius="full" />
              </HStack>
              <Skeleton h="9" w="72" borderRadius="lg" />
              <HStack gap="4">
                <Skeleton h="4" w="32" borderRadius="full" />
                <Skeleton h="4" w="28" borderRadius="full" />
              </HStack>
            </Stack>
            <Stack align="flex-end" gap="3">
              <Skeleton h="8" w="36" borderRadius="lg" />
              <HStack gap="2">
                <Skeleton h="8" w="8" borderRadius="xl" />
                <Skeleton h="8" w="8" borderRadius="xl" />
              </HStack>
            </Stack>
          </Flex>
        </Box>

        {/* Carousel */}
        <Box
          borderWidth="1px"
          borderRadius="2xl"
          overflow="hidden"
          bg="white"
          _dark={{ bg: "gray.900" }}
          shadow="sm"
        >
          <Skeleton h={{ base: "52", sm: "72", md: "96" }} borderRadius="0" />
          <Box borderTopWidth="1px" p="3">
            <HStack gap="2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton
                  key={i}
                  w="20"
                  h="14"
                  borderRadius="lg"
                  flexShrink={0}
                />
              ))}
            </HStack>
          </Box>
        </Box>

        {/* Content grid */}
        <SimpleGrid
          columns={{ base: 1, lg: 3 }}
          gap="5"
          alignItems="flex-start"
        >
          <GridItem colSpan={{ base: 1, lg: 2 }}>
            <Stack gap="5">
              {/* Description */}
              <Box
                borderWidth="1px"
                borderRadius="2xl"
                p="5"
                bg="white"
                _dark={{ bg: "gray.900" }}
                shadow="sm"
              >
                <Skeleton h="5" w="32" borderRadius="md" mb="4" />
                <SkeletonText noOfLines={5} gap="2" />
              </Box>

              {/* Key details */}
              <Box
                borderWidth="1px"
                borderRadius="2xl"
                p="5"
                bg="white"
                _dark={{ bg: "gray.900" }}
                shadow="sm"
              >
                <Skeleton h="5" w="28" borderRadius="md" mb="4" />
                <SimpleGrid columns={{ base: 2, sm: 3 }} gap="3">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <Skeleton key={i} h="16" borderRadius="xl" />
                  ))}
                </SimpleGrid>
              </Box>

              {/* Features */}
              <Box
                borderWidth="1px"
                borderRadius="2xl"
                p="5"
                bg="white"
                _dark={{ bg: "gray.900" }}
                shadow="sm"
              >
                <Skeleton h="5" w="44" borderRadius="md" mb="4" />
                <SimpleGrid columns={{ base: 2, sm: 3 }} gap="2" mb="5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} h="10" borderRadius="xl" />
                  ))}
                </SimpleGrid>
                <SimpleGrid columns={{ base: 1, sm: 2 }} gap="3">
                  <Skeleton h="16" borderRadius="xl" />
                  <Skeleton h="16" borderRadius="xl" />
                </SimpleGrid>
              </Box>
            </Stack>
          </GridItem>

          {/* Landlord card */}
          <GridItem colSpan={1}>
            <Box
              borderWidth="1px"
              borderRadius="2xl"
              p="5"
              bg="white"
              _dark={{ bg: "gray.900" }}
              shadow="sm"
            >
              <Stack gap="4">
                <Skeleton h="3" w="16" borderRadius="full" />
                <HStack gap="3">
                  <Skeleton w="12" h="12" borderRadius="full" flexShrink={0} />
                  <Stack gap="1.5" flex="1">
                    <Skeleton h="4" w="24" borderRadius="md" />
                    <Skeleton h="5" w="32" borderRadius="full" />
                  </Stack>
                </HStack>
                <Skeleton h="px" />
                <Stack gap="2.5">
                  <Skeleton h="4" w="48" borderRadius="md" />
                  <Skeleton h="4" w="36" borderRadius="md" />
                </Stack>
                <Skeleton h="px" />
                <Skeleton h="20" borderRadius="xl" />
                <Skeleton h="10" borderRadius="xl" />
                <Skeleton h="10" borderRadius="xl" />
                <Skeleton h="3" w="40" borderRadius="full" mx="auto" />
              </Stack>
            </Box>
          </GridItem>
        </SimpleGrid>
      </Stack>
    </Box>
  );
}
