import { Request, Response, NextFunction } from "express";
import Post from "../models/post";
import SavedPost from "../models/savedPost";
import PostDetail from "../models/postDetail";
import User from "../models/user";
import {
  cacheGet,
  cacheSet,
  invalidatePostCaches,
  postsListCacheKey,
  postDetailCacheKey,
  LIST_TTL_SECONDS,
  DETAIL_TTL_SECONDS,
} from "../utils/cache";

interface AuthenticatedRequest extends Request {
  userId?: string;
}




export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { city, type, property, bedroom, bathroom, minPrice, maxPrice } = req.query;
    console.log("getPosts query params:", req.query);

    const filters: any = {};
    if (city) filters.city = { $regex: String(city), $options: "i" };
    if (type) filters.type = { $regex: String(type), $options: "i" };
    if (property) filters.property = { $regex: String(property), $options: "i" };
    if (bedroom) filters.bedroom = { $gte: Number(bedroom) };
    if (bathroom) filters.bathroom = { $gte: Number(bathroom) };
    if (minPrice || maxPrice) {
      filters.price = {
        $gte: minPrice ? Number(minPrice) : 0,
        $lte: maxPrice ? Number(maxPrice) : 100000000,
      };
    }

    const cacheKey = postsListCacheKey(req.query as Record<string, unknown>);
    const cachedPosts = await cacheGet<unknown[]>(cacheKey);
    if (Array.isArray(cachedPosts)) {
      res.status(200).json(cachedPosts);
      return;
    }

    const posts = await Post.find(filters).lean().exec();
    await cacheSet(cacheKey, posts, LIST_TTL_SECONDS);

    res.status(200).json(posts);
  } catch (error: any) {
    console.error("Error in getPosts:", error.message, error.stack);
    res.status(500).json({ message: "Failed to get posts", error: error.message });
  }
};


export const getPost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const postId = req.params.id;
    console.log("Fetching post with ID:", postId);

    if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({ message: "Invalid post ID format" });
      return;
    }

    const cacheKey = postDetailCacheKey(postId);
    const cachedPost = await cacheGet<Record<string, unknown>>(cacheKey);
    if (cachedPost && typeof cachedPost === "object") {
      res.status(200).json(cachedPost);
      return;
    }

    const post = await Post.findById(postId).populate("userId").lean();
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

 
    const postDetail = await PostDetail.findOne({ postId: post._id });

    const postWithDetails = {
      ...post,
      postDetail: postDetail ? postDetail.toObject() : null,
    };
    await cacheSet(cacheKey, postWithDetails, DETAIL_TTL_SECONDS);
    res.status(200).json(postWithDetails);
  } catch (error: any) {
    console.error("Error in getPost:", error.message, error.stack);
    res.status(500).json({ message: "Server error while fetching post", error: error.message });
  }
};


export const addPost = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId;
    console.log("User ID from token:", userId);

    if (!userId) {
      res.status(401).json({ message: "Unauthorized: User ID not found" });
      return;
    }
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({ message: "Invalid user ID format" });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if(user.accountType!=="owner")
    {
       res.status(403).json({message:"Forbidden to create post!"});
       return;
    }

    const { postData, postDetail } = req.body;
    if (
      !postData ||
      !postData.title ||
      !postData.price ||
      !postData.address ||
      !postData.city ||
      !postData.bedroom ||
      !postData.bathroom ||
      !postData.latitude ||
      !postData.longitude ||
      !postData.images ||
      postData.images.length === 0
    ) {
      res.status(400).json({ message: "Missing required fields in postData" });
      return;
    }

    if (!postDetail || !postDetail.desc) {
      res.status(400).json({ message: "Description is required in postDetail" });
      return;
    }

    postData.latitude = Number(postData.latitude);
    postData.longitude = Number(postData.longitude);

    const newPost = new Post({
      ...postData,
      userId,
    });

    const savedPost = await newPost.save();

    const newPostDetail = new PostDetail({
      ...postDetail,
      postId: savedPost._id,
    });


    const savedPostDetail = await newPostDetail.save();

    await invalidatePostCaches();

    res.status(201).json(savedPost);
  } catch (error: any) {
    console.error("Error in addPost:", error.message, error.stack);
    res.status(500).json({ message: "Server error while creating post", error: error.message });
  }
};


export const updatePost = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const postId = req.params.id;
    const tokenUserId = req.userId;


    if (!tokenUserId) {
      res.status(401).json({ message: "Unauthorized: User ID not found" });
      return;
    }


    if (!postId.match(/^[0-9a-fA-F]{24}$/) || !tokenUserId.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({ message: "Invalid post ID or user ID format" });
      return;
    }

    const post = await Post.findById(postId).exec();
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    if (post.userId.toString() !== tokenUserId) {
      res.status(403).json({ message: "Not authorized to update this post" });
      return;
    }

    const { postData, postDetail } = req.body;
  
    if (postData) {
      if (postData.latitude) postData.latitude = String(postData.latitude);
      if (postData.longitude) postData.longitude = String(postData.longitude);
      Object.assign(post, postData);
      await post.save();
    }

    if (postDetail) {
      const existingPostDetail = await PostDetail.findOne({ postId: post._id });
      if (existingPostDetail) {
        Object.assign(existingPostDetail, postDetail);
        await existingPostDetail.save();
  
      } else {
        const newPostDetail = new PostDetail({
          ...postDetail,
          postId: post._id,
        });
        await newPostDetail.save();
      
      }
    }

    const updatedPost = await Post.findById(postId).populate("userId");
    const updatedPostDetail = await PostDetail.findOne({ postId: postId });
    const postWithDetails = {
      ...updatedPost!.toObject(),
      postDetail: updatedPostDetail || null,
    };

    await invalidatePostCaches(postId);

    res.status(200).json(postWithDetails);
  } catch (error: any) {

    res.status(500).json({ message: "Failed to update post", error: error.message });
  }
};

export const deletePost = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const postId = req.params.id;
    const tokenUserId = req.userId;
    if (!tokenUserId) {
      res.status(401).json({ message: "Unauthorized: User ID not found" });
      return;
    }

    if (!postId.match(/^[0-9a-fA-F]{24}$/) || !tokenUserId.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({ message: "Invalid post ID or user ID format" });
      return;
    }

    const post = await Post.findById(postId).exec();
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    if (post.userId.toString() !== tokenUserId) {
      res.status(403).json({ message: "Not authorized to delete this post" });
      return;
    }

 
    await PostDetail.deleteOne({ postId: post._id });
    await SavedPost.deleteMany({ postId: post._id });
    await Post.deleteOne({ _id: postId });
    await invalidatePostCaches(postId);
    res.status(200).json({ message: "Post and associated data deleted successfully" });
  } catch (error: any) {
    console.error("Error in deletePost:", error.message, error.stack);
    res.status(500).json({ message: "Failed to delete post", error: error.message });
  }
};