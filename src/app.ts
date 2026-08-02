import express, { Application, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import config from './config';
import authRouter from './modules/auth/auth.route';
import { notFound } from './middlewares/notFound';
import { globalErrorHandler } from './middlewares/globalErrorHandler';
import categoryRouter from './modules/category/category.route';

const app: Application = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'https://fixit--now.vercel.app'],
  credentials: true
}));

console.log(config.app_url)





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
import { WebhookRoutes } from './modules/Webhook/webhook.route';
import imagekitRouter from './modules/imagekit/imagekit.route';
import dashboardRoute from './modules/dashboard/dashboard.route';


app.use('/api/auth/', authRouter);
app.use('/api/categories/', categoryRouter);
app.use('/api/services/', ServiceRoutes);
app.use('/api/', TechnicianRoutes);
app.use('/api/', BookingRoutes);
app.use('/api/payment', PaymentRoutes);
app.use('/api/', ReviewRoutes);
app.use('/api/', AdminRoutes);
app.use('/api/dashboard', dashboardRoute)


// imagekit route
app.use('/api/imagekit', imagekitRouter)

app.use(notFound);
app.use(globalErrorHandler);

export default app;