import { Request, Response } from "express"; 
import { StatusCodes } from "http-status-codes";

import { Articles } from "../models/Articles.model";

export class ContentsController {
  // GENERAL
  getArticlesV1 = async (req: Request, res: Response) => {
    console.log("get all articles v1 :: Contents Controller");

    const page = req.query.page ? parseInt(req.query.page + "") : 0;
    const limit = req.query.limit ? parseInt(req.query.limit + "") : 10;

    try {
      await Articles
        .find()
        .select("-Blocks -Status")
        .populate("Author", "Name DP _id Email")
        .populate("Tags", "Title Color")
        .limit(limit)
        .skip(page)
        .sort("-createdAt")
        .then(async (response) => {
          const filteredData = response
          .map((responseObj) => {
            return {
              Id: responseObj._id,
              Title: responseObj.Title,
              Tags: responseObj.Tags,
              Author: {
                Id: responseObj.Author["_id"],
                Name: responseObj.Author["Name"],
                DP: responseObj.Author["DP"],
                Email: responseObj.Author["Email"]
              },
              createdAt: responseObj.createdAt,
              updatedAt: responseObj.updatedAt
              // Blocks: responseObj.Blocks
            }
          });
        
          const total = await Articles.countDocuments();

          res.status(StatusCodes.OK).json({
            message: "Articles fetched successfully!",
            data: [page, limit, total, filteredData]
          });
        })
        .catch((err) => {
          console.log("Error while fetch all articles", err);
          throw new Error("ART_GET_ALL_1");
        });
    } catch (error) {
      console.log("Error while get all article", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    }
  };

  // GENERAL
  getArticleV1 = async (req: Request, res: Response) => {
    console.log("get article v1 :: Contents Controller");
    try {
      const articleId = req.params.id || "";
      
      await Articles
        .findById(articleId)
        .populate("Author", "Name DP _id Email")
        .then((response) => {
          const filteredData = {
            Id: response._id,
            Title: response.Title,
            Blocks: response.Blocks,
            Author: {
              Id: response.Author["_id"],
              Name: response.Author["Name"],
              DP: response.Author["DP"],
              Email: response.Author["Email"]
            },
            createdAt: response.createdAt,
            updatedAt: response.updatedAt
          }

          res.status(200).json({
            message: "Article fetched successfully!",
            data: [filteredData]
          })  
        })
        .catch((err) => {
          console.log("Error while fetch all article", err);
          throw new Error("ART_GET_1");
        });
    } catch (error) {
      console.log("Error while get article");
      console.log(error);
    }
  };

};