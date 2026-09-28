import { Badge, Box, Button, Grid, HStack, Icon, Stack, Text } from "@chakra-ui/react"
import { useState } from "react"
import { LuArrowUpFromLine, LuCircleDollarSign, LuShieldCheck } from "react-icons/lu"
import { useAppStore } from "@/app/store"
import { useGetWallet } from "@/features/wallet/hooks/useGetWallet"
import { MyDepositRequestList } from "@/features/wallet/component/MyDepositRequestList"
import { TransactionHistoryList } from "@/features/wallet/component/TransactionHistoryList"
import { WalletCard } from "@/features/wallet/component/WalletCard"
import { WithdrawDialog } from "@/features/wallet/component/WithdrawDialog"

export function WalletPage() {
    const { wallet } = useGetWallet()
    const role = useAppStore((state) => state.user?.role)
    const isTenant = role === "TENANT"
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)

    const balance = wallet?.balance ?? 0

    return (
        <Stack gap={{base: 5, md: 7}}>
            <HStack
                justify="space-between"
                align={{base: "flex-start", sm: "center"}}
                gap={4}
                flexWrap="wrap"
            >
                <Box>
                    <Text fontSize={{base: "xl", md: "2xl"}} fontWeight="bold" color="fg">
                        Wallet
                    </Text>
                    <Text color="fg.muted" fontSize="sm" mt={1}>
                        Manage your balance, deposits, and withdrawals in one place.
                    </Text>
                </Box>
                <HStack gap={2} flexWrap="wrap">
                    <Badge
                        colorPalette="green"
                        variant="subtle"
                        px={3}
                        py={2}
                        borderRadius="full"
                        display="inline-flex"
                        alignItems="center"
                        gap={2}
                    >
                        <Icon as={LuShieldCheck} boxSize={4} />
                        Secure wallet
                    </Badge>
                    <Button
                        size="sm"
                        colorPalette="red"
                        borderRadius="lg"
                        gap={2}
                        onClick={() => setIsWithdrawOpen(true)}
                        disabled={balance <= 0}
                    >
                        <Icon as={LuArrowUpFromLine} boxSize={4} />
                        Withdraw
                    </Button>
                </HStack>
            </HStack>

            <HStack
                gap={3}
                px={4}
                py={3}
                borderWidth="1px"
                borderColor="border.muted"
                borderRadius="lg"
                bg="bg.subtle"
                color="fg.muted"
                fontSize="sm"
            >
                <Icon as={LuCircleDollarSign} boxSize={5} color="blue.500" />
                <Text>
                    {isTenant
                        ? "Deposits are credited to your balance once an admin approves the request."
                        : "Rent payments, commission, and payouts are recorded here as they happen."}{" "}
                    Withdrawal limits may vary by payment method.
                </Text>
            </HStack>

            <Grid
                templateColumns={{base: "1fr", lg: "minmax(0, 380px) minmax(0, 1fr)"}}
                gap={{base: 4, md: 5}}
                alignItems="start"
            >
                <WalletCard />

                <Stack gap={{base: 4, md: 5}} w="full">
                    {isTenant && <MyDepositRequestList />}
                    <TransactionHistoryList />
                </Stack>
            </Grid>

            <WithdrawDialog
                isOpen={isWithdrawOpen}
                onClose={() => setIsWithdrawOpen(false)}
                availableBalance={balance}
            />
        </Stack>
    )
}
