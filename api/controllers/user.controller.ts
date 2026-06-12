import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user";
import Post from "../models/post";
import SavedPost from "../models/savedPost";
import PostDetail from "../models/postDetail";
import Payment from "../models/payment";

interface CustomRequest extends Request {
  userId?: string;
}

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get users!" });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get user!" });
  }
};


export const updateUser = async (req: CustomRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const tokenUserId = req.userId;
  const { password, avatar, ...inputs } = req.body;

  if (id !== tokenUserId) {
    res.status(403).json({ message: "Not Authorized!" });
    return;
  }

  try {
    const updatedFields: any = { ...inputs };
    if (password) updatedFields.password = await bcrypt.hash(password, 10);
    if (avatar) updatedFields.avatar = avatar;

    const updatedUser = await User.findByIdAndUpdate(id, updatedFields, {
      new: true,
    }).select("-password");

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user!" });
  }
};



export const deleteUser = async (req: CustomRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const tokenUserId = req.userId;

  if (id !== tokenUserId) {
    res.status(403).json({ message: "Not Authorized!" });
    return;
  }

  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete user!" });
  }
};

export const savePost = async (req: CustomRequest, res: Response): Promise<void> => {
  const { postId } = req.body;
  const tokenUserId = req.userId;

  try {
    const existing = await SavedPost.findOne({ userId: tokenUserId, postId });

    if (existing) {
      await existing.deleteOne();
      res.status(200).json({ message: "Post removed from saved list" });
    } else {
      await SavedPost.create({ userId: tokenUserId, postId });
      res.status(200).json({ message: "Post saved" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save/unsave post!" });
  }
};

export const profilePosts = async (req: CustomRequest, res: Response): Promise<void> => {
  const tokenUserId = req.userId;

  try {
    // Find all posts by the current user
    const posts = await Post.find({ userId: tokenUserId }).populate("userId");
    
    // Manually fetch and attach PostDetail for each post
    const userPosts = await Promise.all(
      posts.map(async (post) => {
        const postDetail = await PostDetail.findOne({ postId: post._id });
        return {
          ...post.toObject(),
          postDetail: postDetail || null,
        };
      })
    );

    // Find all posts saved by the current user
    const savedDocs = await SavedPost.find({ userId: tokenUserId })
      .populate({
        path: "postId",
        populate: { path: "userId" }
      });
    
    // Process saved posts to include their post details
    const savedPosts = await Promise.all(
      savedDocs.map(async (doc) => {
        if (!doc.postId || typeof doc.postId !== 'object') return null;
        
        const postDetail = await PostDetail.findOne({ postId: doc.postId._id });
        return {
          ...(doc.postId as any).toObject(),
          postDetail: postDetail || null,
        };
      })
    ).then(posts => posts.filter(Boolean)); // Filter out any null values

    const successfulPayments = await Payment.find({
      userId: tokenUserId,
      status: "succeeded",
    }).populate({
      path: "postId",
      populate: { path: "userId" },
    });

    const boughtPosts = await Promise.all(
      successfulPayments.map(async (payment) => {
        if (!payment.postId || typeof payment.postId !== "object") return null;

        const populatedPost = payment.postId as unknown as {
          _id: unknown;
          toObject: () => Record<string, unknown>;
        };
        const postDetail = await PostDetail.findOne({ postId: populatedPost._id });
        return {
          ...populatedPost.toObject(),
          postDetail: postDetail || null,
        };
      })
    ).then((posts) => posts.filter(Boolean));

    res.status(200).json({ userPosts, savedPosts, boughtPosts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
};