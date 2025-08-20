import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";

export class GetUserByEmailRepository {
  async execute(email: string) {
    const result = await db.select().from(users).where(eq(users.email, email));
    const [user] = result;
    return user ?? null;
  }
}
