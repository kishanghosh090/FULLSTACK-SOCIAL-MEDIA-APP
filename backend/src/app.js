import express from "express";
import cors from "cors";
import cookiseParser from "cookie-parser";
import { ApiError } from "./utils/ApiError.js";
import { ApiResponse } from "./utils/ApiResponse.js";
const app = express();

// cros configaration -----------------
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// json data configaration from accept form data from frontend
app.use(express.json({ limit: "16kb" }));
// url encoded configaration---------
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
// cookie configaration----------
app.use(cookiseParser());

// routes configaration
import userRoutes from "./routes/user.routes.js";
import postRouter from "./routes/posts.routes.js";
// user routes-------------
app.use("/api/v1", userRoutes);
app.use("/api/v1/users", userRoutes);

// post(user posts) routes-------------
app.use("/api/v1/posts", postRouter);

// error handle-----
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack,
    });
  }

  return res
    .status(500)
    .json(new ApiResponse(500,  "Something went wrong"));
});

export { app };
