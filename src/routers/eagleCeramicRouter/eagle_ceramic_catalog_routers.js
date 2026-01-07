import express from "express";
import { deleteEagleCeramicCatalogById, eagleCeramicCatalogCreate, getAllEagleCeramicCatalogbyProduct, updateEagleCeramicCatalog } from "../../controllers/eagleCeramicController/eagle_ceramic-catalog.js";
import { upload } from "../../middleware/multer/multer.js";
import { verify_client_token } from "../../middleware/chola_client_auth/verify_client_token_middleware.js";


export const eagleCeramicCatalogRouter = express.Router();


eagleCeramicCatalogRouter.post("/eagle-ceramic/catalog/create",verify_client_token,upload.fields([
    { name: "image", maxCount: 10 },
    { name: "pdf", maxCount: 10 },
  ]),eagleCeramicCatalogCreate)

eagleCeramicCatalogRouter.get("/eagle-ceramic/catalog/get-by-product",getAllEagleCeramicCatalogbyProduct)
eagleCeramicCatalogRouter.patch("/eagle-ceramic/catalog/update/:id",verify_client_token,upload.fields([
    { name: "image", maxCount: 10 },
    { name: "pdf", maxCount: 10 },
  ]),updateEagleCeramicCatalog)

eagleCeramicCatalogRouter.delete("/eagle-ceramic/catalog/delete/:id", verify_client_token,deleteEagleCeramicCatalogById)