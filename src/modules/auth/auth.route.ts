import { Router } from "express";

import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";
import { authControllers } from "./auth.controller";
const authRouter = Router();

authRouter.post("/register", validateRequest(AuthValidation.registerSchema), authControllers.registerUser);

export default authRouter;
