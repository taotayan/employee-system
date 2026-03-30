import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import employeeRoutes from "./routes/employees";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/users";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/admin/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/employees", employeeRoutes);

app.listen(3000, () => {
  console.log("🚀 Backend running on http://localhost:3000");
});
