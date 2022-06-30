import { Router } from "express";
import {
  addDirection,
  deleteDirection,
  getDirections,
  updateDirection,
} from "../controllers/directionController.js";
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
  authorizeRoles("admin"),
  getDirections
);
router.put(
  "/:id",
  SetAuthUser,
  authMiddleware,
  authorizeRoles("admin"),
  updateDirection
);
router.delete(
  "/:id",
  SetAuthUser,
  authMiddleware,
  authorizeRoles("admin"),
  deleteDirection
);
router.post(
  "/",
  SetAuthUser,
  authMiddleware,
  authorizeRoles("admin"),
  addDirection
);

export default router;
