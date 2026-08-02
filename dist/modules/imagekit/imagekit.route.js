"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const AppError_1 = __importDefault(require("../../utils/AppError"));
const imagekit_1 = __importDefault(require("../../lib/imagekit"));
const sendResponse_1 = require("../../utils/sendResponse");
const imagekitRouter = (0, express_1.Router)();
imagekitRouter.get('/auth', (0, auth_1.auth)('CUSTOMER', 'TECHNICIAN', 'ADMIN'), async (req, res) => {
    try {
        const authParams = imagekit_1.default.getAuthenticationParameters();
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: 200,
            success: true,
            message: "Auth url generated successfully!",
            data: authParams,
        });
    }
    catch (error) {
        throw new AppError_1.default(400, "Failed to get auth url");
    }
});
exports.default = imagekitRouter;
