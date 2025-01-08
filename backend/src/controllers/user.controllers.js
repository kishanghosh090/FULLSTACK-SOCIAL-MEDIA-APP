import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/emailSend.js";
import generateOTP from "../utils/generateOTP.js";

// generate token----------
const generateToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(400, "User not found");
    }
    const token = user.token();
    user.refreshToken = token;
    await user.save({ validateBeforeSave: false });
    return token;
  } catch (error) {
    throw new ApiError(500, error.message || "Faild to Generate Token");
  }
};

// register user And upload profile pic--------
const registerUser = async (req, res, next) => {
  try {
    const { fullName, userName, phoneNumber, email, password } = req.body;

    // validation-------
    if (
      [fullName, userName, phoneNumber, email, password].some((item) => {
        return item?.trim() === "";
      })
    ) {
      return next(new ApiError(400, "All fields are required"));
    }

    // is email already exists-------
    const user = await User.findOne({
      $and: [{ email }, { phoneNumber }],
    });
    if (user) {
      return next(
        new ApiError(400, "User Phone number or email already exists")
      );
    }

    // create user---------
    const newUser = await User.create({
      fullName,
      userName,
      phoneNumber: parseInt(phoneNumber),
      email: email.toLowerCase().trim(),
      password,
    });

    // send response
    return res
      .status(201)
      .json(new ApiResponse(201, newUser, "User created successfully"));
  } catch (error) {
    return next(new ApiError(500, error.message || "Faild to create User"));
  }
};

// login user--------------
const loginUser = async (req, res, next) => {
  try {
    const { email, phoneNumber, password } = req.body;

    // validation is user blank the required fields-------
    if (!password) {
      return next(new ApiError(400, "Password is required"));
    }

    if (!email && !phoneNumber) {
      return next(new ApiError(400, "Email or phone number is required"));
    }

    // is user exists-------
    const user = await User.findOne({
      $or: [
        { email: email?.toLowerCase().trim() },
        { phoneNumber: phoneNumber },
      ],
    });
    if (!user) {
      return next(new ApiError(400, "User not found"));
    }

    // is password correct-------
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      return next(new ApiError(400, "Password is incorrect"));
    }

    // create token---------
    const token = await generateToken(user._id);

    const cookieOptions = {
      httpOnly: true,
      secure: true,
    };

    // send response and set cookie-------
    return res
      .status(202)
      .cookie("token", token, cookieOptions)
      .json(new ApiResponse(202, user, "User Login successfully"));
  } catch (error) {
    return next(new ApiError(500, error.message || "Faild to Login"));
  }
};
const uploadProfilePic = async (req, res, next) => {
  try {
    // is user logged in-------
    const token = req.cookies?.token;

    if (!token) {
      return next(new ApiError(401, "Unauthorized"));
    }

    const decodedToken = await jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id);
    if (!user) {
      return next(new ApiError(401, "Invalid Access Token"));
    }

    // upload profile pic-----------
    const avatarLocalPath = req.file.path;
    if (!avatarLocalPath) {
      return next(new ApiError(400, "Profile pic is required"));
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
      return next(new ApiError(500, "Faild to Upload Profile Pic"));
    }
    user.avatar = avatar.url;

    await user.save();

    // send response
    return res
      .status(200)
      .json(new ApiResponse(200, user, "Profile pic uploaded successfully"));
  } catch (error) {
    return next(
      new ApiError(500, error.message || "Faild to Upload Profile Pic")
    );
  }
};

// logout user------------
const logoutUser = async (req, res, next) => {
  try {
    // is user logged in-------
    const token = req.cookies?.token;
    if (!token) {
      return next(new ApiError(401, "Unauthorized"));
    }
    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    // remove token from db and send response
    const user = await User.findById(decodedToken._id);
    if (!user) {
      return next(new ApiError(401, "Invalid Access Token"));
    }
    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });

    const cookieOptions = {
      httpOnly: true,
      secure: true,
    };

    // send response and clear cookie-------
    res
      .status(200)
      .clearCookie("token", cookieOptions)
      .json(new ApiResponse(200, user, "User Logout successfully"));
  } catch (error) {
    return next(new ApiError(500, error.message || "Faild to Logout"));
  }
};

// get UserProfile page((IT'S OUR HOME PAGE))--------
const getUserProfile = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return next(new ApiError(401, "Unauthorized"));
    }

    // find user
    const userProfile = await User.findById(user._id)
      .populate("posts")
      .select("-password -refreshToken");
    // send response
    res.status(200).json(new ApiResponse(200, userProfile, "User Profile"));
  } catch (error) {
    return next(
      new ApiError(500, error.message || "Faild to get User Profile")
    );
  }
};

// forget password EMIL SEND-----

