import { Request, Response } from "express"; 
import { StatusCodes } from "http-status-codes";

import { CommentLikes } from "../models/Comment-Likes.model";

export class CommentLikesController {
  likeCommentV1 = async (req: Request, res: Response) => {
    console.log("likeComment v1 :: Comment Likes Controller");

    try{
      const commentId = req.params.commentId || null;

      //@ts-ignore
      const likerId = req.locals.UserId || null;

      const newCommentLike = {
        CommentId: commentId,
        UserId: likerId
      };

      const alreadyLiked = await CommentLikes
        .find({ CommentId: commentId, UserId: likerId });

      if(alreadyLiked.length > 0){
        await CommentLikes
          .deleteMany({ CommentId: commentId, UserId: likerId })
          .then((response) => {
            if(response){
              res.status(StatusCodes.CREATED).json({
                message: "Comment unliked successfully!",
                data: [response]
              });
            } else {
              throw new Error("Error getting total likes")
            }
          })
          .catch((err) => {
            console.log("Error while fetch all article", err);
            throw new Error("CMT_LIKE_POST_2");
          });
      } else {
        await CommentLikes
        .create(newCommentLike)
        .then((response) => {
          console.log("" , response)
          if(response){
            res.status(StatusCodes.CREATED).json({
              message: "Comment liked successfully!",
              data: [response]
            });
          } else {
            throw new Error("Error getting total likes")
          }
        })
        .catch((err) => {
          console.log("Error while fetch all article", err);
          throw new Error("CMT_LIKE_POST_3");
        });
      }
    } catch (error) {
      console.log("Error while liking comment", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    }
  };  
};
