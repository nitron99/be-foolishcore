import { Schema, model } from "mongoose";

// ************** SCHEMA ****************
const articleLikesSchema = new Schema({
  ArticleId: {
    type: String, 
    required: true,
    ref: "Articles"
  },
  UserId: {
    type: String, 
    required: true,
    ref: "Users"
  }
},
{ timestamps: true });


// *************** MODEL *****************
export const ArticleLikes = model("ArticleLikes", articleLikesSchema);