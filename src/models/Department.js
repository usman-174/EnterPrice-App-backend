import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      maxLength: [30, "Username cannot exceed 30 characters"],
      required: [true, "Please enter Department Name."],
    },
    description: {
      type: String,
      trim: true,
      minlength: [15, "Description length must be greater than 15 characters."],
      required: [true, "Please enter Department Description."],
    },
  },
  { timestamps: true }
);

const Department = mongoose.model("Department", departmentSchema);

export default Department;
