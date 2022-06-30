import catchAsyncError from "../middlewares/catchAsyncError.js";
import { errorHandler } from "../utils/errorHandler.js";
import Direction from "../models/Direction.js";
// GET Directions
const getDirections = catchAsyncError(async (req, res, next) => {
  const directions = await Direction.find({});

  return res.status(200).json({ success: true, directions });
});
// ADD Direction
const addDirection = catchAsyncError(async (req, res, next) => {
  const direction = new Direction({ ...req.body });
  const saved = await direction.save();
  if (!saved) {
    return next(new errorHandler("Failed to Create  Direction", 400));
  }
  return res.status(200).json({ success: true });
});
// UPDATE Direction
const updateDirection = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const direction = await Direction.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!direction) {
    return next(new errorHandler("Failed to Update Direction", 400));
  }
  return res.status(200).json({ success: true });
});
// DELETE Direction
const deleteDirection = catchAsyncError(async (req, res) => {
  const { id } = req.params;

  await Direction.findByIdAndDelete(id);

  return res.status(200).json({ success: true });
});

export { addDirection, updateDirection, deleteDirection, getDirections };
