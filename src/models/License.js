import mongoose from "mongoose";
import moment from "moment";
const LicenseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxLength: [30, "Name cannot exceed 30 characters"],
      required: [true, "Please enter License Name."],
    },
    description: {
      type: String,
      minlength: [15, "Description length must be greater than 15 characters."],

      required: [true, "Please enter License Description."],
    },

    amount: {
      type: Number,
      min: 0,
      max: 50,
      required: [true, "Please enter amount of license."],
    },
    sku: {
      type: String,
      required: [true, "Please Enter a valid License Sku"],
      minlength: [6, "License length must be atleast 6 characters"],
      unique: true,
    },
    firstDate: {
      type: String,
    },
    type: {
      type: String,
      default: "continue",
      enum: {
        values: ["subscription", "continue"],
        message: "Please select the correct type.",
      },
    },
    sourceOfFund: {
      type: String,

      required: [true, "Please Enter a valid License Sku"],
      enum: {
        values: ["own", "donation"],
        message: "Please select the correct Source.",
      },
    },
    donor: {
      type: String,
      minlength: [3, "Enter a valid Donor Name"],

    },
    url: {
      type: String,
      minlength: [8, "Enter a valid URL."],

    },
    lempirasPrice: {
      type: Number,
      min : 1,
      required: [true, "Please enter Price of license in Lempiras"],
    },
    supplier: {
      type: String,
     
    },
    supplierContact: {
      type: String,
    
    },

    supportTime: {
      type: Number,
      min: 1,
      max: 50,
      required: [true, "Please enter Support Years of license."],
    },
    year: {
      type: Number,

    },
    validityTime: {
      type: Number,
      defailt: 4,
      required: [true, "Please enter Validity Years of license."],
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);


LicenseSchema.pre("init", async function (document) {
 
  if (Number(document.year) <= new Date().getFullYear()) {
    
    // SET EXPIRY
    const expiry = new Date(document.firstDate);
    

    expiry.setFullYear(expiry.getFullYear() + document.validityTime);
    document.expiry = expiry.getFullYear();

    // SET DAYS LEFT TILL EXPIRY
    const start = moment(Date.now());
    const end = moment(expiry);
    document.daysTillValidityExpiry = end.diff(start, "days");
    // SET Support EXPIRY
    const supportExpiry = new Date(document.firstDate);
 

    supportExpiry.setFullYear(
      supportExpiry.getFullYear() + document.supportTime
    );
    document.supportExpiry = supportExpiry.getFullYear();
    // SET DAYS LEFT TILL SUPPORT EXPIRY
    const start2 = moment(Date.now());
    const end2 = moment(supportExpiry);
    document.daysTillSupportExpiry = end2.diff(start2, "days");
   
  }
});
const License = mongoose.model("License", LicenseSchema);
export default License;
