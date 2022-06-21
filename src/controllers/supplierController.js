import Supplier from "../models/Supplier.js";
import catchAsyncError from "../middlewares/catchAsyncError.js";
import { errorHandler } from "../utils/errorHandler.js";
// GET Suppliers
const getSuppliers = catchAsyncError(async (req, res, next) => {
  const suppliers = await Supplier.find({});

  return res.status(200).json({ success: true, suppliers });
});
// ADD Supplier
const addSupplier = catchAsyncError(async (req, res, next) => {
  const supplier = new Supplier({ ...req.body });
  const saved = await supplier.save();
  if (!saved) {
    return next(new errorHandler("Failed to Create  Supplier", 400));
  }
  return res.status(200).json({ success: true });
});
// UPDATE Supplier
const updateSupplier = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const supplier = await Supplier.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!supplier) {
    return next(new errorHandler("Failed to Update Supplier", 400));
  }
  return res.status(200).json({ success: true });
});
// DELETE Supplier
const deleteSupplier = catchAsyncError(async (req, res) => {
  const { id } = req.params;

  await Supplier.findByIdAndDelete(id);

  return res.status(200).json({ success: true });
});

export { addSupplier, updateSupplier, deleteSupplier, getSuppliers };
