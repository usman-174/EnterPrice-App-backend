import catchAsyncError from "../middlewares/catchAsyncError.js";
import Department from "../models/Department.js";
import User from "../models/User.js";
import License from "../models/License.js";

import { errorHandler } from "../utils/errorHandler.js";

// ADMIN ADD DEPARTMENT
const addDepartment = catchAsyncError(async (req, res, next) => {
  const { name, description ,direction} = req.body;
  const department = new Department({ name, description,direction });
  const saved = await department.save();
  if (!saved) next(new errorHandler("Failed to create the department", 400));
  return res.status(200).json({ success: true, department: saved });
});
// ADMIN GET DEPARTMENTS
const getDepartments = catchAsyncError(async (req, res, next) => {
  const departments = await Department.find({});
  return res.status(200).json({ success: true, departments });
});
// ADMIN REMOVE DEPARTMENTS
const removeDepartment = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const department = await Department.findByIdAndDelete(id);

  if (!department)
    return next(new errorHandler("Department doesn't exist", 400));

  const users = await User.find({
    department: id,
  });
 
  if (users.length) {
    for (let index = 0; index < users.length; index++) {
      const user = users[index];

      await User.findByIdAndDelete(user.id);
    }
  }
  const licenses = await License.find({
    department: id,
  });

  if (licenses.length) {
    for (let index = 0; index < licenses.length; index++) {
      const license = licenses[index];

      await License.findByIdAndDelete(license.id);
    }
  }
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
    return next(new errorHandler("Department doesn't exist", 400));
  }
  return res.status(200).json({ success: true, department });
});

const singleDepartment = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const department = await Department.findById(id);
  if (!department)
    return next(new errorHandler("Department doesn't exist", 400));
  return res.status(200).json({ success: true, department });
});
export {
  addDepartment,
  getDepartments,
  removeDepartment,
  updateDepartment,
  singleDepartment,
};
