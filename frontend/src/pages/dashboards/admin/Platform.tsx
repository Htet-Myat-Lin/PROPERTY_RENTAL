import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Grid,
  HStack,
  Icon,
  Spinner,
  Stack,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { ElementType } from "react";
import { LuBanknote, LuCoins, LuLock, LuRefreshCw, LuTrendingDown, LuTrendingUp } from "react-icons/lu";
import { getApiErrorMessage } from "@/utils/api-error";
import { formateDate } from "@/utils/format-date";
import { formatCurrency } from "@/utils/format-currency";
import { useGetPlatformSummary } from "@/features/platform/hooks/useGetPlatformSummary";
import type { EscrowStatus, IPlatformSummary } from "@/features/platform/types";

const STATUS_PALETTE: Record<EscrowStatus, string> = {
  PENDING: "orange",
  RELEASED: "green",
  REFUNDED: "red",
};

const columnHeaderProps = {
  fontWeight: "semibold",
  fontSize: "xs",
  textTransform: "uppercase",
  letterSpacing: "wider",
  color: "fg.muted",
} as const;

function StatCard({
  label,
  value,
  hint,
  color,
  icon,
}: {
  label: string;
  value: number;
  hint: string;
  color: string;
  icon: ElementType;
}) {
  return (
    <Box bg="bg.panel" borderRadius="xl" border="1px solid" borderColor="border.muted" p={4}>
      <HStack justify="space-between" align="flex-start" gap={3} mb={2}>
        <Text fontSize="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wider" fontWeight="semibold">
          {label}
        </Text>
        <Icon as={icon} boxSize={4} color={`${color}.500`} flexShrink={0} />
      </HStack>
      <Text fontSize="2xl" fontWeight="bold" color="fg" fontVariantNumeric="tabular-nums">
        {formatCurrency(value)}
      </Text>
      <Text fontSize="xs" color="fg.muted" mt={1}>
        {hint}
      </Text>
    </Box>
  );
}

function Obligation({ label, value, hint }: { label: string; value: number; hint: string }) {
  return (
    <Flex justify="space-between" align="flex-start" gap={4} py={3}>
      <Box minW={0}>
        <Text fontSize="sm" fontWeight="medium" color="fg">
          {label}
        </Text>
        <Text fontSize="xs" color="fg.muted">
          {hint}
        </Text>
      </Box>
      <Text fontSize="sm" fontWeight="semibold" color="fg" fontVariantNumeric="tabular-nums" flexShrink={0}>
        {formatCurrency(value)}
      </Text>
    </Flex>
  );
}

