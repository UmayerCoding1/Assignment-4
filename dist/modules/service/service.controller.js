"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceControllers = void 0;
const service_service_1 = require("./service.service");
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = require("../../utils/sendResponse");
const getAllServices = (0, catchAsync_1.default)(async (req, res) => {
    const { data, meta } = await service_service_1.ServiceServices.getAllServices(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Services retrieved successfully!",
        meta,
        data,
    });
});
const getServiceById = (0, catchAsync_1.default)(async (req, res) => {
    const result = await service_service_1.ServiceServices.getServiceById(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Service retrieved successfully!",
        data: result,
    });
});
const createService = (0, catchAsync_1.default)(async (req, res) => {
    const result = await service_service_1.ServiceServices.createService(req.user.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Service created successfully!",
        data: result,
    });
});
const updateService = (0, catchAsync_1.default)(async (req, res) => {
    const result = await service_service_1.ServiceServices.updateService(req.params.id, req.user.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Service updated successfully!",
        data: result,
    });
});
const deleteService = (0, catchAsync_1.default)(async (req, res) => {
    await service_service_1.ServiceServices.deleteService(req.params.id, req.user.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Service deleted successfully!",
        data: null,
    });
});
const getAllCategories = (0, catchAsync_1.default)(async (req, res) => {
    const result = await service_service_1.ServiceServices.getAllCategories(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Categories retrieved successfully!",
        data: result,
    });
});
exports.ServiceControllers = {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    getAllCategories,
};
