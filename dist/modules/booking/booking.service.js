"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingServices = void 0;
const prisma_1 = require("../../lib/prisma");
const AppError_1 = __importDefault(require("../../utils/AppError"));
const createBooking = async (customerId, payload) => {
    const categoty = await prisma_1.prisma.category.findUnique({
        where: { id: payload.categoryId },
    });
    console.log(categoty);
    if (!categoty) {
        throw new AppError_1.default(404, "Categoty not found");
    }
    const result = await prisma_1.prisma.booking.create({
        data: {
            customerId,
            technicianId: payload.technicianId,
            categoryId: payload.categoryId,
            bookingDate: new Date(payload.bookingDate),
            issue: payload.issue,
            workDuration: payload.workDuration,
            totalAmount: payload.totalAmount
        },
        include: {
            category: true,
            technician: {
                select: { name: true, email: true },
            },
        },
    });
    return result;
};
const getMyBookings = async (userId, role) => {
    const where = {};
    if (role === "CUSTOMER") {
        where.customerId = userId;
    }
    else if (role === "TECHNICIAN") {
        where.technicianId = userId;
    }
    const result = await prisma_1.prisma.booking.findMany({
        where,
        include: {
            category: true,
            technician: { select: { name: true, email: true, phone: true } },
            customer: { select: { name: true, email: true, phone: true } },
            payment: true
        },
        orderBy: { createdAt: "desc" },
    });
    return result;
};
const getBookingById = async (id, userId, role) => {
    const booking = await prisma_1.prisma.booking.findUnique({
        where: { id },
        include: {
            category: true,
            technician: { select: { name: true, email: true, phone: true } },
            customer: { select: { name: true, email: true, phone: true } },
            payment: true,
        },
    });
    if (!booking) {
        throw new AppError_1.default(404, "Booking not found");
    }
    if (role !== "ADMIN" &&
        booking.customerId !== userId &&
        booking.technicianId !== userId) {
        throw new AppError_1.default(403, "Not authorized to view this booking");
    }
    return booking;
};
const updateBookingStatus = async (id, status) => {
    const result = await prisma_1.prisma.booking.update({
        where: { id },
        data: { status: status },
    });
    if (!result) {
        throw new AppError_1.default(404, "Booking not found");
    }
    if (status === 'COMPLETED') {
        await prisma_1.prisma.technicianProfile.update({
            where: { userId: result.technicianId },
            data: {
                completedJobs: { increment: 1 }
            }
        });
    }
    return result;
};
const deleteBookingService = async (id) => {
    console.log(id);
    const result = await prisma_1.prisma.booking.delete({
        where: { id },
    });
    if (!result) {
        throw new AppError_1.default(404, "Booking not found");
    }
    return result;
};
exports.BookingServices = {
    createBooking,
    getMyBookings,
    getBookingById,
    updateBookingStatus,
    deleteBookingService
};
