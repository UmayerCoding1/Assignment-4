import config from "../../config";
import { Role } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import bcrypt from 'bcryptjs'
import { jwtUtils } from "../../utils/jwt";
import { SignOptions } from "jsonwebtoken";
import { TLoginPayload, TRegisterPayload } from "./auth.validation";


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
            await tx.technicianProfile.create({
                data: {
                    userId: newUser.id,
                },
            });
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