import { Schema, model } from "mongoose";


// ************** SCHEMA ****************
const supportTicketsSchema = new Schema({
  Description: {
    type: String, 
    required: true
  },
  Category: {
    type: String, 
    required: true,
    ref: "SupportTicketCategories"
  },
  RaisedBy: {
    type: String, 
    required: true,
    ref: "Users"
  },
  Status: {
    type: String, 
    required: true
  },
},
{ timestamps: true });


// *************** MODEL *****************
export const SupportTickets = model("SupportTickets", supportTicketsSchema);