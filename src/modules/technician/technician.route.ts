import express from "express";
import { TechnicianControllers } from "./technician.controller";
import { TechnicianValidations } from "./technician.validation";
import validateRequest from "../../middlewares/validateRequest";
import { auth } from "../../middlewares/auth";

const router = express.Router();

router.get("/technicians", TechnicianControllers.getAllTechnicians);
router.get("/technicians/:id", TechnicianControllers.getTechnicianProfile);


router.put(
  "/technician/profile",
  auth("TECHNICIAN"),
  // validateRequest(TechnicianValidations.updateProfileSchema),
  TechnicianControllers.updateProfile
);

router.put(
  "/technician/availability",
  auth("TECHNICIAN"),
  validateRequest(TechnicianValidations.updateAvailabilitySchema),
  TechnicianControllers.updateAvailability
);

router.get(
  "/technician/bookings",
  auth("TECHNICIAN"),
  TechnicianControllers.getTechBookings
);

router.patch(
  "/technician/bookings/:id",
  auth("TECHNICIAN"),
  validateRequest(TechnicianValidations.updateBookingStatusSchema),
  TechnicianControllers.updateTechBookingStatus
);

router.patch('/technician/update-status/:id', auth('TECHNICIAN'), TechnicianControllers.updateStatus);


export const TechnicianRoutes = router;
