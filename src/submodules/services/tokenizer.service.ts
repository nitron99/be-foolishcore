import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { CryptographerService } from './cryptographer.service';

const cryptoGrapher = new CryptographerService();

const authPrivateKey = process.env.AUTH_PRIVATE_KEY || "authPrivateKey";
const internalPrivateKey = process.env.INTERNAL_PRIVATE_KEY || "internalPrivateKey";

export class TokenizerService {
  generateAuthToken = (payload: string) => {
    return jwt.sign({ data: cryptoGrapher.encrypt(payload) }, 
      authPrivateKey, 
      { expiresIn: "1h" }
    )
  };

  generateInternalToken = (payload: string) => {
    return jwt.sign({ data: cryptoGrapher.encrypt(payload) }, 
      internalPrivateKey, 
      { expiresIn: "1h" }
    )
  };

  verifyAuthToken = (token) => {
    return new Promise((resolve, reject) => {
      try {
        if(token === null || token === undefined || token === ""){
          throw new Error("INVALID_TOKEN");
        }else{
          jwt.verify(token, authPrivateKey, (err, decoded) => {
            if(err) {
              switch (err.name){
                case "TokenExpiredError":
                  reject({
                    verified: false, 
                    cause: "expire"
                  });
                  break;
                case "JsonWebTokenError":
                  reject({
                    verified: false, 
                    cause: "malformed"
                  });
                  break;
                case "NotBeforeError":
                  reject({
                    verified: false,
                    cause: "notbefore"
                  });
                  break;
              }
            } else {
              resolve({
                verified: true, 
                data: cryptoGrapher.decrypt(decoded.data)
              })
            }
          });
        }
      } catch (error) {
        console.log("Error while verifying auth token", error);
        reject({
          verified: false
        })
      }
    });
  } 

  verifyInternalToken = (token) => {
    return new Promise((resolve, reject) => {
      try {
        if(token === null || token === undefined || token === ""){
          throw new Error("INVALID_TOKEN");
        }else{
          jwt.verify(token, internalPrivateKey, (err, decoded) => {
            if(err) {
              switch (err.name){
                case "TokenExpiredError":
                  reject({
                    verified: false, 
                    cause: "expire"
                  });
                  break;
                case "JsonWebTokenError":
                  reject({
                    verified: false, 
                    cause: "malformed"
                  });
                  break;
                case "NotBeforeError":
                  reject({
                    verified: false,
                    cause: "notbefore"
                  });
                  break;
              }
            } else {
              resolve({
                verified: true, 
                data: cryptoGrapher.decrypt(decoded.data)
              })
            }
          });
        }
      } catch (error) {
        console.log("Error while verifying internal token", error);
        reject({
          verified: false
        })
      }
    });
  } 
}