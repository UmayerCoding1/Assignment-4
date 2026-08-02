"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const config_1 = __importDefault(require("../config"));
const prisma_1 = require("../lib/prisma");
const jwt_1 = require("../utils/jwt");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)(async (req, res, next) => {
        const token = req.cookies.accessToken ?
            req.cookies.accessToken
            :
                req.headers.authorization?.startsWith("Bearer ") ?
                    req.headers.authorization?.split(" ")[1]
                    : req.headers.authorization;
        if (!token) {
            throw new Error("You are not logged in. Please log in to access this resource.");
        }
        const verifiedToken = jwt_1.jwtUtils.verifyToken(token, config_1.default.access_token_secret);
        if (!verifiedToken.success) {
            throw new Error(verifiedToken.error);
        }
        const { email, name, id, role } = verifiedToken.data;
        if (requiredRoles.length && !requiredRoles.includes(role)) {
            throw new Error("Forbidden. You don't have permission to access this resource.");
        }
        const user = await prisma_1.prisma.user.findUnique({
            where: {
                id,
                email,
                name,
                role
            }
        });
        // console.log('user', user)
        if (!user) {
            throw new Error("User not found. Please log in again.");
        }
        if (user.status === "BLOCKED") {
            throw new Error("Your account has been blocked. Please contact support.");
        }
        // console.log('user', user)
        req.user = {
            email,
            name,
            id,
            role
        };
        next();
    });
};
exports.auth = auth;
