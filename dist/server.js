"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
let server;
async function bootstrap() {
    try {
        server = app_1.default.listen(config_1.default.port, () => {
            console.log(`🚀 Server is running on port ${config_1.default.port}`);
            console.log(`🔗 Health check available at http://localhost:${config_1.default.port}/health`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
bootstrap();
// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`😈 Unhandled rejection detected, shutting down server...`, err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log(`😈 Uncaught exception detected, shutting down...`, err);
    process.exit(1);
});