const forgertUserPasswordOTPSend = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ApiError(400, "User not found"));
    }

    // generate OTP
    const OTP = await generateOTP();
    user.OTP = OTP;
    await user.save({ validateBeforeSave: false });

    // send email
    const emailSendResponse = await sendEmail(OTP, email);

    // send response
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          emailSendResponse,
          "OTP send to your email successfully"
        )
      );
  } catch (error) {
    return next(new ApiError(500, error.message || "Faild to Forget Password"));
  }
};

// forget password OTP VERIFY-----
const forgetPasswordOTPVerify = async (req, res, next) => {
  try {
    const { email, OTP } = req.body;
    console.log(email, OTP);

    const user = await User.findOne({ email });
    console.log(user);

    if (!user) {
      return next(new ApiError(400, "User not found"));
    }

    if (parseInt(user.OTP) !== parseInt(OTP)) {
      return next(new ApiError(400, "Invalid OTP"));
    }

    user.OTP = null;
    await user.save({ validateBeforeSave: false });

    // create token
    const token = await generateToken(user._id);

    const cookieOptions = {
      httpOnly: true,
      secure: true,
    };
    // send response-----------
    res
      .status(200)
      .cookie("token", token, cookieOptions)
      .json(new ApiResponse(200, {}, "OTP Verify successfully"));
  } catch (error) {
    return next(new ApiError(500, error.message || "Faild to OTP Verify"));
  }
};

// /////----------  edit profile --------------------

// edit profile pic-------------------
const editProfilePic = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return next(new ApiError(401, "Unauthorized"));
    }
    const avatarLocalPath = req.file.path;
    if (!avatarLocalPath) {
      return next(new ApiError(400, "Avatar not found"));
    }

    // upload on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
      return next(new ApiError(500, "Faild to Upload Profile Pic"));
    }
    // delete old pic
    await deleteFromCloudinary(user.avatar);

    // update new pic to db
    const newUser = await User.findByIdAndUpdate(user._id, {
      avatar: avatar.url,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, newUser, "Profile pic uploaded successfully"));
  } catch (error) {
    return next(
      new ApiError(500, error.message || "Faild to Edit Profile Pic")
    );
  }
};

// edit user name-------------------
const editUserName = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { userName } = req.body;
    if (!userName) {
      return next(new ApiError(400, "User name is required"));
    }
    const user = await User.findById(userId);
    if (!user) {
      return next(new ApiError(400, "User not found"));
    }
    user.userName = userName;
    await user.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User name updated successfully"));
  } catch (error) {
    return next(new ApiError(500, error.message || "Faild to Edit User Name"));
  }
};
// edit full name-------------------
const editFullName = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { fullName } = req.body;
    if (!fullName) {
      return next(new ApiError(400, "Full name is required"));
    }
    const user = await User.findById(userId);
    if (!user) {
      return next(new ApiError(400, "User not found"));
    }
    user.fullName = fullName;
    await user.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User name updated successfully"));
  } catch (error) {
    return next(new ApiError(500, error.message || "Faild to Edit User Name"));
  }
};
const editPhoneNumber = async (req, res, next) => {};

// search user by username or phone number
const searchUser = async (req, res, next) => {
  const { userNameOrNumber } = req.body;
  if (!userNameOrNumber) {
    return next(new ApiError(400, "Username or phone number is required"));
  }
  try {
    const users = await User.find({
      $or: [{ userName: userNameOrNumber }, { phoneNumber: userNameOrNumber }],
    });
    return res
      .status(200)
      .json(new ApiResponse(200, users, "User Search successfully"));
  } catch (error) {
    next(new ApiError(500, error.message || "Faild to Search User"));
  }
};

// make friend controllers
const makeFriend = async (req, res, next) => {
  try {
    const { followerId } = req.body;
    const userId = req.user._id;
    if (!followerId) {
      return next(new ApiError(400, "Follower Id is required"));
    }
    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return next(new ApiError(400, "User not found"));
    }
    if (userToFollow.friends.includes(followerId)) {
      userToFollow.friends = userToFollow.friends.filter(
        (id) => String(id) !== String(followerId)
      );
    } else {
      userToFollow.friends.push(followerId);
    }
    await userToFollow.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(new ApiResponse(200, userToFollow, "Friend Added successfully"));
  } catch (error) {
    return next(new ApiError(500, error.message || "Faild to Make Friend"));
  }
};

// export controllers--------------------------------------------
export {
  registerUser,
  loginUser,
  logoutUser,
  uploadProfilePic,
  getUserProfile,
  forgertUserPasswordOTPSend,
  forgetPasswordOTPVerify,
  editProfilePic,
  editUserName,
  editFullName,
  editPhoneNumber,
  searchUser,
  makeFriend,
};
