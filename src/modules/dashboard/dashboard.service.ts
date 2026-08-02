import { Request } from "express";
import { prisma } from "../../lib/prisma";

const DashboardServices = {
    getAdminDashboardDataService: async () => {

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
    },

    getTechnicianDashboardDataService: async (userId: string, userRole: string) => {
        const pendingJobs = await prisma.booking.count({
            where: {
                technicianId: userId,
                status: 'REQUESTED'
            }
        });

        const activeJobs = await prisma.booking.count({
            where: {
                technicianId: userId,
                status: { in: ['ACCEPTED', 'IN_PROGRESS'] }
            }
        });

        const completedJobs = await prisma.booking.count({
            where: {
                technicianId: userId,
                status: 'COMPLETED'
            }
        });

        const canceledJobs = await prisma.booking.count({
            where: {
                technicianId: userId,
                status: 'REQUESTED'
            }
        });

        const netEarnings = await prisma.payment.aggregate({
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


        // const responseTime = await prisma.booking.aggregate({
        //     where: {
        //         technicianId: userId,
        //         status: 'COMPLETED'
        //     },
        //     _avg: {
        //         responseTime: true
        //     }
        // })

        return {
            pendingJobs,
            activeJobs,
            completedJobs,
            canceledJobs,
            totalEarning
        }
    }
}

export default DashboardServices;