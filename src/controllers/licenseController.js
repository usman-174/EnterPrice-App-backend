import catchAsyncError from "../middlewares/catchAsyncError.js";
import Department from "../models/Department.js";
import License from "../models/License.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/transport.js";

// Add Single License
const addLicense = catchAsyncError(async (req, res, next) => {
  const { user } = res.locals;
  const license = new License({ ...req.body, user: user._id });

  const savedLicense = await license.save();
  if (!savedLicense) {
    return next(new Error("Failed to create the License"));
  }
  return res.status(201).json({ success: true, license: savedLicense });
});

// Update Single License
const updateLicense = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const updatedLicense = await License.findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true, runValidators: true }
  );
  if (!updatedLicense) {
    return next(new Error("Failed to update the License"));
  }
  return res.status(200).json({ success: true, license: updatedLicense });
});

// DELETE Single License
const removeLicense = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  await License.findByIdAndDelete(id);
  return res.status(200).json({ success: true });
});

// GET ALL LICENSES based on user role
const getLicense = catchAsyncError(async (req, res) => {
  const { department, role, manageList } = res.locals.user;
  let licenses = [];
  if (role !== "director") {
    licenses = await License.find({ department }).populate([
      "user",
      "department",
    ]);
  } else {
    const departments = await Department.find({ _id: { $in: manageList } });
    const departmentIds = departments.map((dep) => dep._id);
    licenses = await License.find({
      department: { $in: departmentIds },
    }).populate(["user", "department"]);
  }
  return res.status(200).json({ success: true, licenses });
});

// GET ALL LICENSES for admin
const getAdminLicense = catchAsyncError(async (req, res) => {
  const licenses = await License.find({}).populate(["user", "department"]);
  return res.status(200).json({ success: true, licenses });
});

// GET SINGLE LICENSE by ID
const singleLicense = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const license = await License.findById(id).populate(["user", "department"]);
  if (!license) {
    return next(new Error("License not found"));
  }
  return res.status(200).json({ success: true, license });
});

// Notify admin about expired licenses
const notifyExpiredLicenses = catchAsyncError(async (req, res, next) => {
  const { licenses } = req.body;
  const admins = await User.find({ role: "admin" });

  if (admins.length && licenses.length) {
    try {
      await Promise.all(
        admins.map((admin) =>
          Promise.all(
            licenses.map((license) => {
              const msg = {
                to: admin.email,
                from: "il_matamorosc@unicah.edu",
                subject: "License Expiring",
                text: `License ${license.name} is going to expire in 7 days.`,
                html: `<p>
                        <h3>Name : ${license.name}</h3>  
                        </br>
                        <h3>Id : ${license._id}</h3>  
                        </br>
                        <h3>Department : ${license.department?.name}</h3>  
                      </p>`,
              };
              return sendEmail(msg);
            })
          )
        )
      );

      return res.json({ success: true });
    } catch (error) {
      return next(new Error("Failed to send email notifications"));
    }
  } else {
    return res.json({ success: false });
  }
});

export {
  addLicense,
  updateLicense,
  getAdminLicense,
  removeLicense,
  getLicense,
  singleLicense,
  notifyExpiredLicenses,
};
