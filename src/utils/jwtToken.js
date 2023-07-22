import jwt from "jsonwebtoken";

export const sendToken = (user, statusCode, res) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in the environment variables.");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIREIN || "7d",
    });

    const cookieOptions = {
      expires: new Date(
        Date.now() +
          parseInt(process.env.COOKIE_EXPIRES_TIME || "7") * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    };

    return res
      .status(statusCode)
      .cookie("token", token, cookieOptions)
      .json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const removeToken = (res) => {
  try {
    const cookieOptions = {
      expires: new Date(0),
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    };

    return res
      .cookie("token", "", cookieOptions)
      .json({ success: true, message: "Token removed successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
