import { Request, Response } from "express";
import { signCloudinaryUpload } from "../utils/cloudinary";

export const signUpload = async (req: Request, res: Response): Promise<void> => {
  try {
    const folder =
      typeof req.query.folder === "string" && req.query.folder.trim()
        ? req.query.folder.trim()
        : "posts";

    const signedParams = signCloudinaryUpload({ folder });
    res.status(200).json(signedParams);
  } catch (error) {
    console.error("Error signing Cloudinary upload:", error);
    res.status(500).json({ message: "Failed to sign upload request" });
  }
};
