export class EmailAlreadyInUseError extends Error {
  constructor(email: string) {
    super(`O email ${email} ja esta em uso`);
    this.name = "EmailAlreadyInUseError";
  }
}
