import express from "express";
import { eagleCeramicCatalogCreate } from "../../controllers/eagleCeramicController/eagle_ceramic-catalog";


export const eagleCeramicCatalogRouter = express.Router();


eagleCeramicCatalogRouter.post("/eagle-ceramic/catalog/create",eagleCeramicCatalogCreate)