import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";
import AppError from "../utils/AppError";

const validateQuery = (schema: ZodType) => {
    return async (
        req: Request,
        _res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            await schema.parseAsync(req.query);

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return next(
                    new AppError(
                        400,
                        error.issues.map((issue) => issue.message).join(", ")
                    )
                );
            }

            next(error);
        }
    };
};

export default validateQuery;