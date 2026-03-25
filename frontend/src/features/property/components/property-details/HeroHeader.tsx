import {
  Box,
  Flex,
  Stack,
  HStack,
  Tag,
  Badge,
  Heading,
  Text,
  VStack,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { IoLocationSharp } from "react-icons/io5";
import { LuShare2, LuHeart, LuStar } from "react-icons/lu";
import { useHandleWishlist } from "../../hooks/useHandleWishlist";

type Props = {
  id: string
  title: string;
  location: string;
  propertyType: string;
  status: string;
  rating: string;
  rentPrice: number;
};

export function HeroHeader({
  id,
  title,
  location,
  propertyType,
  status,
  rating,
  rentPrice,
}: Props) {

  const { isInWishlist, toggleSave } = useHandleWishlist()

  return (
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
              <Tag.Label fontWeight="semibold">{propertyType}</Tag.Label>
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
              {status}
            </Badge>
          </HStack>

          {/* Title */}
          <Heading
            size={{ base: "2xl", md: "3xl" }}
            letterSpacing="tight"
            lineHeight="1.15"
          >
            {title}
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
                {rating}
              </Text>
              <Text fontSize="sm" color="fg.muted">
                (50 reviews)
              </Text>
            </HStack>

            {/* Location */}
            <HStack gap="1" color="fg.muted">
              <Icon as={IoLocationSharp} boxSize={4} color="blue.400" />
              <Text fontSize="sm">{location}</Text>
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
              MMK {rentPrice}
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
              color={isInWishlist(id) ? "red" : "gray"}
              onClick={() => toggleSave(id)}
            >
              <LuHeart size={15} fill={isInWishlist(id) ? "currentColor" : "none"} />
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
  );
}
