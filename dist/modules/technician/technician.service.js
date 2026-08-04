"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TechnicianServices = void 0;
const prisma_1 = require("../../lib/prisma");
const AppError_1 = __importDefault(require("../../utils/AppError"));
const getAllTechnicians = async (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 1;
    const skip = (page - 1) * limit;
    console.log(query);
    const where = {};
    if (query.location) {
        where.location = { contains: query.location, mode: "insensitive" };
    }
    if (query.categoryFilter) {
        where.categoryId = query.categoryFilter;
    }
    if (query.search) {
        where.OR = [
            {
                user: {
                    name: {
                        contains: query.search,
                        mode: "insensitive",
                    },
                },
            },
            {
                category: {
                    title: {
                        contains: query.search,
                        mode: "insensitive",
                    },
                },
            },
        ];
    }
    if (query.rating) {
        where.averageRating = { gte: parseFloat(query.rating) };
    }
    if (query.experience) {
        where.experience = { gte: parseInt(query.experience) };
    }
    const [data, total] = await Promise.all([
        prisma_1.prisma.technicianProfile.findMany({
            where,
            skip,
            take: limit,
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        image: true,
                        services: true,
                    },
                },
                category: {
                    select: {
                        title: true,
                        id: true
                    }
                }
            },
        }),
        prisma_1.prisma.technicianProfile.count({ where }),
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
const getTechnicianProfile = async (id) => {
    const data = await prisma_1.prisma.technicianProfile.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    image: true,
                    services: true,
                    technicianReviews: {
                        include: {
                            customer: {
                                select: { name: true, image: true },
                            },
                        },
                    },
                },
            },
            category: {
                select: {
                    title: true,
                    id: true
                }
            }
        },
    });
    if (!data) {
        throw new AppError_1.default(404, "Technician not found");
    }
    return data;
};
const updateProfile = async (userId, payload) => {
    const { user, category, ...profileData } = payload;
    await prisma_1.prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            phone: user.phone,
            address: user.address,
            image: user.image,
        },
    });
    const update = await prisma_1.prisma.technicianProfile.update({
        where: {
            userId,
        },
        data: {
            ...profileData,
            hourlyRate: profileData.hourlyRate
                ? Number(profileData.hourlyRate)
                : null,
        },
    });
    return {
        user: { ...user },
        TechnicianProfile: { ...update },
    };
};
const updateAvailability = async (userId, availability) => {
    const existingProfile = await prisma_1.prisma.technicianProfile.findUnique({
        where: { userId },
    });
    if (!existingProfile) {
        throw new AppError_1.default(404, "Technician profile not found");
    }
    const updatedProfile = await prisma_1.prisma.technicianProfile.update({
        where: { userId },
        data: { availability },
    });
    return updatedProfile;
};
const getTechBookings = async (userId) => {
    const bookings = await prisma_1.prisma.booking.findMany({
        where: { technicianId: userId },
        include: {
            customer: { select: { name: true, email: true, phone: true } },
            category: { select: { title: true, startingPrice: true } },
        },
        orderBy: { createdAt: "desc" },
    });
    return bookings;
};
const updateTechBookingStatus = async (userId, bookingId, status) => {
    const booking = await prisma_1.prisma.booking.findUnique({
        where: { id: bookingId },
    });
    if (!booking) {
        throw new AppError_1.default(404, "Booking not found");
    }
    if (booking.technicianId !== userId) {
        throw new AppError_1.default(403, "Not authorized to update this booking");
    }
    const updatedBooking = await prisma_1.prisma.booking.update({
        where: { id: bookingId },
        data: { status: status },
    });
    // If status is completed, you might want to increment completedJobs for the technician
    if (status === "COMPLETED" && booking.status !== "COMPLETED") {
        await prisma_1.prisma.technicianProfile.update({
            where: { userId },
            data: {
                completedJobs: { increment: 1 },
            },
        });
    }
    return updatedBooking;
};
const updateStatusService = async (status, techId) => {
    const result = await prisma_1.prisma.technicianProfile.update({
        where: { userId: techId },
        data: { status }
    });
    return result;
};
exports.TechnicianServices = {
    getAllTechnicians,
    getTechnicianProfile,
    updateProfile,
    updateAvailability,
    getTechBookings,
    updateTechBookingStatus,
    updateStatusService
};
