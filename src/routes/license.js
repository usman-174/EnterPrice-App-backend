import { Router } from "express";
import { addLicense, getAdminLicense,getLicense, removeLicense, singleLicense, updateLicense } from "../controllers/licenseController.js";

import {
  authMiddleware,
  authorizeRoles,
  SetAuthUser,
} from "../middlewares/auth.js";

const router = Router();
router.post("/", SetAuthUser,
 // authMiddleware,
  // authorizeRoles("admin"),
   addLicense);
router.put(
  "/:id",
  SetAuthUser,
  // authMiddleware,
  // authorizeRoles("admin"),
  updateLicense
);
router.delete(
  "/:id",
  SetAuthUser,
  // authMiddleware,
  // authorizeRoles("admin"),
  removeLicense
);
router.get("/", SetAuthUser, getLicense);
router.get("/all",SetAuthUser,getAdminLicense)
router.get("/:id", SetAuthUser, singleLicense);
export default router;
