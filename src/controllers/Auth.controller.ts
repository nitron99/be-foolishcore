import { Request, Response } from "express"; 
import { StatusCodes } from "http-status-codes";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { TokenizerService } from "../submodules/services/tokenizer.service";

import { Users } from "../models/Users.model";

const tokenizer = new TokenizerService();

export class AuthController {
  authenicateV1 = async (req: Request, res: Response) => {
    console.log("Authenicate :: Auth Controller");
    try {
      const token = req.body;

      if("token" in token){
        const userObj = jwt.decode(token.token);
        if(userObj.email_verified === true){
          // check if user already exists        
          const user = await Users
            .findOne({ Email: userObj.email });

          if(user){
            // check for disabled or banned users
            if(user.Status === true){
              // user found = give token
              const isPasswordCorrect = await bcrypt.compare(userObj.sub, user.Password);
              if(isPasswordCorrect){
                const tokenPayload = {
                  email: user.Email,
                  id: user.id,
                }
                const userToken = tokenizer.generateAuthToken(JSON.stringify(tokenPayload));
                res.status(200)
                  .json({ 
                    message: "User logged In successfully!",
                    data: {
                      id: user._id,
                      token: userToken,
                      name: user.Name,
                      email: user.Email,
                      picture: user.DP
                    } 
                  });
              }else{
                console.log("Password mismatch");
                res.status(401).json({ message: "Invalid credentials" });
                new Error("AUTH_5");
              }
            }else{
              console.log("Disabled user trying to login");
              res.status(StatusCodes.FORBIDDEN).json({ message: "You account is on hold, please contact us" });
              new Error("AUTH_4");
            }
          }else{
            // user not found = register user
            console.log("User not found, registering new user");

            const password = await bcrypt.hash(userObj.sub, 12);

            const newUser = {
              Name: userObj.given_name + " " + userObj.family_name,
              Email: userObj.email,
              Password: password,
              DP: userObj.picture
            }

            await Users
              .create(newUser)
              .then((response) => {
                console.log("User created successfully!");
                const tokenPayload = {
                  email: response.Email,
                  id: response.id
                }
                const userToken = tokenizer.generateAuthToken(JSON.stringify(tokenPayload));
                res.status(200)
                  .json({ 
                    message: "User created successfully!",
                    data: {
                      id: response._id,
                      token: userToken,
                      name: response.Name,
                      email: response.Email,
                      picture: response.DP
                    } 
                  });
              })
              .catch((err) => {
                console.log("Error while creating new user", err);
                res.status(401).json({ message: "Something went wrong" });
                new Error("AUTH_3");
              });
          }
        }else{
          console.log("Invalid user");
          res.status(401).json({ message: "Invalid user" });
          new Error("AUTH_2");
        }
      } else{
        console.log("Missing token");
        res.status(401).json({ message: "Missing token" });
        new Error("AUTH_1");
      }
    } catch (error) {
      console.log("Error while authicating user", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    }
  };
}