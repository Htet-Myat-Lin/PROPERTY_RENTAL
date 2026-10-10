import { prisma } from "@/lib/prisma";
import { PLATFORM_COMMISSION_RATE } from "@/utils/commission";
import { EscrowStatus, WithdrawalRequestStatus } from "../../../generated/prisma/enums";

const toNumber = (value: unknown) => Number(value ?? 0);

type MoneySum = {
    amount: number;
    commissionAmount: number;
    landlordAmount: number;
    count: number;
};

const sumPayments = (aggregate: {
    _sum: { amount: unknown; commissionAmount: unknown; landlordAmount: unknown } | null;
    _count: number;
}): MoneySum => ({
    amount: toNumber(aggregate._sum?.amount),
    commissionAmount: toNumber(aggregate._sum?.commissionAmount),
    landlordAmount: toNumber(aggregate._sum?.landlordAmount),
    count: aggregate._count,
});

/**
 * The platform never gets its own wallet: commission is only ever a number
 * sitting on `Payment`, and it becomes real money the moment the escrow is
 * released to the landlord. So every figure here is derived from
 * `Payment` + `Escrow` rather than tracked in a balance column that could
 * drift away from the payments it is supposed to summarise.
 */
export const getPlatformSummaryService = async () => {
    const byEscrowStatus = (status: EscrowStatus) => ({ escrow: { status } });

    const [releasedAgg, heldAgg, refundedAgg, walletsAgg, withdrawalsAgg] = await Promise.all([
        prisma.payment.aggregate({
            where: byEscrowStatus(EscrowStatus.RELEASED),
            _sum: { amount: true, commissionAmount: true, landlordAmount: true },
            _count: true,
        }),
        prisma.payment.aggregate({
            where: byEscrowStatus(EscrowStatus.PENDING),
            _sum: { amount: true, commissionAmount: true, landlordAmount: true },
            _count: true,
        }),
        prisma.payment.aggregate({
            where: byEscrowStatus(EscrowStatus.REFUNDED),
            _sum: { amount: true, commissionAmount: true, landlordAmount: true },
            _count: true,
        }),
        prisma.wallet.aggregate({ _sum: { balance: true } }),
        prisma.withdrawalRequest.aggregate({
            where: { status: WithdrawalRequestStatus.PENDING },
            _sum: { amount: true },
            _count: true,
        }),
    ]);

    const released = sumPayments(releasedAgg);
    const held = sumPayments(heldAgg);
    const refunded = sumPayments(refundedAgg);

    const entries = await prisma.payment.findMany({
        take: 25,
        orderBy: { createdAt: "desc" },
        include: {
            escrow: true,
            rentRequest: {
                include: {
                    property: { select: { id: true, title: true } },
                    landlord: { select: { id: true, username: true } },
                },
            },
        },
    });

    return {
        commissionRate: PLATFORM_COMMISSION_RATE,
        revenue: {
            earned: released.commissionAmount,
            held: held.commissionAmount,
            forgone: refunded.commissionAmount,
        },
        escrow: {
            held: held.amount,
            released: released.amount,
            refunded: refunded.amount,
            landlordPayouts: released.landlordAmount,
        },
        obligations: {
            userBalances: toNumber(walletsAgg._sum.balance),
            pendingWithdrawals: toNumber(withdrawalsAgg._sum.amount),
            pendingWithdrawalCount: withdrawalsAgg._count,
        },
        counts: {
            held: held.count,
            released: released.count,
            refunded: refunded.count,
        },
        entries: entries.map((payment) => ({
            id: payment.id,
            amount: toNumber(payment.amount),
            commissionAmount: toNumber(payment.commissionAmount),
            landlordAmount: toNumber(payment.landlordAmount),
            escrowStatus: payment.escrow?.status ?? null,
            createdAt: payment.createdAt,
            property: payment.rentRequest.property,
            landlord: payment.rentRequest.landlord,
        })),
    };
}
