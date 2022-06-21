import { Router } from "express";
import {
  addDonor,
  deleteDonor,
  getDonors,
  updateDonor,
} from "../controllers/donorController.js";
import {
  authMiddleware,
  authorizeRoles,
  SetAuthUser,
} from "../middlewares/auth.js";
const router = Router();

router.get(
  "/",
  SetAuthUser,
  authMiddleware,
  
  getDonors
);
router.put(
  "/:id",
  SetAuthUser,
  authMiddleware,
  authorizeRoles("admin"),
  updateDonor
);
router.delete(
  "/:id",
  SetAuthUser,
  authMiddleware,
  authorizeRoles("admin"),
  deleteDonor
);
router.post(
  "/",
  SetAuthUser,
  authMiddleware,
  authorizeRoles("admin"),
  addDonor
);

export default router;
