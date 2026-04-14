import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

export function validate<T extends z.ZodObject>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: z.flattenError(parsed.error),
      });
    }

    req.body = parsed.data;
    next();
  };
}
