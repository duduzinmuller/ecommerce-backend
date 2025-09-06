import { Router, Request, Response } from "express";
import { MakeCreatePaymentController } from "../factories/payment";
import { auth } from "../middleware/auth";

export const paymentRouter = Router();

paymentRouter.post("/", auth, async (request: Request, response: Response) => {
  const createPaymentController = MakeCreatePaymentController();
  const userId = request.userId;
  const { statusCode, body } = await createPaymentController.execute({
    body: {
      ...request.body,
      user_id: userId,
    },
  });
  response.status(statusCode).send(body);
});
