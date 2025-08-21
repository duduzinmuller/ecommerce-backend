import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";

export class GetUserByIdRepository {
  async execute(id: string) {
    const user = await db.select().from(users).where(eq(users.id, id));

    return user;
  }
}
