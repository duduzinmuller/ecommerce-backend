import express from "express";
import { userRouter } from "./routes/user";

export const app = express();

app.use(express.json());

app.use("/api/users", userRouter);
