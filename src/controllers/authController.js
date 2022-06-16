import catchAsyncError from "../middlewares/catchAsyncError.js";
import { errorHandler } from "../utils/errorHandler.js";
import { removeToken, sendToken } from "../utils/jwtToken.js";
import bcryptjs from "bcryptjs";
import generator from "generate-password";
import User from "../models/User.js";
import Department from "../models/Department.js";

import sgMail from "@sendgrid/mail";
sgMail.setApiKey("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");
// GET ALL USERS
const getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find({}).populate("department");
  return res.status(200).json({ success: true, users });
});

// ADMIN UPDATE USER
const updateUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { password } = req.body;
  let user;
  if (password) {
    const hashed = bcryptjs.hashSync(password);
    user = await User.findByIdAndUpdate(
      id,
      { ...req.body, password: hashed },
      { new: true, runValidators: true }
    );
  } else {
    user = await User.findByIdAndUpdate(id, { ...req.body }, { new: true });
  }
  if (!user) {
    return next(new errorHandler("Failed to Updated the User", 400));
  }
  return res.status(200).json({ success: true, user });
});
// LOGIn USER
const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) return next(new errorHandler("Email cannot be empty", 400));
  if (!password) return next(new errorHandler("Password cannot be empty", 400));

  const user = await User.findOne({ email })
    .select("+password")
    .populate("department");

  if (!user) return next(new errorHandler("User not found", 400));

  

  const passwordMatches = await bcryptjs.compare(password, user.password);
  if (!passwordMatches)
    return next(new errorHandler("Invalid Credentials", 401));
  user.password = undefined;

  sendToken(user, 200, res);
});
// ADMIN REGISTER USER
const registerUser = catchAsyncError(async (req, res, next) => {
  const { username, email, departmentId, role } = req.body;
  const deptFound = await Department.findOne({ id: departmentId });
  if (!deptFound)
    return next(
      new errorHandler(
        `Department with ID : ${departmentId} does not exist `,
        400
      )
    );
  const user = new User({ username, email, department: deptFound._id, role });
  const pass = generator.generate({
    length: 8,
    symbols: true,
    numbers: true,
  });
  // const pass = "test123";
  user.password = bcryptjs.hashSync(pass);
  await user.save();
  await Department.findByIdAndUpdate(departmentId, {
    $pull: {
      users: user._id,
    },
  });

  const msg = {
    to: "hellmughal123@gmail.com",
    from: "il_matamorosc@unicah.edu", // Use the email address or domain you verified above
    subject: "Your Credentials.",
    text: "You account has been created",
    html: `<p>
    <h3>Name : ${user.username}</h3>  
    </br>
    <h3>Email : ${user.email}</h3>  
    </br>
    <h3>Password : ${pass}</h3>  

  </p>`,
  };
  console.log({pass});
  await sgMail.send(msg);

  return res.status(200).json({ success: true, user });
});

// LOGOUT USER
const logout = catchAsyncError(async (_, res) => {
  res.locals.user = undefined;
  removeToken(res);
});

// MAKE ADMIN
const changeRole = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  
  const { role } = req.body;
 
  const found = await User.findByIdAndUpdate(id, { role }, { new: true });
  if (!found) return next(new errorHandler("Failed to update the User.", 400));

  return res.status(200).json({ success: true, user: found });
});

// ADMIN REMOVE USER
const removeUser = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);

  return res.status(200).json({ success: true });
});
const getUser = catchAsyncError((_, res) => {
  return res.status(200).json(res?.locals.user);
});
export {
  login,
  registerUser,
  logout,
  updateUser,
  changeRole,
  getAllUsers,
  removeUser,
  getUser,
};
