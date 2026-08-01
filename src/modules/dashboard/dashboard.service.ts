import { Request } from "express";
import { prisma } from "../../lib/prisma";

const DashboardServices = {
    getAdminDashboardDataService: async (req: Request) => {
        const userId = req.user?.id;

        const totalAmount = await prisma.payment.aggregate({
            _sum: {
                amount: true
            }
        });
        const totalVolume = totalAmount._sum.amount || 0

        const totalBooking = await prisma.booking.count();

        const totalUsers = await prisma.user.count();
        const totalActiveUsers = await prisma.user.count({
            where: {
                status: 'ACTIVE'
            }
        });
        const totalActiveTechnician = await prisma.technicianProfile.count({
            where: {
                status: 'AVAILABLE',
            }
        });
        const totalBlockedUsers = await prisma.user.count({
            where: {
                status: 'BLOCKED'
            }
        });
        const totalTechnicians = await prisma.technicianProfile.count();

        return {
            totalVolume,
            totalBooking,
            totalUsers,
            totalActiveUsers,
            totalActiveTechnician,
            totalBlockedUsers,
            totalTechnicians
        }
    }
}

export default DashboardServices;