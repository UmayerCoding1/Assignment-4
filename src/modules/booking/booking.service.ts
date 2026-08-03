import { BookingStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";

const createBooking = async (customerId: string, payload: any) => {

  const categoty = await prisma.category.findUnique({
    where: { id: payload.categoryId },
  });
  console.log(categoty)

  if (!categoty) {
    throw new AppError(404, "Categoty not found");
  }

  const result = await prisma.booking.create({
    data: {
      customerId,
      technicianId: payload.technicianId,
      categoryId: payload.categoryId,
      bookingDate: new Date(payload.bookingDate),
      issue: payload.issue,
      workDuration: payload.workDuration,
      totalAmount: payload.totalAmount

    },
    include: {
      category: true,
      technician: {
        select: { name: true, email: true },
      },
    },
  });

  return result;
};

const getMyBookings = async (userId: string, role: string) => {
  const where: any = {};
  if (role === "CUSTOMER") {
    where.customerId = userId;
  } else if (role === "TECHNICIAN") {
    where.technicianId = userId;
  }

  const result = await prisma.booking.findMany({
    where,
    include: {
      category: true,
      technician: { select: { name: true, email: true, phone: true } },
      customer: { select: { name: true, email: true, phone: true } },
      payment: true
    },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

const getBookingById = async (id: string, userId: string, role: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      category: true,
      technician: { select: { name: true, email: true, phone: true } },
      customer: { select: { name: true, email: true, phone: true } },
      payment: true,
    },
  });

  if (!booking) {
    throw new AppError(404, "Booking not found");
  }

  if (
    role !== "ADMIN" &&
    booking.customerId !== userId &&
    booking.technicianId !== userId
  ) {
    throw new AppError(403, "Not authorized to view this booking");
  }

  return booking;
};



const updateBookingStatus = async (id: string, status: BookingStatus) => {
  const result = await prisma.booking.update({
    where: { id },
    data: { status: status },
  });


  if (!result) {
    throw new AppError(404, "Booking not found");
  }

  if (status === 'COMPLETED') {
    await prisma.technicianProfile.update({
      where: { userId: result.technicianId },
      data: {
        completedJobs: { increment: 1 }
      }
    })

  }


  return result;
}

const deleteBookingService = async (id: string) => {
  console.log(id);
  const result = await prisma.booking.delete({
    where: { id },
  });

  if (!result) {
    throw new AppError(404, "Booking not found");
  }

  return result;
}

export const BookingServices = {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  deleteBookingService
};
