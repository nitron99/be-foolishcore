import { Schema, model } from "mongoose";


//INTERNAL USER ROLES
// 1. Admin (only one acc.)
// 2. Moderator (can be many acc.)

// ************** SCHEMA ****************
const internalUserSchema = new Schema({
  Email: {
    type: String, 
    required: true
  },
  Password: {
    type: String, 
    required: true
  },
},
{ timestamps: true });


// *************** MODEL *****************
export const InternalUsers = model("InternalUsers", internalUserSchema);