import { z } from "zod";

const updateProfileSchema = z.object({
  bio: z.string().optional(),
  experience: z.number().int().optional(),
  hourlyRate: z.number().optional(),
  location: z.string().optional(),
});

const updateAvailabilitySchema = z.object({
  availability: z.any(),
});

const updateBookingStatusSchema = z.object({
  status: z.enum(["ACCEPTED", "DECLINED", "COMPLETED"]),
});

export const TechnicianValidations = {
  updateProfileSchema,
  updateAvailabilitySchema,
  updateBookingStatusSchema,
};
