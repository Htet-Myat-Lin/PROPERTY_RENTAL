import {
  Box,
  Text,
  Stack,
  Avatar,
  HStack,
  Badge,
  Separator,
  Button,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { SectionWrapper } from "./SectionWrapper";
import {
  LuMessageSquare,
  LuMail,
  LuPhone,
  LuCalendarCheck,
} from "react-icons/lu";

type Props = {
    landlordName: string;
    landlordEmail: string;
    rentPrice: number;
    profilePicture?: string;
}

export function LandlordCard({ landlordName, landlordEmail, rentPrice, profilePicture }: Props) {
  return (
    <Box mb="6" position="sticky" top="4">
      <SectionWrapper>
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
              <Avatar.Fallback name={landlordName} />
              <Avatar.Image
                src={`${import.meta.env.VITE_FILE_URL}/profile-images/${profilePicture}`}
              />
            </Avatar.Root>
            <Stack gap="0.5">
              <Text fontWeight="semibold" fontSize="sm">
                {landlordName}
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
              <Text fontSize="sm">{landlordEmail}</Text>
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
              MMK {rentPrice}
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
      </SectionWrapper>
    </Box>
  );
}
