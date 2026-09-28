import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Icon,
  IconButton,
  Input,
  Menu,
  Portal,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { LuFilter, LuHandCoins, LuX } from "react-icons/lu";
import { useState } from "react";
import { useSearchParams } from "react-router";
import { getApiErrorMessage } from "@/utils/api-error";
import { Pagination } from "@/features/property/components/property-listing/Pagination";
import { useGetAllDepositRequests } from "../hooks/useGetAllDepositRequests";
import { DepositRequestTable } from "./DepositRequestTable";
import type { DepositRequestFilters, DepositRequestStatus } from "../types";

const PAGE_LIMIT = 10;

const statuses: { label: string; value: DepositRequestStatus | "" }[] = [
  { label: "All", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

export function DepositRequestList() {
  // Manage URL params
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const statusValue = (searchParams.get("status") ?? "") as DepositRequestStatus | "";
  const searchValue = searchParams.get("search") ?? "";

  const [searchInput, setSearchInput] = useState(searchValue);

  const filters: DepositRequestFilters = {
    page,
    limit: PAGE_LIMIT,
    status: statusValue || undefined,
    search: searchValue || undefined,
  };

  // Any filter change restarts at page 1
  const updateParams = (key: string, value: string) => {
    setSearchParams((prev) => {
      if (value) {
        prev.set(key, value);
      } else {
        prev.delete(key);
      }
      if (key !== "page") {
        prev.set("page", "1");
      }
      return prev;
    });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set("page", newPage.toString());
      return prev;
    });
  };

  const resetFilters = () => {
    setSearchInput("");
    setSearchParams({});
  };

  const { data, isPending, isError, error } = useGetAllDepositRequests(filters);
  const depositRequests = data?.items ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalCount = data?.totalCount ?? 0;
  const hasActiveFilters = Boolean(statusValue || searchValue);

  return (
    <Stack gap="6">
      {/* ─── Page Header ─── */}
      <Flex alignItems={{ base: "start", md: "center" }} justify="space-between" gap="4" wrap="wrap">
        <Box>
          <HStack gap={2} mb={1}>
            <Icon as={LuHandCoins} boxSize={6} color="blue.500" />
            <Text fontSize="xl" fontWeight="bold" color="fg">
              Deposit Requests
            </Text>
          </HStack>
          <Text fontSize="sm" color="fg.muted">
            Review tenant top-ups and approve them to credit their wallet
          </Text>
        </Box>

        {totalCount > 0 && (
          <Badge colorPalette="gray" variant="subtle" borderRadius="full" px={3} py={1}>
            {totalCount} request{totalCount === 1 ? "" : "s"}
          </Badge>
        )}
      </Flex>

      {/* ─── Filters & Search Bar ─── */}
      <Box bg="bg.panel" borderRadius="xl" border="1px solid" borderColor="border.muted" p={4}>
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={3}
          align={{ base: "stretch", md: "center" }}
          justify="space-between"
        >
          <HStack gap="0" flex={1} maxW={{ md: "320px" }}>
            <Input
              placeholder="Search reference, tenant..."
              size="sm"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && updateParams("search", searchInput)}
              borderRightRadius="0"
              borderRadius="lg"
              bg="bg.subtle"
              _dark={{ bg: "whiteAlpha.50" }}
            />
            <IconButton
              aria-label="Search"
              size="sm"
              onClick={() => updateParams("search", searchInput)}
              borderLeftRadius="0"
              borderRightRadius="lg"
              variant="solid"
              colorPalette="blue"
            >
              <FaSearch />
            </IconButton>
          </HStack>

          <HStack wrap="wrap" gap="2">
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button variant="outline" size="sm" borderRadius="lg" gap={2}>
                  <Icon as={LuFilter} boxSize={4} />
                  {statusValue ? statuses.find((s) => s.value === statusValue)?.label : "Status"}
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content minW="10rem" bg="bg.panel" borderRadius="lg">
                    <Menu.RadioItemGroup
                      value={statusValue}
                      onValueChange={(e) => updateParams("status", e.value)}
                    >
                      {statuses.map((item) => (
                        <Menu.RadioItem key={item.label} value={item.value}>
                          {item.label}
                          <Menu.ItemIndicator />
                        </Menu.RadioItem>
                      ))}
                    </Menu.RadioItemGroup>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" borderRadius="lg" color="fg.muted" onClick={resetFilters} gap={1}>
                <Icon as={LuX} boxSize={4} />
                Clear
              </Button>
            )}
          </HStack>
        </Flex>
      </Box>

      {/* ─── Content Section ─── */}
      {isPending ? (
        <Center minH="40vh">
          <VStack gap={4}>
            <Spinner color="blue.500" size="xl" borderWidth="3px" />
            <Text color="fg.muted" fontSize="sm">
              Loading deposit requests...
            </Text>
          </VStack>
        </Center>
      ) : isError ? (
        <Center
          minH="30vh"
          borderWidth="1px"
          borderColor="border.muted"
          borderRadius="xl"
          p={8}
        >
          <Text color="red.500" fontSize="sm" textAlign="center">
            {getApiErrorMessage(error, "Could not load deposit requests")}
          </Text>
        </Center>
      ) : depositRequests.length === 0 ? (
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
            <Icon as={LuHandCoins} boxSize={7} color="blue.500" />
          </Box>
          <VStack gap={1}>
            <Text fontWeight="semibold" color="fg">
              No deposit requests found
            </Text>
            <Text color="fg.muted" fontSize="sm" textAlign="center">
              {hasActiveFilters ? "Try adjusting your filters or search terms" : "Nothing to review right now"}
            </Text>
          </VStack>
          {hasActiveFilters && (
            <Button size="sm" variant="outline" borderRadius="lg" onClick={resetFilters}>
              Reset Filters
            </Button>
          )}
        </Center>
      ) : (
        <Box bg="bg.panel" borderRadius="xl" border="1px solid" borderColor="border.muted" overflow="hidden">
          <DepositRequestTable items={depositRequests} />
        </Box>
      )}

      {/* ─── Pagination ─── */}
      {totalPages > 1 && (
        <Box borderWidth="1px" borderColor="border.muted" borderRadius="xl">
          <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </Box>
      )}
    </Stack>
  );
}
