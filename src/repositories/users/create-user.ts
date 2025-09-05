import { db } from "../../db";
import { users } from "../../db/schema";
import { User } from "../../interfaces/user";

export class CreateUserRepository {
  async execute(createUserParams: User) {
    const user = await db
      .insert(users)
      .values({
        id: createUserParams.id,
        name: createUserParams.name,
        email: createUserParams.email,
        password: createUserParams.password,
        asaas_customer_id: createUserParams.asaas_customer_id,
        created_at: createUserParams.created_at,
        updated_at: createUserParams.updated_at,
      })
      .returning();

    return user;
  }
}
