import { Request, Response } from "express"; 
import { StatusCodes } from "http-status-codes";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { TokenizerService } from "../submodules/services/tokenizer.service";

import { InternalUsers } from "../models/Internal-Users.model";

const tokenizer = new TokenizerService();

export class InternalUsersController{
  // INTERNAL
  loginINTERNALV1 = async (req: Request, res: Response) => {
    console.log("login v1 :: Internal Users Controller");

    try {
      const requestObj = req.body || {};

      if("Email" in requestObj && 
      "Password" in requestObj){
        
        // TODO :: make a field validator to check whether field exists in object and other attributes, 
        //    like is it null, undefined, empty string, or length

        await InternalUsers
          .findOne({ Email: requestObj.Email })
          .then(async (response) => {
            if(response){
              const isPasswordCorrect = await bcrypt.compare(requestObj.Password, response.Password);
              if(isPasswordCorrect){
                const tokenPayload = {
                  Email: response.Email,
                  Id: response._id,
                }
                const internalUserToken = tokenizer.generateInternalToken(JSON.stringify(tokenPayload));
                res.status(StatusCodes.OK)
                  .json({ 
                    message: "Internal User logged In successfully!",
                    data: {
                      token: internalUserToken,
                      email: response.Email
                    } 
                  });
              }else{
                console.log("Password mismatch");
                res.status(401).json({ message: "Invalid credentials" });
                new Error("INTERNAL_USER_LOGIN_3");
              }
            }else{
              console.log("Internal user not found");
              res.status(401).json({ message: "Invalid credentials" });
              new Error("INTERNAL_USER_LOGIN_2");
            }
          })
          .catch((err) => {
            console.log("User not exists", err);
            res.status(StatusCodes.BAD_REQUEST).json({
              message: "Something went wrong!"
            });
          });
    }else{
      console.log("Invalid request object",);
      throw new Error("INTERNAL_USER_LOGIN_1");
    }

    } catch (error){
      console.log("Error while login internal user", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    }
  };

  // INTERNAL
  registerINTERNALV1 = async (req: Request, res: Response) => {
    console.log("register v1 :: Internal Users Controller");

    try {
      const requestObj = req.body || {};

      if("Email" in requestObj && 
        "Password" in requestObj &&
        "ConfirmPassword" in requestObj){
          
        // TODO :: make a field validator to check whether field exists in object and other attributes, 
        //    like is it null, undefined, empty string, or length

        const password = await bcrypt.hash(requestObj.Password, 12);

        const newUser = {
          Email: requestObj.Email, 
          Password: password
        };

        await InternalUsers
          .create(newUser)
          .then((response) => {
            console.log("Internal user created successfully");
            res.status(StatusCodes.OK).json({
              message: "Success"
            });
          })
          .catch((err) => {
            console.log("Error while creating internal user", err);
            res.status(StatusCodes.BAD_REQUEST).json({
              message: "Error"
            });
          });
      }else{
        console.log("Invalid request object",);
        throw new Error("INTERNAL_USER_REG_1");
      }
    } catch (error){
      console.log("Error while register internal user", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    }
  };
}