import {
  Avatar,
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
  Text,
  VStack,
} from "@chakra-ui/react";
import type { ElementType, ReactNode } from "react";
import {
  LuArrowUpFromLine,
  LuBuilding2,
  LuCalendarDays,
  LuFileText,
  LuKeyRound,
  LuRefreshCw,
  LuTrendingUp,
  LuWallet,
} from "react-icons/lu";
import { Chart, useChart } from "@chakra-ui/charts";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetLandlordDashboard } from "@/features/dashboard/hooks/useGetLandlordDashboard";
import type {
  ICountItem,
  ILandlordPendingRentRequest,
  ILandlordVisitBooking,
  ILandlordWithdrawal,
} from "@/features/dashboard/types";
import { getApiErrorMessage } from "@/utils/api-error";
import { formatCurrency } from "@/utils/format-currency";
import { formateDate } from "@/utils/format-date";

const profileImageUrl = (picture: string) =>
  `${import.meta.env.VITE_FILE_URL}/profile-images/${picture}`;

const OCCUPANCY_COLORS: Record<string, string> = {
  AVAILABLE: "green",
  RENTED: "blue",
  RESERVED: "orange",
};

const STATUS_BADGE: Record<string, string> = {
  PENDING: "orange",
  APPROVED: "green",
  REJECTED: "red",
};

const percentOf = (value: number, total: number) => (total > 0 ? (value / total) * 100 : 0);

const formatSchedule = (schedules: Record<string, string>[]) => {
  const first = schedules[0];
  if (!first) return "No schedule provided";
  const date = first.date ? formateDate(first.date) : "";
  const time = first.time ?? "";
  const extra = schedules.length > 1 ? ` (+${schedules.length - 1} more)` : "";
  return `${date}${time ? ` · ${time}` : ""}${extra}`;
};

/* ─── Shell: titled panel ─── */
function Panel({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Box bg="bg.panel" borderRadius="xl" border="1px solid" borderColor="border.muted" p={5}>
      <Flex justify="space-between" align="flex-start" gap={3} mb={4}>
        <Box>
          <Text fontSize="sm" fontWeight="semibold" color="fg">
            {title}
          </Text>
          {subtitle && (
            <Text fontSize="xs" color="fg.muted" mt={0.5}>
              {subtitle}
            </Text>
          )}
        </Box>
        {action}
      </Flex>
      {children}
    </Box>
  );
}

/* ─── Top summary card ─── */
function StatCard({
  label,
  value,
  hint,
  palette,
  icon,
}: {
  label: string;
  value: ReactNode;
  hint: string;
  palette: string;
  icon: ElementType;
}) {
  return (
    <Box bg="bg.panel" borderRadius="xl" border="1px solid" borderColor="border.muted" p={4}>
      <HStack justify="space-between" align="flex-start" gap={3} mb={2}>
        <Text fontSize="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wider" fontWeight="semibold">
          {label}
        </Text>
        <Flex
          align="center"
          justify="center"
          boxSize="7"
          borderRadius="lg"
          flexShrink={0}
          bg={`${palette}.50`}
          color={`${palette}.600`}
          _dark={{ bg: `${palette}.950`, color: `${palette}.300` }}
        >
          <Icon as={icon} boxSize={4} />
        </Flex>
      </HStack>
      <Text fontSize="2xl" fontWeight="bold" color="fg" fontVariantNumeric="tabular-nums" lineClamp={1}>
        {value}
      </Text>
      <Text fontSize="xs" color="fg.muted" mt={1}>
        {hint}
      </Text>
    </Box>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <Center py={8}>
      <Text fontSize="sm" color="fg.muted">
        {label}
      </Text>
    </Center>
  );
}

