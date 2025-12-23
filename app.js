import express from 'express';
import cors from 'cors';
import registrationRoutes from './src/router/registration_router.js';
import adminRoutes from './src/router/cholaAdmin/admin.js';
import cookieParser from 'cookie-parser';

const app = express();

/* Middleware */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* Test Route */
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/registration", registrationRoutes);
app.use("/api/admin", adminRoutes);



export default app;