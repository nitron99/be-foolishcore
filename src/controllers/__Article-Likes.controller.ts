import { Request, Response } from "express"; 
import { StatusCodes } from "http-status-codes";

import { ArticleLikes } from "../models/Article-Likes.model";

export class ArticleLikesController {
  getTotalArticleLikesV1 = async (req: Request, res: Response) => {
    console.log("get total article likes v1 :: Article Likes Controller");

    try{
      const articleId = req.params.articleId || "";

      await ArticleLikes
        .find({ ArticleId: articleId })
        .countDocuments()
        .then((response) => {
          console.log("response total " , response)
          if(response+""){
            res.status(StatusCodes.OK).json({
              message: "Total article likes fetched successfully!",
              data: [response]
            });
          } else {
            throw new Error("Error getting total likes")
          }
        })
        .catch((err) => {
          console.log("Error while fetch total article like", err);
          throw new Error("ART_LIKE_GET_1");
        });
    } catch (error) {
      console.log("Error while get total article like", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    }
  };

  getArticleLikedV1 = async (req: Request, res: Response) => {
    console.log("get article liked v1 :: Article Likes Controller");

    try{
      const articleId = req.params.articleId || "";

      //@ts-ignore
      const userId = req.locals.UserId || null;

      await ArticleLikes
        .find({ ArticleId: articleId, UserId: userId })
        .then((response) => {
          if(response && response.length > 0){
            res.status(StatusCodes.OK).json({
              message: "Article liked fetched successfully!",
              data: [true]
            });
          } else {
            res.status(StatusCodes.OK).json({
              message: "Article liked fetched successfully!",
              data: [false]
            });
          }
        })
        .catch((err) => {
          console.log("Error while fetch article like", err);
          throw new Error("ART_LIKE_GET_1");
        });
    } catch (error) {
      console.log("Error while get article like", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    }
  };

  likeArticleV1 = async (req: Request, res: Response) => {
    console.log("likeArticle v1 :: Article Likes Controller");

    try{
      const articleId = req.params.articleId || null;

      //@ts-ignore
      const likerId = req.locals.UserId || null;

      const newArticleLike = {
        ArticleId: articleId,
        UserId: likerId
      };

      const alreadyLiked = await ArticleLikes
        .find({ ArticleId: articleId, UserId: likerId});

      console.log(alreadyLiked)


      if(alreadyLiked.length > 0){
        await ArticleLikes
          .deleteMany({ ArticleId: articleId, UserId: likerId })
          .then((response) => {

            if(response){
              res.status(StatusCodes.CREATED).json({
                message: "Article unliked successfully!",
                data: [response]
              });
            } else {
              throw new Error("Error getting total likes")
            }
          })
          .catch((err) => {
            console.log("Error while fetch all article", err);
            throw new Error("ART_LIKE_POST_2");
          });
      } else {
        await ArticleLikes
        .create(newArticleLike)
        .then((response) => {
          console.log("" , response)
          if(response){
            res.status(StatusCodes.CREATED).json({
              message: "Article liked successfully!",
              data: [response]
            });
          } else {
            throw new Error("Error getting total likes")
          }
        })
        .catch((err) => {
          console.log("Error while fetch all article", err);
          throw new Error("ART_LIKE_POST_3");
        });
      }
    } catch (error) {
      console.log("Error while liking article", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    }
  };  
};
