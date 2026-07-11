import express from "express";
import { CategoryControllers } from "./category.controller";
import { CategoryValidations } from "./category.validation";
import validateRequest from "../../middlewares/validateRequest";
import { auth } from "../../middlewares/auth";
import validateQuery from "../../middlewares/validateQuery";
import { paginationQuerySchema } from "../../validations";

const categoryRouter = express.Router();

categoryRouter.get(
    "/",
    auth("ADMIN"),
    validateQuery(paginationQuerySchema),
    CategoryControllers.getAllCategoriesAdmin,
);

categoryRouter.post(
    "/",
    auth("ADMIN"),
    validateRequest(CategoryValidations.createCategoryValidationSchema),
    CategoryControllers.createCategory,
);

categoryRouter.patch(
    "/:id",
    auth("ADMIN"),
    validateRequest(CategoryValidations.updateCategoryValidationSchema),
    CategoryControllers.updateCategory,
);

categoryRouter.delete(
    "/:id",
    auth("ADMIN"),
    CategoryControllers.deleteCategory,
);

export default categoryRouter;