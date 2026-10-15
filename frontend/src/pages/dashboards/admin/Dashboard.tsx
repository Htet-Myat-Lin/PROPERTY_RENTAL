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
  Image,
  Progress,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { ElementType, ReactNode } from "react";
import {
  LuArrowDownToLine,
  LuArrowUpFromLine,
  LuBuilding2,
  LuKeyRound,
  LuLock,
  LuRefreshCw,
  LuStar,
  LuTrendingUp,
  LuUsers,
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
import { useGetAdminDashboard } from "@/features/platform/hooks/useGetAdminDashboard";
import type {
  IAdminDashboard,
  IChartCount,
  IPendingRequestItem,
  ITopRatedProperty,
} from "@/features/platform/types";
import { getApiErrorMessage } from "@/utils/api-error";
import { formatCurrency } from "@/utils/format-currency";
import { formateDate } from "@/utils/format-date";

const propertyImageUrl = (image: string) =>
  `${import.meta.env.VITE_FILE_URL}/property-images/${image}`;

const REQUEST_COLORS: Record<string, string> = {
  PENDING: "orange",
  APPROVED: "green",
  REJECTED: "red",
  CANCELLED: "gray",
};

const PROPERTY_STATUS_COLORS: Record<string, string> = {
  AVAILABLE: "green",
  RENTED: "blue",
  RESERVED: "orange",
};

const PROPERTY_TYPE_COLORS: Record<string, string> = {
  Apartment: "blue",
  House: "teal",
  Condo: "purple",
  Villa: "pink",
};

const ROLE_COLORS: Record<string, string> = {
  TENANT: "blue",
  LANDLORD: "teal",
  ADMIN: "purple",
};

const STATUS_BADGE: Record<string, string> = {
  AVAILABLE: "green",
  RENTED: "blue",
  RESERVED: "orange",
};

const percentOf = (value: number, total: number) => (total > 0 ? (value / total) * 100 : 0);

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

/* ─── Count + percentage bar list ─── */
function RatioList({ items }: { items: { label: string; count: number; palette: string }[] }) {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  if (total === 0) {
    return (
      <Text fontSize="sm" color="fg.muted" py={4} textAlign="center">
        No data yet
      </Text>
    );
  }

  return (
    <VStack align="stretch" gap={4}>
      {items.map((item) => {
        const percent = percentOf(item.count, total);
        return (
          <Box key={item.label}>
            <Flex justify="space-between" align="center" gap={3} mb={1.5}>
              <HStack gap={2} minW={0}>
                <Box boxSize="2.5" borderRadius="full" bg={`${item.palette}.solid`} flexShrink={0} />
                <Text fontSize="sm" color="fg.subtle" truncate>
                  {item.label}
                </Text>
              </HStack>
              <HStack gap={2} flexShrink={0}>
                <Text fontSize="sm" fontWeight="semibold" color="fg" fontVariantNumeric="tabular-nums">
                  {item.count.toLocaleString()}
                </Text>
                <Text fontSize="xs" color="fg.muted" fontVariantNumeric="tabular-nums" minW="42px" textAlign="right">
                  {percent.toFixed(1)}%
                </Text>
              </HStack>
            </Flex>
            <Progress.Root value={percent} size="sm" colorPalette={item.palette}>
              <Progress.Track>
                <Progress.Range />
              </Progress.Track>
            </Progress.Root>
          </Box>
        );
      })}
    </VStack>
  );
}

/* ─── Monthly revenue area chart ─── */
function RevenueChart({ data }: { data: IAdminDashboard["revenueOverview"] }) {
  const chart = useChart({
    data,
    series: [
      { name: "deposits", color: "blue.solid", label: "Deposits" },
      { name: "revenue", color: "teal.solid", label: "Commission" },
    ],
  });

  return (
    <Chart.Root h={{ base: "240px", md: "300px" }} chart={chart}>
      <AreaChart data={chart.data} responsive>
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
            fill={chart.color(item.color)}
            fillOpacity={0.2}
            stroke={chart.color(item.color)}
          />
        ))}
      </AreaChart>
    </Chart.Root>
  );
}

