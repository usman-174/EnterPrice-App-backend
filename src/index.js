import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { connectDB } from "./utils/database.js";
import { makeAdmin } from "./utils/createAdmin.js";
import User from "./models/User.js";
import ErrorMiddleware from "./middlewares/errors.js";
import authRoutes from "./routes/auth.js";
import departmentRoutes from "./routes/department.js";
import donorRoutes from "./routes/donor.js";
import directionRoutes from "./routes/direction.js";
import licensesRoutes from "./routes/license.js";
import supplierRoutes from "./routes/supplier.js";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/licenses", licensesRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/directions", directionRoutes);
app.use("/api/suppliers", supplierRoutes);

// Error handling middleware
app.use(ErrorMiddleware);

// Default route
const startTime = new Date();

app.get("/", (_, res) => {
  const currentTime = new Date();
  const timeDifference = currentTime - startTime; // Time difference in milliseconds
  const runningMinutes = Math.floor(timeDifference / (1000 * 60)); // Convert milliseconds to minutes

  return res.json({
    NODE_ENV: process.env.NODE_ENV,
    message: "App is Up & Running!",
    minutes: runningMinutes,
  });
});

// Start the server
const startServer = async () => {
  try {
    await connectDB(process.env.URI);
    console.log("Database connected!");
    console.log(`Server running at port => ${PORT}`);

    const anyAdmin = await User.find({ role: "admin" });
    if (!anyAdmin?.length) {
      makeAdmin(User);
    }
  } catch (err) {
    console.error("---------------------");
    console.error(err);
    console.error("---------------------");
    process.exit(1);
  }
};

app.listen(PORT, startServer);