/* ─── Monthly earnings area chart ─── */
function EarningsChart({ data }: { data: { month: string; amount: number }[] }) {
  const chart = useChart({
    data,
    series: [{ name: "amount", color: "teal.solid", label: "Net earnings" }],
  });

  return (
    <Chart.Root h={{ base: "240px", md: "300px" }} chart={chart}>
      <AreaChart data={chart.data} responsive>
        <defs>
          <linearGradient id="landlordEarnings" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={chart.color("teal.solid")} stopOpacity={0.35} />
            <stop offset="100%" stopColor={chart.color("teal.solid")} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={chart.color("border.muted")} vertical={false} />
        <XAxis axisLine={false} tickLine={false} dataKey={chart.key("month")} />
        <YAxis
          axisLine={false}
          tickLine={false}
          width={56}
          tickFormatter={chart.formatNumber({ notation: "compact" })}
        />
        <Tooltip
          cursor={false}
          animationDuration={100}
          content={<Chart.Tooltip formatter={(value, name) => [formatCurrency(Number(value)), name]} />}
        />
        <Legend content={<Chart.Legend />} />
        {chart.series.map((item) => (
          <Area
            key={item.name}
            isAnimationActive={false}
            dataKey={chart.key(item.name)}
            fill="url(#landlordEarnings)"
            stroke={chart.color(item.color)}
          />
        ))}
      </AreaChart>
    </Chart.Root>
  );
}

/* ─── Occupancy donut + legend ─── */
function OccupancyChart({ data }: { data: ICountItem[] }) {
  const chart = useChart({
    data: data.map((item) => ({
      name: item.label,
      value: item.count,
      color: `${OCCUPANCY_COLORS[item.label] ?? "gray"}.solid`,
    })),
  });

  const total = data.reduce((sum, item) => sum + item.count, 0);

  if (total === 0) return <EmptyState label="No properties yet" />;

  return (
    <HStack gap={{ base: 4, md: 6 }} align="center" flexWrap={{ base: "wrap", md: "nowrap" }}>
      <Chart.Root boxSize="180px" chart={chart} flexShrink={0}>
        <PieChart responsive>
          <Tooltip cursor={false} animationDuration={100} content={<Chart.Tooltip hideLabel />} />
          <Pie
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
            isAnimationActive={false}
            data={chart.data}
            dataKey={chart.key("value")}
            nameKey="name"
          >
            {chart.data.map((item) => (
              <Cell key={item.name} fill={chart.color(item.color)} />
            ))}
          </Pie>
        </PieChart>
      </Chart.Root>

      <VStack align="stretch" gap={2.5} flex={1} minW="150px">
        {data.map((item) => (
          <Flex key={item.label} justify="space-between" align="center" gap={4}>
            <HStack gap={2} minW={0}>
              <Box boxSize="2.5" borderRadius="full" bg={`${OCCUPANCY_COLORS[item.label] ?? "gray"}.solid`} flexShrink={0} />
              <Text fontSize="sm" color="fg.subtle" truncate>
                {item.label}
              </Text>
            </HStack>
            <HStack gap={2} flexShrink={0}>
              <Text fontSize="sm" fontWeight="semibold" color="fg" fontVariantNumeric="tabular-nums">
                {item.count.toLocaleString()}
              </Text>
              <Text fontSize="xs" color="fg.muted" fontVariantNumeric="tabular-nums" minW="42px" textAlign="right">
                {percentOf(item.count, total).toFixed(1)}%
              </Text>
            </HStack>
          </Flex>
        ))}
      </VStack>
    </HStack>
  );
}

/* ─── Pending rent requests ─── */
function PendingRentList({ items }: { items: ILandlordPendingRentRequest[] }) {
  if (items.length === 0) return <EmptyState label="No pending rent requests" />;

  return (
    <VStack align="stretch" divideY="1px" borderColor="border.muted">
      {items.map((item) => (
        <HStack key={item.id} gap={3} py={3}>
          <Avatar.Root size="sm" flexShrink={0}>
            {item.tenant.profilePicture && <Avatar.Image src={profileImageUrl(item.tenant.profilePicture)} />}
            <Avatar.Fallback name={item.tenant.username} fontSize="xs" fontWeight="semibold" />
          </Avatar.Root>
          <Box minW={0} flex={1}>
            <Text fontSize="sm" fontWeight="medium" color="fg" truncate>
              {item.tenant.username}
            </Text>
            <Text fontSize="xs" color="fg.muted" truncate>
              {item.property.title} · {item.durationMonths}mo
            </Text>
          </Box>
          <Text fontSize="sm" fontWeight="semibold" color="fg" fontVariantNumeric="tabular-nums" flexShrink={0}>
            {formatCurrency(item.amount)}
          </Text>
        </HStack>
      ))}
    </VStack>
  );
}

