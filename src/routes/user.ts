import { Request, Response, Router } from "express";
import {
  MakeCreateUserController,
  MakeGetUserByIdController,
} from "../factiories/user";
import { auth } from "../middleware/auth";

export const userRouter = Router();

userRouter.post("/create", async (request: Request, response: Response) => {
  const createdUser = MakeCreateUserController();
  const { statusCode, body } = await createdUser.execute(request);
  response.status(statusCode).send(body);
});

userRouter.get("/me", auth, async (request: Request, response: Response) => {
  const getUser = MakeGetUserByIdController();
  const userId = request.userId;
  const { statusCode, body } = await getUser.execute({
    params: { userId },
  });
  response.status(statusCode).send(body);
});
