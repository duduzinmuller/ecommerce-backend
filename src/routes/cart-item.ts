import { Router, Request, Response } from "express";
import { auth } from "../middleware/auth";
import {
  MakeCreateCartItemController,
  MakeGetCartItemsController,
  MakeUpdateCartItemController,
  MakeRemoveCartItemController,
} from "../factories/cart-item";

export const cartItemRouter = Router();

cartItemRouter.post("/", auth, async (request: Request, response: Response) => {
  const createCartItem = MakeCreateCartItemController();
  const { statusCode, body } = await createCartItem.execute({
    body: request.body,
  });

  response.status(statusCode).send(body);
});

cartItemRouter.get(
  "/cart/:cartId",
  auth,
  async (request: Request, response: Response) => {
    const getCartItems = MakeGetCartItemsController();
    const { statusCode, body } = await getCartItems.execute({
      params: { cartId: request.params.cartId },
    });

    response.status(statusCode).send(body);
  },
);

cartItemRouter.patch(
  "/:itemId",
  auth,
  async (request: Request, response: Response) => {
    const updateCartItem = MakeUpdateCartItemController();
    const { statusCode, body } = await updateCartItem.execute({
      params: { itemId: request.params.itemId },
      body: request.body,
    });

    response.status(statusCode).send(body);
  },
);

cartItemRouter.delete(
  "/:itemId",
  auth,
  async (request: Request, response: Response) => {
    const removeCartItem = MakeRemoveCartItemController();
    const { statusCode, body } = await removeCartItem.execute({
      params: { itemId: request.params.itemId },
    });

    response.status(statusCode).send(body);
  },
);
