import Donor from "../models/Donor.js";
import catchAsyncError from "../middlewares/catchAsyncError.js";
import { errorHandler } from "../utils/errorHandler.js";
// GET DONORs
const getDonors = catchAsyncError(async (req, res, next) => {
  const donors = await Donor.find({});

  return res.status(200).json({ success: true, donors });
});
// ADD DONOR
const addDonor = catchAsyncError(async (req, res, next) => {
  const donor = new Donor({ ...req.body });
  const saved = await donor.save();
  if (!saved) {
    return next(new errorHandler("Failed to Create  Donor", 400));
  }
  return res.status(200).json({ success: true });
});
// UPDATE DONOR
const updateDonor = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const donor = await Donor.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!donor) {
    return next(new errorHandler("Failed to Update Donor", 400));
  }
  return res.status(200).json({ success: true });
});
// DELETE DONOR
const deleteDonor = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  await Donor.findByIdAndDelete(id);

  return res.status(200).json({ success: true });
});

export { addDonor, updateDonor, deleteDonor, getDonors };
