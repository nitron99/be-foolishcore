import { Router } from "express";
import { InternalUsersController } from "../../../controllers/_Internal-Users.controller";

const router = Router();
const controller = new InternalUsersController();

router.post(
  "/login",
  controller.loginINTERNALV1
);

router.post(
  "/register",
  controller.registerINTERNALV1
);

export default router;