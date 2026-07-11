import { z } from "zod";

const createServiceValidationSchema = z.object({
  body: z
    .object({
      title: z
        .string({ message: "Title is required" })
        .trim()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title cannot exceed 100 characters"),

      description: z
        .string({ message: "Description is required" })
        .trim()
        .min(10, "Description must be at least 10 characters")
        .max(1000, "Description cannot exceed 1000 characters"),

      price: z
        .number({ message: "Price is required" })
        .positive("Price must be greater than 0"),

      duration: z
        .number({ message: "Duration is required" })
        .int("Duration must be an integer")
        .positive("Duration must be greater than 0"),

      categoryId: z
        .string({ message: "Category ID is required" })
        .cuid("Invalid Category ID"),
    })
    .strict(),
});

const updateServiceValidationSchema = z.object({
  body: z
    .object({
      title: z
        .string()
        .trim()
        .min(3)
        .max(100)
        .optional(),

      description: z
        .string()
        .trim()
        .min(10)
        .max(1000)
        .optional(),

      price: z
        .number()
        .positive()
        .optional(),

      duration: z
        .number()
        .int()
        .positive()
        .optional(),

      categoryId: z
        .string()
        .cuid()
        .optional(),

      isAvailable: z
        .boolean()
        .optional(),
    })
    .strict(),
});

export type TCreateServicePayload = z.infer<typeof createServiceValidationSchema>["body"];
export type TUpdateServicePayload = z.infer<typeof updateServiceValidationSchema>["body"];

export const ServiceValidations = {
  createServiceValidationSchema,
  updateServiceValidationSchema,
};