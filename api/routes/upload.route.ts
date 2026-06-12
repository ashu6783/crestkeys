import express from "express";
import { getUploadConfig, signUploadParams } from "../controllers/upload.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.get("/sign", verifyToken, getUploadConfig);
router.post("/sign", verifyToken, signUploadParams);

export default router;
