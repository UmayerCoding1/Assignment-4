import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { registerUserService } from "./auth.service";


const registerUser = catchAsync(async (req: Request, res: Response) => {
    const result = await registerUserService(req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User registered successfully",
        data: [],
    });
});


export const authControllers = {
    registerUser
}