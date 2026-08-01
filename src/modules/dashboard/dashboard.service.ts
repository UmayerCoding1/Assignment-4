import { Request } from "express";
import { prisma } from "../../lib/prisma";

const DashboardServices = {
    getAdminDashboardDataService: async (req: Request) => {
        const userId = req.user?.id;

        const totalVolume = await prisma.payment.aggregate({
            _sum: {
                amount: true
            }
        });

        const totalBooking = prisma.booking.count();
        const totalUsers = prisma.user.count();
        const totalActiveUsers = prisma.user.findMany({
            where: {
                status: 'ACTIVE'
            }
        });
        const totalActiveTechnician = prisma.technicianProfile.findMany({
            where: {
                status: 'AVAILABLE',
            }
        });
        const totalBlockedUsers = prisma.user.findMany({
            where: {
                status: 'BLOCKED'
            }
        });
        const totalBlockedTechnicians = prisma.technicianProfile.findMany({
            where: {
                status: 'UNAVAILABLE',
            }
        });

        return {
            totalVolume,
            totalBooking,
            totalUsers,
            totalActiveUsers,
            totalActiveTechnician,
            totalBlockedUsers,
            totalBlockedTechnicians
        }
    }
}

export default DashboardServices;