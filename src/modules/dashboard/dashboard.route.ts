import { Router } from 'express';
import { auth } from '../../middlewares/auth';
import DashboardControllers from './dashboard.controller';

const dashboardRoute = Router();

dashboardRoute.get('/admin', auth('ADMIN'), DashboardControllers.getAdminDashboardData)


export default dashboardRoute;