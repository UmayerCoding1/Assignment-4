import { z } from "zod";

const createBookingSchema = z.object({
  technicianId: z.string(),
  serviceId: z.string(),
  bookingDate: z.string().datetime(),
  note: z.string().optional(),
});

export const BookingValidations = {
  createBookingSchema,
};
