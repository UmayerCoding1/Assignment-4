import { z } from "zod";

const createPaymentSchema = z.object({
  bookingId: z.string(),
  provider: z.enum(["STRIPE", "SSLCOMMERZ"]),
});

const confirmPaymentSchema = z.object({
  transactionId: z.string(),
});

export const PaymentValidations = {
  createPaymentSchema,
  confirmPaymentSchema,
};
