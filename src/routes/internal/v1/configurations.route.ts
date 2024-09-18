import { Router } from "express";
import { ConfigurationsController } from "../../../controllers/_Configurations.controller";

const router = Router();
const controller = new ConfigurationsController();

router.get(
  "/",
  controller.getConfigurationsINTERNALV1
);

router.post(
  "/",
  controller.createConfigurationsINTERNALV1
);

router.put(
  "/:configId",
  controller.updateConfigurationsINTERNALV1
);

router.delete(
  "/:configId",
  controller.deleteConfigurationsINTERNALV1
);

router.put(
  "/make-default/:configId",
  controller.makeDefaultConfigurationsINTERNALV1
);

export default router;