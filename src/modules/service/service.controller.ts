import { Request, Response } from "express";
import { ServiceServices } from "./service.service";
import httpStatus from 'http-status';
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const getAllServices = catchAsync(async (req: Request, res: Response) => {
  const { data, meta } = await ServiceServices.getAllServices(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Services retrieved successfully!",
    meta,
    data,
  });
});

const getServiceById = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceServices.getServiceById(req.params.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service retrieved successfully!",
    data: result,
  });
});

const createService = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceServices.createService(req.user!.id, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Service created successfully!",
    data: result,
  });
});

const updateService = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceServices.updateService(
    req.params.id as string,
    req.user!.id,
    req.body
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Service updated successfully!",
    data: result,
  });
});

const deleteService = catchAsync(async (req: Request, res: Response) => {
  await ServiceServices.deleteService(
    req.params.id as string,
    req.user!.id
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Service deleted successfully!",
    data: null,
  });
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceServices.getAllCategories(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Categories retrieved successfully!",
    data: result,
  });
});

export const ServiceControllers = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getAllCategories,
};
