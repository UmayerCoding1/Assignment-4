import express from 'express';
import { WebhookController } from './webhook.controller';

const router = express.Router();

// raw body porjonto - json parser lagena
router.post(
    '/',
    express.raw({ type: 'application/json' }),
    WebhookController.handleStripeWebhook
);

export const WebhookRoutes = router;