"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminControllers = void 0;
const admin_service_1 = require("./admin.service");
const category_service_1 = require("../category/category.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = require("../../utils/sendResponse");
const getAllUsers = (0, catchAsync_1.default)(async (req, res) => {
    const result = await admin_service_1.AdminServices.getAllUsers(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Users retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
const updateUserStatus = (0, catchAsync_1.default)(async (req, res) => {
    const result = await admin_service_1.AdminServices.updateUserStatus(req.params.id, req.body.status);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "User status updated successfully",
        data: result,
    });
});
const getAllBookings = (0, catchAsync_1.default)(async (req, res) => {
    const result = await admin_service_1.AdminServices.getAllBookings(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Bookings retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
const getAllCategories = (0, catchAsync_1.default)(async (req, res) => {
    const result = await category_service_1.CategoryServices.getAllCategories();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Categories retrieved successfully",
        data: result,
    });
});
const createCategory = (0, catchAsync_1.default)(async (req, res) => {
    const result = await category_service_1.CategoryServices.createCategory(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Category created successfully",
        data: result,
    });
});
exports.AdminControllers = {
    getAllUsers,
    updateUserStatus,
    getAllBookings,
    getAllCategories,
    createCategory,
};
