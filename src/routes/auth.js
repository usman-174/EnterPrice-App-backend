import { Router } from "express";
import {
  login,
  logout,
  registerUser,
  changeRole,
  createDirector,
  getAllUsers,
  changePassword,
  removeUser,
  getUser,
  updateUser,
  getAllDirectors,
} from "../controllers/authController.js";
import {
  authMiddleware,
  authorizeRoles,
  SetAuthUser,
} from "../middlewares/auth.js";

const router = Router();
router.post(
  "/register",
  SetAuthUser,
  // authMiddleware,
  // authorizeRoles("admin"),
  registerUser
);
router.post("/login", SetAuthUser, login);

router.put(
  "/:id",
  SetAuthUser,
  authMiddleware,
  authorizeRoles("admin"),
  updateUser
);
router.post("/change_password", changePassword);
router.delete("/:id", SetAuthUser, authorizeRoles("admin"), removeUser);
router.post(
  "/add_director",
  SetAuthUser,
  authMiddleware,
  authorizeRoles("admin"),
  createDirector
);
router.post("/logout", SetAuthUser, authMiddleware, logout);
router.get("/getUser", SetAuthUser, authMiddleware, getUser);
router.put(
  "/change_role/:id",
  SetAuthUser,
  authMiddleware,
  authorizeRoles("admin"),
  changeRole
);
router.get(
  "/all",
  SetAuthUser,
  authMiddleware,
  authorizeRoles("admin"),
  getAllUsers
);
router.get(
  "/all_directors",
  SetAuthUser,
  authMiddleware,
  authorizeRoles("admin"),
  getAllDirectors
);

export default router;
