"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("./admin.controller");
const admin_validation_1 = require("./admin.validation");
const category_validation_1 = require("../category/category.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = require("../../middlewares/auth");
const router = express_1.default.Router();
router.get("/admin/users", (0, auth_1.auth)("ADMIN"), admin_controller_1.AdminControllers.getAllUsers);
router.patch("/admin/users/:id", (0, auth_1.auth)("ADMIN"), (0, validateRequest_1.default)(admin_validation_1.AdminValidations.updateUserStatusSchema), admin_controller_1.AdminControllers.updateUserStatus);
router.get("/admin/bookings", (0, auth_1.auth)("ADMIN"), admin_controller_1.AdminControllers.getAllBookings);
router.get("/admin/categories", (0, auth_1.auth)("ADMIN"), admin_controller_1.AdminControllers.getAllCategories);
router.post("/admin/categories", (0, auth_1.auth)("ADMIN"), (0, validateRequest_1.default)(category_validation_1.CategoryValidations.createCategoryValidationSchema), admin_controller_1.AdminControllers.createCategory);
exports.AdminRoutes = router;
