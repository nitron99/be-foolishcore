import { Router } from "express";
import internalRouting from "./internal/index";
import webRouting from "./web/index";

const router = Router();

router.use("/internal", internalRouting);
router.use("/web", webRouting);

export default router;