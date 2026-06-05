import { Request, Response } from "express";
import { verifyTokenValue } from "../utils/jwt";

interface CustomRequest extends Request {
  userId?: string;
  isAdmin?: boolean;
}

export const shouldBeLoggedIn = async (req: CustomRequest, res: Response): Promise<void> => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ message: "Not Authenticated" });
    return;
  }

  try {
    const payload = await verifyTokenValue(token);
    req.userId = payload.id;
    res.status(200).json({ message: "You are authenticated", userId: req.userId });
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: "Token is not valid" });
  }
};

export const shouldBeAdmin = async (req: CustomRequest, res: Response): Promise<void> => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ message: "Not Authenticated" });
    return;
  }

  try {
    const payload = await verifyTokenValue(token);

    if (!payload.isAdmin) {
      res.status(403).json({ message: "Not authorized!" });
      return;
    }

    req.userId = payload.id;
    req.isAdmin = true;

    res.status(200).json({ message: "You are authenticated as Admin", userId: payload.id });
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: "Token is not valid" });
  }
};
