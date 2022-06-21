import { Router } from "express";
import {
  addSupplier,
  deleteSupplier,
  getSuppliers,
  updateSupplier,
} from "../controllers/supplierController.js";
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
 
  getSuppliers
);
router.put(
  "/:id",
  SetAuthUser,
  authMiddleware,
  authorizeRoles("admin"),
  updateSupplier
);
router.delete(
  "/:id",
  SetAuthUser,
  authMiddleware,
  authorizeRoles("admin"),
  deleteSupplier
);
router.post(
  "/",
  SetAuthUser,
  authMiddleware,
  authorizeRoles("admin"),
  addSupplier
);

export default router;
