import {
  Box,
  Button,
  Card,
  For,
  SimpleGrid,
  Image,
  Text,
  Stack,
  HStack,
  VStack,
  Grid,
  Icon,
  Badge,
  IconButton,
} from "@chakra-ui/react";
import { IoLocationSharp, IoStar } from "react-icons/io5";
import { IoMdHeart } from "react-icons/io";
import propertyImg from "@/assets/hero.jpg";

export function PopularProperties() {
  return (
    <>
      <Box px={{ base: "4", md: "8" }} py={{ base: "10", md: "15" }}>
        <Stack maxW="7xl" mx="auto">
          <VStack align="flex-start" gap="1" mb="8">
            <Text
              fontWeight="bold"
              color="blue.600"
              textTransform="uppercase"
              fontSize="sm"
              letterSpacing="widest"
            >
              POPULAR
            </Text>
            <Text fontSize="3xl" fontWeight="bold">
              Our Popular Properties
            </Text>
          </VStack>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="8">
            <For each={[1, 2, 3]}>
              {(_, i) => (
                <Card.Root
                  key={i}
                  variant="elevated"
                  overflow="hidden"
                  borderRadius="2xl"
                  border="none"
                  transition="all 0.3s"
                  _hover={{ transform: "translateY(-4px)", shadow: "xl" }}
                >
                  {/* Image Section with Overlay Badge */}
                  <Box position="relative">
                    <Image
                      src={propertyImg}
                      alt="Modern Apartment"
                      h="240px"
                      w="full"
                      objectFit="cover"
                    />
                    <Badge
                      position="absolute"
                      top="4"
                      left="4"
                      colorPalette="blue"
                      variant="solid"
                      borderRadius="md"
                      px="3"
                    >
                      For Rent
                    </Badge>
                    <IconButton
                      aria-label="Like Property"
                      variant="plain"
                      size="md"
                      position="absolute"
                      top="3"
                      right="3"
                      borderRadius="full"
                      bg="white/20"
                      backdropFilter="blur(8px)"
                      color="white"
                      _hover={{
                        bg: "white/40",
                        color: "red.500",
                        transform: "scale(1.1)",
                      }}
                      _active={{ transform: "scale(0.9)" }}
                      transition="all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)" // Elastic feel
                    >
                      <IoMdHeart size="24px" />
                    </IconButton>

                    <Box
                      position="absolute"
                      bottom="4"
                      right="4"
                      bg="white"
                      px="3"
                      py="1"
                      borderRadius="lg"
                      shadow="md"
                    >
                      <Text fontWeight="bold" color="blue.600" fontSize="lg">
                        $450
                        <Text as="span" fontSize="xs" color="fg.muted">
                          /mo
                        </Text>
                      </Text>
                    </Box>
                  </Box>

                  <Card.Body gap="3" pt="5">
                    <HStack justify="space-between" align="center">
                      <Text
                        fontSize="xs"
                        fontWeight="bold"
                        color="blue.500"
                        textTransform="uppercase"
                        letterSpacing="widest"
                      >
                        Apartment
                      </Text>
                      <HStack gap="1" color="orange.400">
                        <IoStar size="14" />
                        <Text fontSize="xs" fontWeight="bold">
                          4.8
                        </Text>
                      </HStack>
                    </HStack>

                    <Card.Title
                      fontSize="xl"
                      fontWeight="bold"
                      display="flex"
                      alignItems="center"
                      gap="2"
                    >
                      <Icon color="red.500">
                        <IoLocationSharp />
                      </Icon>
                      Insein, Yangon
                    </Card.Title>

                    <Card.Description>
                      <Grid templateColumns="repeat(3, 1fr)" gap="2" pt="2">
                        <VStack align="flex-start" gap="0">
                          <Text fontSize="xs" color="fg.subtle">
                            Beds
                          </Text>
                          <Text fontWeight="semibold" fontSize="sm">
                            2 Rooms
                          </Text>
                        </VStack>
                        <VStack align="flex-start" gap="0">
                          <Text fontSize="xs" color="fg.subtle">
                            Baths
                          </Text>
                          <Text fontWeight="semibold" fontSize="sm">
                            1 Bath
                          </Text>
                        </VStack>
                        <VStack align="flex-start" gap="0">
                          <Text fontSize="xs" color="fg.subtle">
                            Area
                          </Text>
                          <Text fontWeight="semibold" fontSize="sm">
                            720 sqft
                          </Text>
                        </VStack>
                      </Grid>
                    </Card.Description>
                  </Card.Body>

                  <Card.Footer
                    borderTopWidth="1px"
                    borderColor="border.subtle"
                    py="4"
                  >
                    <Button
                      width="full"
                      variant="subtle"
                      colorPalette="blue"
                      borderRadius="xl"
                    >
                      View Details
                    </Button>
                  </Card.Footer>
                </Card.Root>
              )}
            </For>
          </SimpleGrid>
        </Stack>
      </Box>
    </>
  );
}
