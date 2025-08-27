import express from "express";
import { userRouter } from "./routes/user";
import { categoryRouter } from "./routes/category";
import { productRouter } from "./routes/product";
import { cartRouter } from "./routes/cart";
import { cartItemRouter } from "./routes/cart-item";

export const app = express();

app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/cart-items", cartItemRouter);
