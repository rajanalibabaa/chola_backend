import express from "express";
import { eagleCeramicProductSizeCreate,eagleCeramicProductSizeGetAll,eagleCeramicProductSizeUpdate ,eagleCeramicProductSizeDeletebyID, eagleCeramicProductSizeDropdown } from "../../controllers/eagleCeramicController/eagle_ceramic_product_size.js";
import e from "express";


 export const eagleCeramicProductSizeRouter = express.Router(); 


eagleCeramicProductSizeRouter.post("/eagle-ceramic/product-sizes/create",eagleCeramicProductSizeCreate)
eagleCeramicProductSizeRouter.get("/eagle-ceramic/product-sizes/get-all",eagleCeramicProductSizeGetAll)
eagleCeramicProductSizeRouter.put("/eagle-ceramic/product-sizes/update/:uuid",eagleCeramicProductSizeUpdate)
eagleCeramicProductSizeRouter.patch("/eagle-ceramic/product-sizes/deletebyID/:uuid",eagleCeramicProductSizeDeletebyID)
eagleCeramicProductSizeRouter.get("/eagle-ceramic/product-sizes/dropdown",eagleCeramicProductSizeDropdown)