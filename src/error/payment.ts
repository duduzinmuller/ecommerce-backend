export class MethodPaymentNotError extends Error {
  constructor() {
    super("Método de pagamento não suportado");
    this.name = "MethodPaymentNotError";
  }
}
