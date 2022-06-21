import mongoose from "mongoose";

const SupplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
    
      required: [true, "Please enter Supplier Name."],
    },
   
  },
  { timestamps: true }
);

const Supplier = mongoose.model("Supplier", SupplierSchema);

export default Supplier;
