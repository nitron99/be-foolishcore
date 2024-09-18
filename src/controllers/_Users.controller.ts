import { Request, Response } from "express"; 
import { StatusCodes } from "http-status-codes";

import { Users } from "../models/Users.model";

export class UsersController {
  // INTERNAL
  getUsersINTERNALV1 = async (req: Request, res: Response) => {
    console.log("get users v1 :: Users Controller");

    const page = req.query.page ? parseInt(req.query.page + "") : 0;
    const limit = req.query.limit ? parseInt(req.query.limit + "") : 10;

    try {
      await Users
        .find()
        .select('-Password')
        .limit(limit)
        .skip(page)
        .then(async (response) => {
          const filteredData = response
            .map((responseObj) => {
              return {
                Id: responseObj._id,
                Name: responseObj.Name,
                Email: responseObj.Email, 
                DP: responseObj.DP, 
                Status: responseObj.Status,
                createdAt: responseObj.createdAt,
                updatedAt: responseObj.updatedAt
              }
            });

          const total = await Users.countDocuments();  

          res.status(StatusCodes.OK).json({
            message: "Users fetched successfully!",
            data: [page, limit, total, filteredData]
          }); 

        })
        .catch((err) => {
          console.log("Error while fetch users", err);
          throw new Error("USERS_GET_ALL_1");
        });
    } catch (error){
      console.log("Error while get users", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    }
  };

  // INTERNAL
  getUserINTERNALV1 = async (req: Request, res: Response) => {
    console.log("get user v1 :: Users Controller");

    try {
      const userId = req.params.userId || "";

      if(userId){
        await Users
          .findById(userId)
          .select('-Password')
          .then((response) => {
            console.log(response)
            if(response) {

              const filteredData = {
                Id: response._id,
                Name: response.Name,
                Email: response.Email,
                DP: response. DP,
                Status: response.Status,
                createdAt: response.createdAt,
                updatedAt: response.updatedAt
              }

              res.status(StatusCodes.OK).json({
                message: "User fetched successfully!",
                data: [filteredData]
              }); 
            }else{
              console.log("User not found");
              throw new Error("USERS_GET_2");
            }
          })
          .catch((err) => {
            console.log("Error while get users", err);
            res.status(StatusCodes.BAD_REQUEST).json({
              message: "Something went wrong!"
            });
          });
      }else{
        console.log("No user id found");
        throw new Error("USERS_GET_1");
      }
    } catch (error) {
      console.log("Error while get users", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    }
  };

  // INTERNAL 
  // delete users- no need to delete we can just suspend accounts

  // INTERNAL
  toggleUserINTERNALV1 = async (req: Request, res: Response) => {
    console.log("toggle user v1 :: Users Controller");

    try {
      const userId = req.params.userId || "";

      if(userId){
        await Users
          .findOneAndUpdate({ _id: userId },
            [{$set:{Status:{$eq:[false,"$Status"]}}}])
          .then((response) => {
            console.log(response)
            // if(response) {
              res.status(StatusCodes.ACCEPTED).json({
                message: "User updated successfully!"
              }); 
            // }else{
            //   console.log("User not found");
            //   throw new Error("USERS_GET_4");
            // }
          })
          .catch((err) => {
            console.log("Error while get users", err);
            res.status(StatusCodes.BAD_REQUEST).json({
              message: "Something went wrong!"
            });
          });
      }else{
        console.log("No user id found");
        throw new Error("USERS_GET_3");
      }
    } catch (error) {
      console.log("Error while get users", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    }
  };
}