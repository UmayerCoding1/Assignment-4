"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryServices = void 0;
const prisma_1 = require("../../lib/prisma");
const AppError_1 = __importDefault(require("../../utils/AppError"));
const getAllCategories = async () => {
    // const result = await prisma.$transaction([
    //     prisma.service.deleteMany(),
    //     prisma.category.deleteMany(),
    // ]);
    const result = await prisma_1.prisma.category.findMany({
        include: { _count: { select: { services: true } } },
        orderBy: { createdAt: "desc" },
    });
    // console.log(result)
    return result;
};
const getCategoryById = async (categoryId) => {
    const result = await prisma_1.prisma.category.findFirst({
        where: { id: categoryId },
    });
    console.log('result', result);
    if (!result) {
        throw new AppError_1.default(404, "Category not found!");
    }
    return result;
};
const createCategory = async (payload) => {
    const existing = await prisma_1.prisma.category.findFirst({
        where: { title: payload.title },
    });
    if (existing) {
        throw new AppError_1.default(409, "Category with this name already exists!");
    }
    const result = await prisma_1.prisma.category.create({
        data: payload,
    });
    return result;
};
const updateCategory = async (categoryId, payload) => {
    const category = await prisma_1.prisma.category.findUnique({
        where: { id: categoryId },
    });
    if (!category) {
        throw new AppError_1.default(404, "Category not found!");
    }
    if (payload.title && payload.title !== category.title) {
        const existing = await prisma_1.prisma.category.findFirst({
            where: { title: payload.title },
        });
        if (existing) {
            throw new AppError_1.default(409, "Category with this name already exists!");
        }
    }
    const result = await prisma_1.prisma.category.update({
        where: { id: categoryId },
        data: payload,
        include: { _count: { select: { services: true } } },
    });
    return result;
};
const deleteCategory = async (categoryId) => {
    const category = await prisma_1.prisma.category.findUnique({
        where: { id: categoryId },
        include: { _count: { select: { services: true } } },
    });
    if (!category) {
        throw new AppError_1.default(404, "Category not found!");
    }
    if (category._count.services > 0) {
        throw new AppError_1.default(400, "Cannot delete a category that has services assigned to it!");
    }
    const result = await prisma_1.prisma.category.delete({
        where: { id: categoryId },
    });
    return result;
};
exports.CategoryServices = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById
};
