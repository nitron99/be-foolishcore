import { Schema, model } from "mongoose";


// ************** SCHEMA ****************
const tagsSchema = new Schema({
  Title: {
    type: String, 
    required: true, 
    unique: true
  },
  Color: {
    type: String,  
    unique: true
  },
  Status: {
    type: Boolean, 
    required: true,
    default: true
  }
},
{ timestamps: true });


// *************** MODEL *****************
export const Tags = model("Tags", tagsSchema);