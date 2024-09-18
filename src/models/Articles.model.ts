import { Schema, model, plugin } from "mongoose";
// import slug from "mongoose-slug-generator";

// plugin(slug);

// ************** SCHEMA ****************
const articleSchema = new Schema({
  Title: {
    type: String, 
    required: true
  },
  // Slug: {
  //   type: String, 
  //   slug: "Title",
  //   slug_padding_size: 4,  
  //   unique: true 
  // },
  Author: {
    type: String, 
    required: true,
    ref: "Users"
  },
  Tags: [{
    type: String, 
    required: false,
    ref: "Tags"
  }],
  Blocks: {
    type: Object,
    required: true
  },
  Status: {
    type: String, 
    required: true
  }
},
{ timestamps: true });


// Status 
// 1. Draft
// 2. Review
// 3. Published
// 4. Private
// 5. Blocked


// *************** config *****************
// articleSchema.pre("save", function(next) {
//   this.Slug = this.Title.split(" ").join("-");
//   next();
// });


// *************** MODEL *****************
export const Articles = model("Articles", articleSchema);