import { Router, Response, Request } from "express";
import {
  MakeCreateProductController,
  MakeGetProductBySlugController,
  MakeGetProductByNameController,
  MakeUpdateProductController,
  MakeDeleteProductController,
} from "../factories/product";

export const productRouter = Router();

productRouter.post("/create", async (request: Request, response: Response) => {
  const createdProduct = MakeCreateProductController();
  const { statusCode, body } = await createdProduct.execute(request);
  response.status(statusCode).send(body);
});

productRouter.get("/search", async (request: Request, response: Response) => {
  const getByName = MakeGetProductByNameController();
  const { statusCode, body } = await getByName.execute(request);
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

productRouter.patch(
  "/slug/:slug",
  async (request: Request, response: Response) => {
    const updatedProduct = MakeUpdateProductController();
    const { statusCode, body } = await updatedProduct.execute(request);
    response.status(statusCode).send(body);
  },
);

productRouter.delete(
  "/slug/:slug",
  async (request: Request, response: Response) => {
    const deletedProduct = MakeDeleteProductController();
    const { statusCode, body } = await deletedProduct.execute(request);
    response.status(statusCode).send(body);
  },
);
