import express from "express";
import { AdminControllers } from "./admin.controller";
import { AdminValidations } from "./admin.validation";
import { CategoryValidations } from "../category/category.validation";
import validateRequest from "../../middlewares/validateRequest";
import { auth } from "../../middlewares/auth";

const router = express.Router();

router.get("/admin/users", auth("ADMIN"), AdminControllers.getAllUsers);

router.patch(
  "/admin/users/:id",
  auth("ADMIN"),
  validateRequest(AdminValidations.updateUserStatusSchema),
  AdminControllers.updateUserStatus
);

router.get("/admin/bookings", auth("ADMIN"), AdminControllers.getAllBookings);

router.get("/admin/categories", auth("ADMIN"), AdminControllers.getAllCategories);

router.post(
  "/admin/categories",
  auth("ADMIN"),
  validateRequest(CategoryValidations.createCategoryValidationSchema),
  AdminControllers.createCategory
);

export const AdminRoutes = router;
