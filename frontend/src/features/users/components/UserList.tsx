import {
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Icon,
  Input,
  Menu,
  Portal,
  Spinner,
  Stack,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { LuFilter, LuSearch, LuUsers, LuX } from "react-icons/lu";
import { useGetAdminUsers } from "../hooks/useGetAdminUsers";
import { Pagination } from "@/features/property/components/property-listing/Pagination";
import { getApiErrorMessage } from "@/utils/api-error";
import { formatCurrency } from "@/utils/format-currency";
import { formateDate } from "@/utils/format-date";
import type { IAdminUser } from "../types";

const PAGE_LIMIT = 10;

const ROLE_OPTIONS = [
  { label: "All roles", value: "" },
  { label: "Tenant", value: "TENANT" },
  { label: "Landlord", value: "LANDLORD" },
  { label: "Admin", value: "ADMIN" },
];

const ROLE_BADGE: Record<string, string> = {
  TENANT: "blue",
  LANDLORD: "teal",
  ADMIN: "purple",
};

const columnHeaderProps = {
  fontWeight: "semibold",
  fontSize: "xs",
  textTransform: "uppercase",
  letterSpacing: "wider",
  color: "fg.muted",
} as const;

const profileImageUrl = (picture: string) =>
  `${import.meta.env.VITE_FILE_URL}/profile-images/${picture}`;

export function UserList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const roleValue = searchParams.get("role") ?? "";
  const searchParam = searchParams.get("q") ?? "";

  const [searchInput, setSearchInput] = useState(searchParam);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // setSearchParams is recreated on every URL change, so keying a debounce
  // effect off it would re-run after each pagination click and reset the page
  // back to 1. Debounce from the input handler instead; `value` is the full
  // input text captured when typing goes idle.
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setSearchParams((prev) => {
        if (value) prev.set("q", value);
        else prev.delete("q");
        prev.set("page", "1");
        return prev;
      });
    }, 400);
  };

  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  useEffect(
    () => () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    },
    [],
  );

  const updateParams = (key: string, value: string) => {
    setSearchParams((prev) => {
      if (value) prev.set(key, value);
      else prev.delete(key);
      if (key !== "page") prev.set("page", "1");
      return prev;
    });
  };

  const hasFilters = Boolean(searchParam || roleValue);

  const { data, isPending, isError, error } = useGetAdminUsers({
    page,
    limit: PAGE_LIMIT,
    search: searchParam || undefined,
    role: roleValue || undefined,
  });

  const users = data?.users ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalCount = data?.totalCount ?? 0;

  return (
    <Stack gap="6">
      <Flex alignItems={{ base: "start", md: "center" }} justify="space-between" gap="4" wrap="wrap">
        <Box>
          <HStack gap={2} mb={1}>
            <Icon as={LuUsers} boxSize={6} color="blue.500" />
            <Text fontSize="xl" fontWeight="bold" color="fg">
              Users
            </Text>
          </HStack>
          <Text fontSize="sm" color="fg.muted">
            Every tenant, landlord, and admin account on the platform.
          </Text>
        </Box>
        {totalCount > 0 && (
          <Badge colorPalette="gray" variant="subtle" borderRadius="full" px={3} py={1}>
            {totalCount} user{totalCount === 1 ? "" : "s"}
          </Badge>
        )}
      </Flex>

      {/* ─── Filters ─── */}
      <Box bg="bg.panel" borderRadius="xl" border="1px solid" borderColor="border.muted" p={4}>
        <Flex direction={{ base: "column", md: "row" }} gap={3} align={{ base: "stretch", md: "center" }} justify="space-between">
          <HStack wrap="wrap" gap="2" flex={1}>
            <Box position="relative" flex={{ base: "1", md: "0 0 260px" }}>
              <Icon as={LuSearch} pos="absolute" left="3" top="50%" transform="translateY(-50%)" color="fg.muted" boxSize={4} pointerEvents="none" />
              <Input
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by name, email, or phone"
                borderRadius="lg"
                ps="10"
                size="sm"
              />
            </Box>

            <Menu.Root>
              <Menu.Trigger asChild>
                <Button variant="outline" size="sm" borderRadius="lg" gap={2}>
                  <Icon as={LuFilter} boxSize={4} />
                  {ROLE_OPTIONS.find((option) => option.value === roleValue)?.label ?? "Role"}
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content minW="10rem" bg="bg.panel" borderRadius="lg">
                    <Menu.RadioItemGroup value={roleValue} onValueChange={(e) => updateParams("role", e.value)}>
                      {ROLE_OPTIONS.map((option) => (
                        <Menu.RadioItem key={option.label} value={option.value}>
                          {option.label}
                          <Menu.ItemIndicator />
                        </Menu.RadioItem>
                      ))}
                    </Menu.RadioItemGroup>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>

            {hasFilters && (
              <Button variant="ghost" size="sm" borderRadius="lg" color="fg.muted" onClick={() => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current); setSearchInput(""); setSearchParams({ page: "1" }); }} gap={1}>
                <Icon as={LuX} boxSize={4} />
                Clear
              </Button>
            )}
          </HStack>
        </Flex>
      </Box>

      {/* ─── Content ─── */}
      {isPending ? (
        <Center minH="40vh">
          <VStack gap={4}>
            <Spinner color="blue.500" size="xl" borderWidth="3px" />
            <Text color="fg.muted" fontSize="sm">
              Loading users...
            </Text>
          </VStack>
        </Center>
      ) : isError ? (
        <Center minH="30vh" borderWidth="1px" borderColor="border.muted" borderRadius="xl" p={8}>
          <Text color="red.500" fontSize="sm" textAlign="center">
            {getApiErrorMessage(error, "Could not load users")}
          </Text>
        </Center>
      ) : users.length === 0 ? (
        <Center minH="30vh" borderWidth="2px" borderStyle="dashed" borderColor="border.muted" borderRadius="xl" p={8}>
          <VStack gap={1}>
            <Text fontWeight="semibold" color="fg">
              No users found
            </Text>
            <Text color="fg.muted" fontSize="sm" textAlign="center">
              {hasFilters ? "Try adjusting your search or role filter" : "No accounts have been created yet"}
            </Text>
          </VStack>
        </Center>
      ) : (
        <Box bg="bg.panel" borderRadius="xl" border="1px solid" borderColor="border.muted" overflow="hidden">
          <Box overflowX="auto">
            <Table.Root size="sm" variant="outline" showColumnBorder>
              <Table.Header>
                <Table.Row bg="bg.subtle" _dark={{ bg: "whiteAlpha.50" }}>
                  <Table.ColumnHeader {...columnHeaderProps}>User</Table.ColumnHeader>
                  <Table.ColumnHeader {...columnHeaderProps}>Role</Table.ColumnHeader>
                  <Table.ColumnHeader {...columnHeaderProps}>Verified</Table.ColumnHeader>
                  <Table.ColumnHeader {...columnHeaderProps}>Wallet</Table.ColumnHeader>
                  <Table.ColumnHeader {...columnHeaderProps}>Properties</Table.ColumnHeader>
                  <Table.ColumnHeader {...columnHeaderProps}>Active rentals</Table.ColumnHeader>
                  <Table.ColumnHeader {...columnHeaderProps}>Joined</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {users.map((user: IAdminUser) => (
                  <Table.Row key={user.id} transition="background 0.15s" _hover={{ bg: "bg.subtle", _dark: { bg: "whiteAlpha.50" } }}>
                    <Table.Cell>
                      <HStack gap={2}>
                        <Avatar.Root size="xs">
                          {user.profilePicture && <Avatar.Image src={profileImageUrl(user.profilePicture)} />}
                          <Avatar.Fallback name={user.username} />
                        </Avatar.Root>
                        <Box minW={0}>
                          <Text fontWeight="medium" fontSize="sm" lineClamp={1}>
                            {user.username}
                          </Text>
                          <Text fontSize="xs" color="fg.muted" lineClamp={1} maxW="220px">
                            {user.email}
                            {user.phone ? ` · ${user.phone}` : ""}
                          </Text>
                        </Box>
                      </HStack>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge variant="subtle" colorPalette={ROLE_BADGE[user.role] ?? "gray"} borderRadius="full" size="sm" px={3}>
                        {user.role}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge variant="subtle" colorPalette={user.isEmailVerified ? "green" : "gray"} borderRadius="full" size="sm" px={3}>
                        {user.isEmailVerified ? "Verified" : "Unverified"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Text fontSize="sm" fontVariantNumeric="tabular-nums">
                        {formatCurrency(user.walletBalance)}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text fontSize="sm">{user.propertyCount.toLocaleString()}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text fontSize="sm">{user.activeRentals.toLocaleString()}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text fontSize="sm" color="fg.muted">
                        {formateDate(user.createdAt)}
                      </Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        </Box>
      )}

      {totalPages > 1 && (
        <Box borderWidth="1px" borderColor="border.muted" borderRadius="xl">
          <Pagination page={page} totalPages={totalPages} onPageChange={(p) => updateParams("page", String(p))} />
        </Box>
      )}
    </Stack>
  );
}