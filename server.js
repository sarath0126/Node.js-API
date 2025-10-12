import express from "express";
import dotenv from "dotenv";
const app = express();
import cors from "cors"
import authRouter from "./routes/auth.routes.js"
import { connectDB } from "./db/dbConfig.js";
import { swaggerUi , swaggerSpec } from "./swagger/swaggerConfig.js";

dotenv.config();

const PORT = process.env.PORT || 3000;


const allowedOrigins = [
  "http://localhost:8080",
  "https://node-js-api-hg8u.onrender.com" 
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed from this origin"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/users" ,authRouter);

connectDB()
.then(() => {
  app.listen(PORT, () => {
    console.log(`App is Listening on port http://localhost:${PORT}`);
     console.log(`Swagger Docs → http://localhost:${PORT}/api-docs`);
  });
});