/* ─── Pending visit bookings ─── */
function VisitBookingList({ items }: { items: ILandlordVisitBooking[] }) {
  if (items.length === 0) return <EmptyState label="No pending visit bookings" />;

  return (
    <VStack align="stretch" divideY="1px" borderColor="border.muted">
      {items.map((item) => (
        <HStack key={item.id} gap={3} py={3}>
          <Avatar.Root size="sm" flexShrink={0}>
            {item.tenant.profilePicture && <Avatar.Image src={profileImageUrl(item.tenant.profilePicture)} />}
            <Avatar.Fallback name={item.tenant.username} fontSize="xs" fontWeight="semibold" />
          </Avatar.Root>
          <Box minW={0} flex={1}>
            <Text fontSize="sm" fontWeight="medium" color="fg" truncate>
              {item.tenant.username}
            </Text>
            <Text fontSize="xs" color="fg.muted" truncate>
              {item.property.title}
            </Text>
            <Text fontSize="xs" color="fg.muted" truncate>
              {formatSchedule(item.schedules)}
            </Text>
          </Box>
        </HStack>
      ))}
    </VStack>
  );
}

/* ─── Withdrawals ─── */
function WithdrawalList({ items }: { items: ILandlordWithdrawal[] }) {
  if (items.length === 0) return <EmptyState label="No withdrawal requests yet" />;

  return (
    <VStack align="stretch" divideY="1px" borderColor="border.muted">
      {items.map((item) => (
        <HStack key={item.id} justify="space-between" gap={3} py={3}>
          <Box minW={0}>
            <Text fontSize="sm" fontWeight="medium" color="fg" truncate>
              {formatCurrency(item.amount)}
            </Text>
            <Text fontSize="xs" color="fg.muted" truncate>
              {item.paymentMethod} · {formateDate(item.createdAt)}
            </Text>
          </Box>
          <Badge variant="subtle" colorPalette={STATUS_BADGE[item.status] ?? "gray"} borderRadius="full" size="sm" px={2.5}>
            {item.status}
          </Badge>
        </HStack>
      ))}
    </VStack>
  );
}

