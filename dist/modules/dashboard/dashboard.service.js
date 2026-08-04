"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../lib/prisma");
const DashboardServices = {
    getAdminDashboardDataService: async () => {
        const totalAmount = await prisma_1.prisma.payment.aggregate({
            _sum: {
                amount: true
            }
        });
        const totalVolume = totalAmount._sum.amount || 0;
        const totalBooking = await prisma_1.prisma.booking.count();
        const totalUsers = await prisma_1.prisma.user.count();
        const totalActiveUsers = await prisma_1.prisma.user.count({
            where: {
                status: 'ACTIVE'
            }
        });
        const totalActiveTechnician = await prisma_1.prisma.technicianProfile.count({
            where: {
                status: 'AVAILABLE',
            }
        });
        const totalBlockedUsers = await prisma_1.prisma.user.count({
            where: {
                status: 'BLOCKED'
            }
        });
        const totalTechnicians = await prisma_1.prisma.technicianProfile.count();
        return {
            totalVolume,
            totalBooking,
            totalUsers,
            totalActiveUsers,
            totalActiveTechnician,
            totalBlockedUsers,
            totalTechnicians
        };
    },
    getTechnicianDashboardDataService: async (userId, userRole) => {
        const pendingJobs = await prisma_1.prisma.booking.count({
            where: {
                technicianId: userId,
                status: 'REQUESTED'
            }
        });
        const activeJobs = await prisma_1.prisma.booking.count({
            where: {
                technicianId: userId,
                status: { in: ['ACCEPTED', 'IN_PROGRESS'] }
            }
        });
        const completedJobs = await prisma_1.prisma.booking.count({
            where: {
                technicianId: userId,
                status: 'COMPLETED'
            }
        });
        const canceledJobs = await prisma_1.prisma.booking.count({
            where: {
                technicianId: userId,
                status: 'REQUESTED'
            }
        });
        const netEarnings = await prisma_1.prisma.payment.aggregate({
            where: {
                booking: {
                    technicianId: userId,
                    status: 'COMPLETED'
                }
            },
            _sum: {
                amount: true
            }
        });
        const totalEarning = netEarnings._sum.amount || 0;
        const reacentBooking = await prisma_1.prisma.booking.findMany({
            where: {
                technicianId: userId,
                status: 'REQUESTED'
            },
            take: 5,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                customer: {
                    select: {
                        name: true,
                        email: true,
                        id: true,
                        role: true,
                    }
                },
                category: {
                    select: {
                        title: true,
                        id: true,
                    }
                },
            }
        });
        // const responseTime = await prisma.booking.aggregate({
        //     where: {
        //         technicianId: userId,
        //         status: 'COMPLETED'
        //     },
        //     _avg: {
        //         responseTime: true
        //     }
        // })
        const response = {
            pendingJobs,
            activeJobs,
            completedJobs,
            canceledJobs,
            totalEarning,
            reacentBooking
        };
        return response;
    },
    getCustomerDashboardDataService: async (userId) => {
        const totalBooking = await prisma_1.prisma.booking.count({
            where: {
                customerId: userId,
            }
        });
        const activeJobs = await prisma_1.prisma.booking.count({
            where: {
                customerId: userId,
                status: { in: ['REQUESTED', 'ACCEPTED', 'IN_PROGRESS'] }
            }
        });
        const inProgressJobs = await prisma_1.prisma.booking.count({
            where: {
                customerId: userId,
                status: 'IN_PROGRESS'
            }
        });
        const completedJobs = await prisma_1.prisma.booking.count({
            where: {
                customerId: userId,
                status: 'COMPLETED'
            }
        });
        const canceledJobs = await prisma_1.prisma.booking.count({
            where: {
                customerId: userId,
                status: 'CANCELLED'
            }
        });
        const totalSpent = await prisma_1.prisma.payment.aggregate({
            where: {
                booking: {
                    customerId: userId,
                    status: { in: ['PAID', 'COMPLETED', 'IN_PROGRESS'] }
                }
            },
            _sum: {
                amount: true
            }
        });
        const response = {
            totalBooking,
            activeJobs,
            inProgressJobs,
            completedJobs,
            canceledJobs,
            totalSpent: totalSpent._sum.amount || 0
        };
        return response;
    }
};
exports.default = DashboardServices;
