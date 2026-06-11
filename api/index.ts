import "dotenv/config";

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./db";
import authRoutes from "./routes/auth.route";
import postRoutes from "./routes/post.route";
import userRoutes from "./routes/user.route";
import verifyRoutes from "./routes/test.route";
import paymentroutes from "./routes/payment.route";
import uploadRoutes from "./routes/upload.route";
import { initRedis } from "./utils/redis";


const app = express();
const PORT = process.env.PORT || 5000;
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`;

app.set("trust proxy", 1);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://crestkeys.web.app",
  "https://crestkeys.firebaseapp.com",
  "http://localhost:5173",
  "https://ashureal-estate.vercel.app",
].filter((origin): origin is string => Boolean(origin));

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());
app.use(cookieParser());



app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/verify", verifyRoutes);
app.use("/api/payment", paymentroutes);
app.use("/api/upload", uploadRoutes);


app.get("/", (req, res) => {
  res.send("API is running");
});


connectDB().then(async () => {
  await initRedis();
  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server running on ${BACKEND_URL}`);
  });
});