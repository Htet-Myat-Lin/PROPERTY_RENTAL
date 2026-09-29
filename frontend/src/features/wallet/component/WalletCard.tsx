import {
    Alert,
    Box,
    Button,
    Card,
    Flex,
    HStack,
    Icon,
    IconButton,
    Skeleton,
    Text,
    VStack,
} from "@chakra-ui/react"
import { useState } from "react"
import {
    LuCircleCheck,
    LuClock3,
    LuPlus,
    LuReceiptText,
    LuRefreshCw,
    LuWallet,
} from "react-icons/lu"
import { useGetPendingDeposits } from "../hooks/useGetPendingDeposits"
import { useGetWallet } from "../hooks/useGetWallet"
import { getApiErrorMessage } from "@/utils/api-error"
import { formatCurrency, WALLET_CURRENCY } from "@/utils/format-currency"
import { DepositDialog } from "./DepositDialog"

function formatUpdatedAt(value?: string) {
    if (!value) return null
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return null
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(date)
}

export function WalletCard() {
    const { wallet, isPending: isLoading, isError, error, refetch } = useGetWallet()
    const { pendingAmount, isTenant } = useGetPendingDeposits()
    const [isDepositOpen, setIsDepositOpen] = useState(false)

    const balance = wallet?.balance ?? 0
    const isNegative = balance < 0
    const updatedLabel = formatUpdatedAt(wallet?.updatedAt)

    return (
        <>
            <Card.Root
                width="100%"
                maxW="420px"
                bg="bg.panel"
                borderWidth="1px"
                borderColor="border.muted"
                borderRadius="2xl"
                overflow="hidden"
                shadow="md"
                _dark={{shadow: "none"}}
                transition="box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease"
                _hover={{
                    shadow: "lg",
                    transform: "translateY(-2px)",
                    borderColor: "border",
                }}
                css={{"@media (prefers-reduced-motion: reduce)": {transition: "none", transform: "none"}}}
            >
                {/* Header */}
                <Card.Header px={5} py={4} borderBottomWidth="1px" borderColor="border.muted">
                    <Flex justifyContent="space-between" alignItems="center" gap={3}>
                        <HStack gap={3} minW={0}>
                            <Flex
                                colorPalette="blue"
                                bg="colorPalette.subtle"
                                color="colorPalette.fg"
                                boxSize={10}
                                borderRadius="lg"
                                alignItems="center"
                                justifyContent="center"
                                flexShrink={0}
                            >
                                <Icon as={LuWallet} boxSize={5} />
                            </Flex>
                            <Box minW={0}>
                                <Text fontSize="sm" fontWeight="semibold" color="fg">
                                    Wallet
                                </Text>
                                <Text fontSize="xs" color="fg.muted">
                                    Personal {WALLET_CURRENCY} account
                                </Text>
                            </Box>
                        </HStack>

                        <HStack gap={1}>
                            <IconButton
                                variant="ghost"
                                size="sm"
                                aria-label="Refresh balance"
                                onClick={() => refetch()}
                                loading={isLoading}
                                color="fg.muted"
                                _hover={{bg: "bg.muted", color: "fg"}}
                            >
                                <LuRefreshCw />
                            </IconButton>
                        </HStack>
                    </Flex>
                </Card.Header>

                <Card.Body px={5} py={5}>
                    <VStack gap={4} align="stretch">
                        {isError && (
                            <Alert.Root status="error" variant="subtle" borderRadius="md" role="alert">
                                <Alert.Indicator />
                                <Alert.Content>
                                    <Alert.Description>
                                        {getApiErrorMessage(error, "Could not load your wallet")}
                                    </Alert.Description>
                                </Alert.Content>
                            </Alert.Root>
                        )}

                        {/* Balance hero: gradient tuned separately per color mode */}
                        <Box
                            bgGradient="to-br"
                            gradientFrom="blue.500"
                            gradientTo="purple.600"
                            _dark={{gradientFrom: "blue.700", gradientTo: "purple.800"}}
                            p={5}
                            borderRadius="xl"
                            position="relative"
                            overflow="hidden"
                            color="white"
                        >
                            {/* decorative blobs */}
                            <Box
                                aria-hidden
                                pointerEvents="none"
                                position="absolute"
                                top="-25%"
                                right="-10%"
                                w="55%"
                                h="70%"
                                bg="whiteAlpha.100"
                                borderRadius="full"
                            />
                            <Box
                                aria-hidden
                                pointerEvents="none"
                                position="absolute"
                                bottom="-40%"
                                left="-15%"
                                w="70%"
                                h="80%"
                                bg="whiteAlpha.100"
                                borderRadius="full"
                            />

                            <VStack gap={3} align="stretch" position="relative" zIndex={1}>
                                <Flex justifyContent="space-between" alignItems="center">
                                    <Text fontSize="sm" fontWeight="medium" color="whiteAlpha.800">
                                        Current balance
                                    </Text>
                                    <Box
                                        bg="whiteAlpha.300"
                                        color="white"
                                        px={2.5}
                                        py={0.5}
                                        borderRadius="md"
                                        fontSize="xs"
                                        fontWeight="bold"
                                        letterSpacing="wide"
                                    >
                                        {WALLET_CURRENCY}
                                    </Box>
                                </Flex>

                                {isLoading ? (
                                    <Skeleton
                                        variant="shine"
                                        height="42px"
                                        width="180px"
                                        borderRadius="md"
                                        css={{
                                            "--start-color": "colors.whiteAlpha.200",
                                            "--end-color": "colors.whiteAlpha.400",
                                        }}
                                    />
                                ) : (
                                    <Text
                                        fontSize={{base: "3xl", sm: "4xl"}}
                                        fontWeight="bold"
                                        color={isNegative ? "red.200" : "white"}
                                        fontFamily="mono"
                                        fontVariantNumeric="tabular-nums"
                                        letterSpacing="tight"
                                        lineHeight="1.1"
                                        truncate
                                        title={formatCurrency(balance)}
                                    >
                                        {formatCurrency(balance)}
                                    </Text>
                                )}
                            </VStack>
                        </Box>

                        <Box
                            borderWidth="1px"
                            borderColor="border.muted"
                            borderRadius="xl"
                            overflow="hidden"
                        >
                            <Flex
                                alignItems="center"
                                justifyContent="space-between"
                                px={4}
                                py={3}
                                bg="bg.subtle"
                                borderBottomWidth="1px"
                                borderColor="border.muted"
                            >
                                <HStack gap={2}>
                                    <Icon as={LuReceiptText} boxSize={4} color="blue.500" />
                                    <Text fontSize="sm" fontWeight="semibold" color="fg">
                                        Wallet overview
                                    </Text>
                                </HStack>
                                <HStack gap={1.5} color="green.600" _dark={{color: "green.300"}}>
                                    <Icon as={LuCircleCheck} boxSize={4} />
                                    <Text fontSize="xs" fontWeight="semibold">Active</Text>
                                </HStack>
                            </Flex>

                            <VStack gap={0} align="stretch" divideY="1px" divideColor="border.muted">
                                {isTenant && (
                                    <Flex alignItems="center" justifyContent="space-between" px={4} py={3}>
                                        <HStack gap={3}>
                                            <Icon as={LuClock3} boxSize={4} color={pendingAmount > 0 ? "orange.500" : "fg.muted"} />
                                            <Box>
                                                <Text fontSize="sm" color="fg">Pending deposits</Text>
                                                <Text fontSize="xs" color="fg.muted">
                                                    {pendingAmount > 0 ? "Awaiting admin approval" : "No pending deposits"}
                                                </Text>
                                            </Box>
                                        </HStack>
                                        <Text fontSize="sm" fontWeight="semibold" color={pendingAmount > 0 ? "orange.500" : "fg.muted"} fontVariantNumeric="tabular-nums">
                                            {formatCurrency(pendingAmount)}
                                        </Text>
                                    </Flex>
                                )}
                            </VStack>
                        </Box>

                        {isTenant && (
                            <Button
                                size="sm"
                                colorPalette="blue"
                                onClick={() => setIsDepositOpen(true)}
                                disabled={isLoading}
                            >
                                <LuPlus /> Add funds
                            </Button>
                        )}
                    </VStack>
                </Card.Body>

                {updatedLabel && (
                    <Card.Footer
                        px={5}
                        py={3}
                        borderTopWidth="1px"
                        borderColor="border.muted"
                        bg="bg.subtle"
                    >
                        <Text fontSize="xs" color="fg.muted">
                            Updated {updatedLabel}
                        </Text>
                    </Card.Footer>
                )}
            </Card.Root>

            <DepositDialog isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} />
        </>
    )
}
