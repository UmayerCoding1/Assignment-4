"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookRoutes = void 0;
const express_1 = __importDefault(require("express"));
const webhook_controller_1 = require("./webhook.controller");
const router = express_1.default.Router();
// raw body porjonto - json parser lagena
router.post('/', express_1.default.raw({ type: 'application/json' }), webhook_controller_1.WebhookController.handleStripeWebhook);
exports.WebhookRoutes = router;
