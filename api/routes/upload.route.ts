import express from "express";
import { signUpload } from "../controllers/upload.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.get("/sign", verifyToken, signUpload);

export default router;
