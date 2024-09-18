import { Router } from "express";
import authRouting from "./auth.route";
import articleLikesRouting from "./article-likes.route";
import tagsRouting from "./tags.route";
import commentRouting from "./comments.route";
import commentLikesRouting from "./comment-likes.route";
import contentsRouting from "./contents.routs";
import supportTicketsRouting from "./support-tickets.route";

import dashboardRouting from "./dashboard.route";

const router = Router();

router.use("/contents", contentsRouting);
router.use("/dashboard", dashboardRouting);

// internal & entities
router.use("/user", authRouting);
router.use("/comment", commentRouting);
router.use("/article-likes", articleLikesRouting);
router.use("/comment-likes", commentLikesRouting);
router.use("/tags", tagsRouting);
router.use("/support-tickets", supportTicketsRouting);

export default router;