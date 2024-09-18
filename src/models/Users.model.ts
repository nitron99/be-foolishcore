import { Schema, model } from "mongoose";


// ************** SCHEMA ****************
const userSchema = new Schema({
  Name: {
    type: String, 
    required: true
  },
  Email: {
    type: String, 
    required: true
  },
  Password: {
    type: String, 
    required: true
  },
  DP: String,
  Status: {
    type: Boolean, 
    required: true,
    default: true
  }
},
{ timestamps: true });


// *************** MODEL *****************
export const Users = model("Users", userSchema);