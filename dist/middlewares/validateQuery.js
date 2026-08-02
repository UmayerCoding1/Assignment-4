"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const AppError_1 = __importDefault(require("../utils/AppError"));
const validateQuery = (schema) => {
    return async (req, _res, next) => {
        try {
            await schema.parseAsync(req.query);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return next(new AppError_1.default(400, error.issues.map((issue) => issue.message).join(", ")));
            }
            next(error);
        }
    };
};
exports.default = validateQuery;
