"use client";

import { Badge, HStack, Icon, Text } from "@chakra-ui/react";
import { useState } from "react";
import { LuArrowDownLeft, LuArrowUpRight, LuArrowLeftRight, LuReceipt } from "react-icons/lu";
import { formatCurrency } from "@/utils/format-currency";
import { useGetTransactions } from "../hooks/useGetTransactions";
import type { TransactionFilters, WalletTransactionType } from "../types";
import { ListRow, ListShell, type FilterOption } from "./ListShell";

const PAGE_LIMIT = 10;

const TYPE_META: Record<WalletTransactionType, { label: string; icon: typeof LuReceipt; palette: string }> = {
    DEPOSIT: { label: "Deposit", icon: LuArrowDownLeft, palette: "green" },
    WITHDRAWAL: { label: "Withdrawal", icon: LuArrowUpRight, palette: "red" },
    RENT_PAYMENT: { label: "Rent payment", icon: LuArrowUpRight, palette: "blue" },
    COMMISSION: { label: "Commission", icon: LuArrowLeftRight, palette: "purple" },
};

const OPTIONS: FilterOption[] = [
    { label: "All activity", value: "" },
    ...Object.entries(TYPE_META).map(([value, meta]) => ({ label: meta.label, value })),
];

/** Credit movements are incoming, everything else leaves the wallet. */
const isCredit = (type: WalletTransactionType) => type === "DEPOSIT";

const formatDateTime = (value: string) =>
    new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(new Date(value));

export function TransactionHistoryList() {
    const [page, setPage] = useState(1);
    const [type, setType] = useState<WalletTransactionType | "">("");

    const filters: TransactionFilters = {
        page,
        limit: PAGE_LIMIT,
        type: type || undefined,
    };

    const query = useGetTransactions(filters);
    const transactions = query.data?.items ?? [];

    // Any filter change restarts at page 1, otherwise the offset is stale.
    const applyType = (value: string) => {
        setType(value as WalletTransactionType | "");
        setPage(1);
    };

    return (
        <ListShell
            title="Transaction history"
            subtitle="Every movement on your wallet"
            icon={LuReceipt}
            totalCount={query.data?.totalCount ?? 0}
            isPending={query.isPending}
            isError={query.isError}
            error={query.error}
            emptyMessage={type ? `No ${TYPE_META[type].label.toLowerCase()} transactions yet` : "No activity yet"}
            page={page}
            totalPages={query.data?.totalPages ?? 0}
            onPageChange={setPage}
            filters={{
                activeValue: type || undefined,
                triggerLabel: "All activity",
                options: OPTIONS,
                onChange: applyType,
            }}
        >
            {transactions.map((transaction) => {
                const meta = TYPE_META[transaction.type] ?? { label: transaction.type, icon: LuReceipt, palette: "gray" };
                const TypeIcon = meta.icon;
                const credit = isCredit(transaction.type);

                return (
                    <ListRow
                        key={transaction.id}
                        title={
                            <HStack gap={2} minW={0}>
                                <Icon as={TypeIcon} boxSize={3.5} color={`${meta.palette}.500`} flexShrink={0} />
                                <Text truncate>{meta.label}</Text>
                            </HStack>
                        }
                        subtitle={`${formatDateTime(transaction.createdAt)} · Balance ${formatCurrency(
                            transaction.balanceAfter
                        )}`}
                        amount={`${credit ? "+" : "-"}${formatCurrency(transaction.ammount)}`}
                        amountColor={credit ? "green.500" : "fg"}
                        trailing={
                            credit ? null : (
                                <Badge
                                    colorPalette={meta.palette}
                                    variant="subtle"
                                    borderRadius="full"
                                    size="sm"
                                    flexShrink={0}
                                >
                                    Debit
                                </Badge>
                            )
                        }
                    />
                );
            })}
        </ListShell>
    );
}
