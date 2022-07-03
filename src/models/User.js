import mongoose from "mongoose";
import validator from "validator";
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      maxLength: [100, "Username cannot exceed 100 characters"],
      required: [true, "Please enter Username."],
    },
    email: {
      type: String,
      required: [true, "Please enter your email."],
      unique: [true, "Email already in use."],
      validate: [validator.isEmail, "Please enter a valid Email."],
    },
    seeOnly: {
      type: Boolean,
    },
    password: {
      type: String,
      minlength: [6, "Password length must be longer than 6 characters."],
      select: false,
    },
    manageList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
      },
    ],
  
    role: {
      type: String,
      default: "user",
      enum: {
        values: ["admin", "user", "director"],
        message: "Please select the a valid role.",
      },
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
  },
  { timestamps: true }
);
UserSchema.pre("init", async function (document) {
  if (document.role !== "director") {
    document.managelist = undefined;
    

  } else if (document.role == "director" || document.role === "admin") {
    document.department = undefined;
  }
 
}); 
const User = mongoose.model("User", UserSchema);

export default User;
