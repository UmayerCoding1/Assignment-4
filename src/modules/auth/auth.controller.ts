import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { getMyProfileService, getTechnicianProfileService, loginUserService, refreshTokenService, registerUserService } from "./auth.service";
import httpStatus from "http-status";
import config from "../../config";

const cookieOptions = {
    httpOnly: true,
    secure: config.env === "production",
    sameSite: config.env === "production" ? 'none' as const : 'lax' as const,
}

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
        ...cookieOptions,
        // maxAge: 1000 * 60 * 60 * 24
    });

    console.log(cookieOptions)

    res.cookie("refreshToken", refreshToken, {
        ...cookieOptions,
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


const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { newAccessToken, newRefreshToken, user } = await refreshTokenService(req);
    res.cookie("accessToken", newAccessToken, cookieOptions);
    res.cookie("refreshToken", newRefreshToken, cookieOptions)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Token refreshed successfully",
        data: user,
    });
});



const getTechnicianProfile = catchAsync(async (req: Request, res: Response) => {
    const result = await getTechnicianProfileService(req.user?.id as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Technician profile fetched successfully",
        data: result,
    });
})

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
    refreshToken,
    logoutUser,
    getTechnicianProfile
}