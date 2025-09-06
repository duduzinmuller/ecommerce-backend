import express from "express";
import { userRouter } from "./routes/user";
import { categoryRouter } from "./routes/category";
import { productRouter } from "./routes/product";
import { cartRouter } from "./routes/cart";
import { cartItemRouter } from "./routes/cart-item";
import { orderRouter } from "./routes/order";
import { join } from "path";
import { paymentRouter } from "./routes/payment";
import swaggerUi from "swagger-ui-express";
import fs from "fs";

export const app = express();

app.use(express.json());

const swaggerDocument = JSON.parse(
  fs.readFileSync(join(__dirname, "../docs/swagger.json"), "utf-8"),
);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/users", userRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/cart-items", cartItemRouter);
app.use("/api/orders", orderRouter);
app.use("/api/payments", paymentRouter);
