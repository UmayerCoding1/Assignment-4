import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Request, Response } from "express";
import AppError from "../../utils/AppError";
import imagekit from "../../lib/imagekit";
import { sendResponse } from "../../utils/sendResponse";
import config from "../../config";

const imagekitRouter = Router();

imagekitRouter.get(
    "/auth",
    auth("CUSTOMER", "TECHNICIAN", "ADMIN"),
    async (req: Request, res: Response) => {
        try {
            const authParams =
                imagekit.helper.getAuthenticationParameters();

            sendResponse(res, {
                statusCode: 200,
                success: true,
                message: "ImageKit authentication generated successfully",
                data: {
                    ...authParams,
                    publicKey: config.imagekit.publicKey,
                },
            });
        } catch (error) {
            console.error("ImageKit Auth Error:", error);

            throw new AppError(
                400,
                "Failed to generate ImageKit authentication"
            );
        }
    }
);


export default imagekitRouter;