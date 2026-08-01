import { Request, Response } from "express";
import stripe from "../../lib/stripe";
import config from "../../config";
import { PaymentServices } from "../payment/payment.service";


const handleStripeWebhook = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            config.stripe.webhookSecret
        );
    } catch (err: any) {
        console.log(`Webhook signature error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as any;
            const { bookingId } = session.metadata;
            await PaymentServices.handlePaymentSuccess(bookingId);
        }

        if (
            event.type === 'checkout.session.expired' ||
            event.type === 'checkout.session.async_payment_failed'
        ) {
            const session = event.data.object as any;
            const { bookingId } = session.metadata;
            await PaymentServices.handlePaymentFailure(bookingId);
        }
    } catch (err) {
        console.error('Webhook DB update failed:', err);
        // Taka already kata hoye geche - alert/log system e pathano dorkar
    }

    res.json({ received: true });
};

export const WebhookController = {
    handleStripeWebhook,
};