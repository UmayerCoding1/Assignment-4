import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import stripe from "../../lib/stripe";
import config from "../../config";
import type Stripe from "stripe";
import { Prisma } from "../../generated/prisma/client";
import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';



export const createCheckoutSession = async (req: Request) => {
  try {
    const { bookingId } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { category: true, customer: true },
    });

    if (!booking) {
      throw new AppError(404, "Booking not found!");
    }

    // Ensure duplicate payment na hoy
    const existingPayment = await prisma.payment.findUnique({
      where: { bookingId },
    });

    if (existingPayment && existingPayment.status === 'SUCCESS') {
      throw new AppError(400, "Booking already paid!");
    }

    const transactionId = `TXN-${uuidv4()}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${booking.category.title} Service`,
              description: booking.issue,
            },
            unit_amount: Math.round(booking.totalAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/dashboard/my-bookings/success?booking_id=${bookingId}`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard/my-bookings/cancel?booking_id=${bookingId}`,
      metadata: {
        bookingId,
        transactionId,
      },
    });

    // Upsert - existing thakle update, na thakle create
    const payment = await prisma.payment.upsert({
      where: { bookingId },
      update: {
        stripeCheckoutSessionId: session.id,
        transactionId,
        amount: booking.totalAmount,
        status: 'PENDING',
      },
      create: {
        bookingId,
        userId: booking.customerId,
        amount: booking.totalAmount,
        transactionId,
        stripeCheckoutSessionId: session.id,
        status: 'PENDING',
      },
    });

    return { url: session.url, paymentId: payment.id };
  } catch (error) {
    console.error('Checkout session error:', error);
    throw new AppError(400, "Failed to create checkout session");
  }
};

const getUserPaymentHistory = async (userId: string, role: string) => {
  const where: Prisma.PaymentWhereInput = {};
  console.log('this is my userId and role', userId, role)
  if (role === "CUSTOMER") {
    where.booking = { customerId: userId };
  }
  if (role === "TECHNICIAN") {
    where.booking = { technicianId: userId };
  }
  console.log('this is my where', where)

  const result = await prisma.payment.findMany({
    where,
    include: {
      booking: {
        include: {
          category: true,
          customer: { select: { name: true, email: true, id: true } },
          technician: { select: { name: true, email: true, id: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

const getPaymentById = async (paymentId: string, userId: string, role: string) => {
  const result = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      booking: {
        include: {
          service: true,
          customer: { select: { name: true, email: true } },
        },
      },
    },
  });

  if (!result) {
    throw new AppError(404, "Payment not found!");
  }

  if (role === "CUSTOMER" && result.booking.customerId !== userId) {
    throw new AppError(403, "You are not authorized to view this payment details");
  }

  return result;
};

const markBookingPaid = async (session: Stripe.Checkout.Session) => {
  const bookingId = session.metadata?.bookingId;
  if (!bookingId) return;

  if (session.payment_status !== "paid") return;

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

  const amount = (session.amount_total ?? 0) / 100;

  await prisma.$transaction(async (tx) => {
    const existingPayment = await tx.payment.findUnique({
      where: { bookingId },
    });

    if (existingPayment && existingPayment.status === "SUCCESS") {
      return;
    }

    await tx.payment.upsert({
      where: { bookingId },
      create: {
        bookingId,
        amount,
        transactionId: paymentIntentId ?? session.id,
        provider: "STRIPE",
        status: "SUCCESS",
        stripeCheckoutSessionId: session.id,
        paidAt: new Date(),
      },
      update: {
        amount,
        transactionId: paymentIntentId ?? session.id,
        provider: "STRIPE",
        status: "SUCCESS",
        stripeCheckoutSessionId: session.id,
        paidAt: new Date(),
      },
    });

    await tx.booking.update({
      where: { id: bookingId },
      data: { status: "PAID" },
    });
  });
};

const handleCheckoutSessionFailed = async (session: Stripe.Checkout.Session) => {
  const bookingId = session.metadata?.bookingId;
  if (!bookingId) return;

  const existingPayment = await prisma.payment.findUnique({
    where: { bookingId },
  });

  if (!existingPayment || existingPayment.status === "SUCCESS") {
    return;
  }

  await prisma.payment.update({
    where: { bookingId },
    data: { status: "FAILED" },
  });
};

const handleChargeRefunded = async (charge: Stripe.Charge) => {
  const paymentIntentId =
    typeof charge.payment_intent === "string"
      ? charge.payment_intent
      : charge.payment_intent?.id;

  if (!paymentIntentId) return;

  await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({
      where: { transactionId: paymentIntentId },
    });

    if (!payment || payment.status === "REFUNDED") return;

    await tx.payment.update({
      where: { id: payment.id },
      data: { status: "REFUNDED" },
    });

    await tx.booking.update({
      where: { id: payment.bookingId },
      data: { status: "CANCELLED" },
    });
  });
};

const handleStripeEvent = async (event: Stripe.Event) => {
  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
      await markBookingPaid(event.data.object as Stripe.Checkout.Session);
      break;
    case "checkout.session.async_payment_failed":
      await handleCheckoutSessionFailed(event.data.object as Stripe.Checkout.Session);
      break;
    case "charge.refunded":
      await handleChargeRefunded(event.data.object as Stripe.Charge);
      break;
    default:
      break;
  }
};

// payment.service.ts e ei function ta ki ache?
const handlePaymentSuccess = async (bookingId: string) => {
  console.log('bookingId', bookingId)
  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { bookingId },
      data: {
        status: 'SUCCESS',
        paidAt: new Date(),

      },
    });

    await tx.booking.update({
      where: { id: bookingId },
      data: { status: 'PAID' },
    });
  });
};



const handlePaymentFailure = async (bookingId: string) => {
  await prisma.payment
    .update({
      where: { bookingId },
      data: { status: 'FAILED' },
    })
    .catch(() => { }); // payment record na thakle silently skip
};

export const PaymentServices = {
  createCheckoutSession,
  getUserPaymentHistory,
  getPaymentById,
  handleStripeEvent,
  handlePaymentSuccess,
  handlePaymentFailure,
};
