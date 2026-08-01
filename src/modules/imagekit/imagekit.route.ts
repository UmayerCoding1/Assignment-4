import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Request, Response } from "express";
import AppError from "../../utils/AppError";
import imagekit from "../../lib/imagekit";
import { sendResponse } from "../../utils/sendResponse";

const imagekitRouter = Router();

imagekitRouter.get('/auth', auth('CUSTOMER', 'TECHNICIAN', 'ADMIN'), async (req: Request, res: Response) => {
    try {
        const authParams = imagekit.getAuthenticationParameters();

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Auth url generated successfully!",
            data: authParams,
        })
    } catch (error) {
        throw new AppError(400, "Failed to get auth url")
    }

})



export default imagekitRouter;