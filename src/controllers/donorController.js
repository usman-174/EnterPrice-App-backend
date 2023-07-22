import Donor from "../models/Donor.js";
import catchAsyncError from "../middlewares/catchAsyncError.js";

// GET DONORs
const getDonors = catchAsyncError(async (req, res) => {
  const donors = await Donor.find({});
  return res.status(200).json({ success: true, donors });
});

// ADD DONOR
const addDonor = catchAsyncError(async (req, res, next) => {
  const donor = new Donor({ ...req.body });
  const savedDonor = await donor.save();
  if (!savedDonor) {
    return next(new Error("Failed to create the Donor"));
  }
  return res.status(201).json({ success: true });
});

// UPDATE DONOR
const updateDonor = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const updatedDonor = await Donor.findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true, runValidators: true }
  );
  if (!updatedDonor) {
    return next(new Error("Failed to update the Donor"));
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
