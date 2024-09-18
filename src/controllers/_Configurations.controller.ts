import { Request, Response } from "express"; 
import { StatusCodes } from "http-status-codes";

import { Configurations } from "../models/Configurations.model";

export class ConfigurationsController {
  // INTERNAL
  getConfigurationsINTERNALV1 = async (req: Request, res: Response) => {
    console.log("get configurations v1 :: Configurations Controller");

    try {
      await Configurations
        .find()
        .sort({ IsDefault: "desc" })
        .then(async (response) => {
          const filteredData = response
            .map((responseObj) => {
              return {
                Id: responseObj._id,
                Name: responseObj.Name,
                ReviewArticles: responseObj.ReviewArticles, 
                IsDefault: responseObj.IsDefault,
                createdAt: responseObj.createdAt,
                updatedAt: responseObj.updatedAt
              }
            }); 

          res.status(StatusCodes.OK).json({
            message: "Configurations fetched successfully!",
            data: [filteredData]
          }); 
        })
        .catch((err) => {
          console.log("Error while fetch configurations", err);
          throw new Error("CONFIG_GET_ALL_1");
        });
    } catch (error){
      console.log("Error while get users", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    }
  };

  // INTERNAL
  createConfigurationsINTERNALV1 = async (req: Request, res: Response) => {
    console.log("create configurations v1 :: Configurations Controller");

    try {

      let totalConfigurations = await Configurations.countDocuments();
      
      if(totalConfigurations < 5){
        let newConfigurationName = 1;

        await Configurations
          .find()
          .sort({ Name: "desc" })
          .then((response) => {
            newConfigurationName = response[0].Name || 1
          });

        let newConfiguration =  {
          Name: newConfigurationName + 1,
          ReviewArticles: false,
          IsDefault: totalConfigurations === 0 ? true : false
        }
  
        await Configurations
          .create(newConfiguration)
          .then((response) => {
            console.log(response)
            if(response) {
              res.status(StatusCodes.CREATED).json({ 
                message: "Configurations created successfully!",
              });
            }else{
              console.log("Error while creating new configurations");
              throw new Error("CONFIG_CREATE_3");
            }
          })
          .catch((err) => {
            console.log("Error while creating new configurations");
            console.log(err)
            throw new Error("CONFIG_CREATE_2");
          });
      } else {
        console.log("Too many configurations!");
        throw new Error("CONFIG_CREATE_1");
      }     
    } catch (error) {
      console.log("Error while get users", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    }
  };

  // INTERNAL
  updateConfigurationsINTERNALV1 = async (req: Request, res: Response) => {
    console.log("update configuration v1 :: Configurations Controller");

    try {
      const configId = req.params.configId || "";       
      const requestObj = req.body || null;

      if(configId){
        if("ReviewArticles" in requestObj &&
            typeof requestObj.ReviewArticles === "boolean"){
          await Configurations
          .findByIdAndUpdate(configId, { ReviewArticles: requestObj.ReviewArticles })
          .then(async (response) => {
            res.status(StatusCodes.ACCEPTED).json({ 
              message: "Configuration updated successfully!",
            });
          })
          .catch((err) => {
            console.log("Error while updating configuration");
            console.log(err)
            throw new Error("CONFIG_UPDATE_2");
          });         
        }
      } else {
        console.log("No config id found");
        throw new Error("CONFIG_UPDATE_1");
      };
    } catch (error) {
      console.log("Error while get users", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    }
  };

  // INTERNAL
  deleteConfigurationsINTERNALV1 = async (req: Request, res: Response) => {
    console.log("delete configuration v1 :: Configurations Controller");

    try {
      const configId = req.params.configId || ""; 

      if(configId){

        let totalConfigurations = await Configurations.countDocuments();

        if(totalConfigurations > 1){
          await Configurations
          .findById(configId)
          .then(async (response) => {
            if(response.IsDefault === false){
              await Configurations
                .findByIdAndDelete(configId)
                .then(() => {
                  res.status(StatusCodes.ACCEPTED).json({ 
                    message: "Comment deleted successfully!",
                  });
                })
            } else {
              res.status(StatusCodes.BAD_REQUEST).json({ 
                message: "Cannot delete default configuration",
              });
            }
          })
          .catch(() => {
            console.log("Invalid config id found");
            throw new Error("CONFIG_DELETE_2");
          });
        } else {
          res.status(StatusCodes.BAD_REQUEST).json({ 
            message: "Cannot delete last configuration",
          });
        }      
      } else {
        console.log("No config id found");
        throw new Error("CONFIG_DELETE_1");
      };
    } catch (error) {
      console.log("Error while get users", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    }
  };

  // INTERNAL
  makeDefaultConfigurationsINTERNALV1 = async (req: Request, res: Response) => {
    console.log("make default configuration v1 :: Configurations Controller");

    try {
      const configId = req.params.configId || "";

      if(configId){
        await Configurations
          .find({ IsDefault: true })
          .then(async (response) => {
            // making true the new one
            console.log(response)
            await Configurations
            .findOneAndUpdate({ _id: configId }, { IsDefault: true })
            .catch(() => {
              console.log("Error while update new configuration");
              throw new Error("CONFIG_MAKE_DEFAULT_2");
            });

            if(response){
              // make false the old one
              await Configurations
                .findOneAndUpdate({ _id: response[0]._id }, { IsDefault: false })
                .catch(() => {
                  console.log("Error while update old configuration");
                  throw new Error("CONFIG_MAKE_DEFAULT_3");
                })
            }else{
              // No Default config - shouldn't be possible
            }
          })

          res.status(StatusCodes.ACCEPTED).json({
            message: "Default configuration changed successfully!"
          }); 
      }else{
        console.log("No configuration id found");
        throw new Error("CONFIG_MAKE_DEFAULT_1");
      }
    } catch (error) {
      console.log("Error while get users", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!"
      });
    }
  };
}