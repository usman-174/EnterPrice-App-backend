import Jwt from "jsonwebtoken";
import { errorHandler } from "../utils/errorHandler.js";
import catchAsyncError from "./catchAsyncError.js";
import User from "../models/User.js";

export const SetAuthUser = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next();
  }

  try {
    const decoded = Jwt.verify(token, process.env.JWT_SECRET || "DEFAULT_SECRET");
    if (!decoded) {
      return next();
    }

    const user = await User.findById(decoded.id).populate("manageList");
    res.locals.user = user;
  } catch (error) {
    // If there's an error with JWT verification or fetching user data, proceed without setting the user.
    console.error("Error while authenticating user:", error);
  }

  next();
});

export const authMiddleware  = catchAsyncError(async (_, res, next) => {
  const { user } = res.locals;
  if (!user) {
    return next(new errorHandler("Please login again", 401));
  }

  next();
});

export const authorizeRoles = (...roles) => {
  return (_, res, next) => {
    const { user } = res.locals;
    if (!user) {
      return next(new errorHandler("Please login to access this route", 401));
    }

    if (!roles.includes(user.role)) {
      return next(
        new errorHandler(
          `Role ${user.role} is not allowed to access this route`,
          403
        )
      );
    }

    next();
  };
};
