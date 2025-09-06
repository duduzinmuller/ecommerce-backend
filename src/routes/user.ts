import { Request, Response, Router } from "express";
import {
  MakeCreateUserController,
  MakeDeleteUserController,
  MakeGetUserByIdController,
  MakeLoginUserController,
} from "../factories/user";
import { auth } from "../middleware/auth";

export const userRouter = Router();

userRouter.get("/me", auth, async (request: Request, response: Response) => {
  const getUser = MakeGetUserByIdController();
  const userId = request.userId;
  const { statusCode, body } = await getUser.execute({
    params: { userId },
  });
  response.status(statusCode).send(body);
});

userRouter.post("/", async (request: Request, response: Response) => {
  const createdUser = MakeCreateUserController();
  const { statusCode, body } = await createdUser.execute(request);
  response.status(statusCode).send(body);
});

userRouter.post("/login", async (request: Request, response: Response) => {
  const loginUser = MakeLoginUserController();
  const { statusCode, body } = await loginUser.execute(request);
  response.status(statusCode).send(body);
});

userRouter.delete("/me", auth, async (request: Request, response: Response) => {
  const deletedUser = MakeDeleteUserController();
  const userId = request.userId;
  const { statusCode, body } = await deletedUser.execute({
    params: { userId },
  });
  response.status(statusCode).send(body);
});
