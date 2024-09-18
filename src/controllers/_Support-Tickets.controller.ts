import { Request, Response } from "express"; 
import { StatusCodes } from "http-status-codes";

import { SupportTickets } from "../models/Support-Tickets.model";
import { SupportTicketCategories } from "../models/Support-Ticket-Categories.model";

export class SupportTicketsController {
  // --------------- Support Tickets ---------------
  getSupportTicketsV1 = async (req: Request, res: Response) => {
    console.log("get support tickets v1 :: Support Tickets Controller");

    const page = req.query.page ? parseInt(req.query.page + "") : 0;
    const limit = req.query.limit ? parseInt(req.query.limit + "") : 10;

    try {
      //@ts-ignore
      const userId = req.locals.UserId || null;
      
      await SupportTickets
        .find({ RaisedBy: userId })
        .sort({ updatedAt: "desc" })
        .populate("Category", "Title")
        .limit(limit)
        .skip(page)
        .then(async (response) => {
          const filteredData = response.map((supportTicket) => {
            return {
              Id: supportTicket._id,
              Description: supportTicket.Description,
              Status: supportTicket.Status,
              Category: {
                Title: supportTicket.Category["Title"],
              },
              createdAt: supportTicket.createdAt,
              updatedAt: supportTicket.updatedAt
            }
          });

          const total = await SupportTickets
            .find({ RaisedBy: userId })
            .countDocuments();

          res.status(StatusCodes.OK).json({
            message: "Support tickets fetched successfully!",
            data: [page, limit, total, filteredData]
          });
        })
        .catch((err) => {
          console.log("Error while fetch supporting tickets", err);
          throw new Error("SPT_TICKET_GET_1");
        });
    } catch (error) {
      console.log("Error while fetching supporting tickets", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    };
  };

  createSupportTicketV1 = async (req: Request, res: Response) => {
    console.log("create support tickets v1 :: Support Tickets Controller");

    try {
      const requestObj = req.body || null;
      //@ts-ignore
      const userId = req.locals.UserId || null;

      if("Description" in requestObj && 
        "Category" in requestObj &&
        userId){

        const newSupportTicket = {
          Description: requestObj.Description,
          Category: requestObj.Category,
          RaisedBy: userId,
          Status: "Open"
        };

        await SupportTickets
          .create(newSupportTicket)
          .then((response) => {
            res.status(StatusCodes.ACCEPTED).json({ 
              message: "Support ticket created successfully!",
            });
          })
          .catch((err) => {
            console.log("Error while creating support ticket");
            console.log(err)
            throw new Error("SPT_TICKET_CREATE_2");
          });
      } else {
        console.log("Invalid payload");
        throw new Error("SPT_TICKET_CREATE_1");
      }
    } catch (error) {
      console.log("Error while creating supporting tickets", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    };
  };

  updateSupportTicketV1 = async (req: Request, res: Response) => {
    // allow edit support ticket desc before closed
    console.log("updating support tickets v1 :: Support Tickets Controller");

    try {
      const requestObj = req.body || null;
      //@ts-ignore
      const userId = req.locals.UserId || null;
      const ticketId = req.params.ticketId || null;

      if("Description" in requestObj && 
          ticketId){

        await SupportTickets
          .findOne({ RaisedBy: userId, _id: ticketId })
          .then(async (response) => {
            if(response.Status === "Open"){

              await SupportTickets
                .findByIdAndUpdate(ticketId, { Description: requestObj.Description })
                .then((response) => {
                  res.status(StatusCodes.ACCEPTED).json({
                    message: "Support ticket updated successfully!"
                  });
                })
                .catch((err) => {
                  res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Error while updating support ticket"
                  });
                });
            } else {
              res.status(StatusCodes.BAD_REQUEST).json({
                message: "Can't update closed ticket"
              });
            }
          })
          .catch((err) => {
            console.log("Error while updating support ticket");
            throw new Error("SPT_TICKET_UPDATE_2");
          });
      } else {
        console.log("Invalid payload");
        throw new Error("SPT_TICKET_UPDATE_1");
      }
    } catch (error) {
      console.log("Error while updating supporting tickets", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    };
  };

  // INTERNAL
  getSupportTicketsINTERNALV1 = async (req: Request, res: Response) => {
    console.log("get support tickets internal v1 :: Support Tickets Controller");

    const page = req.query.page ? parseInt(req.query.page + "") : 0;
    const limit = req.query.limit ? parseInt(req.query.limit + "") : 10;

    try {
      const status = req.query.status || "";

      await SupportTickets
        .find({ Status: status.toString() })
        .populate("Category", "Title")
        .populate("RaisedBy", "Name DP _id Email")
        .limit(limit)
        .skip(page)
        .sort({ updatedAt: "desc" })
        .then(async (response) => {
          const filteredData = response.map((supportTicket) => {
            return {
              Id: supportTicket._id,
              Description: supportTicket.Description,
              Status: supportTicket.Status,
              Category: {
                Title: supportTicket.Category["Title"],
              },
              RaisedBy: {
                Id: supportTicket.RaisedBy["_id"],
                Name: supportTicket.RaisedBy["Name"],
                DP: supportTicket.RaisedBy["DP"],
                Email: supportTicket.RaisedBy["Email"]
              },
              createdAt: supportTicket.createdAt,
              updatedAt: supportTicket.updatedAt
            }
          });

          const total = await SupportTickets
            .find({ Status: status.toString() })
            .countDocuments();

          res.status(StatusCodes.OK).json({
            message: "Support tickets fetched successfully!",
            data: [page, limit, total, filteredData]
          });
        })
        .catch((err) => {
          console.log("Error while fetch supporting tickets internal", err);
          throw new Error("SPT_TICKET_GET_INT_1");
        });
    } catch (error) {
      console.log("Error while fetching supporting tickets internal", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    };
  };

  // INTERNAL
  updateSupportTicketINTERNALV1 = async (req: Request, res: Response) => {
    console.log("updating support tickets internal v1 :: Support Tickets Controller");

    try {
      const requestObj = req.body || null;
      const ticketId = req.params.ticketId || null;

      if("Status" in requestObj &&
        (requestObj.Status === "Open" || requestObj.Status === "Closed") &&
        ticketId){

        await SupportTickets
          .findByIdAndUpdate(ticketId, { Status: requestObj.Status })
          .then((response) => {
            res.status(StatusCodes.ACCEPTED).json({
              message: "Support ticket updated successfully!"
            });
          })
          .catch((err) => {
            res.status(StatusCodes.BAD_REQUEST).json({
              message: "Error while updating support ticket internal"
            });
          });
      } else {
        console.log("Invalid payload");
        throw new Error("SPT_TICKET_UPDATE_INT_1");
      }
    } catch (error) {
      console.log("Error while updating supporting tickets internal", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    };
  };

  // INTERNAL
  deleteSupportTicketINTERNALV1 = async (req: Request, res: Response) => {
    console.log("deleting support tickets internal v1 :: Support Tickets Controller");

    try {
      const ticketId = req.params.ticketId || null;

      if(ticketId){
        await SupportTickets
          .findByIdAndDelete(ticketId)
          .then((response) => {
            res.status(StatusCodes.ACCEPTED).json({
              message: "Support ticket deleted successfully!"
            });
          })
          .catch((err) => {
            res.status(StatusCodes.BAD_REQUEST).json({
              message: "Error while deleted support ticket internal"
            });
          });
      } else {
        console.log("Invalid ticket id");
        throw new Error("SPT_TICKET_DELETE_INT_1");
      }
    } catch (error) {
      console.log("Error while deleting supporting tickets internal", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    };
  };

  // --------------- Support Ticket Categories -----
  getSupportTicketCategoriesV1 = async (req: Request, res: Response) => {
    console.log("get support ticket categories v1 :: Support Tickets Controller");

    try {
      await SupportTicketCategories
        .find()
        .select("-Status")
        .then((response) => {
          const filteredData = response.map((supportTicket) => {
            return {
              Id: supportTicket._id,
              Title: supportTicket.Title
            }
          });

          res.status(StatusCodes.OK).json({
            message: "Support ticket categories fetched successfully!",
            data: [filteredData]
          });
        })
        .catch((err) => {
          console.log("Error while fetch supporting ticket catgories", err);
          throw new Error("SPT_TICKET_CATEGORIES_GET_1");
        });
    } catch (error) {
      console.log("Error while fetching supporting ticket categories", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    };
  };

  // INTERNAL
  getSupportTicketCategoriesINTERNALV1 = async (req: Request, res: Response) => {
    console.log("get support ticket categories internal v1 :: Support Tickets Controller");

    try {
      await SupportTicketCategories
        .find()
        .then((response) => {
          const filteredData = response.map((supportTicketCategory) => {
            return {
              Id: supportTicketCategory._id,
              Title: supportTicketCategory.Title,
              Status: supportTicketCategory.Status,
              createdAt: supportTicketCategory.createdAt,
              updatedAt: supportTicketCategory.updatedAt
            };
          });

          res.status(StatusCodes.OK).json({
            message: "Support ticket categories fetched successfully!",
            data: [filteredData]
          });
        })
        .catch((err) => {
          console.log("Error while fetch supporting ticket catgories internal", err);
          throw new Error("SPT_TICKET_CATEGORIES_GET_1");
        });
    } catch (error) {
      console.log("Error while fetching supporting ticket categories internal", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    };
  };

  // INTERNAL
  createSupportTicketCategoryINTERNALV1 = async (req: Request, res: Response) => {
    console.log("creating support ticket categories internal v1 :: Support Tickets Controller");

    try {
      const requestObj = req.body || null;

      if("Title" in requestObj){

        let newSupportTicketCategory = {
          Title: requestObj.Title,
          Status: false
        };

        await SupportTicketCategories
          .create(newSupportTicketCategory)
          .then((response) => {
            res.status(StatusCodes.CREATED).json({ 
                message: "Support ticket category created successfully!",
              });
          })
          .catch((err) => {
            console.log("Error while creating supporting ticket catgories internal", err);
            throw new Error("SPT_TICKET_CATEGORIES_CREATE_INT_2");
          });
      } else  {
        console.log("Invalid payload");
        throw new Error("SPT_TICKET_CATEGORIES_CREATE_INT_1");
      }
    } catch (error) {
      console.log("Error while creating supporting ticket categories internal", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    };
  };

  // INTERNAL
  updateSupportTicketCategoryINTERNALV1 = async (req: Request, res: Response) => {
    console.log("updating support ticket categories internal v1 :: Support Tickets Controller");

    try {
      const requestObj = req.body || null;
      const ticketId = req.params.ticketId || null;

      if(("Title" in requestObj ||
        "Status" in requestObj) && 
        ticketId){

        let updatedSupportTicketCategory = {
          Title: requestObj.Title,
          Status: requestObj.Status
        }

        await SupportTicketCategories
          .findByIdAndUpdate(ticketId, updatedSupportTicketCategory)
          .then((response) => {
            res.status(StatusCodes.ACCEPTED).json({ 
              message: "Support ticket category updated successfully!",
            });
          })
          .catch((err) => {
            console.log("Error while updating supporting ticket catgories internal", err);
            throw new Error("SPT_TICKET_CATEGORIES_UPDATE_INT_2");
          });
      } else  {
        console.log("Invalid payload");
        throw new Error("SPT_TICKET_CATEGORIES_UPDATE_INT_1");
      }
    } catch (error) {
      console.log("Error while updating supporting ticket categories internal", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    };
  };

  // INTENRAL
  deleteSupportTicketCategoryINTERNALV1 = async (req: Request, res: Response) => {
    console.log("deleting support ticket categories internal v1 :: Support Tickets Controller");

    try {
      const ticketId = req.params.ticketId || null;

      if(ticketId){
        await SupportTicketCategories
          .findByIdAndDelete(ticketId)
          .then((response) => {
            res.status(StatusCodes.ACCEPTED).json({ 
              message: "Support ticket category deleted successfully!",
            });
          })
          .catch((err) => {
            console.log("Error while deleting supporting ticket catgories internal", err);
            throw new Error("SPT_TICKET_CATEGORIES_DELETE_INT_2");
          });
      } else {
        console.log("Invalid ticket id");
        throw new Error("SPT_TICKET_CATEGORIES_DELETE_INT_1");
      }
    } catch (error) {
      console.log("Error while deleting supporting ticket categories internal", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    };
  };
}