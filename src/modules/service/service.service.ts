import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import type { TCreateServicePayload, TUpdateServicePayload } from "./service.validation";

type ServiceQuery = {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
  searchTerm?: string;
  categoryId?: string;
  location?: string;
  rating?: string;
  minPrice?: string;
  maxPrice?: string;
};

const getAllServices = async (query: ServiceQuery) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";

  const where: Prisma.ServiceWhereInput = {};

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
    } as any;
  }

  if (query.minPrice || query.maxPrice) {
    where.price = {};
    if (query.minPrice) where.price.gte = parseFloat(query.minPrice);
    if (query.maxPrice) where.price.lte = parseFloat(query.maxPrice);
  }

  const [data, total] = await Promise.all([
    prisma.service.findMany({
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
    prisma.service.count({ where }),
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

const getServiceById = async (id: string) => {
  const result = await prisma.service.findUnique({
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
    throw new AppError(404, "Service not found!");
  }

  return result;
};

const createService = async (userId: string, payload: TCreateServicePayload) => {
  const category = await prisma.category.findUnique({
    where: { id: payload.categoryId },
  });

  if (!category) {
    throw new AppError(404, "Category not found!");
  }

  const result = await prisma.service.create({
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

const updateService = async (
  serviceId: string,
  userId: string,
  payload: TUpdateServicePayload
) => {
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  });

  if (!service) {
    throw new AppError(404, "Service not found!");
  }

  if (service.technicianId !== userId) {
    throw new AppError(403, "You are not authorized to update this service!");
  }

  if (payload.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: payload.categoryId },
    });

    if (!category) {
      throw new AppError(404, "Category not found!");
    }
  }

  const result = await prisma.service.update({
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

const deleteService = async (serviceId: string, userId: string) => {
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  });

  if (!service) {
    throw new AppError(404, "Service not found!");
  }

  if (service.technicianId !== userId) {
    throw new AppError(403, "You are not authorized to delete this service!");
  }

  const result = await prisma.service.delete({
    where: { id: serviceId },
  });

  return result;
};

const getAllCategories = async (query: { sortBy?: string }) => {
  let orderBy: Prisma.CategoryOrderByWithRelationInput = { createdAt: "desc" };

  if (query.sortBy === "name") {
    orderBy = { title: "asc" };
  } else if (query.sortBy === "createdAt") {
    orderBy = { createdAt: "desc" };
  }

  const result = await prisma.category.findMany({
    orderBy,
    include: {
      _count: { select: { services: true } },
    },
  });

  return result;
};

export const ServiceServices = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getAllCategories,
};
