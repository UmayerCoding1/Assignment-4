import { Request, Response } from "express";
import { TechnicianServices } from "./technician.service";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const getAllTechnicians = catchAsync(async (req: Request, res: Response) => {
  const result = await TechnicianServices.getAllTechnicians(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Technicians retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getTechnicianProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await TechnicianServices.getTechnicianProfile(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Technician profile retrieved successfully",
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await TechnicianServices.updateProfile(req.user!.id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});

const updateAvailability = catchAsync(async (req: Request, res: Response) => {
  const result = await TechnicianServices.updateAvailability(
    req.user!.id,
    req.body.availability
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Availability updated successfully",
    data: result,
  });
});

const getTechBookings = catchAsync(async (req: Request, res: Response) => {
  const result = await TechnicianServices.getTechBookings(req.user!.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Bookings retrieved successfully",
    data: result,
  });
});

const updateTechBookingStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await TechnicianServices.updateTechBookingStatus(
    req.user!.id,
    req.params.id as string,
    req.body.status
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking status updated successfully",
    data: result,
  });
});

export const TechnicianControllers = {
  getAllTechnicians,
  getTechnicianProfile,
  updateProfile,
  updateAvailability,
  getTechBookings,
  updateTechBookingStatus,
};
