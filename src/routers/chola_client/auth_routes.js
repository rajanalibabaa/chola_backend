import express from "express";
import { verify_client_token } from "../../middleware/chola_client_auth/verify_client_token_middleware.js";
import { clientLogout } from "../../controllers/chola_client_auth/logout_controller.js";
import { clientLogin } from "../../controllers/chola_client_auth/login_controller.js";

export const authRouter = express.Router();

authRouter.post("/chola/client/login",verify_client_token,clientLogin)
authRouter.post("/chola/client/logout",verify_client_token ,clientLogout)


