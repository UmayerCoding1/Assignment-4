"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TechnicianValidations = void 0;
const zod_1 = require("zod");
const updateProfileSchema = zod_1.z.object({
    bio: zod_1.z.string().optional(),
    experience: zod_1.z.number().int().optional(),
    hourlyRate: zod_1.z.number().optional(),
    location: zod_1.z.string().optional(),
});
const updateAvailabilitySchema = zod_1.z.object({
    availability: zod_1.z.any(),
});
const updateBookingStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(["ACCEPTED", "DECLINED", "COMPLETED"]),
});
exports.TechnicianValidations = {
    updateProfileSchema,
    updateAvailabilitySchema,
    updateBookingStatusSchema,
};
