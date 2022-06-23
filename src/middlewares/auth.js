import Jwt from "jsonwebtoken";
import { errorHandler } from "../utils/errorHandler.js";
import catchAsyncError from "./catchAsyncError.js";
import User from "../models/User.js";

export const SetAuthUser = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next();
  }

  const decoded = Jwt.verify(token, String(process.env.JWT_SECRET));
  console.log({ decoded });
  if (!decoded) {
    return next();
  }
  const user = await User.findById(decoded?.id);

  res.locals.user = user;

  next();
  // 9lhdlB
});
export const authMiddleware = catchAsyncError(async (_, res, next) => {
  const { user } = res.locals;
  if (!user) {
    return next(new errorHandler("Please login again", 401));
  }

  return next();
});

export const authorizeRoles = (...roles) => {
  return (_, res, next) => {
    if (!roles.includes(res.locals.user.role)) {
      return next(
        new errorHandler(
          `Role ${res.locals.user.role} is not allowed to access this route`,
          403
        )
      );
    }
    next();
  };
};
