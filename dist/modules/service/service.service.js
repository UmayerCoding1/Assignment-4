"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceServices = void 0;
const prisma_1 = require("../../lib/prisma");
const AppError_1 = __importDefault(require("../../utils/AppError"));
const getAllServices = async (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder || "desc";
    const where = {};
    if (query.searchTerm) {
        where.OR = [
            { title: { contains: query.searchTerm, mode: "insensitive" } },
            { description: { contains: query.searchTerm, mode: "insensitive" } },
        ];
    }
    if (query.categoryId) {
        where.categoryId = query.categoryId;
    }
    if (query.location) {
        where.technician = {
            technicianProfile: {
                location: { contains: query.location, mode: "insensitive" },
            },
        };
    }
    if (query.rating) {
        where.technician = {
            ...where.technician,
            technicianProfile: {
                ...where.technician?.technicianProfile,
                averageRating: { gte: parseFloat(query.rating) },
            },
        };
    }
    if (query.minPrice || query.maxPrice) {
        where.price = {};
        if (query.minPrice)
            where.price.gte = parseFloat(query.minPrice);
        if (query.maxPrice)
            where.price.lte = parseFloat(query.maxPrice);
    }
    const [data, total] = await Promise.all([
        prisma_1.prisma.service.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
            include: {
                category: true,
                technician: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        technicianProfile: true,
                    },
                },
            },
        }),
        prisma_1.prisma.service.count({ where }),
    ]);
    return {
        data,
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
    };
};
const getServiceById = async (id) => {
    const result = await prisma_1.prisma.service.findUnique({
        where: { id },
        include: {
            category: true,
            technician: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    technicianProfile: true,
                },
            },
        },
    });
    if (!result) {
        throw new AppError_1.default(404, "Service not found!");
    }
    return result;
};
const createService = async (userId, payload) => {
    const category = await prisma_1.prisma.category.findUnique({
        where: { id: payload.categoryId },
    });
    if (!category) {
        throw new AppError_1.default(404, "Category not found!");
    }
    const result = await prisma_1.prisma.service.create({
        data: {
            title: payload.title,
            description: payload.description,
            price: payload.price,
            categoryId: payload.categoryId,
            technicianId: userId,
            duration: 60, // default duration if not in payload
        },
        include: {
            category: true,
            technician: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    technicianProfile: true,
                },
            },
        },
    });
    return result;
};
const updateService = async (serviceId, userId, payload) => {
    const service = await prisma_1.prisma.service.findUnique({
        where: { id: serviceId },
    });
    if (!service) {
        throw new AppError_1.default(404, "Service not found!");
    }
    if (service.technicianId !== userId) {
        throw new AppError_1.default(403, "You are not authorized to update this service!");
    }
    if (payload.categoryId) {
        const category = await prisma_1.prisma.category.findUnique({
            where: { id: payload.categoryId },
        });
        if (!category) {
            throw new AppError_1.default(404, "Category not found!");
        }
    }
    const result = await prisma_1.prisma.service.update({
        where: { id: serviceId },
        data: payload,
        include: {
            category: true,
            technician: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    technicianProfile: true,
                },
            },
        },
    });
    return result;
};
const deleteService = async (serviceId, userId) => {
    const service = await prisma_1.prisma.service.findUnique({
        where: { id: serviceId },
    });
    if (!service) {
        throw new AppError_1.default(404, "Service not found!");
    }
    if (service.technicianId !== userId) {
        throw new AppError_1.default(403, "You are not authorized to delete this service!");
    }
    const result = await prisma_1.prisma.service.delete({
        where: { id: serviceId },
    });
    return result;
};
const getAllCategories = async (query) => {
    let orderBy = { createdAt: "desc" };
    if (query.sortBy === "name") {
        orderBy = { title: "asc" };
    }
    else if (query.sortBy === "createdAt") {
        orderBy = { createdAt: "desc" };
    }
    const result = await prisma_1.prisma.category.findMany({
        orderBy,
        include: {
            _count: { select: { services: true } },
        },
    });
    return result;
};
exports.ServiceServices = {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    getAllCategories,
};
