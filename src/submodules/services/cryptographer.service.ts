import { createCipheriv, createDecipheriv } from "crypto";
const algo = "aes-256-cbc";
const IV = Buffer.from("5a8e927b4c6ef0d81f493872a685a913", "hex");
const secretKey = "3904rj09q3herfasdjoriqhkldf24566";

export class CryptographerService {
  encrypt = (text: string) => {
    const cypher = createCipheriv(algo, Buffer.from(secretKey), IV);
    let encrypted = cypher.update(text, "utf8", "hex");
    encrypted += cypher.final("hex");
    return encrypted;
  }

  decrypt = (cypherText: string) => {
    const decypher = createDecipheriv(algo, Buffer.from(secretKey), IV);
    let decrypted = decypher.update(cypherText, "hex", "utf8");
    decrypted += decypher.final("utf8");
    return decrypted;
  }
}