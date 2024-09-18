import { Router } from "express";
import { ArticlesController } from "../../../controllers/_Articles.controller";

const router = Router();
const controller = new ArticlesController();

router.get(
  "/",
  controller.getArticlesINTERNALV1
);

router.get(
  "/review-requests",
  controller.getReviewRequestsArticleINTERNALV1
);

router.put(
  "/review-requests/:articleId",
  controller.updateReviewRequestArticleINTERNALV1
);


router.get(
  "/user/:userId",
  controller.getUsersArticlesINTERNALV1
);

router.get(
  "/:articleId",
  controller.getArticleINTERNALV1
);


export default router;