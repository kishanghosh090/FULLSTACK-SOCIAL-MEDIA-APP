import { Router } from "express";
import {
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
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middleare.js";

const router = Router();

// get user profile route (IT'S OUR HOME PAGE)
router.route("/").get(verifyJWT, getUserProfile);

// user register route
router.route("/register").post(registerUser);

//user login route
router.route("/login").post(loginUser);

// user logout route
router.route("/logout").post(logoutUser);

// user profilePic upload route
router.route("/profilePic").post(upload.single("avatar"), uploadProfilePic);

// user forget password route
router.route("/forgetPasswordOTPSend").post(forgertUserPasswordOTPSend);

// user forget password OTP verify route
router.route("/forgetPasswordOTPVerify").post(forgetPasswordOTPVerify);

// /////----------  edit profile --------------------

// edit profile pic route
router
  .route("/editProfilePic")
  .post(verifyJWT, upload.single("image"), editProfilePic);

// edit user name route
router.route("/editUserName").post(verifyJWT, editUserName);
// edit full name route
router.route("/editFullName").post(verifyJWT, editFullName);
// edit phone no route
router.route("/editPhoneNumber").post(verifyJWT, editPhoneNumber);

// search user route
router.route("/searchUser").post(searchUser);

// make friend route
router.route("/makeFriend").patch(verifyJWT, makeFriend);
//--------------- export router---------------------
export default router;
