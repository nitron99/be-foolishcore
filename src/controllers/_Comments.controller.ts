import { Request, Response } from "express"; 
import { StatusCodes } from "http-status-codes";

import { Comments } from "../models/Comments.model";
import { Articles } from "../models/Articles.model";
import { CommentLikes } from "../models/Comment-Likes.model";

export class CommentsController {
  getTotalCommentsV1 = async (req: Request, res: Response) => {
    console.log("get total comments v1 :: Comments Controller");

    try{
      const articleId = req.params.articleId || "";

      await Comments
        .find({ ArticleId: articleId })
        .countDocuments()
        .then((response) => {
          console.log("response total " , response)
          if(response+""){
            res.status(StatusCodes.OK).json({
              message: "Total article comments fetched successfully!",
              data: [response]
            });
          } else {
            throw new Error("Error getting total comments")
          }
        })
        .catch((err) => {
          console.log("Error while fetch total article comments", err);
          throw new Error("ART_CMT_GET_1");
        });
    } catch (error) {
      console.log("Error while get total article comments", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    }
  };

  getCommentsV1 = async (req: Request, res: Response) => {
    console.log("get comments v1 :: Comments Controller");

    const page = req.query.page ? parseInt(req.query.page + "") : 0;
    const limit = req.query.limit ? parseInt(req.query.limit + "") : 10;

    try {
      const articleId = req.params.articleId || null;

      // console.log(articleId)

      await Comments
        .find({ ArticleId: articleId })
        .sort({ createdAt: "desc" })
        .populate("UserId", "Name DP _id Email")
        .limit(limit)
        .skip(page)
        .then(async (response) => {
          // console.log(response)
          const filteredData = await Promise.all(response
            .map(async (responseObj) => {

              // total likes
              let totalLikes = await CommentLikes
                .find({ CommentId: responseObj._id+"" })
                .countDocuments();

              // i have liked?
              let likedByMe = []
              //@ts-ignore
              if ("locals" in req && "UserId" in req.locals){
                //@ts-ignore
                likedByMe = await CommentLikes
                  .find({ CommentId: responseObj._id+"", UserId: req.locals.UserId })

              };

              console.log("likedByMe", likedByMe)

              return {
                Id: responseObj._id,
                Text: responseObj.Text,
                ArticleId: responseObj.ArticleId, 
                User: { 
                  Id: responseObj.UserId["_id"],
                  DP: responseObj.UserId["DP"],
                  Name: responseObj.UserId["Name"],
                  Email: responseObj.UserId["Email"],
                }, 
                Likes: totalLikes,
                LikedByMe: likedByMe.length === 0 ? false : true,  
                Replies: responseObj.Replies,
                createdAt: responseObj.createdAt,
                updatedAt: responseObj.updatedAt
              }
            }));

          const total = await Comments
            .find({ 
              ArticleId: articleId,
              Level: 0
            })
            .countDocuments();  

          res.status(StatusCodes.OK).json({
            message: "Comments fetched successfully!",
            data: [page, limit, total, filteredData]
          }); 

        })
        .catch((err) => {
          console.log("Error while fetch users", err);
          throw new Error("USERS_GET_ALL_1");
        });
    } catch (error){
      console.log("Error while get Comments", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    }
  };

  createCommentV1 = async (req: Request, res: Response) => {
    console.log("create comment v1 :: Comments Controller");

    try {
      const requestObj = req.body || null;
      const articleId = req.params.articleId || null;

      //@ts-ignore
      const commenterId = req.locals.UserId || null;

      if("Comment" in requestObj && 
        articleId){
        // check if the article is valid or invalid
        await Articles
          .findById(articleId)
          .then(async (response) => {
              const newComment = {
                Text: requestObj.Comment,
                ArticleId: articleId,
                UserId: commenterId,
                Level: 0
              };
      
              await Comments
                .create(newComment)
                .then((response) => {
                  console.log(response);
                  res.status(StatusCodes.CREATED).json({ 
                      message: "Comment created successfully!",
                    });
                })
                .catch((err) => {
                  console.log("Error while creating new Comment");
                  console.log(err)
                  throw new Error("CMT_CREATE_3");
                });
          })
          .catch((err) => {
            console.log("Error while creating new Comment");
            console.log(err)
            throw new Error("CMT_CREATE_2");
          });
      }else{
        console.log("Invalid payload");
        throw new Error("CMT_CREATE_1");
      }
    } catch (error) {
      console.log("Error while creating Comments", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    }
  };

  updateCommentV1 = async (req: Request, res: Response) => {
    console.log("update comment v1 :: Comments Controller");
    
    try {
      const requestObj = req.body || null;
      const commentId = req.params.commentId || null;

      if("Comment" in requestObj && 
        commentId){
        await Comments
          .findByIdAndUpdate(commentId, { Text: requestObj.Comment })
          .then(async (response) => {
            res.status(StatusCodes.ACCEPTED).json({ 
              message: "Comment updated successfully!",
            });
          })
          .catch((err) => {
            console.log("Error while updating Comment");
            console.log(err)
            throw new Error("CMT_UPDATE_2");
          });
      }else{
        console.log("Invalid payload");
        throw new Error("CMT_UPDATE_1");
      }
    } catch (error) {
      console.log("Error while updating Comments", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    }
  };

  deleteCommentV1 = async (req: Request, res: Response) => {
    console.log("delete comment v1 :: Comments Controller");
    
    try {
      const commentId = req.params.commentId || null;

      if(commentId){
        await Comments
          .findByIdAndDelete(commentId)
          .then(async (response) => {
            res.status(StatusCodes.ACCEPTED).json({ 
              message: "Comment deleted successfully!",
            });
          })
          .catch((err) => {
            console.log("Error while deleted Comment");
            console.log(err)
            throw new Error("CMT_DELETE_2");
          });
      }else{
        console.log("Invalid payload");
        throw new Error("CMT_DELETE_1");
      }
    } catch (error) {
      console.log("Error while deleting Comments", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    }
  };
  
  getRepliesV1 = async (req: Request, res: Response) => {
    console.log("get replies v1 :: Comments Controller");

    try {
      const userId = req.params.userId || "";

      // if(userId){
      //   // await Users
      //   //   .findById(userId)
      //   //   .select('-Password')
      //   //   .then((response) => {
      //   //     console.log(response)
      //   //     if(response) {

      //   //       const filteredData = {
      //   //         Id: response._id,
      //   //         Name: response.Name,
      //   //         Email: response.Email,
      //   //         DP: response. DP,
      //   //         Status: response.Status,
      //   //         createdAt: response.createdAt,
      //   //         updatedAt: response.updatedAt
      //   //       }

      //   //       res.status(StatusCodes.OK).json({
      //   //         message: "User fetched successfully!",
      //   //         data: [filteredData]
      //   //       }); 
      //   //     }else{
      //   //       console.log("User not found");
      //   //       throw new Error("USERS_GET_2");
      //   //     }
      //   //   })
      //   //   .catch((err) => {
      //   //     console.log("Error while get users", err);
      //   //     res.status(StatusCodes.BAD_REQUEST).json({
      //   //       message: "Something went wrong!"
      //   //     });
      //   //   });
      // }else{
      //   console.log("No user id found");
      //   throw new Error("USERS_GET_1");
      // }
    } catch (error) {
      console.log("Error while get users", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    }
  };
}