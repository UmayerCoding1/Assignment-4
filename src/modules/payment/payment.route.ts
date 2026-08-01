import express from "express";
import { PaymentControllers } from "./payment.controller";
import { PaymentValidations } from "./payment.validation";
import validateRequest from "../../middlewares/validateRequest";
import validateParams from "../../middlewares/validateParams";
import { idParamValidationSchema, paginationQuerySchema } from "../../validations";
import { auth } from "../../middlewares/auth";
import validateQuery from "../../middlewares/validateQuery";

const router = express.Router();


router.post(
  "/checkout",
  auth("CUSTOMER"),
  // validateRequest(PaymentValidations.createCheckoutSessionValidationSchema),
  PaymentControllers.createCheckoutSession,
);


router.get(
  "/",
  auth("CUSTOMER", 'TECHNICIAN'),
  // validateQuery(paginationQuerySchema),
  PaymentControllers.getUserPaymentHistory,
);


router.get(
  "/:id",
  auth("CUSTOMER", "ADMIN"),
  validateParams(idParamValidationSchema),
  PaymentControllers.getPaymentById,
);


router.patch('/success', auth('CUSTOMER'), PaymentControllers.createPaymentSuccess)
export const PaymentRoutes = router;
