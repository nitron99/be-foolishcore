import { Schema, model } from "mongoose";


// ************** SCHEMA ****************
const supportTicketCategoriesSchema = new Schema({
  Title: {
    type: String, 
    required: true,
  },
  Status: {
    type: Boolean, 
    required: true
  },
},
{ timestamps: true });


// *************** MODEL *****************
export const SupportTicketCategories = model("SupportTicketCategories", supportTicketCategoriesSchema);