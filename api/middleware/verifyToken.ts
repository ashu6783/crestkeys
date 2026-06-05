import { Request, Response, NextFunction } from "express";
import { verifyTokenValue } from "../utils/jwt";

export interface CustomRequest extends Request {
  userId?: string;
}

export const verifyToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: "Not Authenticated" });
    return;
  }

  try {
    const payload = await verifyTokenValue(token);
    req.userId = payload.id;
    next();
  } catch {
    res.status(403).json({ message: "Token is not valid" });
  }
};
