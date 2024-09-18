require("dotenv").config();
import { createServer } from "./server";
import { connect } from "mongoose";


function startServer(){
  /** Create EXPRESS Server */ 
  const app = createServer();
  const port = process.env.NODE_PORT || 8000;
  const RoutePrefix = process.env.ROUTE_PREFIX || "/";

  /** DB Connection */
  connect(
    process.env.DB_URL, 
    { dbName: process.env.DB_NAME })
    .then(() => {
      console.log('Connected to DB!!');
    })
    .catch((err) => console.log('Error while connecting DB - ', err))

  // Start server
  app.listen(port, () => {
    console.log(
      `SERVER: Server is running at http://localhost:${port}${RoutePrefix}`
    );
  });

}

startServer();


// CONTROLLER LABELS
// 1. INTERNAL - internal route
// 2. AUTHOR - intented for authors (a logged in user)
// 3. GENERAL - non-tokenized for all normal users and authors
// 4. HELPER - helper API