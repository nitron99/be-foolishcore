import { Schema, model } from "mongoose";


// ************** SCHEMA ****************
const commentSchema = new Schema({
  Text: {
    type: String, 
    required: true
  },
  ArticleId: {
    type: String, 
    required: true,
    ref: "Articles"
  },
  UserId: {
    type: String, 
    required: true,
    ref: "Users"
  },
  Level: {
    type: Number, 
    required: true,
  },
  ParentId: {
    type: String,
  },
  Likes: {
    type: [String],
    default: []
  },
  Replies: {
    type: Number, 
    default: 0
  }
},
{ timestamps: true });


// *************** MODEL *****************
export const Comments = model("Comments", commentSchema);