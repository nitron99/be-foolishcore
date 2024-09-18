import { Request, Response } from "express"; 
import { StatusCodes } from "http-status-codes";

import { Users } from "../models/Users.model";
import { Tags } from "../models/Tags.model";

let tagColors = [
  '#FF5733',  // Bright Orange
  '#33FF57',  // Lime Green
  '#3357FF',  // Bright Blue
  '#FF33A8',  // Hot Pink
  '#FFB533',  // Bright Yellow
  '#33FFB5',  // Mint Green
  '#5733FF',  // Purple
  '#33A8FF',  // Sky Blue
  '#FF3357',  // Bright Red
  '#B533FF',  // Violet
  '#33FF93',  // Light Green
  '#FF5733',  // Coral
  '#3378FF',  // Medium Blue
  '#FF7F33',  // Orange
  '#FF3378',  // Pinkish Red
  '#33D4FF',  // Light Sky Blue
  '#A833FF',  // Deep Purple
  '#FF33D4',  // Magenta
  '#33FF7F',  // Bright Green
  '#FFD433',  // Gold
  '#333EFF',  // Indigo
  '#FF3380',  // Raspberry
  '#D433FF',  // Bright Violet
  '#33FFCC',  // Aqua
  '#FF8C33',  // Peach
  '#FF333E',  // Scarlet
  '#A8FF33',  // Neon Green
  '#3380FF',  // Light Blue
  '#FF5733',  // Tomato
  '#33FFAE',  // Aquamarine
  '#FF3391',  // Fuchsia
  '#91FF33',  // Lime
  '#33C3FF',  // Light Cyan
  '#FF5A33',  // Burnt Orange
  '#33FFA1',  // Pastel Green
  '#FFC133',  // Goldenrod
  '#337FFF',  // Bright Azure
  '#FF33B5',  // Flamingo Pink
  '#C1FF33',  // Lemon Lime
  '#33FF67',  // Spring Green
  '#FF333F',  // Ruby Red
  '#33A3FF',  // Cornflower Blue
  '#FF93FF',  // Lavender Pink
  '#5733FF',  // Royal Purple
  '#33FF44',  // Neon Green
  '#FF44FF',  // Bright Pink
  '#FF8844',  // Light Orange
  '#44FF33',  // Bright Lime
  '#FF3333'   // True Red
];

export class TagsController {
  // HELPER
  getTagsV1 = async (req: Request, res: Response) => {
    console.log("get tags v1 :: Tags Controller");

    const page = req.query.page ? parseInt(req.query.page + "") : 0;
    const limit = req.query.limit ? parseInt(req.query.limit + "") : 10;

    try {
      await Tags
        .find()
        .limit(limit)
        .skip(page)
        .then(async (response) => {
          const filteredData = response.map((tag) => {
            return {
              Id: tag._id,
              Title: tag.Title,
              Status: tag.Status,
              Color: tag.Color,
            };
          });

          const total = await Tags.find().countDocuments();

          res.status(StatusCodes.OK).json({
            message: "Tags fetched successfully!",
            data: [page, limit, total, filteredData]
          });
        })
        .catch((err) => {
          console.log("Error while fetch tags", err);
          throw new Error("TAGS_GET_1");
        });
    } catch (error) {
      console.log("Error while fetching tags", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    };
  };

  // INTERNAL
  getTagsINTERNALV1 = async (req: Request, res: Response) => {
    console.log("get tags internal v1 :: Tags Controller");

    const page = req.query.page ? parseInt(req.query.page + "") : 0;
    const limit = req.query.limit ? parseInt(req.query.limit + "") : 10;

    try {
      await Tags
        .find()
        .limit(limit)
        .skip(page)
        .then(async (response) => {
          const filteredData = response.map((tag) => {
            return {
              Id: tag._id,
              Title: tag.Title,
              Status: tag.Status,
              Color: tag.Color,
              createdAt: tag.createdAt,
              updatedAt: tag.updatedAt,
            };
          });

          const total = await Tags.find().countDocuments();

          res.status(StatusCodes.OK).json({
            message: "Tags fetched successfully!",
            data: [page, limit, total, filteredData]
          });
        })
        .catch((err) => {
          console.log("Error while fetch tags internal", err);
          throw new Error("TAGS_GET_INT_1");
        });
    } catch (error) {
      console.log("Error while fetching tags internal", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    };
  };

  // INTERNAL
  createTagINTERNALV1 = async (req: Request, res: Response) => {
    console.log("create tag internal v1 :: Tags Controller");

    try {
      const requestObj = req.body || null;

      if("Title" in requestObj){

        let newTag = {
          Title: requestObj.Title,
          Color: tagColors[Math.floor(Math.random() * tagColors.length)],
          Status: true
        };

        await Tags
          .create(newTag)
          .then((response) => {
            res.status(StatusCodes.CREATED).json({ 
              message: "Tag created successfully!",
            });
          })
          .catch((err) => {
            console.log("Error while creating tag internal", err);
            throw new Error("TAGS_CREATE_INT_2");
          });
      } else  {
        console.log("Invalid payload");
        throw new Error("TAGS_CREATE_INT_1");
      }
    } catch (error) {
      console.log("Error while creating tag internal", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    };
  };

  // INTERNAL
  updateTagINTERNALV1 = async (req: Request, res: Response) => {
    console.log("update tag internal v1 :: Tags Controller");

    try {
      const requestObj = req.body || null;
      const tagId = req.params.tagId || null;

      let updatedTag = {};

      if("Title" in requestObj) {
        updatedTag = {...updatedTag, Title: requestObj.Title }
      }

      if("Status" in requestObj) {
        updatedTag = {...updatedTag, Status: requestObj.Status }
      }

      await Tags
        .findByIdAndUpdate(tagId, updatedTag)
        .then((response) => {
          res.status(StatusCodes.ACCEPTED).json({ 
            message: "Tag updated successfully!",
          });
        })
        .catch((err) => {
          console.log("Error while updating tag internal", err);
          throw new Error("TAGS_UPDATE_INT_2");
        });
      // } else  {
      //   console.log("Invalid payload");
      //   throw new Error("TAGS_UPDATE_INT_1");
      // }
    } catch (error) {
      console.log("Error while updating tag internal", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    };
  };

  // INTERNAL
  deleteTagINTERNALV1 = async (req: Request, res: Response) => {
    console.log("delete tag internal v1 :: Tags Controller");

    try {
      const tagId = req.params.tagId || null;

      await Tags
        .findByIdAndDelete(tagId)
        .then((response) => {
          res.status(StatusCodes.ACCEPTED).json({ 
            message: "Tag deleted successfully!",
          });
        })
        .catch((err) => {
          console.log("Error while deleting tag internal", err);
          throw new Error("TAGS_UPDATE_INT_2");
        });
    } catch (error) {
      console.log("Error while deleting tag internal", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    };
  };

};