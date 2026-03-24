import { Box, Flex, Stack, Icon, Text, Heading, Button } from "@chakra-ui/react";
import { LuBuilding, LuArrowLeft } from "react-icons/lu";
import { Link } from "react-router";

export function PropertyNotFound() {
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
            <Link to="/properties">
              <Button
                variant="outline"
                borderRadius="xl"
                size="sm"
                gap="2"
                mt="2"
              >
                <LuArrowLeft size={14} />
                Back to listings
              </Button>
            </Link>
          </Flex>
        </Box>
        )
}