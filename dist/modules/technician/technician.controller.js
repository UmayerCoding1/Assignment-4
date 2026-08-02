"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TechnicianControllers = void 0;
const technician_service_1 = require("./technician.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = require("../../utils/sendResponse");
const getAllTechnicians = (0, catchAsync_1.default)(async (req, res) => {
    const result = await technician_service_1.TechnicianServices.getAllTechnicians(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Technicians retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
const getTechnicianProfile = (0, catchAsync_1.default)(async (req, res) => {
    const result = await technician_service_1.TechnicianServices.getTechnicianProfile(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Technician profile retrieved successfully",
        data: result,
    });
});
const updateProfile = (0, catchAsync_1.default)(async (req, res) => {
    const result = await technician_service_1.TechnicianServices.updateProfile(req.user.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Profile updated successfully",
        data: result,
    });
});
const updateAvailability = (0, catchAsync_1.default)(async (req, res) => {
    const result = await technician_service_1.TechnicianServices.updateAvailability(req.user.id, req.body.availability);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Availability updated successfully",
        data: result,
    });
});
const getTechBookings = (0, catchAsync_1.default)(async (req, res) => {
    const result = await technician_service_1.TechnicianServices.getTechBookings(req.user.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Bookings retrieved successfully",
        data: result,
    });
});
const updateTechBookingStatus = (0, catchAsync_1.default)(async (req, res) => {
    const result = await technician_service_1.TechnicianServices.updateTechBookingStatus(req.user.id, req.params.id, req.body.status);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Booking status updated successfully",
        data: result,
    });
});
const updateStatus = (0, catchAsync_1.default)(async (req, res) => {
    const result = await technician_service_1.TechnicianServices.updateStatusService(req.body.status, req.params.id);
    console.log(result);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Status updated successfully",
        data: result.status,
    });
});
exports.TechnicianControllers = {
    getAllTechnicians,
    getTechnicianProfile,
    updateProfile,
    updateAvailability,
    getTechBookings,
    updateTechBookingStatus,
    updateStatus
};