/* ─── Rent request status donut + legend ─── */
function RentRequestChart({ data }: { data: IChartCount[] }) {
  const chart = useChart({
    data: data.map((item) => ({
      name: item.label,
      value: item.count,
      color: `${REQUEST_COLORS[item.label] ?? "gray"}.solid`,
    })),
  });

  const total = data.reduce((sum, item) => sum + item.count, 0);

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
              <Box boxSize="2.5" borderRadius="full" bg={`${REQUEST_COLORS[item.label] ?? "gray"}.solid`} flexShrink={0} />
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

/* ─── Pending request list ─── */
function PendingRequestList({
  items,
  emptyLabel,
}: {
  items: IPendingRequestItem[];
  emptyLabel: string;
}) {
  if (items.length === 0) {
    return (
      <Center py={8}>
        <Text fontSize="sm" color="fg.muted">
          {emptyLabel}
        </Text>
      </Center>
    );
  }

  return (
    <VStack align="stretch" divideY="1px" borderColor="border.muted">
      {items.map((item) => (
        <HStack key={item.id} justify="space-between" gap={3} py={3}>
          <HStack gap={3} minW={0}>
            <Avatar.Root size="sm" flexShrink={0}>
              <Avatar.Fallback name={item.user.username} fontSize="xs" fontWeight="semibold" />
            </Avatar.Root>
            <Box minW={0}>
              <Text fontSize="sm" fontWeight="medium" color="fg" truncate>
                {item.user.username}
              </Text>
              <Text fontSize="xs" color="fg.muted" truncate>
                {item.paymentMethod} · {formateDate(item.createdAt)}
              </Text>
            </Box>
          </HStack>
          <Text fontSize="sm" fontWeight="semibold" color="fg" fontVariantNumeric="tabular-nums" flexShrink={0}>
            {formatCurrency(item.amount)}
          </Text>
        </HStack>
      ))}
    </VStack>
  );
}

/* ─── Top rated properties list ─── */
function TopRatedList({ items }: { items: ITopRatedProperty[] }) {
  if (items.length === 0) {
    return (
      <Center py={8}>
        <Text fontSize="sm" color="fg.muted">
          No reviews yet
        </Text>
      </Center>
    );
  }

  return (
    <VStack align="stretch" divideY="1px" borderColor="border.muted">
      {items.map((property, index) => (
        <HStack key={property.id} gap={3} py={3}>
          <Text fontSize="sm" fontWeight="bold" color="fg.muted" w="18px" textAlign="center" flexShrink={0}>
            {index + 1}
          </Text>
          <Box boxSize="44px" borderRadius="lg" overflow="hidden" bg="bg.subtle" flexShrink={0}>
            {property.image ? (
              <Image src={propertyImageUrl(property.image)} alt={property.title} w="full" h="full" objectFit="cover" />
            ) : (
              <Center h="full" color="fg.muted">
                <Icon as={LuBuilding2} boxSize={4} />
              </Center>
            )}
          </Box>
          <Box minW={0} flex={1}>
            <Text fontSize="sm" fontWeight="medium" color="fg" truncate>
              {property.title}
            </Text>
            <HStack gap={1} fontSize="xs" color="fg.muted">
              <Icon as={LuStar} boxSize={3} color="orange.400" />
              <Text fontWeight="semibold">{property.averageRating.toFixed(1)}</Text>
              <Text>· {property.reviewCount} review{property.reviewCount === 1 ? "" : "s"}</Text>
            </HStack>
          </Box>
          <Badge
            variant="subtle"
            colorPalette={STATUS_BADGE[property.status] ?? "gray"}
            borderRadius="full"
            size="sm"
            px={2.5}
            flexShrink={0}
          >
            {property.status}
          </Badge>
        </HStack>
      ))}
    </VStack>
  );
}

export function Dashboard() {
  const { data, isPending, isError, error, refetch, isFetching } = useGetAdminDashboard();

  if (isPending) {
    return (
      <Center minH="40vh">
        <VStack gap={4}>
          <Spinner color="blue.500" size="xl" borderWidth="3px" />
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

  const platformActivityItems = [
    {
      label: "Pending visit bookings",
      count: data.platformActivity.pendingVisitBookings,
      palette: "orange",
    },
    { label: "Active chats", count: data.platformActivity.activeChats, palette: "blue" },
    { label: "Reviews", count: data.platformActivity.totalReviews, palette: "purple" },
  ];

  return (
    <Stack gap="6">
      {/* ─── Page Header ─── */}
      <Flex alignItems={{ base: "start", md: "center" }} justify="space-between" gap="4" wrap="wrap">
        <Box>
          <Text fontSize="xl" fontWeight="bold" color="fg">
            Admin Dashboard
          </Text>
          <Text fontSize="sm" color="fg.muted">
            A live snapshot of users, listings, escrow, and platform activity.
          </Text>
        </Box>
        <Button
          size="sm"
          variant="outline"
          borderRadius="lg"
          loading={isFetching}
          onClick={() => refetch()}
        >
          <LuRefreshCw />
          Refresh
        </Button>
      </Flex>

      {/* ─── Summary cards ─── */}
      <Grid templateColumns={{ base: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" }} gap={4}>
        <StatCard
          label="Total Users"
          value={cards.totalUsers.toLocaleString()}
          hint="Tenants, landlords and admins"
          palette="blue"
          icon={LuUsers}
        />
        <StatCard
          label="Total Properties"
          value={cards.totalProperties.toLocaleString()}
          hint="All listings on the platform"
          palette="teal"
          icon={LuBuilding2}
        />
        <StatCard
          label="Active Rentals"
          value={cards.activeRentals.toLocaleString()}
          hint="Approved rentals still running"
          palette="purple"
          icon={LuKeyRound}
        />
        <StatCard
          label="Commission Earned"
          value={formatCurrency(cards.commissionEarned)}
          hint="Released from completed escrows"
          palette="green"
          icon={LuTrendingUp}
        />
        <StatCard
          label="Escrow Held"
          value={formatCurrency(cards.escrowHeld)}
          hint="Deposits awaiting release or refund"
          palette="orange"
          icon={LuLock}
        />
        <StatCard
          label="Total Wallet Balance"
          value={formatCurrency(cards.totalWalletBalance)}
          hint="Across every user wallet"
          palette="cyan"
          icon={LuWallet}
        />
        <StatCard
          label="Pending Deposits"
          value={cards.pendingDeposits.count.toLocaleString()}
          hint={`${formatCurrency(cards.pendingDeposits.amount)} awaiting approval`}
          palette="yellow"
          icon={LuArrowDownToLine}
        />
        <StatCard
          label="Pending Withdrawals"
          value={cards.pendingWithdrawals.count.toLocaleString()}
          hint={`${formatCurrency(cards.pendingWithdrawals.amount)} awaiting payout`}
          palette="red"
          icon={LuArrowUpFromLine}
        />
      </Grid>

      {/* ─── Charts ─── */}
      <Grid templateColumns={{ base: "1fr", xl: "repeat(3, minmax(0, 1fr))" }} gap={4}>
        <Box gridColumn={{ xl: "span 2" }} bg="bg.panel" borderRadius="xl" border="1px solid" borderColor="border.muted" p={5}>
          <Box mb={4}>
            <Text fontSize="sm" fontWeight="semibold" color="fg">
              Revenue Overview
            </Text>
            <Text fontSize="xs" color="fg.muted" mt={0.5}>
              Monthly deposits collected and commission earned over the last 12 months.
            </Text>
          </Box>
          <RevenueChart data={data.revenueOverview} />
        </Box>

        <Panel title="Rent Requests" subtitle="Requests by current status">
          <RentRequestChart data={data.rentRequests} />
        </Panel>
      </Grid>

      {/* ─── Ratio breakdowns ─── */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, minmax(0, 1fr))" }} gap={4}>
        <Panel title="Property Status" subtitle="Listings by availability">
          <RatioList
            items={data.propertyStatus.map((item) => ({
              label: item.label,
              count: item.count,
              palette: PROPERTY_STATUS_COLORS[item.label] ?? "gray",
            }))}
          />
        </Panel>
        <Panel title="Property Types" subtitle="Listings by category">
          <RatioList
            items={data.propertyTypes.map((item) => ({
              label: item.label,
              count: item.count,
              palette: PROPERTY_TYPE_COLORS[item.label] ?? "gray",
            }))}
          />
        </Panel>
        <Panel title="Users by Role" subtitle="Accounts on the platform">
          <RatioList
            items={data.usersByRole.map((item) => ({
              label: item.label,
              count: item.count,
              palette: ROLE_COLORS[item.label] ?? "gray",
            }))}
          />
        </Panel>
        <Panel title="Platform Activity" subtitle="Counts and share of total activity">
          <RatioList items={platformActivityItems} />
        </Panel>
      </Grid>

      {/* ─── Pending queues & top rated ─── */}
      <Grid templateColumns={{ base: "1fr", xl: "repeat(3, minmax(0, 1fr))" }} gap={4}>
        <Panel
          title="Pending Deposit Requests"
          subtitle="Newest first"
          action={
            <Badge colorPalette="yellow" variant="subtle" borderRadius="full" size="sm">
              {cards.pendingDeposits.count}
            </Badge>
          }
        >
          <PendingRequestList items={data.pendingDepositRequests} emptyLabel="No pending deposit requests" />
        </Panel>

        <Panel
          title="Pending Withdrawal Requests"
          subtitle="Newest first"
          action={
            <Badge colorPalette="red" variant="subtle" borderRadius="full" size="sm">
              {cards.pendingWithdrawals.count}
            </Badge>
          }
        >
          <PendingRequestList items={data.pendingWithdrawalRequests} emptyLabel="No pending withdrawal requests" />
        </Panel>

        <Panel title="Top Rated Properties" subtitle="Highest average rating">
          <TopRatedList items={data.topRatedProperties} />
        </Panel>
      </Grid>
    </Stack>
  );
}
