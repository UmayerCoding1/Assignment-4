"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminServices = void 0;
const prisma_1 = require("../../lib/prisma");
const AppError_1 = __importDefault(require("../../utils/AppError"));
const getAllUsers = async (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
        prisma_1.prisma.user.findMany({
            skip,
            take: limit,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                phone: true,
                address: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
        }),
        prisma_1.prisma.user.count(),
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
const updateUserStatus = async (id, status) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id },
    });
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    const updatedUser = await prisma_1.prisma.user.update({
        where: { id },
        data: { status: status },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
        },
    });
    return updatedUser;
};
const getAllBookings = async (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
        prisma_1.prisma.booking.findMany({
            skip,
            take: limit,
            include: {
                customer: { select: { id: true, name: true, email: true } },
                technician: { select: { id: true, name: true, email: true } },
                service: { select: { id: true, title: true, price: true } },
            },
            orderBy: { createdAt: "desc" },
        }),
        prisma_1.prisma.booking.count(),
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
exports.AdminServices = {
    getAllUsers,
    updateUserStatus,
    getAllBookings,
};
