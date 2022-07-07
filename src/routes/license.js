import { Router } from "express";
import {
  addLicense,
  notifyExpiredLicenses,
  getAdminLicense,
  getLicense,
  removeLicense,
  singleLicense,
  updateLicense,
} from "../controllers/licenseController.js";

import {
  authMiddleware,
  authorizeRoles,
  SetAuthUser,
} from "../middlewares/auth.js";

const router = Router();
router.post(
  "/",
  SetAuthUser,
  authMiddleware,

  addLicense
);
router.put(
  "/:id",
  SetAuthUser,
  authMiddleware,

  updateLicense
);
router.delete("/:id", SetAuthUser, authMiddleware, removeLicense);
router.post("/notify", SetAuthUser, authMiddleware,authorizeRoles("admin"), notifyExpiredLicenses);
router.get("/", SetAuthUser, authMiddleware, getLicense);
router.get("/all", SetAuthUser, authMiddleware,authorizeRoles("admin"), getAdminLicense);
router.get("/:id", SetAuthUser, singleLicense);
export default router;
