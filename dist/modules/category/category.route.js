"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("./category.controller");
const category_validation_1 = require("./category.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = require("../../middlewares/auth");
const validateQuery_1 = __importDefault(require("../../middlewares/validateQuery"));
const validations_1 = require("../../validations");
const categoryRouter = express_1.default.Router();
categoryRouter.get("/", (0, validateQuery_1.default)(validations_1.paginationQuerySchema), category_controller_1.CategoryControllers.getAllCategories);
categoryRouter.get('/:id', category_controller_1.CategoryControllers.getCategoryById);
categoryRouter.post("/", (0, auth_1.auth)("ADMIN"), (0, validateRequest_1.default)(category_validation_1.CategoryValidations.createCategoryValidationSchema), category_controller_1.CategoryControllers.createCategory);
categoryRouter.patch("/:id", (0, auth_1.auth)("ADMIN"), (0, validateRequest_1.default)(category_validation_1.CategoryValidations.updateCategoryValidationSchema), category_controller_1.CategoryControllers.updateCategory);
categoryRouter.delete("/:id", (0, auth_1.auth)("ADMIN"), category_controller_1.CategoryControllers.deleteCategory);
exports.default = categoryRouter;
