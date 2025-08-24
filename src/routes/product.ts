import { Router, Response, Request } from "express";
import { MakeCreateProductController } from "../factories/product";

export const productRouter = Router();

productRouter.post("/create", async (request: Request, response: Response) => {
  const createdProduct = MakeCreateProductController();
  const { statusCode, body } = await createdProduct.execute(request);
  response.status(statusCode).send(body);
});
