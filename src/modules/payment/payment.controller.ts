import { Request, Response } from "express";
import type Stripe from "stripe";
import { PaymentServices } from "./payment.service";

import catchAsync from "../../utils/catchAsync";
import config from "../../config";
import AppError from "../../utils/AppError";

import { sendResponse } from "../../utils/sendResponse";
import stripe from "../../lib/stripe";

const createCheckoutSession = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServices.createCheckoutSession(
    req,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Stripe Checkout session created successfully!",
    data: result,
  });
});

const getUserPaymentHistory = catchAsync(async (req: Request, res: Response) => {
  console.log(req.url);
  const result = await PaymentServices.getUserPaymentHistory(
    req.user!.id,
    req.user!.role
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment history retrieved successfully!",
    data: result,
  });
});

const getPaymentById = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServices.getPaymentById(
    req.params.id as string,
    req.user!.id,
    req.user!.role
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment details retrieved successfully!",
    data: result,
  });
});

const stripeWebhook = async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"];

  if (!signature || Array.isArray(signature)) {
    return res.status(400).send("Missing signature");
  }

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      config.stripe.webhookSecret
    );

    await PaymentServices.handleStripeEvent(event);

    return res.status(200).json({
      received: true,
    });
  } catch (err) {
    return res.status(400).send(
      `Webhook Error: ${err instanceof Error ? err.message : String(err)
      }`
    );
  }
};


const createPaymentSuccess = catchAsync(async (req: Request, res: Response) => {
  console.log('req.body', req.body)
  const result = await PaymentServices.handlePaymentSuccess(
    req.body.bookingId,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment success created successfully!",
    data: result,
  });
});

export const PaymentControllers = {
  createCheckoutSession,
  getUserPaymentHistory,
  getPaymentById,
  stripeWebhook,
  createPaymentSuccess,
};
