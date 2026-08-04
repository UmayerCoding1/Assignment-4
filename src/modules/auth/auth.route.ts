import { Response, Router, Request } from "express";

import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";
import { authControllers } from "./auth.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
const authRouter = Router();

authRouter.post("/register", validateRequest(AuthValidation.registerSchema), authControllers.registerUser);
authRouter.post("/login", validateRequest(AuthValidation.loginSchema), authControllers.loginUser);
authRouter.get("/me", auth(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN), authControllers.getMyProfile);
authRouter.post("/logout", auth(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN), authControllers.logoutUser);

authRouter.post('/refresh-token', authControllers.refreshToken);
authRouter.get("/technician/me", auth(Role.TECHNICIAN), authControllers.getTechnicianProfile)

authRouter.patch('/update-avatar', auth('ADMIN', 'CUSTOMER', 'TECHNICIAN'), authControllers.updateAvatar);
authRouter.patch('/users/:id/status', auth('ADMIN'), authControllers.updateUserStatus);


authRouter.get('/state', async (req: Request, res: Response) => {
    try {
        // const userIds = await prisma.user.findMany({ where: { address: { not: null } }, select: { id: true } });
        const notValidTechnician = await prisma.user.deleteMany({
            where: {
                address: null
            }
        })
        return res.status(200).json({ success: true, message: 'success', data: notValidTechnician })
    } catch (error) {
        console.log(error)
    }
})


export default authRouter;
