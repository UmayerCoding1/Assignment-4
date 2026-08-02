"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentValidations = void 0;
const zod_1 = require("zod");
const createCheckoutSessionValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        bookingId: zod_1.z
            .string({ message: "Booking ID is required" })
            .uuid({ message: "Invalid Booking ID format" }),
    })
        .strict(),
});
exports.PaymentValidations = {
    createCheckoutSessionValidationSchema,
};
