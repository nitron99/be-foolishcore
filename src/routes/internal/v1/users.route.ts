import { Router } from "express";
import { UsersController } from "../../../controllers/_Users.controller";

const router = Router();
const controller = new UsersController();

router.get(
  "/",
  controller.getUsersINTERNALV1
);

router.get(
  "/:userId",
  controller.getUserINTERNALV1
);

router.put(
  "/toggle/:userId",
  controller.toggleUserINTERNALV1
);


export default router;