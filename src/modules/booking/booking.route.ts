import express from "express";
import { BookingControllers } from "./booking.controller";
import { BookingValidations } from "./booking.validation";
import validateRequest from "../../middlewares/validateRequest";
import { auth } from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/bookings",
  auth("CUSTOMER"),
  validateRequest(BookingValidations.createBookingSchema),
  BookingControllers.createBooking
);

router.get(
  "/bookings",
  auth("CUSTOMER", "TECHNICIAN", "ADMIN"),
  BookingControllers.getMyBookings
);

router.get(
  "/bookings/:id",
  auth("CUSTOMER", "TECHNICIAN", "ADMIN"),
  BookingControllers.getBookingById
);

export const BookingRoutes = router;
