import { Router } from "express";
import { userSchema } from "../validation/user.schema";
import { validateSchema } from "../../../middleware/validate.schema";
import {
  registration,
  login,
  getUsers,
  deleteUser,
  updateUser,
  getUserById,
  requestResetPassword,
  changePassword,
} from "../controllers/users.controller";

export function createAuthRouter() {
  const router = Router({ mergeParams: true });

  router.post("/register", validateSchema(userSchema), registration);
  router.post("/login", login);

  router.post("/request-reset-password", requestResetPassword);
  router.put("/reset-password", changePassword);

  router.get("/users", getUsers);
  router.get("/user/:id", getUserById);
  router.put("/user", updateUser);
  router.delete("/user", deleteUser);

  return router;
}
