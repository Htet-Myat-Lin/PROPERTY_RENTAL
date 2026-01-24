import type { Request, Response, NextFunction} from "express";
import type { AuthRequest } from "./types.js";

export const asyncHandler = (
    fn: (req: AuthRequest, res: Response, next: NextFunction) => Promise<any>
) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    }
}