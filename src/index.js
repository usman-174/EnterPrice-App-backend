import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import ErrorMiddleware from "./middlewares/errors.js";
import User from "./models/User.js";
import authRoutes from "./routes/auth.js";
import departmentRoutes from "./routes/department.js";
import donorRoutes from "./routes/donor.js";
import directionRoutes from "./routes/direction.js";

import licensesRoutes from "./routes/license.js";
import supplierRoutes from "./routes/supplier.js";
import { makeAdmin } from "./utils/createAdmin.js";
import { connectDB } from "./utils/database.js";
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
app.use("/api/donors", donorRoutes);
app.use("/api/directions", directionRoutes);

app.use("/api/suppliers", supplierRoutes);

app.use(ErrorMiddleware);
app.get("/", (req, res) => {
  res.send("Working ");
});
app.listen(PORT, async () => {
  try {
    await connectDB(process.env.URI);
    console.log("Database connected!");
    console.log(`Server running at port => ${PORT}`);

    const anyAdmin = await User.find({role:"admin"})
    
    if(!anyAdmin?.length){
      makeAdmin(User)
    }

   
  } catch (err) {
    console.error("---------------------");
    console.error(err);
    console.error("---------------------");

    process.exit();
  }
});
