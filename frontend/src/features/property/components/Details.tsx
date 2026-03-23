import {
  Box,
  Breadcrumb,
  HStack,
  Stack,
  Tag,
  Heading,
  Text,
  Icon,
  Flex,
  Carousel,
  IconButton,
  Image,
  SimpleGrid,
  GridItem,
  For,
  Separator,
  Badge,
  Button,
  Avatar,
  VStack,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import { Link, useParams } from "react-router";
import { Link as ChakraLink } from "@chakra-ui/react";
import { IoLocationSharp } from "react-icons/io5";
import {
  LuChevronLeft,
  LuChevronRight,
  LuBed,
  LuBath,
  LuSquare,
  LuCar,
  LuCalendarDays,
  LuPawPrint,
  LuClock,
  LuWifi,
  LuBus,
  LuStar,
  LuHeart,
  LuShare2,
  LuPhone,
  LuMail,
  LuCalendarCheck,
  LuMessageSquare,
  LuCheck,
  LuBuilding, 
  LuArrowLeft
} from "react-icons/lu";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";
import { useGetPropertyDetail } from "../hooks/useGetPropertyDetail";
import { formateDate } from "@/utils/format-date";

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      borderWidth="1px"
      borderRadius="2xl"
      p="5"
      bg="white"
      _dark={{ bg: "gray.900" }}
      shadow="sm"
    >
      {title && (
        <>
          <Heading size="md" mb="4" letterSpacing="tight">
            {title}
          </Heading>
          <Separator mb="4" />
        </>
      )}
      {children}
    </Box>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Details() {
  const { propertyId } = useParams();
  const { data, isPending } = useGetPropertyDetail(propertyId!);
  const property = data?.content?.property;

  if (isPending) {
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
                    <Skeleton
                      w="12"
                      h="12"
                      borderRadius="full"
                      flexShrink={0}
                    />
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
  if (!property) {
    return (
        <Box
      bg={{ base: "gray.50", _dark: "gray.950" }}
      minH="100vh"
      px={{ base: "3", sm: "5", lg: "8" }}
      py={{ base: "4", sm: "6" }}
    >
      <Flex
        maxW="7xl"
        mx="auto"
        direction="column"
        align="center"
        justify="center"
        minH="60vh"
        gap="4"
        textAlign="center"
      >
        <Flex
          w="16"
          h="16"
          borderRadius="2xl"
          bg="bg.subtle"
          borderWidth="1px"
          align="center"
          justify="center"
        >
          <Icon as={LuBuilding} boxSize={7} color="fg.muted" />
        </Flex>
        <Stack gap="1">
          <Heading size="lg" letterSpacing="tight">Property not found</Heading>
          <Text fontSize="sm" color="fg.muted">
            This listing may have been removed or is no longer available.
          </Text>
        </Stack>
        <Button
          as={Link}
          to="/properties"
          variant="outline"
          borderRadius="xl"
          size="sm"
          gap="2"
          mt="2"
        >
          <LuArrowLeft size={14} />
          Back to listings
        </Button>
      </Flex>
    </Box>
    )
  }

  const mapPosition = new L.LatLng(
    property?.coordinates[0],
    property?.coordinates[1],
  );
  const mapCenter: [number, number] = [
    property?.coordinates[0],
    property?.coordinates[1],
  ];

  const propertyImages = property?.images;
  const appliances = property?.appliances;
  const keyDetails = [
    { label: "Bedrooms", value: property?.beds, unit: "beds", icon: LuBed },
    { label: "Bathrooms", value: property?.baths, unit: "baths", icon: LuBath },
    { label: "Area", value: property?.area, unit: "sq ft", icon: LuSquare },
    {
      label: "Property Type",
      value: property?.propertyType,
      unit: "",
      icon: LuBuilding,
    },
    {
      label: "Parking",
      value: property?.parkingSpaces,
      unit: property?.parkingSpaces === 1 ? "space" : "spaces",
      icon: LuCar,
    },
    {
      label: "Year Built",
      value: property?.yearBuilt,
      unit: "",
      icon: LuCalendarDays,
    },
    {
      label: "Pets Allowed",
      value: property?.petAllowed ? "Yes" : "No",
      unit: "",
      icon: LuPawPrint,
    },
    {
      label: "Available From",
      value: formateDate(property?.availableDate),
      unit: "",
      icon: LuCalendarCheck,
    },
    {
      label: "Lease Term",
      value: property?.leaseTermMonths,
      unit: "months",
      icon: LuClock,
    },
  ];

  return (
    <Box
      bg={{ base: "gray.50", _dark: "gray.950" }}
      minH="100vh"
      px={{ base: "3", sm: "5", lg: "8" }}
      py={{ base: "4", sm: "6" }}
    >
      <Stack direction="column" gap="5" maxW="7xl" mx="auto">
        {/* ── Breadcrumb ── */}
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Link to="/">
                <ChakraLink fontSize="sm">Home</ChakraLink>
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Link to="/properties">
                <ChakraLink fontSize="sm">Properties</ChakraLink>
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.CurrentLink fontSize="sm">
                {property?.title}
              </Breadcrumb.CurrentLink>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>

        {/* ── Hero Header ── */}
        <Box
          borderWidth="1px"
          borderRadius="2xl"
          p={{ base: "4", sm: "6" }}
          bg="white"
          _dark={{ bg: "gray.900" }}
          shadow="sm"
        >
          <Flex
            justify="space-between"
            align="flex-start"
            gap="4"
            wrap={{ base: "wrap", sm: "nowrap" }}
          >
            {/* Left: meta */}
            <Stack gap="2.5" flex="1" minW="0">
              {/* Type + Status */}
              <HStack gap="2" wrap="wrap">
                <Tag.Root colorPalette="blue" size="md" borderRadius="full">
                  <Tag.Label fontWeight="semibold">
                    {property?.propertyType}
                  </Tag.Label>
                </Tag.Root>
                <Badge
                  colorPalette="green"
                  variant="subtle"
                  borderRadius="full"
                  px="2.5"
                  py="0.5"
                  fontWeight="semibold"
                  fontSize="xs"
                >
                  <Box
                    as="span"
                    display="inline-block"
                    w="1.5"
                    h="1.5"
                    borderRadius="full"
                    bg="green.500"
                    mr="1.5"
                    verticalAlign="middle"
                  />
                  {property?.status}
                </Badge>
              </HStack>

              {/* Title */}
              <Heading
                size={{ base: "2xl", md: "3xl" }}
                letterSpacing="tight"
                lineHeight="1.15"
              >
                {property?.title}
              </Heading>

              {/* Rating + Location */}
              <HStack gap="4" wrap="wrap">
                {/* Stars */}
                <HStack gap="1.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Icon
                      key={i}
                      as={LuStar}
                      boxSize={3.5}
                      color={i <= 3 ? "yellow.400" : "gray.200"}
                      fill={i <= 3 ? "currentColor" : "none"}
                    />
                  ))}
                  <Text fontSize="sm" fontWeight="semibold">
                    {property?.rating}
                  </Text>
                  <Text fontSize="sm" color="fg.muted">
                    (50 reviews)
                  </Text>
                </HStack>

                {/* Location */}
                <HStack gap="1" color="fg.muted">
                  <Icon as={IoLocationSharp} boxSize={4} color="blue.400" />
                  <Text fontSize="sm">{property?.locationAddress}</Text>
                </HStack>
              </HStack>
            </Stack>

            {/* Right: Price + actions */}
            <VStack align="flex-end" gap="3" flexShrink={0}>
              <Box textAlign="right">
                <Text fontSize="xs" color="fg.muted" mb="0.5">
                  Monthly rent
                </Text>
                <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  color="blue.500"
                  lineHeight="1"
                >
                  MMK {property?.baseRentPrice}
                  <Text
                    as="span"
                    fontSize="sm"
                    fontWeight="normal"
                    color="fg.muted"
                  >
                    {" "}
                    /mo
                  </Text>
                </Text>
              </Box>
              <HStack gap="2">
                <IconButton
                  aria-label="Save"
                  variant="outline"
                  size="sm"
                  borderRadius="xl"
                >
                  <LuHeart size={15} />
                </IconButton>
                <IconButton
                  aria-label="Share"
                  variant="outline"
                  size="sm"
                  borderRadius="xl"
                >
                  <LuShare2 size={15} />
                </IconButton>
              </HStack>
            </VStack>
          </Flex>
        </Box>

        {/* ── Image Carousel ── */}
        <Box
          borderWidth="1px"
          borderRadius="2xl"
          overflow="hidden"
          bg="white"
          _dark={{ bg: "gray.900" }}
          shadow="sm"
        >
          <Carousel.Root slideCount={propertyImages.length} gap="0">
            <Box position="relative">
              <Carousel.ItemGroup w="full">
                {propertyImages?.map((image: string, index: number) => (
                  <Carousel.Item key={index} index={index}>
                    <Image
                      src={`${import.meta.env.VITE_FILE_URL}/property-images/${image}`}
                      w="100%"
                      h={{ base: "52", sm: "72", md: "96" }}
                      objectFit="cover"
                    />
                  </Carousel.Item>
                ))}
              </Carousel.ItemGroup>

              {/* Floating nav buttons */}
              <Box
                position="absolute"
                top="50%"
                left="3"
                transform="translateY(-50%)"
              >
                <Carousel.PrevTrigger asChild>
                  <IconButton
                    size="sm"
                    variant="solid"
                    borderRadius="full"
                    bg="whiteAlpha.800"
                    color="gray.700"
                    backdropFilter="blur(6px)"
                    _hover={{ bg: "white" }}
                  >
                    <LuChevronLeft />
                  </IconButton>
                </Carousel.PrevTrigger>
              </Box>
              <Box
                position="absolute"
                top="50%"
                right="3"
                transform="translateY(-50%)"
              >
                <Carousel.NextTrigger asChild>
                  <IconButton
                    size="sm"
                    variant="solid"
                    borderRadius="full"
                    bg="whiteAlpha.800"
                    color="gray.700"
                    backdropFilter="blur(6px)"
                    _hover={{ bg: "white" }}
                  >
                    <LuChevronRight />
                  </IconButton>
                </Carousel.NextTrigger>
              </Box>
            </Box>

            {/* Thumbnail strip */}
            <Box borderTopWidth="1px" p="3" overflowX="auto">
              <Carousel.IndicatorGroup display="flex" gap="2">
                {propertyImages.map((image: string, index: number) => (
                  <Carousel.Indicator
                    key={index}
                    index={index}
                    unstyled
                    flexShrink={0}
                    borderRadius="lg"
                    overflow="hidden"
                    borderWidth="2px"
                    borderColor="transparent"
                    _current={{ borderColor: "blue.400" }}
                    transition="border-color 0.15s"
                    cursor="pointer"
                  >
                    <Image
                      w="20"
                      h="14"
                      src={`${import.meta.env.VITE_FILE_URL}/property-images/${image}`}
                      objectFit="cover"
                    />
                  </Carousel.Indicator>
                ))}
              </Carousel.IndicatorGroup>
            </Box>
          </Carousel.Root>
        </Box>

        {/* ── Main content grid ── */}
        <SimpleGrid
          columns={{ base: 1, lg: 3 }}
          gap="5"
          alignItems="flex-start"
        >
          {/* Left column */}
          <GridItem colSpan={{ base: 1, lg: 2 }}>
            <Stack gap="5">
              {/* Description */}
              <Section title="Description">
                <Text
                  fontSize="sm"
                  color="fg.muted"
                  lineHeight="tall"
                  textAlign="justify"
                >
                  {property?.description}
                </Text>
              </Section>

              {/* Key Details */}
              <Section title="Key Details">
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
                          <Text
                            fontSize="xs"
                            color="fg.muted"
                            fontWeight="medium"
                          >
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
              </Section>

              {/* Features & Connectivity */}
              <Section title="Features & Connectivity">
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
                            {property?.internetName}
                          </Text>
                          <Badge
                            colorPalette="blue"
                            variant="subtle"
                            size="sm"
                            borderRadius="full"
                          >
                            {property?.internetSpeed}
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
                            {property?.nearTransitType}
                          </Text>
                          <Badge
                            colorPalette="green"
                            variant="subtle"
                            size="sm"
                            borderRadius="full"
                          >
                            {property?.nearTransitDist} mi
                          </Badge>
                        </HStack>
                      </Stack>
                    </HStack>
                  </SimpleGrid>
                </Stack>
              </Section>
            </Stack>
          </GridItem>

          {/* Right column — Landlord card & Map */}
          <GridItem colSpan={1}>
            {/* Landlord card */}
            <Box mb="6" position="sticky" top="4">
              <Section>
                <Stack gap="4">
                  {/* Landlord */}
                  <Text
                    fontSize="xs"
                    fontWeight="bold"
                    textTransform="uppercase"
                    letterSpacing="widest"
                    color="fg.muted"
                  >
                    Listed by
                  </Text>

                  <HStack gap="3">
                    <Avatar.Root size="lg">
                      <Avatar.Fallback name={property?.landlord?.username} />
                      <Avatar.Image
                        src={`${import.meta.env.VITE_FILE_URL}/profile-images/${property?.landlord?.profilePicture}`}
                      />
                    </Avatar.Root>
                    <Stack gap="0.5">
                      <Text fontWeight="semibold" fontSize="sm">
                        {property?.landlord?.username}
                      </Text>
                      <Badge
                        colorPalette="blue"
                        variant="subtle"
                        size="sm"
                        borderRadius="full"
                      >
                        Verified Landlord
                      </Badge>
                    </Stack>
                  </HStack>

                  <Separator />

                  {/* Contact info */}
                  <Stack gap="2.5">
                    <HStack gap="2.5" color="fg.muted">
                      <Flex
                        w="7"
                        h="7"
                        borderRadius="lg"
                        bg="bg.subtle"
                        align="center"
                        justify="center"
                        flexShrink={0}
                      >
                        <Icon as={LuMail} boxSize={3.5} />
                      </Flex>
                      <Text fontSize="sm">{property?.landlord?.email}</Text>
                    </HStack>
                    <HStack gap="2.5" color="fg.muted">
                      <Flex
                        w="7"
                        h="7"
                        borderRadius="lg"
                        bg="bg.subtle"
                        align="center"
                        justify="center"
                        flexShrink={0}
                      >
                        <Icon as={LuPhone} boxSize={3.5} />
                      </Flex>
                      <Text fontSize="sm">+1 (555) 123-4567</Text>
                    </HStack>
                  </Stack>

                  <Separator />

                  {/* Price recap */}
                  <Box
                    bg="blue.50"
                    _dark={{ bg: "blue.950" }}
                    borderRadius="xl"
                    p="4"
                    textAlign="center"
                  >
                    <Text fontSize="xs" color="fg.muted" mb="0.5">
                      Monthly rent
                    </Text>
                    <Text
                      fontSize="2xl"
                      fontWeight="bold"
                      color="blue.600"
                      lineHeight="1.1"
                    >
                      MMK {property?.baseRentPrice}
                    </Text>
                  </Box>

                  {/* CTA buttons */}
                  <Stack gap="2.5">
                    <Button
                      colorPalette="blue"
                      borderRadius="xl"
                      size="md"
                      w="full"
                      gap="2"
                    >
                      <LuCalendarCheck size={15} />
                      Request a Tour
                    </Button>
                    <Button
                      variant="outline"
                      borderRadius="xl"
                      size="md"
                      w="full"
                      gap="2"
                    >
                      <LuMessageSquare size={15} />
                      Contact Landlord
                    </Button>
                  </Stack>

                  <Text fontSize="xs" color="fg.muted" textAlign="center">
                    Typically responds within 24 hours
                  </Text>
                </Stack>
              </Section>
            </Box>

            {/* Map */}
            <MapContainer
              center={mapCenter}
              zoom={13}
              style={{ height: 350, width: "100%", borderRadius: "8px" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={mapPosition} />
            </MapContainer>
          </GridItem>
        </SimpleGrid>
      </Stack>
    </Box>
  );
}
