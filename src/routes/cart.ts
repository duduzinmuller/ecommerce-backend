import { Router, Request, Response } from "express";
import { auth } from "../middleware/auth";
import { MakeCreateCartController } from "../factories/cart";

export const cartRouter = Router();

cartRouter.post(
  "/create",
  auth,
  async (request: Request, response: Response) => {
    const createdCart = MakeCreateCartController();
    const userId = request.userId;
    const { statusCode, body } = await createdCart.execute({
      body: { user_id: userId },
    });

    response.status(statusCode).send(body);
  },
);
