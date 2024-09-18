import { Router } from "express";
import { ArticleLikesController } from "../../../controllers/__Article-Likes.controller";
import { Tokenizer } from "../../../submodules/middlewares/tokenizer";

const router = Router();
const tokenizer = new Tokenizer()
const controller = new ArticleLikesController();

router.get(
  "/:articleId", 
  controller.getTotalArticleLikesV1
);

router.get(
  "/liked/:articleId",
  tokenizer.parseAuthToken, 
  controller.getArticleLikedV1
);

router.post(
  "/:articleId",
  tokenizer.parseAuthToken, 
  controller.likeArticleV1
);

export default router;