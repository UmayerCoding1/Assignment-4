import { z } from "zod";

const createBookingSchema = z.object({
  customerId: z.string(),
  technicianId: z.string(),
  categoryId: z.string(),
  bookingDate: z.string().datetime(),
  issue: z.string().min(1, "Issue is required"),
  workDuration: z.number().int().positive(),
})

export const BookingValidations = {
  createBookingSchema,
};
