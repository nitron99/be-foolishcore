import { Router } from "express";
import { SupportTicketsController } from "../../../controllers/_Support-Tickets.controller";
import { Tokenizer } from "../../../submodules/middlewares/tokenizer";

const router = Router();
const tokenizer = new Tokenizer()
const controller = new SupportTicketsController();

router.get(
  "/",
  tokenizer.parseAuthToken,
  controller.getSupportTicketsV1
);

router.get(
  "/categories",
  tokenizer.parseAuthToken,
  controller.getSupportTicketCategoriesV1
);

router.post(
  "/",
  tokenizer.parseAuthToken,
  controller.createSupportTicketV1
);

router.put(
  "/:ticketId",
  tokenizer.parseAuthToken,
  controller.updateSupportTicketV1
);

export default router;