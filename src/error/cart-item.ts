export class IdCartAndProductId extends Error {
  constructor() {
    super("ID do carrinho e ID do produto são obrigatórios");
    this.name = "IdCartAndProductId";
  }
}

export class QuantityProductError extends Error {
  constructor() {
    super("Quantidade deve ser maior que zero");
    this.name = "QuantityProduct";
  }
}
