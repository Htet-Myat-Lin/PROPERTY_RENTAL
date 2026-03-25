import { HStack, Text } from "@chakra-ui/react";
import { LuStar } from "react-icons/lu";

export function StarRating({ rating }: { rating: number }) {
  return (
    <HStack gap="0.5" align="center">
      <LuStar
        size={11}
        fill="var(--chakra-colors-yellow-400)"
        color="var(--chakra-colors-yellow-400)"
      />
      <Text fontSize="xs" fontWeight="semibold" color="fg.muted">
        {rating > 0 ? rating.toFixed(1) : "New"}
      </Text>
    </HStack>
  );
}