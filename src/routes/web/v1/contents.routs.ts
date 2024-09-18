import { Router } from "express";
import { ContentsController } from "../../../controllers/Contents.controller";

const router = Router();
const controller = new ContentsController();

router.get(
  "/",
  controller.getArticlesV1
);

router.get(
  "/:id",
  controller.getArticleV1
);

export default router;