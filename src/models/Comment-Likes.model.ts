import { Schema, model } from "mongoose";

// ************** SCHEMA ****************
const commentLikesSchema = new Schema({
  CommentId: {
    type: String, 
    required: true,
    ref: "Comments"
  },
  UserId: {
    type: String, 
    required: true,
    ref: "Users"
  }
},
{ timestamps: true });


// *************** MODEL *****************
export const CommentLikes = model("CommentLikes", commentLikesSchema);