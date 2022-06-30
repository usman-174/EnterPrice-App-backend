import jwt from "jsonwebtoken";

export const sendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, String(process.env.JWT_SECRET)||"SECRET_XXX", {
    expiresIn: process.env.JWT_EXPIREIN||"7d",
  });

  return res
    .status(statusCode)
    .cookie("token", token, {
      expires: new Date(
        Date.now() +
          parseInt(String(process.env.COOKIE_EXPIRES_TIME)||"7") *
            24 *
            60 *
            60 *
            1000
      ),
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production" ? true : false,
      path: "/",
    })
    .json({ success: true, user });
};
export const removeToken = (res) => {
 return res
    .cookie("token", "", {
      expires: new Date(0),
      maxAge: 0,
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production" ? true : false,
      path: "/",
    })
    .json({ success: true });

 
};
