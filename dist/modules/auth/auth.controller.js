"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = require("../../utils/sendResponse");
const auth_service_1 = require("./auth.service");
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
let cookieOptions;
// cookieOptions = {
//     httpOnly: true,
//     secure: true,
//     sameSite: 'none' as const,
// }
cookieOptions = {
    httpOnly: true,
    secure: config_1.default.env === 'development' ? false : true,
    sameSite: config_1.default.env === 'development' ? 'lax' : 'none',
};
const registerUser = (0, catchAsync_1.default)(async (req, res) => {
    const result = await (0, auth_service_1.registerUserService)(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "User registered successfully",
        data: result,
    });
});
const loginUser = (0, catchAsync_1.default)(async (req, res) => {
    const { user, accessToken, refreshToken } = await (0, auth_service_1.loginUserService)(req.body);
    res.cookie("accessToken", accessToken, cookieOptions);
    console.log(cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User logged in successfully",
        data: user,
    });
});
const getMyProfile = (0, catchAsync_1.default)(async (req, res) => {
    const result = await (0, auth_service_1.getMyProfileService)(req.user?.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User profile fetched successfully",
        data: result,
    });
});
const refreshToken = (0, catchAsync_1.default)(async (req, res) => {
    const { newAccessToken, newRefreshToken, user } = await (0, auth_service_1.refreshTokenService)(req);
    res.cookie("accessToken", newAccessToken, cookieOptions);
    res.cookie("refreshToken", newRefreshToken, cookieOptions);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Token refreshed successfully",
        data: user,
    });
});
const getTechnicianProfile = (0, catchAsync_1.default)(async (req, res) => {
    const result = await (0, auth_service_1.getTechnicianProfileService)(req.user?.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Technician profile fetched successfully",
        data: result,
    });
});
const logoutUser = (0, catchAsync_1.default)(async (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User logged out successfully",
        data: null,
    });
});
const updateAvatar = (0, catchAsync_1.default)(async (req, res) => {
    const result = await (0, auth_service_1.updateAvatarService)(req.body, req.user?.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Avatar updated successfully",
        data: result,
    });
});
const updateUserStatus = (0, catchAsync_1.default)(async (req, res) => {
    const result = await (0, auth_service_1.updateUserStatusService)(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Update User Status',
        data: result,
    });
});
exports.authControllers = {
    registerUser,
    loginUser,
    getMyProfile,
    refreshToken,
    logoutUser,
    getTechnicianProfile,
    updateAvatar,
    updateUserStatus
};
