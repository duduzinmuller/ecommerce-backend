import { Router, Request, Response } from "express";
import { MakeCreateCategoryController } from "../factories/categories";

export const categoryRouter = Router();

categoryRouter.post("/create", async (request: Request, response: Response) => {
  const createdCategory = MakeCreateCategoryController();
  const { statusCode, body } = await createdCategory.execute(request);
  response.status(statusCode).send(body);
});
