import express from "express";
import { PaymentControllers } from "./payment.controller";
import { PaymentValidations } from "./payment.validation";
import validateRequest from "../../middlewares/validateRequest";
import { auth } from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/payments/create",
  auth("CUSTOMER"),
  validateRequest(PaymentValidations.createPaymentSchema),
  PaymentControllers.createPayment
);

router.post(
  "/payments/confirm",
  validateRequest(PaymentValidations.confirmPaymentSchema),
  PaymentControllers.confirmPayment
);

router.get(
  "/payments",
  auth("CUSTOMER", "ADMIN"),
  PaymentControllers.getMyPayments
);

router.get(
  "/payments/:id",
  auth("CUSTOMER", "ADMIN"),
  PaymentControllers.getPaymentById
);

export const PaymentRoutes = router;
