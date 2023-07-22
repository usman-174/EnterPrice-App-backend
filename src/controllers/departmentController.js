import catchAsyncError from "../middlewares/catchAsyncError.js";
import Department from "../models/Department.js";
import User from "../models/User.js";
import License from "../models/License.js";

// ADMIN ADD DEPARTMENT
const addDepartment = catchAsyncError(async (req, res) => {
  const { name, description, direction } = req.body;
  const department = new Department({ name, description, direction });
  const savedDepartment = await department.save();
  return res.status(200).json({ success: true, department: savedDepartment });
});

// ADMIN GET DEPARTMENTS
const getDepartments = catchAsyncError(async (req, res) => {
  const departments = await Department.find({});
  return res.status(200).json({ success: true, departments });
});

// ADMIN REMOVE DEPARTMENTS
const removeDepartment = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const department = await Department.findByIdAndDelete(id);
  if (!department) {
    return next(new Error("Department doesn't exist"));
  }

  await User.deleteMany({ department: id });
  await License.deleteMany({ department: id });

  return res.status(200).json({ success: true });
});

const updateDepartment = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const department = await Department.findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true, runValidators: true }
  );

  if (!department) {
    return next(new Error("Department doesn't exist"));
  }

  return res.status(200).json({ success: true, department });
});

const singleDepartment = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const department = await Department.findById(id);

  if (!department) {
    return next(new Error("Department doesn't exist"));
  }

  return res.status(200).json({ success: true, department });
});

export {
  addDepartment,
  getDepartments,
  removeDepartment,
  updateDepartment,
  singleDepartment,
};
