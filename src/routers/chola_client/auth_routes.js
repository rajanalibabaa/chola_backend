import express from "express";
import { verify_client_token } from "../../middleware/chola_client_auth/verify_client_token_middleware.js";
import { clientLogout } from "../../controllers/chola_client_auth/logout_controller.js";
import { clientLogin } from "../../controllers/chola_client_auth/login_controller.js";
import { getCholaClientUser } from "../../controllers/chola_client_auth/user_controller.js";
import { otp_verify_token } from "../../middleware/otp_verification/otp_verification_middleware.js";

export const authRouter = express.Router();

authRouter.post("/chola/client/login",otp_verify_token,clientLogin)
authRouter.post("/chola/client/logout",verify_client_token ,clientLogout)
authRouter.get("/chola/client/user",verify_client_token ,getCholaClientUser)


