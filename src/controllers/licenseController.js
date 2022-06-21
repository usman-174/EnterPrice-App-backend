import catchAsyncError from "../middlewares/catchAsyncError.js";
import License from "../models/License.js";
import { errorHandler } from "../utils/errorHandler.js";
// Add Single License

const addLicense = catchAsyncError(async (req, res, next) => {
  const license = new License({ ...req.body, user: res?.locals.user._id });

  const saved = await license.save();
  if (!saved)
    return next(new errorHandler("Failed to create the License", 400));
  return res.status(200).json({ success: true, license: saved });
});
// Update Single License
const updateLicense = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const updated = await License.findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true, runValidators: true }
  );
  if (!updated)
    return next(new errorHandler("Failed to update the License", 400));
  return res.status(200).json({ success: true, license: updated });
});
const removeLicense = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  await License.findByIdAndDelete(id);

  return res.status(200).json({ success: true });
});

// GET ALL LICENSES
const getLicense = catchAsyncError(async (_, res) => {
  const { department, role, manageList } = res.locals.user;
  let licenses = [];
  if (role !== "director") {
    licenses = await License.find({ department }).populate([
      "user",
      "department",
    ]);
  } else {
    licenses = await License.find({ department: { $in: manageList } }).populate(
      ["user", "department"]
    );
  }
  return res.status(200).json({ success: true, licenses });
});
// GET ALL LICENSES
const getAdminLicense = catchAsyncError(async (req, res, next) => {
  const licenses = await License.find({}).populate(["user", "department"]);
  return res.status(200).json({ success: true, licenses });
});
// GET SINGLE LICENSE
const singleLicense = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const license = await License.findById(id).populate(["user", "department"]);
  if (!license) return next(new errorHandler("License not found", 400));
  return res.status(200).json({ success: true, license });
});

export {
  singleLicense,
  addLicense,
  updateLicense,
  getAdminLicense,
  removeLicense,
  getLicense,
};
