import { Router, Request, Response } from "express";
import {
  MakeCreateCategoryController,
  MakeDeleteCategoryController,
  MakeGetCategoryByIdController,
  MakeGetCategoryBySlugController,
  MakeGetCategoryController,
} from "../factories/categories";

export const categoryRouter = Router();

categoryRouter.post("/create", async (request: Request, response: Response) => {
  const createdCategory = MakeCreateCategoryController();
  const { statusCode, body } = await createdCategory.execute(request);
  response.status(statusCode).send(body);
});

categoryRouter.get("/", async (request: Request, response: Response) => {
  const getCategories = MakeGetCategoryController();
  const { statusCode, body } = await getCategories.execute(request);
  response.status(statusCode).send(body);
});

categoryRouter.get(
  "/:categoryId",
  async (request: Request, response: Response) => {
    const getCategoryById = MakeGetCategoryByIdController();
    const { statusCode, body } = await getCategoryById.execute(request);
    response.status(statusCode).send(body);
  },
);

categoryRouter.get(
  "/slug/:slug",
  async (request: Request, response: Response) => {
    const getCategoryBySlug = MakeGetCategoryBySlugController();
    const { statusCode, body } = await getCategoryBySlug.execute(request);
    response.status(statusCode).send(body);
  },
);

categoryRouter.delete(
  "/:slug",
  async (request: Request, response: Response) => {
    const deletedCategory = MakeDeleteCategoryController();
    const { statusCode, body } = await deletedCategory.execute(request);
    response.status(statusCode).send(body);
  },
);
