import { Router } from "express";
import { CommentLikesController } from "../../../controllers/__Comment-Likes.controller";
import { Tokenizer } from "../../../submodules/middlewares/tokenizer";

const router = Router();
const tokenizer = new Tokenizer()
const controller = new CommentLikesController();

router.post(
  "/:commentId",
  tokenizer.parseAuthToken, 
  controller.likeCommentV1
);

export default router;