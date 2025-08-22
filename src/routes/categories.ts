import { Router, Request, Response } from "express";
import {
  MakeCreateCategoryController,
  MakeGetCategoryBySlugController,
} from "../factories/categories";

export const categoryRouter = Router();

categoryRouter.post("/create", async (request: Request, response: Response) => {
  const createdCategory = MakeCreateCategoryController();
  const { statusCode, body } = await createdCategory.execute(request);
  response.status(statusCode).send(body);
});

categoryRouter.get("/:slug", async (request: Request, response: Response) => {
  const getCategoryBySlug = MakeGetCategoryBySlugController();
  const { statusCode, body } = await getCategoryBySlug.execute(request);
  response.status(statusCode).send(body);
});
