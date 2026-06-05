import { Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  createdAt: Date;
  accountType:String;
}

export interface IPost {
  _id: Types.ObjectId;
  title: string;
  price: number;
  images: string[];
  address: string;
  city: string;
  bedroom: number;
  bathroom: number;
  latitude: string;
  longitude: string;
  type: "buy" | "rent";
  property: "apartment" | "house" | "condo" | "land";
  createdAt: Date;
  userId: Types.ObjectId; // Changed from user to userId
  postDetail: Types.ObjectId; // Changed to required
}

export interface IPostDetail {
  _id: Types.ObjectId;
  desc: string;
  utilities?: string;
  pet?: string;
  income?: string;
  size?: number;
  school?: number;
  bus?: number;
  restaurant?: number; // Corrected spelling
  postId: Types.ObjectId;
}

export interface ISavedPost {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  createdAt: Date;
}

export interface IPayment {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  idempotencyKey: string;
  stripePaymentIntentId: string;
  amount: number;
  currency: string;
  status: "pending" | "succeeded" | "failed";
  clientSecret?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JwtPayload {
  id: string;
  isAdmin?: boolean;
}