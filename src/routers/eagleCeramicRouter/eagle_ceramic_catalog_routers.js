import express from "express";
import { eagleCeramicCatalogCreate } from "../../controllers/eagleCeramicController/eagle_ceramic-catalog.js";
import { upload } from "../../middleware/multer/multer.js";


export const eagleCeramicCatalogRouter = express.Router();


eagleCeramicCatalogRouter.post("/eagle-ceramic/catalog/create",upload.fields([
    { name: "image", maxCount: 10 },
    { name: "pdf", maxCount: 10 },
  ]),eagleCeramicCatalogCreate)