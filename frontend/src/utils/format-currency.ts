export const WALLET_CURRENCY = "MMK";

const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: WALLET_CURRENCY,
    maximumFractionDigits: 0,
});

/** `MMK` is not a supported Intl currency in every runtime, so fall back gracefully. */
export const formatCurrency = (amount: number): string => {
    try {
        return formatter.format(amount);
    } catch {
        return `${WALLET_CURRENCY} ${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(amount)}`;
    }
};
