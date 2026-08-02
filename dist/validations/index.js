"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationQuerySchema = exports.idParamValidationSchema = void 0;
const zod_1 = require("zod");
const idParamValidationSchema = zod_1.z.object({
    id: zod_1.z.string().uuid({ message: "Invalid UUID format for id parameter" }),
});
exports.idParamValidationSchema = idParamValidationSchema;
const paginationQuerySchema = zod_1.z
    .object({
    page: zod_1.z.string().regex(/^\d+$/, "Page must be a number").optional(),
    limit: zod_1.z.string().regex(/^\d+$/, "Limit must be a number").optional(),
    sortBy: zod_1.z.string().optional(),
    sortOrder: zod_1.z.enum(["asc", "desc"]).optional(),
    searchTerm: zod_1.z.string().optional(),
})
    .strict();
exports.paginationQuerySchema = paginationQuerySchema;
