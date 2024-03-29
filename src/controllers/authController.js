import bcryptjs from "bcryptjs";
import generator from "generate-password";
import catchAsyncError from "../middlewares/catchAsyncError.js";
import Department from "../models/Department.js";
import User from "../models/User.js";
import { errorHandler } from "../utils/errorHandler.js";
import { removeToken, sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/transport.js";

// GET ALL USERS
const getAllUsers = catchAsyncError(async (req, res) => {
  const users = await User.find({}).select("-password").populate("department");
  return res.status(200).json({ success: true, users });
});

// GET ALL Directors
const getAllDirectors = catchAsyncError(async (req, res) => {
  const directors = await User.find({ role: "director" }).populate("manageList");
  return res.status(200).json({ success: true, directors });
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
    return next(new errorHandler("Failed to update the User", 400));
  }

  return res.status(200).json({ success: true, user });
});

// LOGIn USER
const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new errorHandler("Email and Password are required", 400));
  }
 

  const user = await User.findOne({ email }).select("+password").populate("department manageList");
  if (!user) {
    return next(new errorHandler("User not found", 400));
  }


  const passwordMatches =  bcryptjs.compare(password, user.password);
  if (!passwordMatches) {
    return next(new errorHandler("Invalid Credentials", 401));
  }

  user.password = undefined;
  sendToken(user, 200, res);
});

// ADMIN REGISTER USER
const registerUser = catchAsyncError(async (req, res, next) => {
  const { username, email, department, role, seeOnly } = req.body;

  // Check if the email already exists in the database
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new errorHandler(`Email '${email}' is already taken`, 400));
  }

  const fields = { username, email, role };

  if (role === "user") {
    const deptFound = await Department.findById(department);
    if (!deptFound) {
      return next(new errorHandler(`Department with ID: ${department} does not exist`, 400));
    }
    fields.department = deptFound._id;
  }

  if (role !== "director" && role !== "admin" && seeOnly) {
    fields.seeOnly = true;
  }

  const user = new User(fields);
  const pass = generator.generate({
    length: 8,
    symbols: true,
    numbers: true,
  });
  user.password = bcryptjs.hashSync(pass);
  await user.save();
  await Department.findByIdAndUpdate(department, {
    $pull: {
      users: user._id,
    },
  });

  const msg = {
    to: email,
    from: "hellmughal123@gmail.com", // Use the email address or domain you verified above
    subject: "Your Credentials.",
    text: "Your account has been created",
    html: `<p>
    <h3>Name: ${user.username}</h3>  
    </br>
    <h3>Email: ${user.email}</h3>  
    </br>
    <h3>Role: ${user.role}</h3>  
    </br>
    <h3>Password: ${pass}</h3>  
    </p>`,
  };
  sendEmail(msg);

  return res.status(200).json({ success: true, user });
});

// ADMIN CREATE Director
const createDirector = catchAsyncError(async (req, res, next) => {
  const { email, username, manageList } = req.body;
  const user = new User({ email, username, manageList, role: "director" });
  const pass = generator.generate({
    length: 6,
    symbols: false,
    numbers: true,
  });
  user.password = bcryptjs.hashSync(pass);
  const saved = await user.save();

  if (!saved) {
    return next(new errorHandler("Failed to create the director.", 400));
  }

  const msg = {
    to: email,
    from: "il_matamorosc@unicah.edu", // Use the email address or domain you verified above
    subject: "Your Credentials.",
    text: "Your account has been created",
    html: `<p>
    <h3>Name: ${user.username}</h3>  
    </br>
    <h3>Email: ${user.email}</h3>  
    </br>
    <h3>Role: ${user.role}</h3>  
    </br>
    <h3>Password: ${pass}</h3>  
    </p>`,
  };
  sendEmail(msg);

  return res.status(200).json({ success: true, director: user });
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
  if (!found) {
    return next(new errorHandler("Failed to update the User.", 400));
  }

  return res.status(200).json({ success: true, user: found });
});

// ADMIN REMOVE USER
const removeUser = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);

  return res.status(200).json({ success: true });
});

const getUser = catchAsyncError(async (_, res) => {
  return res.status(200).json(res.locals.user);
});

const changePassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const find = await User.findOne({ email });

  if (!find) {
    return next(new errorHandler("This Email is not registered.", 400));
  }

  const pass = generator.generate({
    length: 6,
    numbers: true,
  });

  find.password = bcryptjs.hashSync(pass);
  const saved = await find.save();
  if (!saved) {
    return next(new errorHandler("There was an error updating your password.", 400));
  }

  const msg = {
    to: email,
    from: process.env.MAIL_USER, // Use the email address or domain you verified above
    subject: "Forgot Password",
    text: "This is your new password: " + pass,
    html: `<p>
    <h3>Name: ${find.username}</h3>  
    </br>
    <h3>Email: ${find.email}</h3>  
    </br>
    <h3>Role: ${find.role}</h3>  
    </br>
    <h3>Password: ${pass}</h3>  
    </p>`,
  };
  sendEmail(msg);

  find.password = undefined;
  return res.status(200).json({ success: true, find });
});

export {
  login,
  registerUser,
  logout,
  updateUser,
  changeRole,
  getAllUsers,
  getAllDirectors,
  createDirector,
  removeUser,
  getUser,
  changePassword,
};
