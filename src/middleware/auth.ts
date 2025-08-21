import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export const auth = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const accessToken = request.headers?.authorization?.split("Bearer ")[1];
    if (!accessToken) {
      response.status(401).send({ message: "Unauthorized" });
      return;
    }

    const decodedToken = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET!,
    ) as { userId: string };

    if (!decodedToken || !decodedToken.userId) {
      response.status(401).send({ message: "Unauthorized" });
      return;
    }

    const foundUsers = await db
      .select()
      .from(users)
      .where(eq(users.id, decodedToken.userId));

    if (!foundUsers || foundUsers.length === 0) {
      response.status(401).send({ message: "Unauthorized" });
      return;
    }

    request.user = decodedToken.userId;
    request.userId = decodedToken.userId;

    next();
  } catch (error) {
    console.error(error);
    response.status(401).send({ message: "Unauthorized" });
    return;
  }
};
