import { Router } from "express";
import {
  login,
  logout,
  registerUser,
  changeRole,
  getAllUsers,
  removeUser,
  getUser,
  updateUser,
} from "../controllers/authController.js";
import {
  authMiddleware,
  authorizeRoles,
  SetAuthUser,
} from "../middlewares/auth.js";

const router = Router();
router.post(
  "/register",
  // SetAuthUser,
  // authMiddleware,
  // authorizeRoles("admin"),
  registerUser
);
router.post("/login", SetAuthUser, login);

router.put(
  "/:id",
  // SetAuthUser,
  // authMiddleware,
  // authorizeRoles("admin"),
  updateUser
);
router.delete("/:id", SetAuthUser, removeUser);

router.post("/logout", SetAuthUser, authMiddleware, logout);
router.get("/getUser", SetAuthUser, authMiddleware, getUser);
router.put(
  "/change_role/:id",
  SetAuthUser,
  // authMiddleware,
  // authorizeRoles("admin"),
  changeRole
);
router.get(
  "/all",
  SetAuthUser,
  // authMiddleware,
  // authorizeRoles("admin"),
  getAllUsers
);

export default router;
