import { Router } from "express";
import { TagsController } from "../../../controllers/_Tags.controller";
import { Tokenizer } from "../../../submodules/middlewares/tokenizer";

const router = Router();
const tokenizer = new Tokenizer()
const controller = new TagsController();

router.get(
  "/",
  tokenizer.parseAuthToken,
  controller.getTagsV1
);

export default router;