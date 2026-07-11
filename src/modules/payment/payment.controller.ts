import { Request, Response } from "express";
import { PaymentServices } from "./payment.service";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServices.createPayment(req.user!.id, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Payment initiated successfully",
    data: result,
  });
});

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServices.confirmPayment(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment confirmed successfully",
    data: result,
  });
});

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServices.getMyPayments(
    req.user!.id,
    req.user!.role
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payments retrieved successfully",
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
    message: "Payment retrieved successfully",
    data: result,
  });
});

export const PaymentControllers = {
  createPayment,
  confirmPayment,
  getMyPayments,
  getPaymentById,
};
