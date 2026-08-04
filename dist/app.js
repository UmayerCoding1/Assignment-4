"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("./config"));
const auth_route_1 = __importDefault(require("./modules/auth/auth.route"));
const notFound_1 = require("./middlewares/notFound");
const globalErrorHandler_1 = require("./middlewares/globalErrorHandler");
const category_route_1 = __importDefault(require("./modules/category/category.route"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'https://fixit--now.vercel.app'],
    credentials: true
}));
console.log(config_1.default.app_url);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.get('/', (req, res) => {
    res.send('FixItNow Server Running');
});
const service_route_1 = require("./modules/service/service.route");
const technician_route_1 = require("./modules/technician/technician.route");
const booking_route_1 = require("./modules/booking/booking.route");
const payment_route_1 = require("./modules/payment/payment.route");
const review_route_1 = require("./modules/review/review.route");
const admin_route_1 = require("./modules/admin/admin.route");
const imagekit_route_1 = __importDefault(require("./modules/imagekit/imagekit.route"));
const dashboard_route_1 = __importDefault(require("./modules/dashboard/dashboard.route"));
app.use('/api/auth/', auth_route_1.default);
app.use('/api/categories/', category_route_1.default);
app.use('/api/services/', service_route_1.ServiceRoutes);
app.use('/api/', technician_route_1.TechnicianRoutes);
app.use('/api/', booking_route_1.BookingRoutes);
app.use('/api/payment', payment_route_1.PaymentRoutes);
app.use('/api/', review_route_1.ReviewRoutes);
app.use('/api/', admin_route_1.AdminRoutes);
app.use('/api/dashboard', dashboard_route_1.default);
// imagekit route
app.use('/api/imagekit', imagekit_route_1.default);
app.use(notFound_1.notFound);
app.use(globalErrorHandler_1.globalErrorHandler);
exports.default = app;
