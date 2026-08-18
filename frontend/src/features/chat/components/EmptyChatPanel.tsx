import { Box, Flex, Icon, Text, VStack } from "@chakra-ui/react";
import { LuMessageSquare } from "react-icons/lu";

export function EmptyChatPanel() {
    return (
        <Flex
            direction="column"
            align="center"
            justify="center"
            h="full"
            px="6"
            bg="linear-gradient(180deg, var(--chakra-colors-bg-subtle) 0%, var(--chakra-colors-bg-panel) 100%)"
        >
            <VStack gap="4" maxW="sm" textAlign="center">
                <Flex
                    align="center"
                    justify="center"
                    w="20"
                    h="20"
                    borderRadius="2xl"
                    bg="blue.50"
                    color="blue.600"
                    boxShadow="0 8px 24px rgba(37,99,235,0.12)"
                    _dark={{ bg: "blue.950", color: "blue.300" }}
                >
                    <Icon as={LuMessageSquare} boxSize="10" />
                </Flex>
                <Box>
                    <Text fontSize="lg" fontWeight="semibold" mb="1">
                        Select a conversation
                    </Text>
                    <Text fontSize="sm" color="fg.muted" lineHeight="tall">
                        Choose a chat from the sidebar to view messages, or start a new conversation from a property listing.
                    </Text>
                </Box>
            </VStack>
        </Flex>
    );
}
