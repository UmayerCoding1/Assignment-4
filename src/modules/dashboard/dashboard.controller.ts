import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import DashboardServices from "./dashboard.service";

const DashboardControllers = {
    getAdminDashboardData: catchAsync(async (req: Request, res: Response) => {
        const result = await DashboardServices.getAdminDashboardDataService(req);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Admin dashboard data retrieved successfully",
            data: result,
        });
    })
}

export default DashboardControllers;