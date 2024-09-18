import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { TokenizerService } from "../services/tokenizer.service";

const tokenizerService = new TokenizerService();

export class Tokenizer {
  parseAuthToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["x-access-token"] || req.headers.authorization;

    if(token === undefined ||
      token === null){
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Invalid token",
        errors: ["NO_TOKEN"]
      });
    }else{
      tokenizerService
        .verifyAuthToken(token.slice(7, token.length))
        .then((response: Object) => {
          const userData = JSON.parse(response["data"]);
          //@ts-ignore
          req.locals = {};
          //@ts-ignore
          req.locals.UserId = userData["id"];
          next();
        })
        .catch((error) => {
          const errors: string[] = [];
          if(Object.keys(error).includes("cause")){
            const validationFailCause = error["cause"];

            switch(validationFailCause){
              case "expired":
                errors.push("TOKEN_EXPIRED");
                break;
              case "malformed":
                errors.push("INVALID_MALFORMED_TOKEN");
                break;
              default:
                break;
            }
          } else {
            errors.push("TOKEN_VERIFICATION_FAILED");
          }

          

          res.status(StatusCodes.UNAUTHORIZED).json({
            message: "Something went wrong",
            errors: errors
          });
        });
    }
  }

  parseInternalToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["x-access-token"] || req.headers.authorization;

    if(token === undefined ||
      token === null){
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Invalid token",
        errors: ["NO_TOKEN"]
      });
    }else{
      tokenizerService
        .verifyInternalToken(token.slice(7, token.length))
        .then((response: Object) => {
          const userData = JSON.parse(response["data"]);
          //@ts-ignore
          req.locals = {};
          //@ts-ignore
          req.locals.UserId = userData["Id"];
          next();
        })
        .catch((error) => {
          const errors: string[] = [];
          if(Object.keys(error).includes("cause")){
            const validationFailCause = error["cause"];

            switch(validationFailCause){
              case "expired":
                errors.push("TOKEN_EXPIRED");
                break;
              case "malformed":
                errors.push("INVALID_MALFORMED_TOKEN");
                break;
              default:
                break;
            }
          } else {
            errors.push("TOKEN_VERIFICATION_FAILED");
          }

          res.status(StatusCodes.UNAUTHORIZED).json({
            message: "Something went wrong",
            errors: errors
          });
        });
    }
  }
}