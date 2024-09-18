import express, { Request, Response } from "express";
import routes from "./routes/index";
import cors from "cors";

const RoutePrefix = "/apps";

export const createServer = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());

  // Health Check of Application
  app.get(`${RoutePrefix}/ping`, (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  // Version of Application
  app.get(`${RoutePrefix}/version`, (req: Request, res: Response) => {
    res.send({ version: "1.0" });
  });

  // Honey-Pot
  app.get(`${RoutePrefix}`, (req: Request, res: Response) => {
    res.sendStatus(200);
  });  

  // Router Connection
  app.use(`${RoutePrefix}`, routes);

  // Invalid Route
  app.get("*", (req: Request, res: Response) => {
    res.status(404).json({ message: "INVALID URL" });
  });

  return app;
}   