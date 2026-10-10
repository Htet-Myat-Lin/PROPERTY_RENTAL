import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Icon,
  Menu,
  Portal,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useSearchParams } from "react-router";
import { LuFileText, LuFilter, LuX } from "react-icons/lu";
import { useAppStore } from "@/app/store";
import { getApiErrorMessage } from "@/utils/api-error";
import { Pagination } from "@/features/property/components/property-listing/Pagination";
import { useGetRentRequests } from "../hooks/useGetRentRequests";
import { DecisionDialog } from "./DecisionDialog";
import { RentRequestDialog } from "./RentRequestDialog";
import { RentRequestTable } from "./RentRequestTable";
import { RENT_REQUEST_STATUS_OPTIONS } from "../schema";
import type { IRentRequest, RentRequestStatus } from "../types";

const PAGE_LIMIT = 10;

export function RentRequestList() {
  const user = useAppStore((s) => s.user);
  const isLandlord = user?.role === "LANDLORD";

  // Page and filter live in the URL so the list survives a refresh or a shared link.
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const statusValue = (searchParams.get("status") ?? "") as RentRequestStatus | "";
  const propertyId = searchParams.get("propertyId") ?? undefined;

  const [editing, setEditing] = useState<IRentRequest | null>(null);
  const [decision, setDecision] = useState<{ type: "approve" | "reject"; request: IRentRequest } | null>(null);

  const filters = {
    page,
    limit: PAGE_LIMIT,
    status: statusValue || undefined,
    propertyId,
  };

  const { data, isPending, isError, error } = useGetRentRequests(user?.role, filters);
  const rentRequests = data?.items ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalCount = data?.totalCount ?? 0;

  const updateParams = (key: string, value: string) => {
    setSearchParams((prev) => {
      if (value) prev.set(key, value);
      else prev.delete(key);
      if (key !== "page") prev.set("page", "1");
      return prev;
    });
  };

  const resetFilters = () => setSearchParams({});

  return (
    <Stack gap="6">
      {/* ─── Page Header ─── */}
      <Flex alignItems={{ base: "start", md: "center" }} justify="space-between" gap="4" wrap="wrap">
        <Box>
          <HStack gap={2} mb={1}>
            <Icon as={LuFileText} boxSize={6} color="blue.500" />
            <Text fontSize="xl" fontWeight="bold" color="fg">
              Rent Requests
            </Text>
          </HStack>
          <Text fontSize="sm" color="fg.muted">
            {isLandlord
              ? "Review applications, take deposits into escrow, and release funds once the tenant moves in"
              : "Track the properties you have applied to rent and manage your security deposit"}
          </Text>
        </Box>

        {totalCount > 0 && (
          <Badge colorPalette="gray" variant="subtle" borderRadius="full" px={3} py={1}>
            {totalCount} request{totalCount === 1 ? "" : "s"}
          </Badge>
        )}
      </Flex>

      {/* ─── Filters ─── */}
      <Box bg="bg.panel" borderRadius="xl" border="1px solid" borderColor="border.muted" p={4}>
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={3}
          align={{ base: "stretch", md: "center" }}
          justify="space-between"
        >
          {propertyId && (
            <HStack gap={2}>
              <Badge variant="subtle" colorPalette="blue" borderRadius="full" px={3} py={1}>
                Filtered to one property
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                borderRadius="lg"
                color="fg.muted"
                onClick={resetFilters}
                gap={1}
              >
                <Icon as={LuX} boxSize={4} />
                Clear
              </Button>
            </HStack>
          )}

          {!propertyId && (
            <HStack wrap="wrap" gap="2">
              <Menu.Root>
                <Menu.Trigger asChild>
                  <Button variant="outline" size="sm" borderRadius="lg" gap={2}>
                    <Icon as={LuFilter} boxSize={4} />
                    {statusValue
                      ? RENT_REQUEST_STATUS_OPTIONS.find((s) => s.value === statusValue)?.label
                      : "Status"}
                  </Button>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content minW="10rem" bg="bg.panel" borderRadius="lg">
                      <Menu.RadioItemGroup
                        value={statusValue}
                        onValueChange={(e) => updateParams("status", e.value)}
                      >
                        {RENT_REQUEST_STATUS_OPTIONS.map((item) => (
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

              {statusValue && (
                <Button
                  variant="ghost"
                  size="sm"
                  borderRadius="lg"
                  color="fg.muted"
                  onClick={resetFilters}
                  gap={1}
                >
                  <Icon as={LuX} boxSize={4} />
                  Clear
                </Button>
              )}
            </HStack>
          )}
        </Flex>
      </Box>

      {/* ─── Content ─── */}
      {isPending ? (
        <Center minH="40vh">
          <VStack gap={4}>
            <Spinner color="blue.500" size="xl" borderWidth="3px" />
            <Text color="fg.muted" fontSize="sm">
              Loading rent requests...
            </Text>
          </VStack>
        </Center>
      ) : isError ? (
        <Center minH="30vh" borderWidth="1px" borderColor="border.muted" borderRadius="xl" p={8}>
          <Text color="red.500" fontSize="sm" textAlign="center">
            {getApiErrorMessage(error, "Could not load rent requests")}
          </Text>
        </Center>
      ) : rentRequests.length === 0 ? (
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
            <Icon as={LuFileText} boxSize={7} color="blue.500" />
          </Box>
          <VStack gap={1}>
            <Text fontWeight="semibold" color="fg">
              No rent requests found
            </Text>
            <Text color="fg.muted" fontSize="sm" textAlign="center">
              {propertyId || statusValue
                ? "Try adjusting your filters"
                : isLandlord
                  ? "No one has applied to rent your properties yet"
                  : "Browse listings and request to rent a place to get started"}
            </Text>
          </VStack>
          {(propertyId || statusValue) && (
            <Button size="sm" variant="outline" borderRadius="lg" onClick={resetFilters}>
              Reset Filters
            </Button>
          )}
        </Center>
      ) : (
        <Box
          bg="bg.panel"
          borderRadius="xl"
          border="1px solid"
          borderColor="border.muted"
          overflow="hidden"
        >
          <RentRequestTable
            items={rentRequests}
            mode={isLandlord ? "landlord" : "tenant"}
            onEdit={setEditing}
            onDecide={setDecision}
          />
        </Box>
      )}

      {totalPages > 1 && (
        <Box borderWidth="1px" borderColor="border.muted" borderRadius="xl">
          <Pagination page={page} totalPages={totalPages} onPageChange={(p) => updateParams("page", String(p))} />
        </Box>
      )}

      {editing && (
        <RentRequestDialog
          isOpen
          onClose={() => setEditing(null)}
          propertyId={editing.propertyId}
          baseRentPrice={editing.property.baseRentPrice}
          request={editing}
        />
      )}

      <DecisionDialog
        key={decision ? `${decision.type}-${decision.request.id}` : "closed"}
        request={decision?.request ?? null}
        action={decision?.type ?? null}
        tenantName={decision?.request.user?.username}
        onClose={() => setDecision(null)}
      />
    </Stack>
  );
}