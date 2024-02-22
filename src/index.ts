import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { userRouter } from "./routes/user.router";
import { quoteRouter } from "./routes/quote.router";
import { favoritesRouter } from "./routes/favorites.router";

// env variable setup
const envKeys = [
  "DATABASE_URL",
  "ADMIN_PASSWORD",
  "USER_PASSWORD",
  "JWT_SECRET",
  "PORT",
];

dotenv.config();

envKeys.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable ${key}`);
  }
});

// app setup
const app = express();
const port = process.env.PORT || 8080;

const options: cors.CorsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5173"],
};

app.use(cors(options));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Soul Quotes API!");
});

app.use("/users", userRouter);
app.use("/quotes", quoteRouter);
app.use("/favorites", favoritesRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
