import { Request, Response, Router } from "express";
import { MakeCreateUserController } from "../factiories/user";

export const userRouter = Router();

userRouter.post("/create", async (request: Request, response: Response) => {
  const createdUser = MakeCreateUserController();
  const { statusCode, body } = await createdUser.execute(request);
  response.status(statusCode).send(body);
});
