import { Request, Response } from "express";
import { BookingServices } from "./booking.service";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingServices.createBooking(req.user!.id, req.body);
  console.log(req.ip)
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Booking created successfully",
    data: result,
  });
});

const getMyBookings = catchAsync(async (req: Request, res: Response) => {
  console.log(req.ip)
  const result = await BookingServices.getMyBookings(req.user!.id, req.user!.role);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Bookings retrieved successfully",
    data: result,
  });
});

const getBookingById = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingServices.getBookingById(
    req.params.id as string,
    req.user!.id,
    req.user!.role
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking retrieved successfully",
    data: result,
  });
});

const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingServices.updateBookingStatus(req.params.id as string, req.body.status);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking updated successfully",
    data: result,
  });
})

export const BookingControllers = {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus
};
