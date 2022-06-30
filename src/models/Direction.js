import mongoose from "mongoose";

const DirectionSchema = new mongoose.Schema(
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

const Direction = mongoose.model("Direction", DirectionSchema);

export default Direction;
