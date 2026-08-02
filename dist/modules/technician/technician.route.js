"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TechnicianRoutes = void 0;
const express_1 = __importDefault(require("express"));
const technician_controller_1 = require("./technician.controller");
const technician_validation_1 = require("./technician.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = require("../../middlewares/auth");
const router = express_1.default.Router();
router.get("/technicians", technician_controller_1.TechnicianControllers.getAllTechnicians);
router.get("/technicians/:id", technician_controller_1.TechnicianControllers.getTechnicianProfile);
router.put("/technician/profile", (0, auth_1.auth)("TECHNICIAN"), 
// validateRequest(TechnicianValidations.updateProfileSchema),
technician_controller_1.TechnicianControllers.updateProfile);
router.put("/technician/availability", (0, auth_1.auth)("TECHNICIAN"), (0, validateRequest_1.default)(technician_validation_1.TechnicianValidations.updateAvailabilitySchema), technician_controller_1.TechnicianControllers.updateAvailability);
router.get("/technician/bookings", (0, auth_1.auth)("TECHNICIAN"), technician_controller_1.TechnicianControllers.getTechBookings);
router.patch("/technician/bookings/:id", (0, auth_1.auth)("TECHNICIAN"), (0, validateRequest_1.default)(technician_validation_1.TechnicianValidations.updateBookingStatusSchema), technician_controller_1.TechnicianControllers.updateTechBookingStatus);
router.patch('/technician/update-status/:id', (0, auth_1.auth)('TECHNICIAN'), technician_controller_1.TechnicianControllers.updateStatus);
exports.TechnicianRoutes = router;
