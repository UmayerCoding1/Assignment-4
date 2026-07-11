import { z } from "zod";

const registerSchema = z.object({
    body: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        role: z.enum(["CUSTOMER", "TECHNICIAN"]),
    }),
});

const loginSchema = z.object({
    body: z.object({
        email: z.email("Invalid email address"),
        password: z.string().min(1, "Password is required"),
    }),
});

export type TRegisterPayload = z.infer<typeof registerSchema>["body"];
export type TLoginPayload = z.infer<typeof loginSchema>["body"];

export const AuthValidation = {
    registerSchema,
    loginSchema,
};