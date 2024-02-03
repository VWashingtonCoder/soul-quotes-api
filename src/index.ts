import express from "express";
import dotenv from "dotenv";
// import { userRouter } from "./routes/user.router";
// import { quoteRouter } from "./routes/quote.router";
// import { favoritesRouter } from "./routes/favorites.router";

// env variable setup
const envKeys = [
  "ADMIN_PASSWORD",
  "DATABASE_URL",
  "JWT_SECRET",
  "PORT"
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

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Soul Quotes API!");
});

// app.use(userRouter);
// app.use(quoteRouter);
// app.use(favoritesRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});