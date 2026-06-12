import { Request, Response } from "express";
import {
  getCloudinaryUploadConfig,
  signCloudinaryParams,
} from "../utils/cloudinary";

export const getUploadConfig = async (req: Request, res: Response): Promise<void> => {
  try {
    const folder =
      typeof req.query.folder === "string" && req.query.folder.trim()
        ? req.query.folder.trim()
        : "posts";

    const config = getCloudinaryUploadConfig(folder);
    res.status(200).json(config);
  } catch (error) {
    console.error("Error loading Cloudinary upload config:", error);
    res.status(500).json({ message: "Failed to load upload config" });
  }
};

export const signUploadParams = async (req: Request, res: Response): Promise<void> => {
  try {
    const paramsToSign = req.body?.params_to_sign;

    if (!paramsToSign || typeof paramsToSign !== "object" || Array.isArray(paramsToSign)) {
      res.status(400).json({ message: "params_to_sign is required" });
      return;
    }

    const normalized: Record<string, string | number> = {};
    for (const [key, value] of Object.entries(paramsToSign)) {
      if (typeof value === "string" || typeof value === "number") {
        normalized[key] = value;
      }
    }

    if (Object.keys(normalized).length === 0) {
      res.status(400).json({ message: "params_to_sign must contain signable values" });
      return;
    }

    const signature = signCloudinaryParams(normalized);
    res.status(200).json({ signature });
  } catch (error) {
    console.error("Error signing Cloudinary upload:", error);
    res.status(500).json({ message: "Failed to sign upload request" });
  }
};
