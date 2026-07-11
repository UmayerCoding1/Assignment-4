import { NextFunction, Request, Response } from 'express';

import catchAsync from '../utils/catchAsync';

const validateParams = (schema: any) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await schema.parseAsync(req.params);
    next();
  });
};

export default validateParams;
