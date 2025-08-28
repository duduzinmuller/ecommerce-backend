export class OrderNotFoundOrUnauthorizedError extends Error {
  constructor() {
    super("Pedido não encontrado ou não pertence ao usuário");
    this.name = "OrderNotFoundOrUnauthorizedError";
  }
}
