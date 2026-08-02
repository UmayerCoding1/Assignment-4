"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingValidations = void 0;
const zod_1 = require("zod");
const createBookingSchema = zod_1.z.object({
    customerId: zod_1.z.string(),
    technicianId: zod_1.z.string(),
    categoryId: zod_1.z.string(),
    bookingDate: zod_1.z.string().datetime(),
    issue: zod_1.z.string().min(1, "Issue is required"),
    workDuration: zod_1.z.number().int().positive(),
});
exports.BookingValidations = {
    createBookingSchema,
};
