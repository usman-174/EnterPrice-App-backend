import mongoose from "mongoose";

const DonorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
    
      required: [true, "Please enter Donor Name."],
    },
   
  },
  { timestamps: true }
);

const Donor = mongoose.model("Donor", DonorSchema);

export default Donor;
