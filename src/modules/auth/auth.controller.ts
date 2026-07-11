import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { getMyProfileService, loginUserService, registerUserService } from "./auth.service";
import httpStatus from "http-status";

const registerUser = catchAsync(async (req: Request, res: Response) => {
    const result = await registerUserService(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User registered successfully",
        data: result,
    });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await loginUserService(req.body);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 day
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User logged in successfully",
        data: user,
    });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
    const result = await getMyProfileService(req.user?.id as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User profile fetched successfully",
        data: result,
    });
});


const logoutUser = catchAsync(async (req: Request, res: Response) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User logged out successfully",
        data: null,
    });
});

export const authControllers = {
    registerUser,
    loginUser,
    getMyProfile,
    logoutUser
}