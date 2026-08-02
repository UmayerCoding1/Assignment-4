"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const review_controller_1 = require("./review.controller");
const review_validation_1 = require("./review.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = require("../../middlewares/auth");
const router = express_1.default.Router();
router.post("/reviews", (0, auth_1.auth)("CUSTOMER"), (0, validateRequest_1.default)(review_validation_1.ReviewValidations.createReviewSchema), review_controller_1.ReviewControllers.createReview);
exports.ReviewRoutes = router;
