import express from "express";
import cors from "cors";
import apiRoutes from "./src/routers/index.js";
import cookieParser from "cookie-parser";
// import { sendEmail } from "./src/config/email.js";
// import { otpEmailTemplate } from "./src/template/otpEmailTemplate.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.get("/", (req, res) => {
  res.send("API is running...");
});


  // await sendEmail({
  //     to: "aravind@20052001",
  //     subject: "OTP Verification – MrFranchise",
  //     html: otpEmailTemplate({ name: "Aravind", otp: "123456" }),
  //   });


app.use("/api", apiRoutes);

export default app;
