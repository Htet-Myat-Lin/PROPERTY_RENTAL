"use client";

import { Badge, HStack, Icon, Text } from "@chakra-ui/react";
import { useState } from "react";
import { LuClock3, LuBanknote } from "react-icons/lu";
import { formateDate } from "@/utils/format-date";
import { formatCurrency } from "@/utils/format-currency";
import { useGetMyWithdrawalRequests } from "../hooks/useGetMyWithdrawalRequests";
import { PAYOUT_METHODS } from "../schema";
import type { WithdrawalRequestFilters, WithdrawalRequestStatus } from "../types";
import { ListRow, ListShell, type FilterOption } from "./ListShell";

const PAGE_LIMIT = 10;

const STATUS_META: Record<WithdrawalRequestStatus, { label: string; palette: string }> = {
    PENDING: { label: "Pending", palette: "orange" },
    APPROVED: { label: "Paid", palette: "green" },
    REJECTED: { label: "Rejected", palette: "red" },
};

const OPTIONS: FilterOption[] = [
    { label: "All requests", value: "" },
    { label: "Pending", value: "PENDING" },
    { label: "Approved", value: "APPROVED" },
    { label: "Rejected", value: "REJECTED" },
];

const methodLabels = Object.fromEntries(PAYOUT_METHODS.map((m) => [m.value, m.label]));

/** The user's own withdrawal requests, newest first, paginated server-side. */
export function MyWithdrawalRequestList() {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState<WithdrawalRequestStatus | "">("");

    const filters: WithdrawalRequestFilters = {
        page,
        limit: PAGE_LIMIT,
        status: status || undefined,
    };

    const query = useGetMyWithdrawalRequests(filters);
    const requests = query.data?.items ?? [];

    // Any filter change restarts at page 1, otherwise the offset is stale.
    const applyStatus = (value: string) => {
        setStatus(value as WithdrawalRequestStatus | "");
        setPage(1);
    };

    return (
        <ListShell
            title="Withdrawals"
            subtitle="Track the payouts you have requested"
            icon={LuBanknote}
            totalCount={query.data?.totalCount ?? 0}
            isPending={query.isPending}
            isError={query.isError}
            error={query.error}
            emptyMessage={status ? `No ${status.toLowerCase()} requests` : "You have not requested a payout yet"}
            page={page}
            totalPages={query.data?.totalPages ?? 0}
            onPageChange={setPage}
            filters={{
                activeValue: status || undefined,
                triggerLabel: "All requests",
                options: OPTIONS,
                onChange: applyStatus,
            }}
        >
            {requests.map((request) => {
                const meta = STATUS_META[request.status];

                return (
                    <ListRow
                        key={request.id}
                        title={
                            <HStack gap={2} minW={0}>
                                <Text truncate>{formatCurrency(request.amount)}</Text>
                                {request.status === "PENDING" && (
                                    <Icon as={LuClock3} boxSize={3.5} color="orange.500" flexShrink={0} />
                                )}
                            </HStack>
                        }
                        subtitle={`${methodLabels[request.paymentMethod] ?? request.paymentMethod} - ${formateDate(
                            request.createdAt
                        )}`}
                        amount={meta.label}
                        amountColor={`${meta.palette}.500`}
                        trailing={
                            <Badge
                                colorPalette={meta.palette}
                                variant="subtle"
                                borderRadius="full"
                                size="sm"
                                flexShrink={0}
                            >
                                {request.status}
                            </Badge>
                        }
                    />
                );
            })}
        </ListShell>
    );
}
