import { Router, Request, Response } from "express";
import { auth } from "../middleware/auth";
import { MakeCreateOrderController } from "../factories/order";

export const orderRouter = Router();

orderRouter.post(
  "/create",
  auth,
  async (request: Request, response: Response) => {
    const createdOrder = MakeCreateOrderController();

    const userId = request.userId;

    const { statusCode, body } = await createdOrder.execute({
      body: {
        ...request.body,
        user_id: userId,
      },
    });
    response.status(statusCode).send(body);
  },
);
