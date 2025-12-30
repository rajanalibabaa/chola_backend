import express from "express";
import cors from "cors";
import apiRoutes from "./src/routers/index.js";
import cookieParser from "cookie-parser";


const app = express();

app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.get("/", (req, res) => {
  res.send("API is running...");
});



app.use("/api", apiRoutes);

export default app;
