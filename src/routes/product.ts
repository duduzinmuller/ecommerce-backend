import { Router, Response, Request } from "express";
import {
  MakeCreateProductController,
  MakeGetProductBySlugController,
} from "../factories/product";

export const productRouter = Router();

productRouter.post("/create", async (request: Request, response: Response) => {
  const createdProduct = MakeCreateProductController();
  const { statusCode, body } = await createdProduct.execute(request);
  response.status(statusCode).send(body);
});

productRouter.get(
  "/slug/:slug",
  async (request: Request, response: Response) => {
    const getProductBySlug = MakeGetProductBySlugController();
    const { statusCode, body } = await getProductBySlug.execute(request);
    response.status(statusCode).send(body);
  },
);
