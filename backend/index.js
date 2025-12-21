import express from "express";
import dotenv from "dotenv"; // Importing the dotenv package to load environment variables from a .env file
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./db/connectDB.js"; // Importing the connectDB function from the connectDB.js file
import authRoutes from "./routes/auth.route.js"; // Importing the authRoutes router from the auth.route.js file
import appRoutes from "./routes/app.routes.js";
import { globalLimiter } from "./middleware/rateLimiters.js";

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

connectDB();

app.use(  
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// app.use(globalLimiter);
app.use(express.json()); // parse incoming JSON requests and put the parsed data in req.body object
app.use(cookieParser()); // parse incoming cookies and store them in req.cookies object

app.use("/api/auth", authRoutes); // Mounting the authRoutes router at /api/auth path
app.use("/apps", appRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});


