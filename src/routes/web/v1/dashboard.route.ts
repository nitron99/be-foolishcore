import { Router } from "express";
import { DashboardController } from "../../../controllers/Dashboard.controller";
import { Tokenizer } from "../../../submodules/middlewares/tokenizer";

const router = Router();
const tokenizer = new Tokenizer();
const controller = new DashboardController();

// ARTICLES
router.get("/articles", tokenizer.parseAuthToken, controller.getArticlesV1);
router.get("/articles/:id", tokenizer.parseAuthToken, controller.getArticleV1);
router.post("/articles", tokenizer.parseAuthToken, controller.createArticleV1);
router.put("/articles/:id", tokenizer.parseAuthToken, controller.updateArticleV1);
router.delete("/articles/:id", tokenizer.parseAuthToken, controller.deleteArticleV1);

// 

export default router;