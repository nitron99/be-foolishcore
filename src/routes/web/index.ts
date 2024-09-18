import { Router } from "express";
import v1Routing from "./v1/index";

const router = Router();

router.use("/v1", v1Routing);

export default router;