"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminValidations = void 0;
const zod_1 = require("zod");
const updateUserStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(["ACTIVE", "BLOCKED"]),
});
exports.AdminValidations = {
    updateUserStatusSchema,
};
