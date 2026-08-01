import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { Prisma } from "../../generated/prisma/client";

const getAllTechnicians = async (query: any) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where: Prisma.TechnicianProfileWhereInput = {};

  if (query.location) {
    where.location = { contains: query.location, mode: "insensitive" };
  }

  if (query.rating) {
    where.averageRating = { gte: parseFloat(query.rating) };
  }

  if (query.experience) {
    where.experience = { gte: parseInt(query.experience) };
  }

  const [data, total] = await Promise.all([
    prisma.technicianProfile.findMany({
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
    prisma.technicianProfile.count({ where }),
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

const getTechnicianProfile = async (id: string) => {
  const data = await prisma.technicianProfile.findUnique({
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
    throw new AppError(404, "Technician not found");
  }

  return data;
};

const updateProfile = async (userId: string, payload: any) => {
  const { user, category, ...profileData } = payload;

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      phone: user.phone,
      address: user.address,
      image: user.image,
    },
  });

  const update = await prisma.technicianProfile.update({
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

const updateAvailability = async (userId: string, availability: any) => {
  const existingProfile = await prisma.technicianProfile.findUnique({
    where: { userId },
  });

  if (!existingProfile) {
    throw new AppError(404, "Technician profile not found");
  }

  const updatedProfile = await prisma.technicianProfile.update({
    where: { userId },
    data: { availability },
  });

  return updatedProfile;
};

const getTechBookings = async (userId: string) => {
  const bookings = await prisma.booking.findMany({
    where: { technicianId: userId },
    include: {
      customer: { select: { name: true, email: true, phone: true } },
      category: { select: { title: true, startingPrice: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return bookings;
};

const updateTechBookingStatus = async (userId: string, bookingId: string, status: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new AppError(404, "Booking not found");
  }

  if (booking.technicianId !== userId) {
    throw new AppError(403, "Not authorized to update this booking");
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: status as any },
  });

  // If status is completed, you might want to increment completedJobs for the technician
  if (status === "COMPLETED" && booking.status !== "COMPLETED") {
    await prisma.technicianProfile.update({
      where: { userId },
      data: {
        completedJobs: { increment: 1 },
      },
    });
  }

  return updatedBooking;
};

export const TechnicianServices = {
  getAllTechnicians,
  getTechnicianProfile,
  updateProfile,
  updateAvailability,
  getTechBookings,
  updateTechBookingStatus,
};
