import {
  Avatar,
  Box,
  Card,
  HStack,
  RatingGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import { IoChatboxEllipses } from "react-icons/io5";

export type Testimonial = {
  name: string;
  role: string;
  avatar?: string;
  rating: number;
  quote: string;
};

export function TestimonialCard({ name, role, avatar, rating, quote }: Testimonial) {
  return (
    <Card.Root
      variant="elevated"
      border="none"
      borderRadius="2xl"
      bg="bg.panel"
      h="full"
      transition="all 0.3s"
      _hover={{ transform: "translateY(-4px)", shadow: "xl" }}
    >
      <Card.Body gap="4">
        <HStack justify="space-between" align="center">
          <RatingGroup.Root
            count={5}
            value={rating}
            size="sm"
            colorPalette="orange"
            readOnly
          >
            <RatingGroup.Control />
          </RatingGroup.Root>
          <Box color="blue.500" fontSize="2xl" aria-hidden="true">
            <IoChatboxEllipses />
          </Box>
        </HStack>

        <Card.Description>
          <Text color="fg" fontSize="md" lineHeight="tall">
            "{quote}"
          </Text>
        </Card.Description>
      </Card.Body>

      <Card.Footer borderTopWidth="1px" borderColor="border.subtle" pt="4">
        <HStack gap="3">
          <Avatar.Root size="md" colorPalette="blue">
            <Avatar.Fallback name={name} />
            {avatar && <Avatar.Image src={avatar} />}
          </Avatar.Root>
          <Stack gap="0">
            <Text fontWeight="bold" fontSize="sm">
              {name}
            </Text>
            <Text color="fg.muted" fontSize="xs">
              {role}
            </Text>
          </Stack>
        </HStack>
      </Card.Footer>
    </Card.Root>
  );
}
