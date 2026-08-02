"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewServices = void 0;
const prisma_1 = require("../../lib/prisma");
const AppError_1 = __importDefault(require("../../utils/AppError"));
const createReview = async (customerId, payload) => {
    const booking = await prisma_1.prisma.booking.findUnique({
        where: { id: payload.bookingId },
    });
    if (!booking) {
        throw new AppError_1.default(404, "Booking not found");
    }
    if (booking.customerId !== customerId) {
        throw new AppError_1.default(403, "Not authorized to review this booking");
    }
    if (booking.status !== "COMPLETED") {
        throw new AppError_1.default(400, "Can only review completed bookings");
    }
    const existingReview = await prisma_1.prisma.review.findUnique({
        where: { bookingId: payload.bookingId },
    });
    if (existingReview) {
        throw new AppError_1.default(400, "Review already submitted for this booking");
    }
    const result = await prisma_1.prisma.$transaction(async (tx) => {
        const review = await tx.review.create({
            data: {
                customerId,
                technicianId: booking.technicianId,
                bookingId: booking.id,
                rating: payload.rating,
                comment: payload.comment,
            },
        });
        const technicianProfile = await tx.technicianProfile.findUnique({
            where: { userId: booking.technicianId },
        });
        if (technicianProfile) {
            const newTotalReviews = technicianProfile.totalReviews + 1;
            const newAverageRating = (technicianProfile.averageRating * technicianProfile.totalReviews +
                payload.rating) /
                newTotalReviews;
            await tx.technicianProfile.update({
                where: { userId: booking.technicianId },
                data: {
                    totalReviews: newTotalReviews,
                    averageRating: newAverageRating,
                },
            });
        }
        return review;
    });
    return result;
};
exports.ReviewServices = {
    createReview,
};
