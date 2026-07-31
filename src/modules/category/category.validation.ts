import { z } from "zod";

const categoryFields = {
    title: z
        .string({ message: "Category title is required" })
        .trim()
        .min(1, { message: "Category title cannot be empty" }),

    slug: z
        .string({ message: "Slug is required" })
        .trim()
        .min(1, { message: "Slug cannot be empty" })
        .regex(/^[a-z0-9-]+$/, {
            message:
                "Slug can only contain lowercase letters, numbers, and hyphens",
        }),

    description: z
        .string()
        .trim()
        .optional(),

    image: z
        .string()
        .trim()
        .url({ message: "Image must be a valid URL" })
        .optional(),

    startingPrice: z
        .number()
        .nonnegative({ message: "Starting price cannot be negative" }),
};

const createCategoryValidationSchema = z.object({
    body: z
        .object({
            title: categoryFields.title,
            slug: categoryFields.slug,
            description: categoryFields.description,
            image: categoryFields.image,
            startingPrice: categoryFields.startingPrice,
        })
        .strict(),
});

const updateCategoryValidationSchema = z.object({
    body: z
        .object({
            title: categoryFields.title.optional(),
            slug: categoryFields.slug.optional(),
            description: categoryFields.description,
            image: categoryFields.image,
            startingPrice: categoryFields.startingPrice.optional(),
        })
        .strict(),
});

export type TCreateCategoryPayload =
    z.infer<typeof createCategoryValidationSchema>["body"];

export type TUpdateCategoryPayload =
    z.infer<typeof updateCategoryValidationSchema>["body"];

export const CategoryValidations = {
    createCategoryValidationSchema,
    updateCategoryValidationSchema,
};