import { Router } from "express";
import { CommentsController } from "../../../controllers/_Comments.controller";
import { Tokenizer } from "../../../submodules/middlewares/tokenizer";

const router = Router();
const tokenizer = new Tokenizer()
const controller = new CommentsController();

router.get(
  "/:articleId",
  tokenizer.parseAuthToken, 
  controller.getCommentsV1
);

router.get(
  "/total/:articleId",
  controller.getTotalCommentsV1
);

router.get(
  "/:articleId/:commentId",
  controller.getRepliesV1
);

router.post(
  "/:articleId",
  tokenizer.parseAuthToken, 
  controller.createCommentV1
);

router.put(
  "/:commentId",
  tokenizer.parseAuthToken, 
  controller.updateCommentV1
);

router.delete(
  "/:commentId",
  tokenizer.parseAuthToken, 
  controller.deleteCommentV1
)

export default router;