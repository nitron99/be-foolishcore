import { Request, Response } from "express"; 
import { StatusCodes } from "http-status-codes";

import { Articles } from "../models/Articles.model";
import { Configurations } from "../models/Configurations.model";

export class DashboardController {
  // ============ Articles ============
  // AUTHOR
  getArticlesV1 = async (req: Request, res: Response) => {
    console.log("get all authors articles v1 :: Dashboard Controller");

    const page = req.query.page ? parseInt(req.query.page + "") : 0;
    const limit = req.query.limit ? parseInt(req.query.limit + "") : 10;

    try {
      //@ts-ignore
      const authorId = req.locals.UserId || null;

      await Articles
        .find({ Author: authorId })
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
        });
    } catch (error) {
      console.log("Error while get all article", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    }
  };

  // AUTHOR
  getArticleV1 = async (req: Request, res: Response) => {
    console.log("get author article v1 :: Dashboard Controller");
    try {
      const articleId = req.params.id || "";
      //@ts-ignore
      const authorId = req.locals.UserId || null;
      
      await Articles
        .findOne({ Author: authorId, _id: articleId })
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
        });
    } catch (error) {
      console.log("Error while get article");
      console.log(error);
    }
  };

  // AUTHOR
  createArticleV1 = async (req: Request, res: Response) => {
    console.log("Create author article v2 :: Dashboard Controller");
    try {
      const requestObj = req.body || null;
      
      //@ts-ignore
      const authorId = req.locals.UserId || null;

      //@ts-ignore
      console.log("req.locals", req.locals)
        
      //@ts-ignore
      console.log(req.locals.UserId || "");

      if("Title" in requestObj && 
        "Blocks" in requestObj){

          let newArticleStatus = "";

          if("Status" in requestObj &&
              requestObj.Status === "Draft"){
            newArticleStatus = "Draft";
          } else {
            // check configurations
            await Configurations
              .findOne({ IsDefault: true })
              .then((response) => {
                if(response.ReviewArticles === true){
                  newArticleStatus = "Review"
                } else {
                  newArticleStatus = "Published";
                }
              })
          }

          const newArticle = {
            Title: requestObj.Title,
            // Slug: requestObj.Title,
            Blocks: requestObj.Blocks,
            Author: authorId,
            Tags: requestObj.Tags,
            Status: newArticleStatus
          }

          await Articles
            .create(newArticle)
            .then((response) => {
              console.log(response);
              res.status(StatusCodes.CREATED).json({ 
                message: "Article created successfully!",
              });
            })
            .catch((err) => {
              console.log("Error while creating new Article");
              console.log(err)
              throw new Error("ART_CREATE_2")
            });
      } else {
        console.log("Invalid payload");
        throw new Error("ART_CREATE_1");
      }
    } catch (error) {
      console.log("Error while create article");
      console.log(error);
    }
  };

  // AUTHOR
  updateArticleV1 = async (req: Request, res: Response) => {
    console.log("UpdateArticle :: Articles Controller");
    try {
      const articleId = req.params.userId || "";
      
      



    } catch (error) {
      console.log("Error while get article");
      console.log(error);
    }
  };

  // AUTHOR
  deleteArticleV1 = async (req: Request, res: Response) => {
    console.log("DeleteArticle :: Articles Controller");
    try {
      const articleId = req.params.userId || "";
      
      



    } catch (error) {
      console.log("Error while get article");
      console.log(error);
    }
  };

  // ============ Articles ============

};