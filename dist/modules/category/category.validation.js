"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryValidations = void 0;
const zod_1 = require("zod");
const categoryFields = {
    title: zod_1.z
        .string({ message: "Category title is required" })
        .trim()
        .min(1, { message: "Category title cannot be empty" }),
    slug: zod_1.z
        .string({ message: "Slug is required" })
        .trim()
        .min(1, { message: "Slug cannot be empty" })
        .regex(/^[a-z0-9-]+$/, {
        message: "Slug can only contain lowercase letters, numbers, and hyphens",
    }),
    description: zod_1.z
        .string()
        .trim()
        .optional(),
    image: zod_1.z
        .string()
        .trim()
        .url({ message: "Image must be a valid URL" })
        .optional(),
    startingPrice: zod_1.z
        .number()
        .nonnegative({ message: "Starting price cannot be negative" }),
};
const createCategoryValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        title: categoryFields.title,
        slug: categoryFields.slug,
        description: categoryFields.description,
        image: categoryFields.image,
        startingPrice: categoryFields.startingPrice,
    })
        .strict(),
});
const updateCategoryValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        title: categoryFields.title.optional(),
        slug: categoryFields.slug.optional(),
        description: categoryFields.description,
        image: categoryFields.image,
        startingPrice: categoryFields.startingPrice.optional(),
    })
        .strict(),
});
exports.CategoryValidations = {
    createCategoryValidationSchema,
    updateCategoryValidationSchema,
};
