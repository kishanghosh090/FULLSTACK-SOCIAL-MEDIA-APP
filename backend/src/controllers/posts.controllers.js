import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Post } from "../models/posts.models.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

//create post-----------
const createPost = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title && !description && !req.file?.path) {
      throw new ApiError(400, "All fields are required");
    }
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    // upload image------
    const imageLocalPath = req.file?.path;
    console.log(req.file);

    if (!imageLocalPath) {
      throw new ApiError(400, "Image is required");
    }
    const image = await uploadOnCloudinary(imageLocalPath);
    if (!image) {
      throw new ApiError(500, "Failed to upload image");
    }

    // create post-------
    const newPost = await Post.create({
      title,
      description,
      image: image?.url,
      user: user._id,
    });
    await User.findByIdAndUpdate(user._id, {
      $push: { posts: newPost._id },
    });
    // send response-------
    return res
      .status(200)
      .json(new ApiResponse(200, newPost, "Post created successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Faild to Create Post");
  }
};

// get all posts-------
const getAllPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }
    //find who want to get post
    const user = await User.findById(userId);
    // find all posts
    const posts = await Post.find().sort({ createdAt: -1 }).populate("user");
    if (!posts) {
      throw new ApiError(404, "No posts found");
    }

    // send response-----
    return res
      .status(200)
      .json(
        new ApiResponse(200, { posts, user }, "All posts fetched successfully")
      );
  } catch (error) {
    throw new ApiError(500, error.message || "Faild to Get All Posts");
  }
};

const getUserProfileFromPost = async (req, res, next) => {
  try {
    const userId = req.params.id;

    if (String(req.user._id) === userId) {
      return res
        .status(200)
        .json(new ApiResponse(200, req.user, "You are viewing your  Profile"));
    }

    if (!userId) {
      next(new ApiError(400, "User id is required"));
    }

    const user = await User.findById(userId);

    if (!user) {
      next(new ApiError(400, "User not found"));
    }
    return res.status(200).json(new ApiResponse(200, user, "User Profile"));
  } catch (error) {
    console.log(error);
    next(new ApiError(500, error.message || "Faild to Get User Profile"));
  }
};

const postLike = async (req, res, next) => {
  try {
    const { likedPostId } = req.body;
    console.log(likedPostId);
    const userId = req.user._id;
    const post = await Post.findById(likedPostId);
    if (!post) {
      return next(new ApiError(400, "Post not found"));
    }
    const isLiked = post.likes.includes(userId);
    console.log(isLiked);

    if (isLiked) {
      post.likes = post.likes.filter((id) => {
        console.log(id, userId);
        return String(id) !== String(userId);
      });
      console.log(post.likes);
    } else {
      post.likes.push(userId);
    }
    await post.save({ validateBeforeSave: false });
    res.status(200).json(new ApiResponse(200, "Post Liked Successfully"));
  } catch (error) {
    next(new ApiError(500, error.message || "Faild to Like Post"));
  }
};

// --------------export router---------------------------
export { createPost, getAllPosts, getUserProfileFromPost, postLike };
