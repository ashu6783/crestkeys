import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user";
import { signToken } from "../utils/jwt";

const logError = (label: string, req: Request, err: unknown) => {
  console.error(`\n[${new Date().toISOString()}] ${label}`);
  console.error(`Path: ${req.path}`);
  console.error("Method:", req.method);
  console.error("Body:", req.body);
  console.error("Error Message:", (err as Error).message);
  console.error("Stack Trace:", (err as Error).stack);
};


export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password, accountType } = req.body;

  try {
    if (!username || !email || !password || !accountType) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const allowedTypes = ["owner", "buyer", "agent", "admin"];
    if (!allowedTypes.includes(accountType)) {
      res.status(400).json({ message: "Invalid account type" });
      return;
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      res.status(400).json({ message: "Username or email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      accountType,
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully!" });
  } catch (err) {
    logError("Register Error", req, err); // custom logger
    res.status(500).json({ message: "Failed to create user!" });
  }
};


export const login = async (req: Request, res: Response): Promise<void> => {
  console.log(`[${new Date().toISOString()}] POST ${req.path} - Incoming body:`, req.body);

  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    const maxAge = 1000 * 60 * 60 * 24 * 7;
    const token = await signToken({ id: user._id.toString() });

    const { password: _, ...userInfo } = user.toObject();
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        maxAge: maxAge,
      })
      .status(200)
      .json(userInfo);
      
    console.log(`User ${username} logged in successfully, token set with maxAge: ${maxAge}ms`);
  } catch (err) {
    logError("Login Error", req, err);
    res.status(500).json({ message: "Failed to login" });
  }
};

export const logout = (req: Request, res: Response): void => {
  console.log(`[${new Date().toISOString()}] POST ${req.path} - Logout requested`);
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    })
    .status(200)
    .json({ message: "Logout successful" });
};


export const verifySession = async (req: Request & { userId?: string }, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: "User ID not found in token" });
      return;
    }
    const user = await User.findById(req.userId).select("-password");
    
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    
    res.status(200).json({ 
      message: "Valid session", 
      user
    });
  } catch (err) {
    console.error("Verify session error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};