function EntriesTable({ entries }: { entries: IPlatformSummary["entries"] }) {
  return (
    <Box overflowX="auto">
      <Table.Root size="sm" variant="outline" showColumnBorder>
        <Table.Header>
          <Table.Row bg="bg.subtle" _dark={{ bg: "whiteAlpha.50" }}>
            <Table.ColumnHeader {...columnHeaderProps}>Property</Table.ColumnHeader>
            <Table.ColumnHeader {...columnHeaderProps}>Landlord</Table.ColumnHeader>
            <Table.ColumnHeader {...columnHeaderProps}>Deposit</Table.ColumnHeader>
            <Table.ColumnHeader {...columnHeaderProps}>Commission</Table.ColumnHeader>
            <Table.ColumnHeader {...columnHeaderProps}>Landlord share</Table.ColumnHeader>
            <Table.ColumnHeader {...columnHeaderProps}>Escrow</Table.ColumnHeader>
            <Table.ColumnHeader {...columnHeaderProps}>Collected</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {entries.map((entry) => (
            <Table.Row
              key={entry.id}
              transition="background 0.15s"
              _hover={{ bg: "bg.subtle", _dark: { bg: "whiteAlpha.50" } }}
            >
              <Table.Cell>
                <Text fontSize="sm" fontWeight="medium" lineClamp={1} maxW="220px">
                  {entry.property.title}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="sm" color="fg.muted" lineClamp={1}>
                  {entry.landlord.username}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="sm" color="fg.muted" fontVariantNumeric="tabular-nums">
                  {formatCurrency(entry.amount)}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="sm" fontWeight="semibold" color="green.600" _dark={{ color: "green.300" }} fontVariantNumeric="tabular-nums">
                  {formatCurrency(entry.commissionAmount)}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="sm" color="fg.muted" fontVariantNumeric="tabular-nums">
                  {formatCurrency(entry.landlordAmount)}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Badge
                  variant="subtle"
                  colorPalette={entry.escrowStatus ? STATUS_PALETTE[entry.escrowStatus] : "gray"}
                  borderRadius="full"
                  size="sm"
                  px={3}
                >
                  {entry.escrowStatus ?? "NONE"}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="sm" color="fg.muted">
                  {formateDate(entry.createdAt)}
                </Text>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}

export function Platform() {
  const { data, isPending, isError, error, refetch } = useGetPlatformSummary();

  if (isPending) {
    return (
      <Center minH="40vh">
        <VStack gap={4}>
          <Spinner color="blue.500" size="xl" borderWidth="3px" />
          <Text color="fg.muted" fontSize="sm">
            Loading platform position...
          </Text>
        </VStack>
      </Center>
    );
  }

  if (isError || !data) {
    return (
      <Center minH="30vh" borderWidth="1px" borderColor="border.muted" borderRadius="xl" p={8}>
        <VStack gap={3}>
          <Text color="red.500" fontSize="sm" textAlign="center">
            {getApiErrorMessage(error, "Could not load the platform summary")}
          </Text>
          <Button size="sm" variant="outline" borderRadius="lg" onClick={() => refetch()}>
            Try again
          </Button>
        </VStack>
      </Center>
    );
  }

  const ratePercent = Math.round(data.commissionRate * 1000) / 10;

  return (
    <Stack gap="6">
      {/* â”€â”€â”€ Page Header â”€â”€â”€ */}
      <Flex alignItems={{ base: "start", md: "center" }} justify="space-between" gap="4" wrap="wrap">
        <Box>
          <HStack gap={2} mb={1}>
            <Icon as={LuCoins} boxSize={6} color="blue.500" />
            <Text fontSize="xl" fontWeight="bold" color="fg">
              Platform
            </Text>
          </HStack>
          <Text fontSize="sm" color="fg.muted">
            Commission is taken from the landlord&apos;s share when an escrow is released, so every figure
            below is derived from the payments themselves.
          </Text>
        </Box>

        <Badge colorPalette="blue" variant="subtle" borderRadius="full" px={3} py={1}>
          {ratePercent}% commission
        </Badge>
      </Flex>

      {/* â”€â”€â”€ Commission â”€â”€â”€ */}
      <Box>
        <Text fontSize="sm" fontWeight="semibold" color="fg" mb={3}>
          Commission
        </Text>
        <Grid templateColumns={{ base: "1fr", sm: "repeat(2, minmax(0, 1fr))", xl: "repeat(3, minmax(0, 1fr))" }} gap={4}>
          <StatCard
            label="Earned"
            value={data.revenue.earned}
            hint={`Released from ${data.counts.released} escrow${data.counts.released === 1 ? "" : "s"}`}
            color="green"
            icon={LuTrendingUp}
          />
          <StatCard
            label="In escrow"
            value={data.revenue.held}
            hint={`Not earned yet, across ${data.counts.held} deposit${data.counts.held === 1 ? "" : "s"}`}
            color="orange"
            icon={LuLock}
          />
          <StatCard
            label="Forgone"
            value={data.revenue.forgone}
            hint={`Never taken on ${data.counts.refunded} refund${data.counts.refunded === 1 ? "" : "s"}`}
            color="gray"
            icon={LuTrendingDown}
          />
        </Grid>
      </Box>

      {/* â”€â”€â”€ Escrow movement â”€â”€â”€ */}
      <Box>
        <Text fontSize="sm" fontWeight="semibold" color="fg" mb={3}>
          Escrow movement
        </Text>
        <Grid templateColumns={{ base: "1fr", sm: "repeat(2, minmax(0, 1fr))", xl: "repeat(3, minmax(0, 1fr))" }} gap={4}>
          <StatCard
            label="Held in escrow"
            value={data.escrow.held}
            hint="Full deposits waiting for release or refund"
            color="blue"
            icon={LuLock}
          />
          <StatCard
            label="Released to landlords"
            value={data.escrow.landlordPayouts}
            hint="Commission already split out of these deposits"
            color="teal"
            icon={LuTrendingUp}
          />
          <StatCard
            label="Refunded to tenants"
            value={data.escrow.refunded}
            hint="Returned in full, commission not charged"
            color="red"
            icon={LuRefreshCw}
          />
        </Grid>
      </Box>

      {/* â”€â”€â”€ What we still owe â”€â”€â”€ */}
      <Box bg="bg.panel" borderRadius="xl" border="1px solid" borderColor="border.muted" p={5}>
        <HStack gap={2} mb={1}>
          <Icon as={LuBanknote} boxSize={4} color="blue.500" />
          <Text fontSize="sm" fontWeight="semibold" color="fg">
            Outstanding obligations
          </Text>
        </HStack>
        <Text fontSize="xs" color="fg.muted" mb={2}>
          Money that belongs to users and is still sitting in their wallets or awaiting a payout.
        </Text>
        <Box divideY="1px" borderColor="border.muted">
          <Obligation
            label="User wallet balances"
            value={data.obligations.userBalances}
            hint="Total credited across every tenant and landlord wallet"
          />
          <Obligation
            label="Withdrawals awaiting approval"
            value={data.obligations.pendingWithdrawals}
            hint={`${data.obligations.pendingWithdrawalCount} request${data.obligations.pendingWithdrawalCount === 1 ? "" : "s"} pending`}
          />
        </Box>
      </Box>

      {/* â”€â”€â”€ Recent commission entries â”€â”€â”€ */}
      {data.entries.length === 0 ? (
        <Center
          minH="30vh"
          borderWidth="2px"
          borderStyle="dashed"
          borderColor="border.muted"
          borderRadius="xl"
          flexDirection="column"
          gap="4"
          p={8}
        >
          <Box
            w="60px"
            h="60px"
            borderRadius="full"
            bg="blue.50"
            _dark={{ bg: "blue.950" }}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={LuCoins} boxSize={7} color="blue.500" />
          </Box>
          <VStack gap={1}>
            <Text fontWeight="semibold" color="fg">
              No commission collected yet
            </Text>
            <Text color="fg.muted" fontSize="sm" textAlign="center">
              Commission appears here once a landlord approves a rent request and its escrow is released
            </Text>
          </VStack>
        </Center>
      ) : (
        <Box bg="bg.panel" borderRadius="xl" border="1px solid" borderColor="border.muted" overflow="hidden">
          <HStack justify="space-between" px={5} py={4} borderBottomWidth="1px" borderColor="border.muted">
            <Text fontSize="sm" fontWeight="semibold" color="fg">
              Latest collections
            </Text>
            <Badge colorPalette="gray" variant="subtle" borderRadius="full" size="sm">
              {data.entries.length}
            </Badge>
          </HStack>
          <EntriesTable entries={data.entries} />
        </Box>
      )}
    </Stack>
  );
}
