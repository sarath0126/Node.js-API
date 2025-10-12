import express from "express";
import dotenv from "dotenv";
const app = express();
import authRouter from "./routes/auth.routes.js"

import { connectDB } from "./db/dbConfig.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();

const PORT = process.env.PORT || 3000;

app.use("/api/users" ,authRouter);

connectDB()
.then(() => {
  app.listen(PORT, () => {
    console.log(`App is Listening on port http://localhost:${PORT}`);
  });
});
