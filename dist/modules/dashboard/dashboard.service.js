"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../lib/prisma");
const DashboardServices = {
    getAdminDashboardDataService: async (req) => {
        const userId = req.user?.id;
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
    }
};
exports.default = DashboardServices;
