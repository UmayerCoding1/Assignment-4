import { Router } from "express";

import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";
import { authControllers } from "./auth.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../generated/prisma/enums";
const authRouter = Router();

authRouter.post("/register", validateRequest(AuthValidation.registerSchema), authControllers.registerUser);
authRouter.post("/login", validateRequest(AuthValidation.loginSchema), authControllers.loginUser);
authRouter.get("/me", auth(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN), authControllers.getMyProfile);
authRouter.post("/logout", auth(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN), authControllers.logoutUser);

export default authRouter;
