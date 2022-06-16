import { Router } from "express";
import {
  addDepartment,
  getDepartments,
  removeDepartment,
  updateDepartment,
  singleDepartment,
} from "../controllers/departmentController.js";
import {
  authMiddleware,
  authorizeRoles,
  SetAuthUser,
} from "../middlewares/auth.js";

const router = Router();
router.post("/", SetAuthUser,
 // authMiddleware,
  // authorizeRoles("admin"),
   addDepartment);
router.put(
  "/:id",
  SetAuthUser,
  // authMiddleware,
  // authorizeRoles("admin"),
  updateDepartment
);
router.delete(
  "/:id",
  SetAuthUser,
  // authMiddleware,
  // authorizeRoles("admin"),
  removeDepartment
);
router.get("/", SetAuthUser, getDepartments);
router.get("/:id", SetAuthUser, singleDepartment);
export default router;
