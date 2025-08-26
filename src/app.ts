import express from "express";
import { userRouter } from "./routes/user";
import { categoryRouter } from "./routes/category";
import { productRouter } from "./routes/product";

export const app = express();

app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);
