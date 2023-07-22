import Direction from "../models/Direction.js";
import catchAsyncError from "../middlewares/catchAsyncError.js";

// GET Directions
const getDirections = catchAsyncError(async (req, res) => {
  const directions = await Direction.find({});
  return res.status(200).json({ success: true, directions });
});

// ADD Direction
const addDirection = catchAsyncError(async (req, res, next) => {
  const direction = new Direction({ ...req.body });
  const savedDirection = await direction.save();
  if (!savedDirection) {
    return next(new Error("Failed to create the Direction"));
  }
  return res.status(201).json({ success: true });
});

// UPDATE Direction
const updateDirection = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const updatedDirection = await Direction.findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true, runValidators: true }
  );
  if (!updatedDirection) {
    return next(new Error("Failed to update the Direction"));
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
