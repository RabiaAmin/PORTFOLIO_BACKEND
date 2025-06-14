import { User } from "../models/user.model.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("User Not Authenticated!", 400));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded._id) {
    return next(new ErrorHandler("Invalid token payload", 401));
  }
  req.user = await User.findById(decoded._id);

  if (!req.user) {
    return next(new ErrorHandler("User not found", 404));
  }
  next();
});
