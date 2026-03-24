import { Carousel, Box, Image, IconButton } from "@chakra-ui/react";
import { LuChevronRight, LuChevronLeft } from "react-icons/lu";

export function PropertyImageCarosel({
  propertyImages,
}: {
  propertyImages: string[];
}) {
  return (
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
  );
}
