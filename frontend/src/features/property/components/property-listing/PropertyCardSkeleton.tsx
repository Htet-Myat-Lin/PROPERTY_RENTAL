import { Flex, Skeleton, Box, SkeletonText } from "@chakra-ui/react";

export function PropertyCardSkeleton({ list = false }: { list?: boolean }) {
  if (list) {
    return (
      <Flex
        borderWidth="1px"
        borderRadius="2xl"
        overflow="hidden"
        h="36"
        bg="bg.panel"
      >
        <Skeleton w="48" flexShrink={0} />
        <Box p="4" flex="1">
          <SkeletonText noOfLines={1} mb="3" />
          <SkeletonText noOfLines={2} mb="3" />
          <SkeletonText noOfLines={1} />
        </Box>
      </Flex>
    );
  }
  return (
    <Box borderWidth="1px" borderRadius="2xl" overflow="hidden" bg="bg.panel">
      <Skeleton h="52" />
      <Box p="4">
        <SkeletonText noOfLines={1} mb="2" />
        <SkeletonText noOfLines={2} mb="3" />
        <SkeletonText noOfLines={1} />
      </Box>
    </Box>
  );
}