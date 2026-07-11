import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";

const createBooking = async (customerId: string, payload: any) => {
  const service = await prisma.service.findUnique({
    where: { id: payload.serviceId },
  });

  if (!service) {
    throw new AppError(404, "Service not found");
  }

  const result = await prisma.booking.create({
    data: {
      customerId,
      technicianId: payload.technicianId,
      serviceId: payload.serviceId,
      bookingDate: new Date(payload.bookingDate),
      note: payload.note,
      totalPrice: service.price,
    },
    include: {
      service: true,
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
      service: true,
      technician: { select: { name: true, email: true, phone: true } },
      customer: { select: { name: true, email: true, phone: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

const getBookingById = async (id: string, userId: string, role: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      service: true,
      technician: { select: { name: true, email: true, phone: true } },
      customer: { select: { name: true, email: true, phone: true } },
      payment: true,
      review: true,
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

export const BookingServices = {
  createBooking,
  getMyBookings,
  getBookingById,
};
