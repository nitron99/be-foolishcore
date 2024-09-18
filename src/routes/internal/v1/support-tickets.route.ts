import { Router } from "express";
import { SupportTicketsController } from "../../../controllers/_Support-Tickets.controller";
import { Tokenizer } from "../../../submodules/middlewares/tokenizer";

const router = Router();
const tokenizer = new Tokenizer()
const controller = new SupportTicketsController();

router.get(
  "/categories/",
  controller.getSupportTicketCategoriesINTERNALV1
);

router.post(
  "/categories/",
  controller.createSupportTicketCategoryINTERNALV1
);

router.put(
  "/categories/:ticketId",
  controller.updateSupportTicketCategoryINTERNALV1
);

router.delete(
  "/categories/:ticketId",
  controller.deleteSupportTicketCategoryINTERNALV1
);

router.get(
  "/",
  controller.getSupportTicketsINTERNALV1
);

router.put(
  "/:ticketId",
  controller.updateSupportTicketINTERNALV1
);

router.delete(
  "/:ticketId",
  controller.deleteSupportTicketINTERNALV1
);


export default router;