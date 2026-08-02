"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = require("../../utils/sendResponse");
const dashboard_service_1 = __importDefault(require("./dashboard.service"));
const DashboardControllers = {
    getAdminDashboardData: (0, catchAsync_1.default)(async (req, res) => {
        const result = await dashboard_service_1.default.getAdminDashboardDataService(req);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: 200,
            success: true,
            message: "Admin dashboard data retrieved successfully",
            data: result,
        });
    })
};
exports.default = DashboardControllers;
