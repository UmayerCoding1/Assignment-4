import config from "../../config";
import { Role } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import bcrypt from 'bcryptjs'
import { jwtUtils } from "../../utils/jwt";
import { SignOptions } from "jsonwebtoken";
import { TLoginPayload, TRegisterPayload } from "./auth.validation";
import { Request } from "express";
import { hashToken } from "../../utils/hashToken";


export const registerUserService = async (payload: TRegisterPayload) => {

    const isUserExist = await prisma.user.findUnique({
        where: { email: payload.email }
    });

    if (isUserExist) {
        throw new AppError(409, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(payload.password, config.hash_salt);

    const user = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
            data: {
                ...payload,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true,
            },
        });

        if (newUser.role === Role.TECHNICIAN) {
            const newTechnician = await tx.technicianProfile.create({
                data: {
                    userId: newUser.id,
                },
            });

            await tx.user.update({
                where: {
                    id: newUser.id
                },
                data: {
                    technicianProfile: { connect: { id: newTechnician.id } }
                }
            })
        }

        return newUser;
    });

    return user;
};

export const loginUserService = async (payload: TLoginPayload) => {
    const user = await prisma.user.findUnique({
        where: {
            email: payload.email,
        },

    });

    if (!user) {
        throw new AppError(401, "Invalid email or password");
    }
    const { password, ...userWithoutPassword } = user;

    const isPasswordMatched = await bcrypt.compare(
        payload.password,
        user.password
    );

    if (!isPasswordMatched) {
        throw new AppError(401, "Invalid email or password");
    }

    const accessToken = jwtUtils.createToken(
        {
            id: user.id,
            email: user.email,
            role: user.role,
        },
        config.access_token_secret,
        config.access_token_expires_in as SignOptions
    );

    const refreshToken = jwtUtils.createToken(
        {
            id: user.id,
            email: user.email,
            role: user.role,
        },
        config.refresh_token_secret,
        config.refresh_token_expires_in as SignOptions
    );

    const hashRefreshToken = hashToken(refreshToken);

    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            refreshToken: hashRefreshToken
        }
    });


    return {
        user: userWithoutPassword,
        accessToken,
        refreshToken
    }
};


export const getMyProfileService = async (userId: string) => {
    const result = await prisma.user.findUnique({
        where: { id: userId },
        omit: { password: true },
    });

    if (!result) {
        throw new AppError(404, "User not found!");
    }

    return result;

}


export const refreshTokenService = async (req: Request) => {
    const refreshTokenFromCookie = req.cookies.refreshToken;

    if (!refreshTokenFromCookie) {
        throw new AppError(401, "Refresh token not found");
    }

    let userId: string;
    let userRole: Role;
    let savedRefreshToken: string;
    try {
        const decodedToken = jwtUtils.verifyToken(refreshTokenFromCookie, config.refresh_token_secret);

        if (!decodedToken.success) {
            throw new AppError(401, decodedToken.error || "Invalid refresh token");
        }

        const { id, role } = decodedToken.data as { id: string, role: Role };
        userId = id;
        userRole = role;

        const user = await prisma.user.findFirst({
            where: {
                id: userId,
            },
        });

        console.log('pass')
        console.log('user', user);
        console.log('DB token', user?.refreshToken);

        if (!user || !user.refreshToken) {
            throw new AppError(404, "User not found or refresh token missing");
        }
        savedRefreshToken = user.refreshToken;
        console.log('check', user?.refreshToken)

    } catch (error) {
        throw new AppError(401, "Invalid refresh token");
    }

    const hashRefrashToken = hashToken(refreshTokenFromCookie);
    const isRefreshTokenValid = savedRefreshToken === hashRefrashToken;

    if (!isRefreshTokenValid) {
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                refreshToken: null
            }
        });
        throw new AppError(401, "Invalid refresh token")
    }

    const user = await prisma.user.findFirst({
        where: {
            id: userId
        }
    })

    if (!user) {
        throw new AppError(404, "User not found");
    }

    const newAccessToken = jwtUtils.createToken({
        id: userId,
        email: user.email,
        role: user.role
    }, config.access_token_secret, config.access_token_expires_in as SignOptions)

    const newRefreshToken = jwtUtils.createToken({
        id: userId,
        email: user.email,
        role: user.role
    }, config.refresh_token_secret, config.refresh_token_expires_in as SignOptions)

    const hashNewRefreshToken = hashToken(newRefreshToken);

    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            refreshToken: hashNewRefreshToken
        }
    });

    return {
        newAccessToken,
        newRefreshToken,
        user: {
            id: userId,
            name: user.name,
            email: user.email,
            role: user.role
        }
    }
}

export const getTechnicianProfileService = async (userId: string) => {
    const userdata = await prisma.user.findFirst({
        where: {
            id: userId
        }
    });

    if (!userdata) {
        throw new AppError(404, "User not found");
    }

    const technicianProfile = await prisma.technicianProfile.findUnique({
        where: {
            userId
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    phone: true,
                    role: true,
                    status: true,
                    id: true,
                    image: true,
                    address: true
                }
            },
            category: true
        }
    })

    if (!technicianProfile) {
        throw new AppError(404, "Technician profile not found");
    }

    console.log(technicianProfile);

    return technicianProfile

}


export const updateAvatarService = async (payload: { imageUrl: string }, userId: string) => {
    const result = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            image: payload.imageUrl
        }
    })

    if (!result) {
        throw new AppError(404, "Failed to upload avatar");
    }

    return result;
}


export const updateUserStatusService = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            status: true,
        },
    });

    if (!user) {
        throw new AppError(404, "User not found");
    }

    const newStatus =
        user.status === "ACTIVE"
            ? "BLOCKED"
            : "ACTIVE";

    const updatedUser = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            status: newStatus,
        },
    });

    return updatedUser;
};