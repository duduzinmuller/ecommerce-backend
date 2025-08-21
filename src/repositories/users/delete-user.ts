import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";

export class DeleteUserRepository {
  async execute(userId: string) {
    const user = await db.select().from(users).where(eq(users.id, userId));

    await db.delete(users).where(eq(users.id, userId));

    return user[0];
  }
}
