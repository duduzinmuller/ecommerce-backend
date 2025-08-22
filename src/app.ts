import express from "express";
import { userRouter } from "./routes/user";
import { categoryRouter } from "./routes/categories";

export const app = express();

app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/categories", categoryRouter);
