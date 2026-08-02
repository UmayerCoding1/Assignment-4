"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceValidations = void 0;
const zod_1 = require("zod");
const createServiceValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        title: zod_1.z
            .string({ message: "Title is required" })
            .trim()
            .min(3, "Title must be at least 3 characters")
            .max(100, "Title cannot exceed 100 characters"),
        description: zod_1.z
            .string({ message: "Description is required" })
            .trim()
            .min(10, "Description must be at least 10 characters")
            .max(1000, "Description cannot exceed 1000 characters"),
        price: zod_1.z
            .number({ message: "Price is required" })
            .positive("Price must be greater than 0"),
        duration: zod_1.z
            .number({ message: "Duration is required" })
            .int("Duration must be an integer")
            .positive("Duration must be greater than 0"),
        categoryId: zod_1.z
            .string({ message: "Category ID is required" })
            .cuid("Invalid Category ID"),
    })
        .strict(),
});
const updateServiceValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        title: zod_1.z
            .string()
            .trim()
            .min(3)
            .max(100)
            .optional(),
        description: zod_1.z
            .string()
            .trim()
            .min(10)
            .max(1000)
            .optional(),
        price: zod_1.z
            .number()
            .positive()
            .optional(),
        duration: zod_1.z
            .number()
            .int()
            .positive()
            .optional(),
        categoryId: zod_1.z
            .string()
            .cuid()
            .optional(),
        isAvailable: zod_1.z
            .boolean()
            .optional(),
    })
        .strict(),
});
exports.ServiceValidations = {
    createServiceValidationSchema,
    updateServiceValidationSchema,
};
