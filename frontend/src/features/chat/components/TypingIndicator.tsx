import { Flex, HStack, Text } from "@chakra-ui/react";

export function TypingIndicator() {
    return (
        <Flex align="flex-end" gap="2" px="1">
            <HStack
                gap="1"
                bg="bg.muted"
                px="4"
                py="2.5"
                borderRadius="2xl"
                borderBottomStartRadius="sm"
            >
                {[0, 1, 2].map((i) => (
                    <Flex
                        key={i}
                        boxSize="1.5"
                        borderRadius="full"
                        bg="fg.muted"
                        css={{
                            animation: "typingBounce 1.2s ease-in-out infinite",
                            animationDelay: `${i * 0.15}s`,
                            "@keyframes typingBounce": {
                                "0%, 60%, 100%": { transform: "translateY(0)", opacity: 0.4 },
                                "30%": { transform: "translateY(-4px)", opacity: 1 },
                            },
                        }}
                    />
                ))}
            </HStack>
            <Text fontSize="xs" color="fg.muted" pb="1">
                typing
            </Text>
        </Flex>
    );
}
