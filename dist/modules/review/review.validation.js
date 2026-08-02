"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewValidations = void 0;
const zod_1 = require("zod");
const createReviewSchema = zod_1.z.object({
    bookingId: zod_1.z.string(),
    rating: zod_1.z
        .number()
        .min(1, "Rating must be at least 1")
        .max(5, "Rating must be at most 5"),
    comment: zod_1.z.string().optional(),
});
exports.ReviewValidations = {
    createReviewSchema,
};
