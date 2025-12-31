import express from "express";
import registrationRoutes from "./clientRegistration/registration_routes.js";
import adminRoutes from "../routers/cholaAdmin/admin_routes.js";
import { otpRouter } from "./otp/otp_routes.js";
import { authRouter } from "./chola_client/auth_routes.js";
import { eagleCeramicProductSizeRouter } from "./eagleCeramicRouter/eagle_ceramic_product_size_routes.js";
import { eagleCeramicCatalogRouter } from "./eagleCeramicRouter/eagle_ceramic_catalog_routers.js";
const router = express.Router();

router.use("/v1", registrationRoutes);
router.use("/v1", adminRoutes);
router.use("/v1", otpRouter);

//client authRouter 
router.use("/v1", authRouter);


router.use("/v1", eagleCeramicProductSizeRouter)
router.use("/v1", eagleCeramicCatalogRouter)


export default router;
