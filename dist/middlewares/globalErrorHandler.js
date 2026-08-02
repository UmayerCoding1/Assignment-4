"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const http_status_1 = __importDefault(require("http-status"));
const client_1 = require("../generated/prisma/client");
const globalErrorHandler = (err, req, res, next) => {
    console.log("Error : ", err);
    let statusCode;
    let errorMessage = err.message || "Internal Server Error";
    let errorName = err.name || "Internal Server Error";
    // let errorDetails = err.stack
    if (err instanceof client_1.Prisma.PrismaClientValidationError) {
        statusCode = http_status_1.default.BAD_REQUEST;
        errorMessage = "You have provided incorrect field type or missing fields";
    }
    else if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            statusCode = http_status_1.default.BAD_REQUEST,
                errorMessage = "Duplicate Key Error";
        }
        else if (err.code === "P2003") {
            statusCode = http_status_1.default.BAD_REQUEST,
                errorMessage = "Foreign key constraint failed";
        }
        else if (err.code === "P2025") {
            statusCode = http_status_1.default.BAD_REQUEST,
                errorMessage = "An operation failed because it depends on one or more records that were required but not found.";
        }
    }
    else if (err instanceof client_1.Prisma.PrismaClientInitializationError) {
        if (err.errorCode === "P1000") {
            statusCode = http_status_1.default.UNAUTHORIZED;
            errorMessage = "Authentication failed against database server. Please Check Your Credentials";
        }
        else if (err.errorCode === "P1001") {
            statusCode = http_status_1.default.BAD_REQUEST;
            errorMessage = "Can't reach database server";
        }
    }
    else if (err instanceof client_1.Prisma.PrismaClientUnknownRequestError) {
        statusCode = http_status_1.default.INTERNAL_SERVER_ERROR;
        errorMessage = "Error occurred during query execution";
    }
    res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: statusCode || http_status_1.default.INTERNAL_SERVER_ERROR,
        name: errorName,
        message: errorMessage,
        error: err.stack
    });
};
exports.globalErrorHandler = globalErrorHandler;
