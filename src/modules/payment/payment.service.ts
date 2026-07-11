import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";

const createPayment = async (userId: string, payload: any) => {
  const booking = await prisma.booking.findUnique({
    where: { id: payload.bookingId },
  });

  if (!booking) {
    throw new AppError(404, "Booking not found");
  }

  if (booking.customerId !== userId) {
    throw new AppError(403, "Not authorized to pay for this booking");
  }

  if (booking.status !== "ACCEPTED") {
    throw new AppError(400, "Booking must be ACCEPTED before payment");
  }

  const existingPayment = await prisma.payment.findUnique({
    where: { bookingId: payload.bookingId },
  });

  if (existingPayment && existingPayment.status === "SUCCESS") {
    throw new AppError(400, "Booking is already paid");
  }

  // Mock generating a transaction ID
  const transactionId = `txn_${Math.random().toString(36).substr(2, 9)}`;

  let payment;
  if (existingPayment) {
    payment = await prisma.payment.update({
      where: { bookingId: payload.bookingId },
      data: {
        provider: payload.provider,
        transactionId,
      },
    });
  } else {
    payment = await prisma.payment.create({
      data: {
        bookingId: payload.bookingId,
        userId,
        amount: booking.totalPrice,
        provider: payload.provider,
        transactionId,
      },
    });
  }

  const paymentUrl = `https://mockpaymentgateway.com/pay/${transactionId}`;

  return { payment, paymentUrl };
};

const confirmPayment = async (payload: any) => {
  const payment = await prisma.payment.findFirst({
    where: { transactionId: payload.transactionId },
  });

  if (!payment) {
    throw new AppError(404, "Payment not found");
  }

  if (payment.status === "SUCCESS") {
    throw new AppError(400, "Payment is already successful");
  }

  const result = await prisma.$transaction(async (tx: any) => {
    const updatedPayment = await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: "SUCCESS",
        paidAt: new Date(),
      },
    });

    await tx.booking.update({
      where: { id: payment.bookingId },
      data: { status: "PAID" },
    });

    return updatedPayment;
  });

  return result;
};

const getMyPayments = async (userId: string, role: string) => {
  const where: any = {};
  if (role === "CUSTOMER") {
    where.userId = userId;
  }

  const result = await prisma.payment.findMany({
    where,
    include: {
      booking: {
        include: { service: { select: { title: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

const getPaymentById = async (id: string, userId: string, role: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: {
      booking: true,
      user: { select: { name: true, email: true } },
    },
  });

  if (!payment) {
    throw new AppError(404, "Payment not found");
  }

  if (role !== "ADMIN" && payment.userId !== userId) {
    throw new AppError(403, "Not authorized to view this payment");
  }

  return payment;
};

export const PaymentServices = {
  createPayment,
  confirmPayment,
  getMyPayments,
  getPaymentById,
};
