import express from "express";
import { eagleCeramicProductSizeCreate,eagleCeramicProductSizeGetAll,eagleCeramicProductSizeUpdate ,eagleCeramicProductSizeDeletebyID, eagleCeramicProductSizeDropdown } from "../../controllers/eagleCeramicController/eagle_ceramic_product_size.js";
import { upload } from "../../middleware/multer/multer.js";
import { verify_client_token } from "../../middleware/chola_client_auth/verify_client_token_middleware.js";


 export const eagleCeramicProductSizeRouter = express.Router(); 


eagleCeramicProductSizeRouter.post("/eagle-ceramic/product-sizes/create",upload.fields([
    { name: "image", maxCount: 50 }
  ]),eagleCeramicProductSizeCreate)
eagleCeramicProductSizeRouter.get("/eagle-ceramic/product-sizes/get-all",eagleCeramicProductSizeGetAll)
eagleCeramicProductSizeRouter.put("/eagle-ceramic/product-sizes/update/:uuid",verify_client_token, upload.fields([
    { name: "image", maxCount: 50 } 
  ]),eagleCeramicProductSizeUpdate)
eagleCeramicProductSizeRouter.delete("/eagle-ceramic/product-sizes/deletebyID/:uuid",verify_client_token,eagleCeramicProductSizeDeletebyID)
eagleCeramicProductSizeRouter.get("/eagle-ceramic/product-sizes/dropdown",eagleCeramicProductSizeDropdown)