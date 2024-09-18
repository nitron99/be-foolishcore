import { Request, Response } from "express"; 
import { StatusCodes } from "http-status-codes";

import { Articles } from "../models/Articles.model";
import { Configurations } from "../models/Configurations.model";

export class ArticlesController {
  // INTERNAL
  getArticlesINTERNALV1 = async (req: Request, res: Response) => {
    console.log("get articles internal v1 :: Articles Controller");

    const page = req.query.page ? parseInt(req.query.page + "") : 0;
    const limit = req.query.limit ? parseInt(req.query.limit + "") : 10;

    try {
      await Articles
        .find()
        .select('-Blocks')
        .populate("Author", "Name DP _id Email")
        .limit(limit)
        .skip(page)
        .then(async (response) => {
          const filteredData = response.map((article) => {
            return {
              Id: article._id,
              Title: article.Title,
              Tags: article.Tags,
              Status: article.Status,
              Author: {
                Id: article.Author["_id"],
                Name: article.Author["Name"],
                DP: article.Author["DP"],
                Email: article.Author["Email"],
              },
              createdAt: article.createdAt,
              updatedAt: article.updatedAt
            }
          });

          const total = await Articles.countDocuments();

          res.status(StatusCodes.OK).json({
            message: "Articles fetched successfully!",
            data: [page, limit, total, filteredData]
          });
        })
        .catch((err) => {
          console.log("Error while fetch articles internal", err);
          throw new Error("ARTICLES_GET_ALL_INT_1");
        });
    } catch (error) {
      console.log("Error while get articles internal", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    }
  };

  // INTERNAL
  getUsersArticlesINTERNALV1 = async (req: Request, res: Response) => {
    console.log("get users article internal v1 :: Articles Controller");

    const page = req.query.page ? parseInt(req.query.page + "") : 0;
    const limit = req.query.limit ? parseInt(req.query.limit + "") : 10;

    try {
      const userId = req.params.userId || "";

      if(userId){
        await Articles
          .find({ Author: userId })
          .select('-Blocks')
          .populate("Author", "Name DP _id Email")
          .limit(limit)
          .skip(page)
          .then(async (response) => {
            const filteredData = response.map((article) => {
              return {
                Id: article._id,
                Title: article.Title,
                Tags: article.Tags,
                Status: article.Status,
                Author: {
                  Id: article.Author["_id"],
                  Name: article.Author["Name"],
                  DP: article.Author["DP"],
                  Email: article.Author["Email"],
                },
                createdAt: article.createdAt,
                updatedAt: article.updatedAt
              }
            });
  
            const total = await Articles
              .find({ Author: userId })
              .countDocuments();
  
            res.status(StatusCodes.OK).json({
              message: "Users articles fetched successfully!",
              data: [page, limit, total, filteredData]
            });
          })
          .catch((err) => {
            console.log("Error while fetch users articles internal", err);
            throw new Error("ARTICLES_USERS_GET_ALL_INT_1");
          });
      }else{
        console.log("user id not provided");
        throw new Error("ARTICLES_GET_INT_2");
      };
    } catch (error) {
      console.log("Error while get users article internal", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    }

  };

  // INTERNAL
  getArticleINTERNALV1 = async (req: Request, res: Response)  => {
    console.log("get article internal v1 :: Articles Controller");

    try {
      const articleId = req.params.articleId || "";

      if(articleId) {

        await Articles
          .findById(articleId)
          .populate("Author", "Name DP _id Email")
          .then(async (response) => {
            console.log(response);
  
            const filteredData = {
              Id: response._id,
              Title: response.Title,
              Tags: response.Tags,
              Blocks: response.Blocks,
              Status: response.Status,
              Author: {
                Id: response.Author["_id"],
                Name: response.Author["Name"],
                DP: response.Author["DP"],
                Email: response.Author["Email"]
              },
              createdAt: response.createdAt,
              updatedAt: response.updatedAt
            };
  
            res.status(StatusCodes.OK).json({
              message: "Article fetched successfully!",
              data: [filteredData]
            });
          })
          .catch((err) => {
            console.log("Error while fetch article internal", err);
            throw new Error("ARTICLES_GET_INT_2");
          });
      } else {
        console.log("article id not provided");
        throw new Error("ARTICLES_GET_INT_1");
      }
    } catch (error) {
      console.log("Error while get article internal", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    }
  };

  // INTERNAL
  getReviewRequestsArticleINTERNALV1 = async (req: Request, res: Response)  => {
    console.log("get review requests article internal v1 :: Articles Controller");

    const page = req.query.page ? parseInt(req.query.page + "") : 0;
    const limit = req.query.limit ? parseInt(req.query.limit + "") : 10;

    try {
      await Articles
        .find({ Status: "Review" })
        .select('-Blocks')
        .populate("Author", "Name DP _id Email")
        .limit(limit)
        .skip(page)
        .then(async (response) => {
          const filteredData = response.map((article) => {
            return {
              Id: article._id,
              Title: article.Title,
              Tags: article.Tags,
              Status: article.Status,
              Author: {
                Id: article.Author["_id"],
                Name: article.Author["Name"],
                DP: article.Author["DP"],
                Email: article.Author["Email"],
              },
              createdAt: article.createdAt,
              updatedAt: article.updatedAt
            }
          });

          const total = await Articles.find({ Status: "Review" }).countDocuments();

          res.status(StatusCodes.OK).json({
            message: "Articles fetched successfully!",
            data: [page, limit, total, filteredData]
          });
        })
        .catch((err) => {
          console.log("Error while fetch articles internal", err);
          throw new Error("ARTICLES_GET_ALL_INT_2");
        });
    } catch (error) {
      console.log("Error while get articles internal", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    }

  };

  // INTERNAL
  updateReviewRequestArticleINTERNALV1 = async (req: Request, res: Response)  => {
    console.log("update review requests article internal v1 :: Articles Controller");

    try {
      const requestObj = req.body || null;
      const articleId = req.params.articleId || "";

      if(articleId){
        if("Status" in requestObj && 
          ( requestObj.Status === "Rejected" || 
            requestObj.Status === "Published")){
          
          await Articles
            .findByIdAndUpdate(articleId, { Status: requestObj.Status })
            .then(() => {
              res.status(StatusCodes.ACCEPTED).json({ 
                message: "Article updated successfully!",
              });
            })  
            .catch((err) => {
              res.status(StatusCodes.BAD_REQUEST).json({ 
                message: "Error while updating article",
              });
            })
        }else{
          console.log("Invalid request payload found");
          throw new Error("ARTICLE_UPDATE_2");
        }
      } else {
        console.log("No articleId found");
        throw new Error("ARTICLE_UPDATE_1");
      }
    } catch (error) {
      console.log("Error while updating review requests article internal", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    }
  };  

};