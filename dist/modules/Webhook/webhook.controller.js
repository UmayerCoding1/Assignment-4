"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookController = void 0;
const stripe_1 = __importDefault(require("../../lib/stripe"));
const config_1 = __importDefault(require("../../config"));
const payment_service_1 = require("../payment/payment.service");
const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe_1.default.webhooks.constructEvent(req.body, sig, config_1.default.stripe.webhookSecret);
    }
    catch (err) {
        console.log(`Webhook signature error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    try {
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const { bookingId } = session.metadata;
            await payment_service_1.PaymentServices.handlePaymentSuccess(bookingId);
        }
        if (event.type === 'checkout.session.expired' ||
            event.type === 'checkout.session.async_payment_failed') {
            const session = event.data.object;
            const { bookingId } = session.metadata;
            await payment_service_1.PaymentServices.handlePaymentFailure(bookingId);
        }
    }
    catch (err) {
        console.error('Webhook DB update failed:', err);
        // Taka already kata hoye geche - alert/log system e pathano dorkar
    }
    res.json({ received: true });
};
exports.WebhookController = {
    handleStripeWebhook,
};
