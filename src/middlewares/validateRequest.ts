import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

const validateRequest = (schema: ZodType) => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });

            next();
        } catch (error) {
            next(error);
        }
    };
};

export default validateRequest;