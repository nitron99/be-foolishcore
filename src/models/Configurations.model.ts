import { Schema, model } from "mongoose";


// ************** SCHEMA ****************
const configurationSchema = new Schema({
  Name: {
    type: Number,
    required: true
  },
  ReviewArticles: {
    type: Boolean, 
    required: true
  },
  IsDefault: {
    type: Boolean, 
    required: true
  }
},
{ timestamps: true });


// *************** MODEL *****************
export const Configurations = model("Configurations", configurationSchema);