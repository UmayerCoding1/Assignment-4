"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const booking_controller_1 = require("./booking.controller");
const auth_1 = require("../../middlewares/auth");
const router = express_1.default.Router();
router.post("/bookings", (0, auth_1.auth)("CUSTOMER"), booking_controller_1.BookingControllers.createBooking);
router.get("/bookings", (0, auth_1.auth)("CUSTOMER", "TECHNICIAN", "ADMIN"), booking_controller_1.BookingControllers.getMyBookings);
router.get("/bookings/:id", (0, auth_1.auth)("CUSTOMER", "TECHNICIAN", "ADMIN"), booking_controller_1.BookingControllers.getBookingById);
router.put('/booking/:id', (0, auth_1.auth)('TECHNICIAN'), booking_controller_1.BookingControllers.updateBookingStatus);
exports.BookingRoutes = router;
