import { Router } from "express";
import { AuthController } from "../../../controllers/Auth.controller";

const router = Router();
const controller = new AuthController();

router.post(
  "/",
  controller.authenicateV1
);

export default router;