import bcrypt from "bcrypt";

export class PasswordHasher {
  execute(password: string) {
    return bcrypt.hash(password, 10);
  }
}
