// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import { connectDB } from "./db/dbConfig.js";
import { swaggerUi, swaggerSpec } from "./swagger/swaggerConfig.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/users", authRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`App running on port: ${PORT}`);
    console.log(`Swagger Docs → http://localhost:${PORT}/api-docs`);
  });
});
