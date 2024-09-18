import { Router } from "express";
import { TagsController } from "../../../controllers/_Tags.controller";
import { Tokenizer } from "../../../submodules/middlewares/tokenizer";

const router = Router();
const tokenizer = new Tokenizer()
const controller = new TagsController();

router.get(
  "/",
  // tokenizer.parseInternalToken,
  controller.getTagsINTERNALV1
);

router.post(
  "/",
  // tokenizer.parseInternalToken,
  controller.createTagINTERNALV1
);

router.put(
  "/:tagId",
  // tokenizer.parseInternalToken,
  controller.updateTagINTERNALV1
);

router.delete(
  "/:tagId",
  // tokenizer.parseInternalToken,
  controller.deleteTagINTERNALV1
);


export default router;