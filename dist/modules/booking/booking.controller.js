"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingControllers = void 0;
const booking_service_1 = require("./booking.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = require("../../utils/sendResponse");
const createBooking = (0, catchAsync_1.default)(async (req, res) => {
    const result = await booking_service_1.BookingServices.createBooking(req.user.id, req.body);
    console.log(req.ip);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Booking created successfully",
        data: result,
    });
});
const getMyBookings = (0, catchAsync_1.default)(async (req, res) => {
    console.log(req.ip);
    const result = await booking_service_1.BookingServices.getMyBookings(req.user.id, req.user.role);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Bookings retrieved successfully",
        data: result,
    });
});
const getBookingById = (0, catchAsync_1.default)(async (req, res) => {
    const result = await booking_service_1.BookingServices.getBookingById(req.params.id, req.user.id, req.user.role);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Booking retrieved successfully",
        data: result,
    });
});
const updateBookingStatus = (0, catchAsync_1.default)(async (req, res) => {
    const result = await booking_service_1.BookingServices.updateBookingStatus(req.params.id, req.body.status);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Booking updated successfully",
        data: result,
    });
});
const deleteBooking = (0, catchAsync_1.default)(async (req, res) => {
    const result = await booking_service_1.BookingServices.deleteBookingService(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Booking deleted successfully",
        data: result,
    });
});
exports.BookingControllers = {
    createBooking,
    getMyBookings,
    getBookingById,
    updateBookingStatus,
    deleteBooking
};
