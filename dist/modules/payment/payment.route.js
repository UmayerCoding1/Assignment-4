"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const validateParams_1 = __importDefault(require("../../middlewares/validateParams"));
const validations_1 = require("../../validations");
const auth_1 = require("../../middlewares/auth");
const router = express_1.default.Router();
router.post("/checkout", (0, auth_1.auth)("CUSTOMER"), 
// validateRequest(PaymentValidations.createCheckoutSessionValidationSchema),
payment_controller_1.PaymentControllers.createCheckoutSession);
router.get("/", (0, auth_1.auth)("CUSTOMER", 'TECHNICIAN'), 
// validateQuery(paginationQuerySchema),
payment_controller_1.PaymentControllers.getUserPaymentHistory);
router.get("/:id", (0, auth_1.auth)("CUSTOMER", "ADMIN"), (0, validateParams_1.default)(validations_1.idParamValidationSchema), payment_controller_1.PaymentControllers.getPaymentById);
router.patch('/success', (0, auth_1.auth)('CUSTOMER'), payment_controller_1.PaymentControllers.createPaymentSuccess);
exports.PaymentRoutes = router;
