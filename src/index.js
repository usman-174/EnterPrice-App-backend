import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import ErrorMiddleware from "./middlewares/errors.js";
import { connectDB } from "./utils/database.js";
import authRoutes from "./routes/auth.js";
import departmentRoutes from "./routes/department.js";
import licensesRoutes from "./routes/license.js";
import cors from "cors";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
const app = express();
const PORT = process.env.PORT;

app.use(cookieParser());
app.use(express.static("public"));

app.use(express.json());
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
  app.use(
    cors({
      credentials: true,
      origin: process.env.ORIGIN,
      optionsSuccessStatus: 200,
    })
  );
} else {
  app.use(
    cors({
      credentials: true,
      origin: process.env.ORIGIN,
      optionsSuccessStatus: 200,
    })
  );
}

process.on("uncaughtException", (err) => {
  console.log(`Error = ${err.message}`);
  console.log("Shutting down server due to uncaughtException Error");
  process.exit(1);
});

app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/licenses", licensesRoutes);

app.use(ErrorMiddleware);

app.listen(PORT, async () => {
  try {
    await connectDB(process.env.URI);
    console.log("Database connected!");
    console.log(`Server running at http://localhost:${PORT}`);
  } catch (err) {
    console.error("---------------------");
    console.error(err);
    console.error("---------------------");

    process.exit();
  }
});
