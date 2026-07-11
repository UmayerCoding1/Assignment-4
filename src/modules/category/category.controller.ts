import { Request, Response } from "express";
import { CategoryServices } from "./category.service";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";


const getAllCategories = catchAsync(async (req: Request, res: Response) => {
    const categories = await CategoryServices.getAllCategories();

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Categories retrieved successfully!",
        data: categories,
    });
});

const createCategory = catchAsync(async (req: Request, res: Response) => {
    const category = await CategoryServices.createCategory(req.body);

    return sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Category created successfully!",
        data: category,
    });
});

const updateCategory = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const updatedCategory = await CategoryServices.updateCategory(
            id as string,
            req.body
        );

        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Category updated successfully!",
            data: updatedCategory,
        });
    }
);

const deleteCategory = catchAsync(
    async (req: Request, res: Response) => {
        await CategoryServices.deleteCategory(req.params.id as string);

        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Category deleted successfully!",
            data: null,
        });
    });

export const CategoryControllers = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
};