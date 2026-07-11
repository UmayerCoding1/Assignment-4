import express from "express";
import { ReviewControllers } from "./review.controller";
import { ReviewValidations } from "./review.validation";
import validateRequest from "../../middlewares/validateRequest";
import { auth } from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/reviews",
  auth("CUSTOMER"),
  validateRequest(ReviewValidations.createReviewSchema),
  ReviewControllers.createReview
);

export const ReviewRoutes = router;
