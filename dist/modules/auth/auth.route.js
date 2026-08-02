"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_validation_1 = require("./auth.validation");
const auth_controller_1 = require("./auth.controller");
const auth_1 = require("../../middlewares/auth");
const enums_1 = require("../../generated/prisma/enums");
const prisma_1 = require("../../lib/prisma");
const authRouter = (0, express_1.Router)();
authRouter.post("/register", (0, validateRequest_1.default)(auth_validation_1.AuthValidation.registerSchema), auth_controller_1.authControllers.registerUser);
authRouter.post("/login", (0, validateRequest_1.default)(auth_validation_1.AuthValidation.loginSchema), auth_controller_1.authControllers.loginUser);
authRouter.get("/me", (0, auth_1.auth)(enums_1.Role.ADMIN, enums_1.Role.CUSTOMER, enums_1.Role.TECHNICIAN), auth_controller_1.authControllers.getMyProfile);
authRouter.post("/logout", (0, auth_1.auth)(enums_1.Role.ADMIN, enums_1.Role.CUSTOMER, enums_1.Role.TECHNICIAN), auth_controller_1.authControllers.logoutUser);
authRouter.post('/refresh-token', auth_controller_1.authControllers.refreshToken);
authRouter.get("/technician/me", (0, auth_1.auth)(enums_1.Role.TECHNICIAN), auth_controller_1.authControllers.getTechnicianProfile);
authRouter.patch('/update-avatar', (0, auth_1.auth)('ADMIN', 'CUSTOMER', 'TECHNICIAN'), auth_controller_1.authControllers.updateAvatar);
authRouter.get('/state', async (req, res) => {
    try {
        // const userIds = await prisma.user.findMany({ where: { address: { not: null } }, select: { id: true } });
        const notValidTechnician = await prisma_1.prisma.user.deleteMany({
            where: {
                address: null
            }
        });
        return res.status(200).json({ success: true, message: 'success', data: notValidTechnician });
    }
    catch (error) {
        console.log(error);
    }
});
exports.default = authRouter;
