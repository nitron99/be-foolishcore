import { Router } from "express";
import internalUsersRouting from "./internal-users.route";
import usersRouting from "./users.route";
import articleRouting from "./articles.route";
import tagsRouting from "./tags.route";
import configurationsRouting from "./configurations.route";

const router = Router();

router.use("/internal-users", internalUsersRouting);
router.use("/users", usersRouting);
router.use("/articles", articleRouting);
router.use("/tags", tagsRouting);
router.use("/configurations", configurationsRouting);

export default router;