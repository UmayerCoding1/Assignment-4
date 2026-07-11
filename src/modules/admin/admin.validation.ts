import { z } from "zod";

const updateUserStatusSchema = z.object({
  status: z.enum(["ACTIVE", "BLOCKED"]),
});

export const AdminValidations = {
  updateUserStatusSchema,
};