export function Dashboard() {
  const { data, isPending, isError, error, refetch, isFetching } = useGetLandlordDashboard();

  if (isPending) {
    return (
      <Center minH="40vh">
        <VStack gap={4}>
          <Spinner color="teal.500" size="xl" borderWidth="3px" />
          <Text color="fg.muted" fontSize="sm">
            Loading dashboard...
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
            {getApiErrorMessage(error, "Could not load the dashboard")}
          </Text>
          <Button size="sm" variant="outline" borderRadius="lg" onClick={() => refetch()}>
            Try again
          </Button>
        </VStack>
      </Center>
    );
  }

  const { cards } = data;

  return (
    <Stack gap="6">
      <Flex alignItems={{ base: "start", md: "center" }} justify="space-between" gap="4" wrap="wrap">
        <Box>
          <Text fontSize="xl" fontWeight="bold" color="fg">
            Landlord Dashboard
          </Text>
          <Text fontSize="sm" color="fg.muted">
            Your listings, earnings, tenants, and requests at a glance.
          </Text>
        </Box>
        <Button size="sm" variant="outline" borderRadius="lg" loading={isFetching} onClick={() => refetch()}>
          <LuRefreshCw />
          Refresh
        </Button>
      </Flex>

      <Grid templateColumns={{ base: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" }} gap={4}>
        <StatCard label="Total Properties" value={cards.totalProperties.toLocaleString()} hint="Listings you manage" palette="blue" icon={LuBuilding2} />
        <StatCard label="Active Tenants" value={cards.activeTenants.toLocaleString()} hint="Leases currently running" palette="purple" icon={LuKeyRound} />
        <StatCard
          label="Net Earnings"
          value={formatCurrency(cards.netEarnings)}
          hint={`${formatCurrency(data.wallet.balance)} in wallet`}
          palette="teal"
          icon={LuTrendingUp}
        />
        <StatCard
          label="Pending Requests"
          value={cards.pendingRequests.toLocaleString()}
          hint="Rent requests awaiting you"
          palette="orange"
          icon={LuFileText}
        />
      </Grid>

      <Grid templateColumns={{ base: "1fr", xl: "repeat(3, minmax(0, 1fr))" }} gap={4}>
        <Box gridColumn={{ xl: "span 2" }} bg="bg.panel" borderRadius="xl" border="1px solid" borderColor="border.muted" p={5}>
          <Flex justify="space-between" align="flex-start" gap={3} mb={4} wrap="wrap">
            <Box>
              <Text fontSize="sm" fontWeight="semibold" color="fg">
                Net Earnings
              </Text>
              <Text fontSize="xs" color="fg.muted" mt={0.5}>
                Released payouts over the last 12 months.
              </Text>
            </Box>
            <HStack gap={{ base: 4, md: 6 }}>
              <Box>
                <Text fontSize="xs" color="fg.muted">
                  This month
                </Text>
                <Text fontSize="sm" fontWeight="semibold" color="fg" fontVariantNumeric="tabular-nums">
                  {formatCurrency(data.earnings.thisMonth)}
                </Text>
              </Box>
              <Box>
                <Text fontSize="xs" color="fg.muted">
                  All time
                </Text>
                <Text fontSize="sm" fontWeight="semibold" color="fg" fontVariantNumeric="tabular-nums">
                  {formatCurrency(data.earnings.total)}
                </Text>
              </Box>
            </HStack>
          </Flex>
          <EarningsChart data={data.earnings.series} />
        </Box>

        <Panel title="Occupancy" subtitle="Listings by availability">
          <OccupancyChart data={data.occupancy} />
          <HStack mt={4} pt={4} borderTop="1px solid" borderColor="border.muted" justify="space-between">
            <HStack gap={2} color="fg.muted">
              <Icon as={LuWallet} boxSize={4} />
              <Text fontSize="xs">Escrow held</Text>
            </HStack>
            <Text fontSize="sm" fontWeight="semibold" color="fg" fontVariantNumeric="tabular-nums">
              {formatCurrency(data.wallet.escrowHeld)}
            </Text>
          </HStack>
        </Panel>
      </Grid>

      <Grid templateColumns={{ base: "1fr", xl: "repeat(3, minmax(0, 1fr))" }} gap={4}>
        <Panel
          title="Pending Rent Requests"
          subtitle="Newest first"
          action={
            <Badge colorPalette="orange" variant="subtle" borderRadius="full" size="sm">
              {cards.pendingRequests}
            </Badge>
          }
        >
          <PendingRentList items={data.pendingRentRequests} />
        </Panel>

        <Panel
          title="Pending Visit Bookings"
          subtitle="Newest first"
          action={
            <Badge colorPalette="blue" variant="subtle" borderRadius="full" size="sm">
              <Icon as={LuCalendarDays} boxSize={3} />
              {data.pendingVisitBookings.length}
            </Badge>
          }
        >
          <VisitBookingList items={data.pendingVisitBookings} />
        </Panel>

        <Panel
          title="Withdrawals"
          subtitle="Your recent payout requests"
          action={
            <Badge colorPalette="purple" variant="subtle" borderRadius="full" size="sm">
              <Icon as={LuArrowUpFromLine} boxSize={3} />
              {data.withdrawals.length}
            </Badge>
          }
        >
          <WithdrawalList items={data.withdrawals} />
        </Panel>
      </Grid>
    </Stack>
  );
}
