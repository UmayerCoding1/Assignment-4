"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAvatarService = exports.getTechnicianProfileService = exports.refreshTokenService = exports.getMyProfileService = exports.loginUserService = exports.registerUserService = void 0;
const config_1 = __importDefault(require("../../config"));
const client_1 = require("../../generated/prisma/client");
const prisma_1 = require("../../lib/prisma");
const AppError_1 = __importDefault(require("../../utils/AppError"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../../utils/jwt");
const hashToken_1 = require("../../utils/hashToken");
const registerUserService = async (payload) => {
    const isUserExist = await prisma_1.prisma.user.findUnique({
        where: { email: payload.email }
    });
    if (isUserExist) {
        throw new AppError_1.default(409, "User already exists");
    }
    const hashedPassword = await bcryptjs_1.default.hash(payload.password, config_1.default.hash_salt);
    const user = await prisma_1.prisma.$transaction(async (tx) => {
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
        if (newUser.role === client_1.Role.TECHNICIAN) {
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
            });
        }
        return newUser;
    });
    return user;
};
exports.registerUserService = registerUserService;
const loginUserService = async (payload) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (!user) {
        throw new AppError_1.default(401, "Invalid email or password");
    }
    const { password, ...userWithoutPassword } = user;
    const isPasswordMatched = await bcryptjs_1.default.compare(payload.password, user.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(401, "Invalid email or password");
    }
    const accessToken = jwt_1.jwtUtils.createToken({
        id: user.id,
        email: user.email,
        role: user.role,
    }, config_1.default.access_token_secret, config_1.default.access_token_expires_in);
    const refreshToken = jwt_1.jwtUtils.createToken({
        id: user.id,
        email: user.email,
        role: user.role,
    }, config_1.default.refresh_token_secret, config_1.default.refresh_token_expires_in);
    const hashRefreshToken = (0, hashToken_1.hashToken)(refreshToken);
    await prisma_1.prisma.user.update({
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
    };
};
exports.loginUserService = loginUserService;
const getMyProfileService = async (userId) => {
    const result = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        omit: { password: true },
    });
    if (!result) {
        throw new AppError_1.default(404, "User not found!");
    }
    return result;
};
exports.getMyProfileService = getMyProfileService;
const refreshTokenService = async (req) => {
    const refreshTokenFromCookie = req.cookies.refreshToken;
    if (!refreshTokenFromCookie) {
        throw new AppError_1.default(401, "Refresh token not found");
    }
    let userId;
    let userRole;
    let savedRefreshToken;
    try {
        const decodedToken = jwt_1.jwtUtils.verifyToken(refreshTokenFromCookie, config_1.default.refresh_token_secret);
        if (!decodedToken.success) {
            throw new AppError_1.default(401, decodedToken.error || "Invalid refresh token");
        }
        const { id, role } = decodedToken.data;
        userId = id;
        userRole = role;
        const user = await prisma_1.prisma.user.findFirst({
            where: {
                id: userId,
            },
        });
        console.log('pass');
        console.log('user', user);
        console.log('DB token', user?.refreshToken);
        if (!user || !user.refreshToken) {
            throw new AppError_1.default(404, "User not found or refresh token missing");
        }
        savedRefreshToken = user.refreshToken;
        console.log('check', user?.refreshToken);
    }
    catch (error) {
        throw new AppError_1.default(401, "Invalid refresh token");
    }
    const hashRefrashToken = (0, hashToken_1.hashToken)(refreshTokenFromCookie);
    const isRefreshTokenValid = savedRefreshToken === hashRefrashToken;
    if (!isRefreshTokenValid) {
        await prisma_1.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                refreshToken: null
            }
        });
        throw new AppError_1.default(401, "Invalid refresh token");
    }
    const user = await prisma_1.prisma.user.findFirst({
        where: {
            id: userId
        }
    });
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    const newAccessToken = jwt_1.jwtUtils.createToken({
        id: userId,
        email: user.email,
        role: user.role
    }, config_1.default.access_token_secret, config_1.default.access_token_expires_in);
    const newRefreshToken = jwt_1.jwtUtils.createToken({
        id: userId,
        email: user.email,
        role: user.role
    }, config_1.default.refresh_token_secret, config_1.default.refresh_token_expires_in);
    const hashNewRefreshToken = (0, hashToken_1.hashToken)(newRefreshToken);
    await prisma_1.prisma.user.update({
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
    };
};
exports.refreshTokenService = refreshTokenService;
const getTechnicianProfileService = async (userId) => {
    const userdata = await prisma_1.prisma.user.findFirst({
        where: {
            id: userId
        }
    });
    if (!userdata) {
        throw new AppError_1.default(404, "User not found");
    }
    const technicianProfile = await prisma_1.prisma.technicianProfile.findUnique({
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
    });
    if (!technicianProfile) {
        throw new AppError_1.default(404, "Technician profile not found");
    }
    console.log(technicianProfile);
    return technicianProfile;
};
exports.getTechnicianProfileService = getTechnicianProfileService;
const updateAvatarService = async (payload, userId) => {
    const result = await prisma_1.prisma.user.update({
        where: {
            id: userId
        },
        data: {
            image: payload.imageUrl
        }
    });
    if (!result) {
        throw new AppError_1.default(404, "Failed to upload avatar");
    }
    return result;
};
exports.updateAvatarService = updateAvatarService;
