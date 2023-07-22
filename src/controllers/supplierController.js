import Supplier from "../models/Supplier.js";
import catchAsyncError from "../middlewares/catchAsyncError.js";

// GET Suppliers
const getSuppliers = catchAsyncError(async (req, res) => {
  const suppliers = await Supplier.find({});
  return res.status(200).json({ success: true, data: suppliers });
});

// ADD Supplier
const addSupplier = catchAsyncError(async (req, res) => {
  const supplier = new Supplier({ ...req.body });
  await supplier.save();
  return res.status(201).json({ success: true });
});

// UPDATE Supplier
const updateSupplier = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const supplier = await Supplier.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!supplier) {
    return next(new Error("Supplier not found"));
  }
  return res.status(200).json({ success: true });
});

// DELETE Supplier
const deleteSupplier = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const supplier = await Supplier.findByIdAndDelete(id);
  if (!supplier) {
    return next(new Error("Supplier not found"));
  }
  return res.status(200).json({ success: true });
});

export { addSupplier, updateSupplier, deleteSupplier, getSuppliers };
