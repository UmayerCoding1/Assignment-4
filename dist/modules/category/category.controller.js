"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryControllers = void 0;
const category_service_1 = require("./category.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = require("../../utils/sendResponse");
const getAllCategories = (0, catchAsync_1.default)(async (req, res) => {
    const categories = await category_service_1.CategoryServices.getAllCategories();
    return (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Categories retrieved successfully!",
        data: categories,
    });
});
const createCategory = (0, catchAsync_1.default)(async (req, res) => {
    const category = await category_service_1.CategoryServices.createCategory(req.body);
    return (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Category created successfully!",
        data: category,
    });
});
const updateCategory = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const updatedCategory = await category_service_1.CategoryServices.updateCategory(id, req.body);
    return (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Category updated successfully!",
        data: updatedCategory,
    });
});
const deleteCategory = (0, catchAsync_1.default)(async (req, res) => {
    await category_service_1.CategoryServices.deleteCategory(req.params.id);
    return (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Category deleted successfully!",
        data: null,
    });
});
const getCategoryById = (0, catchAsync_1.default)(async (req, res) => {
    const result = await category_service_1.CategoryServices.getCategoryById(req.params.id);
    return (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Category retrieved successfully!",
        data: result,
    });
});
exports.CategoryControllers = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
    getCategoryById
};
