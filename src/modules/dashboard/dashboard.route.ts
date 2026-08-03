import { Router } from 'express';
import { auth } from '../../middlewares/auth';
import DashboardControllers from './dashboard.controller';

const dashboardRoute = Router();

dashboardRoute.get('/admin', auth('ADMIN'), DashboardControllers.getAdminDashboardData)
dashboardRoute.get('/technician', auth('TECHNICIAN'), DashboardControllers.getTechnicianDashboardData);
dashboardRoute.get('/customer', auth('CUSTOMER'), DashboardControllers.getCustomerDashboardData);


export default dashboardRoute;