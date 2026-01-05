import express from "express";
import { eagleCeramicProductSizeCreate,eagleCeramicProductSizeGetAll,eagleCeramicProductSizeUpdate ,eagleCeramicProductSizeDeletebyID } from "../../controllers/eagleCeramicController/eagle_ceramic_product_size.js";


 export const eagleCeramicProductSizeRouter = express.Router(); 


eagleCeramicProductSizeRouter.post("/eagle-ceramic/product-sizes/create",eagleCeramicProductSizeCreate)
eagleCeramicProductSizeRouter.get("/eagle-ceramic/product-sizes/get-all",eagleCeramicProductSizeGetAll)
eagleCeramicProductSizeRouter.put("/eagle-ceramic/product-sizes/update/:uuid",eagleCeramicProductSizeUpdate)
eagleCeramicProductSizeRouter.delete("/eagle-ceramic/product-sizes/deletebyID/:uuid",eagleCeramicProductSizeDeletebyID)

