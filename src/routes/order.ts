import { Router, Request, Response } from "express";
import { auth } from "../middleware/auth";
import {
  MakeCreateOrderController,
  MakeGetOrderByUserIdController,
} from "../factories/order";

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

orderRouter.get("/me", auth, async (request: Request, response: Response) => {
  const getOrderByUserId = MakeGetOrderByUserIdController();
  const userId = request.userId;
  const { statusCode, body } = await getOrderByUserId.execute({
    body: { user_id: userId },
  });

  response.status(statusCode).send(body);
});
