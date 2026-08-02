"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentControllers = void 0;
const payment_service_1 = require("./payment.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const config_1 = __importDefault(require("../../config"));
const sendResponse_1 = require("../../utils/sendResponse");
const stripe_1 = __importDefault(require("../../lib/stripe"));
const createCheckoutSession = (0, catchAsync_1.default)(async (req, res) => {
    const result = await payment_service_1.PaymentServices.createCheckoutSession(req);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Stripe Checkout session created successfully!",
        data: result,
    });
});
const getUserPaymentHistory = (0, catchAsync_1.default)(async (req, res) => {
    const result = await payment_service_1.PaymentServices.getUserPaymentHistory(req.user.id, req.user.role);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Payment history retrieved successfully!",
        data: result,
    });
});
const getPaymentById = (0, catchAsync_1.default)(async (req, res) => {
    const result = await payment_service_1.PaymentServices.getPaymentById(req.params.id, req.user.id, req.user.role);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Payment details retrieved successfully!",
        data: result,
    });
});
const stripeWebhook = async (req, res) => {
    const signature = req.headers["stripe-signature"];
    if (!signature || Array.isArray(signature)) {
        return res.status(400).send("Missing signature");
    }
    try {
        const event = stripe_1.default.webhooks.constructEvent(req.body, signature, config_1.default.stripe.webhookSecret);
        await payment_service_1.PaymentServices.handleStripeEvent(event);
        return res.status(200).json({
            received: true,
        });
    }
    catch (err) {
        return res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : String(err)}`);
    }
};
const createPaymentSuccess = (0, catchAsync_1.default)(async (req, res) => {
    console.log('req.body', req.body);
    const result = await payment_service_1.PaymentServices.handlePaymentSuccess(req.body.bookingId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Payment success created successfully!",
        data: result,
    });
});
exports.PaymentControllers = {
    createCheckoutSession,
    getUserPaymentHistory,
    getPaymentById,
    stripeWebhook,
    createPaymentSuccess,
};
