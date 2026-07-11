import { z } from "zod";

const categoryFields = {
    name: z
        .string({ message: "Category name is required" })
        .trim()
        .min(1, { message: "Category name cannot be empty" }),
    description: z
        .string({ message: "Description string is required" })
        .trim()
        .min(1, { message: "Description cannot be empty" }),
};


const createCategoryValidationSchema = z.object({
    body: z
        .object({
            ...categoryFields,
            description: categoryFields.description.optional(),
        })
        .strict(),
});


const updateCategoryValidationSchema = z.object({
    body: z
        .object({
            name: categoryFields.name
                .optional()
                .refine(
                    (value) => value === undefined || value.trim().length > 0,
                    { message: "Category name cannot be empty" }
                ),

            description: categoryFields.description.optional(),
        })
        .strict(),
});

export type TCreateCategoryPayload = z.infer<typeof createCategoryValidationSchema>["body"];

export type TUpdateCategoryPayload = z.infer<typeof updateCategoryValidationSchema>["body"];

export const CategoryValidations = {
    createCategoryValidationSchema,
    updateCategoryValidationSchema,
};