import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";

const createReview = async (customerId: string, payload: any) => {
  const booking = await prisma.booking.findUnique({
    where: { id: payload.bookingId },
  });

  if (!booking) {
    throw new AppError(404, "Booking not found");
  }

  if (booking.customerId !== customerId) {
    throw new AppError(403, "Not authorized to review this booking");
  }

  if (booking.status !== "COMPLETED") {
    throw new AppError(400, "Can only review completed bookings");
  }

  const existingReview = await prisma.review.findUnique({
    where: { bookingId: payload.bookingId },
  });

  if (existingReview) {
    throw new AppError(400, "Review already submitted for this booking");
  }

  const result = await prisma.$transaction(async (tx: any) => {
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
      const newAverageRating =
        (technicianProfile.averageRating * technicianProfile.totalReviews +
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

export const ReviewServices = {
  createReview,
};
