import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";

export class GetUserByIdRepository {
  async execute(userId: string) {
    const user = await db.select().from(users).where(eq(users.id, userId));

    return user;
  }
}
