import { z } from "zod";
import type { PaymentMethod } from "./types";

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "kbz_pay", label: "KBZPay" },
  { value: "wave_pay", label: "WavePay" },
  { value: "bank_transfer", label: "Bank transfer" },
  { value: "credit_card", label: "Credit / Debit card" },
];

export const depositFormSchema = z.object({
  ammount: z.coerce
    .number({ message: "Enter an amount" })
    .positive("Enter an amount greater than 0")
    .max(1_000_000_000, "Amount is too large"),
  paymentMethod: z.enum(["kbz_pay", "wave_pay", "bank_transfer", "credit_card"]),
  transactionId: z
    .string()
    .trim()
    .min(4, "Enter the transaction reference from your payment receipt")
    .max(64, "Transaction reference is too long"),
});

export type DepositFormValues = z.infer<typeof depositFormSchema>;

export const PAYOUT_METHODS: { value: string; label: string }[] = [
  { value: "bank_account", label: "Bank account" },
  { value: "mobile_money", label: "Mobile money" },
  { value: "paypal", label: "PayPal" },
];

export const withdrawFormSchema = (maxBalance: number) =>
  z.object({
    ammount: z
      .coerce
      .number({ message: "Enter an amount" })
      .positive("Enter an amount greater than 0")
      .max(maxBalance, `Amount exceeds your available balance (${maxBalance.toLocaleString("en-US")})`),
    paymentMethod: z.enum(["bank_account", "mobile_money", "paypal"], {
      message: "Choose a payout method",
    }),
  });

export type WithdrawFormValues = z.infer<ReturnType<typeof withdrawFormSchema>>;
