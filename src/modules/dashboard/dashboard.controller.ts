import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import DashboardServices from "./dashboard.service";

const DashboardControllers = {
    getAdminDashboardData: catchAsync(async (req: Request, res: Response) => {
        const result = await DashboardServices.getAdminDashboardDataService();
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Admin dashboard data retrieved successfully",
            data: result,
        });
    }),
    getTechnicianDashboardData: catchAsync(async (req: Request, res: Response) => {
        const result = await DashboardServices.getTechnicianDashboardDataService(req.user?.id as string, req.user?.role as string);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Technician dashboard data retrieved successfully",
            data: result,
        });
    }),
    getCustomerDashboardData: catchAsync(async (req: Request, res: Response) => {
        const result = await DashboardServices.getCustomerDashboardDataService(req.user?.id as string);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Customer dashboard data retrieved successfully",
            data: result,
        });
    })
}

export default DashboardControllers;