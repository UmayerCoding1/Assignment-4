import express, { Application, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import config from './config';
import authRouter from './modules/auth/auth.route';
import { notFound } from './middlewares/notFound';
import { globalErrorHandler } from './middlewares/globalErrorHandler';
import categoryRouter from './modules/category/category.route';
import { PaymentControllers } from './modules/payment/payment.controller';
const app: Application = express();

app.use(cors({
  origin: config.app_url,
  credentials: true
}));

app.use(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  PaymentControllers.stripeWebhook,
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.send('FixItNow Server Running')
});

import { ServiceRoutes } from './modules/service/service.route';
import { TechnicianRoutes } from './modules/technician/technician.route';
import { BookingRoutes } from './modules/booking/booking.route';
import { PaymentRoutes } from './modules/payment/payment.route';
import { ReviewRoutes } from './modules/review/review.route';
import { AdminRoutes } from './modules/admin/admin.route';


app.use('/api/auth/', authRouter);
app.use('/api/categories/', categoryRouter);
app.use('/api/services/', ServiceRoutes);
app.use('/api/', TechnicianRoutes);
app.use('/api/', BookingRoutes);
app.use('/api/', PaymentRoutes);
app.use('/api/', ReviewRoutes);
app.use('/api/', AdminRoutes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;