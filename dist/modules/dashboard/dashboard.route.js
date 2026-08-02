"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const dashboard_controller_1 = __importDefault(require("./dashboard.controller"));
const dashboardRoute = (0, express_1.Router)();
dashboardRoute.get('/admin', (0, auth_1.auth)('ADMIN'), dashboard_controller_1.default.getAdminDashboardData);
exports.default = dashboardRoute;
