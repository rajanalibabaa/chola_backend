import express from "express";
import cors from "cors";
import apiRoutes from "./src/routers/index.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api", apiRoutes);

export default app;
